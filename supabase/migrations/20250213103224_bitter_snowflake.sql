/*
  # Create messages table and authentication setup

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `text` (text)
      - `created_at` (timestamp)
      - `is_from_server` (boolean)

  2. Security
    - Enable RLS on `messages` table
    - Add policies for authenticated users to:
      - Read their own messages
      - Insert new messages
*/

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  text text not null,
  created_at timestamptz default now(),
  is_from_server boolean default false
);

alter table messages enable row level security;

create policy "Users can read their own messages"
  on messages
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert messages"
  on messages
  for insert
  to authenticated
  with check (auth.uid() = user_id);