"use client"
import {
  useSortable,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export default function DraggableRow({ id, children }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td
        {...attributes}
        {...listeners}
        className="w-[30px] text-center cursor-grab hover:bg-gray-200"
      >
        <GripVertical className="text-gray-600" size={16} />
      </td>
      {children}
    </tr>
  );
}
