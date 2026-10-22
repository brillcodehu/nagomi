"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut, User, FileText } from "lucide-react";

interface InstructorProfile {
  name: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  is_active: boolean;
}

interface LegalField {
  key: string;
  label: string;
}

function LegalSettingsForm() {
  const [fields, setFields] = useState<LegalField[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setFields(data.fields);
          setValues(data.values);
        }
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setValues(data.values);
      setMessage("Elmentve. Az impresszum és az adatkezelési oldal azonnal frissül.");
    } else {
      const data = await res.json().catch(() => null);
      setMessage(data?.error ?? "A mentés nem sikerült.");
    }
  }

  return (
    <section className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <FileText size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Jogi adatok
          </h2>
          <p className="text-sm text-muted-foreground">
            Impresszum és adatkezelési tájékoztató. Amit üresen hagysz, az az
            oldalon &quot;megadandó&quot; jelzéssel látszik.
          </p>
        </div>
      </div>
      <form onSubmit={save} className="space-y-4 mt-6">
        {fields.map((f) => (
          <div key={f.key}>
            <label
              htmlFor={`legal-${f.key}`}
              className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1"
            >
              {f.label}
            </label>
            <input
              id={`legal-${f.key}`}
              name={f.key}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={saving}
          className="bg-primary-strong text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving ? "Mentés..." : "Mentés"}
        </button>
        {message && (
          <p role="status" className="text-sm text-foreground">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<InstructorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }

    async function loadProfile() {
      const res = await fetch("/api/admin/instructors");
      if (res.ok) {
        const data = await res.json();
        const me = data.find(
          (i: InstructorProfile & { id: string }) => i.email === session?.user?.email
        );
        if (me) setProfile(me);
      }
      setLoading(false);
    }

    loadProfile();
  }, [session, status, router]);

  async function handleSignOut() {
    await signOut({ redirect: false });
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

      <section className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-foreground">
              Profil
            </h2>
            <p className="text-sm text-muted-foreground">Oktato adatok</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Nev
              </p>
              <p className="text-sm text-foreground font-medium">
                {profile?.name ?? session?.user?.name ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Email
              </p>
              <p className="text-sm text-foreground">
                {profile?.email ?? session?.user?.email ?? "-"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <LegalSettingsForm />

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
