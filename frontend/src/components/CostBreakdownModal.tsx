import React from "react";
import { CostBreakdown } from "../types/Product";

interface Props {
  open: boolean;
  onClose: () => void;
  materials: CostBreakdown[];
  labour: CostBreakdown[];
}

const CostBreakdownModal: React.FC<Props> = ({ open, onClose, materials, labour }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h2 className="font-bold text-lg mb-2">Cost Breakdown</h2>
        <div>
          <h3 className="font-semibold">Materials</h3>
          <ul className="mb-2">
            {materials.map((m, i) => (
              <li key={i}>{m.item}: Ksh {m.cost}</li>
            ))}
          </ul>
          <h3 className="font-semibold">Labour</h3>
          <ul>
            {labour.map((l, i) => (
              <li key={i}>{l.item}: Ksh {l.cost}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdownModal; 