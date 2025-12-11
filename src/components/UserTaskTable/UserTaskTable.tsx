"use client";
import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { CalendarIcon, CircleQuestionMark, HelpCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDetails, FinalColumnKey, ListStep, NotesPopupState, TaskRow } from "@/global/types";
import { sampleData as initialData } from "@/global/constant";
import {  finalColumns } from "@/global/constant";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner";
import AddTaskLine from "./AddTaskLine";
import { roboto } from "@/fonts/fonts";
import { Button } from "../ui/button";
import HeaderDetails from "./HeaderDetails";
import getContrastText from "@/utils/getContrast";
import { Flag, MarkedNotes, QuestionMark } from "@/global/icons";
import { Switch } from "../ui/switch";
import TaskSorter from "./TaskSorter";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import DraggableRow from "./DraggableRow";
import NotesDialog from "./NotesDialog";
import { Input } from "../ui/input";
import { convertSegmentPathToStaticExportFilename } from "next/dist/shared/lib/segment-cache/segment-value-encoding";
import { UserTaskHeaderProps } from "@/global/componentTypes";
import { convertAdminTemplateToTaskData } from "@/utils/convertIntoUserTasks";
import { ConfirmModal } from "./ConfirmModal";
import { set } from "zod";
 export async function clearAllBrowserStorage() {
  try {
    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear Cache Storage (service worker caches)
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }

    console.log("All browser storage cleared successfully");
    return true;
  } catch (error) {
    console.error("Failed to clear browser storage:", error);
    return false;
  }
}



const UserTaskTable = ({ adminTemplate }: UserTaskHeaderProps) => {
 const handleClearCache = async () => {
  const success = await clearAllBrowserStorage();
  if (success) {
     const fresh = [convertAdminTemplateToTaskData(adminTemplate)];

    setData(fresh);
    setLastSavedData(JSON.parse(JSON.stringify(fresh)));
    toast.success("All cache/storage cleared!");
  } else {
    toast.error("Failed to clear storage.");
  }
};


  const saveToLocalStorage = () => {
  try { 

    const cloned = JSON.parse(JSON.stringify(data)); // DEEP CLONE

    localStorage.setItem(`user-task-data-${adminTemplate.id}`, JSON.stringify(cloned));
    setLastSavedData(cloned); // store clean snapshot
    toast.success("Changes saved!");
  } catch (err) {
    toast.error("Failed to save data");
  }
};
  // const [data, setData] = useState([convertAdminTemplateToTaskData(adminTemplate)]);
  const [data, setData] = useState([convertAdminTemplateToTaskData(adminTemplate)]);
const [lastSavedData, setLastSavedData] = useState<TaskRow[] | null>(null);
 
  const [open, setOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [notesPopup, setNotesPopup] = useState<NotesPopupState>({
    open: false,
    x: 0,
    y: 0,
    rowIndex: null as number | null,
    stepName: "",
    value: ""
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();        // prevent browser default right-click menu


    setOpen(true);             // open popover
  };

  const saveNotes = () => {
    if (notesPopup.rowIndex === null) return;

    setData(prev => {
      const updated = [...prev];

      const index = notesPopup.rowIndex as number; // ✅ safe assertion

      updated[index].steps = updated[index].steps.map(step =>
        step.name === notesPopup.stepName
          ? { ...step, notes: notesPopup.value }
          : step
      );

      return updated;
    });

    setNotesPopup(prev => ({ ...prev, open: false }));
    toast.success("Notes Updated")
  };
  const deleteNotes = () => {
    if (notesPopup.rowIndex === null) return;

    setData(prev => {
      const updated = [...prev];

      const index = notesPopup.rowIndex as number; // ✅ safe assertion

      updated[index].steps = updated[index].steps.map(step =>
        step.name === notesPopup.stepName
          ? { ...step, notes: "" }
          : step
      );

      return updated;
    });

    setNotesPopup(prev => ({ ...prev, open: false }));
    toast.success("Notes Deleted")
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 2 },
    })
  );


  function onDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setData((prev: any) => {
      const oldIndex = prev.findIndex((r: any) => r.id === active.id);
      const newIndex = prev.findIndex((r: any) => r.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }


  // Since steps is now an array of objects, we extract their names for headers
  const stepColumns = data[0]?.steps.map((s: any) => s.name) || [];


  function applyMarkedNextRed(steps: ListStep[], clickedIndex: number) {
    // find all completed steps
    const brokenRange: number[] = [];
    for (let i = 0; i < clickedIndex; i++) {
      if (!steps[i].completed) brokenRange.push(i);
    }

    // 2️⃣ Find next uncompleted step AFTER clickedIndex
    const next = steps.findIndex((s, i) => i > clickedIndex && !s.completed);

    return steps.map((s, i) => ({
      ...s,

      // keep old red unless the step is now completed
      markedNextRed:
        s.completed
          ? false
          : s.markedNextRed || brokenRange.includes(i) || i === next
    }));
  }
  const handleCheckbox = (
    rowIndex: number,
    stepName: string,
    value: boolean | "indeterminate"
  ) => {
    const step = data[rowIndex].steps.find((s) => s.name === stepName);
    if (!step) return;

    // =========================================
    // ✅ IF UNCHECKING — show confirmation
    // =========================================
   if (step.completed) {
  setData(prev => {
    const updated = [...prev];

    // reset all markedNextRed to false on uncheck
    const resetSteps = updated[rowIndex].steps.map(s => ({
      ...s,
      markedNextRed: false
    }));

    // now uncheck the clicked step
    const newSteps = resetSteps.map(s =>
      s.name === stepName ? { ...s, completed: false } : s
    );

    updated[rowIndex].steps = newSteps;
    return updated;
  });

  return;
}


    // =========================================
    // ✅ Trigger: completed
    // =========================================
    if (step.triggerType === "completed") {
      setData(prev => {
        const updated = [...prev];

        let newSteps = updated[rowIndex].steps.map(s =>
          s.name === stepName ? { ...s, completed: true } : s
        );

        const clickedIndex = updated[rowIndex].steps.findIndex(
          s => s.name === stepName
        );

        updated[rowIndex].steps = applyMarkedNextRed(newSteps, clickedIndex);
        return updated;
      });

      return;
    }

    // =========================================
    // ✅ Trigger: popup
    // =========================================
    if (step.triggerType === "popup") {
      toast.custom(
        (t) => (
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md w-[320px]">
            <p className="text-gray-800 text-sm mb-3">
              {step.popup?.description || "Please confirm this action."}
            </p>

            <div className="flex justify-end space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.dismiss(t)}
              >
                Cancel
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  setData(prev => {
                    const updated = [...prev];

                    let newSteps = updated[rowIndex].steps.map(s =>
                      s.name === stepName ? { ...s, completed: true } : s
                    );

                    const clickedIndex = updated[rowIndex].steps.findIndex(
                      s => s.name === stepName
                    );

                    updated[rowIndex].steps = applyMarkedNextRed(newSteps, clickedIndex);

                    return updated;
                  });

                  toast.dismiss(t);
                  toast.success("Step marked as completed!");
                }}
              >
                OK
              </Button>
            </div>
          </div>
        ),
        {
          position: "top-center",
          duration: 6000,
          dismissible: true,
        }
      );
      return;
    }

    // =========================================
    // ✅ Trigger: relation
    // =========================================
    if (step.triggerType === "relation") {
      const initial = structuredClone(step?.linkedStep?.futureColumnThings || []);

      toast.custom(
        (t) => {
          function FutureColumnToast() {
            const [state, setState] = React.useState(initial);

            return (
              <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md w-[330px]">
                <p className="text-gray-800 text-sm mb-3">
                  You just finished this column. Mark what is needed for the next
                  column:
                </p>

                <div className="space-y-2 max-h-[140px] overflow-y-auto mb-3 pr-1">
                  {state.map((fc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border rounded px-2 py-2"
                    >
                      <span className="text-xs text-gray-700">
                        {fc.description}
                      </span>
                      <Switch
                        checked={fc.needed}
                        onCheckedChange={(val) => {
                          const copy = [...state];
                          copy[i] = { ...copy[i], needed: val };
                          setState(copy);
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.dismiss(t)}
                  >
                    Cancel
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => {
                      setData(prev =>
                        prev.map((row, rIndex) => {
                          if (rIndex !== rowIndex) return row;

                          // update current steps
                          let updatedSteps = row.steps.map(s => {
                            if (s.name === stepName) {
                              return {
                                ...s,
                                completed: true,
                                linkedStep: {
                                  ...s.linkedStep!,
                                  futureColumnThings: state,
                                },
                              };
                            }
                            if (step?.linkedStep && step.linkedStep.id == s.columnId) {
                       console.log(step.linkedStep.notes,"step")
                              return { ...s, markedNext: true,notes: step.linkedStep.notes || ""  };
                            }


                            return s;
                          });

                          const clickedIndex = updatedSteps.findIndex(s => s.name === stepName);
                          updatedSteps = applyMarkedNextRed(updatedSteps, clickedIndex);

                          return {
                            ...row,
                            steps: updatedSteps,
                          };
                        })
                      );

                      toast.dismiss(t);
                    }}
                  >
                    OK
                  </Button>
                </div>
              </div>
            );
          }

          return <FutureColumnToast />;
        },
        {
          position: "top-center",
          duration: 6000,
          dismissible: true,
        }
      );

      return;
    }
  };
  const [modalOpen, setModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [selectedCol, setSelectedCol] = useState<FinalColumnKey | null>(null);
  const handleFinalCheckbox = (
    rowIndex: number,
    col: FinalColumnKey,
    value: boolean | "indeterminate"
  ) => {
    setSelectedRow(rowIndex);
    setSelectedCol(col);
    setModalOpen(true);
  };

  const handleTaskLineCheckbox = (rowIndex: number) => {
    setData((prev) => {
      const updated = [...prev];
      const wasChecked = updated[rowIndex].taskLineChecked; // 👈 previous value
      const newChecked = !wasChecked;
      updated[rowIndex] = {
        ...updated[rowIndex],
        taskLineChecked: !updated[rowIndex].taskLineChecked,
      };
      if (!wasChecked && newChecked) {
        toast.success("Task Line Marked Red");
      }
      return updated;
    });
  };
React.useEffect(() => {
    const saved = localStorage.getItem(`user-task-data-${adminTemplate.id}`);
  if (saved) {
    const parsed = JSON.parse(saved);
    setData(parsed);
    setLastSavedData(JSON.parse(JSON.stringify(parsed)));
    return;
  }

  // Otherwise → generate fresh data for this template
  const fresh = [convertAdminTemplateToTaskData(adminTemplate)];
  setData(fresh);
  setLastSavedData(JSON.parse(JSON.stringify(fresh)));
}, []);

React.useEffect(() => {
  setHasChanges(JSON.stringify(data) != JSON.stringify(lastSavedData));
}, [data]);


  return (
    <div className="flex flex-col items-start w-full pt-4
    ">
      <AddTaskLine adminTemplate={adminTemplate} data={data} setData={setData} />
      <div className="w-full flex flex-row items-center justify-end">
        <Button variant="customNormal1" onClick={handleClearCache}>
   Clear Table
  </Button>
{hasChanges && (
  <Button className="ml-2" variant="customNormal2" onClick={saveToLocalStorage}>
    Save Changes
  </Button>
)}

      </div>
      <Card className="w-full mt-2">
        <CardHeader className="w-full flex flex-row items-center justify-between">
          <CardTitle>Task Progress Table</CardTitle>
          <TaskSorter data={data} setData={setData} />
        </CardHeader>

        <CardContent>
         {data.length === 0 ?<div className="p-4 rounded-lg w-full flex flex-row items-center justify-center border border-gray-400">
          <p className="text-center text-gray-700">
            No Task Lines to show... (Add new Task Line from above)
          </p>
         </div>:

 <div className="min-w-full overflow-auto max-h-[55vh]">
            <table className={`  table-auto border-collapse border w-full ${roboto.className}`}>
              <thead className="bg-gray-100 sticky top-[-10] z-[50] h-[80px]">

                <tr className=" overflow-y-visible ">
                  {/* Task Line Checkbox */}
                  <th className="px-1 h-[20px]  text-center  text-[11px] sticky left-[-2]  bg-gray-100  pt-8 ">

                  </th>
                  {/* <th
                    className="px-4 h-[20px] text-center text-[11px] pt-8 sticky left-[15px] z-[60] bg-gray-100"
                  >
                    T/L
                  </th> */}

                  {/* Dynamic Other Columns */}
                  {adminTemplate.steps.filter((s)=>{return s.type!=='check'}).map((step) => (
                    <th
                      key={step.id}
                      className="   min-w-[70px]  text-[11px] px-4 text-center pt-8  "
                    >
                      {step.name.toUpperCase()}
                    </th>
                  ))}

                  {/* Time Sensitive Date */}
                  {/* <th className="px-4 h-[50px] min-w-[160px] text-center  text-[11px]  pt-8 ">
                    TIME SENSITIVE DATE
                  </th> */}

                  {/* Non-TimeSensitive Step Columns */}
                  {adminTemplate.steps.filter((s)=>{return s.type=='check'}).map((step, index) => (
                    <th
                      key={step.id}
                      className="cursor-pointer px-4 h-[50px] min-w-[120px] text-center text-[11px]"
                    >
                      <div className="w-full flex flex-col items-center">
                        {step.columnDetails ? <button
                          className="my-2 cursor-pointer"
                          onClick={() => {console.log(step.columnDetails) 
                            HeaderDetails(step.columnDetails as ColumnDetails, step.name)}}

                        >

                          <QuestionMark />
                        </button> : <div className="my-4"></div>}

                        <p>{step.name}</p>
                      </div>
                    </th>

                  ))}

                  {/* Final Columns */}
                  {finalColumns.map((col) => (
                    <th
                      key={col}
                      className="px-4 h-[50px] min-w-[110px] text-center text-xs  pt-8 "
                    >
                      {col.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>

             {data.length > 0  &&
                    <tbody>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={onDragEnd}
                  modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                >

                  <SortableContext
                    items={data.map((r) => r.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {data.map((row: TaskRow, idx: number) => (
                      <DraggableRow key={row.id} id={row.id} className="border border-2 border-b-stone-200  ">

                        {/* <td
                          className={`text-center w-[80px] ${row.taskLineChecked ? "bg-red-600" : "bg-stone-200"} sticky left-[16px] z-[49]`}
                        >
                          <Checkbox
                            variant={row.taskLineChecked ? "default" : "danger"}
                            checked={row.statusTL}
                            onCheckedChange={(v) => handleTaskLineCheckbox(idx)}
                          />
                        </td> */}

                        {/* Other Columns */}
                        {Array.from(
                          new Set(
                            data.flatMap((d: any) =>
                              d.otherColumns.map((col: any) => col.name)
                            )
                          )
                        ).map((headerName, index) => {
                          const colObj = row.otherColumns.find(
                            (col: any) => col.name === headerName
                          );
                          return (
                            <td

                              key={headerName}
                              style={{
                                backgroundColor: row.taskLineChecked
                                  ? "#e7000b"
                                  : index === 0 && colObj?.type=='text'
                                    ? row.color
                                    : "white",
                                color: row.taskLineChecked
                                  ? "white"
                                  : index === 0  
                                    ?  getContrastText(row.color) 
                                    : "#1e2939",
                              }}

                              className={`text-center min-w-[140px]  whitespace-nowrap `}
                            >
                              {colObj ? (
                                colObj.type === "text" ? (
                                  <input
                                    type="text"
                                    placeholder="Enter text..."

                                    className="text-center bg-transparent placeholder:italic focus:outline-none text-xs"
                                    value={colObj.value || ""}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      setData((prev: any) => {
                                        const updated = [...prev];
                                        updated[idx].otherColumns = updated[idx].otherColumns.map((c: any) =>
                                          c.name === colObj.name ? { ...c, value: newValue } : c
                                        );
                                        return updated;
                                      });
                                    }}
                                  />
                                ) : colObj.type === "date" ? (
                                    <Popover>
                            <PopoverTrigger onClick={()=>console.log(colObj)} asChild>
                              {(() => {
                                // --- Determine background color ---
                                let bgColor = "transparent";
                                if (!row.taskLineChecked && colObj.value) {
                                  const today = new Date();
                                  const due = new Date(colObj.value);
                                  const diffDays = Math.ceil(
                                    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                                  );

                                  const { warning, danger } = colObj.timeSensitiveColors || {};
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
                                    {colObj.value ? (
                                      <span
                                        style={{
                                          padding: '4px',
                                          backgroundColor:colObj.isTimeSensitive? bgColor:"transparent",
                                          color: row.taskLineChecked
                                            ? "white"
                                            : colObj.isTimeSensitive
                                              ? textColor
                                              : "gray",
                                        }}
                                        className="font-medium not-italic">
                                        {colObj.value} 
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
                                  colObj.value ? new Date( colObj.value) : undefined
                                }
                               

 onSelect={(date) => {
                                          if (!date) return;
                                          // ✅ Convert to local YYYY-MM-DD to avoid timezone shifts
                                          const yyyy = date.getFullYear();
                                          const mm = String(date.getMonth() + 1).padStart(2, "0");
                                          const dd = String(date.getDate()).padStart(2, "0");
                                          const formatted = `${yyyy}-${mm}-${dd}`;

                                          setData((prev: any) => {
                                            const updated = [...prev];
                                            updated[idx].otherColumns = updated[idx].otherColumns.map(
                                              (c: any) =>
                                                c.name === colObj.name
                                                  ? { ...c, value: formatted }
                                                  : c
                                            );
                                            return updated;
                                          });
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

                        {/* Time Sensitive Date */}
                        



                        {/* Non-time-sensitive steps */}
                        {row.steps.map((stepName) => {
                          const step = row.steps.find(
                            (s: any) => s.columnId === stepName.columnId
                          );
                          return (
                            <td

                              key={stepName.id}

                              onContextMenu={(e) => {
                                e.preventDefault();
                                if (step) {
                                  setNotesPopup({
                                    open: true,
                                    x: e.clientX,
                                    y: e.clientY,
                                    rowIndex: idx,
                                    stepName: step.name,
                                    value: step.notes || ""
                                  });
                                }
                              }}

                              className={`    text-center     w-[80px] h-[9px] 
                  ${row.taskLineChecked && "bg-red-600"}
                  `}
                            >
                              <TooltipProvider>
                                <Tooltip>
                                  {/* ✅ MOVE TooltipTrigger TO THIS DIV */}
                                  <TooltipTrigger asChild>
                                    <div className={`relative flex flex-col justify-center items-center w-full min-h-[40px]
        
         `}
                                    >
                                      <div
                                        onClick={() => {
                                          setData(prev => {
                                            return prev.map((taskRow, rIndex) => {
                                              if (rIndex !== idx) return taskRow;

                                              return {
                                                ...taskRow,
                                                steps: taskRow.steps.map(s =>
                                                  s.columnId === stepName.columnId
                                                    ? { ...s, markedNextRed: !(s.markedNextRed ?? false) }
                                                    : s
                                                )
                                              };
                                            });
                                          });
                                        }}


                                        className={`relative flex flex-col items-center justify-center w-8/12 min-h-[40px] ${row.taskLineChecked ? "bg-red-600" : step ? step.completed ? "bg-lime-500"
                                          : step.markedNext ? "bg-yellow-300"
                                            : step.markedNextRed ? "bg-red-200" : "bg-gray-200" : ""}`}>
                                        {/* Notes icon */}
                                        {step?.notes && (
                                          <div className="absolute flex flex-row items-center justify-end top-0 right-0">
                                            <MarkedNotes />
                                          </div>
                                        )}

                                        {!row.taskLineChecked ? (
                                          <div className="flex flex-col items-center justify-center h-full">

                                            {step ? (
                                              <>
                                                <Checkbox
                                                  variant={step.completed ? "white" : step.markedNext ? "yellow" : "success"}
                                                  checked={step.completed}
                                                  onClick={(e) => e.stopPropagation()}
                                                  onCheckedChange={(v) => handleCheckbox(idx, step.name, v)}
                                                /></>
                                            ) : (
                                              <span className={`${row.taskLineChecked ? "text-gray-200" : "text-gray-400"} text-xs`}>-</span>
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

                        {/* Final Columns */}
                        {finalColumns.map((col) => (
                          <td
                            key={col}
                            className={`pr-4 text-center min-w-[55px] ${row.taskLineChecked ? "bg-red-600" : "bg-white"
                              }`}
                          >
                            <Flag
                              disabled={!row.steps.every((s: any) => s.completed)}
                              checked={!!row[col as FinalColumnKey]}
                              onToggle={(v) => handleFinalCheckbox(idx, col as FinalColumnKey, v)}
                              // color={row[col as FinalColumnKey]?'black':'gray'}/>
                              color={row.steps.every((s: any) => s.completed) ? 'black' : '#999999ff'} />


                          </td>
                        ))}
                      </DraggableRow>
                    ))}
                  </SortableContext>
                </DndContext>
              </tbody>}
            </table>
          </div>

         }



        </CardContent>
      </Card>
      <NotesDialog
        notesPopup={notesPopup}
        setNotesPopup={setNotesPopup}
        open={notesPopup.open}
        stepName={notesPopup.stepName}
        value={notesPopup.value}
        onChange={(v) => setNotesPopup(prev => ({ ...prev, value: v }))}
        onClose={() => setNotesPopup(prev => ({ ...prev, open: false }))}
        onSave={saveNotes}
        onDelete={deleteNotes}
      />
  <ConfirmModal
        isOpen={modalOpen}
        message="You want this task line to be marked as completed? It will delete this taskline, do you want to continue?"
        onCancel={()=>setModalOpen(false) }
        onConfirm={() => {
    if (selectedRow !== null) {
     setData((prev) => { const updated = [...prev]; const wasChecked = updated[selectedRow][selectedCol as FinalColumnKey]; 
      
      updated[selectedRow] = { ...updated[selectedRow], [selectedCol as FinalColumnKey]: true, steps: updated[selectedRow].steps.map((step) => ({ ...step, completed: true, })), }; if (!wasChecked && true) { toast.success("Task Marked as Completed ✅"); 
        // ✅ DELETE THIS ROW 
        const filtered = updated.filter((_, i) => i !== selectedRow); return filtered; } return updated; });
      console.log("Confirmed row:", selectedRow);
    }
    setModalOpen(false);
  }}
      />
    </div>
  );
}

export default UserTaskTable;

