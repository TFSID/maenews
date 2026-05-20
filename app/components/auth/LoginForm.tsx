"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginUser } from "@/app/lib/userApi";

const AUTH_STORAGE_KEY = "maenews_auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("syahrul@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const auth = await loginUser(email, password);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[420px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
          Admin Area
        </p>
        <h1 className="mt-2 text-3xl font-black text-[#090909]">Login</h1>
        <p className="mt-2 text-sm font-medium leading-6 text-[#6b7280]">
          Masuk untuk mengelola data dan konten Maenews.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#374151]">
            Email
          </span>
          <span className="flex h-12 items-center border border-gray-200 bg-[#FAFAFA] px-3 focus-within:border-primary">
            <Mail className="mr-3 h-4 w-4 text-[#A6A6A6]" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#090909] outline-none"
              placeholder="email@domain.com"
              required
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#374151]">
            Password
          </span>
          <span className="flex h-12 items-center border border-gray-200 bg-[#FAFAFA] px-3 focus-within:border-primary">
            <Lock className="mr-3 h-4 w-4 text-[#A6A6A6]" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#090909] outline-none"
              placeholder="Minimal 8 karakter"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="ml-2 flex h-8 w-8 items-center justify-center text-[#6b7280] hover:text-[#090909]"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
        </label>
      </div>

      {error && (
        <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 h-12 w-full bg-primary text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#e56200] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
