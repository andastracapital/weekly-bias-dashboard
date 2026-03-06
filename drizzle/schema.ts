import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Files table for storing uploaded file metadata.
 * Actual file bytes are stored in S3.
 */
export const files = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey(),
  /** User who uploaded the file */
  userId: int("userId").notNull().references(() => users.id),
  /** Original filename */
  filename: varchar("filename", { length: 255 }).notNull(),
  /** S3 storage key */
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  /** Public URL to access the file */
  url: text("url").notNull(),
  /** MIME type (e.g., image/png, application/pdf) */
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  /** File size in bytes */
  fileSize: int("fileSize").notNull(),
  /** Optional category (e.g., 'pmt-report', 'chart', 'trade-journal') */
  category: varchar("category", { length: 50 }),
  /** Optional description */
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type File = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;

/**
 * History entries table for the History page.
 * Each row represents one Daily Recap Update, storing the
 * Swing Watchlist (from Weekly View), Swing Setups, and Intraday Trades.
 */
export const historyEntries = mysqlTable("history_entries", {
  id: int("id").autoincrement().primaryKey(),
  /** Date of the daily recap update (YYYY-MM-DD) */
  date: varchar("date", { length: 10 }).notNull().unique(),
  /** Week range label, e.g. "Feb 9 - Feb 15, 2026" */
  weekRange: varchar("weekRange", { length: 64 }),
  /** Swing Watchlist pairs from Weekly View, JSON array of {pair, direction} */
  swingWatchlist: varchar("swingWatchlist", { length: 2000 }).notNull().default("[]"),
  /** Swing Setups (High Conviction) from Daily View, JSON array of {pair, direction} */
  swingSetups: varchar("swingSetups", { length: 2000 }).notNull().default("[]"),
  /** Intraday Trades (Base Hits) from Daily View, JSON array of {pair, direction} */
  intradayTrades: varchar("intradayTrades", { length: 2000 }).notNull().default("[]"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HistoryEntry = typeof historyEntries.$inferSelect;
export type InsertHistoryEntry = typeof historyEntries.$inferInsert;