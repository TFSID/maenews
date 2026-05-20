"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useDashboardAuth } from "@/app/components/dashboard/DashboardShell";
import { TiptapArticleEditor } from "@/app/components/dashboard/TiptapArticleEditor";
import {
  ARTICLE_CATEGORIES,
  ArticleCategory,
  createNewsArticle,
  getNewsArticle,
  NewsArticle,
  NewsArticlePayload,
  updateNewsArticle,
} from "@/app/lib/userApi";

const emptyArticle: NewsArticlePayload = {
  judul: "",
  kategori: "anime",
  konten: "",
  konten_json: null,
  cuplikan: "",
  thumbnail_url: "",
  author_id: 0,
  actor_id: 0,
  status: "pending",
};

export function ArticleForm({ articleID }: { articleID?: number }) {
  const router = useRouter();
  const auth = useDashboardAuth();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [form, setForm] = useState<NewsArticlePayload>({
    ...emptyArticle,
    author_id: auth.user.id,
    actor_id: auth.user.id,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(articleID));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!articleID) return;

    const loadArticle = async () => {
      setError("");
      setIsLoading(true);
      try {
        const data = await getNewsArticle(articleID);
        setArticle(data);
        setForm({
          judul: data.judul,
          kategori: data.kategori,
          konten: data.konten,
          konten_json: data.konten_json,
          cuplikan: data.cuplikan,
          thumbnail_url: data.thumbnail_url,
          author_id: data.author_id,
          actor_id: auth.user.id,
          status: data.status === "draft" ? "draft" : "pending",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat artikel");
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [articleID, auth.user.id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = { ...form, actor_id: auth.user.id };
      if (articleID) {
        await updateNewsArticle(articleID, payload);
      } else {
        await createNewsArticle(payload);
      }
      router.push("/dashboard/articles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan artikel");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="h-40 animate-pulse border border-gray-200 bg-white" />;
  }

  return (
    <div>
      <section className="border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              Portal Berita
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#090909]">
              {articleID ? "Edit Artikel" : "Tambah Artikel"}
            </h1>
            <p className="mt-2 text-sm font-medium text-[#6b7280]">
              {article?.status === "published"
                ? "Artikel published akan masuk review kembali setelah diedit."
                : "Tulis artikel menggunakan editor Tiptap."}
            </p>
          </div>
          <Link
            href="/dashboard/articles"
            className="inline-flex h-11 items-center justify-center gap-2 border border-gray-200 px-4 text-sm font-black uppercase tracking-wide text-[#090909] transition hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="mt-6 border border-gray-200 bg-white p-6">
        <div className="grid gap-4">
          <Field label="Judul">
            <input
              value={form.judul}
              onChange={(event) =>
                setForm((current) => ({ ...current, judul: event.target.value }))
              }
              className="h-12 w-full border border-gray-200 bg-[#FAFAFA] px-3 text-sm font-semibold outline-none focus:border-primary"
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kategori">
              <select
                value={form.kategori}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    kategori: event.target.value as ArticleCategory,
                  }))
                }
                className="h-12 w-full border border-gray-200 bg-[#FAFAFA] px-3 text-sm font-semibold outline-none focus:border-primary"
                required
              >
                {ARTICLE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as "draft" | "pending",
                  }))
                }
                className="h-12 w-full border border-gray-200 bg-[#FAFAFA] px-3 text-sm font-semibold outline-none focus:border-primary"
              >
                <option value="pending">pending review</option>
                <option value="draft">draft</option>
              </select>
            </Field>
          </div>

          <Field label="Thumbnail URL">
            <input
              value={form.thumbnail_url}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  thumbnail_url: event.target.value,
                }))
              }
              className="h-12 w-full border border-gray-200 bg-[#FAFAFA] px-3 text-sm font-semibold outline-none focus:border-primary"
            />
          </Field>

          <Field label="Cuplikan">
            <textarea
              value={form.cuplikan}
              onChange={(event) =>
                setForm((current) => ({ ...current, cuplikan: event.target.value }))
              }
              className="min-h-24 w-full border border-gray-200 bg-[#FAFAFA] px-3 py-3 text-sm font-semibold outline-none focus:border-primary"
              required
            />
          </Field>

          <Field label="Konten">
            <TiptapArticleEditor
              content={form.konten}
              onHTMLChange={(html) =>
                setForm((current) => ({ ...current, konten: html }))
              }
              onJSONChange={(json) =>
                setForm((current) => ({ ...current, konten_json: json }))
              }
            />
          </Field>
        </div>

        {error && (
          <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 bg-primary text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#e56200] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#374151]">
        {label}
      </span>
      {children}
    </label>
  );
}
