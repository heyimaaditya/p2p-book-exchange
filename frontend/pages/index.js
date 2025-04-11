import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userRole = localStorage.getItem('role');
      if (userRole === 'owner') {
        router.push('/dashboard-owner');
      } else {
        router.push('/dashboard-seeker');
      }
    }
  }, [router]);

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow fade-in">
      <h1 className="text-2xl font-bold mb-4 text-center">Welcome to Book Exchange Portal</h1>
      <div className="flex justify-center gap-4">
        <Link href="/login">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}
