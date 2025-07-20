'use server';

/**
 * @fileOverview A patent idea analysis AI agent.
 *
 * - analyzePatentIdea - A function that handles the patent idea analysis process.
 * - AnalyzePatentIdeaInput - The input type for the analyzePatentIdea function.
 * - AnalyzePatentIdeaOutput - The return type for the analyzePatentIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePatentIdeaInputSchema = z.object({
  ideaDescription: z.string().describe('A detailed description of the patent idea.'),
  keywords: z.string().optional().describe('Keywords related to the patent idea to refine the search.'),
});
export type AnalyzePatentIdeaInput = z.infer<typeof AnalyzePatentIdeaInputSchema>;

const AnalyzePatentIdeaOutputSchema = z.object({
  patentabilityAnalysis: z.object({
    isPatentable: z.boolean().describe('Whether the patent idea is likely to be patentable.'),
    analysisSummary: z.string().describe('A summary of the patentability analysis.'),
    citedResources: z
      .array(
        z.object({
          title: z.string().describe('The title or identifier of the resource (e.g., patent number, publication name).'),
          url: z.string().describe('A valid URL to access the resource online.'),
        })
      )
      .describe('A list of cited resources, each with a title and a URL.'),
  }),
  improvementSuggestions: z.string().describe('Suggestions for improving the patentability of the idea.'),
});
export type AnalyzePatentIdeaOutput = z.infer<typeof AnalyzePatentIdeaOutputSchema>;

export async function analyzePatentIdea(input: AnalyzePatentIdeaInput): Promise<AnalyzePatentIdeaOutput> {
  return analyzePatentIdeaFlow(input);
}

const analyzePatentIdeaPrompt = ai.definePrompt({
  name: 'analyzePatentIdeaPrompt',
  input: {schema: AnalyzePatentIdeaInputSchema},
  output: {schema: AnalyzePatentIdeaOutputSchema},
  prompt: `You are an expert patent attorney specializing in analyzing the patentability of inventions.

You will use the provided information to assess the novelty and patentability of the idea. Provide a patentability analysis, including whether the idea is likely to be patentable, a summary of your analysis, and a list of cited resources. 

IMPORTANT: For each cited resource, you MUST provide an accurate title and a valid, matching, and publicly accessible URL (e.g., a Google Patents link). Double-check that the title and URL correspond to the same patent or publication. Do not invent URLs or mismatch titles.

Also, provide concise suggestions for improving the patentability of the idea.

Idea Description: {{{ideaDescription}}}

Consider the following:
- Prior art: Search for existing patents and publications that are similar to the idea.
- Novelty: Determine if the idea is new and not already known.
- Non-obviousness: Determine if the idea would be obvious to a person skilled in the art.
- Enablement: Determine if the idea is described in sufficient detail to enable a person skilled in the art to make and use it.

Respond in the format specified by the AnalyzePatentIdeaOutputSchema.
`,
});

const analyzePatentIdeaFlow = ai.defineFlow(
  {
    name: 'analyzePatentIdeaFlow',
    inputSchema: AnalyzePatentIdeaInputSchema,
    outputSchema: AnalyzePatentIdeaOutputSchema,
  },
  async input => {
    const {output} = await analyzePatentIdeaPrompt(input);
    return output!;
  }
);
