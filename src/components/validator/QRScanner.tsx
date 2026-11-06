"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

type QRScannerProps = {
  onCodeDetected: (value: string) => void;
};

export function QRScanner({ onCodeDetected }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "validator-qr-reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
        aspectRatio: 1,
      },
      false,
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        if (handledRef.current) return;

        handledRef.current = true;
        onCodeDetected(decodedText);
      },
      () => {},
    );

    return () => {
      const currentScanner = scannerRef.current;
      scannerRef.current = null;

      if (currentScanner) {
        void currentScanner.clear().catch(() => {});
      }
    };
  }, [onCodeDetected]);

  return (
    <div
      id="validator-qr-reader"
      className="w-full overflow-hidden rounded-xl"
    />
  );
}