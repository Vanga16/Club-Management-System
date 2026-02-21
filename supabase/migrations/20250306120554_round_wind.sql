/*
  # Club Management System Schema

  1. New Tables
    - `members`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `role` (text)
      - `join_date` (timestamptz)
      - `status` (text)
      
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (timestamptz)
      - `location` (text)
      - `created_by` (uuid, references auth.users)
      
    - `announcements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `created_at` (timestamptz)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member',
  join_date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all members"
  ON members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own record"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own record"
  ON members FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  location text NOT NULL,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own announcements"
  ON announcements FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own announcements"
  ON announcements FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);