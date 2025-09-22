"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addStudent, updateStudent, deleteStudent as deleteStudentFromDb, getStudents } from "@/lib/data";

const studentSchema = z.object({
  nisn: z.string().min(1, "NISN wajib diisi"),
  fullName: z.string().min(1, "Nama Lengkap wajib diisi"),
  gender: z.enum(["Laki-laki", "Perempuan"]),
  dateOfBirth: z.string().min(1, "Tanggal Lahir wajib diisi"),
  email: z.string().email("Alamat email tidak valid").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  classId: z.string().min(1, "Kelas wajib diisi"),
});

export async function createStudent(formData: FormData) {
  const validatedFields = studentSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: "Isian tidak valid",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const students = getStudents();
  if (students.some(s => s.nisn === validatedFields.data.nisn)) {
    return { error: 'Siswa dengan NISN ini sudah ada.' };
  }

  try {
    addStudent(validatedFields.data);
    revalidatePath("/dashboard/students");
    return { success: "Siswa berhasil dibuat." };
  } catch (e) {
    return { error: "Gagal membuat siswa." };
  }
}

export async function updateStudentAction(id: string, formData: FormData) {
  const validatedFields = studentSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: "Isian tidak valid",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const students = getStudents();
  if (students.some(s => s.nisn === validatedFields.data.nisn && s.id !== id)) {
    return { error: 'Siswa dengan NISN ini sudah ada.' };
  }

  try {
    updateStudent(id, validatedFields.data);
    revalidatePath("/dashboard/students");
    return { success: "Siswa berhasil diperbarui." };
  } catch (e) {
    return { error: "Gagal memperbarui siswa." };
  }
}

export async function deleteStudentAction(id: string) {
  try {
    const success = deleteStudentFromDb(id);
    if (!success) {
      return { error: "Siswa tidak ditemukan." };
    }
    revalidatePath("/dashboard/students");
    return { success: "Siswa berhasil dihapus." };
  } catch (e) {
    return { error: "Gagal menghapus siswa." };
  }
}
