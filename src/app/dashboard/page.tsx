import { getStudents, getClasses, getAttendance } from "@/lib/data";
import { DashboardClient } from "./_components/dashboard-client";

export default function DashboardPage() {
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
