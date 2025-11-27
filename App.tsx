import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeModule from './components/EmployeeModule';
import DepartmentModule from './components/DepartmentModule';
import AttendanceModule from './components/AttendanceModule';
import LeaveModule from './components/LeaveModule';
import PayrollModule from './components/PayrollModule';
import AIAssistant from './components/AIAssistant';
import { loadData, saveData } from './services/storageService';
import { AppState, Employee, Department, AttendanceRecord, LeaveRequest, LeaveStatus } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appData, setAppData] = useState<AppState>(loadData());

  // Save data to localStorage whenever appData changes
  useEffect(() => {
    saveData(appData);
  }, [appData]);

  // Handlers
  const handleAddEmployee = (emp: Employee) => {
    setAppData(prev => ({ ...prev, employees: [...prev.employees, emp] }));
  };

  const handleEditEmployee = (emp: Employee) => {
    setAppData(prev => ({
      ...prev,
      employees: prev.employees.map(e => e.id === emp.id ? emp : e)
    }));
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setAppData(prev => ({
        ...prev,
        employees: prev.employees.filter(e => e.id !== id)
      }));
    }
  };

  const handleAddDepartment = (dept: Department) => {
    setAppData(prev => ({ ...prev, departments: [...prev.departments, dept] }));
  };

  const handleMarkAttendance = (record: AttendanceRecord) => {
    setAppData(prev => ({ ...prev, attendance: [...prev.attendance, record] }));
  };

  const handleAddLeave = (leave: LeaveRequest) => {
    setAppData(prev => ({ ...prev, leaves: [...prev.leaves, leave] }));
  };

  const handleUpdateLeaveStatus = (id: string, status: LeaveStatus) => {
    setAppData(prev => ({
      ...prev,
      leaves: prev.leaves.map(l => l.id === id ? { ...l, status } : l)
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={appData} />;
      case 'employees':
        return <EmployeeModule 
          employees={appData.employees} 
          departments={appData.departments} 
          onAdd={handleAddEmployee} 
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />;
      case 'departments':
        return <DepartmentModule 
          departments={appData.departments} 
          employees={appData.employees}
          onAdd={handleAddDepartment}
          onEdit={() => {}} 
        />;
      case 'attendance':
        return <AttendanceModule 
          attendance={appData.attendance} 
          employees={appData.employees}
          onMarkAttendance={handleMarkAttendance}
        />;
      case 'leaves':
        return <LeaveModule 
          leaves={appData.leaves} 
          employees={appData.employees}
          onAdd={handleAddLeave}
          onUpdateStatus={handleUpdateLeaveStatus}
        />;
      case 'payroll':
        return <PayrollModule employees={appData.employees} />;
      case 'ai-assistant':
        return <AIAssistant />;
      default:
        return <Dashboard data={appData} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64 p-8 transition-all">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;