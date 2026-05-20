"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  createSubRole,
  deleteSubRole,
  getSubRoles,
  SubRole,
  updateSubRole,
} from "@/app/lib/userApi";

export function SubRoleManager() {
  const [subRoles, setSubRoles] = useState<SubRole[]>([]);
  const [subRoleValue, setSubRoleValue] = useState("");
  const [editing, setEditing] = useState<SubRole | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadSubRoles = async () => {
    setError("");
    setIsLoading(true);
    try {
      const data = await getSubRoles();
      setSubRoles(data.sort((a, b) => a.id - b.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat sub role");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubRoles();
  }, []);

  const resetForm = () => {
    setSubRoleValue("");
    setEditing(null);
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (editing) {
        await updateSubRole(editing.id, subRoleValue);
      } else {
        await createSubRole(subRoleValue);
      }
      resetForm();
      await loadSubRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan sub role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (subRole: SubRole) => {
    setEditing(subRole);
    setSubRoleValue(subRole.sub_role);
    setError("");
  };

  const handleDelete = async (subRole: SubRole) => {
    const confirmed = window.confirm(`Hapus sub role "${subRole.sub_role}"?`);
    if (!confirmed) return;

    setError("");
    try {
      await deleteSubRole(subRole.id);
      await loadSubRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus sub role");
    }
  };

  return (
    <div>
      <section className="border border-gray-200 bg-white p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
          Master Data
        </p>
        <h1 className="mt-2 text-3xl font-black text-[#090909]">Sub Role</h1>
        <p className="mt-2 text-sm font-medium text-[#6b7280]">
          Kelola data sub role yang dipakai pada user.
        </p>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-[#090909]">
              {editing ? "Edit Sub Role" : "Tambah Sub Role"}
            </h2>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="flex h-9 w-9 items-center justify-center border border-gray-200 text-[#6b7280] hover:border-primary hover:text-primary"
                aria-label="Batalkan edit"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#374151]">
              Sub Role
            </span>
            <input
              value={subRoleValue}
              onChange={(event) => setSubRoleValue(event.target.value)}
              className="h-12 w-full border border-gray-200 bg-[#FAFAFA] px-3 text-sm font-semibold text-[#090909] outline-none focus:border-primary"
              placeholder="Contoh: editor"
              required
            />
          </label>

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
            <Plus className="h-4 w-4" />
            {isSubmitting ? "Menyimpan..." : editing ? "Update" : "Simpan"}
          </button>
        </form>

        <div className="overflow-hidden border border-gray-200 bg-white">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-lg font-black text-[#090909]">
              Daftar Sub Role
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead className="bg-[#FAFAFA] text-xs font-black uppercase tracking-wide text-[#6b7280]">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Sub Role</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td className="px-5 py-5 text-sm font-semibold" colSpan={3}>
                      Memuat data...
                    </td>
                  </tr>
                ) : subRoles.length === 0 ? (
                  <tr>
                    <td className="px-5 py-5 text-sm font-semibold" colSpan={3}>
                      Belum ada data sub role.
                    </td>
                  </tr>
                ) : (
                  subRoles.map((subRole) => (
                    <tr key={subRole.id}>
                      <td className="px-5 py-4 text-sm font-bold text-[#090909]">
                        {subRole.id}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-[#090909]">
                        {subRole.sub_role}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(subRole)}
                            className="flex h-9 w-9 items-center justify-center border border-gray-200 text-[#374151] hover:border-primary hover:text-primary"
                            aria-label="Edit sub role"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(subRole)}
                            className="flex h-9 w-9 items-center justify-center border border-gray-200 text-red-600 hover:border-red-400 hover:bg-red-50"
                            aria-label="Hapus sub role"
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
        </div>
      </section>
    </div>
  );
}
