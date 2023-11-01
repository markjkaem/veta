CREATE TABLE IF NOT EXISTS "settingsaccount" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstname" text,
	"lastname" text,
	"gender" text,
	"phone" text,
	"vatnumber" text,
	"companyid" text,
	"email" text,
	CONSTRAINT "settingsaccount_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "alias" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ALTER COLUMN "bio" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "categories" varchar(256);--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_id_unique" UNIQUE("id");