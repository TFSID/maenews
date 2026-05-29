"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  createUser,
  deleteUser,
  getSubRoles,
  getUsers,
  SubRole,
  updateUser,
  User,
  UserPayload,
  UserRole,
} from "@/app/lib/userApi";
import { useDashboardAuth } from "@/app/components/dashboard/DashboardShell";

const emptyForm: UserPayload = {
  nama: "",
  nickname: "",
  alamat: "",
  no_hp: "",
  email: "",
  password: "",
  role: "admin",
  sub_role: 0,
  foto: "",
  facebook: "",
  twitter: "",
  instagram: "",
  discord: "",
  fotoFile: null,
};

export function UserManager() {
  const auth = useDashboardAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [subRoles, setSubRoles] = useState<SubRole[]>([]);
  const [form, setForm] = useState<UserPayload>(emptyForm);
  const [editing, setEditing] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const memberSubRole = useMemo(
    () =>
      subRoles.find(
        (item) => item.sub_role.trim().toLowerCase() === "member"
      ) ?? null,
    [subRoles]
  );

  const subRoleLabel = useMemo(() => {
    const labels = new Map<number, string>();
    subRoles.forEach((item) => labels.set(item.id, item.sub_role));
    return labels;
  }, [subRoles]);

  const currentSubRoleName =
    subRoleLabel.get(auth.user.sub_role)?.trim().toLowerCase() || "";
  const isKelolaMemberAdmin =
    auth.user.role === "admin" && currentSubRoleName === "kelola_member";
  const visibleUsers = isKelolaMemberAdmin
    ? users.filter((user) => user.role === "member")
    : users;

  const loadData = async () => {
    setError("");
    setIsLoading(true);
    try {
      const [usersData, subRolesData] = await Promise.all([
        getUsers(),
        getSubRoles(),
      ]);
      setUsers(usersData.sort((a, b) => a.id - b.id));
      setSubRoles(subRolesData.sort((a, b) => a.id - b.id));
      if (!form.sub_role && subRolesData.length > 0) {
        setForm((current) => ({ ...current, sub_role: subRolesData[0].id }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (form.role === "member" && memberSubRole) {
      setForm((current) => ({ ...current, sub_role: memberSubRole.id }));
    }
  }, [form.role, memberSubRole]);

  useEffect(() => {
    if (isKelolaMemberAdmin && memberSubRole) {
      setForm((current) => ({
        ...current,
        role: "member",
        sub_role: memberSubRole.id,
      }));
    }
  }, [isKelolaMemberAdmin, memberSubRole]);

  const resetForm = () => {
    setEditing(null);
    setError("");
    setForm({
      ...emptyForm,
      role: isKelolaMemberAdmin ? "member" : "admin",
      sub_role: isKelolaMemberAdmin
        ? memberSubRole?.id ?? 0
        : subRoles[0]?.id ?? 0,
    });
  };

  const updateField = (field: keyof UserPayload, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleRoleChange = (role: UserRole) => {
    if (isKelolaMemberAdmin) return;
    setForm((current) => ({
      ...current,
      role,
      sub_role:
        role === "member"
          ? memberSubRole?.id ?? current.sub_role
          : current.sub_role || subRoles[0]?.id || 0,
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({
      ...current,
      fotoFile: event.target.files?.[0] ?? null,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (form.role === "member" && !memberSubRole) {
      setError('Sub Role "member" belum tersedia.');
      return;
    }
    if (!form.sub_role) {
      setError("Sub Role wajib dipilih.");
      return;
    }
    if (!editing && !form.password) {
      setError("Password wajib diisi untuk user baru.");
      return;
    }
    if (isKelolaMemberAdmin && !memberSubRole) {
      setError('Sub Role "member" belum tersedia.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: UserPayload = isKelolaMemberAdmin
        ? { ...form, role: "member", sub_role: memberSubRole?.id ?? form.sub_role }
        : form;
      if (editing) {
        await updateUser(editing.id, payload);
      } else {
        await createUser(payload);
      }
      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    if (isKelolaMemberAdmin && user.role !== "member") {
      setError("Admin kelola_member hanya dapat mengelola user member.");
      return;
    }
    const normalizedRole: UserRole =
      user.role === "super_admin" || user.role === "member" ? user.role : "admin";
    setEditing(user);
    setError("");
    setForm({
      nama: user.nama,
      nickname: user.nickname,
      alamat: user.alamat,
      no_hp: user.no_hp,
      email: user.email,
      password: "",
      role: isKelolaMemberAdmin ? "member" : normalizedRole,
      sub_role: isKelolaMemberAdmin
        ? memberSubRole?.id ?? user.sub_role
        : normalizedRole === "member"
          ? memberSubRole?.id ?? user.sub_role
          : user.sub_role,
      foto: user.foto,
      facebook: user.facebook,
      twitter: user.twitter,
      instagram: user.instagram,
      discord: user.discord,
      fotoFile: null,
    });
  };

  const handleDelete = async (user: User) => {
    if (isKelolaMemberAdmin && user.role !== "member") {
      setError("Admin kelola_member hanya dapat menghapus user member.");
      return;
    }
    const confirmed = window.confirm(`Hapus user "${user.nama}"?`);
    if (!confirmed) return;

    setError("");
    try {
      await deleteUser(user.id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus user");
    }
  };

  return (
    <div>
      <section className="border border-gray-200 bg-white p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
          Master Data
        </p>
        <h1 className="mt-2 text-3xl font-black text-[#090909]">Users</h1>
        <p className="mt-2 text-sm font-medium text-[#6b7280]">
          {isKelolaMemberAdmin
            ? "Kelola user member sesuai akses sub role kelola_member."
            : "Kelola user admin dan member beserta role, sub role, dan profilnya."}
        </p>
      </section>

      <section className="mt-6 grid gap-6 2xl:grid-cols-[420px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="border border-gray-200 bg-white p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-[#090909]">
              {editing ? "Edit User" : "Tambah User"}
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

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <TextInput label="Nama" value={form.nama} onChange={(value) => updateField("nama", value)} />
            <TextInput label="Nickname" value={form.nickname} onChange={(value) => updateField("nickname", value)} />
            <TextInput label="No HP" value={form.no_hp} onChange={(value) => updateField("no_hp", value)} />
            <TextInput label="Email" type="email" value={form.email} onChange={(value) => updateField("email", value)} />
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#374151]">
                Alamat
              </span>
              <textarea
                value={form.alamat}
                onChange={(event) => updateField("alamat", event.target.value)}
                className="min-h-24 w-full border border-gray-200 bg-[#FAFAFA] px-3 py-3 text-sm font-semibold text-[#090909] outline-none focus:border-primary"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#374151]">
                Password
              </span>
              <input
                type="password"
                value={form.password || ""}
                onChange={(event) => updateField("password", event.target.value)}
                className="h-12 w-full border border-gray-200 bg-[#FAFAFA] px-3 text-sm font-semibold text-[#090909] outline-none focus:border-primary"
                placeholder={editing ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"}
                minLength={8}
                required={!editing}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#374151]">
                Role
              </span>
              <select
                value={form.role}
                onChange={(event) => handleRoleChange(event.target.value as UserRole)}
                disabled={isKelolaMemberAdmin}
                className="h-12 w-full border border-gray-200 bg-[#FAFAFA] px-3 text-sm font-semibold text-[#090909] outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-70"
              >
                {!isKelolaMemberAdmin && <option value="super_admin">super_admin</option>}
                {!isKelolaMemberAdmin && <option value="admin">admin</option>}
                <option value="member">member</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#374151]">
                Sub Role
              </span>
              <select
                value={form.sub_role}
                onChange={(event) => updateField("sub_role", Number(event.target.value))}
                disabled={form.role === "member"}
                className="h-12 w-full border border-gray-200 bg-[#FAFAFA] px-3 text-sm font-semibold text-[#090909] outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-70"
              >
                {subRoles.map((subRole) => (
                  <option key={subRole.id} value={subRole.id}>
                    {subRole.sub_role}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#374151]">
                Foto
              </span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="block h-12 w-full border border-gray-200 bg-[#FAFAFA] px-3 py-2 text-sm font-semibold text-[#090909] file:mr-3 file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-black file:uppercase file:text-white"
              />
            </label>

            <TextInput label="Facebook" required={false} value={form.facebook || ""} onChange={(value) => updateField("facebook", value)} />
            <TextInput label="Twitter" required={false} value={form.twitter || ""} onChange={(value) => updateField("twitter", value)} />
            <TextInput label="Instagram" required={false} value={form.instagram || ""} onChange={(value) => updateField("instagram", value)} />
            <TextInput label="Discord" required={false} value={form.discord || ""} onChange={(value) => updateField("discord", value)} />
          </div>

          {(form.role === "member" || isKelolaMemberAdmin) && (
            <p className="mt-4 border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700">
              {isKelolaMemberAdmin
                ? "Akses kelola_member hanya dapat menambahkan dan mengelola user dengan role member."
                : "Role member otomatis memakai Sub Role member dan tidak dapat diubah."}
            </p>
          )}

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
            <h2 className="text-lg font-black text-[#090909]">Daftar User</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="bg-[#FAFAFA] text-xs font-black uppercase tracking-wide text-[#6b7280]">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Kontak</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Sub Role</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td className="px-5 py-5 text-sm font-semibold" colSpan={5}>
                      Memuat data...
                    </td>
                  </tr>
                ) : visibleUsers.length === 0 ? (
                  <tr>
                    <td className="px-5 py-5 text-sm font-semibold" colSpan={5}>
                      Belum ada user.
                    </td>
                  </tr>
                ) : (
                  visibleUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-5 py-4">
                        <p className="text-sm font-black text-[#090909]">{user.nama}</p>
                        <p className="text-xs font-semibold text-[#6b7280]">{user.nickname}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-[#090909]">{user.email}</p>
                        <p className="text-xs font-semibold text-[#6b7280]">{user.no_hp}</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-[#090909]">
                        {user.role}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-[#090909]">
                        {subRoleLabel.get(user.sub_role) || user.sub_role}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(user)}
                            className="flex h-9 w-9 items-center justify-center border border-gray-200 text-[#374151] hover:border-primary hover:text-primary"
                            aria-label="Edit user"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user)}
                            className="flex h-9 w-9 items-center justify-center border border-gray-200 text-red-600 hover:border-red-400 hover:bg-red-50"
                            aria-label="Hapus user"
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

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#374151]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full border border-gray-200 bg-[#FAFAFA] px-3 text-sm font-semibold text-[#090909] outline-none focus:border-primary"
        required={required}
      />
    </label>
  );
}
