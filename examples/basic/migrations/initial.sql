CREATE TABLE person (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text,
    about text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT person_first_name_check CHECK ((char_length(first_name) < 80)),
    CONSTRAINT person_last_name_check CHECK ((char_length(last_name) < 80))
);

