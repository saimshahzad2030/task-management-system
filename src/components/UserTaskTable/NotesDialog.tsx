"use client";
import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NotesDialogProps {
  open: boolean;
  stepName: string;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function NotesDialog({
  open,
  stepName,
  value,
  onChange,
  onSave,
  onClose
}: NotesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Notes </DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Write notes..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
