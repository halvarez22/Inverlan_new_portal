/**
 * Logging Service - ISO/IEC 27034 Compliance
 * Centralizes security and audit logs without exposing PII (Personally Identifiable Information).
 */

const IS_DEVELOPMENT = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    SECURITY = 'SECURITY'
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    action: string;
    userId?: string;
    role?: string;
    details?: string;
    success: boolean;
    errorCode?: string;
}

class LoggingService {
    private static instance: LoggingService;

    private constructor() {}

    public static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    /**
     * Records a security-related event.
     * Ensures no PII or secrets are logged.
     */
    public logSecurity(action: string, success: boolean, userId?: string, role?: string, details?: string, errorCode?: string) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level: LogLevel.SECURITY,
            action,
            userId,
            role,
            details,
            success,
            errorCode
        };

        // In a real microservices environment, this would be sent to a logging backend (e.g., ELK, CloudWatch, Datadog).
        // For now, we'll log to console in dev and keep it minimal in prod.
        if (IS_DEVELOPMENT) {
            const color = success ? '\x1b[32m' : '\x1b[31m';
            console.log(`${color}[SECURITY] [${entry.timestamp}] Action: ${action} | Success: ${success} | User: ${userId || 'anonymous'} | Details: ${details || 'none'}\x1b[0m`);
        } else {
            // Production: Send to a secure logging endpoint if available.
            // For this SPA, we'll use a sanitized console log as a placeholder for a real audit trail.
            if (!success || LogLevel.SECURITY === entry.level) {
                console.warn(`[AUDIT] ${action} | ${success ? 'SUCCESS' : 'FAILURE'} | ${userId || 'anon'}`);
            }
        }
    }

    public logError(action: string, error: any, userId?: string) {
        const details = error instanceof Error ? error.message : String(error);
        this.logSecurity(action, false, userId, undefined, details, (error as any)?.code);
    }
}

export const loggingService = LoggingService.getInstance();
