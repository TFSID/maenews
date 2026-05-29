"use client";

import { ReactElement, useMemo } from "react";
import { Mail, MapPin, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useDashboardAuth } from "@/app/components/dashboard/DashboardShell";

export function DashboardClient() {
  const auth = useDashboardAuth();
  const { user } = auth;

  if (user.role === "member") {
    return <MemberDashboard />;
  }

  const stats = useMemo(
    () => [
      { label: "Role", value: user.role },
      { label: "Sub Role", value: String(user.sub_role) },
      { label: "Status", value: "Aktif" },
    ],
    [user.role, user.sub_role]
  );

  return (
    <div>
      <section className="border border-gray-200 bg-white p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-black text-[#090909]">
          Halo, {user.nama}
        </h1>
        <p className="mt-2 text-sm font-medium text-[#6b7280]">
          Ringkasan profil administrator yang sedang login.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="border border-gray-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[#A6A6A6]">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-black text-[#090909]">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="border border-gray-200 bg-white p-6">
          <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#FAFAFA]">
            {user.foto && user.foto !== "default.jpg" ? (
              <img
                src={`http://localhost:8080/uploads/${user.foto}`}
                alt={user.nama}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-12 w-12 text-[#A6A6A6]" />
            )}
          </div>
          <div className="mt-5 text-center">
            <h2 className="text-xl font-black text-[#090909]">
              {user.nickname}
            </h2>
            <p className="mt-1 text-sm font-semibold text-primary">
              {user.email}
            </p>
          </div>
        </aside>

        <div className="border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-black text-[#090909]">Profil User</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoItem icon={<UserRound />} label="Nama" value={user.nama} />
            <InfoItem icon={<ShieldCheck />} label="Role" value={user.role} />
            <InfoItem icon={<Phone />} label="No HP" value={user.no_hp} />
            <InfoItem icon={<Mail />} label="Email" value={user.email} />
            <InfoItem icon={<MapPin />} label="Alamat" value={user.alamat} />
            <InfoItem
              icon={<ShieldCheck />}
              label="Sub Role"
              value={String(user.sub_role)}
            />
          </div>

          <h3 className="mt-8 text-sm font-black uppercase tracking-wide text-[#090909]">
            Sosial Media
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <SocialItem label="Facebook" value={user.facebook} />
            <SocialItem label="Twitter" value={user.twitter} />
            <SocialItem label="Instagram" value={user.instagram} />
            <SocialItem label="Discord" value={user.discord} />
          </div>
        </div>
      </section>
    </div>
  );
}

function MemberDashboard() {
  const auth = useDashboardAuth();
  const { user } = auth;

  return (
    <div>
      <section className="border border-gray-200 bg-white p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
          Member Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-black text-[#090909]">
          Selamat datang, {user.nama}
        </h1>
        <p className="mt-2 text-sm font-medium text-[#6b7280]">
          Ini adalah area member untuk melihat ringkasan akun dan profil.
        </p>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="border border-gray-200 bg-white p-6">
          <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[#FAFAFA]">
            {user.foto && user.foto !== "default.jpg" ? (
              <img
                src={`http://localhost:8080/uploads/${user.foto}`}
                alt={user.nama}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-12 w-12 text-[#A6A6A6]" />
            )}
          </div>
          <div className="mt-5 text-center">
            <h2 className="text-xl font-black text-[#090909]">
              {user.nickname}
            </h2>
            <p className="mt-1 text-sm font-semibold text-primary">
              {user.email}
            </p>
          </div>
        </aside>

        <div className="border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-black text-[#090909]">Profil Member</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InfoItem icon={<UserRound />} label="Nama" value={user.nama} />
            <InfoItem icon={<ShieldCheck />} label="Role" value={user.role} />
            <InfoItem icon={<Phone />} label="No HP" value={user.no_hp} />
            <InfoItem icon={<Mail />} label="Email" value={user.email} />
            <InfoItem icon={<MapPin />} label="Alamat" value={user.alamat} />
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactElement;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 border border-gray-100 bg-[#FAFAFA] p-4">
      <span className="mt-0.5 flex h-9 w-9 items-center justify-center bg-white text-primary">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold uppercase tracking-wide text-[#A6A6A6]">
          {label}
        </span>
        <span className="mt-1 block break-words text-sm font-bold text-[#090909]">
          {value}
        </span>
      </span>
    </div>
  );
}

function SocialItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-100 bg-[#FAFAFA] px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-[#A6A6A6]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold text-[#090909]">
        {value || "-"}
      </p>
    </div>
  );
}
