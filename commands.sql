CREATE TABLE blogs (
	id SERIAL PRIMARY KEY,
	author text,
	url text NOT NULL,
	title text NOT NULL,
	likes int NOT NULL DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES ('J.K.Rowling', 'https://www.wizardingworld.com/blogs/420', 'Pottermania', 420);

INSERT INTO blogs (url, title)
VALUES ('https://www.yle.fi/blogs/69', 'Päiväni Murmelina');