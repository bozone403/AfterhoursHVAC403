CREATE TABLE "blog_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_post_categories" (
	"post_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "blog_post_categories_post_id_category_id_pk" PRIMARY KEY("post_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"cover_image_url" text,
	"author_id" integer,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "calculator_usage" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"calculator_type" text NOT NULL,
	"tier" text,
	"input_data" jsonb,
	"completed" boolean DEFAULT false,
	"conversion_to_quote" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "carousel_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"uploaded_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text,
	"message" text NOT NULL,
	"source" text DEFAULT 'contact_form',
	"priority" text DEFAULT 'normal',
	"status" text DEFAULT 'new',
	"assigned_to" integer,
	"response_required" boolean DEFAULT true,
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "corporate_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" text NOT NULL,
	"admin_user_id" integer NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"max_users" integer DEFAULT 10,
	"current_users" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"subscription_type" text DEFAULT 'corporate',
	"annual_revenue" text,
	"custom_pricing_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "customer_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"location" text,
	"rating" integer NOT NULL,
	"review_text" text NOT NULL,
	"service_type" text,
	"is_approved" boolean DEFAULT false,
	"service_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"address" text,
	"city" text,
	"province" text,
	"postal_code" text,
	"company" text,
	"customer_type" text DEFAULT 'residential',
	"source" text,
	"notes" text,
	"total_spent" numeric(10, 2) DEFAULT '0',
	"last_contact_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "emergency_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"name" text NOT NULL,
	"email" text,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"issue_description" text NOT NULL,
	"urgency_level" text NOT NULL,
	"status" text DEFAULT 'pending',
	"requested_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"location" text,
	"priority" text,
	"assigned_to" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"emergency_type" text,
	"description" text,
	"severity" text,
	"assigned_technician" text,
	"estimated_arrival" timestamp,
	"total_cost" numeric(10, 2)
);
--> statement-breakpoint
CREATE TABLE "enhanced_quotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"quote_number" text NOT NULL,
	"user_id" integer,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text,
	"customer_address" text,
	"job_description" text,
	"items" jsonb NOT NULL,
	"labor_hours" numeric(5, 1),
	"labor_rate" numeric(10, 2),
	"markup_percentage" numeric(5, 2),
	"tax_rate" numeric(5, 2),
	"subtotal" numeric(10, 2),
	"labor" numeric(10, 2),
	"markup" numeric(10, 2),
	"tax" numeric(10, 2),
	"total" numeric(10, 2),
	"deposit_amount" numeric(10, 2),
	"payment_status" text DEFAULT 'pending',
	"stripe_payment_intent_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "enhanced_quotes_quote_number_unique" UNIQUE("quote_number")
);
--> statement-breakpoint
CREATE TABLE "forum_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"sort_order" integer,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "forum_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "forum_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"topic_id" integer,
	"post_id" integer,
	"like_type" text DEFAULT 'like',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "forum_likes_user_id_topic_id_like_type_pk" PRIMARY KEY("user_id","topic_id","like_type")
);
--> statement-breakpoint
CREATE TABLE "forum_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic_id" integer,
	"user_id" integer,
	"content" text NOT NULL,
	"display_name" text,
	"is_edited" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forum_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"user_id" integer,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"slug" text NOT NULL,
	"display_name" text,
	"views" integer DEFAULT 0,
	"is_pinned" boolean DEFAULT false,
	"is_locked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"image_url" text NOT NULL,
	"alt_text" text,
	"category" text,
	"sort_order" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"created_by" integer
);
--> statement-breakpoint
CREATE TABLE "hvac_accessories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2),
	"installation_time" numeric(5, 2),
	"compatibility" text[],
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "hvac_equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"name" text NOT NULL,
	"description" text,
	"manufacturer" text,
	"model" text,
	"efficiency" text,
	"base_price" numeric(10, 2),
	"installation_cost" numeric(10, 2),
	"annual_operating_cost" numeric(10, 2),
	"lifespan" integer,
	"type" text,
	"btu_output" integer,
	"seer_rating" numeric(4, 1),
	"afue_rating" numeric(4, 1),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hvac_equipment_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "hvac_labor" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"hourly_rate" numeric(10, 2),
	"average_time_per_job" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE "hvac_materials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"unit" text NOT NULL,
	"cost_per_unit" numeric(10, 2),
	"type" text,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"position" text NOT NULL,
	"experience" text NOT NULL,
	"cover_letter" text,
	"years_experience" text,
	"education" text,
	"certifications" text,
	"availability" text,
	"salary_expectation" text,
	"reference_info" text,
	"resume_url" text,
	"status" text DEFAULT 'pending',
	"applied_at" timestamp DEFAULT now(),
	"reviewed_at" timestamp,
	"reviewed_by" integer,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "job_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"quote_id" integer,
	"user_id" integer,
	"customer_name" text NOT NULL,
	"customer_email" text,
	"customer_phone" text,
	"customer_address" text,
	"job_type" text NOT NULL,
	"service_type" text,
	"scheduled_date" timestamp NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"estimated_duration" integer,
	"technician" text,
	"status" text DEFAULT 'scheduled',
	"priority" text DEFAULT 'normal',
	"special_instructions" text,
	"equipment_required" jsonb,
	"materials_required" jsonb,
	"completion_notes" text,
	"payment_status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "maintenance_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"plan_type" text NOT NULL,
	"equipment_type" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"next_service_date" timestamp NOT NULL,
	"frequency" text NOT NULL,
	"annual_cost" numeric(10, 2),
	"is_active" boolean DEFAULT true,
	"services_included" jsonb,
	"equipment_details" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"session_id" text,
	"page" text NOT NULL,
	"referrer" text,
	"user_agent" text,
	"ip_address" text,
	"duration" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "phone_verification_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" text NOT NULL,
	"ip_address" text,
	"attempt_count" integer DEFAULT 1,
	"last_attempt" timestamp DEFAULT now(),
	"blocked_until" timestamp
);
--> statement-breakpoint
CREATE TABLE "pro_calculator_quotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"client_name" text,
	"client_email" text,
	"client_phone" text,
	"property_type" text,
	"square_footage" integer,
	"equipment_details" jsonb,
	"materials_details" jsonb,
	"labor_details" jsonb,
	"accessories_details" jsonb,
	"total_cost" numeric(10, 2),
	"annual_savings" numeric(10, 2),
	"created_at" timestamp DEFAULT now(),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "product_access" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"purchased_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"active" boolean DEFAULT true,
	"payment_intent_id" text
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"category" text NOT NULL,
	"tier" text,
	"features" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quote_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"address" text,
	"service_type" text NOT NULL,
	"system_type" text,
	"description" text,
	"preferred_contact_method" text DEFAULT 'email',
	"preferred_contact_time" text,
	"budget" text,
	"timeline" text,
	"status" text DEFAULT 'pending',
	"quote_amount" numeric(10, 2),
	"quoted_at" timestamp,
	"valid_until" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "security_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"event_type" text NOT NULL,
	"details" jsonb,
	"ip_address" text,
	"user_agent" text,
	"severity" text DEFAULT 'low',
	"resolved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"user_id" integer,
	"name" text NOT NULL,
	"email" text,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"service_type" text NOT NULL,
	"description" text,
	"preferred_date" timestamp,
	"preferred_time" text,
	"status" text DEFAULT 'pending',
	"assigned_technician" integer,
	"estimated_duration" integer,
	"actual_start_time" timestamp,
	"actual_end_time" timestamp,
	"total_cost" numeric(10, 2),
	"notes" text,
	"internal_notes" text,
	"invoice_sent" boolean DEFAULT false,
	"invoice_id" text,
	"payment_status" text DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_journey_stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_request_id" integer,
	"stage" text NOT NULL,
	"status" text NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"estimated_duration" integer,
	"actual_duration" integer,
	"notes" text,
	"performed_by" integer,
	"customer_notified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_number" text NOT NULL,
	"customer_id" integer,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text,
	"service_type" text NOT NULL,
	"priority" text DEFAULT 'normal',
	"status" text DEFAULT 'received',
	"current_stage" text DEFAULT 'contact',
	"address" text NOT NULL,
	"description" text NOT NULL,
	"equipment_type" text,
	"assigned_technician" integer,
	"scheduled_date" timestamp,
	"estimated_completion" timestamp,
	"actual_start_time" timestamp,
	"actual_end_time" timestamp,
	"total_cost" numeric(10, 2),
	"payment_status" text DEFAULT 'pending',
	"customer_satisfaction" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "service_requests_request_number_unique" UNIQUE("request_number")
);
--> statement-breakpoint
CREATE TABLE "service_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_request_id" integer,
	"update_type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"is_visible_to_customer" boolean DEFAULT true,
	"created_by" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_type" text NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"metadata" jsonb,
	"recorded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "technician_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"technician_id" integer,
	"service_request_id" integer,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"accuracy" numeric(8, 2),
	"heading" numeric(5, 2),
	"speed" numeric(5, 2),
	"estimated_arrival" timestamp,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"session_id" text NOT NULL,
	"device_fingerprint" text NOT NULL,
	"device_info" jsonb,
	"ip_address" text,
	"user_agent" text,
	"location" text,
	"is_active" boolean DEFAULT true,
	"last_activity" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	CONSTRAINT "user_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text,
	"phone" text,
	"first_name" text,
	"last_name" text,
	"company" text,
	"role" text DEFAULT 'user',
	"user_type" text DEFAULT 'customer',
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"has_pro_access" boolean DEFAULT false,
	"has_pro" boolean DEFAULT false,
	"is_admin" boolean DEFAULT false,
	"pro_access_granted_at" timestamp,
	"membership_type" text,
	"membership_expires_at" timestamp,
	"is_lifetime_member" boolean DEFAULT false,
	"profile_image_url" text,
	"phone_verified" boolean DEFAULT false,
	"phone_verification_code" text,
	"phone_verification_expires_at" timestamp,
	"phone_verified_at" timestamp,
	"corporate_account_id" integer,
	"is_corporate_admin" boolean DEFAULT false,
	"max_sessions" integer DEFAULT 1,
	"device_fingerprint" text,
	"last_device_fingerprint" text,
	"suspicious_login_detected" boolean DEFAULT false,
	"account_locked" boolean DEFAULT false,
	"locked_at" timestamp,
	"lock_reason" text,
	"created_at" timestamp DEFAULT now(),
	"last_login" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "blog_post_categories" ADD CONSTRAINT "blog_post_categories_post_id_blog_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_categories" ADD CONSTRAINT "blog_post_categories_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculator_usage" ADD CONSTRAINT "calculator_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carousel_images" ADD CONSTRAINT "carousel_images_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_submissions" ADD CONSTRAINT "contact_submissions_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emergency_requests" ADD CONSTRAINT "emergency_requests_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emergency_requests" ADD CONSTRAINT "emergency_requests_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enhanced_quotes" ADD CONSTRAINT "enhanced_quotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_likes" ADD CONSTRAINT "forum_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_likes" ADD CONSTRAINT "forum_likes_topic_id_forum_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."forum_topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_likes" ADD CONSTRAINT "forum_likes_post_id_forum_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."forum_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_topic_id_forum_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."forum_topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_topics" ADD CONSTRAINT "forum_topics_category_id_forum_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."forum_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_topics" ADD CONSTRAINT "forum_topics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hvac_equipment" ADD CONSTRAINT "hvac_equipment_category_id_hvac_equipment_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."hvac_equipment_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_schedules" ADD CONSTRAINT "job_schedules_quote_id_enhanced_quotes_id_fk" FOREIGN KEY ("quote_id") REFERENCES "public"."enhanced_quotes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_schedules" ADD CONSTRAINT "job_schedules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_plans" ADD CONSTRAINT "maintenance_plans_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pro_calculator_quotes" ADD CONSTRAINT "pro_calculator_quotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_access" ADD CONSTRAINT "product_access_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_access" ADD CONSTRAINT "product_access_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD CONSTRAINT "quote_requests_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_logs" ADD CONSTRAINT "security_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_bookings" ADD CONSTRAINT "service_bookings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_bookings" ADD CONSTRAINT "service_bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_bookings" ADD CONSTRAINT "service_bookings_assigned_technician_users_id_fk" FOREIGN KEY ("assigned_technician") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_journey_stages" ADD CONSTRAINT "service_journey_stages_service_request_id_service_requests_id_fk" FOREIGN KEY ("service_request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_journey_stages" ADD CONSTRAINT "service_journey_stages_performed_by_users_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_assigned_technician_users_id_fk" FOREIGN KEY ("assigned_technician") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_updates" ADD CONSTRAINT "service_updates_service_request_id_service_requests_id_fk" FOREIGN KEY ("service_request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_updates" ADD CONSTRAINT "service_updates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technician_locations" ADD CONSTRAINT "technician_locations_technician_id_users_id_fk" FOREIGN KEY ("technician_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technician_locations" ADD CONSTRAINT "technician_locations_service_request_id_service_requests_id_fk" FOREIGN KEY ("service_request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_corporate_account_id_corporate_accounts_id_fk" FOREIGN KEY ("corporate_account_id") REFERENCES "public"."corporate_accounts"("id") ON DELETE no action ON UPDATE no action;