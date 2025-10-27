"use client";
import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FinalColumnKey, sampleData as initialData, StepKey } from "@/global/constant"; 
import { fixedColumns, columnGroups, finalColumns } from "@/global/constant";

export default function UserTaskTable() {
  const [data, setData] = useState(initialData);

 const handleCheckbox = (
  rowIndex: number,
  col: StepKey,
  value: boolean | "indeterminate"
) => {
  setData((prev) => {
    const updated = [...prev];
    updated[rowIndex].steps[col] = value === true;
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
    updated[rowIndex][col] = value === true;
    return updated;
  });
};

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Task Progress Table</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="border rounded-md w-full flex overflow-hidden">

          {/* LEFT FIXED COLUMNS */}
          <table className="table-fixed border-r bg-white z-10">
            <thead className="bg-gray-100">
              <tr>
                {fixedColumns.map((col) => (
                  <th key={col} className="px-4 py-2 w-[140px] border-r text-left">
                    {col.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b">
                  {fixedColumns.map((col) => (
                    <td key={col} className="px-4 py-2 w-[140px] border-r">
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* CENTER SCROLLABLE GROUP */}
          <ScrollArea className="max-w-[650px] overflow-auto">
            <div className="min-w-[900px]"> {/* forces horizontal scroll */}
              <table className="table-fixed w-full">
                <thead>
                  <tr>
                    {columnGroups.map((group) => (
                      <th
                        key={group.title}
                        colSpan={group.columns.length}
                        className="text-center bg-gray-200 py-2 border-r"
                      >
                        {group.title}
                      </th>
                    ))}
                  </tr>
                  <tr className="bg-gray-100">
                    {columnGroups.flatMap((g) =>
                      g.columns.map((col) => (
                        <th key={col} className="px-4 py-2 w-[80px] border-r text-center">
                          {col.toUpperCase()}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx} className="border-b">
                      {columnGroups.flatMap((g) =>
                        g.columns.map((col) => (
                          <td key={col} className="text-center border-r py-2 w-[80px]">
                            <Checkbox 
                              checked={row.steps[col as StepKey]}
                            onCheckedChange={(v) => handleCheckbox(idx, col as StepKey, v)}

                            />
                          </td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ScrollBar orientation="horizontal" /> {/* needed for horizontal scrolling */}
          </ScrollArea>

          {/* RIGHT FIXED FINAL COLUMNS */}
          <table className="table-fixed border-l bg-white">
            <thead className="bg-gray-100">
              <tr>
                {finalColumns.map((col) => (
                  <th key={col} className="px-4 py-2 w-[110px] border-r text-center">
                    {col.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b">
                  {finalColumns.map((col) => (
                    <td key={col} className="text-center border-r">
                      <Checkbox
                     checked={row[col as FinalColumnKey]}
                        onCheckedChange={(v) => handleFinalCheckbox(idx, col as FinalColumnKey, v)}

                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </CardContent>
    </Card>
  );
}
 