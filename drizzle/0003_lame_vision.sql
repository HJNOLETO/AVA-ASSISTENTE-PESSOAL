ALTER TABLE `documentChunks` ADD `embeddingProvider` text;--> statement-breakpoint
ALTER TABLE `documentChunks` ADD `embeddingModel` text;--> statement-breakpoint
ALTER TABLE `documentChunks` ADD `embeddingDimensions` integer;--> statement-breakpoint
CREATE INDEX `idx_chunks_document_chunk` ON `documentChunks` (`documentId`,`chunkIndex`);--> statement-breakpoint
ALTER TABLE `documents` ADD `externalId` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `version` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `sourceType` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `legalStatus` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `effectiveDate` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `expiryDate` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `supersededById` integer REFERENCES documents(id);--> statement-breakpoint
ALTER TABLE `documents` ADD `totalChunks` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `documents` ADD `indexedChunks` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `documents` ADD `estimatedSizeKB` integer;--> statement-breakpoint
ALTER TABLE `documents` ADD `pageCount` integer;--> statement-breakpoint
ALTER TABLE `documents` ADD `lastAccessedAt` integer;--> statement-breakpoint
ALTER TABLE `documents` ADD `retentionDays` integer;--> statement-breakpoint
ALTER TABLE `documents` ADD `embeddingProvider` text;--> statement-breakpoint
ALTER TABLE `documents` ADD `embeddingModel` text;--> statement-breakpoint
CREATE INDEX `idx_documents_external_id` ON `documents` (`externalId`);