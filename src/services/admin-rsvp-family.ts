import axios from "axios";

export type RSVPGuestStatus =
    | "confirmed"
    | "pending"
    | "declined";

export interface AdminRSVPFamilyGuest {
    id: string;
    familyId: string;
    name: string;
    phone?: string | null;
    status: RSVPGuestStatus;
    createdAt: string;
    updatedAt: string;
}

export interface AdminRSVPFamilyDetail {
    id: string;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
    guests: AdminRSVPFamilyGuest[];
}

interface ApiFamilyMember {
    id: string;
    familyId: string;
    name: string;
    phone?: string | null;
    status: "PENDING" | "CONFIRMED" | "DECLINED";
    createdAt: string;
    updatedAt: string;
}

interface ApiFamilyResponse {
    id: string;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
    members: ApiFamilyMember[];
}

function normalizeStatus(
    status: ApiFamilyMember["status"],
): RSVPGuestStatus {
    switch (status) {
        case "CONFIRMED":
            return "confirmed";

        case "DECLINED":
            return "declined";

        case "PENDING":
        default:
            return "pending";
    }
}

export async function getAdminRSVPFamily(
    familyId: string,
): Promise<AdminRSVPFamilyDetail> {
    const { data } = await axios.get<ApiFamilyResponse>(
        `/api/admin/families/${familyId}`,
    );

    return {
        id: data.id,
        name: data.name,
        code: data.code,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,

        guests: data.members.map((member) => ({
            id: member.id,
            familyId: member.familyId,
            name: member.name,
            phone: member.phone ?? null,
            status: normalizeStatus(member.status),
            createdAt: member.createdAt,
            updatedAt: member.updatedAt,
        })),
    };
}

export async function createAdminRSVPFamilyMember(
  familyId: string,
  name: string,
  phone?: string,
) {
  const { data } = await axios.post(
    `/api/admin/families/${familyId}/members`,
    {
      name,
      phone: phone || null,
    },
  );

  return data;
}

export async function updateAdminRSVPFamily(
    familyId: string,
    name: string,
) {
    const { data } = await axios.patch(
        `/api/admin/families/${familyId}`,
        {
            name,
        },
    );

    return data;
}

export type UpdateAdminRSVPFamilyMemberPayload = {
  name?: string;
  phone?: string | null;
  status?: RSVPGuestStatus;
};

function toApiStatus(
    status: RSVPGuestStatus,
): "PENDING" | "CONFIRMED" | "DECLINED" {
    switch (status) {
        case "confirmed":
            return "CONFIRMED";

        case "declined":
            return "DECLINED";

        case "pending":
        default:
            return "PENDING";
    }
}

export async function updateAdminRSVPFamilyMember(
    familyId: string,
    memberId: string,
    payload: UpdateAdminRSVPFamilyMemberPayload,
) {
    const { data } = await axios.patch(
        `/api/admin/families/${familyId}/members/${memberId}`,
        {
            ...payload,
            ...(payload.status
                ? {
                    status: toApiStatus(payload.status),
                }
                : {}),
        },
    );

    return data;
}

export async function deleteAdminRSVPFamilyMember(
    familyId: string,
    memberId: string,
) {
    const { data } = await axios.delete(
        `/api/admin/families/${familyId}/members/${memberId}`,
    );

    return data;
}

export async function deleteAdminRSVPFamily(
    familyId: string,
) {
    const { data } = await axios.delete(
        `/api/admin/families/${familyId}`,
    );

    return data;
}