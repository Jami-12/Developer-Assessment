export interface StartAttemptPayload {
  invitationToken?: string;
  assessmentId: string;
}
export interface SubmissionPayload {
  problemId: string;
  submittedCodeOrAnswer: string;
}
export interface SubmitAttemptPayload {
  submissions: SubmissionPayload[];
}
