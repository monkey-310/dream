# Diagnostic API

## Overview

The Diagnostic API provides functionality for managing diagnostic records in the application. Each diagnostic record is associated with a user and can link to their user profile, math diagnostic exam result, and verbal diagnostic exam result.

## Schema

The `diagnostics` table has the following structure:

| Field                | Type        | Description                                                    |
| -------------------- | ----------- | -------------------------------------------------------------- |
| id                   | UUID        | Primary key                                                    |
| user_id              | UUID        | Foreign key to auth.users(id)                                  |
| user_profile_id      | UUID        | Optional foreign key to user_profiles(id)                      |
| math_diagnostic_id   | UUID        | Optional foreign key to exam_results(id) for math diagnostic   |
| verbal_diagnostic_id | UUID        | Optional foreign key to exam_results(id) for verbal diagnostic |
| created_at           | TIMESTAMPTZ | Timestamp when the record was created                          |
| updated_at           | TIMESTAMPTZ | Timestamp when the record was last updated                     |

## API

### `getDiagnosticById(id: string)`

Retrieves a diagnostic record by its ID.

### `getDiagnosticByUserId(userId: string)`

Fetches a diagnostic record for a specific user.

### `createDiagnostic(diagnostic: CreateDiagnostic)`

Creates a new diagnostic record. This function checks if a record already exists for the user and prevents duplicate entries.

### `updateDiagnostic(id: string, diagnostic: UpdateDiagnostic)`

Updates an existing diagnostic record by ID.

### `updateDiagnosticUserProfile(id: string, userProfileId: string)`

Updates only the user_profile_id field of a diagnostic record.

### `updateDiagnosticMathResult(id: string, mathDiagnosticId: string)`

Updates only the math_diagnostic_id field of a diagnostic record.

### `updateDiagnosticVerbalResult(id: string, verbalDiagnosticId: string)`

Updates only the verbal_diagnostic_id field of a diagnostic record.

### `deleteDiagnostic(id: string)`

Deletes a diagnostic record by ID.

## Security

The diagnostic records are protected by Row Level Security (RLS) policies:

- Users can only view, insert, update, and delete their own diagnostic records.
- Admins can view, insert, update, and delete any diagnostic record.

Each user can have only one diagnostic record, enforced by a unique constraint on the user_id column.
