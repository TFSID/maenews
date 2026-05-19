"use client";
import { Button } from "../components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Waduh, ada masalah teknis!</h2>
      <p className="text-gray-500 mb-6">Maaf, terjadi kesalahan saat memuat halaman ini.</p>
      <Button onClick={() => reset()} className="bg-primary hover:bg-secondary">
        Coba Lagi
      </Button>
    </div>
  );
}