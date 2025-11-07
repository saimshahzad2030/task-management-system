import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { TaskRow } from "@/global/types";

export const sortByEarliestTimeSensitiveDate = (rows: TaskRow[]) => {
  return [...rows].sort((a, b) => {
    // Find earliest time sensitive step for each row
    const nextA = a.steps
      .filter(s =>   s.timeSensitiveDate)
      .map(s => new Date(s.timeSensitiveDate!).getTime())
      .sort((x, y) => x - y)[0]; // earliest

    const nextB = b.steps
      .filter(s =>  s.timeSensitiveDate)
      .map(s => new Date(s.timeSensitiveDate!).getTime())
      .sort((x, y) => x - y)[0];

    // ✅ If A has no date, send to bottom
   if (nextA === undefined) return 1;
if (nextB === undefined) return -1;


    // ✅ Compare earliest deadlines
    return nextA - nextB;
  });
};

export const sortByCategoryColor = (rows: TaskRow[]) => {
  return [...rows].sort((a, b) => 
    a.color.localeCompare(b.color)
  );
};

// ✅ Sort Alphabetically by Category
export const sortByCategory = (rows: TaskRow[]) => {
  return [...rows].sort((a, b) =>
    a.category.localeCompare(b.category)
  );
};

// ✅ Sort by Completed First
export const sortByCompleted = (rows: TaskRow[]) => {
  return [...rows].sort((a, b) => Number(b.completed) - Number(a.completed));
};

// ✅ Sort by % Steps Completed (descending)
export const sortByProgress = (rows: TaskRow[]) => {
  return [...rows].sort((a, b) => {
    const percentA = a.steps.filter((s) => s.completed).length / a.steps.length;
    const percentB = b.steps.filter((s) => s.completed).length / b.steps.length;
    return percentB - percentA;
  });
};


// ✅ Sort by Earliest Time-Sensitive Step
export const sortByEarliestDeadline = (rows: TaskRow[]) => {
  return [...rows].sort((a, b) => {
    const nextA = a.steps.find(s => s.timeSensitive && s.timeSensitiveDate);
    const nextB = b.steps.find(s => s.timeSensitive && s.timeSensitiveDate);

    if (!nextA) return 1;
    if (!nextB) return -1;

    return new Date(nextA.timeSensitiveDate!).getTime() - new Date(nextB.timeSensitiveDate!).getTime();
  });
};
interface TaskSorterProps {
  data: TaskRow[];
  setData: React.Dispatch<React.SetStateAction<TaskRow[]>>;
}
export default function TaskSorter({ data, setData }: TaskSorterProps) { 
  const handleSort = (type: string) => {
    // if (type === "category") setData(sortByCategory(data));
    if (type === "completed") setData(sortByCompleted(data));
    if (type === "steps") setData(sortByProgress(data));
    if (type === "deadline") setData(sortByEarliestDeadline(data));
    if (type === "categoryColor") setData(sortByCategoryColor(data));
    
  if (type === "closestDate") setData(sortByEarliestTimeSensitiveDate(data)); // ✅ new
  };

  return (
   <div className="flex flex-row items-center">
    <h1 className="font-bold mr-4">Sort By</h1>
     <div className="w-64">
      <Select onValueChange={handleSort} >
        <SelectTrigger className="cursor-pointer">
          <SelectValue placeholder="Sort tasks by..." />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="category">Category A → Z</SelectItem> */}
          <SelectItem value="completed">Most Completed First</SelectItem>
          <SelectItem value="steps">Most Steps Completed</SelectItem>
          {/* <SelectItem value="deadline">Earliest Deadline</SelectItem> */}
          <SelectItem value="categoryColor">Bundle by Category Color</SelectItem>
          <SelectItem value="closestDate">Earliest Deadline</SelectItem>
          
        </SelectContent>
      </Select>
    </div>
   </div>
  );
}
