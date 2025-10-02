import { Post } from '@/utils/supabase/posts';

interface BlogListProps {
  posts: Post[] | null;
}

export default function BlogList({ posts }: BlogListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div>
        <p>No blog posts yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Recent Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="card" style={{ marginBottom: '1.5rem' }}>
          <h3>{post.title}</h3>
          <div
            style={{
              fontSize: '0.9rem',
              color: '#666',
              marginBottom: '1rem',
            }}
          >
            By {post.author?.full_name || post.author?.email || 'Anonymous'} •{' '}
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
          <div
            style={{
              whiteSpace: 'pre-wrap',
              lineHeight: '1.6',
            }}
          >
            {post.content}
          </div>
        </div>
      ))}
    </div>
  );
}
