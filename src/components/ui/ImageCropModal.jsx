"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiZoomIn, FiZoomOut } from "react-icons/fi";

async function cropImage(imageSrc, crop, zoom, rotation = 0) {
  const image = await new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const rotationRad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rotationRad));
  const cos = Math.abs(Math.cos(rotationRad));
  const rotatedW = image.width * cos + image.height * sin;
  const rotatedH = image.width * sin + image.height * cos;

  const size = 1024;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  ctx.translate(size / 2, size / 2);
  ctx.rotate(rotationRad);
  ctx.translate(-(rotatedW / 2), -(rotatedH / 2));
  ctx.drawImage(image, 0, 0, image.width, image.height);

  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = size;
  croppedCanvas.height = size;
  const cctx = croppedCanvas.getContext("2d");

  const scaleX = rotatedW / canvas.width;
  const scaleY = rotatedH / canvas.height;
  const cropX = crop.x * scaleX * (canvas.width / rotatedW);
  const cropY = crop.y * scaleY * (canvas.height / rotatedH);
  const cropW = crop.width * scaleX * (canvas.width / rotatedW);
  const cropH = crop.height * scaleY * (canvas.height / rotatedH);

  cctx.drawImage(
    canvas,
    cropX,
    cropY,
    cropW,
    cropH,
    0,
    0,
    size,
    size
  );

  return new Promise((resolve) => {
    croppedCanvas.toBlob((blob) => {
      resolve(blob);
    }, "image/png");
  });
}

export function ImageCropModal({ open, imageSrc, onClose, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [cropShape, setCropShape] = useState("round");
  const [processing, setProcessing] = useState(false);

  const handleCropComplete = useCallback(async () => {
    if (!imageSrc) return;
    setProcessing(true);
    try {
      const blob = await cropImage(imageSrc, crop, zoom, rotation);
      const file = new File([blob], "cropped.png", { type: "image/png" });
      onCropComplete?.(file);
      onClose?.();
    } catch {
      // silent
    } finally {
      setProcessing(false);
    }
  }, [imageSrc, crop, zoom, rotation, onCropComplete, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-16 lg:inset-24 z-50 glass rounded-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-themeBorder shrink-0">
              <h3 className="text-lg font-display font-semibold text-themeText">
                Crop Image
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-lg bg-themeBg-secondary border border-themeBorder p-1">
                  <button
                    onClick={() => setCropShape("round")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      cropShape === "round"
                        ? "bg-themeAccent text-white"
                        : "text-themeText-secondary hover:text-themeText"
                    }`}
                  >
                    Circle
                  </button>
                  <button
                    onClick={() => setCropShape("rect")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      cropShape === "rect"
                        ? "bg-themeAccent text-white"
                        : "text-themeText-secondary hover:text-themeText"
                    }`}
                  >
                    Square
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-themeText-secondary hover:text-themeText hover:bg-themeBg-secondary transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 m-4 rounded-xl overflow-hidden bg-black/40">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                cropShape={cropShape}
                showGrid
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
              />
            </div>

            <div className="shrink-0 px-6 py-4 border-t border-themeBorder space-y-4">
              <div className="flex items-center gap-3">
                <FiZoomOut className="w-4 h-4 text-themeText-secondary" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-themeAccent"
                />
                <FiZoomIn className="w-4 h-4 text-themeText-secondary" />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-themeBorder text-themeText-secondary text-sm font-medium hover:text-themeText transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropComplete}
                  disabled={processing}
                  className="px-6 py-2 rounded-lg bg-themeAccent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {processing ? "Processing…" : "Apply Crop"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}