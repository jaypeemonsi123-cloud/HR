import React, { useState } from 'react';
import { LeaveRequest, Employee, LeaveType, LeaveStatus } from '../types';
import { Calendar, Check, X, Clock } from 'lucide-react';

interface LeaveModuleProps {
  leaves: LeaveRequest[];
  employees: Employee[];
  onAdd: (leave: LeaveRequest) => void;
  onUpdateStatus: (id: string, status: LeaveStatus) => void;
}

const LeaveModule: React.FC<LeaveModuleProps> = ({ leaves, employees, onAdd, onUpdateStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<LeaveRequest>>({
    employeeId: '', type: LeaveType.ANNUAL, startDate: '', endDate: '', reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: crypto.randomUUID(),
      status: LeaveStatus.PENDING
    } as LeaveRequest);
    setIsModalOpen(false);
    setFormData({ employeeId: '', type: LeaveType.ANNUAL, startDate: '', endDate: '', reason: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Leave Management</h2>
          <p className="text-slate-500">Track and approve time off requests.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
          <Calendar size={18} /> New Request
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.map(leave => {
                const emp = employees.find(e => e.id === leave.employeeId);
                return (
                  <tr key={leave.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                        {leave.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {leave.startDate} <span className="text-slate-400">to</span> {leave.endDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit border ${
                        leave.status === LeaveStatus.APPROVED ? 'bg-green-50 text-green-700 border-green-200' :
                        leave.status === LeaveStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                         {leave.status === LeaveStatus.PENDING && <Clock size={12}/>}
                         {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {leave.status === LeaveStatus.PENDING && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => onUpdateStatus(leave.id, LeaveStatus.APPROVED)} className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Approve">
                            <Check size={18} />
                          </button>
                          <button onClick={() => onUpdateStatus(leave.id, LeaveStatus.REJECTED)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Reject">
                            <X size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {leaves.length === 0 && (
                 <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Request Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
                <select required className="w-full p-2 border rounded-lg bg-white"
                  value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})}>
                  <option value="">Select Employee</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                <select className="w-full p-2 border rounded-lg bg-white"
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as LeaveType})}>
                  {Object.values(LeaveType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input required type="date" className="w-full p-2 border rounded-lg"
                    value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input required type="date" className="w-full p-2 border rounded-lg"
                    value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                <textarea required className="w-full p-2 border rounded-lg" rows={3}
                  value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveModule;