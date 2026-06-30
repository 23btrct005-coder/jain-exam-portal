import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TenantRequest extends Request {
  tenantId?: string;
  tenantName?: string;
  tenantConfig?: {
    primaryColor: string;
    accentColor: string;
    logoUrl: string | null;
  };
}

export async function tenantScoping(req: TenantRequest, res: Response, next: NextFunction) {
  // Read tenant from subdomain or header
  // e.g. jain.assesspro.ai -> 'jain'
  let host = req.headers.host || '';
  let subdomain = '';
  
  if (host.includes('.')) {
    const parts = host.split('.');
    // If e.g. jain.assesspro.ai, subdomain is parts[0]
    if (parts.length > 2) {
      subdomain = parts[0];
    }
  }

  // Fallback to custom header for local development / testing
  const headerTenant = req.headers['x-tenant-id'] as string;
  const targetSubdomain = headerTenant || subdomain || 'jain'; // fallback to first customer "jain"

  try {
    let tenant = await prisma.tenant.findUnique({
      where: { subdomain: targetSubdomain }
    });

    // If it doesn't exist, let's create a default mock tenant for Jain Global Campus to ensure bootstrap works instantly
    if (!tenant && targetSubdomain === 'jain') {
      tenant = await prisma.tenant.create({
        data: {
          name: "JAIN Global Campus",
          subdomain: "jain",
          primaryColor: "#0D2E5C", // JAIN blue
          accentColor: "#F26E21",  // JAIN Orange
          logoUrl: "https://www.jainuniversity.ac.in/assets/images/logo.png",
          settings: {
            create: {
              allowSelfRegister: true,
              enforceProctoring: true
            }
          }
        }
      });
    }

    if (!tenant) {
      return res.status(404).json({ error: `Tenant [${targetSubdomain}] not found` });
    }

    req.tenantId = tenant.id;
    req.tenantName = tenant.name;
    req.tenantConfig = {
      primaryColor: tenant.primaryColor,
      accentColor: tenant.accentColor,
      logoUrl: tenant.logoUrl
    };

    next();
  } catch (error) {
    console.error("Multi-tenant scoping error:", error);
    res.status(500).json({ error: "Internal Server Error in multi-tenant scoping routing" });
  }
}
