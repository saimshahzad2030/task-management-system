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
import { fixedColumns, finalColumns } from "@/global/constant";
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




const UserTaskTable = ({ adminTemplate }: UserTaskHeaderProps) => {
  const saveToLocalStorage = () => {
  try {
    const cloned = JSON.parse(JSON.stringify(data)); // DEEP CLONE

    localStorage.setItem("user-task-data", JSON.stringify(cloned));
    setLastSavedData(cloned); // store clean snapshot
    toast.success("Changes saved!");
  } catch (err) {
    toast.error("Failed to save data");
  }
};
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
      toast.custom((t) => (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md w-[300px]">
          <p className="text-gray-900 text-xl mb-3">Are you sure?</p>
          <p className="text-gray-700 text-sm mb-3">
            You want to Uncheck the following column?
          </p>

          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.dismiss(t)} variant="outline">
              Cancel
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setData(prev => {
                  const updated = [...prev];
                  const newSteps = updated[rowIndex].steps.map(s =>
                    s.name === stepName ? { ...s, completed: false } : s
                  );

                  const clickedIndex = updated[rowIndex].steps.findIndex(
                    s => s.name === stepName
                  );

                  updated[rowIndex].steps = applyMarkedNextRed(newSteps, clickedIndex);

                  return updated;
                });
                toast.dismiss(t);
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      ));
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
                       
                              return { ...s, markedNext: true };
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

  // const handleCheckbox = (
  //   rowIndex: number,
  //   stepName: string,
  //   value: boolean | "indeterminate"
  // ) => {
  //   const step = data[rowIndex].steps.find((s) => s.name === stepName);
  //   if (!step) return;

  //   // ✅ Step already completed
  //   if (step.completed) {
  //     toast.custom((t) => (
  //       <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md w-[300px]">
  //         <p className="text-gray-900 text-xl mb-3">
  //           Are you sure?
  //         </p>
  //         <p className="text-gray-700 text-sm mb-3">
  //           You want to Uncheck the folowing column?
  //         </p>
  //         <div className="flex justify-end">
  //           <Button size="sm" onClick={() => toast.dismiss(t)} variant="outline">
  //             Cancel
  //           </Button>
  //           <Button size="sm" onClick={() => {

  //             setData(prev => {
  //               const updated = [...prev];
  //               updated[rowIndex].steps = updated[rowIndex].steps.map(s =>
  //                 s.name === stepName ? { ...s, completed: false } : s
  //               );
  //               return updated;
  //             });
  //             toast.dismiss(t)
  //           }} variant="outline">
  //             Yes
  //           </Button>
  //         </div>
  //       </div>
  //     ));
  //     return;
  //   }

  //   // ✅ Trigger type: completed
  //   if (step.triggerType === "completed") {
  //     setData(prev => {
  //       const updated = [...prev];
  //       updated[rowIndex].steps = updated[rowIndex].steps.map(s =>
  //         s.name === stepName ? { ...s, completed: true } : s
  //       );
  //       return updated;
  //     });
  //     return;
  //   }

  //   // ✅ Trigger type: popup
  //   if (step.triggerType === "popup") {
  //     toast.custom((t) => (
  //       <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md w-[320px]">
  //         <p className="text-gray-800 text-sm mb-3">
  //           {step.popup?.description || "Please confirm this action."}
  //         </p>
  //         <div className="flex justify-end space-x-2">
  //           <Button size="sm" variant="outline" onClick={() => toast.dismiss(t)}>
  //             Cancel
  //           </Button>
  //           <Button
  //             size="sm"
  //             onClick={() => {
  //               setData(prev => {
  //                 const updated = [...prev];
  //                 updated[rowIndex].steps = updated[rowIndex].steps.map(s =>
  //                   s.name === stepName ? { ...s, completed: true } : s
  //                 );
  //                 return updated;
  //               });
  //               toast.dismiss(t);
  //               toast.success("Step marked as completed!");
  //             }}
  //           >
  //             OK
  //           </Button>
  //         </div>
  //       </div>
  //     ),
  //       {
  //         position: "top-center", // 👈 only this toast appears at the top center
  //         duration: 6000, // optional: auto close after 6s
  //         dismissible: true, // allow click to dismiss
  //       });
  //     return;
  //   }

  //   // ✅ Trigger type: relation
  //   if (step.triggerType === "relation") {
  //     const initial = structuredClone(step?.linkedStep?.futureColumnThings || []);

  //     toast.custom((t) => {
  //       function FutureColumnToast() {
  //         const [state, setState] = React.useState(initial);

  //         return (
  //           <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md w-[330px]">
  //             <p className="text-gray-800 text-sm mb-3">
  //               You just finished this column. Mark what is needed for the next column:
  //             </p>

  //             <div className="space-y-2 max-h-[140px] overflow-y-auto mb-3 pr-1">
  //               {state.map((fc, i) => (
  //                 <div
  //                   key={i}
  //                   className="flex items-center justify-between border rounded px-2 py-2"
  //                 >
  //                   <span className="text-xs text-gray-700">{fc.description}</span>
  //                   <Switch
  //                     checked={fc.needed}
  //                     onCheckedChange={(val) => {
  //                       const copy = [...state];
  //                       copy[i] = { ...copy[i], needed: val };
  //                       setState(copy);
  //                     }}
  //                   />
  //                 </div>
  //               ))}
  //             </div>

  //             <div className="flex justify-end space-x-2">
  //               <Button
  //                 size="sm"
  //                 variant="outline"
  //                 onClick={() => toast.dismiss(t)}
  //               >
  //                 Cancel
  //               </Button>

  //               <Button
  //                 size="sm"
  //                 onClick={() => {
  //                   setData(prev =>
  //                     prev.map((row, rIndex) => {
  //                       if (rIndex !== rowIndex) return row;

  //                       return {
  //                         ...row,
  //                         steps: row.steps.map(s => {
  //                           if (s.name === stepName) {
  //                             return {
  //                               ...s,
  //                               completed: true,
  //                               linkedStep: {
  //                                 ...s.linkedStep!,
  //                                 futureColumnThings: state,
  //                               },
  //                             };
  //                           }

  //                           if (step?.linkedStep && s.id === step.linkedStep.id) {
  //                             return { ...s, markedNext: true };
  //                           }

  //                           return s;
  //                         }),
  //                       };
  //                     })
  //                   );

  //                   toast.dismiss(t);
  //                 }}
  //               >
  //                 OK
  //               </Button>
  //             </div>
  //           </div>
  //         );
  //       }

  //       return <FutureColumnToast />;
  //     }
  //       ,
  //       {
  //         position: "top-center", // 👈 only this toast appears at the top center
  //         duration: 6000, // optional: auto close after 6s
  //         dismissible: true, // allow click to dismiss
  //       });
  //     return;
  //   }
  // };


  const handleFinalCheckbox = (
    rowIndex: number,
    col: FinalColumnKey,
    value: boolean | "indeterminate"
  ) => {
    toast.custom((t) =>

    (
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md w-[330px]">
        <p className="text-gray-800 text-sm mb-3">
          You want this task line to be mark as completed? It will delete this taskline, you want to continue?
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
              setData((prev) => {
                const updated = [...prev];

                const wasChecked = updated[rowIndex][col];
                const checked = value === true;

                // ✅ Update this row
                updated[rowIndex] = {
                  ...updated[rowIndex],
                  [col]: checked,
                  steps: updated[rowIndex].steps.map((step) => ({
                    ...step,
                    completed: checked,
                  })),
                };

                if (!wasChecked && checked) {
                  toast.success("Task Marked as Completed ✅");

                  // ✅ DELETE THIS ROW
                  const filtered = updated.filter((_, i) => i !== rowIndex);
                  return filtered;
                }

                return updated;
              });

              toast.dismiss(t);
            }}
          >
            Yes
          </Button>
        </div>
      </div>
    )

      ,
      {
        position: "top-center", // 👈 only this toast appears at the top center
        duration: 6000, // optional: auto close after 6s
        dismissible: true, // allow click to dismiss
      });

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
  const saved = localStorage.getItem("user-task-data");
  if (saved) {
    const parsed = JSON.parse(saved);
    setData(parsed);
    setLastSavedData(JSON.parse(JSON.stringify(parsed))); // deep clone snapshot
  }
}, []);

React.useEffect(() => {
  setHasChanges(JSON.stringify(data) != JSON.stringify(lastSavedData));
}, [data]);


  return (
    <div className="flex flex-col items-start w-full pt-4
    ">
      <AddTaskLine adminTemplate={adminTemplate} data={data} setData={setData} />
      <div className="w-full flex flex-row items-center justify-end">
{hasChanges && (
  <Button variant="customNormal" onClick={saveToLocalStorage}>
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
          <div className="min-w-full overflow-auto max-h-[55vh]">
            <table className={`  table-auto border-collapse border w-full ${roboto.className}`}>
              <thead className="bg-gray-100 sticky top-[-10] z-[50] h-[80px]">

                <tr className=" overflow-y-visible ">
                  {/* Task Line Checkbox */}
                  <th className="px-1 h-[20px]  text-center  text-[11px] sticky left-[-2]  bg-gray-100  pt-8 ">

                  </th>
                  <th
                    className="px-4 h-[20px] text-center text-[11px] pt-8 sticky left-[15px] z-[60] bg-gray-100"
                  >
                    T/L
                  </th>

                  {/* Dynamic Other Columns */}
                  {Array.from(
                    new Set(
                      data.flatMap((d: any) =>
                        d.otherColumns.map((col: any) => col.name)
                      )
                    )
                  ).map((name) => (
                    <th
                      key={name}
                      className="   min-w-[70px]  text-[11px] px-4 text-center pt-8  "
                    >
                      {name.toUpperCase()}
                    </th>
                  ))}

                  {/* Time Sensitive Date */}
                  <th className="px-4 h-[50px] min-w-[160px] text-center  text-[11px]  pt-8 ">
                    TIME SENSITIVE DATE
                  </th>

                  {/* Non-TimeSensitive Step Columns */}
                  {data[0].steps.map((stepName, index) => (
                    <th
                      key={stepName.id}
                      className="cursor-pointer px-4 h-[50px] min-w-[120px] text-center text-[11px]"
                    >
                      <div className="w-full flex flex-col items-center">
                        {stepName.columnDetails ? <button
                          className="my-2 cursor-pointer"
                          onClick={() => HeaderDetails(stepName.columnDetails as ColumnDetails, stepName.name)}

                        >

                          <QuestionMark />
                        </button> : <div className="my-4"></div>}

                        <p>{"Check Column"}</p>
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

                        <td
                          className={`text-center w-[80px] ${row.taskLineChecked ? "bg-red-600" : "bg-stone-200"} sticky left-[16px] z-[49]`}
                        >
                          <Checkbox
                            variant={row.taskLineChecked ? "default" : "danger"}
                            checked={row.statusTL}
                            onCheckedChange={(v) => handleTaskLineCheckbox(idx)}
                          />
                        </td>

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
                                  : index === 0
                                    ? row.color
                                    : "white",
                                color: row.taskLineChecked
                                  ? "white"
                                  : index === 0
                                    ? getContrastText(row.color)
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
                                    <PopoverTrigger asChild>
                                      <button
                                        className={` w-full text-xs text-center py-2 bg-transparent    focus:outline-none cursor-pointer ${row.taskLineChecked
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
                        <td
                          className={cn(
                            "text-center min-w-[160px] cursor-pointer relative transition-colors duration-200",
                            row.taskLineChecked ? "bg-red-600 text-white" : "bg-white text-gray-800"
                          )}
                        >
                          <Popover>
                            <PopoverTrigger asChild>
                              {(() => {
                                // --- Determine background color ---
                                let bgColor = "transparent";
                                if (!row.taskLineChecked && row.timeSensitiveDate) {
                                  const today = new Date();
                                  const due = new Date(row.timeSensitiveDate);
                                  const diffDays = Math.ceil(
                                    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                                  );

                                  const { warning, danger } = row.timeSensitiveColors || {};
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
                                    {row.timeSensitiveDate ? (
                                      <span
                                        style={{
                                          padding: '4px',
                                          backgroundColor: bgColor,
                                          color: row.taskLineChecked
                                            ? "white"
                                            : row.timeSensitiveDate
                                              ? textColor
                                              : "gray",
                                        }}
                                        className="font-medium not-italic">
                                        {row.timeSensitiveDate}
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
                                  row.timeSensitiveDate ? new Date(row.timeSensitiveDate) : undefined
                                }
                                onSelect={(date) => {
                                  setData((prev: any) => {
                                    const updated = [...prev];
                                    if (date) {
                                      const localDate = new Date(
                                        date.getTime() - date.getTimezoneOffset() * 60000
                                      )
                                        .toISOString()
                                        .split("T")[0];
                                      updated[idx].timeSensitiveDate = localDate;
                                    }
                                    return updated;
                                  });
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </td>



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
                                    <div className={`relative flex flex-col items-center w-full h-full 
        
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


                                        className={`relative flex flex-col items-center w-8/12 h-full ${row.taskLineChecked ? "bg-red-600" : step ? step.completed ? "bg-lime-500"
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
              </tbody>
            </table>
          </div>



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

    </div>
  );
}

export default UserTaskTable;

