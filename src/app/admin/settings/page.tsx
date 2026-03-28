"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

interface InstructorProfile {
  name: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  is_active: boolean;
}

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState<InstructorProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/admin/login");
        return;
      }

      setUserEmail(user.email ?? null);

      const { data: instructor } = await supabase
        .from("instructors")
        .select("name, email, bio, avatar_url, is_active")
        .eq("auth_user_id", user.id)
        .single() as { data: InstructorProfile | null };

      if (instructor) {
        setProfile(instructor);
      }
      setLoading(false);
    }

    loadProfile();
  }, [router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Betoltes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="font-serif text-2xl font-semibold text-foreground">
        Beallitasok
      </h1>

      {/* Profil informaciok */}
      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Profil
            </h2>
            <p className="text-sm text-muted-foreground">
              Oktato adatok
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Nev
              </p>
              <p className="text-sm text-foreground font-medium">
                {profile?.name ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Oktato email
              </p>
              <p className="text-sm text-foreground">
                {profile?.email ?? "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Auth email
              </p>
              <p className="text-sm text-foreground">
                {userEmail ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Statusz
              </p>
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                  profile?.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {profile?.is_active ? "Aktiv" : "Inaktiv"}
              </span>
            </div>
          </div>

          {profile?.bio && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Bemutatkozas
              </p>
              <p className="text-sm text-foreground">{profile.bio}</p>
            </div>
          )}
        </div>
      </section>

      {/* Kijelentkezes */}
      <section className="bg-card border border-border rounded-lg p-6">
        <h2 className="font-serif text-lg font-semibold text-foreground mb-2">
          Kijelentkezes
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Kijelentkezes az admin felhasznaloi fiokbol.
        </p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <LogOut size={16} />
          Kijelentkezes
        </button>
      </section>
    </div>
  );
}
