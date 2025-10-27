export type StepKey =
  | "step1"
  | "step2"
  | "step3"
  | "step4"
  | "step5"
  | "step6"
  | "step7"
  | "step8"
  | "step9"
  | "step10";

export interface StepRecord {
  [key: string]: boolean;
}
export type FixedColumnKey = "category" | "vehicle" | "customer";

export interface TaskRow {
  id: string;
  category: string;
  vehicle: string;
  customer: string;
  date1: string;
  date2: string;
  timeSensitiveDate: string;
  steps: Record<StepKey, boolean>;
  statusTL: boolean;
  completed: boolean;
}
export type FinalColumnKey = "statusTL" | "completed";

export const sampleData = [
  {
    id: "1",
    category: "CALIBER-AARONA",
    vehicle: "2022 Dodge Ram",
    customer: "Cordeno",
    date1: "2025-10-05",
    date2: "2025-10-12",
    timeSensitiveDate: "2025-11-01", // will color based on days remaining
    steps: {
      step1: true,
      step2: false,
      step3: true,
      step4: false,
      step5: false,
      step6: true,
      step7: false,
      step8: false,
      step9: false,
      step10: false,
    },
    statusTL: false,
    completed: false,
  },
  {
    id: "2",
    category: "CATEGORY 2",
    vehicle: "2018 Ford F-150",
    customer: "Michael",
    date1: "2025-09-20",
    date2: "2025-10-10",
    timeSensitiveDate: "2025-10-29",
    steps: {
      step1: true,
      step2: true,
      step3: true,
      step4: false,
      step5: false,
      step6: false,
      step7: false,
      step8: false,
      step9: false,
      step10: false,
    },
    statusTL: false,
    completed: true,
  },
  {
    id: "3",
    category: "CATEGORY 3",
    vehicle: "2020 Toyota Camry",
    customer: "Ayesha",
    date1: "2025-10-01",
    date2: "2025-10-08",
    timeSensitiveDate: "2025-10-25",
    steps: {
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: true,
      step6: true,
      step7: false,
      step8: false,
      step9: false,
      step10: false,
    },
    statusTL: false,
    completed: false,
  },
];

export const fixedColumns: FixedColumnKey[] = ["category", "vehicle", "customer"];

// We'll keep the two normal dates + one time-sensitive date as a small fixed date block
export const dateColumns = ["date1", "date2", "timeSensitiveDate"];

// G2 naming (Group A/B/C) with 3-4-3 distribution
export const columnGroups = [
  { title: "Group A", columns: ["step1", "step2", "step3"] },
  { title: "Group B", columns: ["step4", "step5", "step6", "step7"] },
  { title: "Group C", columns: ["step8", "step9", "step10"] },
];

export const finalColumns = ["statusTL", "completed"];