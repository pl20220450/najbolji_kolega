import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  candidateName: varchar("candidate_name", { length: 255 }).notNull(),
  voterIdentifier: varchar("voter_identifier", { length: 255 }).notNull().unique(),
});