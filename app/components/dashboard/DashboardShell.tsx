"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, LayoutDashboard, LogOut, ShieldCheck, Users } from "lucide-react";
import { getSubRoles, LoginResponse, SubRole } from "@/app/lib/userApi";

const AUTH_STORAGE_KEY = "maenews_auth";

const DashboardAuthContext = createContext<LoginResponse | null>(null);

export function useDashboardAuth() {
  const auth = useContext(DashboardAuthContext);
  if (!auth) {
    throw new Error("useDashboardAuth must be used inside DashboardShell");
  }
  return auth;
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [auth, setAuth] = useState<LoginResponse | null>(null);
  const [subRoles, setSubRoles] = useState<SubRole[]>([]);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const rawAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawAuth) {
      router.replace("/login");
      return;
    }

    try {
      const parsedAuth = JSON.parse(rawAuth) as LoginResponse;
      setAuth(parsedAuth);
      getSubRoles()
        .then(setSubRoles)
        .catch(() => setSubRoles([]));
      setIsChecking(false);
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.replace("/login");
  };

  const allMenuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Articles", href: "/dashboard/articles", icon: FileText },
    { label: "Users", href: "/dashboard/users", icon: Users },
    { label: "Sub Role", href: "/dashboard/sub-roles", icon: ShieldCheck },
  ];

  const subRoleName =
    subRoles
      .find((item) => item.id === auth?.user.sub_role)
      ?.sub_role.trim()
      .toLowerCase() || "";

  const allowedHrefs = auth
    ? getAllowedDashboardHrefs(auth.user.role, subRoleName)
    : ["/dashboard"];
  const menuItems = allMenuItems.filter((item) => allowedHrefs.includes(item.href));

  useEffect(() => {
    if (auth && !isDashboardPathAllowed(pathname, allowedHrefs)) {
      router.replace("/dashboard");
    }
  }, [allowedHrefs, auth, pathname, router]);

  if (isChecking || !auth) {
    return (
      <main className="min-h-[70vh] bg-[#FAFAFA] px-4 py-10">
        <div className="container mx-auto lg:px-8 xl:px-[150px]">
          <div className="h-28 animate-pulse bg-white" />
        </div>
      </main>
    );
  }

  return (
    <DashboardAuthContext.Provider value={auth}>
      <main className="min-h-[70vh] bg-[#FAFAFA]">
        <div className="container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-8 xl:px-[150px]">
          <aside className="border border-gray-200 bg-white p-4 lg:sticky lg:top-20 lg:h-[calc(100vh-104px)]">
            <div className="border-b border-gray-100 pb-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
                {auth.user.role === "member" ? "Member" : "Admin"}
              </p>
              <h2 className="mt-2 text-lg font-black text-[#090909]">
                {auth.user.nickname}
              </h2>
              <p className="mt-1 break-words text-xs font-semibold text-[#6b7280]">
                {auth.user.email}
              </p>
            </div>

            <nav className="mt-4 flex flex-col gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActiveDashboardPath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex h-11 items-center gap-3 px-3 text-sm font-black uppercase tracking-wide transition ${
                      active
                        ? "bg-primary text-white"
                        : "text-[#374151] hover:bg-[#FAFAFA] hover:text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 border border-gray-200 text-sm font-black uppercase tracking-wide text-[#090909] transition hover:border-primary hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </aside>

          <section>{children}</section>
        </div>
      </main>
    </DashboardAuthContext.Provider>
  );
}

function isDashboardPathAllowed(pathname: string, allowedHrefs: string[]) {
  return allowedHrefs.some((href) => isActiveDashboardPath(pathname, href));
}

function isActiveDashboardPath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getAllowedDashboardHrefs(role: string, subRoleName: string) {
  if (role === "super_admin") {
    return ["/dashboard", "/dashboard/articles", "/dashboard/users", "/dashboard/sub-roles"];
  }

  if (role === "member") {
    return ["/dashboard", "/dashboard/articles"];
  }

  if (subRoleName === "kelola_member") {
    return ["/dashboard", "/dashboard/articles", "/dashboard/users"];
  }

  if (subRoleName === "editor") {
    return ["/dashboard", "/dashboard/articles"];
  }

  return ["/dashboard", "/dashboard/articles"];
}
