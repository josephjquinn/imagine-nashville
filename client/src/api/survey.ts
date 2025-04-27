import { supabase } from "../lib/supabase";

export interface SurveyResponse {
  XID: number;
  [key: string]: any;
}

export type SurveyType = 'formal' | 'public' | 'merged';

const getTableName = (type: SurveyType): string => {
  switch (type) {
    case 'formal':
      return 'formal_survey';
    case 'public':
      return 'public_survey';
    case 'merged':
      return 'merged_survey';
    default:
      throw new Error(`Invalid survey type: ${type}`);
  }
};

/**
 * Base survey service that implements common functionality for all survey types
 */
class BaseSurveyService {
  protected tableName: string;

  constructor(type: SurveyType) {
    this.tableName = getTableName(type);
  }

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
        .from(this.tableName)
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
  }

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
      let currentPage = 0;
      
      // First get the total count
      const { count } = await supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });
      
      const totalRows = count || 0;
      const totalBatches = Math.ceil(totalRows / batchSize);
      
      while (currentPage < totalBatches) {
        const start = currentPage * batchSize;
        const end = start + batchSize - 1;
        
        const { data, error } = await supabase
          .from(this.tableName)
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
          break;
        }
      }
      
      return allData;
    } catch (error) {
      console.error('Error in getAllSurveyResponses:', error);
      throw error;
    }
  }

  /**
   * Fetches a single survey response by ID
   * @param id The survey response ID
   * @returns Promise containing the survey response
   */
  async getSurveyResponseById(id: string) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
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
  }

  /**
   * Fetches survey responses with optional filters and pagination
   * @param filters Object containing filter criteria
   * @param batchSize Size of each batch to fetch (default: 1000)
   * @returns Promise containing filtered survey responses and total count
   */
  async getFilteredSurveyResponses(
    filters: Record<string, any> = {}, 
    batchSize: number = 1000
  ) {
    try {
      let allData: SurveyResponse[] = [];
      let currentPage = 0;
      
      // First get the total count with filters
      let countQuery = supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters to count query
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && 'gte' in value && 'lte' in value) {
            countQuery = countQuery.gte(key, value.gte).lte(key, value.lte);
          } else {
            countQuery = countQuery.eq(key, value);
          }
        }
      });

      const { count } = await countQuery;
      
      const totalRows = count || 0;
      const totalBatches = Math.ceil(totalRows / batchSize);
      
      while (currentPage < totalBatches) {
        const start = currentPage * batchSize;
        const end = start + batchSize - 1;
        
        let query = supabase
          .from(this.tableName)
          .select('*')
          .range(start, end);

        // Apply filters to data query
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (typeof value === 'object' && 'gte' in value && 'lte' in value) {
              query = query.gte(key, value.gte).lte(key, value.lte);
            } else {
              query = query.eq(key, value);
            }
          }
        });
        
        const { data, error } = await query;
          
        if (error) {
          throw new Error(`Error fetching filtered survey responses: ${error.message}`);
        }
        
        if (data && data.length > 0) {
          allData = [...allData, ...(data as SurveyResponse[])];
          currentPage++;
        } else {
          break;
        }
      }
      
      return {
        data: allData,
        total: totalRows
      };
    } catch (error) {
      console.error('Error in getFilteredSurveyResponses:', error);
      throw error;
    }
  }
}

/**
 * Factory function to create survey services
 * @param type The type of survey service to create
 * @returns A new instance of the survey service
 */
export const createSurveyService = (type: SurveyType) => {
  return new BaseSurveyService(type);
};

// For backward compatibility
export const FormalSurveyService = createSurveyService('formal');
export const PublicSurveyService = createSurveyService('public');
export const MergedSurveyService = createSurveyService('merged'); 