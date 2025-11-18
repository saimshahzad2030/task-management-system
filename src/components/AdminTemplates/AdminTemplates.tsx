
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

import { AdminTemplate, Step, TaskRow } from "@/global/types";
import { adminTemplates as aT } from "@/global/constant";
import ViewModal from "./ViewModal";
import EditModal from "./EditModal";
import ColumnHeaderTable from "./ColumnHeaderTable";
import { X } from "lucide-react";
import { toast } from "sonner";

const showRequiredToast = (title: string, desc: string) => {
  toast.custom((t) => (
    <div className="p-4 border border-gray-200 rounded-lg shadow-md w-[300px] bg-red-200">
      <p className="text-gray-900 text-md ">{title}</p>

      <p className="text-gray-700 text-xs mb-2">{desc}</p>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => toast.dismiss(t)} variant="outline">
          Close
        </Button>
      </div>
    </div>
  ));
};

export default function AdminTemplates() {
  const resetForm = () => {
  setCategory("");
  setColor("#000000");
  setDescription("");
  setWarningColor("#FFD93D");
  setDangerColor("#FF6B6B");
  setSteps([
    {
      id: 1,
      name: "",
      completed: false,
      type: "check",
      trigger: "completed",
      timeSensitive: false,
      info: "",
      popup: { description: "" },
      columnDetails: null,
      linkedStep: null,
    },
  ]);

  setEditingTemplate(null); // <— EXIT EDIT MODE
  setShowForm(false);
};

  
  
  const [editingTemplate, setEditingTemplate] = useState<AdminTemplate | null>(null);

  const [adminTemplates, setAdminTemplates] = React.useState<AdminTemplate[] | []>(aT)
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(false);

  // new template state
  const [category, setCategory] = useState("");
  const [warningColor, setWarningColor] = useState("#FFD93D"); // 6 days
const [dangerColor, setDangerColor] = useState("#FF6B6B");
  const [color, setColor] = useState("#000000");
  const [description, setDescription] = useState("");
  const [modalType, setModalType] = useState<"view" | "edit" | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AdminTemplate | null>(null);
  const onView = (id: string) => {
    const found = adminTemplates.find(t => t.id === id);
    setSelectedTemplate(found ?? null);
    setModalType("view");
  };

  const onEdit = (id: string) => {
    const found = adminTemplates.find(t => t.id === id);
    setSelectedTemplate(found ?? null);
    setModalType("edit");
  };
  
const handleEditTemplate = (tmpl: AdminTemplate) => {
  setEditingTemplate(tmpl);

  // Pre-fill form fields
  setCategory(tmpl.category);
  setColor(tmpl.color);
  setDescription(tmpl.description);
  setWarningColor(tmpl?.timeSensitiveColors?.warning.color || 'yellow');
  setDangerColor(tmpl?.timeSensitiveColors?.danger.color || 'red');
  setSteps(tmpl.steps);
  
  setShowForm(true);
};

  const onDelete = (id: string) => {
toast.custom((t) => (
    <div className="p-4 border border-gray-200 rounded-lg shadow-md w-[300px]  ">
      <p className="text-gray-900 text-md ">Are you sure?</p>

      <p className="text-gray-700 text-xs mb-2">you want to delete this template? This action can't be undone</p>

      <div className="flex justify-end">
        <Button className="ml-2" size="sm" onClick={() => {setAdminTemplates(prev => prev.filter(t => t.id !== id))
          toast.dismiss(t)
        }} variant="outline">
          Yes
        </Button>
        <Button className="ml-2" size="sm" onClick={() => toast.dismiss(t)} variant="outline">
          Close
        </Button>
      </div>
    </div>
  )); 
  };
  // steps array
  const [data, setData] = React.useState<TaskRow | null>(null)


  const [steps, setSteps] = useState<Step[]>([]);

  // Add new step
  const addStep = () => {
    setSteps(prev => [
      ...prev,
      {
        id: prev.length + 1,
        name: "",
        completed: false,
        type: "check",
        trigger: "completed",
        timeSensitive: false,
        info: "",
        popup: { description: null },
        columnDetails: null,
        linkedStep: null
      },
    ]);
  };

  // Update step field dynamically
  const updateStep = (index: number, field: string, value: any) => {
    setSteps(prev => {
      const copy = [...prev];
      //@ts-ignore
      copy[index][field] = value;
      return copy;
    });

    // Sync with data if data exists
    // if (data) {
    //   const updatedOtherColumns = steps
    //     .map((s, i) => ({
    //       name: s.name,
    //       type: s.type ?? "text",
    //       value: "",
    //       columnId: i + 1,
    //     }));

    //   const updatedSteps = steps.map((s, i) => ({
    //     columnId: i + 1,
    //     name: s.name,
    //     columnDetails: s.columnDetails,
    //     completed: false,
    //     timeSensitive: s.timeSensitive ?? false,
    //     timeSensitiveDate: s.timeSensitive ? "" : null,
    //     description: s.info || "",
    //     triggerType: s.trigger || "completed", 
    //   }));

    //   setData(prev => prev ? { ...prev, steps: updatedSteps, otherColumns: updatedOtherColumns } : prev);
    // }
  };

  // Remove step
  const removeStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const saveTemplate = () => {
      if (!category.trim()) {
    showRequiredToast(
      "Category Required",
      "Category name is required for creating a template."
    );
    return;
  }

  if (!description.trim()) {
    showRequiredToast(
      "Description Required",
      "Please enter a template description."
    );
    return;
  }

  if (!color) {
    showRequiredToast(
      "Color Required",
      "Please select a color for the template."
    );
    return;
  }

  // Also validate warning/danger colors if needed:
  if (!warningColor) {
    showRequiredToast(
      "Warning Color Required",
      "Please choose a Warning color."
    );
    return;
  }

  if (!dangerColor) {
    showRequiredToast(
      "Danger Color Required",
      "Please choose a Danger color."
    );
    return;
  }

  if (editingTemplate) {
    // ----------------------
    // UPDATE EXISTING TEMPLATE
    // ----------------------
    const updated = {
      ...editingTemplate,
      category,
      color,
      description,
      steps,
      timeSensitiveColors: {
        warning: { days: 6, color: warningColor },
        danger: { days: 3, color: dangerColor }
      },
      updatedAt: new Date()
    };

    setAdminTemplates(prev =>
      prev.map(t => (t.id === editingTemplate.id ? updated : t))
    );

    toast.success("Template updated!");
  } else {
    // ----------------------
    // CREATE NEW TEMPLATE
    // ----------------------
    const newTemplate: AdminTemplate = {
      id: "tmpl_" + Date.now(),
      category,
      color,
      description,
      timeSensitiveColors: {
        warning: { days: 6, color: warningColor },
        danger: { days: 3, color: dangerColor },
      },
      steps,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setAdminTemplates(prev => [...prev, newTemplate]);
    toast.success("New template created!");
  }

  // Reset form
  resetForm(); 
  };

  //   const saveTemplate = () => {
  //     if (!category.trim()) return alert("Category required");

  //     const newTemplate: AdminTemplate = {
  //       id:  "2",
  //       category,
  //       color,
  //       description,
  //       timeSensitiveColors: {
  //         warning: { days: 6, color: "#FFD93D" },
  //         danger: { days: 3, color: "#FF6B6B" },
  //       },
  //       steps,
  //     };
  // console.log({
  //       id: "tmpl_" + Date.now(),
  //       category,
  //       color,
  //       description,
  //       timeSensitiveColors: {
  //         warning: { days: 6, color: "#FFD93D" },
  //         danger: { days: 3, color: "#FF6B6B" },
  //       },
  //       steps,
  //     })
  //     setAdminTemplates(prev => [...prev, newTemplate]);

  //     // reset
  //     setCategory("");
  //     setColor("#000000");
  //     setDescription("");
  //     setSteps([
  //       {
  //         id: 1,
  //         name: "",
  //         type: "check",
  //         trigger: "none",
  //         timeSensitive: false,
  //         info: "",
  //       },
  //     ]);

  //     setShowForm(false);
  //   };

  return (
    <div className="border rounded-lg p-4 bg-white space-y-4 w-full">
      {/* Toggle Form */}
      <Button onClick={() => {
        setShowForm(!showForm)}}>
        {showForm ? "Close Builder" : "Create New Template"}
      </Button>

      {showForm && (
        <div className="space-y-4 border p-4 rounded ">
          <ColumnHeaderTable category={category} color={color} description={description} steps={steps} data={data} setData={setData} />
          {/* Category Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-gray-200 p-4">
              <label className="text-sm font-semibold">Category Name</label>
              <Input className="bg-white border border-gray-400" value={category} onChange={e => setCategory(e.target.value)} />
            </div>

            <div className="rounded-md bg-gray-200 p-4">
              <label className="text-sm font-semibold">Category Color</label>
              <div className="transform scale-75 origin-left">
                <Input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-8 h-8 p-0 border-none rounded-xl"
                />
              </div>
            </div>
            <div className="col-span-1 rounded-md bg-gray-200 p-4 ">
            <label className="text-sm font-semibold">Description</label>
            <Textarea className="bg-white border border-gray-400" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
            <div className="grid-cols-1 flex flex-col items-start w-full rounded-md bg-gray-200 p-4">
              <h1 className="text-sm font-semibold">Time Sensitive Date Properties</h1>
             <div className="flex flex-col items-start w-full mt-4">
              <div className="flex flex-row items-center  h-[20px]">
              <label className="text-xs font-semibold mr-2">6 Days before deadline</label>
              <div className="transform scale-50 origin-left">
                <Input
                  type="color"
               value={warningColor}
        onChange={e => setWarningColor(e.target.value)}
                  className="w-8 h-8 p-0 border-none rounded-xl"
                />
              </div>
            </div>
             <div className=" flex flex-row items-center h-[20px]">
                     <label className="text-xs font-semibold mr-2">3 Days before deadline</label>

              <div className="transform scale-50 origin-left">
                <Input
                  type="color"
                   value={dangerColor}
        onChange={e => setDangerColor(e.target.value)}
                  className="w-8 h-8 p-0 border-none rounded-xl"
                />
              </div>
            </div>
              </div>
              </div>
          </div>

         
        
 
          {/* Steps Section */}
          <h3 className="font-bold text-md mt-2">Columns</h3>

          {steps.map((step, index) => (
            <div key={index} className="border p-3 rounded-lg bg-gray-200 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Column {index + 1}</span>
                {steps.length > 1 && (
                  <Button  size="sm" onClick={() => removeStep(index)}>
                    <X/>
                  </Button>
                )}
              </div>

              <Input
                placeholder="Column Name"
                value={step.name}
                className="border border-gray-400  bg-white"
                onChange={e => updateStep(index, "name", e.target.value)}
              />

              <div className="grid grid-cols-4 gap-2">
                {/* Type */}
                <div>
                  <label className="text-xs">Type</label>
                  <Select onValueChange={(v) => updateStep(index, "type", v)} defaultValue={step.type}>
                    <SelectTrigger className="bg-white min-w-[120px]  border border-gray-400"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Trigger */}
                {step.type == 'check' && <div className="">

                  <label className="text-xs">Trigger</label>
                  <Select  onValueChange={(v) => updateStep(index, "trigger", v)} defaultValue={step.trigger}>
                    <SelectTrigger className="min-w-[120px] bg-white border border-gray-400"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relation">Relation</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  {step.trigger == "popup" && (


                    <Textarea
                      placeholder="Popup Text"
                      className="mt-3 border  rounded bg-white space-y-3 border-gray-400"
                      value={step?.popup?.description ?? ""}
                      onChange={(e) =>
                        updateStep(index, "popup", {
                          ...step.popup,
                          description: e.target.value,
                        })
                      }
                    />


                  )}
                  {step.trigger === "relation" &&
                    steps.filter(s => s.type === "check").length > 1 &&
                    step.type === "check" && (
                      <div>
                        <label className="text-xs">Related Step</label>

                        <Select
                          onValueChange={(v) => updateStep(index, "linkedStep", { id: Number(v) })}
                          defaultValue={step.linkedStep?.id?.toString()}
                        >
                          <SelectTrigger className="min-w-[100px] bg-white border border-gray-400">
                            <SelectValue placeholder="Select step" />
                          </SelectTrigger>

                          <SelectContent>
                            {steps
                              .filter((_, i) => i !== index) // cannot link to itself
                              .map((s, i) => (
                                <SelectItem key={s.id} value={s.id.toString()}>
                                  Step {s.id}: {s.name || "Unnamed"}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                </div>}

                {/* Time Sensitive */}
                {/* {step.type == 'date' && <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    checked={step.timeSensitive}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      setSteps(prev =>
                        prev.map((s, i) => ({
                          ...s,
                          timeSensitive: i === index ? checked : false, // only this one is true
                        }))
                      );
                    }}
                  />
                  <label className="text-sm">Time Sensitive</label>
                </div>} */}

                {/* COLUMN DETAILS SECTION */}
                {step.type === "check" && (
                  <div className="w-full">

                    {/* Checkbox to toggle UI */}
                    <label className="flex items-center  my-2 cursor-pointer ml-2">
                      <input
                        type="checkbox" 
                        checked={!!step.columnDetails}
                        onChange={(e) => {
                          const checked = e.target.checked;

                          updateStep(index, "columnDetails", checked
                            ? { description: "", copyEnabled: false }
                            : null
                          );
                        }}
                      />
                      <span className="text-sm ml-2">Add Column Details</span>
                    </label>

                    {/* Render the panel if columnDetails exists */}
                    {step.columnDetails && (
                      <div className="   mt-[44px] p-3 rounded border border-gray-400 bg-white space-y-3">

                        {/* Description Textarea */}
                        <Textarea
                        className=""
                          placeholder="Details / Instructions"
                          value={step.columnDetails.description}
                          onChange={(e) =>
                            updateStep(index, "columnDetails", {
                              ...step.columnDetails,
                              description: e.target.value,
                            })
                          }
                        />

                        {/* Copy Enabled Checkbox */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={step.columnDetails.copyEnabled}
                            onChange={(e) =>
                              updateStep(index, "columnDetails", {
                                ...step.columnDetails,
                                copyEnabled: e.target.checked,
                              })
                            }
                          />
                          <span className="text-xs">Enable Copy Button</span>
                        </label>

                      </div>
                    )}

                  </div>
                )}

              </div>

              <Textarea
                placeholder="Description"
                className="border border-gray-400 bg-white"
                value={step.description}
                onChange={e => updateStep(index, "description", e.target.value)}
              />
            </div>
          ))}

          <Button onClick={addStep} variant="customNormal">
            + Add Column
          </Button>

          <div className="flex flex-col items-center w-full">
            <Button className="cursor-pointer mt-3" variant="outline" onClick={saveTemplate}>
  {editingTemplate ? "Update Template" : "Save Template"}
</Button>
          </div>
        </div>
      )}

      {/* ✅ Preview saved templates */}
      <div>
        <h3 className="font-bold">Existing Templates</h3>

        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Category</th>
              <th className="border px-3 py-2 text-left">Color</th>
              <th className="border px-3 py-2 text-left">Total Steps</th>
              <th className="border px-3 py-2 text-left">Description</th>
              <th className="border px-3 py-2 text-left">Created At</th>
              <th className="border px-3 py-2 text-left">Updated At</th>
              <th className="border px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {adminTemplates.map((t) => {
              const timeSensitiveCount = t.steps.filter(s => s.timeSensitive).length;

              return (
                <tr key={t.id}>
                  <td className="border px-3 py-2 font-semibold capitalize" style={{ color: t.color }}>
                    {t.category}
                  </td>

                  <td className="border px-3 py-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.color }}></div>
                  </td>

                  <td className="border px-3 py-2">
                    {t.steps.filter((s)=>{return s.type=='check'}).length}
                  </td>

                  <td className="border px-3 py-2">
                    {t.description}
                  </td>
                  <td className="border px-3 py-2">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}
                  </td>

                  <td className="border px-3 py-2">
                    {t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : "-"}
                  </td>

                  <td className="border px-3 py-2 space-x-2">
                    {/* <button
                className="text-blue-600 underline"
                onClick={() => onView(t.id)}
              >
                View
              </button>

             */}
 <button
                      className="text-blue-600 underline cursor-pointer "
                      onClick={() =>handleEditTemplate(t)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 underline cursor-pointer "
                      onClick={() => onDelete(t.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      

    </div>
  );
}
