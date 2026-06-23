import type { APIRoute } from 'astro';
import { getSurveyResponse } from '../../../../lib/survey-db';
import { generateSurveyPdf } from '../../../../lib/pdf-generator';

export const prerender = false;

// GET /api/survey/:id/pdf — download PDF report
export const GET: APIRoute = async ({ params, locals }) => {
  const db = (locals as any).env?.DB;
  const id = parseInt(params.id ?? '', 10);
  if (!id || Number.isNaN(id)) {
    return new Response('Invalid ID', { status: 400 });
  }

  const row = await getSurveyResponse(db, id);
  if (!row) {
    return new Response('Survey not found', { status: 404 });
  }

  try {
    const pdfBytes = await generateSurveyPdf(row);
    const fileName = `GocRe_${(row.clinic_name ?? 'survey').replace(/[^a-zA-Z0-9]/g, '-')}_${id}.pdf`;
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('PDF generation error:', err);
    return new Response('PDF generation failed', { status: 500 });
  }
};
