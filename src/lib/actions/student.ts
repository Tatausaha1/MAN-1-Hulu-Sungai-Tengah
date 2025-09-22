"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addStudent, updateStudent, deleteStudent as deleteStudentFromDb } from "@/lib/data";
import { createClient } from "@/lib/utils/supabase/server";

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
  const supabase = await createClient();
  const { data: students } = await supabase.from('students').select('nisn').eq('nisn', validatedFields.data.nisn);


  if (students && students.length > 0) {
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
  
  const supabase = await createClient();
  const { data: students } = await supabase.from('students').select('id,nisn').eq('nisn', validatedFields.data.nisn);

  if (students && students.length > 0 && students[0].id !== id) {
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
