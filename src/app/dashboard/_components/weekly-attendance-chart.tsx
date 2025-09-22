"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ChartProps {
    data: {
        name: string;
        present: number;
        absent: number;
    }[];
}

export function WeeklyAttendanceChart({ data }: ChartProps) {
    return (
        <Card>
        <CardHeader>
          <CardTitle>Tinjauan Kehadiran Mingguan</CardTitle>
          <CardDescription>Jumlah siswa yang hadir dan absen selama 7 hari terakhir.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
               <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
               />
              <Legend wrapperStyle={{fontSize: "14px"}}/>
              <Bar dataKey="present" fill="hsl(var(--primary))" name="Hadir" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="hsl(var(--destructive) / 0.5)" name="Absen" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
}
