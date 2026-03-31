import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  time,
  date,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const classTypes = pgTable("class_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  tagline: text("tagline"),
  durationMin: integer("duration_min").notNull().default(50),
  maxCapacity: integer("max_capacity").notNull().default(6),
  priceHuf: integer("price_huf").notNull(),
  difficulty: integer("difficulty").default(1),
  isPrivate: boolean("is_private").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const passTypes = pgTable("pass_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  occasions: integer("occasions").notNull(),
  priceHuf: integer("price_huf").notNull(),
  validDays: integer("valid_days").notNull().default(30),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const instructors = pgTable("instructors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const scheduledClasses = pgTable("scheduled_classes", {
  id: uuid("id").defaultRandom().primaryKey(),
  classTypeId: uuid("class_type_id")
    .notNull()
    .references(() => classTypes.id, { onDelete: "cascade" }),
  instructorId: uuid("instructor_id")
    .notNull()
    .references(() => instructors.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week"),
  startTime: time("start_time").notNull(),
  specificDate: date("specific_date"),
  maxSpotsOverride: integer("max_spots_override"),
  isCancelled: boolean("is_cancelled").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const customerPasses = pgTable(
  "customer_passes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    passTypeId: uuid("pass_type_id")
      .notNull()
      .references(() => passTypes.id),
    customerEmail: text("customer_email").notNull(),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone"),
    remainingOccasions: integer("remaining_occasions").notNull(),
    purchasedAt: timestamp("purchased_at", { withTimezone: true }).defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    stripeCheckoutSessionId: text("stripe_checkout_session_id"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_customer_passes_email").on(table.customerEmail),
    index("idx_customer_passes_active").on(table.isActive, table.expiresAt),
  ]
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    scheduledClassId: uuid("scheduled_class_id")
      .notNull()
      .references(() => scheduledClasses.id, { onDelete: "cascade" }),
    classDate: date("class_date").notNull(),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone").notNull(),
    status: text("status").notNull().default("pending"),
    paymentType: text("payment_type").notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    stripeCheckoutSessionId: text("stripe_checkout_session_id"),
    passId: uuid("pass_id").references(() => customerPasses.id),
    amountHuf: integer("amount_huf"),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    cancellationReason: text("cancellation_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_bookings_class_date").on(
      table.scheduledClassId,
      table.classDate
    ),
    index("idx_bookings_email").on(table.customerEmail),
    index("idx_bookings_status").on(table.status),
    index("idx_bookings_stripe_session").on(table.stripeCheckoutSessionId),
    uniqueIndex("bookings_unique_class_date_email").on(
      table.scheduledClassId,
      table.classDate,
      table.customerEmail
    ),
  ]
);
