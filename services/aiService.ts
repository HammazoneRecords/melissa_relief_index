import { KPIMetrics, CommunityReport, GovPromise } from '../types';

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
const API_URL = 'https://api.deepseek.com/chat/completions';

export const generateAnalysis = async (
  metrics: KPIMetrics,
  reports: CommunityReport[],
  promises: GovPromise[]
): Promise<string> => {
  if (!API_KEY) {
    return [
      '### Predictions Lab',
      '',
      'This feature uses AI to analyse patterns in donation flows, field reports, and government promises to surface risks and recommendations.',
      '',
      '**To enable:** Add `VITE_DEEPSEEK_API_KEY` to your `.env` file.',
    ].join('\n');
  }

  const contextData = {
    kpis: metrics,
    recentReports: reports.slice(0, 5),
    pendingPromises: promises.filter(p => p.status !== 'Distributed'),
  };

  const prompt = `You are a civic accountability analyst reviewing Jamaica relief data.
Analyse the following JSON and produce a concise Markdown report with three sections:
1. **Supply Chain Risks** — gaps between funds received and disbursed, which parishes are underserved
2. **Field Report Outlook** — recurring issues, parishes with high/critical severity
3. **Top Recommendation** — one concrete action for the next 48 hours

Data: ${JSON.stringify(contextData)}

Keep the tone factual and data-driven. Do not reference any named storm or event.`;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    throw new Error(`DeepSeek API error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? 'No analysis returned.';
};
