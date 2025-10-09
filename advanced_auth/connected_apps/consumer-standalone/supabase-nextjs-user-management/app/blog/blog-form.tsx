'use client';

import { useState } from 'react';
import { createPost } from '@/app/blog/actions';

interface BlogFormProps {
  user: any;
}

export default function BlogForm({ user }: BlogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await createPost(formData);
      // Reset form
      const form = document.getElementById('blog-form') as HTMLFormElement;
      form?.reset();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h2>Create New Post</h2>
      <form id="blog-form" action={handleSubmit} className="form-widget">
        <input type="hidden" name="user_id" value={user.id} />
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter post title..."
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={6}
            placeholder="Write your post content..."
            required
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" className="button primary block" disabled={isSubmitting}>
          {isSubmitting ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}
