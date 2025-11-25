import { AdminTemplate, TaskRow } from "@/global/types";

export const convertAdminTemplateToTaskData = (template: AdminTemplate): TaskRow => {
  const dynamicOtherColumns = template.steps
    .filter((step) => step.type !== "check")
    .map((step, idx) => ({
      name: step.name,
      type: (step.type ?? "text") as "text" | "date" | "check",
      value: "",
      columnId: idx + 1,
    }));
  return {
    id: crypto.randomUUID(),
    category: undefined,
    color: template.categories[0]?.color,
    taskLineChecked: false,

    template, // original admin template

    createdAt: new Date(),
    updatedAt: new Date(),

    timeSensitiveDate: null,
     

    otherColumns: dynamicOtherColumns,

    // Convert AdminTemplate.steps → ListStep[]

    steps: template.steps
      .filter((s) => s.type === "check").map((step, index) => ({
        id: index + 1,
        completed: false,
        markedNext: false,
        markedNextRed: false,

        columnId: step?.id ?? 1, // default

        name: step.name,
        description: step.description || "",
        timeSensitiveDate: null,

        triggerType: step.trigger ?? "completed",

        notes: "",
        popup: step.popup
          ? { description: step.popup.description ?? "" }   // convert null → ""
          : undefined,
        linkedStep: step.linkedStep
          ? {
            id: step.linkedStep.id,
            futureColumnThings: step.linkedStep.futureColumnThings ?? [],
          }
          : undefined,


        columnDetails: step.columnDetails ?? undefined,
      })),

    statusTL: false,
    completed: false,
    columnDetails: [],
  };
};
