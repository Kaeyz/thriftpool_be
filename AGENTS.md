# Codebase Guidelines

This repository is a pnpm monorepo. The primary application is `apps/cp-server`; shared functionality lives in `packages/*`. Follow the closest existing implementation when the guidance below does not cover a case.

## Before changing code

- Read the surrounding module, its Zod schemas, and a neighboring feature with similar behavior before choosing a pattern.
- Keep changes within the relevant feature module and update directly related schemas, DTOs, types, tests, and documentation together.
- Preserve unrelated work in the working tree. Avoid broad refactors when a focused change is sufficient.

## Application structure and boundaries

- Feature modules generally organize code into `api/`, `services/`, `db/`, `common/`, and `zod/`. Follow the module's existing layout and kebab-case file naming.
- Keep HTTP concerns in routes/controllers, business rules and orchestration in services, and database queries in repositories.
- Routes should use the existing context/auth middleware, Zod request validation, and HTTP error handling. Controllers should delegate to services rather than implementing domain logic.
- A module must not import another module's repository or database-layer implementation. Cross-module communication goes through that module's service; expose a narrow service method when needed.
- A module must never import another module's Mongoose model. Repositories may use models owned by their own module only; expose cross-module data access through the owning module's service and pass the resulting data into the calling module.
- Reuse shared packages and their public exports instead of duplicating utilities or reaching into another package's internal files.

## Validation, types, and errors

- Treat Zod schemas as the source of truth for validated input and output shapes. Reuse shared schemas and enums rather than defining parallel versions.
- When a Zod field uses `FieldSchemas.dbIdsSchema` and accepts a string or string array, normalize it with `transformIds` before using it as a list in repository/database queries.
- Keep TypeScript types aligned with the schemas and persisted model fields. The project uses strict TypeScript; prefer explicit, accurate types and guards over unsafe casts.
- Use the existing `AppError` and `StatusCodes` patterns for expected failures. Reuse module response messages where available; do not silently return success-shaped fallbacks for invalid or missing data.
- Sanitize database documents through the module's established response utilities before exposing them from service/API boundaries.
- Pass the request `Ctx` through service and repository calls. Respect its optional database session so operations remain part of the surrounding transaction.
- Every public service method, including methods used across module boundaries, must return an object containing both `data` and `message`. Use a meaningful success message and represent an optional missing result as `data: null`; private implementation helpers are exempt.
- For list reads, use the repository's `getAll` method rather than adding list-specific repository methods. `getAll` must select and return the populated `IP` schema variant, not database documents; add needed fields to that `IP` schema instead of adding a full-document result option. Add filter/sort fields to its query schema and implementation as needed; pass an appropriate `limit` (for example, the expected pool-slot count) for bounded internal reads. If a caller must fetch all matching records, support an explicit pagination option on `getAll` instead of bypassing it with a separate list method.
- Single-document repository methods should return their document type on success or the document type / `null` when the record may be absent. Use `getAll` for list queries. Avoid boolean-only results for document lookups; use a document-or-`null` lookup. Do not throw generic `Error`s from repositories for absent results—return `null` and let the service apply domain-specific error handling.
- Declare an explicit return type on every repository method except `getAll`, whose `IP` schema result and pagination metadata can be inferred from its implementation.

## Tests and verification

- Tests use Vitest and follow the `*.test.ts` naming convention. Put tests near the code or in the location already used by that module.
- Run the narrowest relevant test first, then the `cp-server` checks applicable to the change:
  - `pnpm cp test`
  - `pnpm cp lint`
  - `pnpm cp build`
- Root package scripts do not provide general `test`, `lint`, or `build` commands; use the `cp-server` scripts above or the appropriate package's own scripts.
- Report checks that could not run and distinguish pre-existing workspace failures from failures introduced by the change.

## Useful references

- [README.md](./README.md) for repository setup and running the application.
- [Bank account module](./apps/cp-server/src/modules/bank-accounts/) for an example feature-module layout.
- [Web app route registration](./apps/cp-server/src/runtime/http/routes/web-app.ts) for route wiring.
- [HTTP input validation](./packages/runtime/src/http/http-input-validator.ts) and [HTTP response/error handling](./packages/runtime/src/http/http-res-handler.ts) for shared request lifecycle patterns.
