import { AdminTemplate, FixedColumnKey, TaskRow } from "./types";


export const adminTemplates: AdminTemplate[] = [
  {
    id: "tmpl1",
    category: "CALIBER-AARONA",
    color: "#0070f3",
    description: "Calibration workflow template for AARONA division vehicles.",
    
    timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },

    steps: [
      { id: 1, name: "Verify Customer Info", type: "text", timeSensitive: false, trigger: "completed", info: "Ensure the customer and vehicle data match the database." },
      { id: 2, name: "Schedule Inspection", type: "date", timeSensitive: true, trigger: "completed", info: "Set inspection before due date. Turns yellow at 6 days, red at 3 days." },
      { id: 3, name: "Prepare Documentation", type: "check", timeSensitive: false, trigger: "completed", info: "Confirm all documents are uploaded to the system." },
      { id: 4, name: "Perform Diagnostics", type: "check", timeSensitive: true, trigger: "popup", info: "Complete full engine diagnostic before final approval." },
      { id: 5, name: "Supervisor Approval", type: "check", timeSensitive: false, trigger: "completed", info: "Supervisor must approve this phase before proceeding." },

      // ✅ Added steps
      { id: 6, name: "Parts Quality Check", type: "check", timeSensitive: false, trigger: "completed", info: "Verify parts quality meets standards." },
      { id: 7, name: "Assign Work Order", type: "text", timeSensitive: false, trigger: "completed", info: "Assign official work order number." },
      { id: 8, name: "Upload Inspection Images", type: "text", timeSensitive: false, trigger: "completed", info: "Attach inspection images for records." },
      { id: 9, name: "Generate Calibration Report", type: "text", timeSensitive: true, trigger: "popup", info: "Report must be generated before final handover." },
      { id: 10, name: "Customer Handover", type: "check", timeSensitive: false, trigger: "completed", info: "Vehicle handed over to customer with report summary." },
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
      { id: 1, name: "Collect Service Request", type: "text", timeSensitive: false, trigger: "completed", info: "Record customer service request details." },
      { id: 2, name: "Critical Maintenance", type: "date", timeSensitive: true, trigger: "popup", info: "Maintenance deadline triggers warning at 6/3 days." },
      { id: 3, name: "Safety Review", type: "check", timeSensitive: false, trigger: "completed", info: "Review and complete safety checklist." },
      { id: 4, name: "Assign Technician", type: "check", timeSensitive: false, trigger: "completed", info: "Assign technician based on specialization." },
      { id: 5, name: "Final QA Submission", type: "check", timeSensitive: true, trigger: "popup", info: "Must be submitted to QA before the final due date." },

      // ✅ Added steps
      { id: 6, name: "Service Bay Allocation", type: "text", timeSensitive: false, trigger: "completed", info: "Assign a service bay before work begins." },
      { id: 7, name: "Upload Pre-Maintenance Images", type: "text", timeSensitive: false, trigger: "completed", info: "Upload images for initial condition." },
      { id: 8, name: "Parts Replacement", type: "check", timeSensitive: false, trigger: "completed", info: "Replace faulty components if required." },
      { id: 9, name: "System Diagnostics Test", type: "date", timeSensitive: true, trigger: "popup", info: "Run system test to verify proper functioning." },
      { id: 10, name: "Customer Feedback Form", type: "text", timeSensitive: false, trigger: "completed", info: "Collect final feedback before closing job." },
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
      { id: 1, name: "Intake completed", type: "text", timeSensitive: false, trigger: "completed", info: "Confirm initial intake form with customer." },
      { id: 2, name: "Order Parts", type: "check", timeSensitive: false, trigger: "completed", info: "Order missing or required parts before next step." },
      { id: 3, name: "Prepare Workshop Bay", type: "check", timeSensitive: false, trigger: "completed", info: "Ensure bay and tools are ready for inspection." },
      { id: 4, name: "Emission Test", type: "date", timeSensitive: true, trigger: "popup", info: "Emission testing must be completed before inspection date." },
      { id: 5, name: "Final Approval", type: "check", timeSensitive: false, trigger: "completed", info: "Approve the final maintenance checklist." },

      // ✅ Added steps
      { id: 6, name: "Upload Emission Results", type: "text", timeSensitive: false, trigger: "completed", info: "Attach test results to the record." },
      { id: 7, name: "Engine Health Scan", type: "check", timeSensitive: false, trigger: "completed", info: "Run health scan for engine condition." },
      { id: 8, name: "Part Replacement Check", type: "check", timeSensitive: false, trigger: "completed", info: "Verify required parts were replaced." },
      { id: 9, name: "Re-Test if Failed", type: "date", timeSensitive: true, trigger: "popup", info: "If the vehicle fails emission, re-test before approval." },
      { id: 10, name: "Customer Documentation", type: "text", timeSensitive: false, trigger: "completed", info: "Provide emission report to customer and archive it." },
    ],
  },
];

export const sampleData: TaskRow[] = [
  // ✅ 1 — CALIBER-AARONA
  {
    id: "1",
    color: "#0070f3",
    category: "CALIBER-AARONA",
    taskLineChecked: false,
    timeSensitiveDate: "2025-11-10",
    timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },
    otherColumns: [
      { columnId: 1, name: "Customer Name", type: "text" },
      { columnId: 2, name: "Maintenance Date", type: "date" },

      { columnId: 3, name: "Inspection Date", type: "date" },
    ],
    columnDetails:{copyEnabled:true,description:"sdas dasd as das dasd",adminTemplate:adminTemplates[0]},
    steps: [
      {
        id: 1, 
        columnId: 1, columnDetails: {
          description: "sdsad sd sadsad ",
          copyEnabled: true,
          adminTemplate: adminTemplates[3]
        }, name: "Verify Customer Info", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Verify customer details and vehicle information.", triggerType: "completed"
      },
      { id: 2, columnId: 2, name: "Schedule Inspection", completed: false, timeSensitive: true, timeSensitiveDate: "2025-11-05", description: "Schedule before due date.", triggerType: "relation",linkedStep:{id:3,
       
      requiredThings:[{description:"string"}] ,
      futureColumnThings:[
        {
        needed:true,
        description:"do this pls",
      } ,
      {
        needed:false,
        description:"do this pls",
      } ,
      {
        needed:true,
        description:"do this pls",
      } 
      ]
    } },
      { id: 3, columnId: 3, name: "Prepare Documentation", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Upload customer documents.", triggerType: "completed" },
      { id: 4, columnId: 4, name: "Perform Diagnostics", completed: false, timeSensitive: true, timeSensitiveDate: "2025-11-06", description: "Diagnostics required before moving ahead.", triggerType: "popup", popup: { description: "Diagnostic alert." } },
      { id: 5, columnId: 5, name: "Supervisor Approval", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Supervisor must review and approve.", triggerType: "completed" },
      { id: 6, columnId: 6, name: "Parts Quality Check", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Check parts quality.", triggerType: "completed" },
      { id: 7, columnId: 7, name: "Assign Work Order", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Assign work order number.", triggerType: "completed" },
      { id: 8, columnId: 8, name: "Upload Inspection Images", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Proof images uploaded.", triggerType: "completed" },
      { id: 9, columnId: 9, name: "Generate Calibration Report", completed: false, timeSensitive: true, timeSensitiveDate: "2025-11-07", description: "Generate calibration report before handover.", triggerType: "popup" },
      { id: 10, columnId: 10, name: "Customer Handover", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Handover to customer with documents.", triggerType: "completed" },
    ],
    statusTL: false,
    completed: false,
  },

  // ✅ 2 — CATEGORY 2
  {
    id: "2",
    
    columnDetails:{copyEnabled:false,description:"s  sadasddas dasd asa asd asds das dasd",adminTemplate:adminTemplates[1]},
    color: "#22c55e",
    category: "CATEGORY 2",
    taskLineChecked: false,
    timeSensitiveDate: "2025-11-14",
    timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },
    otherColumns: [
      { columnId: 1, name: "Customer Name", type: "text" },
      { columnId: 2, name: "Maintenance Date", type: "date" },

      { columnId: 3, name: "Inspection Date", type: "date" },
    ],
    steps: [
      {
        id: 1, columnId: 1, name: "Collect Service Request", columnDetails: {
          description: "sdsad sd sadsad ", copyEnabled: true,
          adminTemplate: adminTemplates[3]
        }, completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Collected service request.", triggerType: "completed"
      },
      { id: 2, columnId: 2, name: "Critical Maintenance", completed: false, timeSensitive: true, timeSensitiveDate: "2025-11-04", description: "Do maintenance before deadline.", triggerType: "popup", popup: { description: "Maintenance due soon." } },
      { id: 3, columnId: 3, name: "Safety Review", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Safety checklist required.", triggerType: "completed" },
      { id: 4, columnId: 4, name: "Assign Technician", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Assign technician.", triggerType: "completed" },
      { id: 5, columnId: 5, name: "Final QA Submission", completed: false, timeSensitive: true, timeSensitiveDate: "2025-11-09", description: "Final QA submission required.", triggerType: "popup" },
      { id: 6, columnId: 6, name: "Service Bay Allocation", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Allocated bay.", triggerType: "completed" },
      { id: 7, columnId: 7, name: "Upload Pre-Maintenance Images", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Images uploaded.", triggerType: "completed" },
      { id: 8, columnId: 8, name: "Parts Replacement", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Replace faulty parts.", triggerType: "completed" },
      { id: 9, columnId: 9, name: "System Diagnostics Test", completed: false, timeSensitive: true, timeSensitiveDate: "2025-11-10", description: "System diagnostics test pending.", triggerType: "popup" },
      { id: 10, columnId: 10, name: "Customer Feedback Form", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Collect feedback.", triggerType: "completed" },
    ],
    statusTL: false,
    completed: false,
  },

  // ✅ 3 — CATEGORY 3
  {
    id: "3",
    
    columnDetails:{copyEnabled:true,description:"sdad asd asd s d sdsa asdasd as das dasd",adminTemplate:adminTemplates[3]},
    color: "#f97316",
    category: "CATEGORY 3",
    taskLineChecked: false,
    timeSensitiveDate: "2025-11-08",
    timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },
    otherColumns: [
      { columnId: 1, name: "Customer Name", type: "text" },
      { columnId: 2, name: "Maintenance Date", type: "date" },

      { columnId: 3, name: "Inspection Date", type: "date" },
    ],
    steps: [
      { id: 1, columnId: 1, name: "Intake completed", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Intake confirmed.", triggerType: "completed" },
      { id: 2, columnId: 2, name: "Order Parts", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Order pending.", triggerType: "completed" },
      { id: 3, columnId: 3, name: "Prepare Workshop Bay", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Workshop ready.", triggerType: "completed" },
      { id: 4, columnId: 4, name: "Emission Test", completed: false, timeSensitive: true, timeSensitiveDate: "2025-11-05", description: "Emission test required.", triggerType: "popup" },
      { id: 5, columnId: 5, name: "Final Approval", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Approval pending.", triggerType: "completed" },
      { id: 6, columnId: 6, name: "Upload Emission Results", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Upload results.", triggerType: "completed" },
      { id: 7, columnId: 7, name: "Engine Health Scan", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Health scan completed.", triggerType: "completed" },
      { id: 8, columnId: 8, name: "Part Replacement Check", completed: true, timeSensitive: false, timeSensitiveDate: null, description: "Replaced parts confirmed.", triggerType: "completed" },
      { id: 9, columnId: 9, name: "Re-Test if Failed", completed: false, timeSensitive: true, timeSensitiveDate: "2025-11-07", description: "Re-test scheduled.", triggerType: "popup" },
      { id: 10, columnId: 10, name: "Customer Documentation", completed: false, timeSensitive: false, timeSensitiveDate: null, description: "Send documentation.", triggerType: "completed" },
    ],
    statusTL: false,
    completed: false,
  },

  // ✅ 4 — Extra Task (Random Category)
  {
    id: "4",
    
    columnDetails:{copyEnabled:true,description:"sdas dasd as das dasd",adminTemplate:adminTemplates[2]},
    color: "#9b59b6",
    category: "CATEGORY 4",
    taskLineChecked: false,
    timeSensitiveDate: null,
    timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },
    otherColumns: [
      { columnId: 1, name: "Customer Name", type: "text" },
      { columnId: 2, name: "Maintenance Date", type: "date" },

      { columnId: 3, name: "Inspection Date", type: "date" },
    ],
    steps: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      columnId: i + 1,
      name: `step${i + 1}`,
      completed: i < 5,
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
    columnDetails:{copyEnabled:true,description:"sdas dasd as das dasd",adminTemplate:adminTemplates[1]},
    color: "#e91e63",
    category: "CATEGORY 5",
    taskLineChecked: false,
    timeSensitiveDate: "2025-11-11",
    timeSensitiveColors: {
      warning: { days: 6, color: "#FFD93D" },
      danger: { days: 3, color: "#FF6B6B" },
    },
    otherColumns: [
      { columnId: 1, name: "Customer Name", type: "text" },
      { columnId: 2, name: "Maintenance Date", type: "date" },

      { columnId: 3, name: "Inspection Date", type: "date" },
    ],
    steps: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      columnId: i + 1,
      name: `step${i + 1}`,
      completed: true,
      timeSensitive: i === 3 || i === 6,
      timeSensitiveDate: i === 3 || i === 6 ? "2025-11-07" : null,
      description: `Completed step ${i + 1}`,
      triggerType: "completed",
    })),
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
