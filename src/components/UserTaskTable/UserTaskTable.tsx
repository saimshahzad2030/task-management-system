"use client";
import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FinalColumnKey, sampleData as initialData } from "@/global/constant";
import { fixedColumns, finalColumns } from "@/global/constant";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner";

const getRowWithMost = (data: any[], key: "timeSensitive" | "nonTimeSensitive") => {
  return data.reduce((maxRow, curr) => {
    const maxCount = maxRow.steps.filter((s: any) =>
      key === "timeSensitive" ? s.timeSensitive : !s.timeSensitive
    ).length;
    const currCount = curr.steps.filter((s: any) =>
      key === "timeSensitive" ? s.timeSensitive : !s.timeSensitive
    ).length;
    return currCount > maxCount ? curr : maxRow;
  }, data[0]);
};

export default function UserTaskTable() {
  const [data, setData] = useState(initialData);

  // Since steps is now an array of objects, we extract their names for headers
  const stepColumns = data[0]?.steps.map((s: any) => s.name) || [];

  const handleCheckbox = (
    rowIndex: number,
    stepName: string,
    value: boolean | "indeterminate"
  ) => {
    setData((prev) => {
      const updated = [...prev];
      updated[rowIndex].steps = updated[rowIndex].steps.map((step: any) =>
        step.name === stepName
          ? { ...step, completed: value === true }
          : step
      );
      return updated;
    });
  };

 const handleFinalCheckbox = (
  rowIndex: number,
  col: FinalColumnKey,
  value: boolean | "indeterminate"
) => {
  setData((prev) => {
    const updated = [...prev];
        const wasChecked = updated[rowIndex][col]; // 👈 previous value
    const checked = value === true;
 
    updated[rowIndex] = {
      ...updated[rowIndex],
      [col]: checked, // update the clicked column
      steps: updated[rowIndex].steps.map((step) => ({
        ...step,
        completed: checked, // ✅ mark all steps same as the checkbox
      })),
    };
if (!wasChecked && checked) {
      toast.success("Task Marked as Completed");
    }
    return updated;
  }); }
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

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Task Progress Table</CardTitle>
      </CardHeader>

      <CardContent>
          <ScrollArea className="">
            <div className="border rounded-md w-full flex flex-row overflow-hidden ">  
          {/* LEFT FIXED COLUMNS */}
          <table className="table-fixed border-r bg-white z-10">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 h-[60px] min-w-[80px] border-r text-center text-sm">T/L</th>
                {fixedColumns.map((col) => (
                  <th key={col} className="px-4 h-[60px] min-w-[140px] border-r text-sm">
                    {col.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b">
                  <td className={`text-center border-r w-[80px] h-[40px] ${row.taskLineChecked?"bg-red-500":"bg-white"}`}>
                    <Checkbox
                      variant={row.taskLineChecked?"default":"danger"}
                      checked={row.statusTL}
                       onCheckedChange={(v) => handleTaskLineCheckbox(idx)}
                    />
                  </td>
                  {fixedColumns.map((col) => (
                    <td key={col} className={ `px-4 h-[60px] w-auto border-r text-center text-xs 
                      ${row.taskLineChecked?"text-white bg-red-500":"text-black bg-white"}`  
                    }>
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* FIRST SCROLLABLE SECTION */}
         
    <table className="table-fixed w-full">
      <thead className="bg-gray-100">
         <tr>
      {(() => {
        // Gather all unique non-timeSensitive step names across all rows
        const allNonTimeSensitiveSteps = Array.from(
          new Set(
            data.flatMap((d: any) =>
              d.steps
                .filter((s: any) => !s.timeSensitive)
                .map((s: any) => s.name)
            )
          )
        );

        // Render headers
        return allNonTimeSensitiveSteps.map((name: string) => (
          <th
            key={name}
            className="px-4 h-[60px] w-[80px] border-r text-center text-sm"
          >
            {"Check Column"}
          </th>
        ));
      })()}
    </tr>
      </thead>

    <tbody>
    {data.map((row: any, idx: number) => {
      const allNonTimeSensitiveSteps = Array.from(
        new Set(
          data.flatMap((d: any) =>
            d.steps
              .filter((s: any) => !s.timeSensitive)
              .map((s: any) => s.name)
          )
        )
      );

      // Map cells in the same order as headers
      return (
        <tr key={idx} className="border-b">
          {allNonTimeSensitiveSteps.map((headerName) => {
            const step = row.steps.find(
              (s: any) => s.name === headerName && !s.timeSensitive
            );

            return (
              <td
                key={headerName}
                className={`text-center border-r py-2 w-[80px] h-[80px] ${row.taskLineChecked?"bg-red-500":"bg-white"}`}
              >
                <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col items-center justify-center h-full cursor-pointer">
          {step ? (
            <>
              <Checkbox
                variant="success"
                checked={step.completed}
                onCheckedChange={(v) =>
                  handleCheckbox(idx, step.name, v)
                }
              />
              {step.timeSensitiveDate && (
                <div className="text-[10px] text-gray-500 mt-1">
                  {step.timeSensitiveDate}
                </div>
              )}
            </>
          ) : (
            <span className={` ${row.taskLineChecked?"text-gray-200 ":"text-gray-400 "}text-xs`}>—</span>
          )}
        </div>
      </TooltipTrigger>

      {/* Tooltip content on hover */}
      <TooltipContent side="top" 
       className="max-w-[220px] text-xs p-3 bg-white shadow-md rounded-md border text-gray-700"
  
      >
        {step?.description
          ? 
           <div className="text-left space-y-1">
         
          <p>{step.description || "No description available."}</p>
          {step.timeSensitiveDate && (
            <p className="text-[11px] text-gray-500">
              Due: {step.timeSensitiveDate}
            </p>
          )}
        <div className="flex flexx-row items-center ">
            <p
            className={`text-[11px] text-gray-500`}
          >
            Status:  
          </p>
          <p
            className={`text-[11px] ml-1 ${
              step.completed ? "text-green-600" : "text-red-500"
            }`}
          >
             {step.completed ? " Completed" : " Pending"}
          </p>
          </div>
        </div>
          : "No additional details available"}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
              </td>
            );
          })}
        </tr>
      );
    })}
  </tbody>
    </table>
   


          {/* TIME SENSITIVE DATE (fixed small block) */}
          <table className="table-fixed border-r bg-white z-10">
            <thead className="bg-gray-100">
              <tr>
                <th className="min-w-[160px] border-r border-l text-center text-sm h-[60px]">
                  Time Sensitive Date
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b">
                  <td className={`text-center border-r border-l w-[80px] h-[40px] text-xs
                  ${row.taskLineChecked?"text-white bg-red-500":"text-black bg-white"}`  
                    }>
                    {row.timeSensitiveDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* SECOND SCROLLABLE SECTION */}
          
              <table className="table-fixed w-full">
                <thead className="bg-gray-100">
                     <tr>
      {(() => {
        // Get all unique timeSensitive step names from all rows
        const allTimeSensitiveSteps = Array.from(
          new Set(
            data.flatMap((d: any) =>
              d.steps
                .filter((s: any) => s.timeSensitive)
                .map((s: any) => s.name)
            )
          )
        );

        // Render header cells
        return allTimeSensitiveSteps.map((name: string) => (
          <th
            key={name}
            className="px-4 h-[60px] w-[80px] border-r text-center text-sm"
          >
            {"Check Column"}
          </th>
        ));
      })()}
    </tr>
                  
                </thead>
             <tbody>
    {data.map((row: any, idx: number) => {
      // Keep same order for all rows as thead
      const allTimeSensitiveSteps = Array.from(
        new Set(
          data.flatMap((d: any) =>
            d.steps
              .filter((s: any) => s.timeSensitive)
              .map((s: any) => s.name)
          )
        )
      );

      return (
        <tr key={idx} className="border-b">
          {allTimeSensitiveSteps.map((headerName) => {
            const step = row.steps.find(
              (s: any) => s.name === headerName && s.timeSensitive
            );

            return (
              <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <td
        key={headerName}
        
        className={`text-center border-r py-2 w-[80px] h-[80px] cursor-pointer   
           ${row.taskLineChecked?"bg-red-500":"bg-white"}
          `}
      >
        {step ? (
          <>
            <Checkbox
              variant="success"
              checked={step.completed}
              onCheckedChange={(v) =>
                handleCheckbox(idx, step.name, v)
              }
            />
            {step.timeSensitiveDate && (
              <div className={`text-[10px]  mt-1 ${row.taskLineChecked?"text-white":"text-gray-500"}`}>
                {step.timeSensitiveDate}
              </div>
            )}
          </>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>
    </TooltipTrigger>

    <TooltipContent
      side="top"
      className="max-w-[220px] text-xs p-3 bg-white shadow-md rounded-md border text-gray-700"
    >
      
      {step ? (
        <div className="text-left space-y-1">
           
          <p>{step.description || "No description available."}</p>
          {step.timeSensitiveDate && (
            <p className="text-[11px] text-gray-500">
              Due: {step.timeSensitiveDate}
            </p>
          )}
          <div className="flex flexx-row items-center ">
            <p
            className={`text-[11px] text-gray-500`}
          >
            Status:  
          </p>
          <p
            className={`text-[11px] ml-1 ${
              step.completed ? "text-green-600" : "text-red-500"
            }`}
          >
             {step.completed ? " Completed" : "Pending"}
          </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-center">No data</p>
      )}
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
            );
          })}
        </tr>
      );
    })}
  </tbody>
              </table>
              

          {/* RIGHT FIXED FINAL COLUMNS */}
          <table className="table-fixed border-l bg-white">
            <thead className="bg-gray-100">
              <tr>
                {finalColumns.map((col) => (
                  <th key={col} className="px-4 h-[60px] w-[110px] border-r text-center text-sm">
                    {col.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b">
                  {finalColumns.map((col) => (
                    <td key={col} className={`text-center min-h-[40px] ${row.taskLineChecked?"bg-red-500":"bg-white"}`}>
                      <Checkbox
                        checked={row[col as FinalColumnKey]}
                        onCheckedChange={(v) =>
                          handleFinalCheckbox(idx, col as FinalColumnKey, v)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
     
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
      </CardContent>
    </Card>
  );
}
