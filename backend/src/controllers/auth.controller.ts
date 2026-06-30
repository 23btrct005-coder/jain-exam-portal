import { Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TenantRequest } from '../middleware/tenant.middleware';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'assesspro_super_secret_key';

export class AuthController {
  
  static async register(req: TenantRequest, res: Response) {
    const { email, password, firstName, lastName, role, batch, deptName } = req.body;
    const tenantId = req.tenantId!;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      
      let deptId: string | undefined;
      if (deptName) {
        let dept = await prisma.department.findFirst({
          where: { tenantId, name: deptName }
        });
        if (!dept) {
          dept = await prisma.department.create({
            data: { tenantId, name: deptName, code: deptName.substring(0, 3).toUpperCase() }
          });
        }
        deptId = dept.id;
      }

      const newUser = await prisma.user.create({
        data: {
          tenantId,
          email,
          passwordHash,
          firstName,
          lastName,
          role: role as Role || Role.STUDENT,
          batch,
          deptId
        }
      });

      // Initialize Placement readiness score for Student
      if (newUser.role === Role.STUDENT) {
        await prisma.placementReadiness.create({
          data: {
            studentId: newUser.id,
            overallScore: 60,
            codingScore: 50,
            aptitudeScore: 65,
            commScore: 70,
            interviewScore: 55,
            recommendations: ["Complete initial diagnostic coding assessment", "Enhance verbal aptitude foundation"]
          }
        });
      }

      return res.status(201).json({ message: "Registration successful", userId: newUser.id });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Registration failed" });
    }
  }

  static async login(req: TenantRequest, res: Response) {
    const { email, password } = req.body;
    const tenantId = req.tenantId!;

    try {
      const user = await prisma.user.findFirst({
        where: { email, tenantId }
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role, tenantId: user.tenantId },
        JWT_SECRET,
        { expiresIn: '12h' }
      );

      // Create audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "USER_LOGIN",
          ipAddress: req.ip || "127.0.0.1",
          details: `Successful login for user role ${user.role}`
        }
      });

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          tenantId: user.tenantId,
          tenantName: req.tenantName,
          tenantConfig: req.tenantConfig
        }
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Login failed" });
    }
  }

  static async bulkUploadStudents(req: TenantRequest, res: Response) {
    // Mock parsing CSV/Excel upload and creating users
    const { students } = req.body; // Expecting array of {email, password, firstName, lastName, batch}
    const tenantId = req.tenantId!;

    if (!Array.isArray(students)) {
      return res.status(400).json({ error: "Invalid payload, array of students expected." });
    }

    try {
      const createdCount = [];
      for (const st of students) {
        const hash = await bcrypt.hash(st.password || "assesspro2026", 10);
        const newUser = await prisma.user.create({
          data: {
            tenantId,
            email: st.email,
            passwordHash: hash,
            firstName: st.firstName,
            lastName: st.lastName,
            role: Role.STUDENT,
            batch: st.batch || "2026 Batch"
          }
        });

        await prisma.placementReadiness.create({
          data: {
            studentId: newUser.id,
            overallScore: 65,
            codingScore: 60,
            aptitudeScore: 70,
            commScore: 65,
            interviewScore: 60,
            recommendations: ["Attend daily aptitude modules", "Submit 2 Javascript programming assignments"]
          }
        });

        createdCount.push(newUser.id);
      }

      return res.status(200).json({ message: `Successfully imported ${createdCount.length} students` });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Bulk import failed" });
    }
  }
}
