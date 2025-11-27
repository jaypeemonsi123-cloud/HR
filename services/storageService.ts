import { AppState, EmploymentStatus, AttendanceStatus, LeaveStatus, LeaveType } from '../types';

const STORAGE_KEY = 'nexus_hrms_data_v1';

const INITIAL_DATA: AppState = {
  departments: [
    { id: 'd1', name: 'Engineering', description: 'Software Development and IT', managerId: 'e1' },
    { id: 'd2', name: 'Human Resources', description: 'Employee relations and recruiting', managerId: 'e2' },
    { id: 'd3', name: 'Sales', description: 'Revenue generation and client management', managerId: 'e3' },
  ],
  employees: [
    { id: 'e1', firstName: 'John', lastName: 'Doe', email: 'john.doe@nexus.com', position: 'Senior Engineer', departmentId: 'd1', salary: 95000, hireDate: '2022-01-15', status: EmploymentStatus.ACTIVE },
    { id: 'e2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@nexus.com', position: 'HR Manager', departmentId: 'd2', salary: 85000, hireDate: '2021-03-10', status: EmploymentStatus.ACTIVE },
    { id: 'e3', firstName: 'Robert', lastName: 'Johnson', email: 'rob.j@nexus.com', position: 'Sales Lead', departmentId: 'd3', salary: 92000, hireDate: '2023-06-01', status: EmploymentStatus.ACTIVE },
    { id: 'e4', firstName: 'Alice', lastName: 'Brown', email: 'alice.b@nexus.com', position: 'Frontend Dev', departmentId: 'd1', salary: 78000, hireDate: '2023-08-15', status: EmploymentStatus.ACTIVE },
  ],
  attendance: [
    { id: 'a1', employeeId: 'e1', date: new Date().toISOString().split('T')[0], status: AttendanceStatus.PRESENT, checkIn: '09:00', checkOut: '17:00' },
    { id: 'a2', employeeId: 'e2', date: new Date().toISOString().split('T')[0], status: AttendanceStatus.LATE, checkIn: '10:30', checkOut: '18:00' },
  ],
  leaves: [
    { id: 'l1', employeeId: 'e4', type: LeaveType.SICK, startDate: '2023-10-10', endDate: '2023-10-12', reason: 'Flu', status: LeaveStatus.APPROVED },
  ],
  payroll: []
};

export const loadData = (): AppState => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData) {
      return JSON.parse(serializedData);
    }
    // Initialize with default data if empty
    saveData(INITIAL_DATA);
    return INITIAL_DATA;
  } catch (error) {
    console.error("Failed to load data", error);
    return INITIAL_DATA;
  }
};

export const saveData = (data: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save data", error);
  }
};