import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { instructors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SessionProvider from "@/components/admin/SessionProvider";

export const metadata = {
  title: "Admin | Nagomi Pilates",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  const [instructor] = await db
    .select({ id: instructors.id, name: instructors.name })
    .from(instructors)
    .where(eq(instructors.id, session.user.id))
    .limit(1);

  if (!instructor) {
    redirect("/admin/login");
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-background">
        <AdminSidebar instructorName={instructor.name} />
        <main className="lg:pl-64 pt-[57px] lg:pt-0">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
