export interface TopUpPayload {
  amount: number;
  credits: number;
  gateway: "STRIPE" | "BKASH" | "MOCK";
}
