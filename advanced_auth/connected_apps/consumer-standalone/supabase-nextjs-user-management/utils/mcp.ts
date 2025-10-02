import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getRecentPosts, createPost, getPostById } from '@/utils/supabase/posts';
import { getProfile } from '@/utils/supabase/profile';
import { createClient } from '@/utils/supabase/server';

export const initializeMCPServer = (server: McpServer) => {
  server.tool('whoami', 'Who am i anyway', async ({ authInfo }) => {
    const { custom_claims } = authInfo?.extra as {
      custom_claims: { sb_user_id: string };
    };
    const supabaseId = custom_claims.sb_user_id;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.admin.getUserById(supabaseId);

    const profile = await getProfile(supabase, user!.id, user!.email!);

    return {
      content: [
        {
          type: 'text',
          text: profile
            ? `name: ${profile.full_name} email: ${profile.email} username: ${profile.username} website: ${profile.website} avatar_url: ${profile.avatar_url}`
            : 'NOT FOUND',
        },
      ],
    };
  });

  server.resource('Profile', 'snumsmcp://profile', async (uri, { authInfo }) => {
    const { custom_claims } = authInfo?.extra as {
      custom_claims: { sb_user_id: string };
    };
    const supabaseId = custom_claims.sb_user_id;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.admin.getUserById(supabaseId);

    const profile = await getProfile(supabase, user!.id, user!.email!);

    return {
      contents: [
        {
          uri: uri.href,
          text: profile
            ? `name: ${profile.full_name} email: ${profile.email} username: ${profile.username} website: ${profile.website} avatar_url: ${profile.avatar_url}`
            : 'NOT FOUND',
        },
      ],
    };
  });

  server.tool(
    'updateProfile',
    "Update the user's profile",
    {
      profile: z.object({
        full_name: z
          .string()
          .optional()
          .transform((val) => (val === '' ? undefined : val)),
        username: z
          .string()
          .optional()
          .transform((val) => (val === '' ? undefined : val)),
        website: z
          .string()
          .optional()
          .transform((val) => (val === '' ? undefined : val)),
        avatar_url: z
          .string()
          .optional()
          .transform((val) => (val === '' ? undefined : val)),
      }),
    },
    async ({ profile }, { authInfo }) => {
      const { custom_claims } = authInfo?.extra as {
        custom_claims: { sb_user_id: string };
      };
      const supabaseId = custom_claims.sb_user_id;

      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.admin.getUserById(supabaseId);

      const { error } = await supabase.from('profiles').upsert({
        id: user!.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error(error);
        return {
          content: [
            {
              type: 'text',
              text: 'Profile update failed',
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: 'Profile updated successfully',
          },
        ],
      };
    },
  );

  // Posts resource template - handles both list and individual posts
  server.resource(
    'Posts',
    new ResourceTemplate('snumsmcp://posts/{id}', {
      list: async () => {
        // List all recent posts - this provides discoverable URIs
        const supabase = await createClient();
        const posts = await getRecentPosts(supabase, 10);
        return {
          resources: posts.map((post) => ({
            uri: `snumsmcp://posts/${post.id}`,
            name: post.title,
            description: `Post by ${post.author?.full_name || post.author?.email || 'Unknown'} on ${new Date(post.created_at).toLocaleDateString()}`,
          })),
        };
      },
      complete: {
        id: async (value) => {
          // Return post IDs for autocompletion
          const supabase = await createClient();
          const posts = await getRecentPosts(supabase, 20); // Get more posts for completion

          // Filter by partial match if value is provided
          const matchingIds = posts
            .map((post) => post.id)
            .filter((id) => (value ? id.toLowerCase().includes(value.toLowerCase()) : true));

          return matchingIds;
        },
      },
    }),
    async (uri, variables) => {
      const supabase = await createClient();

      // Extract post ID from template variables - this callback only handles individual posts
      const postId = Array.isArray(variables.id) ? variables.id[0] : variables.id;

      if (!postId) {
        throw new Error('Post ID is required for individual post access');
      }

      const post = await getPostById(supabase, postId);

      if (!post) {
        return {
          contents: [
            {
              uri: uri.href,
              text: 'Post not found',
            },
          ],
        };
      }

      const postText =
        `Title: ${post.title}\n` +
        `Author: ${post.author?.full_name || post.author?.email || 'Unknown'}\n` +
        `Date: ${new Date(post.created_at).toLocaleDateString()}\n` +
        `Content: ${post.content}\n` +
        `ID: ${post.id}`;

      return {
        contents: [
          {
            uri: uri.href,
            text: postText,
          },
        ],
      };
    },
  );

  // Fetch recent posts tool
  server.tool(
    'fetchRecentPosts',
    'Fetch the most recent blog posts',
    {
      limit: z.number().optional().default(5).describe('Number of posts to fetch (default: 5)'),
    },
    async ({ limit }) => {
      const supabase = await createClient();
      const posts = await getRecentPosts(supabase, limit);

      if (posts.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No blog posts found.',
            },
          ],
        };
      }

      const postsText = posts
        .map(
          (post) =>
            `**${post.title}**\n` +
            `By: ${post.author?.full_name || post.author?.email || 'Unknown'}\n` +
            `Date: ${new Date(post.created_at).toLocaleDateString()}\n` +
            `Content: ${post.content}\n` +
            `ID: ${post.id}`,
        )
        .join('\n\n---\n\n');

      return {
        content: [
          {
            type: 'text',
            text: `Found ${posts.length} blog post${posts.length === 1 ? '' : 's'}:\n\n${postsText}`,
          },
        ],
      };
    },
  );

  // Write new post tool
  server.tool(
    'writeNewPost',
    'Create a new blog post',
    {
      title: z.string().describe('The title of the blog post'),
      content: z.string().describe('The content/body of the blog post'),
    },
    async ({ title, content }, { authInfo }) => {
      const { custom_claims } = authInfo?.extra as {
        custom_claims: { sb_user_id: string };
      };
      const supabaseId = custom_claims.sb_user_id;

      const supabase = await createClient();

      try {
        const post = await createPost(supabase, supabaseId, { title, content });

        return {
          content: [
            {
              type: 'text',
              text:
                `Blog post created successfully!\n\n` +
                `Title: ${post.title}\n` +
                `Author: ${post.author?.full_name || post.author?.email || 'You'}\n` +
                `Date: ${new Date(post.created_at).toLocaleDateString()}\n` +
                `ID: ${post.id}\n\n` +
                `Content preview: ${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}`,
            },
          ],
        };
      } catch (error) {
        console.error('Error creating post:', error);
        return {
          content: [
            {
              type: 'text',
              text: 'Failed to create blog post. Please try again.',
            },
          ],
        };
      }
    },
  );
};
