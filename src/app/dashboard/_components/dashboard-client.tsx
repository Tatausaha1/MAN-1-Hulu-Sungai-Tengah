"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, UserCheck, BarChart3 } from "lucide-react";
import { subDays, format } from "date-fns";
import { WeeklyAttendanceChart } from "./weekly-attendance-chart";
import type { Student, Class, AttendanceRecord } from "@/lib/types";

interface DashboardClientProps {
    students: Student[];
    classes: Class[];
    attendanceRecords: AttendanceRecord[];
}

export function DashboardClient({ students, classes, attendanceRecords }: DashboardClientProps) {
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
            <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Semua siswa dalam sistem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">Semua kelas yang tersedia</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kehadiran Hari Ini</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{todayAttendance.length} dari {totalStudents} siswa hadir</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guru Aktif</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Guru yang sedang aktif</p>
          </CardContent>
        </Card>
      </div>

      <WeeklyAttendanceChart data={weeklyAttendanceData} />

    </div>
  );
}
