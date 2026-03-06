ALTER TABLE `history_entries` MODIFY COLUMN `swingWatchlist` varchar(2000) NOT NULL DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `history_entries` MODIFY COLUMN `swingSetups` varchar(2000) NOT NULL DEFAULT '[]';--> statement-breakpoint
ALTER TABLE `history_entries` MODIFY COLUMN `intradayTrades` varchar(2000) NOT NULL DEFAULT '[]';