import { AdminTemplate, FixedColumnKey, TaskRow } from "./types";

export const sampleData: TaskRow[] = [
  {
    id: "1",
    color: "#0070f3",
    category: "CALIBER-AARONA",
    taskLineChecked: false,
    timeSensitiveDate: null,
    timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },
    otherColumns: [
      { name: "Customer Name", type: "text" },
      { name: "Inspection Date", type: "date" },
    ],
    steps: [
      {
        id: 1,
        name: "step1",
        completed: false,
        timeSensitive: false,
        timeSensitiveDate: null,
        triggerType: "popup",
        popup: { description: "Don't forget to provide report to hr team" },
        description: "Verify customer details and vehicle information.",
      },
      {
        id: 2,
        name: "step2",
        completed: false,
        timeSensitive: true,
        timeSensitiveDate: "2025-11-03",
        description: "Schedule inspection before due date.",
        triggerType: "popup",
        popup: { description: "Popup shown for inspection scheduling." },
      },
      {
        id: 3,
        name: "step3",
        completed: false,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Prepare service documentation.",
        triggerType: "completed",
      },
      {
        id: 4,
        name: "step4",
        completed: false,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Perform engine diagnostic and log results.",
        triggerType: "relation",
        linkedStep: {
          id: 3,
          requiredThings: [
            { description: "Service documentation ready" },
            { description: "Technician assigned" },
            { description: "Workstation cleared" },
          ],
          futureColumnThings: [
            { needed: true, description: "Diagnostic report attachment column required" },
            { needed: true, description: "Parts used field required" }
          ]
        },
      },
      {
        id: 5,
        name: "step5",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Awaiting supervisor approval for next phase.",
        triggerType: "completed",
      },
      {
        id: 6,
        name: "step6",
        completed: false,
        timeSensitive: true,
        timeSensitiveDate: "2025-11-05",
        description: "Finalize calibration and update report.",
        triggerType: "completed",
        linkedStep: {
          id: 4,
          requiredThings: [
            { description: "Engine diagnostic results available" },
          ],
          futureColumnThings: [
            { needed: true, description: "Calibration certificate upload" },
            { needed: false, description: "Technician signature" }
          ]
        }
      },
      {
        id: 7,
        name: "step7",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Pending quality assurance check.",
        triggerType: "completed",
      },
      {
        id: 8,
        name: "step8",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Awaiting delivery slot confirmation.",
        triggerType: "completed",
      },
      {
        id: 9,
        name: "step9",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Review financial charges for client.",
        triggerType: "completed",
      },
      {
        id: 10,
        name: "step10",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Confirm shipment documentation.",
        triggerType: "completed",
      },
      {
        id: 11,
        name: "step11",
        completed: false,
        timeSensitive: true,
        timeSensitiveDate: "2025-11-05",
        description: "Complete client satisfaction survey.",
        triggerType: "popup",
        popup: { description: "Survey popup before completion." },
        linkedStep: {
          id: 10,
          requiredThings: [{ description: "Shipment completed" }],
          futureColumnThings: [
            { needed: true, description: "Customer feedback score column" },
            { needed: true, description: "Complaint category column" }
          ]
        }
      },
      {
        id: 12,
        name: "step12",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Finalize case and archive report.",
        triggerType: "completed",
      },
    ],
    statusTL: false,
    completed: false,
  },

  // ✅ Example in category 2
  {
    id: "2",
    color: "#22c55e",
    category: "CATEGORY 2",
    taskLineChecked: false,
    timeSensitiveDate: null,
    timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },
    otherColumns: [
      { name: "Customer Name", type: "text" },
      { name: "Maintenance Date", type: "date" },
    ],
    steps: [
      {
        id: 1,
        name: "step1",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Collect initial service request from client.",
        triggerType: "completed",
      },
      {
        id: 2,
        name: "step2",
        completed: false,
        timeSensitive: true,
        timeSensitiveDate: "2025-10-28",
        description: "Ensure critical maintenance is done before due date.",
        triggerType: "popup",
        popup: { description: "Maintenance alert popup." },
        linkedStep: {
          id: 1,
          requiredThings: [{ description: "Service request approved" }],
          futureColumnThings: [
            { needed: true, description: "Maintenance report upload" },
          ]
        }
      },
      {
        id: 3,
        name: "step3",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Review safety checklist.",
        triggerType: "completed",
      },
      {
        id: 4,
        name: "step4",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Pending technician assignment.",
        triggerType: "completed",
      },
      {
        id: 5,
        name: "step5",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Awaiting parts delivery from supplier.",
        triggerType: "completed",
      },
      {
        id: 6,
        name: "step6",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Inspect and verify part compatibility.",
        triggerType: "completed",
      },
      {
        id: 7,
        name: "step7",
        completed: false,
        timeSensitive: true,
        timeSensitiveDate: "2025-11-05",
        description: "Submit final service report to QA team.",
        triggerType: "completed",
        linkedStep: {
          id: 6,
          requiredThings: [
            { description: "Parts installation confirmed" },
          ],
          futureColumnThings: [
            { needed: true, description: "QA Approval column" }
          ]
        }
      },
      {
        id: 8,
        name: "step8",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Pending billing verification.",
        triggerType: "completed",
      },
      {
        id: 9,
        name: "step9",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Collect payment confirmation.",
        triggerType: "completed",
      },
      {
        id: 10,
        name: "step10",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Notify customer of service completion.",
        triggerType: "completed",
      },
    ],
    statusTL: false,
    completed: true,
  },

  // ✅ Category 3 also updated with futureColumnThings
  {
    id: "3",
    color: "#0070f3",
    category: "CATEGORY 3",
    taskLineChecked: false,
    timeSensitiveDate: null,
    timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },
    otherColumns: [
      { name: "Client Name", type: "text" },
      { name: "Report Date", type: "date" },
    ],
    steps: [
      {
        id: 1,
        name: "step1",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Initial intake pending confirmation.",
        triggerType: "completed",
      },
      {
        id: 2,
        name: "step2",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Verify part availability and order if needed.",
        triggerType: "completed",
      },
      {
        id: 3,
        name: "step3",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Prepare workshop bay for vehicle inspection.",
        triggerType: "completed",
      },
      {
        id: 4,
        name: "step4",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Awaiting mechanic assignment.",
        triggerType: "completed",
      },
      {
        id: 5,
        name: "step5",
        completed: false,
        timeSensitive: true,
        timeSensitiveDate: "2025-10-24",
        description: "Conduct emission testing and report results.",
        triggerType: "popup",
        popup: { description: "Emission testing form popup." },
        linkedStep: {
          id: 4,
          requiredThings: [
            { description: "Mechanic assigned" },
          ],
          futureColumnThings: [
            { needed: true, description: "Emission test sheet upload column" }
          ]
        }
      },
      {
        id: 6,
        name: "step6",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Approve final maintenance checklist.",
        triggerType: "completed",
      },
      {
        id: 7,
        name: "step7",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Schedule customer follow-up.",
        triggerType: "completed",
      },
      {
        id: 8,
        name: "step8",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Invoice preparation in progress.",
        triggerType: "completed",
      },
      {
        id: 9,
        name: "step9",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Awaiting internal review approval.",
        triggerType: "completed",
      },
      {
        id: 10,
        name: "step10",
        completed: true,
        timeSensitive: false,
        timeSensitiveDate: null,
        description: "Finalize and close the work order.",
        triggerType: "completed",
      },
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
