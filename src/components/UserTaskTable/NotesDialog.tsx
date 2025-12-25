"use client";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotesPopupState } from "@/global/types";
import { X } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface NotesDialogProps {
  open: boolean;
  stepName: string;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
  onDelete:()=>void;
  setNotesPopup: Dispatch<SetStateAction<NotesPopupState>>;
  notesPopup: NotesPopupState;

}

export default function NotesDialog({
  open,
  stepName,
  value,
  onChange,
  onSave,
  onDelete,
  notesPopup, 
  setNotesPopup,
  onClose
}: NotesDialogProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      setNotesPopup(prev => ({ ...prev, open: false }));
    }
  }

  if (notesPopup.open) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [notesPopup.open, setNotesPopup]);

 if (!notesPopup.open) return null;

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-white border shadow-lg p-4 rounded-md w-[250px]"
      style={{
        top: notesPopup.y + 5,
        left: notesPopup.x + 5
      }}
    >
      <div className="w-full flex flex-row items-end justify-end">
<X className="w-4 h-auto cursor-pointer" onClick={()=>
          setNotesPopup((prev) => ({ ...prev,  open:false }))}/>

      </div>
      <p className="font-bold text-sm mb-2">{notesPopup.stepName}</p>

      <Textarea
        value={notesPopup.value}
        onChange={(e) =>
          setNotesPopup((prev) => ({ ...prev, value: e.target.value }))
        }
        placeholder="Write notes..."
      />

      <div className="flex justify-between mt-3">
        {notesPopup.value && (
          <Button
            variant="secondary"
            onClick={() => {
              onDelete();
              setNotesPopup((prev) => ({ ...prev, open: false }));
            }}
          >
            Delete
          </Button>
        )}

        <Button
          onClick={() => {
            onSave();
            setNotesPopup((prev) => ({ ...prev, open: false }));
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}