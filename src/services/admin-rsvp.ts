
import axios from "axios";

export type RSVPGuestStatus = "confirmed" | "pending" | "declined";

export interface AdminRSVPGuest {
  id: string;
  name: string;
  status: RSVPGuestStatus;
  checkedInAt: string | null;
}

export interface AdminRSVPFamily {
  id: string;
  name: string;
  code: string;
  guests: AdminRSVPGuest[];
}

interface ApiFamily {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiFamilyMember {
  id: string;
  familyId: string;
  name: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED";
  checkedInAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

function normalizeStatus(
  status: ApiFamilyMember["status"],
): RSVPGuestStatus {
  switch (status) {
    case "CONFIRMED":
      return "confirmed";
    case "DECLINED":
      return "declined";
    default:
      return "pending";
  }
}

async function getFamilyMembers(
  familyId: string,
): Promise<AdminRSVPGuest[]> {
  const { data } = await axios.get<ApiFamilyMember[]>(
    `/api/admin/families/${familyId}/members`,
  );

  return data.map((member) => ({
    id: member.id,
    name: member.name,
    status: normalizeStatus(member.status),
    checkedInAt: member.checkedInAt ?? null,
  }));
}

export async function getAdminRSVPFamilies(): Promise<
  AdminRSVPFamily[]
> {
  const { data: families } = await axios.get<ApiFamily[]>(
    "/api/admin/families",
  );

  const familiesWithMembers = await Promise.all(
    families.map(async (family) => {
      const guests = await getFamilyMembers(family.id);

      return {
        id: family.id,
        name: family.name,
        code: family.code,
        guests,
      };
    }),
  );

  return familiesWithMembers;
}

export async function createAdminFamily(
  name: string,
): Promise<AdminRSVPFamily> {
  const { data } = await axios.post<ApiFamily>(
    "/api/admin/families",
    { name },
  );

  return {
    id: data.id,
    name: data.name,
    code: data.code,
    guests: [],
  };
}
