'use server';
/**
 * @fileOverview AI-powered student help chatbot flow.
 *
 * This file defines a Genkit flow that provides assistance to students with
 * their queries about education, homework help, career guidance, and general academic support.
 *
 * @remarks
 * - studentHelpChatbot - The main function to process student queries.
 * - StudentChatMessage - The input type for individual chat messages.
 * - StudentChatResponse - The return type for the chatbot response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']).describe('The role of the message sender.'),
  content: z.string().describe('The content of the message.'),
  timestamp: z.string().optional().describe('Timestamp of the message.'),
});

export type StudentChatMessage = z.infer<typeof StudentChatMessageSchema>;

const StudentChatInputSchema = z.object({
  messages: z.array(StudentChatMessageSchema).describe('The conversation history including the latest user message.'),
  studentContext: z.object({
    grade: z.string().optional().describe('Student grade level (e.g., "10th", "12th", "College").'),
    subject: z.string().optional().describe('Current subject of interest.'),
  }).optional().describe('Optional context about the student.'),
});

export type StudentChatInput = z.infer<typeof StudentChatInputSchema>;

const StudentChatResponseSchema = z.object({
  response: z.string().describe('The chatbot response to the student query.'),
  suggestedQuestions: z.array(z.string()).optional().describe('Optional list of suggested follow-up questions.'),
});

export type StudentChatResponse = z.infer<typeof StudentChatResponseSchema>;

export async function studentHelpChatbot(
  input: StudentChatInput
): Promise<StudentChatResponse> {
  return studentHelpChatbotFlow(input);
}

const studentChatbotPrompt = ai.definePrompt({
  name: 'studentChatbotPrompt',
  input: {schema: StudentChatInputSchema},
  output: {schema: StudentChatResponseSchema},
  prompt: `You are an AI assistant specializing in helping students with their educational queries. You provide friendly, encouraging, and accurate assistance on topics such as:
  
- Subject explanations (Math, Science, History, English, etc.)
- Homework and assignment help
- Study tips and learning strategies
- Career guidance and educational pathways
- Exam preparation and time management
- General academic motivation and support

Given the conversation history, provide a helpful, clear, and concise response to the student's latest query.

{{#if studentContext}}
Student Context:
{{#if studentContext.grade}}Grade: {{studentContext.grade}}{{/if}}
{{#if studentContext.subject}}Subject of Interest: {{studentContext.subject}}{{/if}}
{{/if}}

Conversation History:
{{#each messages}}
{{role}}: {{content}}
{{/each}}

Important Guidelines:
- Be encouraging and positive
- Break down complex topics into simple explanations
- Use examples when helpful
- If you don't know something, be honest
- Do not provide direct answers to homework but guide students to find solutions
- Keep responses focused and age-appropriate
- Optionally suggest 2-3 relevant follow-up questions

Provide your response and optionally suggest follow-up questions.`,
});

const studentHelpChatbotFlow = ai.defineFlow(
  {
    name: 'studentHelpChatbotFlow',
    inputSchema: StudentChatInputSchema,
    outputSchema: StudentChatResponseSchema,
  },
  async input => {
    const {output} = await studentChatbotPrompt(input);
    return output!;
  }
);
