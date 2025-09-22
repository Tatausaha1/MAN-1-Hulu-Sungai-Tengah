
import { getStudents, getClasses, getAttendance } from "@/lib/data";
import { DashboardClient } from "./_components/dashboard-client";
import { createClient } from "@/lib/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const students = getStudents();
  const classes = getClasses();
  const attendanceRecords = getAttendance();

  return (
    <DashboardClient 
        students={students} 
        classes={classes} 
        attendanceRecords={attendanceRecords}
    />
  );
}
