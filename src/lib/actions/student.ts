"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addStudent, updateStudent, deleteStudent as deleteStudentFromDb, getStudents } from "@/lib/data";

const studentSchema = z.object({
  nisn: z.string().min(1, "NISN is required"),
  fullName: z.string().min(1, "Full Name is required"),
  gender: z.enum(["Laki-laki", "Perempuan"]),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  classId: z.string().min(1, "Class is required"),
});

export async function createStudent(formData: FormData) {
  const validatedFields = studentSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const students = getStudents();
  if (students.some(s => s.nisn === validatedFields.data.nisn)) {
    return { error: 'A student with this NISN already exists.' };
  }

  try {
    addStudent(validatedFields.data);
    revalidatePath("/dashboard/students");
    return { success: "Student created successfully." };
  } catch (e) {
    return { error: "Failed to create student." };
  }
}

export async function updateStudentAction(id: string, formData: FormData) {
  const validatedFields = studentSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const students = getStudents();
  if (students.some(s => s.nisn === validatedFields.data.nisn && s.id !== id)) {
    return { error: 'A student with this NISN already exists.' };
  }

  try {
    updateStudent(id, validatedFields.data);
    revalidatePath("/dashboard/students");
    return { success: "Student updated successfully." };
  } catch (e) {
    return { error: "Failed to update student." };
  }
}

export async function deleteStudentAction(id: string) {
  try {
    const success = deleteStudentFromDb(id);
    if (!success) {
      return { error: "Student not found." };
    }
    revalidatePath("/dashboard/students");
    return { success: "Student deleted successfully." };
  } catch (e) {
    return { error: "Failed to delete student." };
  }
}
