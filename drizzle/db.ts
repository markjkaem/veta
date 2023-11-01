import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

const sql = neon("postgres://mansourbibi99:aqQA1oFtKc7v@ep-white-brook-48690058.eu-central-1.aws.neon.tech/neondb?sslmode=require");
const db = drizzle(sql);

export default db;
