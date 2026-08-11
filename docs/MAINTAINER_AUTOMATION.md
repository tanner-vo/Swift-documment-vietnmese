# Maintainer automation plan

This document separates current capabilities from proposed Codex/OpenAI API
work. It is intended to make the maintenance plan reviewable and measurable.

## Current maintenance load

The primary maintainer currently owns:

- monitoring changes in The Swift Programming Language;
- updating DocC/HTML parsers when source shapes change;
- checking that code, API names and glossary terms survive translation;
- reviewing Vietnamese corrections block by block;
- triaging issues, reviewing pull requests and preparing releases;
- dependency and security maintenance.

## Proposed use of Codex and API credits

### Upstream change detection

Fetch authorized public DocC metadata on a schedule, compare normalized blocks,
and draft a maintainer issue or PR containing only the changed sections.

### Translation assistance

Generate glossary-constrained EN→VI suggestions for changed prose. Code blocks,
inline code, URLs and protected terminology must be locked before model input and
verified after output. Suggestions never bypass human review.

### Parser regression coverage

Turn minimal failing DocC/HTML samples into fixtures and draft tests for known
node types. Codex may propose code, but CI and maintainer review decide acceptance.

### Issue and pull-request operations

Summarize reproducible reports, identify the affected chapter/parser, flag
missing evidence, draft review checklists and prepare release-note entries.

### Security maintenance

Review authentication boundaries, dependency changes and untrusted-content
parsing. Security findings are kept private until coordinated remediation.

## Safety and data boundaries

- Use only public Swift.org material and repository data authorized by the
  maintainer.
- Do not submit secrets, private reports, personal data or unrelated code.
- Treat all generated text/code as untrusted until validation and human review.
- Keep the maintainer token outside prompts, logs, issues and source control.
- Record model-assisted changes in PR descriptions when materially relevant.
- Preserve source attribution and CC BY 4.0 obligations.

## Success metrics

- median time to detect and prepare an upstream update;
- percentage of protected code/terms preserved by automated checks;
- parser regressions caught in CI before release;
- median issue/PR first-response and review time;
- number of human-approved translation corrections reused from cache;
- security/dependency findings closed within the documented response window.

No automated workflow will merge, publish, or change translations without a
maintainer-controlled approval step.
