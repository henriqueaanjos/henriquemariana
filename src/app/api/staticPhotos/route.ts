import { getAlbums } from "@/src/services/staticPhotos";
import { NextResponse } from "next/server";

export async function GET() {
    const albums = getAlbums();

    return NextResponse.json(albums);
}