import {
  completeScannerReportImageCreditRun,
  failScannerReportImageCreditRun,
} from './credit-db';
import { getSurveyDefinitionFull } from './survey-config-db';
import { getScannerResponse } from './scanner-response-db';
import { generateQueuedScannerReportImage, type ScannerReportImageType } from './scanner-report-image';

export interface ScannerReportImageQueueMessage {
  responseId: number;
  imageType: ScannerReportImageType;
  runId: string;
  userId: string;
}

export async function processScannerReportImageQueueMessage(
  env: Cloudflare.Env,
  message: ScannerReportImageQueueMessage,
): Promise<void> {
  const run = await env.DB.prepare(
    `SELECT "status" FROM "scanner_report_image_credit_run"
     WHERE "id" = ? AND "response_id" = ? AND "image_type" = ? AND "user_id" = ?`,
  ).bind(message.runId, message.responseId, message.imageType, message.userId).first<{ status: string }>();
  if (!run || run.status !== 'reserved') return;

  try {
    const response = await getScannerResponse(env.DB, message.responseId);
    if (!response) throw new Error('Không tìm thấy kết quả Scanner.');
    const reportText = message.imageType === 'analysis' ? response.ai_analysis : response.ai_plan;
    if (!reportText?.trim()) throw new Error('Báo cáo chữ chưa sẵn sàng để tạo minh họa.');
    const definition = await getSurveyDefinitionFull(env.DB, response.survey_id);
    if (!definition) throw new Error('Không tìm thấy cấu hình Scanner.');

    const key = await generateQueuedScannerReportImage(
      env,
      response,
      definition.definition.title_vi,
      message.imageType,
    );
    if (!key) {
      const latest = await getScannerResponse(env.DB, message.responseId);
      const imageKey = message.imageType === 'analysis' ? latest?.image_analysis_key : latest?.image_plan_key;
      if (!imageKey) throw new Error('Minh họa đang được tạo bởi một yêu cầu khác.');
    }
    await completeScannerReportImageCreditRun(env.DB, message);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error('[scanner-report-image-queue] Generation failed:', reason);
    try {
      await failScannerReportImageCreditRun(env.DB, { ...message, reason });
    } catch (refundError) {
      console.error('[scanner-report-image-queue] Credit release failed:', refundError);
    }
  }
}
