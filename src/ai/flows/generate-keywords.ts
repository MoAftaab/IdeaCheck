'use server';

/**
 * @fileOverview A flow to generate keywords for a patent idea.
 *
 * - generateKeywords - A function that generates keywords from an idea description.
 * - GenerateKeywordsInput - The input type for the generateKeywords function.
 * - GenerateKeywordsOutput - The return type for the generateKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateKeywordsInputSchema = z.object({
  ideaDescription: z.string().describe('A detailed description of the patent idea.'),
});
export type GenerateKeywordsInput = z.infer<typeof GenerateKeywordsInputSchema>;

const GenerateKeywordsOutputSchema = z.object({
  keywords: z.string().describe('A comma-separated list of keywords relevant to the patent idea.'),
});
export type GenerateKeywordsOutput = z.infer<typeof GenerateKeywordsOutputSchema>;

export async function generateKeywords(input: GenerateKeywordsInput): Promise<GenerateKeywordsOutput> {
  return generateKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateKeywordsPrompt',
  input: {schema: GenerateKeywordsInputSchema},
  output: {schema: GenerateKeywordsOutputSchema},
  prompt: `You are an expert in patent analysis and keyword extraction.
Given the following description of a patent idea, extract the most relevant keywords.

Return the keywords as a single comma-separated string.

Idea Description: {{{ideaDescription}}}
`,
});

const generateKeywordsFlow = ai.defineFlow(
  {
    name: 'generateKeywordsFlow',
    inputSchema: GenerateKeywordsInputSchema,
    outputSchema: GenerateKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
