import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  varchar,
} from "drizzle-orm/pg-core"
import { AdapterAccount } from "next-auth/adapters"

export const profiles = pgTable("profile", {
  id: serial("id").primaryKey().unique(),
  alias: text("alias"),
  url: text("url"),
  email: text("email"),
  bio: text("bio"),
  categories: varchar("categories", { length: 256 }),
  image: text("image"),

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


