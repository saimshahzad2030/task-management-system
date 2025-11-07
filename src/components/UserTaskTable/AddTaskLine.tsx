"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Example import (replace with your real path)
import { adminTemplates  } from "@/global/constant";
import { AdminTemplate, TaskRow } from "@/global/types";
interface AddTaskLineProps {
  data: TaskRow[];
  setData: React.Dispatch<React.SetStateAction<TaskRow[]>>;
}
export default function AddTaskLine({ data, setData }: AddTaskLineProps) {
 const [selectedTemplate, setSelectedTemplate] = useState<AdminTemplate | null>(null);

  // handle change by finding full object
 const handleSelect = (category: string) => {
  const template = adminTemplates.find((t) => t.category === category);
  if (!template) return;

  setSelectedTemplate(template);

  // Create the new task line immediately
 
};
const handleAddTaskLine = () => {
  if (!selectedTemplate) return;

  const dynamicOtherColumns = selectedTemplate.steps
    .filter((step) => step.type !== "check")
    .map((step) => ({
      name: step.name,
      type: (step.type ?? "text") as "text" | "date" | "check", // ✅ ensure non-undefined
      value: "",
    }));

  const newTask: TaskRow = {
    id: crypto.randomUUID(),
    category: selectedTemplate.category,
    taskLineChecked: false,
    timeSensitiveDate: null,
    color: selectedTemplate.color,
     otherColumns: dynamicOtherColumns.map((c, idx) => ({
    ...c,
    columnId:  idx,   // ✅ ensure columnId exists
  })),
   steps: selectedTemplate.steps.map((s,index) => ({
  columnId: index+1,           // ✅ REQUIRED
  name: s.name,
  completed: false,
  timeSensitive: s.timeSensitive,
  timeSensitiveDate: s.timeSensitive ? "" : null,
  description: s.info || "",
  triggerType: "completed",
})),

    statusTL: false,
    completed: false,

    // Optional: bring category-level time-sensitive colors here too
    timeSensitiveColors:  selectedTemplate.timeSensitiveColors ?? {
        warning: { days: 6, color: "#FFD93D" },
        danger: { days: 3, color: "#FF6B6B" },
      },
  };

  setData((prev) => [...prev, newTask]);
  setSelectedTemplate(null);
};


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add Task Line</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select a Category</DialogTitle>
          <DialogDescription>
            Choose a category to add a new task line using that template.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <Select onValueChange={handleSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>

            <SelectContent>
              {adminTemplates.map((template) => (
                <SelectItem key={template.id} value={template.category}>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: template.color }}
                    ></span>
                    {template.category}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Preview selected template */}
          {selectedTemplate && (
            <div className="mt-4 border rounded-lg p-3 bg-gray-50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: selectedTemplate.color }}
                ></span>
                {selectedTemplate.category}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedTemplate.description}
              </p>

              <ul className="mt-3 text-sm list-disc list-inside text-gray-700 space-y-1 max-h-[120px] overflow-auto">
                {selectedTemplate.steps.map((step, i) => (
                  <li key={i}>{step.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            disabled={!selectedTemplate}
            onClick={() =>
            {
handleAddTaskLine()
            }
            }
          >
            Add Task Line
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
