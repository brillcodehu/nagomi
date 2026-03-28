"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface ClassTypeRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tagline: string | null;
  duration_min: number;
  max_capacity: number;
  price_huf: number;
  difficulty: number;
  is_private: boolean;
  sort_order: number;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  tagline: string;
  duration_min: string;
  max_capacity: string;
  price_huf: string;
  difficulty: string;
  is_private: boolean;
  sort_order: string;
}

const emptyForm: FormData = {
  name: "",
  slug: "",
  description: "",
  tagline: "",
  duration_min: "55",
  max_capacity: "6",
  price_huf: "",
  difficulty: "1",
  is_private: false,
  sort_order: "0",
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Kezdo",
  2: "Kezdo-kozephalado",
  3: "Kozephalado",
  4: "Halado",
  5: "Haladoknak",
};

export default function AdminClassTypesPage() {
  const [classTypes, setClassTypes] = useState<ClassTypeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/admin/class-types");
    if (res.ok) {
      const data = await res.json();
      setClassTypes(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function openNewForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  }

  function openEditForm(ct: ClassTypeRow) {
    setEditingId(ct.id);
    setForm({
      name: ct.name,
      slug: ct.slug,
      description: ct.description ?? "",
      tagline: ct.tagline ?? "",
      duration_min: ct.duration_min.toString(),
      max_capacity: ct.max_capacity.toString(),
      price_huf: ct.price_huf.toString(),
      difficulty: ct.difficulty.toString(),
      is_private: ct.is_private,
      sort_order: ct.sort_order.toString(),
    });
    setFormError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.name || !form.price_huf) {
      setFormError("A nev es az ar kitoltese kotelezo.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || null,
      tagline: form.tagline || null,
      duration_min: parseInt(form.duration_min) || 55,
      max_capacity: parseInt(form.max_capacity) || 6,
      price_huf: parseInt(form.price_huf),
      difficulty: parseInt(form.difficulty) || 1,
      is_private: form.is_private,
      sort_order: parseInt(form.sort_order) || 0,
    };

    try {
      const url = editingId
        ? `/api/admin/class-types/${editingId}`
        : "/api/admin/class-types";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Hiba tortent a mentes soran.");
      }

      closeForm();
      await fetchData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Ismeretlen hiba.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Biztosan torolni szeretned ezt az oratipust?")) return;

    const res = await fetch(`/api/admin/class-types/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchData();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Betoltes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Oratipusok
        </h1>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Uj oratipus
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-lg p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                {editingId ? "Oratipus szerkesztese" : "Uj oratipus"}
              </h2>
              <button
                onClick={closeForm}
                className="p-1 rounded hover:bg-muted text-muted-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Nev *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: f.slug || slugify(name),
                    }));
                  }}
                  required
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }
                  placeholder="automatikusan generalt"
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Leiras
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Szlogen
                </label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tagline: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Idotartam (perc)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.duration_min}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, duration_min: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Max letszam
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.max_capacity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, max_capacity: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Ar (Ft) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.price_huf}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price_huf: e.target.value }))
                    }
                    required
                    className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Nehezseg
                  </label>
                  <select
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, difficulty: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {[1, 2, 3, 4, 5].map((d) => (
                      <option key={d} value={d}>
                        {d} - {DIFFICULTY_LABELS[d]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Sorrend
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, sort_order: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_private}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          is_private: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="text-sm font-medium text-foreground">
                      Privat ora
                    </span>
                  </label>
                </div>
              </div>

              {formError && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md px-4 py-3 text-sm text-destructive">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2.5 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Megse
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {saving ? "Mentes..." : "Mentes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla */}
      {classTypes.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
          Meg nincsenek oratipusok.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Nev
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  Idotartam
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Letszam
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Ar
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  Nehezseg
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                  Privat
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Muveletek
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {classTypes.map((ct) => (
                <tr key={ct.id}>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {ct.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                    {ct.duration_min} perc
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {ct.max_capacity} fo
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {ct.price_huf.toLocaleString("hu-HU")} Ft
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                    {DIFFICULTY_LABELS[ct.difficulty] ?? ct.difficulty}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                    {ct.is_private ? "Igen" : "Nem"}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditForm(ct)}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Szerkesztes"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(ct.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Torles"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
