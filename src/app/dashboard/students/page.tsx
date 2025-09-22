import { createClient } from "@/lib/utils/supabase/server";
import { StudentTable } from "./_components/student-table";
import { Suspense } from "react";
import type { Student, Class } from "@/lib/types";
import { redirect } from "next/navigation";

async function getStudentsData(): Promise<Student[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("students").select("*").order("fullName", { ascending: true });
    if (error) {
        console.error("Error fetching students:", error);
        return [];
    }
    return data as Student[];
}

export default async function StudentManagementPage() {
  const supabase = await createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const students = await getStudentsData();
  const classes = getClasses();

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <StudentTable initialStudents={students} classes={classes} />
      </Suspense>
    </div>
  );
}
