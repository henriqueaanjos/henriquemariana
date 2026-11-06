
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  checkInGuest,
  getValidatorFamily,
} from "@/src/services/validator";

export function useValidatorFamily(code: string) {
  return useQuery({
    queryKey: ["validator", "family", code],
    queryFn: () => getValidatorFamily(code),
    enabled: Boolean(code),
    retry: false,
    staleTime: 0,
  });
}

export function useCheckInGuest(code: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkInGuest,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["validator", "family", code],
      });
    },
  });
}
