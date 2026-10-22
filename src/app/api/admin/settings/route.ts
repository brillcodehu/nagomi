import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  LEGAL_FIELDS,
  getLegalSettings,
  saveLegalSettings,
  type LegalSettings,
} from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    fields: LEGAL_FIELDS,
    values: await getLegalSettings(),
  });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Partial<LegalSettings>;
  try {
    await saveLegalSettings(body);
  } catch (error) {
    console.error("Jogi beállítások mentése sikertelen:", error);
    return NextResponse.json(
      { error: "A mentés nem sikerült (a settings tábla hiányozhat: /api/setup)." },
      { status: 500 }
    );
  }
  return NextResponse.json({ values: await getLegalSettings() });
}
