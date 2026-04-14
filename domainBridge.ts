/**
 * Domain Bridge - Micro-modules Orchestrator
 * This centralizes cross-domain communication to avoid direct coupling between modules.
 * Follows a "Service Locator" or "Bridge" pattern suitable for micro-modules.
 */

import { Property, Client, Campaign, User } from './types';

export interface PropertyDomain {
    getAllProperties: () => Promise<Property[]>;
    getPropertyById: (id: string) => Promise<Property | null>;
}

export interface ClientDomain {
    getAllClients: () => Promise<Client[]>;
}

export interface CampaignDomain {
    getAllCampaigns: () => Promise<Campaign[]>;
}

export interface AuthDomain {
    getCurrentUser: () => User | null;
}

class DomainBridge {
    private static instance: DomainBridge;
    
    private properties?: PropertyDomain;
    private clients?: ClientDomain;
    private campaigns?: CampaignDomain;
    private auth?: AuthDomain;

    private constructor() {}

    public static getInstance(): DomainBridge {
        if (!DomainBridge.instance) {
            DomainBridge.instance = new DomainBridge();
        }
        return DomainBridge.instance;
    }

    // Registration methods
    public registerPropertyDomain(domain: PropertyDomain) { this.properties = domain; }
    public registerClientDomain(domain: ClientDomain) { this.clients = domain; }
    public registerCampaignDomain(domain: CampaignDomain) { this.campaigns = domain; }
    public registerAuthDomain(domain: AuthDomain) { this.auth = domain; }

    // Accessors
    public get propertiesDomain(): PropertyDomain {
        if (!this.properties) throw new Error("PropertyDomain not registered in DomainBridge");
        return this.properties;
    }

    public get clientsDomain(): ClientDomain {
        if (!this.clients) throw new Error("ClientDomain not registered in DomainBridge");
        return this.clients;
    }

    public get campaignsDomain(): CampaignDomain {
        if (!this.campaigns) throw new Error("CampaignDomain not registered in DomainBridge");
        return this.campaigns;
    }

    public get authDomain(): AuthDomain {
        if (!this.auth) throw new Error("AuthDomain not registered in DomainBridge");
        return this.auth;
    }
}

export const domainBridge = DomainBridge.getInstance();
