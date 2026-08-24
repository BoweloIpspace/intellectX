# BGCSE Biology 0572/03 — 2019 Paper 3 Fidelity Record

Status date: 2026-08-24

## Scope

This record describes the IntellectX digital practice edition of **BGCSE Biology 0572/03, October/November 2019, Paper 3**.

The goal is to make every digital practice question independently answerable while preserving the app's answer-on-demand security boundary. It is not a claim that IntellectX republishes the examination paper or an official marking scheme.

## Verified paper-level facts

The source audit established the following paper-level facts used by the seed:

- paper code: `0572/03`
- session: October/November 2019
- duration: 1 hour 15 minutes
- page count: 8
- total marks: 70
- seven main questions
- Section A: questions 1–5
- Section B: questions 6–7
- question marks: 8, 7, 7, 7, 11, 15, 15

The seed and unit contract require those marks to total exactly 70.

## Digital source-material policy

The learner-facing database stores the facts needed to answer each question, not a facsimile of the examination artwork.

- Q1–Q6 use original IntellectX SVG study visuals with accessible descriptions.
- Q7 uses the source family relationships as structured text because a diagram is not required for the digital learner to construct the pedigree and genetic cross.
- Reconstructed visuals are explicitly labelled **Reconstructed study visual** in the mobile runner.
- Source-derived text is labelled **Source information**.
- The visual files contain SVG `<title>` and `<desc>` elements and the UI supplies normal image alternative text.

This approach avoids silently inventing or presenting unverified artwork as an official examination facsimile.

## Reconstruction caveats

### Question 3

The source paper clearly assesses a labelled male reproductive-system figure, but this audit did not establish a reliable reusable copy that was sufficient to verify every original label position. IntellectX therefore uses an original study reconstruction and states the relationships needed for the digital question. The reconstruction must not be described as the original 2019 figure.

### Question 6

The source paper assesses an asexual plant-propagation method from a figure. This audit did not establish a reliable reusable copy that was sufficient to identify and reproduce the exact original artwork. The IntellectX practice edition therefore uses a clearly disclosed **stem-cutting study reconstruction** to exercise the same syllabus area. It must not be presented as a source-verified facsimile of Fig. 6.1.

If exact licensed/source-authenticated Q3 or Q6 artwork becomes available later, it should replace the reconstructed asset through the past-paper content-management work rather than by silently changing provenance.

## Model-answer status

The repository does not claim that the learner-facing **Model answer** text is the official 2019 marking scheme. A reliable official 2019 mark scheme was not established during this audit.

The model answers are IntellectX instructional answers aligned to the question concepts and source facts. They should remain labelled **Model answer** and **Explanation**, not **Official mark scheme**.

## Answer secrecy boundary

`convex.pastPapers.getPastPaperById` may return:

- question prompt and marks
- section label
- source/stimulus title and text
- source/stimulus asset path and alternative text
- provenance status

It must not return `modelAnswer` or `explanation`.

`convex.pastPapers.getPastPaperAnswer` is the separate reveal-time query that returns the model answer and explanation for the requested question after the learner chooses **Reveal answer**.

## Release acceptance criteria

The digital paper is acceptable for the current mobile practice product when all of the following are enforced by tests and exact-head CI:

1. paper metadata remains 0572/03, October/November 2019, 1h15, 8 pages and 70 marks;
2. seven questions remain ordered 1–7 with marks `8 + 7 + 7 + 7 + 11 + 15 + 15 = 70`;
3. every question that depends on visual/source context has sufficient accessible digital source material to be answered without an absent paper figure;
4. reconstructed artwork is explicitly disclosed as reconstructed;
5. model answers and explanations remain outside the initial paper payload;
6. the full native Past Paper Previous/Next/Reveal/Finish flow remains intact;
7. production build, browser E2E, debug APK, unsigned release AAB and Android emulator lifecycle gates pass on the exact candidate head.
