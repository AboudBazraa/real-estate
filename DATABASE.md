# Property Management Application

A web application that allows users to manage properties, including adding new properties, viewing existing properties, and updating property details. This application uses Supabase as the backend for authentication and data storage.

## Features

- User registration and authentication
- Add new properties
- View existing properties
- Update property details

## Technologies Used

- React.js
- Supabase
- JavaScript
- HTML/CSS

## Database Schema

### Tables

#### 1. Users Table (auth.users)

- **Description**: This table is managed by Supabase and stores user authentication details.
- **Columns**:
  - `id` (uuid): Unique identifier for each user.
  - `email` (text): User's email address.
  - `encrypted_password` (text): Hashed password for user authentication.
  - `created_at` (timestamp): Timestamp of when the user was created.

#### 2. Profiles Table (public.profiles)

- **Description**: This table stores additional user information and links to the `auth.users` table.
- **Columns**:
  - `id` (bigint): Primary key, auto-incremented.
  - `user_id` (uuid): Foreign key referencing `auth.users.id`.
  - `role_id` (bigint): Foreign key referencing `public.roles.id`.
  - `updated_at` (timestamp): Timestamp of when the profile was last updated.

- **Relationships**:
  - **Foreign Key**: `user_id` references `auth.users(id)`.
  - **Foreign Key**: `role_id` references `public.roles(id)`.

#### 3. Properties Table (public.properties)

- **Description**: This table stores property details added by users.
- **Columns**:
  - `id` (bigint): Primary key, auto-incremented.
  - `name` (text): Name of the property.
  - `location` (text): Location of the property.
  - `price` (numeric): Price of the property.
  - `created_at` (timestamp): Timestamp of when the property was added.
  - `user_id` (uuid): Foreign key referencing `auth.users.id` (the user who added the property).

- **Relationships**:
  - **Foreign Key**: `user_id` references `auth.users(id)`.

#### 4. Roles Table (public.roles)

- **Description**: This table stores different user roles.
- **Columns**:
  - `id` (bigint): Primary key, auto-incremented.
  - `role_name` (text): Name of the role (e.g., 'user', 'admin').

### Relationships Overview

- **Users to Profiles**: One-to-One relationship. Each user can have one profile.
- **Users to Properties**: One-to-Many relationship. Each user can add multiple properties.
- **Profiles to Roles**: Many-to-One relationship. Each profile can reference one role.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/property-management-app.git
   cd property-management-app