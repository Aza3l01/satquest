import { supabase } from './supabaseClient';

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
};

export const updateProfile = async (
  userId: string, 
  updates: { display_name?: string; avatar_url?: string }
) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    return { error };
  }

  return { data };
};

export const getProfileByDisplayName = async (displayName: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url')
    .eq('display_name', displayName)
    .single();

  if (error) {
    return null;
  }

  return data;
};