 

"use client";
import React, { useState } from "react";
import { adminTemplates  } from "@/global/constant";
import { AdminTemplate, Categories, TaskRow } from "@/global/types";
import { Button } from "../ui/button";
 
 

 
 interface AddTaskLineProps {
  data: TaskRow[];
  callingFromAdmin?:boolean;
  adminTemplate:AdminTemplate,
  updateData:(updater: (prev: TaskRow[]) => TaskRow[])=>void;
  setData: React.Dispatch<React.SetStateAction<TaskRow[]>>;
}
export default function AddTaskLine({  adminTemplate,data, setData ,callingFromAdmin, updateData}: AddTaskLineProps) {
  const [showCategories, setShowCategories] = useState(false);

  const handleAdd = (cat: Categories) => {
    const dynamicOtherColumns = adminTemplate.steps
      .filter((step) => step.type !== "check")
      .map((step, idx) => ({
        name: step.name,
        type: (step.type ?? "text") as "text" | "date" | "check",
        value: "",
          timeSensitiveColors:  step.isTimeSensitive ?  step.timeSensitiveColors:undefined,
        isTimeSensitive: step.isTimeSensitive || false,
        columnId: idx + 1,
      }));

    const newTask: TaskRow = {
      id: crypto.randomUUID(),
      template: adminTemplate,
      category: cat,
      taskLineChecked: false,
      timeSensitiveDate: null,
      color: cat.color,
      otherColumns: dynamicOtherColumns,

     steps: adminTemplate.steps
  .filter((s) => s.type === "check").map((s, i) => ({
        columnId: i + 1,
        name: s.name,
        completed: false,
        
        description: s.info || "",
        triggerType: "completed",
      })),

      statusTL: false,
      completed: false,
      
    };

    updateData((prev) => [...prev, newTask]);
 
  };

  return (
    <div className={`flex flex-col gap-1 ${!callingFromAdmin && 'gap-3'} `}>
      {/* Toggle Button */}
      <Button className="w-[150px] mb-0" variant="default" 
       onClick={() => setShowCategories(!showCategories)}
      >Add Customer</Button>
 
      {/* <button
        className="px-3 py-1 bg-black text-white text-sm font-semibold"
       
      >
        + NEW
      </button> */}

      {/* Show category list IF clicked */}
      {showCategories ?  
        <div className="flex items-center gap-3 flex-wrap">
          {/* Close button */}
          <button
            className="px-2 py-1 bg-black text-white text-xs"
            onClick={() => setShowCategories(false)}
          >
            ✕
          </button>

          {/* Category chips */}
          {adminTemplate.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleAdd(cat)}
              className="px-4 py-1 rounded text-xs font-semibold"
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </button>
          ))}
        </div>:
        <div className="py-3"></div>
      }
    </div>
  );
}
