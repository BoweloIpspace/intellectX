# Past Paper Administration and Release Seeding

Status date: 2026-08-24

## Admin boundary

Past Paper content management is an authenticated **admin-only** operation.

- Page: `/admin/past-papers`
- Convex backend: `convex/adminPastPapers.ts`
- Authorization: trusted `requireAdmin` identity on every management query and mutation
- Admin actions create audit records for paper/question create, update, and delete operations
- Deleting a paper cascades to its associated question records, with question-deletion audit events recorded before the paper-deletion event
- Stimulus asset paths must remain safe app-relative paths, and every stored visual asset reference requires an accessibility description

The learner-facing `convex/pastPapers.ts` contract remains separate. Initial paper/question payloads do not expose `modelAnswer` or explanation fields; those remain available only through the learner's explicit answer-reveal query.

## Seed-managed versus manual records

`pastPapers` and `pastPaperQuestions` have an optional `seedManaged` flag.

- Canonical repository-controlled Biology 2019 records are marked `seedManaged: true` by release reconciliation.
- Records created by an admin are written as `seedManaged: false`.
- Editing a canonical seeded record through the admin workspace intentionally converts that record to `seedManaged: false`, making the current database version a manual override.
- Running the canonical Biology seed later deliberately restores the repository-controlled version for the same stable IDs. A release operator should therefore review intentional manual overrides before running a canonical reset.

## Deterministic Biology 2019 release seed

The normal `seedBiologyPastPaper:seed` mutation remains a non-destructive upsert. The release entrypoint is `seedBiologyPastPaperRelease:run`.

The release entrypoint performs two ordered operations:

1. Run the canonical Biology 2019 upsert.
2. Reconcile the expected paper/question stable IDs and mark the canonical records seed-managed.

With `reset` omitted or false, reconciliation is non-destructive. With `reset: true`, it additionally:

- removes duplicate rows for the canonical Biology 2019 paper stable ID;
- removes duplicate rows for each of the seven canonical question stable IDs;
- removes stale seed-managed questions attached to the Biology 2019 paper;
- removes legacy stale Biology 2019 question rows that use the repository's `bgcse-bio-2019-p3-` seed namespace;
- removes only seed-managed paper rows that match the Biology 2019 Paper 3 release identity/legacy namespace;
- leaves unrelated manual admin records untouched;
- leaves seed-managed Biology papers from other years or paper codes untouched.

This makes a deliberate reset reproducible without turning a 2019 cleanup into a broad Biology-course delete operation.

## Production operation boundary

The repository now contains the deterministic release operation, but this change does **not** execute it against production automatically. Production Convex mutation execution should happen only as part of an explicit deployment/content-release operation, after the target deployment and intended reset semantics are confirmed.

No Convex deployment credentials, Clerk secrets, Android signing keys, or other production secrets belong in this repository or in the seed data.
