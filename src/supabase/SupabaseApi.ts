import { AuthApi } from "./api/AuthApi";
import * as UserProfileApi from "./db/user-profile";
import * as SatQuestionsApi from "./db/sat-questions";
import * as ExamApi from "./db/exam";
import * as ExamResultApi from "./db/exam-result";
import * as DiagnosticApi from "./db/diagnostic";

export const SupabaseApi = {
  ...AuthApi,
  ...UserProfileApi,
  ...SatQuestionsApi,
  ...ExamApi,
  ...ExamResultApi,
  ...DiagnosticApi,
};
