import { AdminTemplate, TaskRow } from "@/global/types";

export const convertAdminTemplateToTaskData = (template: AdminTemplate): TaskRow => {
  const dynamicOtherColumns = template.steps
    .filter((step) => step.type !== "check")
    .map((step, idx) => ({
      name: step.name,
      type: (step.type ?? "text") as "text" | "date" | "check",
      value: "",
      columnId: idx + 1,
      timeSensitiveColors: step.timeSensitiveColors ?? undefined,
      isTimeSensitive: step.isTimeSensitive ?? false,
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
        popupDescription: step.popupDescription
          ?  step.popupDescription ?? ""     // convert null → ""
          : undefined,
        linkedStep: step.linkedStep
          ? {
            id: step.linkedStep.id,
            notes: step.linkedStep.notes || "",
            futureColumnThings: step.linkedStep.futureColumnThings ?? [],
          }
          : undefined,


        columnDetails: Array.isArray(step.columnDetails)
  ? (() => {
      const filtered = step.columnDetails.filter(
        item => item.description?.trim() !== ""
      );
      console.log("filtered",filtered)
      if (filtered.length == 1) {
          return filtered[0]? {description:filtered[0]?.description,copyEnabled:true} : undefined;
      }
      if (filtered.length == 0){
        return undefined
      }
      return filtered;
    })()
  : step.columnDetails,
      })),

    statusTL: false,
    completed: false,
    columnDetails: [],
  };
};
