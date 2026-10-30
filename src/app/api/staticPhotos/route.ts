import { NextResponse } from "next/server";
import { getAlbums } from "@/src/services/staticPhotos";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(getAlbums());
}