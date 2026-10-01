"use client";

import { AppLoadingSpinner } from "@/components/ui/app-loading-spinner";
import { MobileEmptyState, MobileListRow, MobilePageHeader, MobilePageStack } from "@/components/ui/mobile-app-primitives";
import { Button } from "@/components/ui/button";
import { COURSE_SELECTION_CHANGE_EVENT, loadCourseSelection } from "@/lib/course-selection";
import { convexApi } from "@/lib/convex-api";
import { convexEnv } from "@/lib/education-data";
import { useLearnerCatalog } from "@/lib/learner-catalog-client";
import { useQuery } from "convex/react";
import { ArrowRightIcon, FileTextIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PastPaperCourseSummary = {
  courseStableId: string;
  paperCount: number;
};

export function MobileExamsHome() {
  if (!convexEnv.isConfigured) {
    return <MobileExamsHomeContent summaries={[]} />;
  }

  return <ConfiguredMobileExamsHome />;
}

function ConfiguredMobileExamsHome() {
  const summaries = useQuery(convexApi.pastPapers.listPastPaperCourseSummaries, {}) as
    | PastPaperCourseSummary[]
    | undefined;
  return <MobileExamsHomeContent summaries={summaries} />;
}

function MobileExamsHomeContent({ summaries }: { summaries: PastPaperCourseSummary[] | undefined }) {
  const catalog = useLearnerCatalog();
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const syncSelection = () => {
      setSelectedCourseIds(loadCourseSelection().selectedCourseIds);
      setHydrated(true);
    };
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

  const available = useMemo(() => {
    if (!summaries) return [];
    const paperCountByCourse = new Map(summaries.map((item) => [item.courseStableId, item.paperCount]));

    return catalog.courses
      .filter((course) => selectedCourseIds.includes(course.id) && (paperCountByCourse.get(course.id) ?? 0) > 0)
      .map((course) => ({ course, paperCount: paperCountByCourse.get(course.id) ?? 0 }));
  }, [catalog.courses, selectedCourseIds, summaries]);

  if (!hydrated || catalog.isLoading || summaries === undefined) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <AppLoadingSpinner label="Loading exams" showLabel />
      </div>
    );
  }

  if (selectedCourseIds.length === 0) {
    return (
      <MobileEmptyState
        icon={FileTextIcon}
        title="Choose courses first"
        description="Exams only appear for courses you selected in Profile."
        action={<Button asChild><Link href="/mobile-profile#course-selection">Choose courses in Profile</Link></Button>}
      />
    );
  }

  return (
    <MobilePageStack>
      <MobilePageHeader
        eyebrow="Exams"
        title="Long-form exam practice"
        description="Choose one of your Profile courses, then work through its published exam papers question by question."
      />

      {available.length === 0 ? (
        <MobileEmptyState
          icon={FileTextIcon}
          title="No exams for your selected courses yet"
          description="Only published production exam content for your selected courses appears here."
        />
      ) : (
        <div className="grid gap-3">
          {available.map(({ course, paperCount }) => (
            <MobileListRow
              key={course.id}
              href={`/mobile-past-papers?course=${encodeURIComponent(course.id)}`}
              icon={FileTextIcon}
              title={course.title}
              subtitle={course.subject}
              meta={`${paperCount} ${paperCount === 1 ? "exam paper" : "exam papers"}`}
              trailing={<ArrowRightIcon className="size-5" />}
            />
          ))}
        </div>
      )}
    </MobilePageStack>
  );
}
