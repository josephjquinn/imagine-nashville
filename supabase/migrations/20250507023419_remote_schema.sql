alter table "public"."formal_survey" alter column "Q100" set data type bigint using "Q100"::bigint;

alter table "public"."public_survey" alter column "Q100" set data type bigint using "Q100"::bigint;


