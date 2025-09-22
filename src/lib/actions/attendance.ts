"use server";

import { revalidatePath } from "next/cache";
import { getStudents, getClasses, getAttendance, addAttendanceRecord } from "@/lib/data";

export async function recordAttendance(studentId: string, classId: string, userId: string) {
  const students = getStudents();
  const classes = getClasses();
  const attendance = getAttendance();

  // Validations
  if (!studentId || !classId) {
    return { error: 'Student ID and Class ID are required.' };
  }

  const student = students.find(s => s.id === studentId);
  if (!student) {
    return { error: 'Student not found.' };
  }

  const classObj = classes.find(c => c.id === classId);
  if (!classObj) {
    return { error: 'Class not found.' };
  }

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const existingRecord = attendance.find(r => 
    r.studentId === studentId && 
    r.classId === classId && 
    r.date === todayString
  );

  if (existingRecord) {
    return { error: `Student already marked as '${existingRecord.status}' today.` };
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
      success: 'Attendance recorded successfully.',
      data: {
        studentName: student.fullName,
        className: classObj.name,
        time: newRecord.time
      }
    };
  } catch (e) {
    return { error: 'Failed to record attendance.' };
  }
}
