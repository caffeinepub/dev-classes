import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Answer = bigint;
export type TopicId = bigint;
export interface Quiz {
    id: QuizId;
    title: string;
    questions: Array<QuestionData>;
    topicId: TopicId;
}
export type QuestionId = bigint;
export interface TopicData {
    id: TopicId;
    name: string;
}
export interface QuestionData {
    id: QuestionId;
    text: string;
    correctAnswerIndex: bigint;
    options: Array<string>;
}
export interface Attempt {
    answers: Array<Answer>;
    user: Principal;
    score: bigint;
    quizId: QuizId;
}
export interface UserProfile {
    name: string;
    role: string;
}
export type QuizId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addQuestionToQuiz(quizId: QuizId, text: string, options: Array<string>, correctAnswerIndex: bigint): Promise<QuestionId>;
    addTopic(name: string): Promise<TopicId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createQuiz(title: string, topicId: TopicId): Promise<QuizId>;
    getAllTopics(): Promise<Array<TopicData>>;
    getAttemptsByQuiz(quizId: QuizId): Promise<Array<Attempt>>;
    getCallerAttemptsByQuiz(quizId: QuizId): Promise<Array<Attempt>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getQuiz(id: QuizId): Promise<Quiz | null>;
    getQuizzesByTopic(topicId: TopicId): Promise<Array<Quiz>>;
    getTopic(id: TopicId): Promise<TopicData | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitAttempt(quizId: QuizId, answers: Array<bigint>): Promise<bigint>;
}
