"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  analyzePatentIdea,
  type AnalyzePatentIdeaOutput,
} from "@/ai/flows/patent-idea-analysis";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";


const formSchema = z.object({
  ideaDescription: z
    .string()
    .min(50, {
      message: "Your idea description must be at least 50 characters long.",
    })
    .max(5000, {
      message: "Your idea description cannot exceed 5000 characters.",
    }),
});

export default function CheckPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzePatentIdeaOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ideaDescription: "",
    },
  });

  const { formState: { errors } } = form;

  const [progress, setProgress] = useState(0);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setAnalysisResult(null);
    setProgress(0);

    const interval = setInterval(() => {
       setProgress(prev => (prev >= 90 ? 90 : prev + 10));
    }, 600);


    try {
      const result = await analyzePatentIdea({
        ideaDescription: values.ideaDescription,
        keywords: '',
      });
      setAnalysisResult(result);
      setProgress(100);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing your idea. Please try again.",
      });
      setProgress(0);
    } finally {
      clearInterval(interval);
      setTimeout(() => setLoading(false), 500); 
    }
  }

  const handleClear = () => {
    form.reset();
    setAnalysisResult(null);
    setLoading(false);
    setProgress(0);
  };

  return (
    <div className="gap-1 px-6 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
        <h2 className="text-foreground tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Check the Patentability of Your Idea</h2>
        <p className="text-muted-foreground text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">Describe your idea in detail</p>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center">
          <div className="flex flex-col w-full max-w-[480px] items-end gap-4 px-4 py-3">
            <label className="flex flex-col w-full">
              <textarea
                placeholder="Describe your idea in detail"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-foreground focus:outline-0 focus:ring-0 border border-input bg-background focus:border-input min-h-36 placeholder:text-muted p-[15px] text-base font-normal leading-normal"
                {...form.register("ideaDescription")}
              ></textarea>
                 {errors.ideaDescription && <p className="text-red-500 text-sm mt-1">{errors.ideaDescription.message}</p>}
            </label>
          </div>

          <div className="flex w-full max-w-[480px] gap-3 flex-wrap px-4 py-3 justify-center">
            <button
              type="button"
              onClick={handleClear}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-secondary text-secondary-foreground text-sm font-bold leading-normal tracking-[0.015em] grow"
            >
              <span className="truncate">Clear</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-primary text-primary-foreground text-sm font-bold leading-normal tracking-[0.015em] grow disabled:opacity-50"
            >
              <span className="truncate">{loading ? 'Checking...' : 'Check Patentability'}</span>
            </button>
          </div>
        </form>
        
        {(loading || analysisResult) && (
          <div className="flex flex-col w-full items-center">
            <div className="layout-content-container flex flex-col w-full border-t border-solid border-secondary pt-5 mt-5">
              <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 text-center">Patentability Report</h2>
              
              {loading && !analysisResult && (
                <div className="flex flex-col gap-3 p-4 max-w-[480px] mx-auto w-full">
                  <div className="flex gap-6 justify-between">
                    <p className="text-foreground text-base font-medium leading-normal">Checking Patentability...</p>
                  </div>
                  <div className="rounded bg-input h-2">
                    <div className="h-2 rounded bg-primary" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                  </div>
                  <p className="text-muted-foreground text-sm font-normal leading-normal">This may take a few moments.</p>
                </div>
              )}

              {analysisResult && (
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Patentability Status</h3>
                  <p className="text-foreground text-base font-normal leading-normal pb-3 pt-1 px-4">{analysisResult.patentabilityAnalysis.isPatentable ? "Likely Patentable" : "Not Likely Patentable"}</p>
                  
                  <h3 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Reasons</h3>
                  <p className="text-foreground text-base font-normal leading-normal pb-3 pt-1 px-4">
                    {analysisResult.patentabilityAnalysis.analysisSummary}
                  </p>
                  
                  <h3 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Cited Resources</h3>
                   <div className="text-foreground text-base font-normal leading-normal pb-3 pt-1 px-4">
                    {analysisResult.patentabilityAnalysis.citedResources.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {analysisResult.patentabilityAnalysis.citedResources.map((resource, index) => (
                          <li key={index}>
                            <Link href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {resource.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No relevant prior art was found.</p>
                    )}
                   </div>

                  <h3 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Suggestions</h3>
                  <p className="text-foreground text-base font-normal leading-normal pb-3 pt-1 px-4">
                    {analysisResult.improvementSuggestions}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
