
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, type CameraDevice } from "html5-qrcode";
import { Camera, CameraRotateIcon, } from "@phosphor-icons/react/dist/ssr";

type QRScannerProps = {
  onCodeDetected: (value: string) => void;
};

const scannerConfig = {
  fps: 10,
  qrbox: {
    width: 250,
    height: 250,
  },
  aspectRatio: 1,
};

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(
    navigator.userAgent,
  );
}

function getPreferredCamera(cameras: CameraDevice[]) {
  const mobile = isMobileDevice();

  if (mobile) {
    return cameras.find((camera) =>
      /back|rear|environment|traseira|environment facing/i.test(
        camera.label,
      ),
    );
  }

  return cameras.find((camera) =>
    /webcam|integrated|facetime|built.?in|camera/i.test(
      camera.label,
    ),
  );
}

export function QRScanner({ onCodeDetected }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const handledRef = useRef(false);

  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const scanner = new Html5Qrcode("validator-qr-reader");
    scannerRef.current = scanner;

    async function initializeCamera() {
      try {
        setLoading(true);
        setError("");

        const mobile = isMobileDevice();

        // Solicita inicialmente a câmera frontal no computador
        // ou traseira no celular.
        await scanner.start(
          {
            facingMode: mobile ? "environment" : "user",
          },
          scannerConfig,
          (decodedText) => {
            if (handledRef.current) return;

            handledRef.current = true;
            onCodeDetected(decodedText);
          },
          () => {},
        );

        if (cancelled) return;

        // Após concedida a permissão, os nomes das câmeras
        // normalmente ficam disponíveis.
        const availableCameras = await Html5Qrcode.getCameras();

        if (cancelled) return;

        setCameras(availableCameras);

        const preferredCamera =
          getPreferredCamera(availableCameras);

        if (preferredCamera) {
          setSelectedCamera(preferredCamera.id);

          // Garante que a câmera preferencial seja utilizada.
          await scanner.stop();

          if (cancelled) return;

          await scanner.start(
            preferredCamera.id,
            scannerConfig,
            (decodedText) => {
              if (handledRef.current) return;

              handledRef.current = true;
              onCodeDetected(decodedText);
            },
            () => {},
          );
        }

        if (!cancelled) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro ao iniciar câmera:", err);

        if (!cancelled) {
          setError(
            "Não foi possível acessar a câmera. Verifique as permissões do navegador.",
          );
          setLoading(false);
        }
      }
    }

    void initializeCamera();

    return () => {
      cancelled = true;

      const currentScanner = scannerRef.current;
      scannerRef.current = null;

      if (currentScanner?.isScanning) {
        void currentScanner.stop()
          .then(() => currentScanner.clear())
          .catch(() => {});
      } else {
        void currentScanner?.clear()
      }
    };
  }, [onCodeDetected]);

  async function handleCameraChange(cameraId: string) {
    const scanner = scannerRef.current;

    if (!scanner || !cameraId || switching) return;

    try {
      setSwitching(true);
      setError("");

      if (scanner.isScanning) {
        await scanner.stop();
      }

      await scanner.start(
        cameraId,
        scannerConfig,
        (decodedText) => {
          if (handledRef.current) return;

          handledRef.current = true;
          onCodeDetected(decodedText);
        },
        () => {},
      );

      setSelectedCamera(cameraId);
    } catch (err) {
      console.error("Erro ao trocar câmera:", err);
      setError("Não foi possível utilizar essa câmera.");
    } finally {
      setSwitching(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Camera size={20} className="text-[#6E4C12]" />

          <span className="text-sm font-medium text-neutral-700">
            Leitor de QR Code
          </span>
        </div>

        {switching && (
          <span className="text-xs text-neutral-400">
            Alterando câmera...
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E9E2D5] bg-black">
        <div
          id="validator-qr-reader"
          className="min-h-[300px] w-full"
        />
      </div>

      {loading && (
        <p className="text-center text-sm text-neutral-500">
          Inicializando câmera...
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {cameras.length > 1 && (
        <div className="space-y-2">
          <label
            htmlFor="validator-camera"
            className="flex items-center gap-2 text-sm font-medium text-neutral-700"
          >
            <CameraRotateIcon size={18} />
            Selecionar câmera
          </label>

          <select
            id="validator-camera"
            value={selectedCamera}
            onChange={(event) =>
              void handleCameraChange(event.target.value)
            }
            disabled={switching}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#D9B982] disabled:opacity-50"
          >
            <option value="" disabled>
              Selecione uma câmera
            </option>

            {cameras.map((camera, index) => (
              <option key={camera.id} value={camera.id}>
                {camera.label || `Câmera ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <p className="text-center text-xs text-neutral-400">
        Posicione o QR Code dentro da área de leitura.
      </p>
    </div>
  );
}
