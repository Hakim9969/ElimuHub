export interface IQuiz {
    id: string;
    title: string;
    description?: string;
    courseId: string;
    timeLimit?: number;
    maxAttempts?: number;
    passingScore: number;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IQuestion {
    id: string;
    quizId: string;
    type: QuestionType;
    text: string;
    options: string[];
    answer: string;
    points: number;
    order: number;
}

export interface IQuizAttempt {
    id: string;
    userId: string;
    quizId: string;
    attemptNumber: number;
    score: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
    startedAt: Date;
    submittedAt?: Date;
    status: AttemptStatus;
}

export interface IQuizResponse {
    id: string;
    attemptId: string;
    questionId: string;
    answer: string;
    isCorrect: boolean;
    pointsEarned: number;
}

export enum QuestionType {
    MCQ = 'MCQ',
    TRUE_FALSE = 'TRUE_FALSE',
    SHORT_ANSWER = 'SHORT_ANSWER'
}

export enum AttemptStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    SUBMITTED = 'SUBMITTED',
    EXPIRED = 'EXPIRED'
}