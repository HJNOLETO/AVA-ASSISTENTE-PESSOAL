CREATE TABLE `agent_cycles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`cycleId` text NOT NULL,
	`finalStatus` text NOT NULL,
	`stateTransitions` text NOT NULL,
	`toolExecMs` integer DEFAULT 0 NOT NULL,
	`ragMinScoreApplied` real,
	`ragHitCount` integer DEFAULT 0,
	`llmTokensIn` integer DEFAULT 0,
	`llmTokensOut` integer DEFAULT 0,
	`confirmationRequired` integer DEFAULT 0,
	`metadata` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `agent_cycles_cycleId_unique` ON `agent_cycles` (`cycleId`);--> statement-breakpoint
CREATE TABLE `learning_modules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`subject` text NOT NULL,
	`sourceReference` text,
	`sourceType` text DEFAULT 'manual',
	`description` text,
	`status` text DEFAULT 'active',
	`totalTopics` integer DEFAULT 0,
	`masteredTopics` integer DEFAULT 0,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_learning_modules_user_id` ON `learning_modules` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_learning_modules_status` ON `learning_modules` (`status`);--> statement-breakpoint
CREATE TABLE `user_context` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`summary` text NOT NULL,
	`tokenCount` integer DEFAULT 0,
	`lastCompacted` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_learning_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`moduleId` integer,
	`topic` text NOT NULL,
	`masteryLevel` integer DEFAULT 0,
	`strengths` text,
	`weaknesses` text,
	`correctAnswers` integer DEFAULT 0,
	`incorrectAnswers` integer DEFAULT 0,
	`lastReviewed` integer,
	`nextReviewDate` integer,
	`status` text DEFAULT 'learning',
	`feynmanUnlocked` integer DEFAULT 0,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`moduleId`) REFERENCES `learning_modules`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_ulp_user_id` ON `user_learning_progress` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_ulp_module_id` ON `user_learning_progress` (`moduleId`);--> statement-breakpoint
CREATE INDEX `idx_ulp_next_review` ON `user_learning_progress` (`nextReviewDate`);--> statement-breakpoint
CREATE INDEX `idx_ulp_status` ON `user_learning_progress` (`status`);--> statement-breakpoint
CREATE INDEX `idx_memory_entries_user_id` ON `memoryEntries` (`userId`);