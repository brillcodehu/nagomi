CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scheduled_class_id" uuid NOT NULL,
	"class_date" date NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_type" text NOT NULL,
	"stripe_payment_intent_id" text,
	"stripe_checkout_session_id" text,
	"pass_id" uuid,
	"amount_huf" integer,
	"cancelled_at" timestamp with time zone,
	"cancellation_reason" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "class_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"tagline" text,
	"duration_min" integer DEFAULT 50 NOT NULL,
	"max_capacity" integer DEFAULT 6 NOT NULL,
	"price_huf" integer NOT NULL,
	"difficulty" integer DEFAULT 1,
	"is_private" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "class_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "customer_passes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pass_type_id" uuid NOT NULL,
	"customer_email" text NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text,
	"remaining_occasions" integer NOT NULL,
	"purchased_at" timestamp with time zone DEFAULT now(),
	"expires_at" timestamp with time zone NOT NULL,
	"stripe_payment_intent_id" text,
	"stripe_checkout_session_id" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "instructors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"bio" text,
	"avatar_url" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seq" serial NOT NULL,
	"stripe_checkout_session_id" text NOT NULL,
	"kind" text NOT NULL,
	"booking_id" uuid,
	"customer_pass_id" uuid,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"description" text NOT NULL,
	"amount_huf" integer NOT NULL,
	"provider" text NOT NULL,
	"status" text DEFAULT 'issued' NOT NULL,
	"invoice_number" text,
	"provider_ref" text,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pass_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"occasions" integer NOT NULL,
	"price_huf" integer NOT NULL,
	"valid_days" integer DEFAULT 30 NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scheduled_classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"class_type_id" uuid NOT NULL,
	"instructor_id" uuid NOT NULL,
	"day_of_week" integer,
	"start_time" time NOT NULL,
	"specific_date" date,
	"max_spots_override" integer,
	"is_cancelled" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_scheduled_class_id_scheduled_classes_id_fk" FOREIGN KEY ("scheduled_class_id") REFERENCES "public"."scheduled_classes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_pass_id_customer_passes_id_fk" FOREIGN KEY ("pass_id") REFERENCES "public"."customer_passes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_passes" ADD CONSTRAINT "customer_passes_pass_type_id_pass_types_id_fk" FOREIGN KEY ("pass_type_id") REFERENCES "public"."pass_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_pass_id_customer_passes_id_fk" FOREIGN KEY ("customer_pass_id") REFERENCES "public"."customer_passes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_classes" ADD CONSTRAINT "scheduled_classes_class_type_id_class_types_id_fk" FOREIGN KEY ("class_type_id") REFERENCES "public"."class_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_classes" ADD CONSTRAINT "scheduled_classes_instructor_id_instructors_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_bookings_class_date" ON "bookings" USING btree ("scheduled_class_id","class_date");--> statement-breakpoint
CREATE INDEX "idx_bookings_email" ON "bookings" USING btree ("customer_email");--> statement-breakpoint
CREATE INDEX "idx_bookings_status" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_bookings_stripe_session" ON "bookings" USING btree ("stripe_checkout_session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_unique_class_date_email" ON "bookings" USING btree ("scheduled_class_id","class_date","customer_email");--> statement-breakpoint
CREATE INDEX "idx_customer_passes_email" ON "customer_passes" USING btree ("customer_email");--> statement-breakpoint
CREATE INDEX "idx_customer_passes_active" ON "customer_passes" USING btree ("is_active","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "customer_passes_unique_session" ON "customer_passes" USING btree ("stripe_checkout_session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_unique_session_kind" ON "invoices" USING btree ("stripe_checkout_session_id","kind");--> statement-breakpoint
CREATE INDEX "idx_invoices_status" ON "invoices" USING btree ("status");