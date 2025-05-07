-- First drop Q113 if it exists in public_survey
ALTER TABLE public_survey DROP COLUMN IF EXISTS "Q113";

-- Rename Q113a to Q113 in public_survey table
ALTER TABLE public_survey RENAME COLUMN "Q113a" TO "Q113";

-- Convert from int8range to int8 by taking the lower bound
ALTER TABLE public_survey ALTER COLUMN "Q113" TYPE int8 USING lower("Q113"::int8range);

-- Drop and recreate Q113 in merged_survey
ALTER TABLE merged_survey DROP COLUMN IF EXISTS "Q113";
ALTER TABLE merged_survey ADD COLUMN "Q113" int8;

