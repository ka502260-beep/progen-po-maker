import React from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-4">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};