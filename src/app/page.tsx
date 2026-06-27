'use client';

export default function Home() {
  const connectToGitHub = () => {
    window.location.href = '/api/auth/oauth/authorize/github';
  };
  return (
    <div className="">
      <h1>Welcome to Learn Code</h1>

      <button onClick={connectToGitHub}>Connect Me to GitHub</button>
    </div>
  );
}
