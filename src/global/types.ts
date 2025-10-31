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
  | "step10" |
  "step12"
  | "step11";

 
export type FixedColumnKey = "category" | "vehicle" | "date1";

 
export type FinalColumnKey = "statusTL" | "completed";
 
// Single step in a template or user task
export interface Step {
  name: string;                           // Step name or label
  description?: string;                   // Optional extra details for users
  completed: boolean;                     // For user tasks (false by default)
  timeSensitive: boolean;                 // If true, color-code by deadlines
  timeSensitiveDate: string | null;       // Actual date if applicable
  type?: "text" | "check" | "date";       // Optional step input type
  trigger?: "none" | "informative" | "popup" | "confirmation" | "reminder"; // Admin trigger type
  info?: string;                          // Instruction, note, or email text
}

// Admin-created reusable template
export interface AdminTemplate {
  id: string;
  category: string;
  color: string;
  description: string;
  timeSensitiveColors?: {
    warning: { days: number; color: string }; // Yellow at X days
    danger: { days: number; color: string };  // Red at Y days
  };
  steps: Omit<Step, "completed" | "timeSensitiveDate">[];
}

// User-created task line (based on admin template)
export interface TaskRow {
  id: string;
  category: string;
  taskLineChecked: boolean;
  timeSensitiveDate: string | null;
  timeSensitiveColors: {
      warning: { days: number, color: string },
      danger: { days: number, color: string },
    },
  otherColumns: {
    name: string;
    type: "text" | "check" | "date";
    value?:string;
  }[];
  steps: {
    name: string;
    completed: boolean;
    timeSensitive: boolean;
    timeSensitiveDate: string | null;
    description: string;
  }[];
  statusTL: boolean;
  completed: boolean;
}

