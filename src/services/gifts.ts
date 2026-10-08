import axios from "axios";

interface CreateGiftCheckoutResponse {
  id: string;
  checkoutUrl: string;
}

export async function createGiftCheckout(amount: number) {
  const { data } = await axios.post<CreateGiftCheckoutResponse>(
    "/api/gifts/checkout",
    { amount },
  );

  return data;
}