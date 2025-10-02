import { SupabaseClient } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  website?: string;
  avatar_url?: string;
};

const getProfile = async (supabase: SupabaseClient, id: string, email: string): Promise<Profile | null> => {
  const { data, error, status } = await supabase
    .from('profiles')
    .select(`full_name, username, website, avatar_url`)
    .eq('id', id)
    .single();

  if (error && status !== 406) {
    throw error;
  }

  if (data) {
    return {
      id,
      email,
      full_name: data.full_name,
      username: data.username,
      website: data.website,
      avatar_url: data.avatar_url,
    };
  }

  return null;
};

const updateProfile = async (
  supabase: SupabaseClient,
  id: string,
  profile: Omit<Profile, 'id' | 'email'>,
): Promise<void> => {
  const { error } = await supabase.from('profiles').upsert({
    id,
    ...profile,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
};

export { getProfile, updateProfile };
