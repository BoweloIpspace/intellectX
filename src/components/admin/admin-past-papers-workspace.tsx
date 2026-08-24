"use client";

import { glassCardClassName } from "@/components/education/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convexApi } from "@/lib/convex-api";
import { convexEnv } from "@/lib/education-data";
import { useConvex, useConvexAuth, useMutation } from "convex/react";
import { FilePlus2Icon, RefreshCwIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type CourseOption = {
  stableId: string;
  title: string;
  subject: string;
};

type PastPaperSummary = {
  stableId: string;
  courseStableId: string;
  courseTitle: string;
  title: string;
  year: number;
  paperCode: string;
  session?: string;
  description?: string;
  estimatedTime?: string;
  totalMarks?: number;
  pageCount?: number;
  accessLevel?: "free" | "paid";
  seedManaged?: boolean;
  published: boolean;
  order: number;
  questionCount: number;
};

type PastPaperQuestion = {
  stableId: string;
  paperStableId: string;
  questionNumber: string;
  sectionLabel?: string;
  prompt: string;
  marks?: number;
  stimulusTitle?: string;
  stimulusText?: string;
  stimulusAssetPath?: string;
  stimulusAssetAlt?: string;
  stimulusSourceStatus?: "source-text" | "reconstructed-visual";
  modelAnswer: string;
  explanation?: string;
  order: number;
  seedManaged?: boolean;
};

type PastPaperDetail = {
  paper: PastPaperSummary;
  questions: PastPaperQuestion[];
  auditLogs: Array<{
    _id: unknown;
    eventType: string;
    actorUserId: string;
    createdAt: number;
  }>;
};

type PaperForm = {
  stableId: string;
  courseStableId: string;
  title: string;
  year: string;
  paperCode: string;
  session: string;
  description: string;
  estimatedTime: string;
  totalMarks: string;
  pageCount: string;
  accessLevel: "free" | "paid";
  published: boolean;
  order: string;
};

type QuestionForm = {
  stableId: string;
  questionNumber: string;
  sectionLabel: string;
  prompt: string;
  marks: string;
  stimulusTitle: string;
  stimulusText: string;
  stimulusAssetPath: string;
  stimulusAssetAlt: string;
  stimulusSourceStatus: "" | "source-text" | "reconstructed-visual";
  modelAnswer: string;
  explanation: string;
  order: string;
};

const inputClassName =
  "border-input bg-background min-h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
const textareaClassName = `${inputClassName} min-h-28 resize-y`;

function emptyPaperForm(courseStableId = ""): PaperForm {
  return {
    stableId: "",
    courseStableId,
    title: "",
    year: String(new Date().getFullYear()),
    paperCode: "",
    session: "",
    description: "",
    estimatedTime: "",
    totalMarks: "",
    pageCount: "",
    accessLevel: "free",
    published: false,
    order: "1",
  };
}

function emptyQuestionForm(order = 1): QuestionForm {
  return {
    stableId: "",
    questionNumber: String(order),
    sectionLabel: "",
    prompt: "",
    marks: "",
    stimulusTitle: "",
    stimulusText: "",
    stimulusAssetPath: "",
    stimulusAssetAlt: "",
    stimulusSourceStatus: "",
    modelAnswer: "",
    explanation: "",
    order: String(order),
  };
}

function paperToForm(paper: PastPaperSummary): PaperForm {
  return {
    stableId: paper.stableId,
    courseStableId: paper.courseStableId,
    title: paper.title,
    year: String(paper.year),
    paperCode: paper.paperCode,
    session: paper.session ?? "",
    description: paper.description ?? "",
    estimatedTime: paper.estimatedTime ?? "",
    totalMarks: paper.totalMarks === undefined ? "" : String(paper.totalMarks),
    pageCount: paper.pageCount === undefined ? "" : String(paper.pageCount),
    accessLevel: paper.accessLevel ?? "free",
    published: paper.published,
    order: String(paper.order),
  };
}

function questionToForm(question: PastPaperQuestion): QuestionForm {
  return {
    stableId: question.stableId,
    questionNumber: question.questionNumber,
    sectionLabel: question.sectionLabel ?? "",
    prompt: question.prompt,
    marks: question.marks === undefined ? "" : String(question.marks),
    stimulusTitle: question.stimulusTitle ?? "",
    stimulusText: question.stimulusText ?? "",
    stimulusAssetPath: question.stimulusAssetPath ?? "",
    stimulusAssetAlt: question.stimulusAssetAlt ?? "",
    stimulusSourceStatus: question.stimulusSourceStatus ?? "",
    modelAnswer: question.modelAnswer,
    explanation: question.explanation ?? "",
    order: String(question.order),
  };
}

function optionalNumber(value: string) {
  return value.trim() === "" ? undefined : Number(value);
}

function paperMutationArgs(form: PaperForm) {
  return {
    stableId: form.stableId,
    courseStableId: form.courseStableId,
    title: form.title,
    year: Number(form.year),
    paperCode: form.paperCode,
    session: form.session || undefined,
    description: form.description || undefined,
    estimatedTime: form.estimatedTime || undefined,
    totalMarks: optionalNumber(form.totalMarks),
    pageCount: optionalNumber(form.pageCount),
    accessLevel: form.accessLevel,
    published: form.published,
    order: Number(form.order),
  };
}

function questionMutationArgs(form: QuestionForm, paperStableId: string) {
  return {
    stableId: form.stableId,
    paperStableId,
    questionNumber: form.questionNumber,
    sectionLabel: form.sectionLabel || undefined,
    prompt: form.prompt,
    marks: optionalNumber(form.marks),
    stimulusTitle: form.stimulusTitle || undefined,
    stimulusText: form.stimulusText || undefined,
    stimulusAssetPath: form.stimulusAssetPath || undefined,
    stimulusAssetAlt: form.stimulusAssetAlt || undefined,
    stimulusSourceStatus: form.stimulusSourceStatus || undefined,
    modelAnswer: form.modelAnswer,
    explanation: form.explanation || undefined,
    order: Number(form.order),
  };
}

function formatDate(value: number) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AdminPastPapersWorkspace() {
  if (!convexEnv.isConfigured) {
    return (
      <Card className={`rounded-lg ${glassCardClassName}`}>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Configure NEXT_PUBLIC_CONVEX_URL before using the production Past Paper administration workspace.
        </CardContent>
      </Card>
    );
  }

  return <ConvexAdminPastPapersWorkspace />;
}

function ConvexAdminPastPapersWorkspace() {
  const convex = useConvex();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const createPastPaper = useMutation(convexApi.adminPastPapers.createPastPaper);
  const updatePastPaper = useMutation(convexApi.adminPastPapers.updatePastPaper);
  const deletePastPaper = useMutation(convexApi.adminPastPapers.deletePastPaper);
  const createPastPaperQuestion = useMutation(convexApi.adminPastPapers.createPastPaperQuestion);
  const updatePastPaperQuestion = useMutation(convexApi.adminPastPapers.updatePastPaperQuestion);
  const deletePastPaperQuestion = useMutation(convexApi.adminPastPapers.deletePastPaperQuestion);

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [papers, setPapers] = useState<PastPaperSummary[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState("");
  const [detail, setDetail] = useState<PastPaperDetail | null>(null);
  const [paperForm, setPaperForm] = useState<PaperForm>(emptyPaperForm());
  const [createForm, setCreateForm] = useState<PaperForm>(emptyPaperForm());
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [questionForm, setQuestionForm] = useState<QuestionForm>(emptyQuestionForm());
  const [newQuestionForm, setNewQuestionForm] = useState<QuestionForm>(emptyQuestionForm());
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [deletePaperArmed, setDeletePaperArmed] = useState(false);
  const [deleteQuestionArmed, setDeleteQuestionArmed] = useState(false);

  const selectedQuestion = useMemo(
    () => detail?.questions.find((question) => question.stableId === selectedQuestionId) ?? null,
    [detail, selectedQuestionId],
  );

  const loadDetail = useCallback(
    async (stableId: string) => {
      if (!stableId || !isAuthenticated) {
        setDetail(null);
        return;
      }
      const nextDetail = (await convex.query(convexApi.adminPastPapers.getAdminPastPaper, { stableId })) as PastPaperDetail | null;
      setDetail(nextDetail);
      if (nextDetail) {
        setPaperForm(paperToForm(nextDetail.paper));
        const firstQuestion = nextDetail.questions[0];
        setSelectedQuestionId((current) =>
          current && nextDetail.questions.some((question) => question.stableId === current)
            ? current
            : firstQuestion?.stableId ?? "",
        );
        setNewQuestionForm(emptyQuestionForm(nextDetail.questions.length + 1));
      }
    },
    [convex, isAuthenticated],
  );

  const loadWorkspace = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const [nextCourses, nextPapers] = await Promise.all([
        convex.query(convexApi.adminPastPapers.listAdminPastPaperCourses, {}) as Promise<CourseOption[]>,
        convex.query(convexApi.adminPastPapers.listAdminPastPapers, {}) as Promise<PastPaperSummary[]>,
      ]);
      setCourses(nextCourses);
      setPapers(nextPapers);
      setCreateForm((current) => ({
        ...current,
        courseStableId: current.courseStableId || nextCourses[0]?.stableId || "",
      }));
      const nextSelected = selectedPaperId || nextPapers[0]?.stableId || "";
      setSelectedPaperId(nextSelected);
      if (nextSelected) await loadDetail(nextSelected);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to load Past Paper administration.");
    } finally {
      setLoading(false);
    }
  }, [convex, isAuthenticated, loadDetail, selectedPaperId]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    void loadWorkspace();
  }, [authLoading, isAuthenticated, loadWorkspace]);

  useEffect(() => {
    if (selectedQuestion) setQuestionForm(questionToForm(selectedQuestion));
  }, [selectedQuestion]);

  async function runMutation(task: () => Promise<unknown>, successMessage: string) {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await task();
      setNotice(successMessage);
      await loadWorkspace();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Past Paper update failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleCreatePaper(event: FormEvent) {
    event.preventDefault();
    await runMutation(async () => {
      await createPastPaper(paperMutationArgs(createForm));
      setSelectedPaperId(createForm.stableId.trim().toLowerCase());
      setCreateForm(emptyPaperForm(courses[0]?.stableId ?? ""));
    }, "Past Paper created.");
  }

  async function handleSavePaper(event: FormEvent) {
    event.preventDefault();
    await runMutation(() => updatePastPaper(paperMutationArgs(paperForm)), "Past Paper saved as a manual admin-managed record.");
  }

  async function handleDeletePaper() {
    if (!selectedPaperId) return;
    if (!deletePaperArmed) {
      setDeletePaperArmed(true);
      return;
    }
    await runMutation(async () => {
      await deletePastPaper({ stableId: selectedPaperId });
      setSelectedPaperId("");
      setDetail(null);
      setDeletePaperArmed(false);
    }, "Past Paper and its questions deleted.");
  }

  async function handleCreateQuestion(event: FormEvent) {
    event.preventDefault();
    if (!selectedPaperId) return;
    await runMutation(async () => {
      await createPastPaperQuestion(questionMutationArgs(newQuestionForm, selectedPaperId));
      setSelectedQuestionId(newQuestionForm.stableId.trim().toLowerCase());
    }, "Question created.");
  }

  async function handleSaveQuestion(event: FormEvent) {
    event.preventDefault();
    if (!selectedPaperId) return;
    await runMutation(
      () => updatePastPaperQuestion(questionMutationArgs(questionForm, selectedPaperId)),
      "Question saved as a manual admin-managed record.",
    );
  }

  async function handleDeleteQuestion() {
    if (!selectedPaperId || !selectedQuestionId) return;
    if (!deleteQuestionArmed) {
      setDeleteQuestionArmed(true);
      return;
    }
    await runMutation(async () => {
      await deletePastPaperQuestion({ stableId: selectedQuestionId, paperStableId: selectedPaperId });
      setSelectedQuestionId("");
      setDeleteQuestionArmed(false);
    }, "Question deleted.");
  }

  if (authLoading || loading) {
    return <p className="text-muted-foreground text-sm" role="status">Loading Past Paper administration...</p>;
  }

  if (!isAuthenticated) {
    return (
      <Card className={`rounded-lg ${glassCardClassName}`}>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          An authenticated Convex admin identity is required to manage Past Papers.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {error ? <p className="border-destructive/30 bg-destructive/5 text-destructive rounded-lg border p-4 text-sm" role="alert">{error}</p> : null}
      {notice ? <p className="rounded-lg border bg-secondary/40 p-4 text-sm" role="status">{notice}</p> : null}

      <Card className={`rounded-lg ${glassCardClassName}`}>
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Paper catalog</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">Learner visibility is controlled by each paper&apos;s Published setting and its course publication state.</p>
          </div>
          <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => void loadWorkspace()}>
            <RefreshCwIcon className="size-4" /> Refresh
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {papers.map((paper) => (
            <button
              type="button"
              key={paper.stableId}
              onClick={() => {
                setSelectedPaperId(paper.stableId);
                setDeletePaperArmed(false);
                void loadDetail(paper.stableId);
              }}
              className={`rounded-lg border p-4 text-left transition ${selectedPaperId === paper.stableId ? "border-foreground" : "border-border/70 hover:border-foreground/40"}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <strong>{paper.title}</strong>
                <Badge variant={paper.published ? "secondary" : "outline"}>{paper.published ? "Published" : "Draft"}</Badge>
                <Badge variant="outline">{paper.seedManaged ? "Seed-managed" : "Manual"}</Badge>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">{paper.courseTitle} · {paper.paperCode} · {paper.year}</p>
              <p className="text-muted-foreground mt-1 text-xs">{paper.questionCount} questions · {paper.totalMarks ?? "—"} marks</p>
            </button>
          ))}
          {papers.length === 0 ? <p className="text-muted-foreground text-sm">No Past Papers exist yet.</p> : null}
        </CardContent>
      </Card>

      <Card className={`rounded-lg ${glassCardClassName}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FilePlus2Icon className="size-5" /> Create Past Paper</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePaper} className="grid gap-4">
            <PaperFormFields form={createForm} setForm={setCreateForm} courses={courses} stableIdEditable />
            <Button type="submit" className="w-fit" disabled={busy || courses.length === 0}>
              Create paper
            </Button>
          </form>
        </CardContent>
      </Card>

      {detail ? (
        <>
          <Card className={`rounded-lg ${glassCardClassName}`}>
            <CardHeader>
              <CardTitle>Edit {detail.paper.title}</CardTitle>
              {detail.paper.seedManaged ? (
                <p className="text-muted-foreground text-sm leading-6">
                  This record came from the canonical seed. Saving here intentionally converts it to a manual admin-managed record; a future canonical release seed can restore source-controlled content.
                </p>
              ) : null}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePaper} className="grid gap-4">
                <PaperFormFields form={paperForm} setForm={setPaperForm} courses={courses} />
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={busy}><SaveIcon className="size-4" /> Save paper</Button>
                  <Button type="button" variant="destructive" disabled={busy} onClick={() => void handleDeletePaper()}>
                    <Trash2Icon className="size-4" /> {deletePaperArmed ? "Confirm delete paper + questions" : "Delete paper"}
                  </Button>
                  {deletePaperArmed ? <Button type="button" variant="outline" onClick={() => setDeletePaperArmed(false)}>Cancel delete</Button> : null}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className={`rounded-lg ${glassCardClassName}`}>
            <CardHeader><CardTitle>Questions and model answers</CardTitle></CardHeader>
            <CardContent className="grid gap-5 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.5fr)]">
              <div className="grid content-start gap-2">
                {detail.questions.map((question) => (
                  <button
                    type="button"
                    key={question.stableId}
                    onClick={() => {
                      setSelectedQuestionId(question.stableId);
                      setDeleteQuestionArmed(false);
                    }}
                    className={`rounded-lg border p-3 text-left ${selectedQuestionId === question.stableId ? "border-foreground" : "border-border/70"}`}
                  >
                    <span className="font-medium">Question {question.questionNumber}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{question.marks ?? "—"} marks</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{question.seedManaged ? "Seed-managed" : "Manual"} · order {question.order}</span>
                  </button>
                ))}
                {detail.questions.length === 0 ? <p className="text-muted-foreground text-sm">No questions yet.</p> : null}
              </div>

              {selectedQuestion ? (
                <form onSubmit={handleSaveQuestion} className="grid gap-4">
                  {selectedQuestion.seedManaged ? <p className="rounded-lg border bg-secondary/30 p-3 text-xs text-muted-foreground">Saving this seeded question converts it to a manual admin-managed record.</p> : null}
                  <QuestionFormFields form={questionForm} setForm={setQuestionForm} stableIdEditable={false} />
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={busy}><SaveIcon className="size-4" /> Save question</Button>
                    <Button type="button" variant="destructive" disabled={busy} onClick={() => void handleDeleteQuestion()}>
                      <Trash2Icon className="size-4" /> {deleteQuestionArmed ? "Confirm delete question" : "Delete question"}
                    </Button>
                    {deleteQuestionArmed ? <Button type="button" variant="outline" onClick={() => setDeleteQuestionArmed(false)}>Cancel delete</Button> : null}
                  </div>
                </form>
              ) : <p className="text-muted-foreground text-sm">Select a question to edit it.</p>}
            </CardContent>
          </Card>

          <Card className={`rounded-lg ${glassCardClassName}`}>
            <CardHeader><CardTitle>Add question</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleCreateQuestion} className="grid gap-4">
                <QuestionFormFields form={newQuestionForm} setForm={setNewQuestionForm} stableIdEditable />
                <Button type="submit" className="w-fit" disabled={busy}>Create question</Button>
              </form>
            </CardContent>
          </Card>

          <Card className={`rounded-lg ${glassCardClassName}`}>
            <CardHeader><CardTitle>Past Paper audit history</CardTitle></CardHeader>
            <CardContent className="grid gap-2">
              {detail.auditLogs.map((log) => (
                <div key={String(log._id)} className="rounded-lg border border-border/70 p-3 text-sm">
                  <strong>{log.eventType}</strong>
                  <p className="text-muted-foreground mt-1 text-xs">{formatDate(log.createdAt)} · {log.actorUserId}</p>
                </div>
              ))}
              {detail.auditLogs.length === 0 ? <p className="text-muted-foreground text-sm">No admin edits recorded yet.</p> : null}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}

function PaperFormFields({
  form,
  setForm,
  courses,
  stableIdEditable = false,
}: {
  form: PaperForm;
  setForm: (next: PaperForm) => void;
  courses: CourseOption[];
  stableIdEditable?: boolean;
}) {
  function patch<K extends keyof PaperForm>(key: K, value: PaperForm[K]) {
    setForm({ ...form, [key]: value });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Stable ID"><input className={inputClassName} value={form.stableId} disabled={!stableIdEditable} onChange={(event) => patch("stableId", event.target.value)} required /></Field>
      <Field label="Course">
        <select className={inputClassName} value={form.courseStableId} onChange={(event) => patch("courseStableId", event.target.value)} required>
          <option value="">Choose course</option>
          {courses.map((course) => <option key={course.stableId} value={course.stableId}>{course.title} ({course.subject})</option>)}
        </select>
      </Field>
      <Field label="Title"><input className={inputClassName} value={form.title} onChange={(event) => patch("title", event.target.value)} required /></Field>
      <Field label="Paper code"><input className={inputClassName} value={form.paperCode} onChange={(event) => patch("paperCode", event.target.value)} required /></Field>
      <Field label="Year"><input className={inputClassName} type="number" min="1900" max="2200" value={form.year} onChange={(event) => patch("year", event.target.value)} required /></Field>
      <Field label="Session"><input className={inputClassName} value={form.session} onChange={(event) => patch("session", event.target.value)} /></Field>
      <Field label="Estimated time"><input className={inputClassName} value={form.estimatedTime} onChange={(event) => patch("estimatedTime", event.target.value)} /></Field>
      <Field label="Total marks"><input className={inputClassName} type="number" min="0" value={form.totalMarks} onChange={(event) => patch("totalMarks", event.target.value)} /></Field>
      <Field label="Page count"><input className={inputClassName} type="number" min="0" value={form.pageCount} onChange={(event) => patch("pageCount", event.target.value)} /></Field>
      <Field label="Order"><input className={inputClassName} type="number" min="0" value={form.order} onChange={(event) => patch("order", event.target.value)} required /></Field>
      <Field label="Access"><select className={inputClassName} value={form.accessLevel} onChange={(event) => patch("accessLevel", event.target.value as "free" | "paid")}><option value="free">Free</option><option value="paid">Paid</option></select></Field>
      <label className="flex min-h-10 items-center gap-3 rounded-md border border-input px-3 py-2 text-sm"><input type="checkbox" checked={form.published} onChange={(event) => patch("published", event.target.checked)} /> Published to learners</label>
      <div className="md:col-span-2"><Field label="Description"><textarea className={textareaClassName} value={form.description} onChange={(event) => patch("description", event.target.value)} /></Field></div>
    </div>
  );
}

function QuestionFormFields({
  form,
  setForm,
  stableIdEditable,
}: {
  form: QuestionForm;
  setForm: (next: QuestionForm) => void;
  stableIdEditable: boolean;
}) {
  function patch<K extends keyof QuestionForm>(key: K, value: QuestionForm[K]) {
    setForm({ ...form, [key]: value });
  }

  const stimulusAssetRequiresAlt = form.stimulusAssetPath.trim().length > 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Stable ID"><input className={inputClassName} value={form.stableId} disabled={!stableIdEditable} onChange={(event) => patch("stableId", event.target.value)} required /></Field>
      <Field label="Question number"><input className={inputClassName} value={form.questionNumber} onChange={(event) => patch("questionNumber", event.target.value)} required /></Field>
      <Field label="Section"><input className={inputClassName} value={form.sectionLabel} onChange={(event) => patch("sectionLabel", event.target.value)} /></Field>
      <Field label="Marks"><input className={inputClassName} type="number" min="0" value={form.marks} onChange={(event) => patch("marks", event.target.value)} /></Field>
      <Field label="Order"><input className={inputClassName} type="number" min="0" value={form.order} onChange={(event) => patch("order", event.target.value)} required /></Field>
      <Field label="Stimulus source">
        <select className={inputClassName} value={form.stimulusSourceStatus} onChange={(event) => patch("stimulusSourceStatus", event.target.value as QuestionForm["stimulusSourceStatus"])}>
          <option value="">None</option><option value="source-text">Source text</option><option value="reconstructed-visual">Reconstructed visual</option>
        </select>
      </Field>
      <div className="md:col-span-2"><Field label="Prompt"><textarea className={textareaClassName} value={form.prompt} onChange={(event) => patch("prompt", event.target.value)} required /></Field></div>
      <Field label="Stimulus title"><input className={inputClassName} value={form.stimulusTitle} onChange={(event) => patch("stimulusTitle", event.target.value)} /></Field>
      <Field label="Stimulus asset path"><input className={inputClassName} placeholder="/past-papers/.../figure.svg" value={form.stimulusAssetPath} onChange={(event) => patch("stimulusAssetPath", event.target.value)} /></Field>
      <div className="md:col-span-2"><Field label="Stimulus text"><textarea className={textareaClassName} value={form.stimulusText} onChange={(event) => patch("stimulusText", event.target.value)} /></Field></div>
      <div className="md:col-span-2"><Field label="Stimulus accessibility description"><textarea className={textareaClassName} value={form.stimulusAssetAlt} onChange={(event) => patch("stimulusAssetAlt", event.target.value)} required={stimulusAssetRequiresAlt} /></Field></div>
      <div className="md:col-span-2"><Field label="Model answer"><textarea className={textareaClassName} value={form.modelAnswer} onChange={(event) => patch("modelAnswer", event.target.value)} required /></Field></div>
      <div className="md:col-span-2"><Field label="Explanation"><textarea className={textareaClassName} value={form.explanation} onChange={(event) => patch("explanation", event.target.value)} /></Field></div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-medium">{label}{children}</label>;
}
