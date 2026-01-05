
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { AdminTemplate, Categories, ColumnDetails, Step, TaskRow } from "@/global/types";
// import { adminTemplates as aT } from "@/global/constant";
import ColumnHeaderTable from "./ColumnHeaderTable";
import { X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Switch } from "../ui/switch";
import { config } from "../../../config/config";
import { allowTemplateAccessToUser, createAdminTemplate, deleteTemplate, fetchAllTemplatesService, updateAdminTemplate } from "@/services/adminTemplate.services";
import SkeletonLoader from "../Loader/SkeletonLoader";
import { fetchAllUsersService } from "@/services/user.services";
import { set } from "zod";
import { QuestionMark } from "@/global/icons";
import FullScreenLoader from "../Loader/FullScreenLoader";
import { useAlert } from "../CenteredError/ShowCenteredError";
import { getInvalidCheckIndexes, isInvalidCheckPlacement } from "@/utils/otherutils";
import UserTaskTable from "../UserTaskTable/UserTaskTable";
import { UserMenuPopover } from "../UserTasksHeader/UserTaskHeader";

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
    setCategories([]);
    setColor("#000000");
    setDescription("");
    setWarningColor("#FFD93D");
    setDangerColor("#FF6B6B");
    setSteps([
      {
        id: 1,
        name: "",
        completed: false,
        columnDetailsChecked: false,

        type: "check",
        trigger: "completed",
        info: "",
        popupDescription: "",
        columnDetails: { description: "", copyEnabled: true },
        linkedStep: null,
      },
    ]);
    setCategories([
      {
        color: "#000000",
        name: "Category 1",
        id: 1
      },
    ]);
    setEditingTemplate(null); // <— EXIT EDIT MODE
    setShowForm(false);
  };

  const { showAlert } = useAlert();

  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);



  const [editingTemplate, setEditingTemplate] = useState<AdminTemplate | null>(null);
  const [usersToAssign, setUsersToAssign] = useState<{
    id: number,
    username: string,
    email: string
  }[]>([])
  const [usersToAssignLoading, setUsersToAssignLoading] = useState(false)
  const [usersToAssignFinalLoading, setUsersToAssignFinalLoading] = useState(false)
  const [saveTemplateLoading, setSaveTemplateLoading] = useState(false)
  const [adminTemplates, setAdminTemplates] = React.useState<AdminTemplate[] | []>()
  const [showForm, setShowForm] = useState(false);
  const [templateFetchLoading, setTemplateFetchLoading] = useState(true);
  const [edit, setEdit] = useState(false);

  // new template state
  const [categories, setCategories] = useState<Categories[]>([{ color: "#000000", name: "Category 1", id: 1 }]);
  const [warningColor, setWarningColor] = useState("#FFD93D"); // 6 days
  const [templateName, setTemplateName] = useState(""); // 6 days
  const [dangerColor, setDangerColor] = useState("#FF6B6B");
  const [color, setColor] = useState("#000000");
  const [description, setDescription] = useState("");
  const [modalType, setModalType] = useState<"view" | "edit" | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AdminTemplate | null>(null);
  const onView = (id: string) => {
    const found = adminTemplates?.find(t => t.id === id);
    setSelectedTemplate(found ?? null);
    setModalType("view");
  };

  const onEdit = (id: string) => {
    const found = adminTemplates?.find(t => t.id === id);
    setSelectedTemplate(found ?? null);
    setModalType("edit");
  };

  const handleEditTemplate = (tmpl: AdminTemplate) => {
    setEditingTemplate(tmpl);
    setTemplateName(tmpl.name)
    setCategories(tmpl.categories);
    setDescription(tmpl.description);
    setSteps(tmpl.steps);
    console.log("tmpl", tmpl)
    setShowForm(true);
  };

  const onDelete = (id: string) => {
    toast.custom((t) => (
      <div className="p-4 border border-gray-200 rounded-lg shadow-md w-[300px]  bg-white border border-red-500">
        <p className="text-gray-900 text-md ">Are you sure?</p>

        <p className="text-gray-700 text-xs mb-2">you want to delete this template? This action can't be undone</p>

        <div className="flex justify-end">
          <Button className="ml-2 bg-red-500 text-white" size="sm" onClick={async () => {

            let deletingTemplate = await deleteTemplate(Number(id))
            if (deletingTemplate.status == 200 || deletingTemplate.status == 201) {
              toast.success(deletingTemplate.message);
              setAdminTemplates(prev => prev?.filter(t => t.id !== id));
              toast.dismiss(t)

            }
            else {
              toast.error(deletingTemplate.message);
              toast.dismiss(t)
            }
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
  const [invalidStepIndexes, setInvalidStepIndexes] = useState<number[]>([]);


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
        columnDetailsChecked: false,
        info: "",
        timeSensitiveColors: {
          warning: { days: 6, color: "#FFD93D" },
          danger: { days: 3, color: "#FF6B6B" },
        },

        popupDescription: null,
        columnDetails: { description: '', copyEnabled: true },
        linkedStep: null
      },
    ]);
  };
  const addCategory = () => {
    setCategories(prev => [
      ...prev,
      {
        id: prev.length + 1,
        color: "#000000",
        name: "",

      },
    ]);
    const updatedSteps = steps.map(step => {
      // Only update steps that have columnDetails
      if (step.columnDetails && Array.isArray(step.columnDetails)) {
        return {
          ...step,
          columnDetails: [
            ...step.columnDetails,
            {
              description: "",
              copyEnabled: false,
              category: { id: categories.length + 1, name: "", color: "#000000" }
            }
          ]
        };
      }
      return step;
    });

    // Then update your state or call updateStep for each
    setSteps(updatedSteps);
  };
  const updateCategory = <K extends keyof Categories>(
    index: number,
    field: K,
    value: Categories[K]
  ) => {
    setCategories(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
    setSteps(prevSteps =>
      prevSteps.map(step => ({
        ...step,
        columnDetails: Array.isArray(step.columnDetails)
          ? step.columnDetails.map(col => {
            if (col.category.id === index + 1) { // match category
              return {
                ...col,
                category: {
                  ...col.category,
                  [field]: value
                }
              };
            }
            return col;
          })
          : step.columnDetails // leave as is if not an array
      }))
    );

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
  const removeCategory = (index: number) => {
    if (categories
      .length <= 1) return;
    setCategories(prev => prev.filter((_, i) => i !== index));
  };
    function moveUp(index: number) {
    if (index === 0) return;

    setSteps(prev => {
      const copy = [...prev];
      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];

      if (isInvalidCheckPlacement(copy, index - 1)) {
        toast.error(
          "A check-type step cannot be placed between text or date steps."
        );
        return prev; // rollback
      }

      return copy;
    });
  }
  function moveDown(index: number) {
    setSteps(prev => {
      if (index === prev.length - 1) return prev;

      const copy = [...prev];
      [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];

      if (isInvalidCheckPlacement(copy, index + 1)) {
        toast.error(
          "A check-type step cannot be placed between text or date steps."
        );
        return prev; // rollback
      }

      return copy;
    });
  }
 
  function reorderSteps(fromIndex: number, toIndex: number) {
    setSteps(prev => {
      const copy = [...prev];
      const moved = copy.splice(fromIndex, 1)[0];
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  }
  
  const saveTemplate = async () => {
    setSaveTemplateLoading(true)
    if (!categories) {

      showAlert('Category Required\nCategory name is required for creating a template.', 'error')
      setSaveTemplateLoading(false)

      return;
    }
    if (!templateName.trim()) {
      showAlert("Please enter Template name.", 'error')


      setSaveTemplateLoading(false)

      return;
    }
    if (!description.trim()) {
      showAlert("Please enter Template description.", 'error')


      setSaveTemplateLoading(false)

      return;
    }

    if (!color) {
      showAlert("Please select at least one color for the template.", 'error')


      setSaveTemplateLoading(false)

      return;
    }

    // Also validate warning/danger colors if needed:
    if (!warningColor) {
      showAlert("Please choose a Warning color.", 'error')


      setSaveTemplateLoading(false)

      return;
    }

    if (!dangerColor) {
      showAlert("Danger Color Required. Please choose a Danger color.", 'error')


      setSaveTemplateLoading(false)

      return;
    }
    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      showAlert("Columns Required Please add at least one Column to the template.", 'error')


      setSaveTemplateLoading(false)

      return;
    }
    const invalidCheckIndexes = getInvalidCheckIndexes(steps);

    if (invalidCheckIndexes.length > 0) {
      setInvalidStepIndexes(invalidCheckIndexes);

      toast.error(
        "Check-type column cannot be placed between text or date columns."
      );

      setSaveTemplateLoading(false);
      return;
    } else {
      setInvalidStepIndexes([]);
    }
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (!step.name || !step.name.trim()) {

        showAlert(`Name Required for column ${i + 1}`, "error")
        setSaveTemplateLoading(false)

        return;
      }
      if (!step.type || !step.type.trim()) {
        showAlert(
          `column ${i + 1}: Please select a type`

          , 'error')

        setSaveTemplateLoading(false)

        return;
      }


      if (categories) {
        for (let j = 0; j < categories.length; j++) {
          const col = categories[j];
          if (!col.color || !col.name.trim()) {
            showAlert(
              `Please Fill the category name for Category ${j + 1} `

              , 'error')

            setSaveTemplateLoading(false)

            return;
          }
        }
      }
      // if (step.columnDetails && Array.isArray(step.columnDetails)) {
      //   for (let j = 0; j < step.columnDetails.length; j++) {
      //     const col = step.columnDetails[j];
      //     if (!col.description || !col.description.trim()) {
      //       showAlert(
      //         `column ${i + 1}: Please Fill the column details for category ${col.category.name}`

      //         , 'error')

      //       setSaveTemplateLoading(false)

      //       return;
      //     }
      //   }
      // }
      if (step.trigger == 'relation' && !step.linkedStep) {

        showAlert(
          `column ${i + 1}: Please Specify Related Step`

          , 'error')
        setSaveTemplateLoading(false)

        return;
      }


    }

    if (editingTemplate) {

      const updated = {
        ...editingTemplate,
        categories,
        color,
        description,
        steps,

        updatedAt: new Date()
      };
      let nTemplate = await updateAdminTemplate(Number(editingTemplate.id), updated)
      setSaveTemplateLoading(false)

      if (nTemplate.status == 201 || nTemplate.status == 200) {
        // toast.success(nTemplate.message);
        setAdminTemplates(prev =>
          prev?.map(t => (t.id === editingTemplate.id ? nTemplate.data : t))
        );
        showAlert('Template Saved and Updated', 'success')

        // setData(null)
        // resetForm();
      }
      else {
        toast.error(nTemplate.message);

      }

    } else {
      // ----------------------
      // CREATE NEW TEMPLATE
      // ----------------------
      const newTemplate: AdminTemplate = {
        id: "tmpl_" + Date.now(),
        name: templateName,
        categories,
        description,

        steps,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      console.log(newTemplate, "New one")
      let nTemplate = await createAdminTemplate(newTemplate)

      setSaveTemplateLoading(false)

      if (nTemplate.status == 201 || nTemplate.status == 200) {
        // toast.success(nTemplate.message);
        setAdminTemplates(prev => [...(prev || []), nTemplate.data[0]]);
        showAlert('Template Saved and Updated', 'success')
        setEditingTemplate(nTemplate.data[0])
        // setData(null)
        // resetForm();
      }
      else {
        toast.error(nTemplate.message);

      }
    }

    // Reset form
  };

  React.useEffect(() => {
    const fetchTemplates = async () => {
      let temps = await fetchAllTemplatesService()
      setAdminTemplates(temps.data || [])
      setTemplateFetchLoading(false)
    }
    fetchTemplates()
  }, [])
  const isSingleColumnDetail = (
    value: ColumnDetails | undefined
  ): value is { description: string; copyEnabled: boolean } => {
    return !!value && !Array.isArray(value);
  };

  return (
    <div className="border rounded-lg p-4 bg-white space-y-4 w-full">
      <div className="flex flex-row items-center w-full py-4">
       <UserMenuPopover/>
      </div>
      {/* Toggle Form */}
      <Button onClick={() => {

        resetForm();     // ← RESET EVERYTHING when closing

        setShowForm(!showForm)
        setTemplateName(``)
      }}>
        {showForm ? "Back to Templates" : "Create New Template"}
      </Button>

      {showForm && (
        <div className="space-y-4 border p-4 rounded   ">
          {/* Category Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-gray-200 p-4">
              <label className="text-sm font-semibold"> Name</label>
              <Input className="bg-white border border-gray-400" placeholder="Enter Template Name" value={templateName} onChange={e => setTemplateName(e.target.value)} />
            </div>

            {/* <div className="rounded-md bg-gray-200 p-4">
              <label className="text-sm font-semibold">Category Color</label>
              <div className="transform scale-75 origin-left">
                <Input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-8 h-8 p-0 border-none rounded-xl"
                />
              </div>
            </div> */}
            <div className="col-span-1 rounded-md bg-gray-200 p-4 ">
              <label className="text-sm font-semibold">Description</label>
              <Textarea className="bg-white border border-gray-400 " placeholder="Enter Template Description" value={description} onChange={e => setDescription(e.target.value)} />
            </div>

          </div>

          <h3 className="font-bold text-md mt-2 mb-0">Categories</h3>
          <div className="w-full grid grid-cols-5 gap-x-4">
            {categories.map((step, index) => (
              <div style={{ border: `2px solid ${step.color}` }} key={index} className="mt-4 border p-3 rounded-lg bg-gray-100 space-y-2">

                <div className="flex justify-between">

                  <span className="font-semibold">Category {index + 1}</span>
                  {categories.length > 1 && (
                    <Button size="sm" onClick={() => removeCategory(index)}>
                      <X />
                    </Button>
                  )}
                </div>

                <Input
                  placeholder="Category Name"
                  value={step.name}
                  className="border border-gray-400  bg-white"
                  onChange={e => updateCategory(index, "name", e.target.value)}
                />


                <div className="rounded-md bg-gray-100 flex flex-row items-center">
                  <div className="transform scale-75 origin-left ">
                    <Input
                      type="color"
                      value={step.color}
                      onChange={e => updateCategory(index, "color", e.target.value)}

                      className="w-8 h-8 p-0 border-none rounded-xl cursor-pointer"
                    />
                  </div>
                  <label className="text-[9px]  text-gray-500 ">Change Color</label>
                </div>


              </div>
            ))}
          </div>
          <Button onClick={addCategory} variant="customNormal">
            + Add Category
          </Button>
          {/* Steps Section */}
          <h3 className="font-bold text-md mt-2">Columns</h3>
          <DragDropContext
            onDragEnd={(result) => {
              if (!result.destination) return;
              reorderSteps(result.source.index, result.destination.index);
            }}
          >
            <Droppable droppableId="steps">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {steps.map((step, index) => {
                     
                    return (<Draggable key={index} draggableId={String(index)} index={index} >
                      {(provided) => (
                        <div key={step?.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border p-3 rounded-lg bg-gray-200 border space-y-2 mt-4  
                            ${invalidStepIndexes.includes(index) ? "border-red-500 bg-red-100 animate-pulse" : "border-gray-700  "}
                          `}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {/* DRAG HANDLE */}
                              <div {...provided.dragHandleProps} className="cursor-move px-2">
                                ☰
                              </div>

                              <span className="font-semibold">Column {index + 1}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* UP BUTTON */}
                              <Button size="sm" onClick={() => {
                                  setInvalidStepIndexes(prev =>
    prev.filter(i => i !== index)
  );
                                 moveUp(index)}}>↑</Button>

                              {/* DOWN BUTTON */}
                              <Button size="sm" onClick={() =>{ 
                                  setInvalidStepIndexes(prev =>
    prev.filter(i => i !== index)
  );
                                moveDown(index)}}>↓</Button>

                              {/* DELETE */}
                              {steps.length > 1 && (
                                <Button size="sm" onClick={() => removeStep(index)}>
                                  <X />
                                </Button>
                              )}
                            </div>
                          </div>

                          <Input
                            placeholder="Column Name"
                            value={step.name}
                            className="border border-gray-400  bg-white"
                            onChange={e => {
                                
                              updateStep(index, "name", e.target.value)}}
                          />

                          <div className="grid grid-cols-9 gap-2">
                            {/* Type */}
                            <div className="col-span-2">
                              <span className="flex flex-col text-xs leading-none gap-[1px] mb-4  ">
                                <span className="text-sm font-semibold">Type</span>  <span className="font-normal  text-xs">Specify the type of Your Column (text,date or checkbox)</span></span>

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
                            {step.type == 'check' && <div className={`${step.linkedStep?.futureColumnThings ? "col-span-4" : "col-span-3"}`}>

                              <span className="flex flex-col text-xs leading-none gap-[1px] mb-4  ">
                                <span className="text-sm font-semibold"> Complete Task Trigger</span>  <span className="font-normal  text-xs">Do you want the task to do anything when it is marked completed?</span></span>
                              <Select onValueChange={(v) => updateStep(index, "trigger", v)} defaultValue={step.trigger}>
                                <SelectTrigger className="min-w-[120px] bg-white border border-gray-400"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="relation">Sub Tasks</SelectItem>
                                  <SelectItem value="popup">Popup</SelectItem>
                                  <SelectItem value="completed">None</SelectItem>
                                </SelectContent>
                              </Select>
                              {step.trigger == "popup" && (


                                <Textarea
                                  placeholder="Popup Text"
                                  className="mt-3 border  rounded bg-white space-y-3 border-gray-400"
                                  value={step?.popupDescription ?? ""}
                                  onChange={(e) =>
                                    updateStep(index, "popupDescription",
                                      e.target.value
                                    )
                                  }
                                />


                              )}
                              {step.trigger === "relation" &&
                                <>
                                  <label className="text-xs font-semibold text-gray-700 mt-3">
                                    Sub tasks to do before marking that related column
                                  </label>
                                  <div className="    rounded  w-auto">


                                    <div className="space-y-2 mt-2 mb-2 w-full">
                                      {(step.linkedStep?.futureColumnThings || []).map((item, i) => (
                                        <div className="flex flex-col items-start  bg-white w-full px-2 pb-2">
                                          <div className="flex flex-row items-center justify-between w-full ">
                                            <span className="text-xs">Sub Task {i + 1}</span>
                                            <button
                                              className="text-gray-700 text-sm cursor-pointer  "
                                              onClick={() => {
                                                const copy = step.linkedStep?.futureColumnThings
                                                  ? [...step.linkedStep.futureColumnThings]
                                                  : [];

                                                copy.splice(i, 1);

                                                updateStep(index, "linkedStep", {
                                                  ...step.linkedStep,
                                                  futureColumnThings: copy,
                                                });
                                              }}
                                            >
                                              ✕
                                            </button>
                                          </div>
                                          <div
                                            key={i}
                                            className="flex items-center     w-full "
                                          >

                                            <Textarea
                                              rows={1}
                                              className=" text-xs border rounded px-2 py-1 w-full"
                                              placeholder={`Description for Sub Task ${i + 1}`}
                                              value={item.description}
                                              onChange={(e) => {
                                                const copy = step.linkedStep?.futureColumnThings
                                                  ? [...step.linkedStep.futureColumnThings]
                                                  : [];

                                                copy[i] = {
                                                  ...copy[i],
                                                  description: e.target.value,
                                                };

                                                updateStep(index, "linkedStep", {
                                                  ...step.linkedStep,
                                                  futureColumnThings: copy,
                                                });
                                              }}
                                            />

                                            {/* Needed Switch */}
                                            <div className="flex flex-col items-start w-auto ml-2">
                                              <span className="text-xs text-gray-600 ml-2 text-right">Enter Reminder Note to Future Column?</span>
                                              <div className="flex flex-row items-center justify-end mt-2 w-full">
                                                <span className={`text-xs ${item.needed ? "text-gray-400" : "text-gray-800"} mx-2`}>No</span>

                                                <Switch
                                                  checked={item.needed === true || item.needed === "true"}
                                                  onCheckedChange={(val) => {
                                                    const copy = step.linkedStep?.futureColumnThings
                                                      ? [...step.linkedStep.futureColumnThings]
                                                      : [];

                                                    copy[i] = { ...copy[i], needed: val };
                                                    console.log("val", val)
                                                    updateStep(index, "linkedStep", {
                                                      ...step.linkedStep,
                                                      futureColumnThings: copy,
                                                    });
                                                  }}
                                                />
                                                <span className={`text-xs ${item.needed ? "text-gray-800" : "text-gray-400"} mx-2`}>Yes</span>
                                              </div>
                                            </div>


                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Add New Field */}
                                    <button
                                      className="rounded-lg cursor-pointer  text-xs px-2 py-1 border rounded bg-white"
                                      onClick={() => {
                                        const prev = step.linkedStep?.futureColumnThings || [];
                                        const updated = [
                                          ...prev,
                                          { needed: false, description: "" },
                                        ];

                                        updateStep(index, "linkedStep", {
                                          ...step.linkedStep,
                                          futureColumnThings: updated,
                                        });
                                      }}
                                    >
                                      + Add Sub Task
                                    </button>
                                  </div>
                                  {steps.filter(s => s.type === "check").length > 1 &&
                                    step.type === "check" && (
                                      <div className="flex flex-row ">
                                        <div className=" ">
                                          <label className="text-xs">Related Step</label>
                                          <Select
                                            onValueChange={(v) =>
                                              updateStep(index, "linkedStep", {
                                                index: Number(v),
                                                notes: step.linkedStep?.notes || "",
                                                futureColumnThings: step.linkedStep?.futureColumnThings || [],
                                              })
                                            }
                                            defaultValue={
                                              steps.findIndex(s => s.id === step.linkedStep?.id).toString() || ""
                                            }
                                          >
                                            <SelectTrigger className="min-w-[100px] bg-white border border-gray-400">
                                              <SelectValue placeholder="Select step" />
                                            </SelectTrigger>

                                            <SelectContent>
                                              {steps.map((s, ind) => (
                                                <SelectItem key={s.id} disabled={ind === index} value={ind.toString()}>
                                                  Step {ind + 1}: {s.name || "Unnamed"}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>

                                        </div>
                                        {/* <div className="flex flex-col items-start w-full  ml-4">
                                          <label className="text-xs my-1">Notes</label>

                                          <Textarea

                                            value={step.linkedStep?.notes}
                                            onChange={(val) => {
                                              updateStep(index, "linkedStep", {
                                                ...step.linkedStep,
                                                notes: val.target.value,
                                              });
                                            }}
                                            placeholder="Notes..." className="bg-white w-full " />
                                        </div> */}
                                      </div>
                                    )}
                                </>}
                            </div>}
                            {step.type == 'check' &&
                              <div className="col-span-3">

                                <span className="flex flex-col text-xs leading-none gap-[1px]   ">
                                  <span className="text-sm font-semibold">Check Column</span>
                                  <span className="font-normal  text-xs">Force Column to UNCHECK itself after X days
                                    (example: For a Contact Customer task, you want it to unmark itself every X days)
                                  </span>
                                </span>
                                <div className="flex flex-row items-center w-auto  mb-4 mt-2">
                                  <div className={`flex flex-row items-center ${step.unCheckOption?.enabled ? "" : "my-[9px]"}`}>
                                    <span className={`text-xs ${step.unCheckOption?.enabled ? "text-gray-400" : "text-gray-800"} mr-2`}>No</span>

                                    <Switch
                                      checked={step.unCheckOption?.enabled || false}
                                      onCheckedChange={(val) => {

                                        updateStep(index, "unCheckOption", {
                                          ...step.unCheckOption,
                                          enabled: val,   // ← USE val instead of true
                                        });
                                      }}
                                    />
                                    <span className={`text-xs ${step.unCheckOption?.enabled ? "text-gray-800" : "text-gray-400"} mx-2 mr-4`}>Yes</span>

                                    {step.unCheckOption?.enabled &&
                                      <Select onValueChange={(v) => updateStep(index, "unCheckOption"
                                        , {
                                          ...step.unCheckOption,
                                          days: v,
                                        }
                                      )}
                                        defaultValue={"1".toString()}>
                                        <SelectTrigger className="min-w-[120px] bg-white border border-gray-400"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          {Array.from({ length: 30 }).map((a, index) => (
                                            <SelectItem value={(index + 1).toString()}>{`${index + 1} Day`}</SelectItem>

                                          ))}

                                        </SelectContent>
                                      </Select>}
                                  </div>
                                </div>



                              </div>}
                            {/* Time Sensitive */}
                            {step.type == 'date' && <div className="flex flex-col items-start w-full col-span-4">
                              <label className="mt-6 flex items-center gap-2 cursor-pointer ">
                                <input
                                  type="checkbox"
                                  checked={step.isTimeSensitive || false}
                                  onChange={(e) => {
                                    updateStep(index, "isTimeSensitive", e.target.checked);
                                    // if (!Array.isArray(step.columnDetails)) return
                                    // const updated = step.columnDetails.map((item, i) =>
                                    //   i === catIndex ? { ...item, copyEnabled: e.target.checked } : item
                                    // );
                                    // updateStep(index, "columnDetails", updated);
                                  }
                                  }
                                />
                                <span className="text-xs font-bold">Is this date time sensetive? (Example: ECD)</span>
                              </label>
                              {step.isTimeSensitive && (
                                <div className="grid-cols-1 flex flex-col items-start  mt-4 rounded-md bg-gray-200   bg-gray-300 px-4 py-2">
                                  <h1 className="text-sm font-semibold">Time Sensitive Date Properties</h1>
                                  <div className="flex flex-col items-start  mt-1 rounded-md">

                                    {/* Warning */}
                                    <div className="flex flex-row items-center h-[20px] mb-2">
                                      <input
                                        type="number"
                                        className="w-12 h-6 bg-white text-center text-xs border border-gray-400"
                                        value={step?.timeSensitiveColors?.warning.days || 3}
                                        onChange={(e) =>
                                          updateStep(index, "timeSensitiveColors", {
                                            ...step.timeSensitiveColors,
                                            warning: {
                                              ...step?.timeSensitiveColors?.warning,
                                              days: Number(e.target.value),
                                            },
                                          })
                                        }
                                      />
                                      <label className="text-xs ml-1 font-semibold mr-2">Days before deadline</label>
                                      <Input
                                        type="color"
                                        value={step?.timeSensitiveColors?.warning?.color}
                                        onChange={(e) =>
                                          updateStep(index, "timeSensitiveColors", {
                                            ...step.timeSensitiveColors,
                                            warning: {
                                              ...step?.timeSensitiveColors?.warning,
                                              color: e.target.value,
                                            },
                                          })
                                        }
                                        className="w-8 h-8 p-0 border-none rounded-xl"
                                      />
                                    </div>

                                    {/* Danger */}
                                    <div className="flex flex-row items-center h-[20px]">
                                      <input
                                        type="number"
                                        className="w-12 h-6 bg-white text-center text-xs border border-gray-400"
                                        value={step?.timeSensitiveColors?.danger?.days}
                                        onChange={(e) =>
                                          updateStep(index, "timeSensitiveColors", {
                                            ...step.timeSensitiveColors,
                                            danger: {
                                              ...step?.timeSensitiveColors?.danger,
                                              days: Number(e.target.value),
                                            },
                                          })
                                        }
                                      />
                                      <label className="text-xs ml-1 font-semibold mr-2">Days before deadline</label>
                                      <Input
                                        type="color"
                                        value={step?.timeSensitiveColors?.danger?.color}
                                        onChange={(e) =>
                                          updateStep(index, "timeSensitiveColors", {
                                            ...step.timeSensitiveColors,
                                            danger: {
                                              ...step?.timeSensitiveColors?.danger,
                                              color: e.target.value,
                                            },
                                          })
                                        }
                                        className="w-8 h-8 p-0 border-none rounded-xl"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>}

                            {/* COLUMN DETAILS SECTION */}

                          </div>
                          {step.type == 'check' && <div className="w-full flex flex-col items-start">
                            <div className="w-full flex flex-row items-center justify-between">
                              <div className="flex flex-row items-center">   <label className="font-semibold text-xs mr-2">Please enter guidelines or text/email Templates to for this task. This guideline will show up above the column title by clicking this icon:</label> <QuestionMark />
                              </div>
                              <label className="flex items-center  mt-2 cursor-pointer ">
                                <input
                                  type="checkbox"
                                  checked={!!step.columnDetailsChecked}
                                  onChange={(e) => {
                                    const checked = e.target.checked;

                                    // Build columnDetails array only if checked
                                    const updatedArray = checked
                                      ? categories.map((cat) => ({
                                        description: "",
                                        copyEnabled: false,
                                        category: cat,
                                      }))
                                      : null; // set to null if unchecked

                                    // Update the step state
                                    updateStep(index, "columnDetailsChecked", checked);
                                    updateStep(index, "columnDetails", updatedArray);
                                  }}

                                />
                                <span className="text-sm ml-2">Seperate Guidelines by Category</span>

                              </label>
                            </div>

                          </div>}
                          {step.type === "check" && (
                            <div className="w-full col-span-4">

                              {/* Checkbox to toggle UI */}


                              {/* Render the panel if columnDetails exists */}
                              {step.columnDetailsChecked ? <div className="grid grid-cols-3 gap-2 w-full  rounded-md">

                                <>
                                  <p className="col-span-3 text-gray-500 text-xs">Below are the details of this column with respect to the template Categories.</p>
                                  {Array.isArray(step.columnDetails) && step.columnDetails.map((cat, catIndex) => (
                                    <div key={catIndex} className="my-1 flex flex-col items-start w-full border border-gray-500 rounded-md p-2">

                                      <div className="flex flex-row items-center ">
                                        <h3 className="font-semibold text-gray-600 text-sm">{`(Category ${catIndex + 1}) `}<span className="text-xs text-gray-500">{cat.category.name}</span></h3>
                                        <div className="ml-2 w-4 h-4 rounded-full" style={{ backgroundColor: cat.category.color }}></div>
                                      </div>
                                      <div className=" w-full   mt-2  rounded border      flex flex-row items-center">

                                        <Textarea
                                          className="w-full bg-white border border-gray-400  "
                                          placeholder="Column Details"
                                          value={step.columnDetails && Array.isArray(step.columnDetails) ? step.columnDetails[catIndex].description : ""}
                                          onChange={(e) => {
                                            if (!Array.isArray(step.columnDetails)) return
                                            const updated = step?.columnDetails.map((item, i) =>
                                              i === catIndex ? { ...item, description: e.target.value } : item
                                            );
                                            updateStep(index, "columnDetails", updated);
                                          }}
                                        />



                                        {/* <label className="flex items-center gap-2 cursor-pointer ml-4">
                                <input
                                  type="checkbox"
                                  checked={step.columnDetails ? step.columnDetails[catIndex].copyEnabled : false}
                                  onChange={(e) => {
                                    if (!Array.isArray(step.columnDetails)) return
                                    const updated = step.columnDetails.map((item, i) =>
                                      i === catIndex ? { ...item, copyEnabled: e.target.checked } : item
                                    );
                                    updateStep(index, "columnDetails", updated);
                                  }
                                  }
                                />
                                <span className="text-xs">Enable Copy Button</span>
                              </label> */}

                                      </div>
                                    </div>
                                  ))}
                                </>
                              </div> :
                                <>
                                  <Textarea
                                    className="border border-gray-400 bg-white w-auto min-w-6/12"
                                    value={
                                      isSingleColumnDetail(step.columnDetails)
                                        ? step.columnDetails.description
                                        : ""
                                    }
                                    onChange={e => updateStep(index, "columnDetails", { description: e.target.value, copyEnabled: true })}

                                  /> </>
                              }

                            </div>
                          )}


                        </div>
                      )}
                    </Draggable>)

                  })}

                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button onClick={addStep} variant="customNormal">
            + Add Column
          </Button>

<div className="flex flex-row items-center justify-center w-full">
        {<> 
        <Button className="cursor-pointer m-4" variant="outline" onClick={saveTemplate}> 
                      {"Save Template"}
                    </Button>
        {steps.length > 0 && steps.every((s) => s.name) && <>
             
        <Button
          className="m-4 cursor-pointer"
          onClick={() => {
            const template: AdminTemplate = {
              id: "tmp_" + Date.now(),
              name: templateName || "Unnamed",
              categories,
              description,
              steps,

            };

            const dynamicOtherColumns = template.steps
              .filter((step) => step.type !== "check")
              .map((step, idx) => ({
                name: step.name,
                type: (step.type ?? "text") as "text" | "date" | "check",
                value: "",
                isTimeSensitive: step.isTimeSensitive ?? false,
                timeSensitiveColors: step.timeSensitiveColors ?? {
                  warning: { days: 3, color: "#fbbf24" }, // Yellow
                  danger: { days: 1, color: "#f87171" },  // Red
                }
                ,
                columnId: idx + 1,
              }));

            const newTask: TaskRow = {
              id: crypto.randomUUID(),
              template: template,
              // name: template.name,
              category: { id: 2, name: templateName || "Unnamed", color: color || "#000000" },
              taskLineChecked: false,
              timeSensitiveDate: null,
              color: 'red',
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


                  // Use admin description/info (fallback to "")
                  description: s.description || s.info || "",

                  // ✅ Convert admin trigger → user triggerType
                  triggerType: s.trigger ?? "completed",

                  // ✅ Popup mapping (if admin set one)
                  popupDescription: s.trigger === "popup" && s.popupDescription
                    ? s.popupDescription ?? ""
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

            };

            setData(newTask); // this triggers table render
          }}
        >{data ? "Refresh preview" : "Preview"}</Button>
        
        </>}
        </>}
      </div>
      {data && (
        <UserTaskTable callingFromAdmin={true} adminTemplate={{id: "tmp_" + Date.now(),
              name: templateName || "Unnamed",
              categories,
              description,
              steps}}/>)}
          {/* <ColumnHeaderTable name={templateName} saveTemplate={saveTemplate} categories={categories} color={color} description={description} steps={steps} data={data} setData={setData} /> */}

        </div>
      )}


      {!showForm && <div>
        <h3 className="font-bold">Existing Templates</h3>

        {templateFetchLoading ?
          <table className="mt-3 w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2 text-left">Name</th>
                <th className="border px-3 py-2 text-left">Total Steps</th>
                <th className="border px-3 py-2 text-left">Description</th>
                <th className="border px-3 py-2 text-left">Created At</th>
                <th className="border px-3 py-2 text-left">Updated At</th>
                <th className="border px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 4, 4, 4].map((t, index) => {

                return (
                  <tr key={index}>
                    <td className="border px-3 py-2 font-semibold capitalize"  >
                      <SkeletonLoader className="bg-gray-400 w-8 h-4" />
                    </td>



                    <td className="border px-3 py-2">
                      <SkeletonLoader className="bg-gray-400 w-8 h-4" />

                    </td>

                    <td className="border px-3 py-2">
                      <SkeletonLoader className="bg-gray-400 w-8 h-4" />

                    </td>
                    <td className="border px-3 py-2">
                      <SkeletonLoader className="bg-gray-400 w-8 h-4" />

                    </td>

                    <td className="border px-3 py-2">
                      <SkeletonLoader className="bg-gray-400 w-8 h-4" />

                    </td>

                    <td className="border px-3 py-2 space-x-2">
                      <div className="w-full flex flex-row items-center">
                        <SkeletonLoader className="mx-1 bg-gray-400 w-8 h-4" /> <SkeletonLoader className="mx-1 bg-gray-400 w-8 h-4" /> <SkeletonLoader className="mx-1 bg-gray-400 w-8 h-4" />
                        <SkeletonLoader className="mx-1 bg-gray-400 w-12 h-4" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table> :
          <>{adminTemplates && adminTemplates?.length > 0 ?
            <table className="mt-3 w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-left">Name</th>
                  <th className="border px-3 py-2 text-left">Enabled Users</th>
                  <th className="border px-3 py-2 text-left">Description</th>
                  <th className="border px-3 py-2 text-left">Categories</th>
                  <th className="border px-3 py-2 text-left">Created At</th>
                  <th className="border px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {adminTemplates.map((t) => {

                  return (
                    <tr key={t.id}>
                      <td className="border px-3 py-2 font-semibold capitalize w-1/12"  >
                        {t.name}
                      </td>



                      <td className="border px-3 py-2 w-2/12">
                        {t?.enabledUsers?.length == 0 ? "None" : t?.enabledUsers?.map((u) => u.email).join(", ")}
                      </td>

                      <td className="border px-3 py-2  w-3/12">
                        {t.description}
                      </td>
                      <td className="border px-3 py-2 w-1/12">
                        {t.categories.length}
                      </td>
                      <td className="border px-3 py-2 w-1/12">
                        {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}
                      </td>



                      <td className="border px-3 py-2 space-x-2 w-2/12">

                        <Link className="  underline cursor-pointer " href={`${config.FRONTEND_URL}user-tasks/${t.id}`} target="_blank"
                          rel="noopener noreferrer" passHref>
                          Open </Link>
                        <button
                          className="text-blue-600 underline cursor-pointer "
                          onClick={() => handleEditTemplate(t)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 underline cursor-pointer "
                          onClick={() => onDelete(t.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="text-green-600 underline cursor-pointer "
                          onClick={async () => {
                            setUsersToAssignLoading(true)
                            setEditingTemplate(t)
                            setShowUserModal(true)
                            let fetchedUsers = await fetchAllUsersService()
                            setUsersToAssign(fetchedUsers.data || [])
                            setUsersToAssignLoading(false)
                          }}>
                          Enable Users
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table> :
            <div className="w-full flex flex-col items-center justify-center p-8"> No Templates to show for now</div>
          }</>}


      </div>}

      {showUserModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] rounded-lg shadow-lg p-5">

            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Select User</h2>
              <button onClick={() => setShowUserModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Input */}
            <div className="mb-4">
              <label className="text-sm font-medium">User</label>

              <Select
                onValueChange={(val) => setSelectedUserId(val)}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Choose User" />
                </SelectTrigger>

                <SelectContent>
                  {usersToAssignLoading ?
                    <SkeletonLoader className="bg-gray-400 w-full h-8" />
                    :
                    <>{usersToAssign.map((u) => (
                      <SelectItem key={u.id} value={u.id.toString()}>
                        {u.email}
                      </SelectItem>
                    ))}</>}
                </SelectContent>
              </Select>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" className="cursor-pointer" onClick={() => setShowUserModal(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white cursor-pointer"
                onClick={async () => {

                  if (!selectedUserId) {
                    toast.error("Please select a user first");
                    return;
                  }
                  setUsersToAssignFinalLoading(true)
                  let allowAccess = await allowTemplateAccessToUser(Number(editingTemplate?.id) || 1, Number(selectedUserId));
                  if (allowAccess.status === 200 || allowAccess.status === 201) {
                    setAdminTemplates(prev =>
                      prev?.map(t => (t.id === editingTemplate?.id ? allowAccess.data : t))
                    );
                    toast.success(allowAccess.message || "Access granted to user successfully");
                  } else {
                    toast.error(allowAccess.message || "Failed to grant access to user");
                  }


                  setUsersToAssignFinalLoading(false)

                  setShowUserModal(false);
                }}
              >
                {usersToAssignFinalLoading ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {saveTemplateLoading && <FullScreenLoader />}
    </div>
  );
}
