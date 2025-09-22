"use server";

import { getAttendance } from "@/lib/data";
import { attendanceTrendAnalysis } from "@/ai/flows/attendance-trend-analysis";

export async function runAttendanceAnalysis() {
  try {
    const attendanceData = getAttendance();
    const input = {
      attendanceData: JSON.stringify(attendanceData, null, 2),
    };

    const result = await attendanceTrendAnalysis(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error running attendance analysis:", error);
    if (error instanceof Error) {
        return { success: false, error: error.message };
    }
    return { success: false, error: "An unknown error occurred during analysis." };
  }
}
