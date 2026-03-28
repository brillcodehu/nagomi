import { z } from "zod";

export const bookingFormSchema = z.object({
  scheduledClassId: z.string().uuid(),
  classDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  customerName: z
    .string()
    .min(2, "Legalabb 2 karakter szukseges")
    .max(100, "Maximum 100 karakter"),
  customerEmail: z.string().email("Ervenytelen email cim"),
  customerPhone: z
    .string()
    .min(7, "Ervenytelen telefonszam")
    .max(20, "Ervenytelen telefonszam")
    .regex(/^[+\d\s()-]+$/, "Ervenytelen telefonszam"),
  paymentType: z.enum(["stripe", "pass"]),
  passId: z.string().uuid().optional().nullable(),
});

export type BookingFormInput = z.infer<typeof bookingFormSchema>;

export const passCheckSchema = z.object({
  email: z.string().email("Ervenytelen email cim"),
});

export const passPurchaseSchema = z.object({
  passTypeId: z.string().uuid(),
  customerName: z
    .string()
    .min(2, "Legalabb 2 karakter szukseges")
    .max(100),
  customerEmail: z.string().email("Ervenytelen email cim"),
  customerPhone: z
    .string()
    .min(7, "Ervenytelen telefonszam")
    .max(20)
    .regex(/^[+\d\s()-]+$/),
});

export type PassPurchaseInput = z.infer<typeof passPurchaseSchema>;

export const classTypeSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  duration_min: z.number().int().min(15).max(180),
  max_capacity: z.number().int().min(1).max(20),
  price_huf: z.number().int().min(0),
  difficulty: z.number().int().min(0).max(3),
  is_private: z.boolean(),
  sort_order: z.number().int().optional(),
});

export const scheduledClassSchema = z.object({
  class_type_id: z.string().uuid(),
  instructor_id: z.string().uuid(),
  day_of_week: z.number().int().min(1).max(7).optional().nullable(),
  start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  specific_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  max_spots_override: z.number().int().min(1).optional().nullable(),
  is_cancelled: z.boolean().optional(),
  notes: z.string().optional().nullable(),
});

export const passTypeSchema = z.object({
  name: z.string().min(1).max(100),
  occasions: z.number().int().min(1).max(100),
  price_huf: z.number().int().min(0),
  valid_days: z.number().int().min(1).max(365),
  description: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().optional(),
});
