import { getStudents, getClasses } from "@/lib/data";
import { StudentTable } from "./_components/student-table";
import { Suspense } from "react";

export default function StudentManagementPage() {
  const students = getStudents();
  const classes = getClasses();

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <StudentTable initialStudents={students} classes={classes} />
      </Suspense>
    </div>
  );
}
