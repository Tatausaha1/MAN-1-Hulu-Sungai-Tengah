import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, UserCheck, BarChart3 } from "lucide-react";
import { getStudents, getClasses, getAttendance } from "@/lib/data";
import { subDays, format } from "date-fns";
import { WeeklyAttendanceChart } from "./_components/weekly-attendance-chart";

export default function DashboardPage() {
  const students = getStudents();
  const classes = getClasses();
  const attendanceRecords = getAttendance();

  const totalStudents = students.length;
  const totalClasses = classes.length;
  
  const todayString = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.filter(r => r.date === todayString);
  const attendanceRate = totalStudents > 0 ? (todayAttendance.length / totalStudents) * 100 : 0;

  const weeklyAttendanceData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), i);
    const dateString = date.toISOString().split('T')[0];
    const present = attendanceRecords.filter(r => r.date === dateString).length;
    const absent = totalStudents - present;
    return {
      name: format(date, 'EEE'),
      present,
      absent,
    };
  }).reverse();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">All students in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">All classes available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{todayAttendance.length} of {totalStudents} students present</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Currently active teachers</p>
          </CardContent>
        </Card>
      </div>

      <WeeklyAttendanceChart data={weeklyAttendanceData} />

    </div>
  );
}
