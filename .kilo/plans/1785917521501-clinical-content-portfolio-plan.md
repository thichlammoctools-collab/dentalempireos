# Dental Empire OS Clinical Content Portfolio

## Goal

Create and publish two static PDF portfolio files based on the Medical Affairs Executive Deck direction:

- English: `Dental Empire OS - Clinical Content Portfolio - EN.pdf`
- Vietnamese: `Dental Empire OS - Clinical Content Portfolio - VI.pdf`

Each PDF will contain the same 12-slide structure, be suitable for a 2–5 minute review, and be downloadable from the existing Astro site as public static assets.

## Decisions

- Format: PDF only for this iteration; no editable PPTX deliverable.
- Language: two separate files, not a 24-page bilingual file.
- Audience: international clients hiring for Medical Content Development, Medical Writing, Medical Education, Medical Affairs, or Clinical Content Development.
- Visual direction: Medical Affairs Executive Deck, with restrained medical navy/blue, white space, amber CTA accents, clear diagrams, and professional editorial hierarchy.
- Source: use existing Dental Empire OS content in the repository, especially the system overview, implementation principles, R.O.A.D.M.A.P, S.T.A.R.S, people development, training, measurement, and patient-experience concepts.
- Accuracy boundary: do not claim that the repository contains evidence-reviewed material on ICDAS, caries, gingivitis, or periodontitis. Any such page must either be omitted or labeled as a proposed educational concept/sample. No unsupported statistics, testimonials, clinical recommendations, or citations should be invented.
- Public delivery: place final PDFs in `public/files/`, following the existing static-resource convention.

## 12-Slide Content Plan

The English and Vietnamese decks must use matching page numbers, visual structure, and information hierarchy.

1. **Cover**
   - Dental Empire OS
   - Clinical Content Portfolio / Hồ sơ năng lực phát triển nội dung lâm sàng
   - Nguyễn Phước Vinh, DDS
   - Minimal title page with the project system motif.

2. **About the Project**
   - Objective, target audience, scope, and role.
   - Explain the project as a knowledge framework for standardizing workflows, communication, training, and operational excellence in modern dental practice.

3. **Content Architecture**
   - Show the three-tier architecture from the actual project: foundation and operations, scaling and improvement, and the Dental Empire OS management layer.
   - Position the work as structured educational content rather than a single long-form book chapter.

4. **Practice Workflow**
   - Use a clear end-to-end clinic workflow diagram.
   - Keep clinical and operational terminology accurate; present the diagram as a framework for organizing content and workflows, not as a universal clinical protocol.

5. **Framework Sample: Standardize Before Optimizing**
   - Convert the existing five principles into a visual decision/operating framework: standardize, clarify responsibilities, measure, automate/checklist, center the patient.
   - This is a direct transformation of existing content from “Triển Khai Hệ Thống Quản Trị”.

6. **Decision Framework Sample**
   - Show a generic clinical-content decision tree: define the problem, assess context/risk, select an action pathway, document, communicate, follow up.
   - Label it “illustrative portfolio framework” / “khung minh họa trong portfolio”.
   - Do not use ICDAS or disease-treatment recommendations unless reliable sources are added and cited during implementation.

7. **Patient Education Sample**
   - Demonstrate how a complex dental topic would be translated into causes, symptoms, risk factors, prevention, and when to seek professional care.
   - Use a clearly labeled sample topic and avoid unsupported clinical claims.

8. **Clinical Content to Patient Communication**
   - Show the transformation from technical concept to plain-language patient message, chairside prompt, and follow-up reminder.
   - Highlight readability, empathy, accuracy, and actionability.

9. **SOP Sample**
   - Present the existing operational logic as a concise SOP template: objective, scope, responsibilities, procedure, documentation, quality control, and review cycle.
   - Make clear that this is a content-design sample, not a legally or clinically approved SOP for a specific clinic.

10. **Training Material Sample**
    - Demonstrate a one-page training module with learning objective, key concept, example behavior, practice task, and feedback loop.
    - Use the existing training and people-development concepts from Dental Empire OS.

11. **Knowledge Translation Model**
    - Visual sequence: source knowledge/evidence → key message → clinical or operational framework → chairside recommendation → patient communication → feedback/measurement.
    - Include a short note distinguishing evidence review from the current project’s framework-design capability.

12. **Skills Demonstrated / Closing**
    - Medical Content Development
    - Clinical Documentation
    - Scientific and Technical Writing
    - Instructional Design
    - Clinical Education
    - Evidence-Based Communication
    - Workflow and SOP Design
    - Close with author name and Dental Empire OS reference.

## Implementation Steps

1. Inspect the current build tooling and existing PDF/static-resource conventions; choose a reproducible HTML deck-to-PDF workflow compatible with the repository and Node version.
2. Create a dedicated portfolio source directory outside the application route tree, with shared deck styles/components and separate English/Vietnamese content data so both versions remain structurally synchronized.
3. Build the 12-slide 16:9 deck using the project’s navy/medical-blue/amber visual language, with diagrams and typography optimized for PDF viewing rather than web scrolling.
4. Write the English content first, then produce a faithful Vietnamese counterpart. Preserve technical terms such as SOP, KPI, R.O.A.D.M.A.P, and S.T.A.R.S while adding Vietnamese explanations where needed.
5. Add a short accuracy/disclaimer treatment on the relevant sample pages, avoiding invented sources or claims. If clinical examples are used, cite only sources actually verified during implementation.
6. Render both decks to PDF with embedded/local assets and stable page dimensions.
7. Copy only the final PDFs into `public/files/` with URL-safe filenames. Do not add unnecessary intermediate HTML, screenshots, or build artifacts to public delivery.
8. Add or update the website’s resources/download area so both files are discoverable, labeled by language, and downloadable without authentication if the current resource policy permits public access.

## Validation

- Run `npm run astro -- check`.
- Run `npm run build`.
- Verify both PDFs open successfully and contain exactly 12 pages.
- Verify page dimensions are 16:9 and no text, diagrams, or translated strings overflow or overlap.
- Inspect representative pages at desktop and mobile browser widths through the download page; PDF itself remains fixed-format.
- Check that the two decks have matching page order and equivalent meaning.
- Confirm all public links resolve to the final files and filenames contain no spaces or unstable generated paths.
- Review the final diff to ensure only intended source, website-link, and PDF files changed.

## Risks and Boundaries

- Existing repository content is primarily practice-management and organizational-system content, not a complete evidence-based clinical guideline library. The portfolio must sell content-development capability without overstating clinical validation.
- Vietnamese source content contains at least one visible encoding-corruption sequence in the existing chapter text. The portfolio implementation must use verified UTF-8 and must not propagate corrupted text.
- Any real author portrait, credentials beyond “DDS”, logo, or clinical publication history not present in the repository should remain a placeholder or be omitted until supplied.
- PDF generation may require a local browser dependency. The implementation should document the exact reproducible command in project-local tooling only if needed, without committing generated caches.

## Out of Scope

- Editable PowerPoint/PPTX.
- A full rewrite of the Dental Empire OS book.
- New medical claims or a formal clinical guideline.
- New backend storage, CMS records, gated downloads, analytics, or email capture.
- A 24-page combined bilingual PDF.
