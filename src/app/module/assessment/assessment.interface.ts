export interface AssessmentPayload {
  title: string;
  description?: string;
  durationMinutes: number;
  passMarks: number;
  problems: Array<{ problemId: string; marks: number }>;
}
export interface InvitationPayload {
  candidateEmail: string;
}
