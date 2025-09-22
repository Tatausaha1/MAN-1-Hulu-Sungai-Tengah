'use server';

/**
 * @fileOverview A flow for analyzing historical attendance data to identify trends and predict potential absenteeism.
 *
 * - attendanceTrendAnalysis - A function that analyzes attendance data and returns trends and predictions.
 * - AttendanceTrendAnalysisInput - The input type for the attendanceTrendAnalysis function.
 * - AttendanceTrendAnalysisOutput - The return type for the attendanceTrendAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AttendanceTrendAnalysisInputSchema = z.object({
  attendanceData: z.string().describe('Historical attendance data in JSON format.'),
});
export type AttendanceTrendAnalysisInput = z.infer<typeof AttendanceTrendAnalysisInputSchema>;

const AttendanceTrendAnalysisOutputSchema = z.object({
  trends: z.string().describe('Identified trends in attendance data.'),
  predictions: z.string().describe('Predictions of potential absenteeism.'),
  insights: z.string().describe('Insights for proactive intervention.'),
});
export type AttendanceTrendAnalysisOutput = z.infer<typeof AttendanceTrendAnalysisOutputSchema>;

export async function attendanceTrendAnalysis(input: AttendanceTrendAnalysisInput): Promise<AttendanceTrendAnalysisOutput> {
  return attendanceTrendAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'attendanceTrendAnalysisPrompt',
  input: {schema: AttendanceTrendAnalysisInputSchema},
  output: {schema: AttendanceTrendAnalysisOutputSchema},
  prompt: `You are a school attendance data analyst. Analyze the following attendance data to identify trends, predict potential absenteeism, and offer insights for proactive intervention.\n\nAttendance Data: {{{attendanceData}}}\n\nProvide the trends, predictions, and insights in a clear and concise manner.`,
});

const attendanceTrendAnalysisFlow = ai.defineFlow(
  {
    name: 'attendanceTrendAnalysisFlow',
    inputSchema: AttendanceTrendAnalysisInputSchema,
    outputSchema: AttendanceTrendAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
