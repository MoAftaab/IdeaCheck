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
import { Progress } from "@/components/ui/progress";
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

export default function Home() {
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setAnalysisResult(null);

    // Fake progress for better UX
    const interval = setInterval(() => {
       setProgress(prev => (prev >= 90 ? 90 : prev + 10));
    }, 600);


    try {
      const result = await analyzePatentIdea({
        ideaDescription: values.ideaDescription,
        keywords: '', // Keywords are not in the new design, passing empty
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
      setTimeout(() => setLoading(false), 500); // Give time for progress bar to finish
    }
  }

  const handleClear = () => {
    form.reset();
    setAnalysisResult(null);
    setLoading(false);
    setProgress(0);
  };
  
  const [progress, setProgress] = useState(0);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f1f2f4] px-10 py-3">
          <div className="flex items-center gap-4 text-[#121416]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em]">IdeaCheck</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#121416] text-sm font-medium leading-normal" href="#">Home</a>
              <a className="text-[#121416] text-sm font-medium leading-normal" href="#">About</a>
              <a className="text-[#121416] text-sm font-medium leading-normal" href="#">Contact</a>
            </div>
          </div>
        </header>

        <main className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
            <h2 className="text-[#121416] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Check the Patentability of Your Idea</h2>
            <p className="text-[#121416] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">Describe your idea in detail</p>
            
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex justify-center">
                <div className="flex flex-col max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col w-full">
                    <textarea
                      placeholder="Describe your idea in detail"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde1e3] bg-white focus:border-[#dde1e3] min-h-36 placeholder:text-[#6a7681] p-[15px] text-base font-normal leading-normal"
                      {...form.register("ideaDescription")}
                    ></textarea>
                     {errors.ideaDescription && <p className="text-red-500 text-sm mt-1">{errors.ideaDescription.message}</p>}
                  </label>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-[480px] justify-center">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] grow"
                  >
                    <span className="truncate">Clear</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#dce8f3] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] grow disabled:opacity-50"
                  >
                    <span className="truncate">{loading ? 'Checking...' : 'Check Patentability'}</span>
                  </button>
                </div>
              </div>
            </form>

            {loading && (
              <div className="flex flex-col gap-3 p-4 max-w-[480px] mx-auto w-full">
                <div className="flex gap-6 justify-between">
                  <p className="text-[#121416] text-base font-medium leading-normal">Checking Patentability...</p>
                </div>
                <div className="rounded bg-[#dde1e3] h-2">
                  <div className="h-2 rounded bg-[#121416]" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
                <p className="text-[#6a7681] text-sm font-normal leading-normal">This may take a few moments.</p>
              </div>
            )}
          </div>
          
          <div className="layout-content-container flex flex-col w-[360px] border-l border-solid border-l-[#f1f2f4] pl-6">
            <h2 className="text-[#121416] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Patentability Report</h2>
            
            {!analysisResult && !loading && (
              <p className="text-[#6a7681] text-base font-normal leading-normal pb-3 pt-1 px-4">
                Your report will appear here once you submit an idea for analysis.
              </p>
            )}

            {loading && !analysisResult && (
                <div className="px-4 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
            )}

            {analysisResult && (
              <>
                <h3 className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Patentability Status</h3>
                <p className="text-[#121416] text-base font-normal leading-normal pb-3 pt-1 px-4">{analysisResult.patentabilityAnalysis.isPatentable ? "Likely Patentable" : "Not Likely Patentable"}</p>
                
                <h3 className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Reasons</h3>
                <p className="text-[#121416] text-base font-normal leading-normal pb-3 pt-1 px-4">
                  {analysisResult.patentabilityAnalysis.analysisSummary}
                </p>
                
                <h3 className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Cited Resources</h3>
                 <div className="text-[#121416] text-base font-normal leading-normal pb-3 pt-1 px-4">
                  {analysisResult.patentabilityAnalysis.citedResources.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {analysisResult.patentabilityAnalysis.citedResources.map((resource, index) => (
                        <li key={index}>
                          <Link href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {resource.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No relevant prior art was found.</p>
                  )}
                 </div>

                <h3 className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Suggestions</h3>
                <p className="text-[#121416] text-base font-normal leading-normal pb-3 pt-1 px-4">
                  {analysisResult.improvementSuggestions}
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
