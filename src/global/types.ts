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
 export type ColumnDetails = null |  {
    description:string;
    copyEnabled:boolean;
    adminTemplate:AdminTemplate;
  };
// Single step in a template or user task
export interface Step {
  id:number;
  columnDetails?:ColumnDetails;
  name: string;                           // Step name or label
  description?: string;                   // Optional extra details for users
  completed: boolean;                     // For user tasks (false by default)
  timeSensitive: boolean;                 // If true, color-code by deadlines
  timeSensitiveDate: string | null;       // Actual date if applicable
  type?: "text" | "check" | "date";       // Optional step input type
  trigger?: "popup" | "relation" | "completed"; // Admin trigger type
   popup?:{description:string}
    linkedStep?:{id:number }
  info?: string;                          // Instruction, note, or email text
}
export interface ListStep {
    id?:number;
    columnId:number;
     columnDetails?:ColumnDetails;
 
    name: string;
    markedNext?: boolean;
    markedNextRed?:boolean;
    completed: boolean;
    timeSensitive: boolean;
    notes?:string;
    timeSensitiveDate: string | null;
    description: string;
    triggerType:"popup" | "relation" | "completed"
    popup?:{description:string}
    linkedStep?:{id:number,
       
      requiredThings:{description:string}[],
      futureColumnThings?:{
        needed:boolean;
        description:string;
      }[]
    }
  }
// Admin-created reusable template
export interface AdminTemplate {
  id: string;
  category: string;
  color: string;
  description: string;
  createdAt?:Date;
  updatedAt?:Date;
  timeSensitiveColors?: {
    warning: { days: number; color: string }; // Yellow at X days
    danger: { days: number; color: string };  // Red at Y days
  };
  steps: Omit<Step, "completed" | "timeSensitiveDate">[];
}
 
// User-created task line (based on admin template)
export interface TaskRow {
  id: string;
    createdAt?:Date;
  updatedAt?:Date;
    color: string;
  category: string;
  taskLineChecked: boolean;
  timeSensitiveDate: string | null;
  timeSensitiveColors: {
      warning: { days: number, color: string },
      danger: { days: number, color: string },
    },
  otherColumns: {
    columnId:number;
    name: string;
    type: "text" | "check" | "date";
    value?:string;
  }[];
  steps: ListStep[];
  statusTL: boolean;
  completed: boolean;
}

export type FlagProps = { 
  checked:boolean;
   disabled:boolean;
   onToggle: (value: boolean) => void;
  color?: string; // ✅ custom color support
};
