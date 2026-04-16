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
CREATE TABLE `appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`customerId` integer,
	`title` text NOT NULL,
	`description` text,
	`startTime` integer NOT NULL,
	`endTime` integer NOT NULL,
	`startDate` text,
	`endDate` text,
	`location` text,
	`type` text DEFAULT 'other',
	`reminderMinutes` integer,
	`recurrenceRule` text,
	`participants` text,
	`isCompleted` integer DEFAULT 0,
	`status` text DEFAULT 'scheduled',
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_appointments_user_id` ON `appointments` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_appointments_customer_id` ON `appointments` (`customerId`);--> statement-breakpoint
CREATE INDEX `idx_appointments_start_date` ON `appointments` (`startTime`);--> statement-breakpoint
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
CREATE TABLE `conversations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`title` text NOT NULL,
	`mode` text DEFAULT 'ECO' NOT NULL,
	`model` text,
	`isFavorite` integer DEFAULT 0,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_conversations_user_id` ON `conversations` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_conversations_updated_at` ON `conversations` (`updatedAt`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`cpf` text,
	`birthDate` text,
	`company` text,
	`position` text,
	`address` text,
	`addressStreet` text,
	`addressNumber` text,
	`addressCity` text,
	`addressState` text,
	`addressZipcode` text,
	`notes` text,
	`tags` text,
	`status` text DEFAULT 'active',
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_customers_user_id` ON `customers` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_customers_status` ON `customers` (`status`);--> statement-breakpoint
CREATE INDEX `idx_customers_email` ON `customers` (`email`);--> statement-breakpoint
CREATE TABLE `documentChunks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`documentId` integer NOT NULL,
	`chunkIndex` integer DEFAULT 0 NOT NULL,
	`content` text NOT NULL,
	`metadata` text,
	`embedding` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`documentId`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_chunks_document_id` ON `documentChunks` (`documentId`);--> statement-breakpoint
CREATE TABLE `documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`folderId` integer,
	`name` text NOT NULL,
	`filename` text,
	`type` text NOT NULL,
	`size` integer NOT NULL,
	`url` text,
	`filePath` text,
	`status` text DEFAULT 'processing',
	`isIndexed` integer DEFAULT 0,
	`tags` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`folderId`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_documents_user_id` ON `documents` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_documents_folder_id` ON `documents` (`folderId`);--> statement-breakpoint
CREATE INDEX `idx_documents_status` ON `documents` (`status`);--> statement-breakpoint
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
CREATE TABLE `hardwareSnapshots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`cpuUsage` integer NOT NULL,
	`ramUsage` integer NOT NULL,
	`ramAvailable` integer NOT NULL,
	`gpuUsage` integer,
	`gpuVram` integer,
	`mode` text NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
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
CREATE TABLE `memoryEntries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`content` text NOT NULL,
	`keywords` text,
	`embedding` text,
	`type` text DEFAULT 'fact',
	`archived` integer DEFAULT 0,
	`ttl` integer,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`accessedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`conversationId` integer NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`tokensUsed` integer,
	`attachments` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_messages_conversation_id` ON `messages` (`conversationId`);--> statement-breakpoint
CREATE INDEX `idx_messages_created_at` ON `messages` (`createdAt`);--> statement-breakpoint
CREATE TABLE `notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`title` text,
	`content` text NOT NULL,
	`color` text DEFAULT '#ffff88',
	`priority` text DEFAULT 'medium',
	`alarmDate` text,
	`alarmTime` text,
	`notify` integer DEFAULT 0,
	`positionX` integer DEFAULT 0,
	`positionY` integer DEFAULT 0,
	`tags` text,
	`isCompleted` integer DEFAULT 0,
	`archived` integer DEFAULT 0,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_notes_user_id` ON `notes` (`userId`);--> statement-breakpoint
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
CREATE TABLE `proactiveTasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`type` text NOT NULL,
	`schedule` text,
	`status` text DEFAULT 'active' NOT NULL,
	`lastRun` integer,
	`nextRun` integer,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
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
CREATE TABLE `systemLogs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`level` text DEFAULT 'INFO',
	`message` text NOT NULL,
	`metadata` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
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
CREATE TABLE `userSettings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`preferredMode` text DEFAULT 'AUTO' NOT NULL,
	`autoDetectHardware` integer DEFAULT 1 NOT NULL,
	`llmTemperature` integer DEFAULT 70,
	`llmTopP` integer DEFAULT 90,
	`sttLanguage` text DEFAULT 'pt-BR',
	`theme` text DEFAULT 'light',
	`currentModule` text DEFAULT 'GENERAL',
	`profileRole` text DEFAULT 'user',
	`profession` text,
	`expertiseLevel` text DEFAULT 'intermediate',
	`preferredTone` text DEFAULT 'formal',
	`includePiiInContext` integer DEFAULT 0,
	`jurisdiction` text,
	`medicalConsent` integer DEFAULT 0,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `userSettings_userId_unique` ON `userSettings` (`userId`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`avatarUrl` text,
	`phone` text,
	`bio` text,
	`isActive` integer DEFAULT 1,
	`password` text,
	`loginMethod` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`lastSignedIn` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);--> statement-breakpoint
CREATE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);