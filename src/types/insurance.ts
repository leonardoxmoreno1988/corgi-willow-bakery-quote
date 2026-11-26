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

/** Lucide icon keys, resolved to components in the UI layer. */
export type ScenarioIcon =
  | "footprints"
  | "coffee"
  | "store"
  | "flame"
  | "cog"
  | "zap"
  | "snowflake"
  | "thermometer-snowflake";

export interface CoverageExample {
  text: string;
  icon: ScenarioIcon;
}

export interface Coverage {
  id: string;
  name: string;
  /** Short, scannable limit, e.g. "Up to £1m" */
  limitShort: string;
  limitAmount: number;
  excess: number;
  summary: string;
  examples: CoverageExample[];
  excessExplainer: string;
}

export interface Exclusion {
  id: string;
  title: string;
  icon: ScenarioIcon;
  description: string;
}

export interface PricingModel {
  base: number;
  perEmployee: number;
}
