# Specification

## Summary
**Goal:** Build the “Dev Classes” topic-wise quiz app with Teacher and Student flows, Internet Identity login, and core quiz creation/taking features with persistent storage.

**Planned changes:**
- Create core app structure, branding (“Dev Classes”), and navigation with clear entry points for Teacher and Student journeys.
- Add Internet Identity sign-in/sign-out and a simple role model (Teacher vs Student) with teacher-only access enforced in UI and backend.
- Implement backend persistent models and CRUD APIs for Topics, Quizzes (by Topic), Questions, and multiple-choice options (single correct answer).
- Build Teacher UI to create/manage Topics, create Quizzes under Topics, and add/edit/delete Questions with validation (2–6 options, exactly one correct).
- Build Student UI to browse Topics/Quizzes, take a quiz, submit answers, and view results (score + per-question correctness review).
- Store quiz Attempts per student principal; add APIs for students to view their own attempts and teachers to view attempts per quiz.
- Apply a consistent “Dev Classes” visual theme across pages (English UI text; avoid blue/purple-dominant palette).
- Add generated static images under `frontend/public/assets/generated` and reference them directly in the UI.

**User-visible outcome:** Users can sign in with Internet Identity, choose Teacher or Student flow, teachers can create topic-wise quizzes with multiple-choice questions, students can take quizzes and see scores/reviews, and both can view attempt history (students: own; teachers: quiz attempts).
