import React, { useState } from 'react';
import { AttendanceRecord, Employee, AttendanceStatus } from '../types';
import { CalendarCheck, Clock, CheckCircle } from 'lucide-react';

interface AttendanceModuleProps {
  attendance: AttendanceRecord[];
  employees: Employee[];
  onMarkAttendance: (record: AttendanceRecord) => void;
}

const AttendanceModule: React.FC<AttendanceModuleProps> = ({ attendance, employees, onMarkAttendance }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleMark = (employeeId: string, status: AttendanceStatus) => {
    const existing = attendance.find(a => a.employeeId === employeeId && a.date === selectedDate);
    if (existing) return; // Prevent double marking for simplicity

    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID(),
      employeeId,
      date: selectedDate,
      status,
      checkIn: status === AttendanceStatus.PRESENT || status === AttendanceStatus.LATE ? '09:00' : undefined,
      checkOut: status === AttendanceStatus.PRESENT || status === AttendanceStatus.LATE ? '17:00' : undefined,
    };
    onMarkAttendance(newRecord);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Attendance Tracker</h2>
          <p className="text-slate-500">Monitor daily employee presence.</p>
        </div>
        <input 
          type="date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => {
                const record = attendance.find(a => a.employeeId === emp.id && a.date === selectedDate);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{emp.firstName} {emp.lastName}</td>
                    <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                       {record?.checkIn ? <><Clock size={14} /> {record.checkIn}</> : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {record?.checkOut || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {record ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          record.status === AttendanceStatus.PRESENT ? 'bg-green-50 text-green-700 border-green-200' :
                          record.status === AttendanceStatus.ABSENT ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {record.status}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Not Marked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!record && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleMark(emp.id, AttendanceStatus.PRESENT)} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors">Present</button>
                          <button onClick={() => handleMark(emp.id, AttendanceStatus.ABSENT)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors">Absent</button>
                          <button onClick={() => handleMark(emp.id, AttendanceStatus.LATE)} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded hover:bg-amber-200 transition-colors">Late</button>
                        </div>
                      )}
                      {record && (
                        <div className="text-slate-400 text-xs flex items-center justify-end gap-1">
                          <CheckCircle size={14} /> Recorded
                        </div>
                      )}
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

export default AttendanceModule;