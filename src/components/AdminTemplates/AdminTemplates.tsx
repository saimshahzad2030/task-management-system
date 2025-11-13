 
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

import { AdminTemplate } from "@/global/types";
import { adminTemplates as aT } from "@/global/constant";
import ViewModal from "./ViewModal";
import EditModal from "./EditModal";

 
export default function AdminTemplates( ) {
    const [adminTemplates,setAdminTemplates] = React.useState<AdminTemplate[] | []>(aT)
  const [showForm, setShowForm] = useState(false);

  // new template state
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#000000");
  const [description, setDescription] = useState("");
  const [modalType, setModalType] = useState<"view" | "edit" | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AdminTemplate | null>(null);
  const onView = (id: string) => {
    const found = adminTemplates.find(t => t.id === id);
    setSelectedTemplate(found??null);
    setModalType("view");
  };

  const onEdit = (id: string) => {
    const found = adminTemplates.find(t => t.id === id);
    setSelectedTemplate(found??null);
    setModalType("edit");
  };

  const onDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    setAdminTemplates(prev => prev.filter(t => t.id !== id));
  };
  // steps array
  const [steps, setSteps] = useState([
    {
      id: 1,
      name: "",
      type: "check",
      trigger: "completed",
      timeSensitive: false,
      info: "",
    },
  ]);

  // Add new step
  const addStep = () => {
    setSteps(prev => [
      ...prev,
      {
        id: prev.length + 1,
        name: "",
        type: "check",
        trigger: "completed",
        timeSensitive: false,
        info: "",
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
  };

  // Remove step
  const removeStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const saveTemplate = () => {
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
      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Builder" : "Create New Template"}
      </Button>

      {showForm && (
        <div className="space-y-4 border p-4 rounded bg-gray-100">
          {/* Category Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">Category Name</label>
              <Input value={category} onChange={e => setCategory(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-semibold">Color</label>
              <Input type="color" value={color} onChange={e => setColor(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Description</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          {/* Steps Section */}
          <h3 className="font-bold text-md mt-2">Steps</h3>

          {steps.map((step, index) => (
            <div key={index} className="border p-3 rounded-lg bg-white space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Step #{index + 1}</span>
                {steps.length > 1 && (
                  <Button variant="destructive" size="sm" onClick={() => removeStep(index)}>
                    Remove
                  </Button>
                )}
              </div>

              <Input
                placeholder="Step Name"
                value={step.name}
                onChange={e => updateStep(index, "name", e.target.value)}
              />

              <div className="grid grid-cols-4 gap-2">
                {/* Type */}
                <div>
                  <label className="text-xs">Type</label>
                  <Select onValueChange={(v) => updateStep(index, "type", v)} defaultValue={step.type}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Trigger */}
                <div>
                  <label className="text-xs">Trigger</label>
                  <Select onValueChange={(v) => updateStep(index, "trigger", v)} defaultValue={step.trigger}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent> 
                      <SelectItem value="relation">Relation</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Sensitive */}
                {step.type=='date' && <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    checked={step.timeSensitive}
                    onChange={e => updateStep(index, "timeSensitive", e.target.checked)}
                  />
                  <label className="text-sm">Time Sensitive</label>
                </div>}
                {step.trigger == 'relation' && step.type == 'check' && 
                <div>
                  <label className="text-xs">Related Step</label>
                  <Select onValueChange={(v) => updateStep(index, "trigger", v)} defaultValue={step.trigger}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent> 
                      {steps.map((s,index)=>(
                      <SelectItem value={`s-${index}`}>{s.name}</SelectItem>


                      ))}
                       
                    </SelectContent>
                  </Select>
                </div>}
              </div>

              <Textarea
                placeholder="Info / Instructions"
                value={step.info}
                onChange={e => updateStep(index, "info", e.target.value)}
              />
            </div>
          ))}

          <Button onClick={addStep} variant="secondary">
            + Add Step
          </Button>

         <div className="flex flex-col items-center w-full">
           <Button className="cursor-pointer  mt-3" variant={"default"} onClick={saveTemplate}>
            ✅ Save Template
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
            <td className="border px-3 py-2 font-semibold" style={{ color: t.color }}>
              {t.category}
            </td>

            <td className="border px-3 py-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.color }}></div>
            </td>

            <td className="border px-3 py-2">
              {t.steps.length}
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
              <button
                className="text-blue-600 underline"
                onClick={() => onView(t.id)}
              >
                View
              </button>

            

              <button
                className="text-red-600 underline"
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
 {modalType === "view" && selectedTemplate && (
        <ViewModal template={selectedTemplate} onClose={() => setModalType(null)} />
      )}

      {modalType === "edit" && selectedTemplate && (
        <EditModal template={selectedTemplate} onClose={() => setModalType(null)} />
      )}

    </div>
  );
}
 