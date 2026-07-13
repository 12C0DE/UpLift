CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
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
CREATE TABLE `programs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`modified_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `weight_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`exercise_id` text NOT NULL,
	`weight` real,
	`logged_at` text NOT NULL,
	`modified_at` text NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`program_id` text NOT NULL,
	`title` text NOT NULL,
	`week` integer,
	`exercises` text DEFAULT '[]',
	`order_index` integer,
	`created_at` text NOT NULL,
	`modified_at` text NOT NULL,
	FOREIGN KEY (`program_id`) REFERENCES `programs`(`id`) ON UPDATE no action ON DELETE no action
);
