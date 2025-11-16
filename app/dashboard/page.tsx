'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import ReportsList from '@/components/ReportsList';
import CreateReportForm from '@/components/CreateReportForm';

export default function DashboardPage() {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const isPengurus = user?.role === 'pengurus' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">LaporIn</h1>
            </div>
            <div className="flex items-center gap-4">
              <span>{user?.name}</span>
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  router.push('/login');
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPengurus ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Pengurus</h2>
            <ReportsList />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Laporan Saya</h2>
              <ReportsList />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6">Buat Laporan Baru</h2>
              <CreateReportForm />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

