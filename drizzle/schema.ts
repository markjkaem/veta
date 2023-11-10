import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  varchar,
  uuid,
  boolean,
} from "drizzle-orm/pg-core"
import { AdapterAccount } from "next-auth/adapters"

export const influencerProfiles = pgTable("influencerProfile", {
  id: uuid("id").primaryKey().defaultRandom().unique().notNull(),
  alias: text("alias"),
  url: text("url"),
  email: text("email"),
  bio: text("bio"),
  categories: varchar("categories", { length: 256 }),
  image: text("image"),
})

export const companyProfiles = pgTable("companyProfile", {
  id: uuid("id").primaryKey().defaultRandom().unique().notNull(),
  alias: text("alias"),
  url: text("url"),
  email: text("email"),
  bio: text("bio"),
  categories: varchar("categories", { length: 256 }),
  countries: varchar("countries", { length: 256 }),
  genders: varchar("genders", { length: 256 }),
  image: text("image"),
})

export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom().unique().notNull(),
  title: text("title"),
  description: text("description"),
  briefing: text("briefing"),
  email: text("email"),
  banner: text("banner")
})

export const listingsTasks = pgTable("listingTask", {
  id: uuid("id").primaryKey().defaultRandom().unique().notNull(),
  listingId: text("listingid"),
  platform: text("platform", {enum: ["tiktok", "instragram", "youtube", "x", "twitch", "facebook", "substack", "instagramlite", "adsense", "spotify", "linkedin", "beehiiv"]}),
  description: text("description")
})

export const campaigns = pgTable("campaign", {
  id: uuid("id").primaryKey().defaultRandom().unique().notNull(),
  listingId: text("listingId"),
  companyId: text("companyId"),
  influencerId: text("influencerId"),
  isActive: boolean("isActive").default(false),
  timestamp: timestamp('timestamp').defaultNow(),
})

export const campaignMessages = pgTable("campaignmessage", {
  id: uuid("id").primaryKey().defaultRandom().unique().notNull(),
  campaignId: text("campaignId"),
  senderId: text("senderId"),
  receiverId: text("receiverId"),
  message: text("message")
})

export const settingsaccounts = pgTable("settingsaccount", {
  id: serial("id").primaryKey().unique(),
  firstname: text("firstname"),
  lastname: text("lastname"),
  gender: text("gender"),
  phone: text("phone"),
  vatnumber: text("vatnumber"),
  companyid: text("companyid"),
  email: text("email")
})

export const settingsaddress = pgTable("settingsaddress", {
  id: serial("id").primaryKey().unique(),
  companyname: text("companyname"),
  street: text("street"),
  zipcode: text("phone"),
  city: text("city"),
  country: text("country"),
  email: text("email")
})

export const phyllo = pgTable("phyllo", {
  id: serial("id").primaryKey().unique(),
  phylloid: text("phylloid"),
  email: text("email").notNull(),
})

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role", {enum: ["influencer", "company"]}),
  stripe_id: text("stripe_id"),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state")
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId)
  })
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull()
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull()
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token)
  })
)


