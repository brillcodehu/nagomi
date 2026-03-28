import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | Nagomi Pilates",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ha nincs bejelentkezve: a middleware mar a login oldalra iranyitotta,
  // igy a children a login page. Rendereljuk sidebar nelkul.
  if (!user) {
    return <>{children}</>;
  }

  // Ellenorizzuk, hogy az user egy instructor-e
  const { data: instructor } = await supabase
    .from("instructors")
    .select("id, name")
    .eq("auth_user_id", user.id)
    .single<{ id: string; name: string }>();

  // Ha be van jelentkezve de nem instructor: kijelentkeztetjuk
  if (!instructor) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar instructorName={instructor.name} />
      <main className="lg:pl-64 pt-[57px] lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
