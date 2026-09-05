export interface AuditPayload {
  action: string;
  userId?: string;
  details: Record<string, unknown>;
}
