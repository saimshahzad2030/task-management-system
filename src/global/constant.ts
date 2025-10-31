import { AdminTemplate, FixedColumnKey, TaskRow } from "./types";

export const sampleData: TaskRow[] = [
  {
    id: "1",
    category: "CALIBER-AARONA",
    taskLineChecked: false,
    timeSensitiveDate: null,
timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },
    // 🆕 Replaces vehicle, customer, date1, date2
    otherColumns: [
      { name: "Customer Name", type: "text" }, 
      { name: "Inspection Date", type: "date" },
    ],

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
      { name: "step12", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Finalize case and archive report." },
    ],
    statusTL: false,
    completed: false,
  },
  {
    id: "2",
    category: "CATEGORY 2",
    taskLineChecked: false,
      timeSensitiveDate: null,


    otherColumns: [
      { name: "Customer Name", type: "text" }, 
      { name: "Maintenance Date", type: "date" },
    ],
timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },
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
    taskLineChecked: false,
    timeSensitiveDate: null,


    otherColumns: [
      { name: "Client Name", type: "text" }, 
      { name: "Report Date", type: "date" },
    ],
timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },
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

export const adminTemplates: AdminTemplate[] = [
  {
    id: "tmpl1",
    category: "CALIBER-AARONA",
    color: "#0070f3",
    description: "Calibration workflow template for AARONA division vehicles.",

    // 🆕 Category-level time-sensitive color mapping
    timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" }, // 🟡 Yellow at 6 days
      danger: { days: 3, color: "#FF6B6B" },  // 🔴 Red at 3 days
    },

    steps: [
      {
        name: "Verify Customer Info",
        type: "text",
        timeSensitive: false,
        trigger: "informative",
        info: "Ensure the customer and vehicle data match the database.",
      },
      {
        name: "Schedule Inspection",
        type: "date",
        timeSensitive: true,
        trigger: "reminder",
        info: "Set inspection before due date. Turns yellow at 6 days, red at 3 days.",
      },
      {
        name: "Prepare Documentation",
        type: "check",
        timeSensitive: false,
        trigger: "informative",
        info: "Confirm all documents are uploaded to the system.",
      },
      {
        name: "Perform Diagnostics",
        type: "check",
        timeSensitive: true,
        trigger: "popup",
        info: "Complete full engine diagnostic before final approval.",
      },
      {
        name: "Supervisor Approval",
        type: "check",
        timeSensitive: false,
        trigger: "confirmation",
        info: "Supervisor must approve this phase before proceeding.",
      },
    ],
  },
  {
    id: "tmpl2",
    category: "CATEGORY 2",
    color: "#22c55e",
    description: "Standard maintenance checklist template.",

    timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },

    steps: [
      {
        name: "Collect Service Request",
        type: "text",
        timeSensitive: false,
        trigger: "none",
        info: "Record customer service request details.",
      },
      {
        name: "Critical Maintenance",
        type: "date",
        timeSensitive: true,
        trigger: "popup",
        info: "Maintenance deadline triggers warning at 6/3 days.",
      },
      {
        name: "Safety Review",
        type: "check",
        timeSensitive: false,
        trigger: "informative",
        info: "Review and complete safety checklist.",
      },
      {
        name: "Assign Technician",
        type: "check",
        timeSensitive: false,
        trigger: "none",
        info: "Assign technician based on specialization.",
      },
      {
        name: "Final QA Submission",
        type: "check",
        timeSensitive: true,
        trigger: "popup",
        info: "Must be submitted to QA before the final due date.",
      },
    ],
  },
  {
    id: "tmpl3",
    category: "CATEGORY 3",
    color: "#f97316",
    description: "Emission testing and approval workflow.",

    timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },

    steps: [
      {
        name: "Intake Confirmation",
        type: "text",
        timeSensitive: false,
        trigger: "informative",
        info: "Confirm initial intake form with customer.",
      },
      {
        name: "Order Parts",
        type: "check",
        timeSensitive: false,
        trigger: "none",
        info: "Order missing or required parts before next step.",
      },
      {
        name: "Prepare Workshop Bay",
        type: "check",
        timeSensitive: false,
        trigger: "none",
        info: "Ensure bay and tools are ready for inspection.",
      },
      {
        name: "Emission Test",
        type: "date",
        timeSensitive: true,
        trigger: "popup",
        info: "Emission testing must be completed before inspection date.",
      },
      {
        name: "Final Approval",
        type: "check",
        timeSensitive: false,
        trigger: "confirmation",
        info: "Approve the final maintenance checklist.",
      },
    ],
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
