
import axios from "axios";

export type ValidatorGuest = {
  id: string;
  name: string;
  status: "PENDING" | "CONFIRMED" | "DECLINED";
  checkedInAt: string | null;
};

export type ValidatorFamily = {
  id: string;
  code: string;
  name: string;
  members: ValidatorGuest[];
};

type CheckInResponse = {
  success: boolean;
  checkedInAt: string;
};

export async function getValidatorFamily(
  code: string,
): Promise<ValidatorFamily> {
  const normalizedCode = code.trim().toUpperCase();

  const { data } = await axios.get<ValidatorFamily>(
    `/api/validator/families/${encodeURIComponent(normalizedCode)}`,
  );

  return data;
}

export async function checkInGuest(
  guestId: string,
): Promise<CheckInResponse> {
  const { data } = await axios.patch<CheckInResponse>(
    `/api/validator/guest/${encodeURIComponent(guestId)}`,
  );

  return data;
}
