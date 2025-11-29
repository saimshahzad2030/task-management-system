import { AdminTemplate,   TaskRow } from "./types";


export const adminTemplates: AdminTemplate[] = [
  {
    id: "tmpl1",
    name: "CALIBER-AARONA",
    description: "Calibration workflow template for AARONA division vehicles.",
    categories: [
      { id: 1, color: "#ffce0aff", name: "cat-1" },
      { id: 2, color: "#ff5733", name: "cat-2" },
      { id: 3, color: "#33c1ff", name: "cat-3" },
      { id: 4, color: "#75ff33", name: "cat-4" },
      { id: 5, color: "#b833ff", name: "cat-5" },
    ],
    

    steps: [
      { columnDetailsChecked: false, id: 1, name: "Verify Customer Info", type: "text", trigger: "completed", info: "Ensure the customer and vehicle data match the database." },
      { columnDetailsChecked: false, id: 2, name: "Schedule Inspection", type: "date", trigger: "completed", info: "Set inspection before due date. Turns yellow at 6 days, red at 3 days." },
      { columnDetailsChecked: false, id: 3, name: "Prepare Documentation", type: "check", trigger: "completed", info: "Confirm all documents are uploaded to the system." },
      { columnDetailsChecked: false, id: 4, name: "Perform Diagnostics", type: "check", trigger: "popup", info: "Complete full engine diagnostic before final approval." },
      { columnDetailsChecked: false, id: 5, name: "Supervisor Approval", type: "check", trigger: "completed", info: "Supervisor must approve this phase before proceeding." },

      // ✅ Added steps
      { columnDetailsChecked: false, id: 6, name: "Parts Quality Check", type: "check", trigger: "completed", info: "Verify parts quality meets standards." },
      { columnDetailsChecked: false, id: 7, name: "Assign Work Order", type: "text", trigger: "completed", info: "Assign official work order number." },
      { columnDetailsChecked: false, id: 8, name: "Upload Inspection Images", type: "text", trigger: "completed", info: "Attach inspection images for records." },
      { columnDetailsChecked: false, id: 9, name: "Generate Calibration Report", type: "text", trigger: "popup", info: "Report must be generated before final handover." },
      { columnDetailsChecked: false, id: 10, name: "Customer Handover", type: "check", trigger: "completed", info: "Vehicle handed over to customer with report summary." },
    ],
  },
  {
    categories: [
      { id: 1, color: "#ffce0aff", name: "cat-1" },
      { id: 2, color: "#ff5733", name: "cat-2" },
      { id: 3, color: "#33c1ff", name: "cat-3" },
      { id: 4, color: "#75ff33", name: "cat-4" },
      { id: 5, color: "#b833ff", name: "cat-5" },
    ],

    id: "tmpl2",
    name: "CATEGORY 2",
    description: "Standard maintenance checklist template.",
 

    steps: [
      { columnDetailsChecked: false, id: 1, name: "Collect Service Request", type: "text", trigger: "completed", info: "Record customer service request details." },
      { columnDetailsChecked: false, id: 2, name: "Critical Maintenance", type: "date", trigger: "popup", info: "Maintenance deadline triggers warning at 6/3 days." },
      {
        columnDetailsChecked: false, id: 3, name: "Safety Review", type: "check", columnDetails: [{
          description: "sdsad sadsadasd",
          copyEnabled: true,
          category: { color: "#574500ff", name: "cat-2", id: 2 }
        },
        {
          description: "Hello THer make it to report",
          copyEnabled: false,
          category: { color: "#33c1ff", name: "cat-3", id: 3 }
        }], trigger: "relation", linkedStep: {
          notes:"It is the note from admin to do the email check",
          id: 8, futureColumnThings: [{
            needed: true,
            description: "Do this",
          },
          {
            needed: true,
            description: "Do this",
          },
          {
            needed: true,
            description: "Do this",
          }, {
            needed: true,
            description: "Do this",
          }]
        }, info: "Review and complete safety checklist."
      },
      { columnDetailsChecked: false, id: 4, name: "Assign Technician", type: "check", trigger: "completed", info: "Assign technician based on specialization." },
      { columnDetailsChecked: false, id: 5, name: "Final QA Submission", type: "check", trigger: "popup", info: "Must be submitted to QA before the final due date." },

      // ✅ Added steps
      { columnDetailsChecked: false, id: 6, name: "Service Bay Allocation", type: "text", trigger: "completed", info: "Assign a service bay before work begins." },
      { columnDetailsChecked: false, id: 7, name: "Upload Pre-Maintenance Images", type: "text", trigger: "completed", info: "Upload images for initial condition." },
      { columnDetailsChecked: false, id: 8, name: "Parts Replacement", type: "check", trigger: "completed", info: "Replace faulty components if required." },
      { columnDetailsChecked: false, id: 9, name: "System Diagnostics Test", type: "date", trigger: "popup", info: "Run system test to verify proper functioning." },
      { columnDetailsChecked: false, id: 10, name: "Customer Feedback Form", type: "text", trigger: "completed", info: "Collect final feedback before closing job." },
    ],
  },
  {
    id: "tmpl3",
    name: "CATEGORY 3",
    categories: [
      { id: 1, color: "#ffce0aff", name: "cat-1" },
      { id: 2, color: "#ff5733", name: "cat-2" },
      { id: 3, color: "#33c1ff", name: "cat-3" }
    ],

    description: "Emission testing and approval workflow.",
 
    steps: [
      { columnDetailsChecked: false, id: 1, name: "Intake completed", type: "text", trigger: "completed", info: "Confirm initial intake form with customer." },
      { columnDetailsChecked: false, id: 2, name: "Order Parts", type: "check", trigger: "completed", info: "Order missing or required parts before next step." },
      { columnDetailsChecked: false, id: 3, name: "Prepare Workshop Bay", type: "check", trigger: "completed", info: "Ensure bay and tools are ready for inspection." },
      { columnDetailsChecked: false, id: 4, name: "Emission Test", type: "date", trigger: "popup", info: "Emission testing must be completed before inspection date." },
      { columnDetailsChecked: false, id: 5, name: "Final Approval", type: "check", trigger: "completed", info: "Approve the final maintenance checklist." },

      // ✅ Added steps
      { columnDetailsChecked: false, id: 6, name: "Upload Emission Results", type: "text", trigger: "completed", info: "Attach test results to the record." },
      { columnDetailsChecked: false, id: 7, name: "Engine Health Scan", type: "check", trigger: "completed", info: "Run health scan for engine condition." },
      { columnDetailsChecked: false, id: 8, name: "Part Replacement Check", type: "check", trigger: "completed", info: "Verify required parts were replaced." },
      { columnDetailsChecked: false, id: 9, name: "Re-Test if Failed", type: "date", trigger: "popup", info: "If the vehicle fails emission, re-test before approval." },
      { columnDetailsChecked: false, id: 10, name: "Customer Documentation", type: "text", trigger: "completed", info: "Provide emission report to customer and archive it." },
    ],
  },
];

export const sampleData: TaskRow[] = [
  // ✅ 1 — CALIBER-AARONA
  {
    id: "1",
    template: adminTemplates[0],
    color: "#0070f3",
    taskLineChecked: false,
    timeSensitiveDate: "2025-11-10",
   
    otherColumns: [
      { columnId: 1, name: "Customer Name", type: "text" },
      { columnId: 2, name: "Maintenance Date", type: "date" },

      { columnId: 3, name: "Inspection Date", type: "date" },
    ],
    steps: [
      {
        id: 1,
        columnId: 1,
        columnDetails: [{
          description: "sdsad sd sadsad ",
          copyEnabled: true,
          category: { color: "#ffce0aff", name: "cat-1", id: 1 }
        }, {
          description: "sdsad sd sadsad ",
          copyEnabled: true,
          category: { color: "#13f80bff", name: "cat-2", id: 2 }
        }], name: "Verify Customer Info", completed: false, description: "Verify customer details and vehicle information.", triggerType: "completed"
      },
      {
        id: 2, columnId: 2, name: "Schedule Inspection", completed: false, description: "Schedule before due date.", triggerType: "relation", linkedStep: {
          id: 3,

          futureColumnThings: [
            {
              needed: true,
              description: "do this pls",
            },
            {
              needed: false,
              description: "do this pls",
            },
            {
              needed: true,
              description: "do this pls",
            }
          ]
        }
      },
      { id: 3, columnId: 3, name: "Prepare Documentation", completed: false, description: "Upload customer documents.", triggerType: "completed" },
      { id: 4, columnId: 4, name: "Perform Diagnostics", completed: false, description: "Diagnostics required before moving ahead.", triggerType: "popup", popup: { description: "Diagnostic alert." } },
      { id: 5, columnId: 5, name: "Supervisor Approval", completed: false, description: "Supervisor must review and approve.", triggerType: "completed" },
      { id: 6, columnId: 6, name: "Parts Quality Check", completed: false, description: "Check parts quality.", triggerType: "completed" },
      { id: 7, columnId: 7, name: "Assign Work Order", completed: false, description: "Assign work order number.", triggerType: "completed" },
      { id: 8, columnId: 8, name: "Upload Inspection Images", completed: false, description: "Proof images uploaded.", triggerType: "completed" },
      { id: 9, columnId: 9, name: "Generate Calibration Report", completed: false, description: "Generate calibration report before handover.", triggerType: "popup" },
      { id: 10, columnId: 10, name: "Customer Handover", completed: false, description: "Handover to customer with documents.", triggerType: "completed" },
    ],
    statusTL: false,
    completed: false,
  },

  // ✅ 2 — CATEGORY 2
  {
    id: "2",
    color: "#22c55e",
    template: adminTemplates[0],
    taskLineChecked: false,
    timeSensitiveDate: "2025-11-14",
    
    otherColumns: [
      { columnId: 1, name: "Customer Name", type: "text" },
      { columnId: 2, name: "Maintenance Date", type: "date" },

      { columnId: 3, name: "Inspection Date", type: "date" },
    ],
    steps: [
      {
        id: 1, columnId: 1, name: "Collect Service Request", columnDetails: [{
          description: "sdsad sd sadsad ", copyEnabled: true,
          category: { color: "#13f80bff", name: "cat-2", id: 2 }
        }], completed: false, description: "Collected service request.", triggerType: "completed"
      },
      { id: 2, columnId: 2, name: "Critical Maintenance", completed: false, description: "Do maintenance before deadline.", triggerType: "popup", popup: { description: "Maintenance due soon." } },
      { id: 3, columnId: 3, name: "Safety Review", completed: false, description: "Safety checklist required.", triggerType: "completed" },
      { id: 4, columnId: 4, name: "Assign Technician", completed: false, description: "Assign technician.", triggerType: "completed" },
      { id: 5, columnId: 5, name: "Final QA Submission", completed: false, description: "Final QA submission required.", triggerType: "popup" },
      { id: 6, columnId: 6, name: "Service Bay Allocation", completed: false, description: "Allocated bay.", triggerType: "completed" },
      { id: 7, columnId: 7, name: "Upload Pre-Maintenance Images", completed: false, description: "Images uploaded.", triggerType: "completed" },
      { id: 8, columnId: 8, name: "Parts Replacement", completed: false, description: "Replace faulty parts.", triggerType: "completed" },
      { id: 9, columnId: 9, name: "System Diagnostics Test", completed: false, description: "System diagnostics test pending.", triggerType: "popup" },
      { id: 10, columnId: 10, name: "Customer Feedback Form", completed: false, description: "Collect feedback.", triggerType: "completed" },
    ],
    statusTL: false,
    completed: false,
  },

  // ✅ 3 — CATEGORY 3
  {
    id: "3",
    color: "#f97316",
    template: adminTemplates[1],
    taskLineChecked: false,
    timeSensitiveDate: "2025-11-08",
    
    otherColumns: [
      { columnId: 1, name: "Customer Name", type: "text" },
      { columnId: 2, name: "Maintenance Date", type: "date" },

      { columnId: 3, name: "Inspection Date", type: "date" },
    ],
    steps: [
      { id: 1, columnId: 1, name: "Intake completed", completed: false, description: "Intake confirmed.", triggerType: "completed" },
      { id: 2, columnId: 2, name: "Order Parts", completed: false, description: "Order pending.", triggerType: "completed" },
      { id: 3, columnId: 3, name: "Prepare Workshop Bay", completed: false, description: "Workshop ready.", triggerType: "completed" },
      { id: 4, columnId: 4, name: "Emission Test", completed: false, description: "Emission test required.", triggerType: "popup" },
      { id: 5, columnId: 5, name: "Final Approval", completed: false, description: "Approval pending.", triggerType: "completed" },
      { id: 6, columnId: 6, name: "Upload Emission Results", completed: false, description: "Upload results.", triggerType: "completed" },
      { id: 7, columnId: 7, name: "Engine Health Scan", completed: false, description: "Health scan completed.", triggerType: "completed" },
      { id: 8, columnId: 8, name: "Part Replacement Check", completed: false, description: "Replaced parts confirmed.", triggerType: "completed" },
      { id: 9, columnId: 9, name: "Re-Test if Failed", completed: false, description: "Re-test scheduled.", triggerType: "popup" },
      { id: 10, columnId: 10, name: "Customer Documentation", completed: false, description: "Send documentation.", triggerType: "completed" },
    ],
    statusTL: false,
    completed: false,
  },

  // ✅ 4 — Extra Task (Random Category)
  {
    id: "4",
    color: "#9b59b6",
    template: adminTemplates[2],
    taskLineChecked: false,
    timeSensitiveDate: null,
    
    otherColumns: [
      { columnId: 1, name: "Customer Name", type: "text" },
      { columnId: 2, name: "Maintenance Date", type: "date" },

      { columnId: 3, name: "Inspection Date", type: "date" },
    ],
    steps: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      columnId: i + 1,
      name: `step${i + 1}`,
      completed: false,
      timeSensitive: i % 2 === 0,
      timeSensitiveDate: i % 2 === 0 ? "2025-11-04" : null,
      description: `Auto-generated step ${i + 1}`,
      triggerType: "completed",
    })),
    statusTL: false,
    completed: false,
  },

  // ✅ 5 — Extra Task (Random Category)
  {
    id: "5",
    color: "#e91e63",
    template: adminTemplates[1],
    taskLineChecked: false,
    timeSensitiveDate: "2025-11-11",
     
    otherColumns: [
      { columnId: 1, name: "Customer Name", type: "text" },
      { columnId: 2, name: "Maintenance Date", type: "date" },

      { columnId: 3, name: "Inspection Date", type: "date" },
    ],
    steps: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      columnId: i + 1,
      name: `step${i + 1}`,
      completed: false,
      timeSensitive: i === 3 || i === 6,
      timeSensitiveDate: i === 3 || i === 6 ? "2025-11-07" : null,
      description: `Completed step ${i + 1}`,
      triggerType: "completed",
    })),
    statusTL: false,
    completed: false,
  },
];





 

export const dateColumns = ["date1", "date2", "timeSensitiveDate"];

export const columnGroups = [
  { title: "Group A", columns: ["step1", "step2", "step3"] },
  { title: "Group B", columns: ["step4", "step5", "step6", "step7"] },
  { title: "Group C", columns: ["step8", "step9", "step10"] },
];

export const finalColumns = ["completed"];
