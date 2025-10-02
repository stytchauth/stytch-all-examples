import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1>Something went wrong</h1>
          <p>We encountered an unexpected error. Please try again.</p>
          <Link href="/" className="button primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
