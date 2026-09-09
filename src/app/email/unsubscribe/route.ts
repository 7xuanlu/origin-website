import { handleUnsubscribe } from '@/lib/email/unsubscribe-handler';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Standalone HTML response: no analytics, referrer leakage or root layout scripts.
export async function GET(request: Request) { return handleUnsubscribe(request); }
export async function POST(request: Request) { return handleUnsubscribe(request); }
