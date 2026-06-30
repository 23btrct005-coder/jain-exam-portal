import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cluster from 'cluster';
import os from 'os';
import { tenantScoping } from './middleware/tenant.middleware';
import { AuthController } from './controllers/auth.controller';
import { AssessmentController } from './controllers/assessment.controller';
import { AIService } from './services/ai.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

// Use Node.js clustering for scaling on production multicore engines
if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
  const numCPUs = os.cpus().length;
  console.log(`Primary server process running. Forking ${numCPUs} worker threads...`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`Worker process ${worker.process.pid} stopped. Restarting...`);
    cluster.fork();
  });
} else {
  const app = express();

  // Basic security configurations
  app.use(helmet());
  app.use(cors({
    origin: '*', // In production, replace with specific tenant subdomains wildcard
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id']
  }));
  app.use(express.json({ limit: '10mb' }));

  // Limit API requests to protect against denial of service
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000, // limit each IP to 2000 requests per window
    message: { error: "Too many requests from this client. Please try again later." }
  });
  app.use(limiter);

  // Apply tenant scoping to all API routes
  app.use(tenantScoping as express.RequestHandler);

  // Health endpoint for Kubernetes readiness/liveness probes
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', tenant: (req as any).tenantName, timestamp: new Date() });
  });

  // Prometheus Metrics scraping mock endpoint
  app.get('/metrics', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(`
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",handler="/health",status="200"} 412
http_requests_total{method="POST",handler="/api/compiler/run",status="200"} 98
# HELP node_memory_usage_bytes Node process memory usage
# TYPE node_memory_usage_bytes gauge
node_memory_usage_bytes{type="heapTotal"} ${process.memoryUsage().heapTotal}
node_memory_usage_bytes{type="heapUsed"} ${process.memoryUsage().heapUsed}
    `);
  });

  // Auth Routes
  app.post('/api/auth/register', AuthController.register as express.RequestHandler);
  app.post('/api/auth/login', AuthController.login as express.RequestHandler);
  app.post('/api/auth/bulk-import', AuthController.bulkUploadStudents as express.RequestHandler);

  // Assessment Routes
  app.get('/api/exams', AssessmentController.listExams as express.RequestHandler);
  app.post('/api/exams', AssessmentController.createExam as express.RequestHandler);
  app.post('/api/compiler/run', AssessmentController.compileAndRunCode as express.RequestHandler);
  app.post('/api/assessment/subjective-submit', AssessmentController.submitSubjectiveAnswer as express.RequestHandler);

  // AI Assistant Routes
  app.post('/api/ai/generate-question', async (req, res) => {
    const { type, topic } = req.body;
    try {
      const question = await AIService.generateQuestion(type, topic);
      return res.status(200).json(question);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/ai/analyze-resume', async (req, res) => {
    const { name, content } = req.body;
    try {
      const scoreResult = await AIService.analyzeResume(name, content);
      return res.status(200).json(scoreResult);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Analytics Metrics Route
  app.get('/api/analytics/dashboard', async (req, res) => {
    // Return cumulative readiness metrics for colleges
    return res.status(200).json({
      placementReadinessRate: 78.4,
      totalStudents: 1420,
      activeTestTakers: 312,
      branchPerformance: [
        { branch: "Computer Science", readiness: 85, coding: 88, aptitude: 82, communication: 84 },
        { branch: "Information Technology", readiness: 81, coding: 82, aptitude: 79, communication: 82 },
        { branch: "Electronics & Communication", readiness: 74, coding: 68, aptitude: 76, communication: 78 },
        { branch: "Mechanical Engineering", readiness: 62, coding: 45, aptitude: 68, communication: 73 }
      ],
      companyReadiness: [
        { company: "TCS", readyStudents: 910 },
        { company: "Accenture", readyStudents: 820 },
        { company: "Infosys", readyStudents: 780 },
        { company: "Google", readyStudents: 145 },
        { company: "Deloitte", readyStudents: 540 }
      ]
    });
  });

  app.listen(PORT, () => {
    console.log(`AssessPro worker thread pid ${process.pid} listening on port ${PORT}`);
  });
}
