import { LoginForm } from "@/app/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-[70vh] bg-[#FAFAFA] px-4 py-10">
      <section className="container mx-auto flex justify-center lg:px-8 xl:px-[150px]">
        <LoginForm />
      </section>
    </main>
  );
}
