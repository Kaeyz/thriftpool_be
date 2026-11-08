# Codebase Guidelines

This repository is a pnpm monorepo. The primary application is `apps/cp-server`; shared functionality lives in `packages/*`. Follow the closest existing implementation when the guidance below does not cover a case.

## Before changing code

- Read the surrounding module, its Zod schemas, and a neighboring feature with similar behavior before choosing a pattern.
- Keep changes within the relevant feature module and update directly related schemas, DTOs, types, tests, and documentation together.
- Preserve unrelated work in the working tree. Avoid broad refactors when a focused change is sufficient.

## Domain context

- A user's `bank_account` is an external bank account registered with the platform; it is not an in-app account or wallet. The platform does not read or track the account's actual bank balance.
- Bank-account history records platform-related transactions associated with registered external bank accounts. Debit and credit entries describe transaction direction for the platform record; they do not represent verified changes to the account's actual bank balance.

## Application structure and boundaries

- Feature modules generally organize code into `api/`, `services/`, `db/`, `common/`, and `zod/`. Follow the module's existing layout and kebab-case file naming.
- Keep HTTP concerns in routes/controllers, business rules and orchestration in services, and database queries in repositories.
- Routes should use the existing context/auth middleware, Zod request validation, and HTTP error handling. Controllers should delegate to services rather than implementing domain logic.
- Controllers must whitelist query parameters before calling services: destructure only supported fields from the validated query and construct the typed query object explicitly. Never pass raw `req.query` to a service or spread it into a database filter.
- A module must not import another module's repository or database-layer implementation. Cross-module communication goes through that module's service; expose a narrow service method when needed.
- A module must never import another module's Mongoose model. Repositories may use models owned by their own module only; expose cross-module data access through the owning module's service and pass the resulting data into the calling module.
- Export files ending in `.service.ts` from the module's `index.ts`. Code importing a service from another module must import it from that module's root (for example, `@/modules/pools`), never directly from its `services/` implementation path. This rule does not apply to other files under `services/`.
- Reuse shared packages and their public exports instead of duplicating utilities or reaching into another package's internal files.

## Validation, types, and errors

- Treat Zod schemas as the source of truth for validated input and output shapes. Reuse shared schemas and enums rather than defining parallel versions.
- Do not create duplicate or alias Zod schemas when the shape is unchanged; reference the canonical schema directly. Create an extended schema only when its shape or validation behavior differs.
- Define feature schemas only in the module's `zod/*.zod.ts` files. API schema registry files should import those schemas and convert them to JSON Schema; do not define additional Zod schemas in API schema files.
- Use `z.iso.datetime()` for date-time fields in canonical Zod response schemas used by API documentation. Reference that schema directly when generating API JSON Schema; do not extend it with a duplicate API-only schema to convert `z.date()` fields.
- For media fields, reuse the shared `MediaFileSchema` from `apps/cp-server/src/lib/file-upload`; do not recreate the media object shape in feature schemas.
- Implement media uploads through the existing file-upload pipeline: define an entity/use-case `EntityConfig` with validation, upload constraints, and a resolver; register it in `fileUploadConfigs` and the appropriate request-source allowlist. Do not bypass the generic upload handler with a separate upload implementation.
- When a module's DTO exports an inferred domain type (such as a status or input type), reuse that DTO type in other module files instead of repeating `z.infer` against the schema.
- Whenever IDs are accepted as a string or string array and used as a list in a repository/database query, normalize them with `transformIds` (including values returned by another service). Do not manually split, wrap, or otherwise normalize ID lists.
- Keep TypeScript types aligned with the schemas and persisted model fields. The project uses strict TypeScript; prefer explicit, accurate types and guards over unsafe casts.
- Use the existing `AppError` and `StatusCodes` patterns for expected failures. Reuse module response messages where available; do not silently return success-shaped fallbacks for invalid or missing data.
- Sanitize database documents through the module's established response utilities before exposing them from service/API boundaries.
- Pass the request `Ctx` through service and repository calls. Respect its optional database session so operations remain part of the surrounding transaction.
- Every public service method, including methods used across module boundaries, must return an object containing both `data` and `message`. Use a meaningful success message and represent an optional missing result or successful deletion as `data: null`; private implementation helpers and pipeline callbacks with an established non-service contract are exempt.
- For list reads, use the repository's `getAll` method rather than adding list-specific repository methods. `getAll` must select and return the populated `IP` schema variant, not database documents; add needed fields to that `IP` schema instead of adding a full-document result option. Add filter/sort fields to its query schema and implementation as needed; pass an appropriate `limit` (for example, the expected pool-slot count) for bounded internal reads. If a caller must fetch all matching records, support an explicit pagination option on `getAll` instead of bypassing it with a separate list method.
- Include all list filters (including plural ID filters such as `invoiceIds`) in the query schema/type used by `getAll`; pass the effective, authorization-scoped query through that type rather than adding a separate repository filter argument.
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
