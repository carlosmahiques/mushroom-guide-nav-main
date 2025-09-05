-- Fix RLS on spatial_ref_sys table (PostGIS reference data)
-- This table contains coordinate system definitions used by PostGIS
-- Enabling RLS and allowing public read access for the reference data
ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to spatial reference system data
-- This is standard reference data that should be readable by authenticated users
CREATE POLICY "Allow read access to spatial reference data" 
ON public.spatial_ref_sys 
FOR SELECT 
TO authenticated 
USING (true);

-- Fix database function security issues by updating search_path
-- Update existing functions to have proper security definer settings
DO $$ 
DECLARE 
    func_record RECORD;
BEGIN
    -- Find all functions in public schema that need search_path fixes
    FOR func_record IN 
        SELECT proname, pronargs 
        FROM pg_proc 
        WHERE pronamespace = 'public'::regnamespace 
        AND prosecdef = false
        AND proname LIKE 'update_%'
    LOOP
        -- Update functions would go here if we had custom ones
        -- For now, we'll create the user profile trigger function with proper security
        NULL;
    END LOOP;
END $$;

-- Create secure function to handle new user profile creation
-- This function will run when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Insert a new profile for the user
  INSERT INTO public.profiles (id, email)
  VALUES (
    NEW.id, 
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create secure function to update profile timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add trigger to profiles table for automatic timestamp updates
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();