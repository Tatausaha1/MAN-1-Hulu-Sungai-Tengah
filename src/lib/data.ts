import type { User, Class, Student, AttendanceRecord } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@school.com', avatarUrl: 'https://picsum.photos/seed/avatar1/100/100', role: 'admin' },
  { id: 'user-2', name: 'Teacher Ben', email: 'ben@school.com', avatarUrl: 'https://picsum.photos/seed/avatar2/100/100', role: 'teacher' },
];

export const classes: Class[] = [
  { id: 'class-1', name: 'Class 10-A' },
  { id: 'class-2', name: 'Class 10-B' },
  { id: 'class-3', name: 'Class 11-A' },
  { id: 'class-4', name: 'Class 11-B' },
];

export const students: Student[] = [
  { id: 'student-1', nisn: '1001', fullName: 'Alice Johnson', gender: 'Perempuan', dateOfBirth: '2008-05-10', classId: 'class-1', email: 'alice@example.com' },
  { id: 'student-2', nisn: '1002', fullName: 'Bob Williams', gender: 'Laki-laki', dateOfBirth: '2008-03-15', classId: 'class-1', email: 'bob@example.com' },
  { id: 'student-3', nisn: '1003', fullName: 'Charlie Brown', gender: 'Laki-laki', dateOfBirth: '2008-07-20', classId: 'class-1' },
  { id: 'student-4', nisn: '1004', fullName: 'Diana Miller', gender: 'Perempuan', dateOfBirth: '2008-01-30', classId: 'class-2', email: 'diana@example.com' },
  { id: 'student-5', nisn: '1005', fullName: 'Ethan Davis', gender: 'Laki-laki', dateOfBirth: '2008-09-05', classId: 'class-2' },
  { id: 'student-6', nisn: '1101', fullName: 'Fiona Garcia', gender: 'Perempuan', dateOfBirth: '2007-02-12', classId: 'class-3', email: 'fiona@example.com' },
  { id: 'student-7', nisn: '1102', fullName: 'George Rodriguez', gender: 'Laki-laki', dateOfBirth: '2007-04-25', classId: 'class-3' },
  { id: 'student-8', nisn: '1103', fullName: 'Hannah Wilson', gender: 'Perempuan', dateOfBirth: '2007-06-18', classId: 'class-4', email: 'hannah@example.com' },
  { id: 'student-9', nisn: '1104', fullName: 'Ian Martinez', gender: 'Laki-laki', dateOfBirth: '2007-08-22', classId: 'class-4' },
  { id: 'student-10', nisn: '1105', fullName: 'Jane Anderson', gender: 'Perempuan', dateOfBirth: '2007-10-01', classId: 'class-4' },
];

const today = new Date();
const generateAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    students.forEach(student => {
      // Simulate some absenteeism
      const rand = Math.random();
      let status: AttendanceRecord['status'] = 'Hadir';
      if (rand > 0.95) {
        status = 'Alpha';
      } else if (rand > 0.9) {
        status = 'Sakit';
      }
      
      if (status === 'Hadir') {
        records.push({
          id: `att-${student.id}-${dateString}`,
          studentId: student.id,
          classId: student.classId,
          date: dateString,
          time: `08:${String(Math.floor(Math.random() * 15)).padStart(2, '0')}`,
          status,
          recordedBy: 'user-2', // Teacher Ben
        });
      }
    });
  }
  return records;
};

export const attendanceRecords: AttendanceRecord[] = generateAttendance();

// In-memory data manipulation functions (to simulate a database)
// This is a simple implementation for demonstration purposes.
let mockStudents = [...students];
let mockAttendance = [...attendanceRecords];

export const getStudents = () => mockStudents;
export const getClasses = () => classes;
export const getAttendance = () => mockAttendance;

export const addStudent = (student: Omit<Student, 'id'>) => {
  const newStudent: Student = {
    ...student,
    id: `student-${Date.now()}`,
  };
  mockStudents.push(newStudent);
  return newStudent;
}

export const updateStudent = (id: string, data: Partial<Student>) => {
  const index = mockStudents.findIndex(s => s.id === id);
  if (index !== -1) {
    mockStudents[index] = { ...mockStudents[index], ...data };
    return mockStudents[index];
  }
  return null;
}

export const deleteStudent = (id: string) => {
  const index = mockStudents.findIndex(s => s.id === id);
  if (index !== -1) {
    mockStudents.splice(index, 1);
    return true;
  }
  return false;
}

export const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>) => {
  const newRecord: AttendanceRecord = {
    ...record,
    id: `att-${Date.now()}`
  };
  mockAttendance.push(newRecord);
  return newRecord;
}
