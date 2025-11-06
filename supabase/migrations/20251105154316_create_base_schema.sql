/*
  # Create Base Schema

  ## Overview
  This migration creates the foundational tables for the content management system.

  ## New Tables
  
  ### `brand_profiles`
  Stores brand profile information for content generation
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `name` (text) - Brand name
  - `industry` (text) - Industry/niche
  - `tone` (text) - Brand tone
  - `target_audience` (text) - Target audience description
  - `key_values` (text[]) - Key brand values
  - `sample_posts` (text[]) - Sample posts
  - `color_scheme` (jsonb) - Brand colors
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `generated_content`
  Stores AI-generated content
  - `id` (uuid, primary key) - Unique identifier
  - `brand_profile_id` (uuid, foreign key) - Links to brand_profiles
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `description` (text) - Content description
  - `formal_caption` (text) - Formal tone caption
  - `casual_caption` (text) - Casual tone caption
  - `funny_caption` (text) - Funny tone caption
  - `hashtags` (text[]) - Generated hashtags
  - `image_url` (text) - Image URL
  - `resized_images` (jsonb) - Resized image URLs
  - `metadata` (jsonb) - Additional metadata
  - `created_at` (timestamptz) - Creation timestamp

  ### `content_templates`
  Stores reusable content templates
  - `id` (uuid, primary key) - Unique identifier
  - `brand_profile_id` (uuid, foreign key) - Links to brand_profiles
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `name` (text) - Template name
  - `description` (text) - Template description
  - `template_type` (text) - Type of template
  - `caption_template` (text) - Caption template
  - `hashtag_groups` (text[]) - Hashtag groups
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - All policies check authentication and ownership
*/

-- Create brand_profiles table
CREATE TABLE IF NOT EXISTS brand_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  industry text DEFAULT '',
  tone text DEFAULT '',
  target_audience text DEFAULT '',
  key_values text[] DEFAULT '{}',
  sample_posts text[] DEFAULT '{}',
  color_scheme jsonb DEFAULT '{"primary": "#000000", "secondary": "#ffffff"}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create generated_content table
CREATE TABLE IF NOT EXISTS generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_profile_id uuid REFERENCES brand_profiles(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  formal_caption text DEFAULT '',
  casual_caption text DEFAULT '',
  funny_caption text DEFAULT '',
  hashtags text[] DEFAULT '{}',
  image_url text DEFAULT '',
  resized_images jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create content_templates table
CREATE TABLE IF NOT EXISTS content_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_profile_id uuid REFERENCES brand_profiles(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  template_type text DEFAULT 'general',
  caption_template text NOT NULL,
  hashtag_groups text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;

-- Policies for brand_profiles
CREATE POLICY "Users can view own brand profiles"
  ON brand_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brand profiles"
  ON brand_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brand profiles"
  ON brand_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own brand profiles"
  ON brand_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for generated_content
CREATE POLICY "Users can view own generated content"
  ON generated_content FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generated content"
  ON generated_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generated content"
  ON generated_content FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own generated content"
  ON generated_content FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for content_templates
CREATE POLICY "Users can view own content templates"
  ON content_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content templates"
  ON content_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content templates"
  ON content_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own content templates"
  ON content_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_brand_profiles_user_id ON brand_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_brand_profile_id ON generated_content(brand_profile_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_user_id ON content_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_brand_profile_id ON content_templates(brand_profile_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_brand_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_content_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_brand_profiles_updated_at_trigger ON brand_profiles;
CREATE TRIGGER update_brand_profiles_updated_at_trigger
  BEFORE UPDATE ON brand_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_profiles_updated_at();

DROP TRIGGER IF EXISTS update_content_templates_updated_at_trigger ON content_templates;
CREATE TRIGGER update_content_templates_updated_at_trigger
  BEFORE UPDATE ON content_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_content_templates_updated_at();