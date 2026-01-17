CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`author` varchar(255) NOT NULL,
	`authorAvatar` varchar(500),
	`authorCompany` varchar(255),
	`description` text,
	`content` text NOT NULL,
	`tags` text,
	`publishedAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
