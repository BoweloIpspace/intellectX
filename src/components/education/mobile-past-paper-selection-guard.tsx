"use client";

import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { Button } from "@/components/ui/button";
import { COURSE_SELECTION_CHANGE_EVENT, loadCourseSelection } from "@/lib/course-selection";
import { convexApi } from "@/lib/convex-api";
import { convexEnv } from "@/lib/education-data";
import { useQuery } from "convex/react";
import { FileTextIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type MobilePastPaperSelectionGuardProps = {
  paperId: string;
  children: ReactNode;
};

type PastPaperAccessRecord = {
  courseStableId: string;
};

export function MobilePastPaperSelectionGuard({ paperId, children }: MobilePastPaperSelectionGuardProps) {
  if (!convexEnv.isConfigured) {
    return children;
  }

  return <ConfiguredMobilePastPaperSelectionGuard paperId={paperId}>{children}</ConfiguredMobilePastPaperSelectionGuard>;
}

function ConfiguredMobilePastPaperSelectionGuard({ paperId, children }: MobilePastPaperSelectionGuardProps) {
  const paper = useQuery(convexApi.pastPapers.getPastPaperById, { paperId }) as PastPaperAccessRecord | null | undefined;
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[] | null>(null);

  useEffect(() => {
    function syncSelection() {
      setSelectedCourseIds(loadCourseSelection().selectedCourseIds);
    }

    syncSelection();
    window.addEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
    window.addEventListener("storage", syncSelection);
    window.addEventListener("pageshow", syncSelection);

    return () => {
      window.removeEventListener(COURSE_SELECTION_CHANGE_EVENT, syncSelection);
      window.removeEventListener("storage", syncSelection);
      window.removeEventListener("pageshow", syncSelection);
    };
  }, []);

  if (paper === undefined || selectedCourseIds === null) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Checking exam access" showLabel />
      </div>
    );
  }

  if (!paper) {
    return children;
  }

  if (!selectedCourseIds.includes(paper.courseStableId)) {
    return (
      <section className="grid min-h-[55dvh] place-items-center text-center">
        <div>
          <FileTextIcon className="mx-auto size-8" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Exam course not selected</h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            This paper belongs to a course that is not in your current Profile course selection.
          </p>
          <Button asChild className="mt-5">
            <Link href="/mobile-profile#course-selection">Choose courses in Profile</Link>
          </Button>
        </div>
      </section>
    );
  }

  return children;
}
