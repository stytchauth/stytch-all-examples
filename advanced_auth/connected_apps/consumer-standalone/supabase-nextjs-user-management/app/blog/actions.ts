'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const data = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    user_id: formData.get('user_id') as string,
  };

  const { error } = await supabase.from('posts').insert([data]);

  if (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }

  revalidatePath('/blog');
}
