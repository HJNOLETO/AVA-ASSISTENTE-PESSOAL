CREATE TABLE `agents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`role` text DEFAULT 'assistant' NOT NULL,
	`goal` text,
	`model` text,
	`isActive` integer DEFAULT true,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `legal_deadlines` ADD `userId` integer NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `legal_hearings` ADD `userId` integer NOT NULL REFERENCES users(id);