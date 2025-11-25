import { useState } from "react";
import { Button } from "../ui/button"; // your button component

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  message,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    // Fullscreen overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Centered card */}
      <div className="bg-white rounded-lg shadow-lg w-[400px] max-w-full p-6">
        <p className="text-gray-800 text-sm mb-4">{message}</p>

        <div className="flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={onConfirm}>
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
};
