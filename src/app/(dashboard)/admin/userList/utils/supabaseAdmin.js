/**
 * Supabase Admin Utilities
 * 
 * This file contains utility functions for admin-related operations with Supabase.
 * These functions are specifically designed for use in admin pages and components.
 */

import { createClient } from "@/shared/utils/supabase/client";

/**
 * Fetch all users from Supabase via RPC
 * Requires the get_all_users RPC function to be set up in your Supabase instance
 * 
 * SQL for RPC function:
 * ```sql
 * create or replace function get_all_users()
 * returns setof json
 * language plpgsql security definer
 * as $$
 * begin
 *   return query
 *   select auth.users.*;
 * end;
 * $$;
 * ```
 */
export async function getAllUsers() {
    const supabase = createClient();
    return await supabase.rpc('get_all_users');
}

/**
 * Delete a user by their ID
 * Requires the delete_user RPC function to be set up in your Supabase instance
 * 
 * SQL for RPC function:
 * ```sql
 * create or replace function delete_user(user_id uuid)
 * returns boolean
 * language plpgsql security definer
 * as $$
 * begin
 *   delete from auth.users where id = user_id;
 *   return true;
 * exception
 *   when others then
 *     return false;
 * end;
 * $$;
 * ```
 */
export async function deleteUser(userId) {
    if (!userId) {
        throw new Error('User ID is required');
    }

    const supabase = createClient();
    return await supabase.rpc('delete_user', { user_id: userId });
}

/**
 * Update a user's role
 * This uses the update_user_role RPC function
 * 
 * SQL for RPC function:
 * ```sql
 * create or replace function update_user_role(target_user_id uuid, new_role text)
 * returns json
 * language plpgsql security definer
 * as $$
 * declare
 *   requesting_user_id uuid;
 *   requesting_user_role text;
 *   target_user json;
 *   updated_user json;
 * begin
 *   -- Get the requesting user ID from the JWT
 *   requesting_user_id := auth.uid();
 *   
 *   -- Check if the requesting user is an admin
 *   select raw_user_meta_data->>'role' into requesting_user_role
 *   from auth.users
 *   where id = requesting_user_id;
 *   
 *   -- Only allow admins to update roles
 *   if requesting_user_role != 'admin' then
 *     raise exception 'Only admins can update user roles';
 *   end if;
 *   
 *   -- Get the target user
 *   select json_build_object(
 *     'id', id,
 *     'email', email,
 *     'user_metadata', raw_user_meta_data
 *   ) into target_user
 *   from auth.users
 *   where id = target_user_id;
 *   
 *   if target_user is null then
 *     raise exception 'User not found';
 *   end if;
 *   
 *   -- Update the user's role
 *   update auth.users
 *   set raw_user_meta_data = 
 *     jsonb_set(
 *       coalesce(raw_user_meta_data, '{}'::jsonb),
 *       '{role}',
 *       to_jsonb(new_role)
 *     )
 *   where id = target_user_id;
 *   
 *   -- Return the updated user
 *   select json_build_object(
 *     'id', id,
 *     'email', email,
 *     'user_metadata', raw_user_meta_data
 *   ) into updated_user
 *   from auth.users
 *   where id = target_user_id;
 *   
 *   return updated_user;
 * end;
 * $$;
 * ```
 */
export async function updateUserRole(userId, newRole) {
    if (!userId || !newRole) {
        throw new Error('User ID and new role are required');
    }

    const supabase = createClient();
    return await supabase.rpc('update_user_role', {
        target_user_id: userId,
        new_role: newRole
    });
} 