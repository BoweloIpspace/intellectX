"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MAT111_COURSE_ID } from "@/data/mat111-course";
import { mat111ExpandedQuizzes } from "@/data/mat111-expanded-quizzes";
import { mat111Lessons } from "@/data/mat111-lessons";
import { getMat111QuizzesByCourse } from "@/data/mat111-quizzes";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenCheckIcon,
  FileTextIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export function Mat111MobileTopicQuizzes({ topicId }: { topicId: string }) {
  const lesson = mat111Lessons.find((item) => item.id === topicId);
  const quizzes = useMemo(() => {
    const base = getMat111QuizzesByCourse(MAT111_COURSE_ID).filter((quiz) => quiz.lessonId === topicId);
    const extra = mat111ExpandedQuizzes.filter((quiz) => quiz.lessonId === topicId);
    return [...base, ...extra];
  }, [topicId]);

  if (!lesson) {
    return (
      <section className="rounded-2xl border border-border/70 bg-background/70 p-6 text-center">
        <h1 className="text-xl font-semibold">Topic unavailable</h1>
        <Button asChild className="mt-5">
          <Link href={`/mobile-study/${encodeURIComponent(MAT111_COURSE_ID)}`}>Back to MAT111</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <Button asChild size="sm" variant="ghost" className="-ml-2">
        <Link href={`/mobile-infographies?course=${encodeURIComponent(MAT111_COURSE_ID)}&topic=${encodeURIComponent(topicId)}`}>
          <ArrowLeftIcon className="size-4" />
          Infographic
        </Link>
      </Button>

      <div>
        <Badge variant="secondary">Week {lesson.id.replace("mat111-week-", "")}</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{lesson.title}</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Seven quiz sets for this lecture-note topic. The first two preserve the existing source-backed quizzes; five more
          extend practice from the same supplied material.
        </p>
      </div>

      <Button asChild variant="outline" className="min-h-12 w-full">
        <Link href={`/mobile-past-papers?course=${encodeURIComponent(MAT111_COURSE_ID)}&topic=${encodeURIComponent(topicId)}`}>
          <FileTextIcon className="size-4" />
          Open 5 exam practice sets
        </Link>
      </Button>

      <div className="grid gap-3">
        {quizzes.map((quiz, index) => {
          const isExpanded = quiz.id.includes("-extra-");
          const href = isExpanded
            ? `/mobile-quizzes/${encodeURIComponent(quiz.id)}?course=${encodeURIComponent(MAT111_COURSE_ID)}&topic=${encodeURIComponent(topicId)}`
            : `/quiz/${encodeURIComponent(quiz.id)}?from=mobile&course=${encodeURIComponent(MAT111_COURSE_ID)}&topic=${encodeURIComponent(topicId)}`;

          return (
            <article key={quiz.id} className="rounded-2xl border border-border/70 bg-background/70 p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="bg-primary text-primary-foreground grid size-10 place-items-center rounded-full">
                  <BookOpenCheckIcon className="size-5" />
                </span>
                <Badge variant="outline">Quiz {index + 1}/7</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">{quiz.difficulty}</Badge>
                <Badge variant="outline">{quiz.estimatedTime}</Badge>
                <Badge variant="outline">{quiz.questions.length} questions</Badge>
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight">{quiz.title}</h2>
              <Button asChild className="mt-5 min-h-12 w-full">
                <Link href={href}>
                  Start quiz
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
