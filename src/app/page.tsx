"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="@container">
          <div className="@[480px]:p-4">
            <div
              className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDoOMyaid___STUBMRrTRv8DqPVbUkCZRmp1t2lT0Xm3VoUY0phQ9L4Can8MMIEjA4PkHxgjJ8sb8vD4t8xP8HjsgepEc1A4pGJ_qmn2vTue-Ti7uIr6vK9ycNVxPoPMs7ycGppCzM5Znq0A04Imm9XdPReFXCvAYVMSwupgqlCX51l4JY53YYQyrrXGleZzAjyGKTFC99JvkmPJFYTVTe9mcba3IDiRHbTU74d3Gd5AnFdVVqetczGmw7OjOX4_OekW9DNFpdsFSR1")',
              }}
              data-ai-hint="innovation technology"
            >
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                  Check the patentability of your idea
                </h1>
                <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                  Our tool helps you quickly assess the potential for patent protection, giving you valuable insights before you invest further.
                </h2>
              </div>
              <Link
                href="/check"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#0b80ee] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
              >
                <span className="truncate">Start a check</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
