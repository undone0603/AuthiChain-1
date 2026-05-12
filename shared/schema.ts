import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Export integration models
export * from "./models/auth";
export * from "./models/chat";
export * from "./models/logs";

import { users } from "./models/auth";

// === PRODUCTS TABLE ===
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category"), // AI classified
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  
  // AuthiChain specific fields
  isRegistered: boolean("is_registered").default(false), // Blockchain mock
  blockchainTxHash: text("blockchain_tx_hash"),
  trueMarkId: text("true_mark_id"), // Microscopic capture ID
  trueMarkData: jsonb("true_mark_data"), // Simulated microscopic data
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// === VERIFICATION SCANS ===
export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  scannerId: varchar("scanner_id").references(() => users.id), // Optional, can be public
  
  isAuthentic: boolean("is_authentic").notNull(),
  location: text("location"),
  deviceInfo: text("device_info"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// === RELATIONS ===
export const productsRelations = relations(products, ({ one, many }) => ({
  owner: one(users, {
    fields: [products.ownerId],
    references: [users.id],
  }),
  scans: many(scans),
}));

export const scansRelations = relations(scans, ({ one }) => ({
  product: one(products, {
    fields: [scans.productId],
    references: [products.id],
  }),
  scanner: one(users, {
    fields: [scans.scannerId],
    references: [users.id],
  }),
}));

// === ZOD SCHEMAS ===
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isRegistered: true,
  blockchainTxHash: true,
  trueMarkId: true,
  trueMarkData: true
}) as any;

export const insertScanSchema = createInsertSchema(scans).omit({
  id: true,
  createdAt: true
}) as any;

import { autonomousSystemLogs } from "./models/logs";

export const insertLogSchema = createInsertSchema(autonomousSystemLogs).omit({
  id: true,
  timestamp: true
}) as any;

// === TYPES ===
export type Product = typeof products.$inferSelect;
export type InsertProduct = {
  name: string;
  description: string;
  imageUrl: string;
  category?: string | null;
  ownerId: string;
};
export type Scan = typeof scans.$inferSelect;
export type InsertScan = {
  productId: number;
  scannerId?: string | null;
  isAuthentic: boolean;
  location?: string | null;
  deviceInfo?: string | null;
};
