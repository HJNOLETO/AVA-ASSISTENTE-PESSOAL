CREATE TABLE `action_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`courtType` text NOT NULL,
	`initialPetitionTemplate` text,
	`description` text,
	`isActive` integer DEFAULT 1,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `action_types_code_unique` ON `action_types` (`code`);--> statement-breakpoint
CREATE INDEX `idx_action_types_category` ON `action_types` (`category`);--> statement-breakpoint
CREATE INDEX `idx_action_types_court_type` ON `action_types` (`courtType`);--> statement-breakpoint
CREATE TABLE `attorney_fees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`processId` integer NOT NULL,
	`clientId` integer NOT NULL,
	`userId` integer NOT NULL,
	`feeType` text NOT NULL,
	`agreedValue` real,
	`awardedValue` real,
	`receivedValue` real,
	`percentage` real,
	`agreementDate` text,
	`dueDate` text,
	`paymentDate` text,
	`status` text DEFAULT 'pendente',
	`notes` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`processId`) REFERENCES `legal_processes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`clientId`) REFERENCES `legal_clients`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_fees_process_id` ON `attorney_fees` (`processId`);--> statement-breakpoint
CREATE INDEX `idx_fees_client_id` ON `attorney_fees` (`clientId`);--> statement-breakpoint
CREATE INDEX `idx_fees_status` ON `attorney_fees` (`status`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`action` text NOT NULL,
	`entity` text,
	`entityId` integer,
	`details` text,
	`ipAddress` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`customerId` integer,
	`title` text NOT NULL,
	`description` text,
	`startDate` text NOT NULL,
	`startTime` text NOT NULL,
	`endDate` text NOT NULL,
	`endTime` text NOT NULL,
	`type` text DEFAULT 'outro',
	`location` text,
	`reminderMinutes` integer,
	`isCompleted` integer DEFAULT 0,
	`recurrenceRule` text,
	`participants` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_events_user_id` ON `events` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_events_customer_id` ON `events` (`customerId`);--> statement-breakpoint
CREATE INDEX `idx_events_start_date` ON `events` (`startDate`);--> statement-breakpoint
CREATE INDEX `idx_events_is_completed` ON `events` (`isCompleted`);--> statement-breakpoint
CREATE TABLE `folders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`parentId` integer,
	`name` text NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parentId`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `legal_clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`name` text NOT NULL,
	`cpf` text NOT NULL,
	`rg` text,
	`birthDate` text,
	`maritalStatus` text,
	`email` text,
	`phone` text NOT NULL,
	`phoneSecondary` text,
	`addressStreet` text,
	`addressNumber` text,
	`addressComplement` text,
	`addressNeighborhood` text,
	`addressCity` text NOT NULL,
	`addressState` text,
	`addressZipcode` text,
	`occupation` text,
	`company` text,
	`monthlyIncome` real,
	`dependents` integer,
	`status` text DEFAULT 'ativo',
	`notes` text,
	`tags` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `legal_clients_cpf_unique` ON `legal_clients` (`cpf`);--> statement-breakpoint
CREATE INDEX `idx_legal_clients_user_id` ON `legal_clients` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_legal_clients_cpf` ON `legal_clients` (`cpf`);--> statement-breakpoint
CREATE INDEX `idx_legal_clients_city` ON `legal_clients` (`addressCity`);--> statement-breakpoint
CREATE INDEX `idx_legal_clients_status` ON `legal_clients` (`status`);--> statement-breakpoint
CREATE TABLE `legal_deadlines` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`processId` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`deadlineType` text NOT NULL,
	`startDate` text NOT NULL,
	`dueDate` text NOT NULL,
	`businessDays` integer,
	`status` text DEFAULT 'pendente' NOT NULL,
	`completionDate` text,
	`urgency` text,
	`notifyAt` text,
	`lastNotificationSent` text,
	`assignedToUserId` integer,
	`notes` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`processId`) REFERENCES `legal_processes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assignedToUserId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_deadlines_process_id` ON `legal_deadlines` (`processId`);--> statement-breakpoint
CREATE INDEX `idx_deadlines_due_date` ON `legal_deadlines` (`dueDate`);--> statement-breakpoint
CREATE INDEX `idx_deadlines_status` ON `legal_deadlines` (`status`);--> statement-breakpoint
CREATE TABLE `legal_hearings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`processId` integer NOT NULL,
	`hearingType` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`hearingDate` text NOT NULL,
	`hearingTime` text NOT NULL,
	`durationMinutes` integer DEFAULT 60,
	`location` text,
	`locationType` text DEFAULT 'presencial',
	`virtualLink` text,
	`judgeName` text,
	`plaintiffLawyer` text,
	`defendantLawyer` text,
	`witnesses` text,
	`status` text DEFAULT 'agendada',
	`result` text,
	`outcomeDescription` text,
	`minutesFilePath` text,
	`reminderSent` integer DEFAULT 0,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`processId`) REFERENCES `legal_processes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_hearings_process_id` ON `legal_hearings` (`processId`);--> statement-breakpoint
CREATE INDEX `idx_hearings_date` ON `legal_hearings` (`hearingDate`);--> statement-breakpoint
CREATE TABLE `legal_process_documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`processId` integer NOT NULL,
	`documentType` text NOT NULL,
	`title` text NOT NULL,
	`phase` text NOT NULL,
	`instance` text NOT NULL,
	`filePath` text NOT NULL,
	`fileName` text NOT NULL,
	`fileSize` integer,
	`mimeType` text DEFAULT 'application/pdf',
	`version` integer DEFAULT 1,
	`parentDocumentId` integer,
	`protocolNumber` text,
	`protocolDate` text,
	`status` text DEFAULT 'rascunho',
	`author` text,
	`notes` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`processId`) REFERENCES `legal_processes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parentDocumentId`) REFERENCES `legal_process_documents`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_legal_docs_process_id` ON `legal_process_documents` (`processId`);--> statement-breakpoint
CREATE INDEX `idx_legal_docs_type` ON `legal_process_documents` (`documentType`);--> statement-breakpoint
CREATE TABLE `legal_processes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`clientId` integer NOT NULL,
	`processNumber` text NOT NULL,
	`actionTypeId` integer NOT NULL,
	`category` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`courtType` text NOT NULL,
	`comarca` text,
	`varaNumber` text,
	`currentInstance` text DEFAULT '1ª instancia' NOT NULL,
	`courtName` text,
	`judgeName` text,
	`opposingParty` text,
	`opposingLawyer` text,
	`entryDate` text NOT NULL,
	`conclusionDate` text,
	`lastMovementDate` text,
	`status` text DEFAULT 'em andamento' NOT NULL,
	`isArchived` integer DEFAULT 0,
	`priority` text DEFAULT 'normal',
	`tags` text,
	`caseValue` real,
	`awardedValue` real,
	`attorneyFeesValue` real,
	`rpvValue` real,
	`rpvReceived` integer DEFAULT 0,
	`rpvReceivedDate` text,
	`observations` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`clientId`) REFERENCES `legal_clients`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actionTypeId`) REFERENCES `action_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `legal_processes_processNumber_unique` ON `legal_processes` (`processNumber`);--> statement-breakpoint
CREATE INDEX `idx_processes_user_id` ON `legal_processes` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_processes_client_id` ON `legal_processes` (`clientId`);--> statement-breakpoint
CREATE INDEX `idx_processes_number` ON `legal_processes` (`processNumber`);--> statement-breakpoint
CREATE INDEX `idx_processes_status` ON `legal_processes` (`status`);--> statement-breakpoint
CREATE INDEX `idx_processes_category` ON `legal_processes` (`category`);--> statement-breakpoint
CREATE TABLE `legal_references` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`referenceType` text NOT NULL,
	`title` text NOT NULL,
	`court` text,
	`number` text,
	`summary` text,
	`fullText` text,
	`decisionDate` text,
	`keywords` text,
	`category` text,
	`embedding` text,
	`sourceUrl` text,
	`sourceFilePath` text,
	`relevanceScore` real,
	`usageCount` integer DEFAULT 0,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_references_type` ON `legal_references` (`referenceType`);--> statement-breakpoint
CREATE INDEX `idx_references_court` ON `legal_references` (`court`);--> statement-breakpoint
CREATE INDEX `idx_references_category` ON `legal_references` (`category`);--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`token` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`used` integer DEFAULT 0,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `password_reset_tokens_token_unique` ON `password_reset_tokens` (`token`);--> statement-breakpoint
CREATE INDEX `idx_password_tokens_token` ON `password_reset_tokens` (`token`);--> statement-breakpoint
CREATE TABLE `petition_templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`documentType` text NOT NULL,
	`templateContent` text NOT NULL,
	`description` text,
	`jurisdiction` text,
	`courtType` text,
	`isActive` integer DEFAULT 1,
	`usageCount` integer DEFAULT 0,
	`createdByUserId` integer,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_templates_category` ON `petition_templates` (`category`);--> statement-breakpoint
CREATE INDEX `idx_templates_type` ON `petition_templates` (`documentType`);--> statement-breakpoint
CREATE TABLE `postits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`color` text DEFAULT '#fef3c7',
	`category` text,
	`priority` text DEFAULT 'media',
	`alarmDate` text,
	`alarmTime` text,
	`notify` integer DEFAULT 0,
	`positionX` integer DEFAULT 0,
	`positionY` integer DEFAULT 0,
	`tags` text,
	`isCompleted` integer DEFAULT 0,
	`isArchived` integer DEFAULT 0,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_postits_user_id` ON `postits` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_postits_alarm` ON `postits` (`alarmDate`,`alarmTime`);--> statement-breakpoint
CREATE INDEX `idx_postits_priority` ON `postits` (`priority`);--> statement-breakpoint
CREATE TABLE `process_movements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`processId` integer NOT NULL,
	`movementType` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`movementDate` text NOT NULL,
	`registeredDate` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`result` text,
	`value` real,
	`requiresAction` integer DEFAULT 0,
	`actionDeadline` text,
	`createdByUserId` integer,
	`notes` text,
	`courtDecisionFile` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`processId`) REFERENCES `legal_processes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_movements_process_id` ON `process_movements` (`processId`);--> statement-breakpoint
CREATE INDEX `idx_movements_date` ON `process_movements` (`movementDate`);--> statement-breakpoint
CREATE TABLE `security_card_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`positionsRequested` text NOT NULL,
	`success` integer NOT NULL,
	`ipAddress` text,
	`attemptedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_security_card_attempts_user_id` ON `security_card_attempts` (`userId`);--> statement-breakpoint
CREATE TABLE `security_cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`cardData` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_security_cards_user_id` ON `security_cards` (`userId`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` integer NOT NULL,
	`token` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `idx_sessions_user_id` ON `sessions` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_sessions_token` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `system_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`type` text DEFAULT 'string',
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`userId` integer PRIMARY KEY NOT NULL,
	`theme` text DEFAULT 'auto',
	`language` text DEFAULT 'pt-BR',
	`compactMode` integer DEFAULT 0,
	`notificationsPush` integer DEFAULT 1,
	`notificationsEmail` integer DEFAULT 1,
	`notificationsSound` integer DEFAULT 1,
	`chatModelDefault` text DEFAULT 'gpt-4',
	`chatTemperature` real DEFAULT 0.7,
	`chatAutoScroll` integer DEFAULT 1,
	`chatTts` integer DEFAULT 0,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `agents`;--> statement-breakpoint
DROP TABLE `passwordResetTokens`;--> statement-breakpoint
ALTER TABLE `appointments` ADD `startDate` text;--> statement-breakpoint
ALTER TABLE `appointments` ADD `endDate` text;--> statement-breakpoint
ALTER TABLE `appointments` ADD `location` text;--> statement-breakpoint
ALTER TABLE `appointments` ADD `type` text DEFAULT 'other';--> statement-breakpoint
ALTER TABLE `appointments` ADD `reminderMinutes` integer;--> statement-breakpoint
ALTER TABLE `appointments` ADD `recurrenceRule` text;--> statement-breakpoint
ALTER TABLE `appointments` ADD `participants` text;--> statement-breakpoint
ALTER TABLE `appointments` ADD `isCompleted` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `appointments` ADD `updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_events_user_id` ON `appointments` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_events_customer_id` ON `appointments` (`customerId`);--> statement-breakpoint
CREATE INDEX `idx_events_start_date` ON `appointments` (`startTime`);--> statement-breakpoint
ALTER TABLE `conversations` ADD `model` text;--> statement-breakpoint
ALTER TABLE `conversations` ADD `isFavorite` integer DEFAULT 0;--> statement-breakpoint
CREATE INDEX `idx_conversations_user_id` ON `conversations` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_conversations_updated_at` ON `conversations` (`updatedAt`);--> statement-breakpoint
ALTER TABLE `conversations` DROP COLUMN `favorite`;--> statement-breakpoint
ALTER TABLE `customers` ADD `cpf` text;--> statement-breakpoint
ALTER TABLE `customers` ADD `birthDate` text;--> statement-breakpoint
ALTER TABLE `customers` ADD `company` text;--> statement-breakpoint
ALTER TABLE `customers` ADD `position` text;--> statement-breakpoint
ALTER TABLE `customers` ADD `addressStreet` text;--> statement-breakpoint
ALTER TABLE `customers` ADD `addressNumber` text;--> statement-breakpoint
ALTER TABLE `customers` ADD `addressCity` text;--> statement-breakpoint
ALTER TABLE `customers` ADD `addressState` text;--> statement-breakpoint
ALTER TABLE `customers` ADD `addressZipcode` text;--> statement-breakpoint
ALTER TABLE `customers` ADD `tags` text;--> statement-breakpoint
ALTER TABLE `customers` ADD `status` text DEFAULT 'active';--> statement-breakpoint
CREATE INDEX `idx_customers_user_id` ON `customers` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_customers_status` ON `customers` (`status`);--> statement-breakpoint
CREATE INDEX `idx_customers_email` ON `customers` (`email`);--> statement-breakpoint
ALTER TABLE `customers` DROP COLUMN `document`;--> statement-breakpoint
ALTER TABLE `documentChunks` ADD `chunkIndex` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_chunks_document_id` ON `documentChunks` (`documentId`);--> statement-breakpoint
ALTER TABLE `documents` ADD `folderId` integer REFERENCES folders(id);--> statement-breakpoint
ALTER TABLE `documents` ADD `filename` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `filePath` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `isIndexed` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `documents` ADD `tags` text;--> statement-breakpoint
CREATE INDEX `idx_documents_user_id` ON `documents` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_documents_folder_id` ON `documents` (`folderId`);--> statement-breakpoint
CREATE INDEX `idx_documents_status` ON `documents` (`status`);--> statement-breakpoint
ALTER TABLE `messages` ADD `tokensUsed` integer;--> statement-breakpoint
ALTER TABLE `messages` ADD `attachments` text;--> statement-breakpoint
CREATE INDEX `idx_messages_conversation_id` ON `messages` (`conversationId`);--> statement-breakpoint
CREATE INDEX `idx_messages_created_at` ON `messages` (`createdAt`);--> statement-breakpoint
ALTER TABLE `messages` DROP COLUMN `tokens`;--> statement-breakpoint
ALTER TABLE `notes` ADD `title` text;--> statement-breakpoint
ALTER TABLE `notes` ADD `priority` text DEFAULT 'medium';--> statement-breakpoint
ALTER TABLE `notes` ADD `alarmDate` text;--> statement-breakpoint
ALTER TABLE `notes` ADD `alarmTime` text;--> statement-breakpoint
ALTER TABLE `notes` ADD `notify` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `notes` ADD `tags` text;--> statement-breakpoint
ALTER TABLE `notes` ADD `isCompleted` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `notes` ADD `updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_notes_user_id` ON `notes` (`userId`);--> statement-breakpoint
ALTER TABLE `userSettings` ADD `currentModule` text DEFAULT 'GENERAL';--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` integer DEFAULT 1;--> statement-breakpoint
CREATE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);