export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'admin' | 'teacher';
};

export type Class = {
  id: string;
  name: string;
};

export type Student = {
  id: string;
  nisn: string;
  fullName: string;
  gender: 'Laki-laki' | 'Perempuan';
  dateOfBirth: string;
  email?: string;
  phone?: string;
  address?: string;
  classId: string;
};

export type AttendanceRecord = {
  id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'Hadir' | 'Alpha' | 'Izin' | 'Sakit';
  recordedBy: string; // userId
};
