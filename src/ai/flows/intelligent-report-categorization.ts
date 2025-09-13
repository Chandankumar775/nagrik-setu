'use server';
/**
 * @fileOverview AI-powered report categorization flow.
 *
 * This file defines a Genkit flow that automatically categorizes incoming citizen reports
 * using AI. The flow takes a report description as input and returns a predicted category.
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
  prompt: `You are an AI assistant specializing in categorizing citizen reports for a municipality.

  Given the following report description, determine the most appropriate category for the report.

  Report Description: {{{reportDescription}}}

  Respond with ONLY the category name. Valid categories include: Pothole, Broken Streetlight, Overflowing Trash Bin, Traffic Signal Malfunction, Water Leak, Other.
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
