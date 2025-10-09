'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { type User } from '@supabase/supabase-js';
import Avatar from '@/app/account/avatar';
import { createClient } from '@/utils/supabase/client';
import { Profile, getProfile, updateProfile } from '@/utils/supabase/profile';

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<Omit<Profile, 'id' | 'email'> | undefined>(undefined);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getProfile(supabase, user!.id, user!.email!);
      if (data) {
        setProfileData({
          full_name: data.full_name,
          username: data.username,
          website: data.website,
          avatar_url: data.avatar_url,
        });
      }
    } catch (error) {
      alert('Error loading user data!');
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    loadProfile();
  }, [user, loadProfile]);

  async function saveProfile(profile: Omit<Profile, 'id' | 'email'>) {
    try {
      setLoading(true);

      await updateProfile(supabase, user!.id, {
        full_name: profile.full_name,
        username: profile.username,
        website: profile.website,
        avatar_url: profile.avatar_url,
      });
      alert('Profile updated!');
    } catch (error) {
      alert('Error updating the data!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-8">
          <div className="auth-header">
            <Link href="/">← Back to Home</Link>
            <h1 className="mainHeader">Your Profile</h1>
          </div>

          <div className="card">
            <div className="form-widget">
              <Avatar
                uid={user?.id ?? null}
                url={profileData?.avatar_url ?? null}
                size={150}
                onUpload={(url) => {
                  setProfileData({ ...profileData, avatar_url: url });
                  saveProfile({ ...profileData, avatar_url: url });
                }}
              />

              <div>
                <label htmlFor="email">Email (cannot be changed)</label>
                <input id="email" type="text" value={user?.email} disabled />
              </div>

              <div>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={profileData?.username || ''}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={profileData?.full_name || ''}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      full_name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="url"
                  value={profileData?.website || ''}
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                />
              </div>

              <button
                className="button primary block"
                onClick={() => saveProfile({ ...profileData })}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>

              <Link
                href="/blog"
                className="button block"
                style={{
                  textAlign: 'center',
                  display: 'inline-block',
                  width: '100%',
                  textDecoration: 'none',
                }}
              >
                View Blog
              </Link>

              <form action="/auth/signout" method="post">
                <button className="button block" type="submit">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
