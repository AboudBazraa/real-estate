# Property Management System

This module provides a complete property management system for real estate agents, allowing them to perform CRUD operations on properties with Supabase integration.

## Features

- **Property Listings**: View, filter, and search properties in the agent dashboard
- **Add New Properties**: Multi-step form for adding detailed property information
- **Edit Properties**: Modify property details and manage property images
- **Delete Properties**: Remove properties from your listings
- **Image Management**: Upload, view, and manage multiple property images
- **Real-time Updates**: Changes to properties are reflected in real-time

## Database Structure

The system uses the following Supabase tables:

### properties

Contains the main property data:

- id (PK)
- title
- description
- price
- property_type
- address
- city
- state
- zip_code
- country
- latitude
- longitude
- bedrooms
- bathrooms
- area
- lot_size
- year_built
- status
- listing_type
- featured
- created_at
- updated_at

### property_images

Stores images related to properties:

- id (PK)
- property_id (FK to properties.id)
- image_url
- is_primary
- display_order
- created_at

### property_favorites (optional)

Tracks user favorites:

- id (PK)
- property_id (FK to properties.id)
- user_id
- is_favorite
- created_at

## Components

- `/agent/agentProperties/page.jsx`: Main property listing page with filtering
- `/agent/addNewProp/page.tsx`: Multi-step form for adding new properties
- `/agent/components/PropertyCard.jsx`: Card component for displaying property information
- `/agent/components/PropertyDetailsModal.jsx`: Modal for viewing detailed property information
- `/agent/components/PropertyEditForm.jsx`: Form for editing existing properties
- `/agent/components/DeleteConfirmationModal.jsx`: Confirmation modal for property deletion

## Usage

### Viewing Properties

Navigate to the `/agent/agentProperties` page to view all properties. You can filter by type, status, and search by title or location.

### Adding a New Property

1. Navigate to `/agent/addNewProp`
2. Fill out the multi-step form with property details
3. Upload images in the Media & Documents step
4. Submit the form to create a new property

### Editing Properties

1. Click the "Edit" option on any property card
2. Update the property details in the form
3. Manage images (add new ones or remove existing ones)
4. Save your changes

### Image Management

- When adding or editing properties, you can upload multiple images
- Set a primary image that will be shown in the property card
- Delete images as needed

## Implementation Details

- Uses Supabase for database and storage
- Real-time updates using Supabase client
- Role-based authentication ensures only authorized users can manage properties
- Responsive design works on all device sizes

## Setup

1. Ensure you have Supabase set up with the required tables
2. Create a storage bucket named 'properties' in Supabase
3. Ensure the appropriate RLS policies are in place
4. Configure environment variables for Supabase connection

## Supabase Setup

This property management system requires proper setup in Supabase. Follow these steps:

### 1. Create Required Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  property_type TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  location TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  area NUMERIC DEFAULT 0,
  lot_size NUMERIC DEFAULT 0,
  year_built TEXT,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('Sale', 'Rent')),
  status TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property favorites table (optional)
CREATE TABLE IF NOT EXISTS property_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, user_id)
);
```

### 2. Set Up Row-Level Security (RLS)

Enable RLS on all tables and add appropriate policies:

```sql
-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_favorites ENABLE ROW LEVEL SECURITY;

-- Properties table policies
CREATE POLICY "Properties are viewable by everyone"
ON properties FOR SELECT USING (true);

CREATE POLICY "Users can insert their own properties"
ON properties FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
ON properties FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties"
ON properties FOR DELETE USING (auth.uid() = user_id);

-- Property images policies
CREATE POLICY "Property images are viewable by everyone"
ON property_images FOR SELECT USING (true);

CREATE POLICY "Users can insert images for their properties"
ON property_images FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM properties
    WHERE id = property_images.property_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update images for their properties"
ON property_images FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE id = property_images.property_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete images for their properties"
ON property_images FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE id = property_images.property_id AND user_id = auth.uid()
  )
);

-- Property favorites policies
CREATE POLICY "Users can view their own favorites"
ON property_favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
ON property_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
ON property_favorites FOR DELETE USING (auth.uid() = user_id);
```

### 3. Set Up Storage Bucket

1. Create a bucket called "properties" in Supabase Storage
2. Set up the following RLS policies for the storage bucket:

```sql
-- Create a policy that allows authenticated users to upload files to their own folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  (bucket_id = 'properties') AND
  (storage.foldername(name) = auth.uid()::text OR
   storage.foldername(name) LIKE auth.uid()::text || '/%')
);

-- Create a policy that allows users to update files in their own folder
CREATE POLICY "Users can update files in their own folder"
ON storage.objects FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  (bucket_id = 'properties') AND
  (storage.foldername(name) = auth.uid()::text OR
   storage.foldername(name) LIKE auth.uid()::text || '/%')
);

-- Create a policy that allows users to delete files in their own folder
CREATE POLICY "Users can delete files in their own folder"
ON storage.objects FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  (bucket_id = 'properties') AND
  (storage.foldername(name) = auth.uid()::text OR
   storage.foldername(name) LIKE auth.uid()::text || '/%')
);

-- Create a policy that makes files publicly readable
CREATE POLICY "Files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'properties');
```

### 4. Configure Environment Variables

Make sure your `.env.local` file contains the correct Supabase URL and anon key:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
