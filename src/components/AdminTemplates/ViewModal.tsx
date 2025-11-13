import { AdminTemplate } from '@/global/types';
import React from 'react'
interface EditModalProps {
  template: AdminTemplate;
  onClose: () => void;
}
export default function ViewModal({ template, onClose }: EditModalProps) { 
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-96 rounded p-4 shadow">
        <h3 className="text-lg font-bold">Template Details</h3>

        <p className="mt-2">
          <span className="font-semibold">Category:</span> {template.category}
        </p>
        <p>
          <span className="font-semibold">Steps:</span> {template.steps.length}
        </p>

        <ul className="mt-2 list-disc pl-5">
          {template.steps.map((s, i) => (
            <li key={i}>{s.name}</li>
          ))}
        </ul>

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

 