import type {
  BusinessProfile,
  ClaimsHistory,
  Coverage,
  Exclusion,
  PricingModel,
  QuestionnaireAnswers,
} from "../types/insurance";
import { formatCurrency } from "../utils/formatters";

export const business: BusinessProfile = {
  name: "Willow Bakery",
  descriptor: "Retail Bakery & Café",
  location: "Shoreditch, London",
};

export const ORIGINAL_ANSWERS: QuestionnaireAnswers = {
  businessName: "Willow Bakery",
  trade: "Bakery & Patisserie",
  location: business.location,
  annualTurnover: 240_000,
  employees: 2,
  equipmentValue: 15_000,
  claimsLast3Years: "None",
};

export const CLAIMS_OPTIONS: ClaimsHistory[] = ["None", "1 claim", "2 or more claims"];

/** £48 + £8.50 per employee → 2 staff = £65, 4 staff = £82 */
export const PRICING: PricingModel = { base: 48, perEmployee: 8.5 };

export const MIN_EMPLOYEES = 1;
export const MAX_EMPLOYEES = 50;

/** Equipment value the brief's quote is priced at; deviating from it nudges the price. */
export const BASELINE_EQUIPMENT_VALUE = 15_000;
export const MIN_EQUIPMENT_VALUE = 1_000;
export const MAX_EQUIPMENT_VALUE = 250_000;
/** £2/month for every £5,000 of equipment value above or below the baseline. */
const EQUIPMENT_STEP = 5_000;
const EQUIPMENT_STEP_PRICE = 2;

export function calculateMonthlyPrice(
  employees: number,
  equipmentValue: number = BASELINE_EQUIPMENT_VALUE,
): number {
  const equipmentAdjustment = Math.round(
    ((equipmentValue - BASELINE_EQUIPMENT_VALUE) / EQUIPMENT_STEP) * EQUIPMENT_STEP_PRICE,
  );
  return Math.max(
    1,
    Math.round(PRICING.base + PRICING.perEmployee * employees + equipmentAdjustment),
  );
}

export function priceFor(answers: QuestionnaireAnswers): number {
  return calculateMonthlyPrice(answers.employees, answers.equipmentValue);
}

/** Plain-English reason for a price move between two sets of answers. */
export function priceChangeReason(from: QuestionnaireAnswers, to: QuestionnaireAnswers): string {
  const teamChanged = from.employees !== to.employees;
  const kitChanged = from.equipmentValue !== to.equipmentValue;
  const parts: string[] = [];
  if (teamChanged) parts.push(`public liability adjusts for ${pluralEmployees(to.employees)}`);
  if (kitChanged) parts.push(`equipment cover moves to ${formatCurrency(to.equipmentValue)}`);
  const text = parts.join(" and ");
  const was = `was ${formatCurrency(priceFor(from))}/month${teamChanged ? ` for ${from.employees}` : ""}`;
  return `${text.charAt(0).toUpperCase()}${text.slice(1)} (${was})`;
}

/** £1,000,000 → "£1m", £15,000 → "£15k" */
export function formatCompact(amount: number): string {
  if (amount >= 1_000_000) return `£${amount / 1_000_000}m`;
  if (amount >= 1_000) return `£${Math.round((amount / 1_000) * 10) / 10}k`;
  return formatCurrency(amount);
}

export function pluralEmployees(count: number): string {
  return `${count} ${count === 1 ? "employee" : "employees"}`;
}

const baseCoverages: Coverage[] = [
  {
    id: "public-liability",
    name: "Public Liability",
    limitShort: "Up to £1m",
    limitAmount: 1_000_000,
    excess: 0,
    summary:
      "Protects you if a customer or passer-by is hurt, or their property is damaged, because of your business.",
    examples: [
      { text: "A customer slips on a wet floor by the counter", icon: "footprints" },
      { text: "A hot drink is spilled on someone in your café", icon: "coffee" },
      { text: "A delivery trolley damages a neighbour's shopfront", icon: "store" },
    ],
    excessExplainer: "No excess. You pay nothing towards an approved claim.",
  },
  {
    id: "business-equipment",
    name: "Business Equipment Cover",
    limitShort: "Up to £15,000",
    limitAmount: 15_000,
    excess: 250,
    summary:
      "Pays to repair or replace the kit your bakery can't run without if it's accidentally damaged, fire-damaged, or stolen.",
    examples: [
      { text: "Ovens and proofers", icon: "flame" },
      { text: "Commercial mixers", icon: "cog" },
      { text: "Espresso machines", icon: "zap" },
      { text: "Display fridges", icon: "snowflake" },
    ],
    excessExplainer:
      "You pay the first £250 of an approved equipment claim; Corgi covers the rest up to £15,000.",
  },
];

/** Coverage list with the equipment limit following the customer's replacement value. */
export function getCoverages(equipmentValue: number): Coverage[] {
  return baseCoverages.map((c) =>
    c.id === "business-equipment"
      ? {
          ...c,
          limitAmount: equipmentValue,
          limitShort: `Up to ${formatCurrency(equipmentValue)}`,
          excessExplainer: `You pay the first £250 of an approved equipment claim; Corgi covers the rest up to ${formatCurrency(equipmentValue)}.`,
        }
      : c,
  );
}

export const exclusions: Exclusion[] = [
  {
    id: "stock-spoilage",
    title: "Stock Spoilage",
    description:
      "Ingredients, dough, or baked goods ruined by power cuts, equipment breakdown, or temperature changes are not covered.",
    examples: [
      { text: "Power cuts or utility outages", icon: "zap-off" },
      { text: "Fridge or freezer temperature failure", icon: "thermometer-snowflake" },
    ],
  },
];

export const POLICY_REFERENCE = "CRG-8492";
