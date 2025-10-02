import Link from 'next/link';
import { redirect } from 'next/navigation';
import BlogForm from '@/app/blog/blog-form';
import BlogList from '@/app/blog/blog-list';
import { getRecentPosts } from '@/utils/supabase/posts';
import { createClient } from '@/utils/supabase/server';

export default async function BlogPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/?returnTo=/blog');
  }

  // Fetch the 5 most recent posts
  const posts = await getRecentPosts(supabase, 5);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="auth-header">
            <Link href="/account">← Back to Account</Link>
            <h1 className="header">Blog</h1>
          </div>
          <BlogForm user={user} />
          <BlogList posts={posts} />
        </div>
      </div>
    </div>
  );
}
