"use server";

import { revalidatePath } from "next/cache";
import { getStudents, getClasses, getAttendance, addAttendanceRecord } from "@/lib/data";

export async function recordAttendance(studentId: string, classId: string, userId: string) {
  const students = getStudents();
  const classes = getClasses();
  const attendance = getAttendance();

  // Validations
  if (!studentId || !classId) {
    return { error: 'ID Siswa dan ID Kelas diperlukan.' };
  }

  const student = students.find(s => s.id === studentId);
  if (!student) {
    return { error: 'Siswa tidak ditemukan.' };
  }

  const classObj = classes.find(c => c.id === classId);
  if (!classObj) {
    return { error: 'Kelas tidak ditemukan.' };
  }

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const existingRecord = attendance.find(r => 
    r.studentId === studentId && 
    r.classId === classId && 
    r.date === todayString
  );

  if (existingRecord) {
    return { error: `Siswa sudah ditandai sebagai '${existingRecord.status}' hari ini.` };
  }

  // Record attendance
  try {
    const newRecord = {
      studentId,
      classId,
      date: todayString,
      time: today.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'Hadir' as const,
      recordedBy: userId,
    };
    
    addAttendanceRecord(newRecord);
    revalidatePath('/dashboard/attendance');

    return { 
      success: 'Kehadiran berhasil dicatat.',
      data: {
        studentName: student.fullName,
        className: classObj.name,
        time: newRecord.time
      }
    };
  } catch (e) {
    return { error: 'Gagal mencatat kehadiran.' };
  }
}
