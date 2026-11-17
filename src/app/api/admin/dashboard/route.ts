import { db } from "@/src/prisma/db";
import { requireAdminSession } from "@/src/services/admin-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    const adults = memberList.filter(
      (member) => member.ageGroup === "ADULT",
    );

    const children4To7 = memberList.filter(
      (member) => member.ageGroup === "CHILD_4_7",
    );

    const childrenUnder4 = memberList.filter(
      (member) => member.ageGroup === "CHILD_UNDER_4",
    );

    const children = memberList.filter(
      (member) => member.ageGroup !== "ADULT",
    );

    return NextResponse.json(
      {
        stats: {
          families: familyList.length,
          guests: memberList.length,
          confirmed: confirmed.length,
          declined: declined.length,
          pending: pending.length,
          adults: adults.length,
          children: children.length,
          children4To7: children4To7.length,
          childrenUnder4: childrenUnder4.length,
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
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/admin/dashboard error:", error);

    return NextResponse.json(
      { error: "Não foi possível carregar o dashboard." },
      { status: 500 },
    );
  }
}