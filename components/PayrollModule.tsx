import React from 'react';
import { Employee, PayrollRecord } from '../types';
import { DollarSign, Download, Printer } from 'lucide-react';

interface PayrollModuleProps {
  employees: Employee[];
}

const PayrollModule: React.FC<PayrollModuleProps> = ({ employees }) => {
  const generatePayroll = (emp: Employee): PayrollRecord => {
    const monthlySalary = emp.salary / 12;
    const tax = monthlySalary * 0.15;
    const insurance = 150;
    const deductions = tax + insurance;
    
    return {
      id: `pay-${emp.id}-${new Date().getMonth()}`,
      employeeId: emp.id,
      month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      baseSalary: monthlySalary,
      bonus: 0,
      deductions,
      netSalary: monthlySalary - deductions,
      paymentDate: new Date().toISOString().split('T')[0]
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Payroll</h2>
          <p className="text-slate-500">View salary details for current month.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
          <Printer size={18} /> Print All Slips
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4 text-right">Base Salary</th>
                <th className="px-6 py-4 text-right">Deductions</th>
                <th className="px-6 py-4 text-right">Net Pay</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => {
                const payroll = generatePayroll(emp);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{emp.firstName} {emp.lastName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{payroll.month}</td>
                    <td className="px-6 py-4 text-right font-mono text-slate-600">
                      ${payroll.baseSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-red-500">
                      -${payroll.deductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">
                      ${payroll.netSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollModule;