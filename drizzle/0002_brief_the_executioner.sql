CREATE TABLE `history_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(10) NOT NULL,
	`weekRange` varchar(64),
	`swingWatchlist` varchar(2000) NOT NULL DEFAULT '[]',
	`swingSetups` varchar(2000) NOT NULL DEFAULT '[]',
	`intradayTrades` varchar(2000) NOT NULL DEFAULT '[]',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `history_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `history_entries_date_unique` UNIQUE(`date`)
);
