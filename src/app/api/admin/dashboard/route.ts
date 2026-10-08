import { db } from "@/src/prisma/db";
import { requireAdminSession } from "@/src/services/admin-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const isAdmin = await requireAdminSession();

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 },
      );
    }

    const [
      photos,
      songs,
      messages,
      families,
      members,
    ] = await Promise.all([
      db.orm.public.Photo
        .orderBy((photo) => photo.createdAt.desc())
        .all(),

      db.orm.public.Songs
        .orderBy((song) => song.createdAt.desc())
        .all(),

      db.orm.public.Message
        .orderBy((message) => message.createdAt.desc())
        .all(),

      db.orm.public.Family
        .orderBy((family) => family.createdAt.desc())
        .all(),

      db.orm.public.FamilyMember
        .orderBy((member) => member.createdAt.asc())
        .all(),
    ]);

    const photoList = [...photos];
    const songList = [...songs];
    const messageList = [...messages];
    const familyList = [...families];
    const memberList = [...members];

    const confirmed = memberList.filter(
      (member) => member.status === "CONFIRMED",
    );

    const declined = memberList.filter(
      (member) => member.status === "DECLINED",
    );

    const pending = memberList.filter(
      (member) => member.status === "PENDING",
    );

    return NextResponse.json(
      {
        stats: {
          families: familyList.length,
          guests: memberList.length,
          confirmed: confirmed.length,
          declined: declined.length,
          pending: pending.length,
          photos: photoList.length,
          songs: songList.length,
          messages: messageList.length,
        },

        rsvp: {
          total: memberList.length,
          confirmed: confirmed.length,
          declined: declined.length,
          pending: pending.length,
        },

        recent: {
          photos: photoList.slice(0, 5),
          songs: songList.slice(0, 5),
          messages: messageList.slice(0, 5),
          families: familyList.slice(0, 5),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/admin/dashboard error:", error);

    return NextResponse.json(
      { error: "Não foi possível carregar o dashboard." },
      { status: 500 },
    );
  }
}