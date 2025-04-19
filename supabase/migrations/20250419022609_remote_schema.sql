

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."survey_responses" (
    "XID" bigint,
    "SampleGroup" "text",
    "START_APPLE_DEVICE" "text",
    "RVID_RVid" "text",
    "RVID_isNew" "text",
    "RVID_Score" "text",
    "RVID_GeoIP" "text",
    "RVID_Country" "text",
    "RVID_OldId" "text",
    "RVID_OldIDDate" "text",
    "RVID_Domain" "text",
    "RVID_FraudProfileScore" "text",
    "RVID_FPF1" "text",
    "RVID_FPF2" "text",
    "RVID_FPF3" "text",
    "RVID_FPF4" "text",
    "RVID_FPF5" "text",
    "RVID_FPF6" "text",
    "RVID_FPF7" "text",
    "RVID_FPF8" "text",
    "RVID_FPF9" "text",
    "RVID_RVIDHash2" "text",
    "RVID_isMobile" "text",
    "RVID_FPF10" "text",
    "RVID_FPF11" "text",
    "RVID_FPF12" "text",
    "RVID_FPF13" "text",
    "RVID_FPF14" "text",
    "RVID_FraudFlagCount" "text",
    "Q100" "text",
    "HQ101" "text",
    "Q105" "text",
    "Q105_4_Other" "text",
    "GENDER_GROUP" "text",
    "GENDER_FOR_SAMPLE_SPLIT" "text",
    "Q111" "text",
    "Q112" "text",
    "Q113" "text",
    "Q114" "text",
    "HQ115" "text",
    "Q120" "text",
    "Q122_1" "text",
    "Q122_2" "text",
    "Q122_3" "text",
    "Q122_4" "text",
    "Q125_1" "text",
    "Q125_2" "text",
    "Q125_3" "text",
    "Q125_4" "text",
    "Q125_5" "text",
    "Q125_6" "text",
    "Q125_6_Other" "text",
    "HQ130" "text",
    "ETHNICITY" "text",
    "QUOTA_CHECK" "text",
    "SAMPLE_SPLIT" "text",
    "QUESTIONS_1" "text",
    "QUESTIONS_2" "text",
    "QUESTIONS_3" "text",
    "QUESTIONS_4" "text",
    "QUESTIONS_5" "text",
    "QUESTIONS_6" "text",
    "QUESTIONS_7" "text",
    "QUESTIONS_8" "text",
    "QUESTIONS_9" "text",
    "QUESTIONS_10" "text",
    "QUESTIONS_11" "text",
    "QUESTIONS_12" "text",
    "Q200" "text",
    "Q205" "text",
    "Q210" "text",
    "HQ211" "text",
    "Q230_1" "text",
    "Q230_2" "text",
    "Q240" "text",
    "Q245" "text",
    "Q260_A" "text",
    "Q260_B" "text",
    "Q260_C" "text",
    "Q260_D" "text",
    "Q260_E" "text",
    "Q260_F" "text",
    "Q260_G" "text",
    "Q260_H" "text",
    "Q260_I" "text",
    "Q260_J" "text",
    "Q260_K" "text",
    "Q260_L" "text",
    "Q260_M" "text",
    "Q260_N" "text",
    "Q260_O" "text",
    "Q260_P" "text",
    "Q260_STRAIGHTLINER" "text",
    "Q305_A" "text",
    "Q305_B" "text",
    "Q305_C" "text",
    "Q305_D" "text",
    "Q305_E" "text",
    "Q305_F" "text",
    "Q305_G" "text",
    "Q305_H" "text",
    "Q305_I" "text",
    "Q305_J" "text",
    "Q305_K" "text",
    "Q305_L" "text",
    "Q305_M" "text",
    "Q305_N" "text",
    "Q305_O" "text",
    "Q305_P" "text",
    "Q308" "text",
    "Q310" "text",
    "Q310_PIPE" "text",
    "Q315" "text",
    "Q315_PIPE" "text",
    "Q320" "text",
    "Q405_1" "text",
    "Q405_2" "text",
    "Q405_3" "text",
    "Q405_4" "text",
    "Q405_5" "text",
    "Q405_6" "text",
    "Q405_7" "text",
    "Q405_8" "text",
    "Q405_9" "text",
    "Q405_10" "text",
    "Q405_11" "text",
    "Q405_12" "text",
    "Q405_13" "text",
    "Q408" "text",
    "Q410" "text",
    "Q410_PIPE" "text",
    "Q415" "text",
    "Q415_PIPE" "text",
    "Q420" "text",
    "Q500" "text",
    "Q510" "text",
    "Q510a" "text",
    "Q510_CODE" "text",
    "Q520_1" "text",
    "Q520_2" "text",
    "Q520_3" "text",
    "Q525_1" "text",
    "Q525_2" "text",
    "Q525_3" "text",
    "Q530_A" "text",
    "Q530_B" "text",
    "Q530_C" "text",
    "Q530_D" "text",
    "Q530_E" "text",
    "Q530_F" "text",
    "Q530_G" "text",
    "Q530_H" "text",
    "Q530_I" "text",
    "Q530_J" "text",
    "Q540_A" "text",
    "Q540_B" "text",
    "Q540_C" "text",
    "Q540_D" "text",
    "Q540_E" "text",
    "Q540_F" "text",
    "Q540_G" "text",
    "Q540_H" "text",
    "Q540_I" "text",
    "Q600" "text",
    "Q605" "text",
    "Q610_A" "text",
    "Q610_B" "text",
    "Q610_C" "text",
    "Q610_D" "text",
    "Q610_E" "text",
    "Q610_STRAIGHTLINER" "text",
    "Q620" "text",
    "Q625_A" "text",
    "Q625_B" "text",
    "Q625_C" "text",
    "Q625_D" "text",
    "Q625_E" "text",
    "Q625_F" "text",
    "Q625_G" "text",
    "Q625_H" "text",
    "Q630" "text",
    "Q635" "text",
    "Q640_A" "text",
    "Q640_B" "text",
    "Q640_C" "text",
    "Q640_D" "text",
    "Q640_E" "text",
    "Q640_F" "text",
    "Q640_STRAIGHTLINER" "text",
    "Q645" "text",
    "Q650" "text",
    "Q655" "text",
    "Q660_A" "text",
    "Q660_B" "text",
    "Q660_C" "text",
    "Q660_D" "text",
    "Q660_E" "text",
    "Q660_F" "text",
    "Q660_G" "text",
    "Q660_H" "text",
    "Q660_I" "text",
    "Q660_STRAIGHTLINER" "text",
    "Q665" "text",
    "Q700" "text",
    "Q710_1_A" "text",
    "Q710_1_B" "text",
    "Q710_1_C" "text",
    "Q710_1_D" "text",
    "Q710_1_E" "text",
    "Q710_1_F" "text",
    "Q710_1_G" "text",
    "Q710_1_H" "text",
    "Q710_1_I" "text",
    "Q710_1_J" "text",
    "Q710_1_K" "text",
    "Q710_1_L" "text",
    "Q710_1_M" "text",
    "Q710_1_N" "text",
    "Q710_1_O" "text",
    "Q710_1_P" "text",
    "Q710_1_Q" "text",
    "Q710_1_R" "text",
    "Q710_1_S" "text",
    "Q710_1_T" "text",
    "Q710_1_U" "text",
    "Q710_1_V" "text",
    "Q710_1_W" "text",
    "Q710_1_X" "text",
    "Q710_2_A" "text",
    "Q710_2_B" "text",
    "Q710_2_C" "text",
    "Q710_2_D" "text",
    "Q710_2_E" "text",
    "Q710_2_F" "text",
    "Q710_2_G" "text",
    "Q710_2_H" "text",
    "Q710_2_I" "text",
    "Q710_2_J" "text",
    "Q710_2_K" "text",
    "Q710_2_L" "text",
    "Q710_2_M" "text",
    "Q710_2_N" "text",
    "Q710_2_O" "text",
    "Q710_2_P" "text",
    "Q710_2_Q" "text",
    "Q710_2_R" "text",
    "Q710_2_S" "text",
    "Q710_2_T" "text",
    "Q710_2_U" "text",
    "Q710_2_V" "text",
    "Q710_2_W" "text",
    "Q710_2_X" "text",
    "Q710_3_A" "text",
    "Q710_3_B" "text",
    "Q710_3_C" "text",
    "Q710_3_D" "text",
    "Q710_3_E" "text",
    "Q710_3_F" "text",
    "Q710_3_G" "text",
    "Q710_3_H" "text",
    "Q710_3_I" "text",
    "Q710_3_J" "text",
    "Q710_3_K" "text",
    "Q710_3_L" "text",
    "Q710_3_M" "text",
    "Q710_3_N" "text",
    "Q710_3_O" "text",
    "Q710_3_P" "text",
    "Q710_3_Q" "text",
    "Q710_3_R" "text",
    "Q710_3_S" "text",
    "Q710_3_T" "text",
    "Q710_3_U" "text",
    "Q710_3_V" "text",
    "Q710_3_W" "text",
    "Q710_3_X" "text",
    "Q800" "text",
    "Q810" "text",
    "Q815" "text",
    "Q900" "text",
    "HQ901" "text",
    "Q905" "text",
    "Q915" "text",
    "Q918" "text",
    "Q920" "text",
    "Q925" "text",
    "Q930" "text",
    "Q935" "text",
    "Q940" "text",
    "Q945" "text",
    "Q987" "text",
    "Q950" "text",
    "Q955" "text",
    "Q975" "text",
    "Q995" "text",
    "Q980" "text",
    "Q980_4_Other" "text",
    "Q985" "text",
    "Q990" "text",
    "Terminate_Location" "text",
    "Unique_ID" "text",
    "START_TIME_UTC" "text",
    "END_TIME_UTC" "text",
    "LIST_ID" "text",
    "REENTRY" "text",
    "Duration_SEC" "text",
    "Language" "text",
    "AdjustedDuration_SEC" "text",
    "Last_Activity_Time_UTC" "text",
    "UAS_START" "text",
    "Start_Browser_Type_Version" "text",
    "Start_OS_Version" "text",
    "UAS_End" "text",
    "End_Browser_Type_Version" "text",
    "End_OS_Version" "text",
    "uuid" "text",
    "date" "text",
    "markers" "text",
    "status" "text",
    "qLiveTrack" "text",
    "qWave" "text",
    "QDevice" "text",
    "hSurveyState" "text",
    "hHashx2r1" "text",
    "hHashx2r2" "text",
    "hHashx2r3" "text",
    "HQ113" "text",
    "hQualifiedCellr1" "text",
    "hQualifiedCellr2" "text",
    "hQualifiedCellr3" "text",
    "hQualifiedCellr4" "text",
    "hQualifiedCellr5" "text",
    "hQualifiedCellr6" "text",
    "hQualifiedCellr7" "text",
    "hQualifiedCellr8" "text",
    "hQualifiedCellr9" "text",
    "hQualifiedCellr10" "text",
    "hQualifiedCellr11" "text",
    "hQualifiedCellr12" "text",
    "hQualifiedCellr13" "text",
    "hQualifiedCellr14" "text",
    "hQualifiedCellr15" "text",
    "hQualifiedCellr16" "text",
    "hPickedCell" "text",
    "hCell" "text",
    "pipe_PipeQ308" "text",
    "pipe_PipeQ310" "text",
    "pipe_PipeQ315" "text",
    "pipe_PipeQ410" "text",
    "pipe_PipeQ415" "text",
    "hLineupOrderr1" "text",
    "hLineupOrderr2" "text",
    "hLineupOrderr3" "text",
    "HQ510" "text",
    "Q980r4oe" "text",
    "hQCFlagsr1" "text",
    "hQCFlagsr2" "text",
    "hQCFlagsr3" "text",
    "hQCFlagsr4" "text",
    "hQCFlags_Count" "text",
    "vlist" "text",
    "qtime" "text",
    "vos" "text",
    "vosr15oe" "text",
    "vbrowser" "text",
    "vbrowserr15oe" "text",
    "vmobiledevice" "text",
    "vmobileos" "text",
    "start_date" "text",
    "vdropout" "text",
    "source" "text",
    "ipAddress" "text",
    "decLang" "text",
    "list" "text",
    "userAgent" "text",
    "fp_etag" "text",
    "fp_html5" "text",
    "fp_flash" "text",
    "fp_browser" "text",
    "dcua" "text",
    "url" "text",
    "session" "text",
    "VeridataID" "text",
    "Region_NEW" "text",
    "Area_NEW" "text",
    "Neighborhood_New" "text",
    "HL_WEIGHT" "text",
    "TOTAL_WEIGHT" "text",
    "AAB_WEIGHT" "text"
);


ALTER TABLE "public"."survey_responses" OWNER TO "postgres";




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON TABLE "public"."survey_responses" TO "anon";
GRANT ALL ON TABLE "public"."survey_responses" TO "authenticated";
GRANT ALL ON TABLE "public"."survey_responses" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
