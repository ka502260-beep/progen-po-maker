import React from 'react';
import { PurchaseOrder, DEFAULT_CURRENCIES } from '../types';
import { formatCurrency, calculateTotals } from '../utils';

interface PaperPreviewProps {
  po: PurchaseOrder;
}

export const PaperPreview: React.FC<PaperPreviewProps> = ({ po }) => {
  const currency = DEFAULT_CURRENCIES[po.currency];
  const { subtotal, vatAmount, grandTotal } = calculateTotals(po.items, po.vatRate, po.otherCosts);

  return (
    <div 
      className="bg-white shadow-2xl print:shadow-none w-[210mm] min-h-[297mm] flex flex-col relative text-slate-800 print:w-full print:m-0" 
      style={{ boxSizing: 'border-box' }}
    >
      {/* A4 Page Padding Wrapper */}
      <div className="p-[12mm] flex flex-col h-full grow">
        
        {/* --- Header --- */}
        <header className="flex justify-between items-start mb-8 border-b-2 border-blue-600 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-600 mb-2 tracking-tight">PURCHASE ORDER</h1>
            <div className="text-slate-600 text-sm font-medium">
              PO No. <span className="ml-2 text-black text-base">{po.poNumber || '________________'}</span>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end gap-3">
            <div className="inline-flex items-center bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
              {currency.code} ({currency.symbol}) Currency
            </div>
            
            <div className="text-sm">
              <div className="grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-right">
                <div className="text-slate-500 font-medium">Date:</div>
                <div className="font-bold text-slate-800">{po.date}</div>
                
                {po.deliveryDate && (
                  <>
                    <div className="text-slate-500 font-medium">Requested Delivery:</div>
                    <div className="font-bold text-slate-800">{po.deliveryDate}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* --- Supplier & Buyer Grid --- */}
        <section className="grid grid-cols-2 gap-8 mb-8">
          {/* Supplier */}
          <div className="flex flex-col">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">Supplier</h3>
            <div className="bg-slate-50/50 p-3 rounded border border-slate-100 flex-grow">
               <div className="text-sm whitespace-pre-wrap break-words leading-relaxed text-slate-700">
                 {po.supplier || <span className="text-slate-300 italic">Enter supplier information...</span>}
               </div>
            </div>
          </div>
          
          {/* Buyer */}
          <div className="flex flex-col">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">Buyer (Ship To)</h3>
             <div className="bg-slate-50/50 p-3 rounded border border-slate-100 flex-grow">
               <div className="text-sm whitespace-pre-wrap break-words leading-relaxed text-slate-700">
                 {po.buyer || <span className="text-slate-300 italic">Enter buyer information...</span>}
               </div>
            </div>
          </div>
        </section>

        {/* --- Items Table --- */}
        <div className="mb-6 flex-grow">
          <table className="w-full border-collapse text-sm table-fixed">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="w-[6%] p-2 text-center font-semibold border-r border-blue-500 first:rounded-tl-md">#</th>
                <th className="w-[30%] p-2 text-left font-semibold border-r border-blue-500">Item / Spec</th>
                <th className="w-[10%] p-2 text-right font-semibold border-r border-blue-500">Qty</th>
                <th className="w-[14%] p-2 text-right font-semibold border-r border-blue-500">Unit Price</th>
                <th className="w-[16%] p-2 text-right font-semibold border-r border-blue-500">Amount</th>
                <th className="w-[24%] p-2 text-left font-semibold last:rounded-tr-md">Remarks</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 border border-slate-200 border-t-0">
              {po.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                    No items listed. Add items from the editor.
                  </td>
                </tr>
              )}
              {po.items.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-200 even:bg-slate-50/60 print:break-inside-avoid hover:bg-blue-50/30 transition-colors">
                  <td className="p-3 text-center align-top text-slate-500">{idx + 1}</td>
                  <td className="p-3 align-top">
                    <div className="font-bold text-slate-800 mb-1 whitespace-pre-wrap break-words">{item.name}</div>
                    <div className="text-xs text-slate-500 whitespace-pre-wrap break-words leading-snug">{item.spec}</div>
                  </td>
                  <td className="p-3 text-right align-top font-medium">{item.qty.toLocaleString()}</td>
                  <td className="p-3 text-right align-top text-slate-600">
                    {formatCurrency(item.unitPrice, po.currency)}
                  </td>
                  <td className="p-3 text-right align-top font-bold text-slate-800 bg-slate-50/50">
                    {currency.symbol} {formatCurrency(item.qty * item.unitPrice, po.currency)}
                  </td>
                  <td className="p-3 text-left align-top text-xs text-slate-500 whitespace-pre-wrap break-words italic">
                    {item.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Footer Section --- */}
        <div className="grid grid-cols-[1fr_320px] gap-10 mb-6 print:break-inside-avoid">
           
           {/* Terms */}
           <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Terms & Conditions</h4>
              <div className="text-xs text-slate-600 border border-slate-200 rounded p-4 bg-slate-50/50 whitespace-pre-wrap break-words min-h-[140px] leading-relaxed">
                {po.terms || 'No specific terms indicated.'}
              </div>
           </div>

           {/* Totals */}
           <div className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden self-start">
              <div className="bg-slate-50 p-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Order Summary</h4>
              </div>
              <div className="p-4 flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{currency.symbol} {formatCurrency(subtotal, po.currency)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                    <span className="flex items-center gap-1">
                      VAT <span className="text-[10px] bg-slate-100 px-1 rounded border border-slate-200">{po.vatRate}%</span>
                    </span>
                    <span className="font-medium">{currency.symbol} {formatCurrency(vatAmount, po.currency)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                    <span>Other Costs</span>
                    <span className="font-medium">{currency.symbol} {formatCurrency(po.otherCosts, po.currency)}</span>
                </div>
                
                <div className="border-t-2 border-blue-100 my-1"></div>
                
                <div className="flex justify-between items-center text-base">
                    <span className="font-bold text-blue-700">Grand Total</span>
                    <span className="font-bold text-blue-700 text-xl tracking-tight">{currency.symbol} {formatCurrency(grandTotal, po.currency)}</span>
                </div>
              </div>
           </div>
        </div>

        {/* --- Approval Box --- */}
        <div className="mt-auto border border-slate-300 rounded-lg p-2 bg-white print:break-inside-avoid">
             <div className="text-[10px] text-slate-400 mb-2 font-bold uppercase tracking-wider px-1">Authorized Signature / Approval</div>
             <div className="grid grid-cols-4 gap-0 divide-x divide-slate-200 border border-slate-200 rounded overflow-hidden">
                {[
                  { label: 'Approver', icon: '🛡️' },
                  { label: 'Purchasing', icon: '🛒' },
                  { label: 'Inspection', icon: '🔍' },
                  { label: 'Stamp', icon: '🏢' }
                ].map((role) => (
                    <div key={role.label} className="h-[24mm] flex flex-col items-center justify-between p-2 bg-slate-50/10">
                        <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                           {role.label}
                        </span>
                        <div className="flex-grow w-full flex items-center justify-center">
                            <span className="text-2xl opacity-10 grayscale">{role.icon}</span>
                        </div>
                        <span className="text-[9px] text-slate-300 italic self-end w-full text-center border-t border-slate-100 pt-1">Sign / Date</span>
                    </div>
                ))}
             </div>
        </div>

      </div>
    </div>
  );
};
