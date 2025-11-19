import React from 'react';
import { Plus, Trash2, Printer, RotateCcw, FileText } from 'lucide-react';
import { PurchaseOrder, CurrencyCode, LineItem, DEFAULT_CURRENCIES } from '../types';
import { generateId } from '../utils';
import { FormSection } from './FormSection';

interface EditorProps {
  po: PurchaseOrder;
  setPo: React.Dispatch<React.SetStateAction<PurchaseOrder>>;
  onPrint: () => void;
}

export const Editor: React.FC<EditorProps> = ({ po, setPo, onPrint }) => {
  
  const updateField = (field: keyof PurchaseOrder, value: any) => {
    setPo(prev => ({ ...prev, [field]: value }));
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setPo(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: generateId(),
      name: '',
      spec: '',
      qty: 0,
      unitPrice: 0,
      remarks: ''
    };
    setPo(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const deleteItem = (id: string) => {
    if(po.items.length === 1 && confirm("Delete the last item?") === false) return;
    setPo(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  const clearAll = () => {
    if(confirm('Are you sure you want to reset all fields? This cannot be undone.')) {
        setPo(prev => ({
            ...prev,
            poNumber: '',
            supplier: '',
            buyer: '',
            items: [],
            terms: '',
            deliveryDate: ''
        }));
    }
  };

  const currencySymbol = DEFAULT_CURRENCIES[po.currency].symbol;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Toolbar */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
           <div className="bg-blue-600 p-1.5 rounded text-white">
             <FileText size={20} />
           </div>
           <h2 className="text-lg font-bold text-slate-800">PO Builder</h2>
        </div>
        <div className="flex gap-2">
            <button onClick={clearAll} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all" title="Reset Form">
                <RotateCcw size={18} />
            </button>
            <button 
                onClick={onPrint}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md hover:shadow-lg"
            >
            <Printer size={16} />
            Print / PDF
            </button>
        </div>
      </div>

      {/* Scrollable Form Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        <FormSection title="1. General Information">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">PO Number</label>
              <input 
                type="text" 
                value={po.poNumber} 
                onChange={e => updateField('poNumber', e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                placeholder="e.g. PO-2024-001"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Currency</label>
              <select 
                value={po.currency} 
                onChange={e => updateField('currency', e.target.value as CurrencyCode)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Object.values(DEFAULT_CURRENCIES).map(c => (
                  <option key={c.code} value={c.code}>{c.code} — {c.symbol}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Date</label>
              <input 
                type="date" 
                value={po.date} 
                onChange={e => updateField('date', e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Delivery Due</label>
              <input 
                type="date" 
                value={po.deliveryDate} 
                onChange={e => updateField('deliveryDate', e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="2. Parties">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Supplier (From)</label>
              <textarea 
                rows={4}
                value={po.supplier} 
                onChange={e => updateField('supplier', e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                placeholder="Company Name&#10;Address&#10;Contact Person"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Buyer (To)</label>
              <textarea 
                rows={4}
                value={po.buyer} 
                onChange={e => updateField('buyer', e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                placeholder="Company Name&#10;Address&#10;Contact Person"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="3. Line Items">
          <div className="space-y-4">
            {po.items.map((item, index) => (
              <div key={item.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative group transition-all hover:border-blue-300 hover:shadow-md">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => deleteItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Remove Item"
                   >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mb-3 pr-8">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Item Name</label>
                   <input 
                      type="text" 
                      placeholder="Product Name" 
                      value={item.name}
                      onChange={e => updateItem(item.id, 'name', e.target.value)}
                      className="w-full border-b border-slate-200 pb-1 text-sm font-semibold text-slate-800 focus:border-blue-500 outline-none placeholder:font-normal"
                   />
                </div>

                <div className="mb-3">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Spec / Description</label>
                   <textarea 
                      rows={2}
                      placeholder="Detailed specifications..." 
                      value={item.spec}
                      onChange={e => updateItem(item.id, 'spec', e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 rounded px-2 py-1.5 text-sm resize-y focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none"
                   />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Qty</label>
                      <input 
                          type="number" 
                          min="0"
                          value={item.qty || ''}
                          onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value))}
                          className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm text-right focus:border-blue-500 outline-none"
                      />
                  </div>
                  <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Price</label>
                      <input 
                          type="number"
                          min="0" 
                          value={item.unitPrice || ''}
                          onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))}
                          className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm text-right focus:border-blue-500 outline-none"
                      />
                  </div>
                  <div className="bg-slate-50 rounded px-2 flex flex-col justify-center items-end border border-slate-100">
                      <span className="text-[9px] uppercase text-slate-400 font-bold">Total</span>
                      <span className="text-sm font-bold text-slate-700">
                          {((item.qty || 0) * (item.unitPrice || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Remarks</label>
                   <input 
                      type="text" 
                      placeholder="Optional notes..." 
                      value={item.remarks}
                      onChange={e => updateItem(item.id, 'remarks', e.target.value)}
                      className="w-full border border-slate-200 rounded px-2 py-1 text-xs text-slate-600 focus:border-blue-500 outline-none"
                   />
                </div>
              </div>
            ))}
            
            <button 
              onClick={addItem}
              className="w-full py-3 border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-center gap-2 text-sm font-bold"
            >
              <Plus size={18} /> Add New Item
            </button>
          </div>
        </FormSection>

        <FormSection title="4. Financials & Terms">
          <div className="grid grid-cols-2 gap-4 mb-4">
               <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">VAT Rate (%)</label>
                  <div className="relative">
                    <input 
                        type="number" 
                        min="0"
                        max="100"
                        value={po.vatRate}
                        onChange={e => updateField('vatRate', parseFloat(e.target.value))}
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-right focus:ring-2 focus:ring-blue-500 outline-none pr-8"
                    />
                    <span className="absolute right-3 top-2 text-slate-400 text-sm">%</span>
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Other Costs</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 text-sm">{currencySymbol}</span>
                    <input 
                        type="number" 
                        min="0"
                        value={po.otherCosts}
                        onChange={e => updateField('otherCosts', parseFloat(e.target.value))}
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm text-right focus:ring-2 focus:ring-blue-500 outline-none pl-6"
                    />
                  </div>
               </div>
          </div>
          <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Conditions / Notes</label>
              <textarea 
                rows={5}
                value={po.terms}
                onChange={e => updateField('terms', e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter payment terms, shipping instructions, bank details, etc."
              />
          </div>
        </FormSection>

        {/* Footer padding for scrolling */}
        <div className="h-8"></div>
      </div>
    </div>
  );
};
