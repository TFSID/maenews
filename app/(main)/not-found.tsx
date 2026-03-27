import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <FileQuestion className="w-16 h-16 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Halaman Tidak Ditemukan</h2>
            <p className="text-gray-500 mb-6">Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
            <Link href="/">
                <Button className="bg-primary hover:bg-secondary">
                    Kembali ke Beranda
                </Button>
            </Link>
        </div>
    );
}
