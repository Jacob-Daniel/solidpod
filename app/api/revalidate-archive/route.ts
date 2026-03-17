import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(_req: NextRequest) {
  try {
    revalidatePath("/archive");
    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
