import { SupabaseClient } from '@supabase/supabase-js';

export type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  author?: {
    full_name?: string;
    email: string;
  };
};

export type PostInput = {
  title: string;
  content: string;
};

const getRecentPosts = async (supabase: SupabaseClient, limit: number = 5): Promise<Post[]> => {
  // Fetch posts
  const { data: postsData, error: postsError } = await supabase
    .from('posts')
    .select('id, title, content, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (postsError) {
    throw postsError;
  }

  if (!postsData || postsData.length === 0) {
    return [];
  }

  // Get unique user IDs
  const userIds = [...new Set(postsData.map((post) => post.user_id))];

  // Fetch user data for authors
  const { data: usersData } = await supabase.auth.admin.listUsers();
  const { data: profilesData } = await supabase.from('profiles').select('id, full_name').in('id', userIds);

  // Combine posts with author information
  const posts: Post[] = postsData.map((post) => {
    const user = usersData?.users.find((u) => u.id === post.user_id);
    const profile = profilesData?.find((p) => p.id === post.user_id);

    return {
      ...post,
      author: user
        ? {
            email: user.email || '',
            full_name: profile?.full_name,
          }
        : undefined,
    };
  });

  return posts;
};

const createPost = async (supabase: SupabaseClient, userId: string, postInput: PostInput): Promise<Post> => {
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        user_id: userId,
        title: postInput.title,
        content: postInput.content,
      },
    ])
    .select('id, title, content, created_at, user_id')
    .single();

  if (error) {
    throw error;
  }

  // Get author information
  const { data: userData } = await supabase.auth.admin.getUserById(userId);
  const { data: profileData } = await supabase.from('profiles').select('full_name').eq('id', userId).single();

  return {
    ...data,
    author: userData?.user
      ? {
          email: userData.user.email || '',
          full_name: profileData?.full_name,
        }
      : undefined,
  };
};

const getPostById = async (supabase: SupabaseClient, postId: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, content, created_at, user_id')
    .eq('id', postId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Post not found
    }
    throw error;
  }

  // Get author information
  const { data: userData } = await supabase.auth.admin.getUserById(data.user_id);
  const { data: profileData } = await supabase.from('profiles').select('full_name').eq('id', data.user_id).single();

  return {
    ...data,
    author: userData?.user
      ? {
          email: userData.user.email || '',
          full_name: profileData?.full_name,
        }
      : undefined,
  };
};

export { getRecentPosts, createPost, getPostById };
