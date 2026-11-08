import { NextRequest, NextResponse } from "next/server";
import { recordEvent, type TrackedEventType } from "@/lib/analytics/store";

const VALID_TYPES: TrackedEventType[] = [
  "visitor",
  "quiz_start",
  "quiz_question_reached",
  "quiz_complete",
  "offer_view",
  "checkout_click",
  "purchase_confirmed",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, sessionId, questionId, utmCampaign } = body ?? {};

    if (typeof sessionId !== "string" || !sessionId) {
      return NextResponse.json({ ok: false, error: "missing_session_id" }, { status: 400 });
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ ok: false, error: "invalid_type" }, { status: 400 });
    }

    await recordEvent({
      type,
      sessionId,
      questionId: typeof questionId === "number" ? questionId : undefined,
      utmCampaign: typeof utmCampaign === "string" ? utmCampaign : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
