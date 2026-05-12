import { pgTable, uuid, varchar, decimal, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const autonomousSystemLogs = pgTable("autonomous_system_logs", {
  id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
  vertical: varchar("vertical", { length: 50 }).notNull(),
  payloadHash: varchar("payload_hash", { length: 255 }).notNull(),
  consensusScore: decimal("consensus_score", { precision: 5, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  errorMessage: text("error_message"),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
});

export type AutonomousSystemLog = typeof autonomousSystemLogs.$inferSelect;
export type InsertAutonomousSystemLog = typeof autonomousSystemLogs.$inferInsert;
