import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createUuid } from "./uuid";

export const programs = sqliteTable("programs", {
  id: text("id").primaryKey().$defaultFn(createUuid),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
  modifiedAt: text("modified_at").notNull(),
});

export const workouts = sqliteTable("workouts", {
  id: text("id").primaryKey().$defaultFn(createUuid),
  programId: text("program_id").notNull().references(() => programs.id),
  title: text("title").notNull(),
  week: integer("week"),
  exercises: text("exercises", { mode: "json" }).$type<string[]>().default([]),
  orderIndex: integer("order_index"),
  createdAt: text("created_at").notNull(),
  modifiedAt: text("modified_at").notNull(),
});

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey().$defaultFn(createUuid),
  workoutId: text("workout_id").notNull().references(() => workouts.id),
  name: text("name").notNull(),
  sets: integer("sets"),
  reps: integer("reps"),
  description: text("description"),
  orderIndex: integer("order_index"),
  createdAt: text("created_at").notNull(),
  modifiedAt: text("modified_at").notNull(),
});

export const weightEntries = sqliteTable("weight_entries", {
  id: text("id").primaryKey().$defaultFn(createUuid),
  exerciseId: text("exercise_id").notNull().references(() => exercises.id),
  weight: real("weight"),
  loggedAt: text("logged_at").notNull(),
  modifiedAt: text("modified_at").notNull(),
});