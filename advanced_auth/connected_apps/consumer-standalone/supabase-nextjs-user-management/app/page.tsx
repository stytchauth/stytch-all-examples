import { use } from 'react';
import { login, signup } from '@/app/actions';

export default function Home({ searchParams }: any) {
  const returnTo = (use(searchParams) as any).returnTo ?? '';

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="header">Profile Manager</h1>
          <p className="description">
            A demo showcasing how to add an MCP server authenticated using Stytch Connected Apps. All profile
            information is stored in Supabase, which is the user authentication provider.
          </p>
        </div>
        <div className="col-6 form-widget">
          <div className="card">
            <form className="form-widget">
              <input type="hidden" name="returnTo" value={returnTo} />
              <div>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="kona@stytch.com" required />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" placeholder="********" required />
              </div>
              <button formAction={login} className="button primary block">
                Sign In
              </button>
              <button formAction={signup} className="button block">
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
