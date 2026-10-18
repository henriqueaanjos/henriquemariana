'use client'

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../libs/react-query";
import { PlaylistAudioProvider } from "../components/PlaylistAudioProvider";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PlaylistAudioProvider>
        <Suspense>
          {children}
        </Suspense>
      </PlaylistAudioProvider>
    </QueryClientProvider>
  );
}