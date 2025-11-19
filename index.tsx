import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Editor } from './components/Editor';
import { PaperPreview } from './components/PaperPreview';
import { PurchaseOrder, CurrencyCode } from './types';
import { generateId } from './utils';

// Initial default state for the PO to show the user what it looks like
const INITIAL_PO: PurchaseOrder = {
  poNumber: 'PO-2024-1001',
  date: new Date().toISOString().split('T')[0],
  deliveryDate: '',
  supplier: 'TechComponents Ltd.\n123 Silicon Valley Blvd\nSan Jose, CA 95134\nUSA',
  buyer: 'Global Solutions Inc.\n456 Innovation Drive\nSeoul, 06234\nSouth Korea',
  currency: CurrencyCode.USD,
  items: [
    { 
      id: generateId(), 
      name: 'Industrial Control Unit', 
      spec: 'Model: ICU-500\nInput: 24V DC\nOutput: 8x Relay', 
      qty: 5, 
      unitPrice: 450.00, 
      remarks: 'Warranty: 2 Years' 
    },
    { 
      id: generateId(), 
      name: 'Sensor Module', 
      spec: 'Type: Optical\nRange: 0-100mm', 
      qty: 20, 
      unitPrice: 25.50, 
      remarks: '' 
    },
    {
      id: generateId(),
      name: 'Wiring Harness',
      spec: 'Length: 2m\nConnector: 12-pin waterproof',
      qty: 10,
      unitPrice: 12.00,
      remarks: 'Include spare pins'
    }
  ],
  vatRate: 10,
  otherCosts: 0,
  terms: '1. Payment: T/T 30 days after B/L date.\n2. Incoterms: CIF Incheon.\n3. Partial shipment allowed.\n4. Country of Origin: USA'
};

const App = () => {
  const [po, setPo] = useState<PurchaseOrder>(INITIAL_PO);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Left Panel: Editor (Hidden on print) */}
      <div className="w-full lg:w-[420px] xl:w-[480px] flex-shrink-0 bg-white border-r border-slate-200 h-auto lg:h-screen lg:overflow-y-auto shadow-lg z-10 print:hidden">
        <Editor po={po} setPo={setPo} onPrint={handlePrint} />
      </div>

      {/* Right Panel: Preview Area */}
      <div className="flex-1 bg-slate-200/80 overflow-y-auto h-screen p-4 lg:p-8 flex justify-center items-start print:p-0 print:h-auto print:bg-white print:block print:overflow-visible">
        <PaperPreview po={po} />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
