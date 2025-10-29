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

export interface Step {
  description:string;
  name: StepKey;
  completed: boolean;
  timeSensitive: boolean;
  timeSensitiveDate: string | null;
}

export type FixedColumnKey = "category" | "vehicle" | "date1";

export interface TaskRow {
  id: string;
  category: string;
  vehicle: string;
  customer: string;
  date1: string;
  date2: string;
    taskLineChecked:boolean;

  timeSensitiveDate: string;
  steps: Step[]; // 👈 changed from Record<StepKey, boolean> to Step[]
  statusTL: boolean;
  completed: boolean;
}

export type FinalColumnKey = "statusTL" | "completed";

export const sampleData: TaskRow[] = [
  {
    id: "1",
    category: "CALIBER-AARONA",
    vehicle: "2022 Dodge Ram",
    customer: "Cordeno",
    date1: "2025-10-05",
    date2: "2025-10-12",
    taskLineChecked:false,
    timeSensitiveDate: "2025-11-01",
    steps: [
      { name: "step1", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Verify customer details and vehicle information." },
      { name: "step2", completed: false, timeSensitive: true, timeSensitiveDate: "2025-11-03", description: "Schedule inspection before due date." },
      { name: "step3", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Prepare service documentation." },
      { name: "step4", completed: true, timeSensitive: true, timeSensitiveDate: "2025-11-05", description: "Perform engine diagnostic and log results." },
      { name: "step5", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Awaiting supervisor approval for next phase." },
      { name: "step6", completed: true, timeSensitive: true, timeSensitiveDate: "2025-11-05", description: "Finalize calibration and update report." },
      { name: "step7", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Pending quality assurance check." },
      { name: "step8", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Awaiting delivery slot confirmation." },
      { name: "step9", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Review financial charges for client." },
      { name: "step10", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Confirm shipment documentation." },
      { name: "step11", completed: true, timeSensitive: true, timeSensitiveDate: "2025-11-05", description: "Complete client satisfaction survey." },
      { name: "step12", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Finalize case and archive report." }
    ],
    statusTL: false,
    completed: false,
  },
  {
    id: "2",
    category: "CATEGORY 2",
    vehicle: "2018 Ford F-150",
    customer: "Michael",
    taskLineChecked:false,

    date1: "2025-09-20",
    date2: "2025-10-10",
    timeSensitiveDate: "2025-10-29",
    steps: [
      { name: "step1", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Collect initial service request from client." },
      { name: "step2", completed: true, timeSensitive: true, timeSensitiveDate: "2025-10-28", description: "Ensure critical maintenance is done before due date." },
      { name: "step3", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Review safety checklist." },
      { name: "step4", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Pending technician assignment." },
      { name: "step5", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Awaiting parts delivery from supplier." },
      { name: "step6", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Inspect and verify part compatibility." },
      { name: "step7", completed: true, timeSensitive: true, timeSensitiveDate: "2025-11-05", description: "Submit final service report to QA team." },
      { name: "step8", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Pending billing verification." },
      { name: "step9", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Collect payment confirmation." },
      { name: "step10", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Notify customer of service completion." },
    ],
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
    taskLineChecked:false,

    timeSensitiveDate: "2025-10-25",
    steps: [
      { name: "step1", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Initial intake pending confirmation." },
      { name: "step2", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Verify part availability and order if needed." },
      { name: "step3", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Prepare workshop bay for vehicle inspection." },
      { name: "step4", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Awaiting mechanic assignment." },
      { name: "step5", completed: true, timeSensitive: true, timeSensitiveDate: "2025-10-24", description: "Conduct emission testing and report results." },
      { name: "step6", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Approve final maintenance checklist." },
      { name: "step7", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Schedule customer follow-up." },
      { name: "step8", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Invoice preparation in progress." },
      { name: "step9", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Awaiting internal review approval." },
      { name: "step10", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Finalize and close the work order." },
    ],
    statusTL: false,
    completed: false,
  },
];

export const fixedColumns: FixedColumnKey[] = ["category", "vehicle", "date1"];

export const dateColumns = ["date1", "date2", "timeSensitiveDate"];

export const columnGroups = [
  { title: "Group A", columns: ["step1", "step2", "step3"] },
  { title: "Group B", columns: ["step4", "step5", "step6", "step7"] },
  { title: "Group C", columns: ["step8", "step9", "step10"] },
];

export const finalColumns = ["completed"];
