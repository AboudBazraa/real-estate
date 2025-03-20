import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { createClient } from "@/shared/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import { useEffect } from "react";

/**
 * Custom hook for querying data from Supabase using React Query
 * @param queryKey Unique key for React Query cache
 * @param tableName Name of the Supabase table to query
 * @param options Query options including filters, select, order, etc.
 */
export function useSupabaseQuery<T = any>(
  queryKey: QueryKey,
  tableName: string,
  options: {
    select?: string;
    filters?: { column: string; operator: string; value: any }[];
    order?: { column: string; ascending?: boolean };
    limit?: number;
    eq?: { column: string; value: any }[];
    range?: { from: number; to: number };
    single?: boolean;
    enabled?: boolean;
  } = {}
) {
  const supabase = createClient();

  return useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase.from(tableName).select(options.select || "*");

      // Apply filters
      if (options.filters) {
        options.filters.forEach((filter) => {
          query = query.filter(filter.column, filter.operator, filter.value);
        });
      }

      // Apply equals condition
      if (options.eq) {
        options.eq.forEach((condition) => {
          query = query.eq(condition.column, condition.value);
        });
      }

      // Apply order
      if (options.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending !== false,
        });
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      // Apply range
      if (options.range) {
        query = query.range(options.range.from, options.range.to);
      }

      // Get single row or all matching rows
      const { data, error } = options.single
        ? await query.single()
        : await query;

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: options.enabled !== false,
  });
}

/**
 * Custom hook for mutating data in Supabase using React Query
 * @param queryKey Unique key for React Query cache
 * @param tableName Name of the Supabase table to mutate
 * @param method Mutation method (insert, update, upsert, delete)
 * @param options Additional options like invalidation
 */
export function useSupabaseMutation<TData = any, TVariables = any>(
  queryKey: QueryKey,
  tableName: string,
  method: "insert" | "update" | "upsert" | "delete",
  options: {
    invalidate?: boolean;
    invalidateQueries?: QueryKey[];
    transformResponse?: (data: any) => any;
    optimisticData?: (variables: TVariables, queryClient: any) => unknown;
    onSuccess?: (data: TData, variables: TVariables, context: any) => void;
    onError?: (error: Error, variables: TVariables, context: any) => void;
    selectFromResponse?: string;
  } = {}
) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationKey: queryKey,
    mutationFn: async (variables: TVariables) => {
      let query;

      switch (method) {
        case "insert":
          // For insert, variables can be a single record or array of records
          query = supabase.from(tableName).insert(variables as any);
          break;

        case "update":
          // For update, variables should include 'data' and 'match' properties
          if (
            variables &&
            typeof variables === "object" &&
            "data" in variables &&
            "match" in variables
          ) {
            const { data, match } = variables as { data: any; match: any };
            query = supabase.from(tableName).update(data);

            // Apply match conditions
            if (typeof match === "object") {
              if ("id" in match) {
                query = query.eq("id", match.id);
              } else {
                // Support for multiple match conditions
                Object.entries(match).forEach(([column, value]) => {
                  query = query.eq(column, value);
                });
              }
            } else if (typeof match === "string" || typeof match === "number") {
              // If match is a primitive, assume it's the ID
              query = query.eq("id", match);
            }
          } else {
            throw new Error(
              'Update requires an object with "data" and "match" properties'
            );
          }
          break;

        case "upsert":
          // For upsert, variables is the record to upsert with primary key or unique constraint
          query = supabase.from(tableName).upsert(variables as any);
          break;

        case "delete":
          query = supabase.from(tableName).delete();

          // Enhanced delete conditions
          if (variables) {
            if (typeof variables === "object") {
              if ("id" in (variables as any)) {
                query = query.eq("id", (variables as any).id);
              } else if ("match" in (variables as any)) {
                const match = (variables as any).match;

                // Support for multiple match conditions
                if (match && typeof match === "object") {
                  Object.entries(match).forEach(([column, value]) => {
                    query = query.eq(column, value);
                  });
                }
              } else {
                // Use all properties as match conditions
                Object.entries(variables as object).forEach(
                  ([column, value]) => {
                    query = query.eq(column, value);
                  }
                );
              }
            } else if (
              typeof variables === "string" ||
              typeof variables === "number"
            ) {
              // If variables is a primitive, assume it's the ID
              query = query.eq("id", variables);
            }
          }
          break;

        default:
          throw new Error(`Invalid method: ${method}`);
      }

      // Add select if specified
      if (options.selectFromResponse) {
        query = query.select(options.selectFromResponse);
      } else if (method !== "delete") {
        // For non-delete operations, return the affected rows by default
        query = query.select();
      }

      // Execute the query
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Transform response if needed
      const result = options.transformResponse
        ? options.transformResponse(data)
        : data;

      // Invalidate queries if needed
      if (options.invalidate !== false) {
        if (options.invalidateQueries) {
          options.invalidateQueries.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: key });
          });
        } else {
          // By default, invalidate queries with the same table name
          queryClient.invalidateQueries({ queryKey: [tableName] });
        }
      }

      return result as TData;
    },
    // Add custom callbacks if provided
    ...((options.onSuccess || options.onError) && {
      onSuccess: options.onSuccess,
      onError: options.onError as any,
    }),
    // Add optimistic updates if provided
    ...(options.optimisticData && {
      onMutate: async (variables: TVariables) => {
        // Cancel any outgoing refetches
        await queryClient.cancelQueries({ queryKey: [tableName] });

        // Save the previous value
        const previousData = queryClient.getQueryData([tableName]);

        // Optimistically update the cache
        if (options.optimisticData) {
          queryClient.setQueryData(
            [tableName],
            options.optimisticData(variables, queryClient)
          );
        }

        // Return the context with the previous data
        return { previousData };
      },
      onError: (err: Error, variables: TVariables, context: any) => {
        // Rollback on error
        if (context?.previousData !== undefined) {
          queryClient.setQueryData([tableName], context.previousData);
        }
        // Call user's onError if provided
        if (options.onError) {
          options.onError(err, variables, context);
        }
      },
    }),
  });
}

/**
 * Custom hook for real-time subscriptions with Supabase
 * @param tableName Name of the Supabase table to subscribe to
 * @param options Subscription options (event, filters)
 * @param callback Function to call when data changes
 */
export function useSupabaseSubscription<T = any>(
  tableName: string,
  options: {
    event?: "INSERT" | "UPDATE" | "DELETE" | "*";
    filters?: { column: string; operator: string; value: any }[];
    eq?: { column: string; value: any }[];
  } = {},
  callback: (payload: any) => void
) {
  const supabase = createClient();

  useEffect(() => {
    // Set up the subscription
    let subscription = supabase
      .channel(`table-changes-${tableName}`)
      .on(
        "postgres_changes" as any, // Type assertion to bypass type check
        {
          event: options.event || "*",
          schema: "public",
          table: tableName,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [tableName, options.event, callback, supabase]);
}

/**
 * Custom hook for fetching a single item by ID from Supabase
 * @param tableName Name of the Supabase table
 * @param id ID of the item to fetch
 * @param options Additional query options
 */
export function useSupabaseItem<T = any>(
  tableName: string,
  id: string | number | null,
  options: {
    select?: string;
    enabled?: boolean;
  } = {}
) {
  return useSupabaseQuery<T>([tableName, id], tableName, {
    eq: id ? [{ column: "id", value: id }] : [],
    single: true,
    select: options.select || "*",
    enabled: Boolean(id) && options.enabled !== false,
  });
}

/**
 * Custom hook for fetching a list of items from Supabase
 * @param tableName Name of the Supabase table
 * @param options Query options
 */
export function useSupabaseList<T = any>(
  tableName: string,
  options: {
    select?: string;
    filters?: { column: string; operator: string; value: any }[];
    order?: { column: string; ascending?: boolean };
    limit?: number;
    eq?: { column: string; value: any }[];
    range?: { from: number; to: number };
    enabled?: boolean;
  } = {}
) {
  return useSupabaseQuery<T[]>([tableName, options], tableName, options);
}

/**
 * Custom hook for inserting data into Supabase
 * @param tableName Name of the Supabase table
 * @param options Mutation options
 */
export function useSupabaseInsert<T = any>(
  tableName: string,
  options: {
    invalidate?: boolean;
    invalidateQueries?: QueryKey[];
    transformResponse?: (data: any) => any;
    onSuccess?: (data: T) => void; // Add this line
    onError?: (error: Error) => void; // Add this line
  } = {}
) {
  return useSupabaseMutation<T>(
    [tableName, "insert"],
    tableName,
    "insert",
    options
  );
}

/**
 * Custom hook for updating data in Supabase
 * @param tableName Name of the Supabase table
 * @param options Mutation options
 */
export function useSupabaseUpdate<T = any>(
  tableName: string,
  options: {
    invalidate?: boolean;
    invalidateQueries?: QueryKey[];
    transformResponse?: (data: any) => any;
  } = {}
) {
  return useSupabaseMutation<T>(
    [tableName, "update"],
    tableName,
    "update",
    options
  );
}

/**
 * Custom hook for deleting data from Supabase
 * @param tableName Name of the Supabase table
 * @param options Mutation options
 */
export function useSupabaseDelete(
  tableName: string,
  options: {
    invalidate?: boolean;
    invalidateQueries?: QueryKey[];
  } = {}
) {
  return useSupabaseMutation(
    [tableName, "delete"],
    tableName,
    "delete",
    options
  );
}
