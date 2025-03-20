# User Management Dashboard

This directory contains components and utilities for managing users in the real estate application using Supabase as the backend.

## Features

- View all users with filtering and searching capabilities
- Update user roles (Admin, Agent, User, Guest)
- Delete users (Admin only)

## Components

- `page.jsx`: Main page component that displays all users and filtering options
- `UserActionsDropdown.jsx`: Dropdown menu for user actions (update role, delete)
- `utils/supabaseAdmin.js`: Utility functions for admin operations with Supabase

## Setup Requirements

### Supabase Database Functions

For the user management functionality to work properly, you need to create several stored procedures (functions) in your Supabase project:

1. **Get All Users**

```sql
create or replace function get_all_users()
returns setof json
language plpgsql security definer
as $$
begin
  return query
  select auth.users.*;
end;
$$;
```

2. **Update User Role**

```sql
create or replace function update_user_role(target_user_id uuid, new_role text)
returns json
language plpgsql security definer
as $$
declare
  requesting_user_id uuid;
  requesting_user_role text;
  target_user json;
  updated_user json;
begin
  -- Get the requesting user ID from the JWT
  requesting_user_id := auth.uid();

  -- Check if the requesting user is an admin
  select raw_user_meta_data->>'role' into requesting_user_role
  from auth.users
  where id = requesting_user_id;

  -- Only allow admins to update roles
  if requesting_user_role != 'admin' then
    raise exception 'Only admins can update user roles';
  end if;

  -- Get the target user
  select json_build_object(
    'id', id,
    'email', email,
    'user_metadata', raw_user_meta_data
  ) into target_user
  from auth.users
  where id = target_user_id;

  if target_user is null then
    raise exception 'User not found';
  end if;

  -- Update the user's role
  update auth.users
  set raw_user_meta_data =
    jsonb_set(
      coalesce(raw_user_meta_data, '{}'::jsonb),
      '{role}',
      to_jsonb(new_role)
    )
  where id = target_user_id;

  -- Return the updated user
  select json_build_object(
    'id', id,
    'email', email,
    'user_metadata', raw_user_meta_data
  ) into updated_user
  from auth.users
  where id = target_user_id;

  return updated_user;
end;
$$;
```

3. **Delete User**

```sql
create or replace function delete_user(user_id uuid)
returns boolean
language plpgsql security definer
as $$
begin
  delete from auth.users where id = user_id;
  return true;
exception
  when others then
    return false;
end;
$$;
```

### Security Considerations

- These functions use `security definer`, which means they run with the privileges of the creator
- They include checks to ensure only admin users can perform sensitive operations
- The functions should be created in the SQL editor of your Supabase project

## Usage

1. Navigate to `/admin/userList` in your application (requires admin role)
2. View all users with their roles and status
3. Use the dropdown menu to update roles or delete users
4. Filter users by role or search for specific users

## Role-Based Access Control

Only users with the role of "admin" can:

- View the user management dashboard
- Update other users' roles
- Delete users

## API Reference

### Supabase RPC Calls

- `supabase.rpc('get_all_users')`: Fetches all users
- `supabase.rpc('update_user_role', { target_user_id, new_role })`: Updates a user's role
- `supabase.rpc('delete_user', { user_id })`: Deletes a user
