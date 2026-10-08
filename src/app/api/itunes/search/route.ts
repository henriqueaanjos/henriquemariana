import { NextRequest, NextResponse } from "next/server";

const ITUNES_API_URL = "https://itunes.apple.com/search";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const query = searchParams.get("q")?.trim();

        if (!query) {
            return NextResponse.json(
                { results: [] },
                { status: 200 }
            );
        }

        const params = new URLSearchParams({
            term: query,
            media: "music",
            entity: "song",
            limit: "10",
            country: "BR",
        });

        const response = await fetch(
            `${ITUNES_API_URL}?${params.toString()}`,
            {
                next: {
                    revalidate: 60,
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `iTunes API returned ${response.status}`
            );
        }

        const data = await response.json();

        const results = data.results.map((track: any) => ({
            trackId: track.trackId,
            title: track.trackName,
            artist: track.artistName,
            album: track.collectionName ?? null,
            artworkUrl: track.artworkUrl100 ?? null,
            previewUrl: track.previewUrl ?? null,
            itunesUrl: track.trackViewUrl ?? null,
        }));

        return NextResponse.json({
            results,
        });
    } catch (error) {
        console.error("iTunes search error:", error);

        return NextResponse.json(
            {
                error: "Não foi possível buscar as músicas.",
            },
            {
                status: 500,
            }
        );
    }
}