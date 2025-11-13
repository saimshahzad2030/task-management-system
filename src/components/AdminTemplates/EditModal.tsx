import { AdminTemplate } from '@/global/types';
import React from 'react'
interface EditModalProps {
  template: AdminTemplate;
  onClose: () => void;
}

export default function EditModal({ template, onClose }: EditModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[450px] rounded p-4 shadow">
        <h3 className="text-lg font-bold">Edit Template</h3>

        <p className="text-gray-600">
          Here you can let user update steps, category name, color...
        </p>

        {/* Put your form here */}

        <button
          className="mt-4 px-3 py-1 bg-gray-200 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
 