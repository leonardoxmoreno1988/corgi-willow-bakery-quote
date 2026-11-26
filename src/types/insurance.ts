export type ClaimsHistory = "None" | "1 claim" | "2 or more claims";

export interface QuestionnaireAnswers {
  businessName: string;
  trade: string;
  location: string;
  annualTurnover: number;
  employees: number;
  equipmentValue: number;
  claimsLast3Years: ClaimsHistory;
}

export interface BusinessProfile {
  name: string;
  descriptor: string;
  location: string;
}

export type CoverageIcon = "shield" | "wrench";

export interface Coverage {
  id: string;
  name: string;
  icon: CoverageIcon;
  /** Short, scannable limit, e.g. "Up to £1m" */
  limitShort: string;
  limitAmount: number;
  excess: number;
  summary: string;
  examples: string[];
  excessExplainer: string;
}

export interface Exclusion {
  id: string;
  title: string;
  description: string;
}

export interface PricingModel {
  base: number;
  perEmployee: number;
}
