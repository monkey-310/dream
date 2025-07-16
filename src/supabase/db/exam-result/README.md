# Exam Result API

This module provides an abstraction for working with exam results in the database.

## Schema

The `exam_results` table has the following structure:

- `id` (UUID): Primary key, auto-generated
- `user_id` (UUID): Foreign key to auth.users(id)
- `exam_id` (UUID): Foreign key to exams(id)
- `result` (JSONB): JSON object containing the exam result data
  - `score` (number): The overall score
  - `total_questions` (number): The total number of questions
  - `correct_answers` (number): The number of correct answers
  - `incorrect_answers` (number): The number of incorrect answers
  - `skipped_questions` (number): The number of skipped questions
  - `time_spent_seconds` (number, optional): The total time spent in seconds
  - `question_results` (array, optional): Detailed results for each question
    - `question_id` (string): The ID of the question
    - `user_answer` (string, optional): The user's answer
    - `is_correct` (boolean, optional): Whether the answer was correct
    - `time_spent_seconds` (number, optional): Time spent on this question
  - `sections` (array, optional): Results broken down by section
    - `name` (string): The name of the section
    - `score` (number): The score for this section
    - `total_questions` (number): The total questions in this section
    - `correct_answers` (number): The correct answers in this section
  - `completed_at` (string, optional): When the exam was completed
  - `percentile` (number, optional): The user's percentile rank
- `result_link` (string, optional): URL to a detailed result page
- `created_at` (TIMESTAMPTZ): Auto-generated timestamp
- `updated_at` (TIMESTAMPTZ): Auto-updated timestamp

## API

### Get an exam result by ID

```typescript
import { SupabaseApi } from "@/supabase/SupabaseApi";

const { data, error } = await SupabaseApi.getExamResultById("result-uuid");

if (error) {
  console.error("Error getting exam result:", error);
} else {
  console.log("Exam result:", data);
}
```

### Get exam results by user ID

```typescript
import { SupabaseApi } from "@/supabase/SupabaseApi";

const { data, error } = await SupabaseApi.getExamResultsByUserId(
  "user-uuid",
  10 // limit (optional, default: 10)
);

if (error) {
  console.error("Error getting exam results:", error);
} else {
  console.log("Exam results:", data);
}
```

### Get exam results by exam ID

```typescript
import { SupabaseApi } from "@/supabase/SupabaseApi";

const { data, error } = await SupabaseApi.getExamResultsByExamId(
  "exam-uuid",
  10 // limit (optional, default: 10)
);

if (error) {
  console.error("Error getting exam results:", error);
} else {
  console.log("Exam results:", data);
}
```

### Create a new exam result

```typescript
import { SupabaseApi } from "@/supabase/SupabaseApi";

const { data, error } = await SupabaseApi.createExamResult({
  user_id: "user-uuid",
  exam_id: "exam-uuid",
  result: {
    score: 85,
    total_questions: 100,
    correct_answers: 85,
    incorrect_answers: 15,
    skipped_questions: 0,
    time_spent_seconds: 3600,
    completed_at: new Date().toISOString(),
    question_results: [
      {
        question_id: "question-uuid-1",
        user_answer: "B",
        is_correct: true,
        time_spent_seconds: 45,
      },
      // ... more question results
    ],
    sections: [
      {
        name: "Algebra",
        score: 90,
        total_questions: 50,
        correct_answers: 45,
      },
      // ... more sections
    ],
  },
  result_link: "https://example.com/results/12345",
});

if (error) {
  console.error("Error creating exam result:", error);
} else {
  console.log("Created exam result:", data);
}
```

### Update an exam result

```typescript
import { SupabaseApi } from "@/supabase/SupabaseApi";

const { data, error } = await SupabaseApi.updateExamResult("result-uuid", {
  result: {
    score: 90,
    correct_answers: 90,
    incorrect_answers: 10,
  },
  result_link: "https://example.com/results/12345-updated",
});

if (error) {
  console.error("Error updating exam result:", error);
} else {
  console.log("Updated exam result:", data);
}
```

### Update only the result field

```typescript
import { SupabaseApi } from "@/supabase/SupabaseApi";

const { data, error } = await SupabaseApi.updateExamResultData("result-uuid", {
  score: 95,
  correct_answers: 95,
  incorrect_answers: 5,
  percentile: 98,
});

if (error) {
  console.error("Error updating exam result data:", error);
} else {
  console.log("Updated exam result:", data);
}
```

### Delete an exam result

```typescript
import { SupabaseApi } from "@/supabase/SupabaseApi";

const { success, error } = await SupabaseApi.deleteExamResult("result-uuid");

if (error) {
  console.error("Error deleting exam result:", error);
} else {
  console.log("Exam result deleted successfully");
}
```

## Security

The `exam_results` table has Row Level Security (RLS) policies that:

1. Allow users to view, insert, update, and delete only their own results
2. Allow admins to view, insert, update, and delete any results

This ensures that users can only access their own exam results, while administrators can manage all results.
