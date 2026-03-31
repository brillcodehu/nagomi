"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface ClassTypeOption {
  id: string;
  name: string;
  max_capacity: number;
}

interface InstructorOption {
  id: string;
  name: string;
}

interface ScheduledClassRow {
  id: string;
  class_type_id: string;
  instructor_id: string;
  day_of_week: number | null;
  start_time: string;
  max_spots_override: number | null;
  is_cancelled: boolean;
  notes: string | null;
  class_types: { name: string; max_capacity: number } | null;
  instructors: { name: string } | null;
}

const DAY_NAMES: Record<number, string> = {
  1: "Hetfo",
  2: "Kedd",
  3: "Szerda",
  4: "Csutortok",
  5: "Pentek",
  6: "Szombat",
  7: "Vasarnap",
};

interface FormData {
  class_type_id: string;
  instructor_id: string;
  day_of_week: number;
  start_time: string;
  max_spots_override: string;
}

const emptyForm: FormData = {
  class_type_id: "",
  instructor_id: "",
  day_of_week: 1,
  start_time: "09:00",
  max_spots_override: "",
};

export default function AdminSchedulePage() {
  const [classes, setClasses] = useState<ScheduledClassRow[]>([]);
  const [classTypes, setClassTypes] = useState<ClassTypeOption[]>([]);
  const [instructors, setInstructors] = useState<InstructorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    const [classesRes, classTypesRes, instructorsRes] = await Promise.all([
      fetch("/api/admin/classes").then((r) => r.json()),
      fetch("/api/admin/class-types").then((r) => r.json()),
      fetch("/api/admin/instructors").then((r) => r.json()),
    ]);

    setClasses(classesRes ?? []);
    setClassTypes(classTypesRes ?? []);
    setInstructors(instructorsRes ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function openNewForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      class_type_id: classTypes[0]?.id ?? "",
      instructor_id: instructors[0]?.id ?? "",
    });
    setFormError(null);
    setShowForm(true);
  }

  function openEditForm(cls: ScheduledClassRow) {
    setEditingId(cls.id);
    setForm({
      class_type_id: cls.class_type_id,
      instructor_id: cls.instructor_id,
      day_of_week: cls.day_of_week ?? 1,
      start_time: cls.start_time.slice(0, 5),
      max_spots_override: cls.max_spots_override?.toString() ?? "",
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

    if (!form.class_type_id || !form.instructor_id) {
      setFormError("Minden mezot ki kell tolteni.");
      return;
    }

    setSaving(true);

    const payload = {
      class_type_id: form.class_type_id,
      instructor_id: form.instructor_id,
      day_of_week: form.day_of_week,
      start_time: form.start_time + ":00",
      max_spots_override: form.max_spots_override
        ? parseInt(form.max_spots_override)
        : null,
    };

    try {
      const url = editingId
        ? `/api/admin/classes/${editingId}`
        : "/api/admin/classes";
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
    if (!confirm("Biztosan torolni szeretned ezt az orat?")) return;

    const res = await fetch(`/api/admin/classes/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchData();
    }
  }

  const grouped = (classes ?? []).reduce(
    (acc, cls) => {
      const dow = cls.day_of_week ?? 0;
      if (!acc[dow]) acc[dow] = [];
      acc[dow].push(cls);
      return acc;
    },
    {} as Record<number, ScheduledClassRow[]>
  );

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
          Orarend
        </h1>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Uj ora
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-md p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                {editingId ? "Ora szerkesztese" : "Uj ora hozzaadasa"}
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
                  Oratipus
                </label>
                <select
                  value={form.class_type_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, class_type_id: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {classTypes.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Oktato
                </label>
                <select
                  value={form.instructor_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, instructor_id: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {instructors.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Nap
                </label>
                <select
                  value={form.day_of_week}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      day_of_week: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <option key={d} value={d}>
                      {DAY_NAMES[d]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Kezdes ideje
                </label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, start_time: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Max helyek (opcionalis)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.max_spots_override}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      max_spots_override: e.target.value,
                    }))
                  }
                  placeholder="Az oratipus alapertelmezettet hasznalja"
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
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

      {Object.keys(grouped).length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
          Meg nincsenek orak beallitva.
        </div>
      ) : (
        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6, 7].map((dow) => {
            const dayClasses = grouped[dow];
            if (!dayClasses || dayClasses.length === 0) return null;
            return (
              <section key={dow}>
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
                  {DAY_NAMES[dow]}
                </h2>
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Ido
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Oratipus
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                          Oktato
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Helyek
                        </th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Muveletek
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {dayClasses.map((cls) => (
                        <tr key={cls.id}>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            {cls.start_time.slice(0, 5)}
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">
                            {cls.class_types?.name ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                            {cls.instructors?.name ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">
                            {cls.max_spots_override ??
                              cls.class_types?.max_capacity ??
                              "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditForm(cls)}
                                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title="Szerkesztes"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => handleDelete(cls.id)}
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
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
