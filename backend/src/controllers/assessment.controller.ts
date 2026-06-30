import { Response } from 'express';
import { PrismaClient, ExamStatus } from '@prisma/client';
import { TenantRequest } from '../middleware/tenant.middleware';
import { AIService } from '../services/ai.service';

const prisma = new PrismaClient();

export class AssessmentController {
  
  static async listExams(req: TenantRequest, res: Response) {
    const tenantId = req.tenantId!;
    try {
      const exams = await prisma.exam.findMany({
        where: { tenantId },
        include: { sections: true }
      });
      return res.status(200).json(exams);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async createExam(req: TenantRequest, res: Response) {
    const tenantId = req.tenantId!;
    const { title, description, durationMinutes, sections, passingScore, negativeMarking, isProctored } = req.body;

    try {
      const exam = await prisma.exam.create({
        data: {
          tenantId,
          title,
          description,
          durationMinutes,
          passingScore,
          negativeMarking,
          isProctored,
          sections: {
            create: sections.map((sec: any) => ({
              name: sec.name,
              weight: sec.weight
            }))
          }
        },
        include: { sections: true }
      });
      return res.status(201).json(exam);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async compileAndRunCode(req: TenantRequest, res: Response) {
    const { code, language, questionId } = req.body;
    const userId = (req as any).user?.userId || "guest-student";

    if (!code || !language) {
      return res.status(400).json({ error: "Code and language are required" });
    }

    try {
      // Simulate compiling with random runtime / memory metrics
      const isAccepted = Math.random() > 0.15;
      const status = isAccepted ? "ACCEPTED" : "WRONG_ANSWER";
      const runtimeMs = Math.floor(Math.random() * 120) + 10;
      const memoryKb = Math.floor(Math.random() * 4000) + 1200;

      const submission = await prisma.codeSubmission.create({
        data: {
          studentId: userId === "guest-student" ? await getFirstStudentId() : userId,
          questionId: questionId || "mock-q-id",
          code,
          language,
          status,
          runtimeMs,
          memoryKb
        }
      });

      const aiReview = await AIService.evaluateCode(code, language, "Reverse Linked List");

      return res.status(200).json({
        submissionId: submission.id,
        status: submission.status,
        runtimeMs: submission.runtimeMs,
        memoryKb: submission.memoryKb,
        testCases: [
          { passed: true, input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]", actual: "[5,4,3,2,1]" },
          { passed: isAccepted, input: "[1,2]", expected: "[2,1]", actual: isAccepted ? "[2,1]" : "[]" }
        ],
        aiFeedback: aiReview
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async submitSubjectiveAnswer(req: TenantRequest, res: Response) {
    const { answerText, questionId, studentExamId } = req.body;

    try {
      // Call AI to auto-evaluate subjective answer
      const feedback = await AIService.coachMockInterview(questionId, answerText);
      
      const earned = Math.floor((feedback.technicalAccuracy / 100) * 10); // scale out of 10 points

      const answer = await prisma.studentAnswer.create({
        data: {
          studentExamId,
          questionId,
          textAnswer: answerText,
          pointsEarned: earned,
          aiFeedback: JSON.stringify(feedback)
        }
      });

      return res.status(200).json({
        answerId: answer.id,
        pointsEarned: answer.pointsEarned,
        aiFeedback: feedback
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

async function getFirstStudentId() {
  const student = await prisma.user.findFirst({
    where: { role: "STUDENT" }
  });
  if (student) return student.id;
  
  // create dummy student if none exists
  const dummy = await prisma.user.create({
    data: {
      tenantId: (await prisma.tenant.findFirst())?.id || "mock-tenant",
      email: "student@jain.edu",
      passwordHash: "dummy",
      firstName: "Test",
      lastName: "Student",
      role: "STUDENT"
    }
  });
  return dummy.id;
}
