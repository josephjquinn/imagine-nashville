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
   * Fetches all survey responses (useful for larger datasets)
   * @param batchSize Size of each batch to fetch (default: 1000)
   * @param orderBy Field to order by (default: 'date')
   * @param ascending Sort order (default: false = descending)
   * @returns Promise containing all survey responses
   */
  async getAllSurveyResponses(batchSize: number = 1000, orderBy: string = 'date', ascending: boolean = false) {
    try {
      let allData: SurveyResponse[] = [];
      let hasMore = true;
      let currentPage = 0;
      
      // First get the total count
      const { count } = await supabase
        .from('survey_responses')
        .select('*', { count: 'exact', head: true });
      
      const totalRows = count || 0;
      const totalBatches = Math.ceil(totalRows / batchSize);
      
      while (currentPage < totalBatches) {
        const start = currentPage * batchSize;
        const end = start + batchSize - 1;
        
        const { data, error } = await supabase
          .from('survey_responses')
          .select('*')
          .range(start, end)
          .order(orderBy, { ascending });
          
        if (error) {
          throw new Error(`Error fetching survey responses: ${error.message}`);
        }
        
        if (data && data.length > 0) {
          allData = [...allData, ...(data as SurveyResponse[])];
          currentPage++;
        } else {
          hasMore = false;
          break;
        }
      }
      
      return allData;
    } catch (error) {
      console.error('Error in getAllSurveyResponses:', error);
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
   * Fetches survey responses with optional filters and pagination
   * @param filters Object containing filter criteria
   * @param page The page number (1-based)
   * @param pageSize Number of items per page
   * @param orderBy Field to order by
   * @param ascending Sort order
   * @returns Promise containing filtered survey responses and total count
   */
  async getFilteredSurveyResponses(
    filters: Record<string, any> = {}, 
    page: number = 1, 
    pageSize: number = 100,
    orderBy: string = 'date',
    ascending: boolean = false
  ) {
    try {
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      
      let query = supabase
        .from('survey_responses')
        .select('*', { count: 'exact' });

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
      
      // Apply pagination and ordering
      const { data, error, count } = await query
        .range(start, end)
        .order(orderBy, { ascending });

      if (error) {
        if (error.code === 'PGRST301') {
          throw new Error('Authentication error. Please check your Supabase credentials.');
        }
        throw new Error(`Error fetching filtered survey responses: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from the server');
      }

      return {
        data: data as SurveyResponse[],
        total: count || 0,
      };
    } catch (error) {
      console.error('Error in getFilteredSurveyResponses:', error);
      throw error;
    }
  },
}; 