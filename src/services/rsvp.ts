import axios from "axios";

export type RSVPStatus = "PENDING" | "CONFIRMED" | "DECLINED";

export type RSVPMember = {
  id: string;
  name: string;
  status: RSVPStatus;
};

export type RSVPFamily = {
  id: string;
  code: string;
  name: string;
  members: RSVPMember[];
};

type RSVPResponse = {
  success: boolean;
  members: RSVPMember[];
};

export async function getRSVP(code: string): Promise<RSVPFamily> {
  const normalizedCode = code.trim().toUpperCase();

  const { data } = await axios.get<RSVPFamily>(
    `/api/rsvp/${encodeURIComponent(normalizedCode)}`,
  );

  return data;
}

export async function submitRSVP(
  code: string,
  members: Array<{
    id: string;
    status: "CONFIRMED" | "DECLINED";
  }>,
): Promise<RSVPResponse> {
  const normalizedCode = code.trim().toUpperCase();

  const { data } = await axios.post<RSVPResponse>(
    `/api/rsvp/${encodeURIComponent(normalizedCode)}`,
    {
      members,
    },
  );

  return data;
}