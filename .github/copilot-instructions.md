# Wellcome Collection PR Review Guidelines

**These guidelines are specifically for PR reviews.** For active development guidelines, see [AGENTS.md](../AGENTS.md).

Patterns and conventions to check for when reviewing pull requests. General coding standards (language, workspace structure, naming conventions, etc.) are in AGENTS.md.

## TODOs and Technical Debt

When you see new TODOs being added, ask whether this is the right time to add it or if it should be addressed in the current PR. However, don't suggest removing existing TODOs - they're there for a reason and the team will address them when ready.

If there are existing TODOs in the code being changed, check whether they are still relevant or if they can be removed. In both cases, flag it to the developer.

## Documentation

When reviewing, check whether documentation needs updating:
- READMEs affected by new features, changed commands, or modified setup steps
- Files in `docs/` that relate to the changes
- Code comments that might be outdated by the changes
- API documentation if endpoints or contracts change
- The AGENTS.md and copilot-instructions.md files if the changes affect coding standards or instructions for Copilot

If the PR changes behaviour or adds features but doesn't update relevant docs, flag it.

## Accessibility

We aim for WCAG AA compliance as a minimum. When reviewing, check for:

- Semantic HTML (proper heading hierarchy, landmarks, form labels)
- Keyboard navigation support
- Alt text for images
- Colour contrast ratios
- ARIA attributes used correctly (not over-used)
- Focus management in interactive components

## Duplication and Code Reuse

When reviewing, check whether:
- New utilities or helpers duplicate existing code in `common/utils/` or `common/services/`
- Logic appears in multiple places that could be centralised
- Imports use `@weco/` packages rather than relative paths across package boundaries
- Removed dependencies have left behind unused imports or obsolete files or functions

Key locations for shared code:
- `common/utils/` - shared utilities
- `common/services/` - shared services
- `content/webapp/services/prismic/transformers/` - Prismic transformers
- `content/webapp/services/` - API clients

If you see duplication, flag it and suggest the existing shared implementation.
