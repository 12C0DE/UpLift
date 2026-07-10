PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_id` integer NOT NULL,
	`name` text NOT NULL,
	`sets` integer,
	`reps` integer,
	`description` text,
	`order_index` integer,
	`created_at` text NOT NULL,
	`modified_at` text NOT NULL,
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_exercises`("id", "workout_id", "name", "sets", "reps", "description", "order_index", "created_at", "modified_at") SELECT "id", "workout_id", "name", "sets", "reps", "description", "order_index", "created_at", "modified_at" FROM `exercises`;--> statement-breakpoint
DROP TABLE `exercises`;--> statement-breakpoint
ALTER TABLE `__new_exercises` RENAME TO `exercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_programs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`modified_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_programs`("id", "name", "created_at", "modified_at") SELECT "id", "name", "created_at", "modified_at" FROM `programs`;--> statement-breakpoint
DROP TABLE `programs`;--> statement-breakpoint
ALTER TABLE `__new_programs` RENAME TO `programs`;--> statement-breakpoint
CREATE TABLE `__new_weight_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exercise_id` integer NOT NULL,
	`weight` real,
	`logged_at` text NOT NULL,
	`modified_at` text NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_weight_entries`("id", "exercise_id", "weight", "logged_at", "modified_at") SELECT "id", "exercise_id", "weight", "logged_at", "modified_at" FROM `weight_entries`;--> statement-breakpoint
DROP TABLE `weight_entries`;--> statement-breakpoint
ALTER TABLE `__new_weight_entries` RENAME TO `weight_entries`;--> statement-breakpoint
CREATE TABLE `__new_workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`program_id` integer NOT NULL,
	`title` text NOT NULL,
	`week` integer,
	`exercises` text DEFAULT '[]',
	`order_index` integer,
	`created_at` text NOT NULL,
	`modified_at` text NOT NULL,
	FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_workouts`("id", "program_id", "title", "week", "exercises", "order_index", "created_at", "modified_at") SELECT "id", "program_id", "title", "week", "exercises", "order_index", "created_at", "modified_at" FROM `workouts`;--> statement-breakpoint
DROP TABLE `workouts`;--> statement-breakpoint
ALTER TABLE `__new_workouts` RENAME TO `workouts`;