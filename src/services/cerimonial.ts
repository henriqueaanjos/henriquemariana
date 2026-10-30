import axios from "axios";

export type RSVPGuestStatus = "pending" | "confirmed" | "declined";

export interface CerimonialGuest {
  id: string;
  familyId: string;
  familyName: string;
  familyCode: string;
  name: string;
  phone: string | null;
  status: RSVPGuestStatus;
}

interface ApiCerimonialGuest
  extends Omit<CerimonialGuest, "status"> {
  status: "PENDING" | "CONFIRMED" | "DECLINED" | RSVPGuestStatus;
}

interface UpdateCerimonialGuestResponse {
  id: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED";
}

function normalizeStatus(status: ApiCerimonialGuest["status"]): RSVPGuestStatus {
  switch (status) {
    case "CONFIRMED":
    case "confirmed":
      return "confirmed";
    case "DECLINED":
    case "declined":
      return "declined";
    default:
      return "pending";
  }
}

function toApiStatus(status: RSVPGuestStatus) {
  return status.toUpperCase() as
    | "PENDING"
    | "CONFIRMED"
    | "DECLINED";
}

export async function getCerimonialGuests(): Promise<CerimonialGuest[]> {
  const { data } = await axios.get<ApiCerimonialGuest[]>(
    "/api/cerimonial/guests",
  );

  return data.map((guest) => ({
    ...guest,
    phone: guest.phone ?? null,
    status: normalizeStatus(guest.status),
  }));
}

export async function updateCerimonialGuestStatus(
  guestId: string,
  status: RSVPGuestStatus,
) {
  const { data } = await axios.patch<UpdateCerimonialGuestResponse>(
    `/api/cerimonial/guests/${guestId}`,
    { status: toApiStatus(status) },
  );

  return data;
}

export function buildCerimonialWhatsAppUrl(
  guest: CerimonialGuest,
  message: string,
) {
  if (!guest.phone) return null;

  let phone = guest.phone.replace(/\D/g, "");

  if (!phone) return null;

  if (!phone.startsWith("55")) {
    phone = `55${phone}`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}