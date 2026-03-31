"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface PassTypeRow {
  id: string;
  name: string;
  occasions: number;
  price_huf: number;
  valid_days: number;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

interface CustomerPassRow {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  remaining_occasions: number;
  purchased_at: string;
  expires_at: string;
  is_active: boolean;
  pass_types: { name: string; occasions: number } | null;
}

interface PassTypeFormData {
  name: string;
  occasions: string;
  price_huf: string;
  valid_days: string;
  description: string;
  is_active: boolean;
  sort_order: string;
}

const emptyForm: PassTypeFormData = {
  name: "",
  occasions: "",
  price_huf: "",
  valid_days: "30",
  description: "",
  is_active: true,
  sort_order: "0",
};

export default function AdminPassesPage() {
  const [activeTab, setActiveTab] = useState<"types" | "purchased">("types");
  const [passTypes, setPassTypes] = useState<PassTypeRow[]>([]);
  const [customerPasses, setCustomerPasses] = useState<CustomerPassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PassTypeFormData>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPassTypes = useCallback(async () => {
    const res = await fetch("/api/admin/pass-types");
    if (res.ok) {
      const data = await res.json();
      setPassTypes(data);
    }
  }, []);

  const fetchCustomerPasses = useCallback(async () => {
    const res = await fetch("/api/admin/customer-passes");
    if (res.ok) {
      const data = await res.json();
      setCustomerPasses(data ?? []);
    }
  }, []);

  useEffect(() => {
    async function init() {
      await Promise.all([fetchPassTypes(), fetchCustomerPasses()]);
      setLoading(false);
    }
    init();
  }, [fetchPassTypes, fetchCustomerPasses]);

  function openNewForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  }

  function openEditForm(pt: PassTypeRow) {
    setEditingId(pt.id);
    setForm({
      name: pt.name,
      occasions: pt.occasions.toString(),
      price_huf: pt.price_huf.toString(),
      valid_days: pt.valid_days.toString(),
      description: pt.description ?? "",
      is_active: pt.is_active,
      sort_order: pt.sort_order.toString(),
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

    if (!form.name || !form.occasions || !form.price_huf) {
      setFormError("A nev, alkalmak szama es ar kitoltese kotelezo.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name,
      occasions: parseInt(form.occasions),
      price_huf: parseInt(form.price_huf),
      valid_days: parseInt(form.valid_days) || 30,
      description: form.description || null,
      is_active: form.is_active,
      sort_order: parseInt(form.sort_order) || 0,
    };

    try {
      const url = editingId
        ? `/api/admin/pass-types/${editingId}`
        : "/api/admin/pass-types";
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
      await fetchPassTypes();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Ismeretlen hiba.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Biztosan torolni szeretned ezt a berlettipust?")) return;

    const res = await fetch(`/api/admin/pass-types/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchPassTypes();
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
      <h1 className="font-serif text-2xl font-semibold text-foreground">
        Berletek
      </h1>

      {/* Tabfuek */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("types")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "types"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Berlet tipusok
        </button>
        <button
          onClick={() => setActiveTab("purchased")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "purchased"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Vasarolt berletek
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 px-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-md p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                {editingId
                  ? "Berlettipus szerkesztese"
                  : "Uj berlettipus"}
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
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                  placeholder="pl. 10 alkalmas berlet"
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Alkalmak szama *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.occasions}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, occasions: e.target.value }))
                    }
                    required
                    className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Ervenyes (nap)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.valid_days}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, valid_days: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
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
                  rows={2}
                  className="w-full px-3 py-2.5 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, is_active: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-input text-primary focus:ring-ring"
                />
                <span className="text-sm font-medium text-foreground">
                  Aktiv (vasarolhato)
                </span>
              </label>

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

      {/* Tab 1: Berlet tipusok */}
      {activeTab === "types" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={openNewForm}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              Uj berlettipus
            </button>
          </div>

          {passTypes.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
              Meg nincsenek berlettipusok.
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Nev
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Alkalmak
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Ar
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Ervenyes
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Aktiv
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Muveletek
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {passTypes.map((pt) => (
                    <tr key={pt.id}>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        {pt.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {pt.occasions} alkalom
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {pt.price_huf.toLocaleString("hu-HU")} Ft
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                        {pt.valid_days} nap
                      </td>
                      <td className="px-4 py-3 text-sm hidden md:table-cell">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            pt.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {pt.is_active ? "Igen" : "Nem"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditForm(pt)}
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Szerkesztes"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(pt.id)}
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
      )}

      {/* Tab 2: Vasarolt berletek */}
      {activeTab === "purchased" && (
        <div>
          {customerPasses.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
              Meg nincsenek vasarolt berletek.
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
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Berlet
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Hatralevo
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Lejar
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Aktiv
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {customerPasses.map((cp) => {
                    const isExpired = new Date(cp.expires_at) < new Date();
                    return (
                      <tr key={cp.id}>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          {cp.customer_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                          {cp.customer_email}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {cp.pass_types?.name ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`font-medium ${
                              cp.remaining_occasions === 0
                                ? "text-destructive"
                                : "text-foreground"
                            }`}
                          >
                            {cp.remaining_occasions}/
                            {cp.pass_types?.occasions ?? "?"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                          <span className={isExpired ? "text-destructive" : ""}>
                            {cp.expires_at.split("T")[0]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm hidden lg:table-cell">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              cp.is_active && !isExpired
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {cp.is_active && !isExpired ? "Igen" : "Nem"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
