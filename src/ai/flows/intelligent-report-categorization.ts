'use server';
/**
 * @fileOverview AI-powered report categorization and urgency detection flow.
 *
 * This file defines a Genkit flow that automatically categorizes incoming citizen reports
 * and determines their urgency using AI.
 *
 * @remarks
 * - intelligentReportCategorization - The main function to categorize a report.
 * - IntelligentReportCategorizationInput - The input type for the intelligentReportCategorization function.
 * - IntelligentReportCategorizationOutput - The return type for the intelligentReportCategorization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentReportCategorizationInputSchema = z.object({
  reportDescription: z.string().describe('The text description of the report.'),
});
export type IntelligentReportCategorizationInput = z.infer<
  typeof IntelligentReportCategorizationInputSchema
>;

const IntelligentReportCategorizationOutputSchema = z.object({
  category: z.string().describe('The predicted category of the report.'),
  isUrgent: z
    .boolean()
    .describe(
      'Whether the report is urgent and requires immediate attention.'
    ),
});
export type IntelligentReportCategorizationOutput = z.infer<
  typeof IntelligentReportCategorizationOutputSchema
>;

export async function intelligentReportCategorization(
  input: IntelligentReportCategorizationInput
): Promise<IntelligentReportCategorizationOutput> {
  return intelligentReportCategorizationFlow(input);
}

const reportCategorizationPrompt = ai.definePrompt({
  name: 'reportCategorizationPrompt',
  input: {schema: IntelligentReportCategorizationInputSchema},
  output: {schema: IntelligentReportCategorizationOutputSchema},
  prompt: `You are an AI assistant specializing in categorizing and assessing the urgency of citizen reports for a municipality.

  Given the following report description, determine the most appropriate category for the report and whether it is urgent.
  An urgent report is one that describes a situation that could lead to immediate harm, safety risk, or significant property damage, such as a major water leak, a traffic signal malfunction at a busy intersection, or a fallen power line. A pothole is generally not considered urgent unless described as exceptionally large or dangerous.

  Report Description: {{{reportDescription}}}

  Valid categories include: Pothole, Broken Streetlight, Overflowing Trash Bin, Traffic Signal Malfunction, Water Leak, Other.
  `,
});

const intelligentReportCategorizationFlow = ai.defineFlow(
  {
    name: 'intelligentReportCategorizationFlow',
    inputSchema: IntelligentReportCategorizationInputSchema,
    outputSchema: IntelligentReportCategorizationOutputSchema,
  },
  async input => {
    const {output} = await reportCategorizationPrompt(input);
    return output!;
  }
);
