'use server';

/**
 * @fileOverview A flow to provide concise suggestions for improving the patentability of an idea.
 *
 * - generatePatentabilitySuggestions - A function that generates patentability suggestions.
 * - PatentabilitySuggestionsInput - The input type for the generatePatentabilitySuggestions function.
 * - PatentabilitySuggestionsOutput - The return type for the generatePatentabilitySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PatentabilitySuggestionsInputSchema = z.object({
  ideaDescription: z.string().describe('A detailed description of the patent idea.'),
  analysisResults: z.string().describe('The results of the real-time patentability analysis, including cited resources.'),
  keywords: z.string().describe('Keywords related to the patent idea for refining analysis.'),
});
export type PatentabilitySuggestionsInput = z.infer<typeof PatentabilitySuggestionsInputSchema>;

const PatentabilitySuggestionsOutputSchema = z.object({
  suggestions: z.string().describe('Concise suggestions for improving the patentability of the idea.'),
});
export type PatentabilitySuggestionsOutput = z.infer<typeof PatentabilitySuggestionsOutputSchema>;

export async function generatePatentabilitySuggestions(input: PatentabilitySuggestionsInput): Promise<PatentabilitySuggestionsOutput> {
  return patentabilitySuggestionEngineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'patentabilitySuggestionPrompt',
  input: {schema: PatentabilitySuggestionsInputSchema},
  output: {schema: PatentabilitySuggestionsOutputSchema},
  prompt: `You are an expert patent attorney. Given the following description of a patent idea, the results of a real-time patentability analysis, and a list of keywords, provide concise suggestions for improving the patentability of the idea.

Idea Description: {{{ideaDescription}}}
Analysis Results: {{{analysisResults}}}
Keywords: {{{keywords}}}

Provide suggestions that are actionable and directly address any weaknesses identified in the analysis results. Be specific and provide alternative approaches or modifications to the invention to enhance its novelty and non-obviousness.

Suggestions:
`, // Keep prompt concise
});

const patentabilitySuggestionEngineFlow = ai.defineFlow(
  {
    name: 'patentabilitySuggestionEngineFlow',
    inputSchema: PatentabilitySuggestionsInputSchema,
    outputSchema: PatentabilitySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
