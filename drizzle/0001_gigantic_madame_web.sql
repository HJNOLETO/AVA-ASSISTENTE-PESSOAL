PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_legal_clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`name` text NOT NULL,
	`cpf` text,
	`rg` text,
	`birthDate` text,
	`maritalStatus` text,
	`email` text,
	`phone` text,
	`phoneSecondary` text,
	`addressStreet` text,
	`addressNumber` text,
	`addressComplement` text,
	`addressNeighborhood` text,
	`addressCity` text,
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
INSERT INTO `__new_legal_clients`("id", "userId", "name", "cpf", "rg", "birthDate", "maritalStatus", "email", "phone", "phoneSecondary", "addressStreet", "addressNumber", "addressComplement", "addressNeighborhood", "addressCity", "addressState", "addressZipcode", "occupation", "company", "monthlyIncome", "dependents", "status", "notes", "tags", "createdAt", "updatedAt") SELECT "id", "userId", "name", "cpf", "rg", "birthDate", "maritalStatus", "email", "phone", "phoneSecondary", "addressStreet", "addressNumber", "addressComplement", "addressNeighborhood", "addressCity", "addressState", "addressZipcode", "occupation", "company", "monthlyIncome", "dependents", "status", "notes", "tags", "createdAt", "updatedAt" FROM `legal_clients`;--> statement-breakpoint
DROP TABLE `legal_clients`;--> statement-breakpoint
ALTER TABLE `__new_legal_clients` RENAME TO `legal_clients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `legal_clients_cpf_unique` ON `legal_clients` (`cpf`);--> statement-breakpoint
CREATE INDEX `idx_legal_clients_user_id` ON `legal_clients` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_legal_clients_cpf` ON `legal_clients` (`cpf`);--> statement-breakpoint
CREATE INDEX `idx_legal_clients_city` ON `legal_clients` (`addressCity`);--> statement-breakpoint
CREATE INDEX `idx_legal_clients_status` ON `legal_clients` (`status`);