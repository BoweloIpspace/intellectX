import { PageShell } from "@/components/education/page-shell";
import { PastPaperRunner } from "@/components/education/past-paper-runner";
import { Badge } from "@/components/ui/badge";
import { getLearnerPastPaper } from "@/lib/past-paper-catalog";
import { ArrowLeftIcon, ClockIcon, FileTextIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PastPaperPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PastPaperPageProps): Promise<Metadata> {
  const { id } = await params;
  const paper = await getLearnerPastPaper(id);

  return {
    title: paper ? `${paper.title} - IntellectX` : "Past paper - IntellectX",
    description: paper?.description,
  };
}

export default async function PastPaperPage({ params }: PastPaperPageProps) {
  const { id } = await params;
  const paper = await getLearnerPastPaper(id);

  if (!paper) {
    notFound();
  }

  const totalMarks = paper.questions.reduce((sum, question) => sum + (question.marks ?? 0), 0);

  return (
    <PageShell>
      <div className="mx-auto mb-6 max-w-3xl">
        <Link
          href={`/courses/${paper.courseStableId}`}
          className="text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center gap-2 text-sm font-medium"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Biology
        </Link>
        <div className="mt-3 rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Past paper</Badge>
            <Badge variant="outline">{paper.year}</Badge>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{paper.title}</h1>
          {paper.description ? <p className="text-muted-foreground mt-3 leading-7">{paper.description}</p> : null}
          <div className="text-muted-foreground mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-2">
              <FileTextIcon className="size-4" />
              {paper.paperCode}
            </span>
            {paper.estimatedTime ? (
              <span className="inline-flex items-center gap-2">
                <ClockIcon className="size-4" />
                {paper.estimatedTime}
              </span>
            ) : null}
            <span>{paper.questions.length} questions</span>
            {totalMarks > 0 ? <span>{totalMarks} marks</span> : null}
          </div>
          <p className="text-muted-foreground mt-5 text-sm leading-6">
            Work through each question first, then reveal the model answer when you are ready. Written responses are not auto-graded.
          </p>
        </div>
      </div>

      <PastPaperRunner paper={paper} />
    </PageShell>
  );
}
