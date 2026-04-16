ALTER TABLE `conversations` ADD `favorite` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `memoryEntries` ADD `archived` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `memoryEntries` ADD `ttl` integer;--> statement-breakpoint
ALTER TABLE `userSettings` ADD `profileRole` text DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `userSettings` ADD `profession` text;--> statement-breakpoint
ALTER TABLE `userSettings` ADD `expertiseLevel` text DEFAULT 'intermediate';--> statement-breakpoint
ALTER TABLE `userSettings` ADD `preferredTone` text DEFAULT 'formal';--> statement-breakpoint
ALTER TABLE `userSettings` ADD `includePiiInContext` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `userSettings` ADD `jurisdiction` text;--> statement-breakpoint
ALTER TABLE `userSettings` ADD `medicalConsent` integer DEFAULT 0;