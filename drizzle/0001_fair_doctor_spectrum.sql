CREATE TABLE IF NOT EXISTS "profile" (
	"id" text PRIMARY KEY NOT NULL,
	"alias" text NOT NULL,
	"url" text,
	"email" text NOT NULL,
	"bio" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "blogs";