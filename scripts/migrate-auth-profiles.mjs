/**
 * Migracion auth <-> perfiles Firestore (usuarios de personal).
 *
 * Requisitos:
 * - Variable GOOGLE_APPLICATION_CREDENTIALS apuntando al JSON de cuenta de servicio, o
 * - Variable FIREBASE_SERVICE_ACCOUNT_JSON con el JSON completo (una linea escapada).
 *
 * Ejecutar desde la raiz del repo:
 *   node scripts/migrate-auth-profiles.mjs
 *   node scripts/migrate-auth-profiles.mjs --dry-run
 *
 * Acciones:
 * - Lista usuarios de Firebase Auth (email/contrasena).
 * - Para cada documento en `users` con email, si falta authUid o difiere, actualiza authUid.
 * - Normaliza email a minusculas en el documento si hace falta.
 * - Imprime IDs de documentos sin email (revision manual: anadir correo en consola o en app).
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import admin from 'firebase-admin';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dryRun = process.argv.includes('--dry-run');

function initAdmin() {
    if (admin.apps.length) {
        return;
    }
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const json = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        admin.initializeApp({ credential: admin.credential.cert(json) });
        return;
    }
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credPath) {
        const resolved = credPath.includes('/') || credPath.includes('\\') ? credPath : join(process.cwd(), credPath);
        const json = JSON.parse(readFileSync(resolved, 'utf8'));
        admin.initializeApp({ credential: admin.credential.cert(json) });
        return;
    }
    try {
        admin.initializeApp({ credential: admin.credential.applicationDefault() });
    } catch {
        console.error(
            'Configura GOOGLE_APPLICATION_CREDENTIALS o FIREBASE_SERVICE_ACCOUNT_JSON para usar este script.'
        );
        process.exit(1);
    }
}

async function listAllAuthUsers() {
    const auth = admin.auth();
    const byEmail = new Map();
    let nextPageToken;
    do {
        const res = await auth.listUsers(1000, nextPageToken);
        for (const u of res.users) {
            if (u.email) {
                byEmail.set(u.email.toLowerCase(), u.uid);
            }
        }
        nextPageToken = res.pageToken;
    } while (nextPageToken);
    return byEmail;
}

async function main() {
    initAdmin();
    const db = admin.firestore();
    const authByEmail = await listAllAuthUsers();

    const snap = await db.collection('users').get();
    let updated = 0;
    const missingEmail = [];

    for (const doc of snap.docs) {
        const data = doc.data();
        const id = doc.id;
        const emailRaw = data.email;
        if (!emailRaw || String(emailRaw).trim() === '') {
            missingEmail.push({ id, username: data.username });
            continue;
        }
        const email = String(emailRaw).trim().toLowerCase();
        const uidFromAuth = authByEmail.get(email);
        if (!uidFromAuth) {
            console.warn(`[sin match Auth] doc=${id} email=${email}`);
            continue;
        }

        const patch = {};
        if (data.email !== email) {
            patch.email = email;
        }
        if (!data.authUid || data.authUid !== uidFromAuth) {
            patch.authUid = uidFromAuth;
        }

        if (Object.keys(patch).length === 0) {
            continue;
        }

        if (dryRun) {
            console.log(`[dry-run] ${id} actualizaria:`, patch);
        } else {
            await doc.ref.update({ ...patch, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
        }
        updated += 1;
    }

    console.log(dryRun ? `Dry-run terminado. Cambios propuestos: ${updated}` : `Documentos actualizados: ${updated}`);
    if (missingEmail.length) {
        console.log('Documentos sin email en Firestore (requieren correccion manual):');
        for (const m of missingEmail) {
            console.log(`  - id=${m.id} username=${m.username ?? '?'}`);
        }
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
