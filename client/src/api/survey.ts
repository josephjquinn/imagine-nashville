import { supabase } from "../lib/supabase";

export interface SurveyResponse {
  XID: number;
  date: string;
  GENDER_GROUP: string;
  ETHNICITY: string;
  Region_NEW: string;
  Area_NEW: string;
  Neighborhood_New: string;
  [key: string]: any;
}

export const surveyService = {
  /**
   * Fetches all survey responses with pagination
   * @param page The page number (1-based)
   * @param pageSize Number of items per page
   * @returns Promise containing the survey responses and total count
   */
  async getSurveyResponses(page: number = 1, pageSize: number = 100) {
    try {
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data, error, count } = await supabase
        .from('survey_responses')
        .select('*', { count: 'exact' })
        .range(start, end)
        .order('date', { ascending: false });

      if (error) {
        if (error.code === 'PGRST301') {
          throw new Error('Authentication error. Please check your Supabase credentials.');
        }
        throw new Error(`Error fetching survey responses: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from the server');
      }

      return {
        data: data as SurveyResponse[],
        total: count || 0,
      };
    } catch (error) {
      console.error('Error in getSurveyResponses:', error);
      throw error;
    }
  },

  /**
   * Fetches a single survey response by ID
   * @param id The survey response ID
   * @returns Promise containing the survey response
   */
  async getSurveyResponseById(id: string) {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('XID', id)
        .single();

      if (error) {
        if (error.code === 'PGRST301') {
          throw new Error('Authentication error. Please check your Supabase credentials.');
        }
        throw new Error(`Error fetching survey response: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from the server');
      }

      return data as SurveyResponse;
    } catch (error) {
      console.error('Error in getSurveyResponseById:', error);
      throw error;
    }
  },

  /**
   * Fetches survey responses with optional filters
   * @param filters Object containing filter criteria
   * @returns Promise containing filtered survey responses
   */
  async getFilteredSurveyResponses(filters: Record<string, any>) {
    try {
      let query = supabase.from('survey_responses').select('*');

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query;

      if (error) {
        if (error.code === 'PGRST301') {
          throw new Error('Authentication error. Please check your Supabase credentials.');
        }
        throw new Error(`Error fetching filtered survey responses: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from the server');
      }

      return data as SurveyResponse[];
    } catch (error) {
      console.error('Error in getFilteredSurveyResponses:', error);
      throw error;
    }
  },
}; 