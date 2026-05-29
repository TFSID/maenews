"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Ban, Check, Pencil, Pin, PinOff, Plus, Trash2, XCircle } from "lucide-react";
import { useDashboardAuth } from "@/app/components/dashboard/DashboardShell";
import {
  approveNewsArticle,
  deleteNewsArticle,
  getNewsArticles,
  getSubRoles,
  getUsers,
  NewsArticle,
  pinNewsArticle,
  SubRole,
  updateNewsArticleStatus,
  User,
} from "@/app/lib/userApi";

export function ArticleManager() {
  const auth = useDashboardAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [subRoles, setSubRoles] = useState<SubRole[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const subRoleName = useMemo(
    () =>
      subRoles
        .find((item) => item.id === auth.user.sub_role)
        ?.sub_role.trim()
        .toLowerCase() || "",
    [auth.user.sub_role, subRoles]
  );

  const canModerate =
    auth.user.role === "super_admin" ||
    (auth.user.role === "admin" && subRoleName === "editor");

  const visibleArticles = canModerate
    ? articles
    : articles.filter((article) => article.author_id === auth.user.id);

  const userByID = useMemo(() => {
    const map = new Map<number, User>();
    users.forEach((user) => map.set(user.id, user));
    return map;
  }, [users]);

  const loadData = async () => {
    setError("");
    setIsLoading(true);
    try {
      const [articleData, subRoleData, userData] = await Promise.all([
        getNewsArticles(),
        getSubRoles(),
        getUsers(),
      ]);
      setArticles(articleData);
      setSubRoles(subRoleData);
      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat artikel");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (article: NewsArticle) => {
    setError("");
    try {
      await approveNewsArticle(article.id, auth.user.id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal acc artikel");
    }
  };

  const handleStatus = async (
    article: NewsArticle,
    status: "rejected" | "takedown"
  ) => {
    const label = status === "rejected" ? "tolak" : "takedown";
    const confirmed = window.confirm(
      `Ubah status artikel "${article.judul}" menjadi ${label}?`
    );
    if (!confirmed) return;
    setError("");
    try {
      await updateNewsArticleStatus(article.id, auth.user.id, status);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Gagal mengubah status artikel menjadi ${label}`
      );
    }
  };

  const handlePin = async (article: NewsArticle) => {
    setError("");
    try {
      await pinNewsArticle(article.id, auth.user.id, !article.is_pinned);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal pin artikel");
    }
  };

  const handleDelete = async (article: NewsArticle) => {
    const confirmed = window.confirm(`Hapus artikel "${article.judul}"?`);
    if (!confirmed) return;
    setError("");
    try {
      await deleteNewsArticle(article.id, auth.user.id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal hapus artikel");
    }
  };

  return (
    <div>
      <section className="border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
              Portal Berita
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#090909]">
              Articles
            </h1>
            <p className="mt-2 text-sm font-medium text-[#6b7280]">
              Tabel artikel yang telah dibuat oleh user.
            </p>
          </div>
          <Link
            href="/dashboard/articles/new"
            className="inline-flex h-11 items-center justify-center gap-2 bg-primary px-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#e56200]"
          >
            <Plus className="h-4 w-4" />
            Tambah Artikel
          </Link>
        </div>
      </section>

      {error && (
        <p className="mt-4 border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <section className="mt-6 overflow-hidden border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-5">
          <h2 className="text-lg font-black text-[#090909]">Daftar Artikel</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] border-collapse text-left">
            <thead className="bg-[#FAFAFA] text-xs font-black uppercase tracking-wide text-[#6b7280]">
              <tr>
                <th className="px-5 py-3">Artikel</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Moderator</th>
                <th className="px-5 py-3">Views 7 Hari</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td className="px-5 py-5 text-sm font-semibold" colSpan={6}>
                    Memuat data...
                  </td>
                </tr>
              ) : visibleArticles.length === 0 ? (
                <tr>
                  <td className="px-5 py-5 text-sm font-semibold" colSpan={6}>
                    Belum ada artikel.
                  </td>
                </tr>
              ) : (
                visibleArticles.map((article) => (
                  <tr key={article.id}>
                    <td className="px-5 py-4">
                      <p className="text-sm font-black text-[#090909]">
                        {article.judul}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs font-semibold text-[#6b7280]">
                        {article.cuplikan}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold capitalize text-[#090909]">
                      {article.kategori}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[#090909]">
                      {article.is_pinned ? "pinned / " : ""}
                      {articleStatusLabel(article.status)}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[#090909]">
                      {moderatorName(article, userByID)}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[#090909]">
                      {weeklyViewCount(article)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/articles/${article.id}/edit`}
                          className="flex h-9 w-9 items-center justify-center border border-gray-200 text-[#374151] hover:border-primary hover:text-primary"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        {canModerate && article.status !== "published" && (
                          <button
                            type="button"
                            onClick={() => handleApprove(article)}
                            className="flex h-9 w-9 items-center justify-center border border-gray-200 text-green-700 hover:border-green-500 hover:bg-green-50"
                            title="Acc publish"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        {canModerate &&
                          article.status !== "published" &&
                          article.status !== "rejected" && (
                            <button
                              type="button"
                              onClick={() => handleStatus(article, "rejected")}
                              className="flex h-9 w-9 items-center justify-center border border-gray-200 text-red-700 hover:border-red-500 hover:bg-red-50"
                              title="Tolak artikel"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        {canModerate && article.status === "published" && (
                          <button
                            type="button"
                            onClick={() => handleStatus(article, "takedown")}
                            className="flex h-9 w-9 items-center justify-center border border-gray-200 text-red-700 hover:border-red-500 hover:bg-red-50"
                            title="Takedown artikel"
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                        )}
                        {canModerate && article.status === "published" && (
                          <button
                            type="button"
                            onClick={() => handlePin(article)}
                            className="flex h-9 w-9 items-center justify-center border border-gray-200 text-[#374151] hover:border-primary hover:text-primary"
                            title={article.is_pinned ? "Unpin" : "Pin"}
                          >
                            {article.is_pinned ? (
                              <PinOff className="h-4 w-4" />
                            ) : (
                              <Pin className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(article)}
                          className="flex h-9 w-9 items-center justify-center border border-gray-200 text-red-600 hover:border-red-400 hover:bg-red-50"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function articleStatusLabel(status: NewsArticle["status"]) {
  switch (status) {
    case "published":
      return "published";
    case "rejected":
      return "ditolak";
    case "takedown":
      return "takedown";
    case "draft":
      return "draft";
    default:
      return "pending";
  }
}

function moderatorName(article: NewsArticle, userByID: Map<number, User>) {
  if (!["published", "rejected", "takedown"].includes(article.status)) {
    return "-";
  }
  if (!article.acc_by_id) {
    return "-";
  }

  const user = userByID.get(article.acc_by_id);
  if (!user) {
    return `User #${article.acc_by_id}`;
  }
  return user.nickname || user.nama || `User #${article.acc_by_id}`;
}

function weeklyViewCount(article: NewsArticle) {
  if (!article.published_at) return 0;
  const publishedAt = new Date(article.published_at).getTime();
  const deadline = publishedAt + 7 * 24 * 60 * 60 * 1000;
  return (article.view_events ?? []).filter((viewedAt) => {
    const value = new Date(viewedAt).getTime();
    return value >= publishedAt && value < deadline;
  }).length;
}
