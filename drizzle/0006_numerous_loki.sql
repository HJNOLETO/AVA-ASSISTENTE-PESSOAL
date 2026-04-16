DROP INDEX `idx_events_user_id`;--> statement-breakpoint
DROP INDEX `idx_events_customer_id`;--> statement-breakpoint
DROP INDEX `idx_events_start_date`;--> statement-breakpoint
CREATE INDEX `idx_appointments_user_id` ON `appointments` (`userId`);--> statement-breakpoint
CREATE INDEX `idx_appointments_customer_id` ON `appointments` (`customerId`);--> statement-breakpoint
CREATE INDEX `idx_appointments_start_date` ON `appointments` (`startTime`);