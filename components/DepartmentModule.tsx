import React, { useState } from 'react';
import { Department, Employee } from '../types';
import { Plus, Building2, User } from 'lucide-react';

interface DepartmentModuleProps {
  departments: Department[];
  employees: Employee[];
  onAdd: (dept: Department) => void;
  onEdit: (dept: Department) => void;
}

const DepartmentModule: React.FC<DepartmentModuleProps> = ({ departments, employees, onAdd, onEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Department>>({ name: '', description: '', managerId: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, id: crypto.randomUUID() } as Department);
    setIsModalOpen(false);
    setFormData({ name: '', description: '', managerId: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Departments</h2>
          <p className="text-slate-500">Organize your company structure.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={18} /> New Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => {
          const manager = employees.find(e => e.id === dept.managerId);
          const empCount = employees.filter(e => e.departmentId === dept.id).length;
          
          return (
            <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Building2 size={24} />
                </div>
                <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                  {empCount} Members
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{dept.name}</h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2 min-h-[40px]">{dept.description}</p>
              
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">Manager</p>
                  <p className="text-sm font-medium text-slate-800">{manager ? `${manager.firstName} ${manager.lastName}` : 'Not Assigned'}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Create Department</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department Name</label>
                <input required type="text" className="w-full p-2 border rounded-lg" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea className="w-full p-2 border rounded-lg" rows={3}
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Manager</label>
                <select className="w-full p-2 border rounded-lg bg-white"
                  value={formData.managerId} onChange={e => setFormData({...formData, managerId: e.target.value})}>
                  <option value="">Select Manager</option>
                  {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentModule;