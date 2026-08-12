import { generateOpenAiCompatibleImage } from './ai-client';
import { getAiGatewayConfig } from './ai-gateway';
import { getAiSettings } from './ai-settings-db';
import { parseScores, setScannerImageKey, type ScannerResponseRow } from './scanner-response-db';
import { claimScannerReportImageJob, finishScannerReportImageJob } from './ai-operations';

type ImageType = 'analysis' | 'plan';

function buildImagePrompt(
  surveyTitle: string,
  response: ScannerResponseRow,
  type: ImageType,
): string {
  const totalScore = Math.round(parseScores(response.scores_json).total ?? 0);
  const reportLabel = type === 'analysis' ? 'system diagnostic' : '30-day execution roadmap';

  return `Create a premium portrait editorial illustration for an A4 Vietnamese dental clinic management ${reportLabel}. Theme: ${surveyTitle}. Overall maturity score: ${totalScore}/100. Show an abstract modern dental clinic operations system: calm clinical architecture, coordinated team workflow, subtle data visualization, and a forward-looking path of improvement. Deep navy, medical blue, ivory, and restrained warm amber accents. Sophisticated Vietnamese healthcare business aesthetic, high-end annual report cover, clean composition with generous negative space. No text, letters, numbers, logos, watermarks, people portraits, patient imagery, identifiable clinic details, or dental procedures.`;
}

/**
 * Creates an optional visual companion for a completed report. Failure is
 * non-fatal: the written AI report remains the source of truth.
 */
export async function createScannerReportImage(
  env: Cloudflare.Env,
  response: ScannerResponseRow,
  surveyTitle: string,
  type: ImageType,
): Promise<string | null> {
  const config = await getAiGatewayConfig(env.DB, 'scanner');
  if (!config || config.provider_id !== 'motapis') return null;
  const settings = await getAiSettings(env.DB);
  if (!settings.motapis_image_model) return null;

  const existingKey = type === 'analysis' ? response.image_analysis_key : response.image_plan_key;
  if (existingKey && await env.MEDIA.head(existingKey)) return existingKey;

  const image = await generateOpenAiCompatibleImage({ ...config, model_id: settings.motapis_image_model }, buildImagePrompt(surveyTitle, response, type));
  const key = `scanner-report-images/${response.id}/${type}.png`;
  await env.MEDIA.put(key, image, {
    httpMetadata: { contentType: 'image/png', contentDisposition: 'inline' },
  });
  await setScannerImageKey(env.DB, response.id, type, key);
  return key;
}

/**
 * Claims one image job per report/type across all Workers before calling the
 * image API. The caller deliberately does not await this from an SSE request.
 */
export async function generateQueuedScannerReportImage(
  env: Cloudflare.Env,
  response: ScannerResponseRow,
  surveyTitle: string,
  type: ImageType,
): Promise<string | null> {
  const config = await getAiGatewayConfig(env.DB, 'scanner');
  if (!config || config.provider_id !== 'motapis') return null;
  if (!(await getAiSettings(env.DB)).motapis_image_model) return null;
  const existingKey = type === 'analysis' ? response.image_analysis_key : response.image_plan_key;
  if (existingKey && await env.MEDIA.head(existingKey)) return existingKey;

  const job = await claimScannerReportImageJob(env.DB, response.id, type);
  if (!job.claimed) return null;
  try {
    const key = await createScannerReportImage(env, response, surveyTitle, type);
    await finishScannerReportImageJob(env.DB, response.id, type, job.runId, 'done');
    return key;
  } catch (error) {
    await finishScannerReportImageJob(env.DB, response.id, type, job.runId, 'failed');
    throw error;
  }
}
