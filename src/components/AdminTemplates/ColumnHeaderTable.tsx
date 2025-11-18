"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // or your own button
import { AdminTemplate, FinalColumnKey, ListStep, Step, TaskRow } from "@/global/types";
import HeaderDetails from "../UserTaskTable/HeaderDetails";
import { Flag, MarkedNotes, QuestionMark } from "@/global/icons";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { roboto } from "@/fonts/fonts";
import { Checkbox } from "../ui/checkbox";
import getContrastText from "@/utils/getContrast"; 
import { Calendar } from "../ui/calendar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";
export interface ColumnHeaderTableProps {
  category: string;
  color: string;
  description: string;
  data:TaskRow | null;
  setData: React.Dispatch<React.SetStateAction<TaskRow | null>>;
  steps: Step[];
}
const ColumnHeaderTable: React.FC<ColumnHeaderTableProps> = ({ category, color, description, steps ,data,setData}) => {

  const [columns, setColumns] = useState([
    { id: "col1", label: "COLUMN 1" },
    { id: "col2", label: "COLUMN 2" },
    { id: "col3", label: "COLUMN 3" },
  ]);

  const addColumnLeft = (index: number) => {
    const id = "col_" + Math.random().toString(36).slice(2, 7);
    const newCol = { id, label: "NEW COL" };

    setColumns((prev) => {
      const copy = [...prev];
      copy.splice(index, 0, newCol);
      return copy;
    });
  };

  const addColumnRight = (index: number) => {
    const id = "col_" + Math.random().toString(36).slice(2, 7);
    const newCol = { id, label: "NEW COL" };

    setColumns((prev) => {
      const copy = [...prev];
      copy.splice(index + 1, 0, newCol);
      return copy;
    });
  };

  return (
   <div className="flex flex-col items-center">
    <div className="flex flex-row items-center justify-end w-full">
      {steps.length>0 && steps.every((s)=>s.name) && <Button
      className="my-4 cursor-pointer"
    onClick={() => {
      console.log(steps,"steps")
    const template: AdminTemplate = {
      id: "tmp_" + Date.now(),
      category,
      color,
      description,
      steps,
      timeSensitiveColors: {
        warning: { days: 6, color: "#FFD93D" },
        danger: { days: 3, color: "#FF6B6B" },
      },
    };

    const dynamicOtherColumns = template.steps
      .filter((step) => step.type !== "check")
      .map((step, idx) => ({
        name: step.name,
        type: (step.type ?? "text") as "text" | "date" | "check",
        value: "",
        columnId: idx + 1,
      }));

    const newTask: TaskRow = {
      id: crypto.randomUUID(),
      category: template.category,
      taskLineChecked: false,
      timeSensitiveDate: null,
      color: template.color,
      otherColumns: dynamicOtherColumns,
     steps: template.steps
  .filter((s) => s.type === "check") // ✅ ONLY check-type steps
  .map((s, i) => ({
    columnId: i + 1,
    name: s.name,

    // ✅ carry column details if exists
    columnDetails: s.columnDetails ?? undefined,

    completed: false,

    // ✅ time sensitive
    timeSensitive: s.timeSensitive ?? false,
    timeSensitiveDate: s.timeSensitive ? "" : null,

    // Use admin description/info (fallback to "")
    description: s.description || s.info || "",

    // ✅ Convert admin trigger → user triggerType
    triggerType: s.trigger ?? "completed",

    // ✅ Popup mapping (if admin set one)
    popup: s.trigger === "popup" && s.popup
      ? { description: s.popup.description ?? "" }
      : undefined,

    // ✅ Relation / linked steps mapping
    linkedStep:
      s.trigger === "relation" && s.linkedStep
        ? {
            id: s.linkedStep.id,
            requiredThings: [], // you can fill later
            futureColumnThings: [],
          }
        : undefined,
  })),
      statusTL: false,
      completed: false,
      timeSensitiveColors: template.timeSensitiveColors ?? {
  warning: { days: 6, color: "#FFD93D" },
  danger: { days: 3, color: "#FF6B6B" },
},
    };

    setData(newTask); // this triggers table render
  }}
      >{data?"Refresh preview":"Preview"}</Button>}
    </div>
    {data &&       <div className="w-full overflow-x-auto">
                  <table className={`  table-auto border-collapse border w-full ${roboto.className}`}>
      <thead className="bg-gray-100 overflow-y-visible">

                  <tr className=" overflow-y-visible ">
                    {/* Task Line Checkbox */}
                   
                    <th className="px-4 h-[20px]  text-center   text-[11px]   pt-8 ">
                      T/L
                    </th>

                     
                    {data.otherColumns.map((col: any,index)    => (
                      <th
                        key={index}
                        className="  capitalize min-w-[70px]  text-[11px] px-4 text-center pt-8  "
                      >
                        {col.name}
                      </th>
                    ))}

                 
                    <th className="px-4 h-[50px] min-w-[160px] text-center  text-[11px]  pt-8 ">
                      TIME SENSITIVE DATE
                    </th>

                    {/* Non-TimeSensitive Step Columns */}
                    {data.steps.map((stepName) => (
                     <>
                     {stepName.triggerType &&  <th
                        key={stepName.id}
                        className="cursor-pointer px-4 h-[50px] min-w-[120px] text-center text-[11px]"
                      >
                        <div className="w-full flex flex-col items-center">
                          {stepName.columnDetails ? <button
                            className="my-2 cursor-pointer"
                            onClick={() => HeaderDetails(  [{color,description:stepName.columnDetails?.description || "",label:"SF",allowCopy:stepName.columnDetails?.copyEnabled || false}],stepName.name)}

                          >
                             
                            <QuestionMark />
                          </button>:
                          <div className="my-4"></div>}
                          <p  >{"Check Column"}</p>
                        </div>
                      </th>}</>

                    ))}

                   
                      <th 
                        className="px-4 h-[50px] min-w-[110px] text-center text-xs  pt-8 "
                      >
                        {"completed".toUpperCase()}
                      </th> 
                  </tr>
         
        </thead>

        {/* NO ROWS — headers only */}
        <tbody
        className="border border-2 border-b-stone-200  ">
        
                                  <td className={`text-center    w-[80px]   ${data.taskLineChecked ? "bg-red-600" : "bg-stone-200"}`}>
                                    <Checkbox
                                      variant={data.taskLineChecked ? "default" : "danger"}
                                      checked={data.statusTL}
                                      // onCheckedChange={(v) => handleTaskLineCheckbox(idx)}
                                    />
                                  </td>
          {data.otherColumns.map((headerName, index) => {
                            const colObj = data.otherColumns.find(
                              (col: any) => col.name === headerName.name
                            );
                            console.log(index == 0 ? colObj : "sds")
                            return (
                              <td

                                key={index}
                                style={{
                                  backgroundColor: data.taskLineChecked
                                    ? "#e7000b"
                                    : index === 0
                                      ? data.color
                                      : "white",
                                  color: data.taskLineChecked
                                    ? "white"
                                    : index === 0
                                      ? getContrastText(data.color)
                                      : "#1e2939",
                                }}

                                className={`text-center min-w-[140px]  `}
                              >
                                {colObj ? (
                                  colObj.type === "text" ? (
                                    <input
                                      type="text"
                                      placeholder="Enter text..."

                                      className={` text-center w-full bg-transparent placeholder:italic focus:outline-none text-xs 
        
        `}

                                      value={colObj.value || ""}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        
                                      }}
                                    />
                                  ) : colObj.type === "date" ? (
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <button
                                          className={` w-full text-xs text-center py-2 bg-transparent    focus:outline-none cursor-pointer ${data.taskLineChecked
                                              ? "text-white italic"
                                              : colObj.value
                                                ? "text-gray-800"
                                                : "text-gray-400 italic"
                                            }`}
                                        >
                                          {colObj.value || "Select date..."}
                                        </button>
                                      </PopoverTrigger>

                                      <PopoverContent className="w-auto p-0" align="center">
                                        <Calendar
                                          mode="single"
                                          selected={
                                            colObj.value ? new Date(colObj.value) : undefined
                                          }
                                          onSelect={(date) => {
                                            if (!date) return;
                                            // ✅ Convert to local YYYY-MM-DD to avoid timezone shifts
                                            const yyyy = date.getFullYear();
                                            const mm = String(date.getMonth() + 1).padStart(2, "0");
                                            const dd = String(date.getDate()).padStart(2, "0");
                                            const formatted = `${yyyy}-${mm}-${dd}`;

                                            // setData((prev: any) => {
                                            //   const updated = [...prev];
                                            //   updated[idx].otherColumns = updated[idx].otherColumns.map(
                                            //     (c: any) =>
                                            //       c.name === colObj.name
                                            //         ? { ...c, value: formatted }
                                            //         : c
                                            //   );
                                            //   return updated;
                                            // });
                                          }}
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>

                            );
                          })}



 <td
                            className={cn(
                              "text-center min-w-[160px] cursor-pointer relative transition-colors duration-200",
                              data.taskLineChecked ? "bg-red-600 text-white" : "bg-white text-gray-800"
                            )}
                          >
                            <Popover>
                              <PopoverTrigger asChild>
                                {(() => {
                                   
                                  let bgColor = "transparent";
                                  if (!data.taskLineChecked && data.timeSensitiveDate) {
                                    const today = new Date();
                                    const due = new Date(data.timeSensitiveDate);
                                    const diffDays = Math.ceil(
                                      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                                    );

                                    const { warning, danger } = data.timeSensitiveColors || {};
                                    if (danger && diffDays <= danger.days) bgColor = danger.color;
                                    else if (warning && diffDays <= warning.days) bgColor = warning.color;
                                  }

                                  // --- Compute luminance to choose contrasting text color ---
                                  const hex = bgColor.replace("#", "");
                                  const r = parseInt(hex.substring(0, 2), 16);
                                  const g = parseInt(hex.substring(2, 4), 16);
                                  const b = parseInt(hex.substring(4, 6), 16);
                                  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                                  let textColor = "#000"; // default
                                  if (bgColor && bgColor.startsWith("#")) {
                                    const hex = bgColor.replace("#", "");
                                    const r = parseInt(hex.substring(0, 2), 16);
                                    const g = parseInt(hex.substring(2, 4), 16);
                                    const b = parseInt(hex.substring(4, 6), 16);
                                    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                                    textColor = luminance > 0.6 ? "#000" : "#fff";
                                  }

                                  return (
                                    <div
                                      className={cn(
                                        "w-full text-xs text-center py-2 bg-transparent focus:outline-none cursor-pointer rounded-md italic"
                                      )}

                                    >
                                      {data.timeSensitiveDate ? (
                                        <span
                                          style={{
                                            padding: '4px',
                                            backgroundColor: bgColor,
                                            color: data.taskLineChecked
                                              ? "white"
                                              : data.timeSensitiveDate
                                                ? textColor
                                                : "gray",
                                          }}
                                          className="font-medium not-italic">
                                          {data.timeSensitiveDate}
                                        </span>
                                      ) : (
                                        <span className="text-gray-400 italic">Select date...</span>
                                      )}
                                    </div>
                                  );
                                })()}
                              </PopoverTrigger>

                              <PopoverContent className="p-0 w-auto" align="center">
                                <Calendar
                                  mode="single"
                                  selected={
                                    data.timeSensitiveDate ? new Date(data.timeSensitiveDate) : undefined
                                  }
                                  onSelect={(date) => {
                                  
                                  }} 
                                />
                              </PopoverContent>
                            </Popover>
                          </td>





{data.steps.map((stepName) => {
                            const step = data.steps.find(
                              (s: any) => s.columnId === stepName.columnId
                            );
                            return (
                              <td

                                key={stepName.id}

                                onContextMenu={(e) => {
                                  e.preventDefault();
                                  if (step) {
                                    // setNotesPopup({
                                    //   open: true,
                                    //   rowIndex: idx,
                                    //   stepName: step.name,
                                    //   value: step.notes || ""
                                    // });
                                    // setOpen(true);
                                  }
                                }}

                                className={`    text-center     w-[80px] h-[9px] 
                  ${data.taskLineChecked && "bg-red-600"  }
                  `}
                              >
                                 <TooltipProvider>
  <Tooltip>
    {/* ✅ MOVE TooltipTrigger TO THIS DIV */}
    <TooltipTrigger asChild>
      <div className={`relative flex flex-col items-center w-full h-full 
        
         `}
      >
      <div
  onClick={() => {
// setData(prev => {
//     return prev.map((taskRow, rIndex) => {
//       if (rIndex !== idx) return taskRow;

//       return {
//         ...taskRow,
//         steps: taskRow.steps.map(s =>
//           s.columnId === stepName.columnId
//             ? { ...s, markedNextRed: !(s.markedNextRed ?? false) }
//             : s
//         )
//       };
//     });
//   });
}}


      className={`flex flex-col items-center w-8/12 h-full ${data.taskLineChecked ? "bg-red-600" : step ? step.completed ? "bg-lime-500"
        : step.markedNext ? "bg-yellow-300" 
        : step.markedNextRed ? "bg-red-200" :"bg-gray-200" : ""}`}>
          {/* Notes icon */}
        {step?.notes && (
          <div className="absolute flex flex-row items-center justify-end top-0 right-0">
            <MarkedNotes />
          </div>
        )}

        {!data.taskLineChecked ? (
          <div className="flex flex-col items-center justify-center h-full">
            {step ? (
              <Checkbox
                variant={step.completed ? "white" : step.markedNext ? "yellow" : "success"}
                checked={step.completed}
                onCheckedChange={(v) =>{}}
              />
            ) : (
              <span className={`${data.taskLineChecked ? "text-gray-200" : "text-gray-400"} text-xs`}>-</span>
            )}
          </div>
        ) : (
          <p className="my-2"></p>
        )}
      </div>
      </div>
    </TooltipTrigger>

    {/* ✅ Tooltip on hover of entire div */}
    {step?.notes && (
      <TooltipContent
        side="bottom"
        className="min-w-[120px] text-xs p-3 bg-white shadow-md rounded-md border text-gray-700"
      >
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-black">Notes</h1>
          <p>{step.notes}</p>
        </div>
      </TooltipContent>
    )}
  </Tooltip>
</TooltipProvider>

                              </td>

                            );
                          })}

                           <td
                                             
                                                        className={`pr-4 text-center min-w-[55px] ${data.taskLineChecked ? "bg-red-600" : "bg-white"
                                                          }`}
                                                      >
                                                        <Flag
                                                          disabled={!data.steps.every((s: any) => s.completed)}
                                                          checked={data.completed}
                                                          onToggle={(v) =>{}}
                                                          // color={row[col as FinalColumnKey]?'black':'gray'}/>
                                                          color={data.steps.every((s: any) => s.completed) ? 'black' : '#999999ff'} />
                          
                          
                                                      </td>
        </tbody>
      </table>
    </div>}
   </div>
  );
}
export default ColumnHeaderTable