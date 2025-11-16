'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import useAuthStore from '@/store/authStore';

interface Report {
  id: number;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: string;
  location: string;
  ai_summary: string;
  blockchain_tx_hash: string;
  created_at: string;
  history: Array<{
    id: number;
    status: string;
    notes: string;
    created_at: string;
    updated_by_name: string;
  }>;
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchReport();
    }
  }, [params.id, isAuthenticated]);

  const fetchReport = async () => {
    try {
      const { data } = await api.get(`/reports/${params.id}`);
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!report) return <div>Report not found</div>;

  const isPengurus = user?.role === 'pengurus' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Kembali
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span>{user?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-4">{report.title}</h1>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">Deskripsi</h3>
              <p className="text-gray-600">{report.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700">Lokasi</h3>
              <p className="text-gray-600">{report.location}</p>
            </div>

            <div className="flex gap-4">
              <div>
                <span className="font-semibold text-gray-700">Kategori: </span>
                <span className="text-gray-600">{report.category || 'Belum diproses'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Urgensi: </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    report.urgency === 'high'
                      ? 'bg-red-100 text-red-800'
                      : report.urgency === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {report.urgency || 'Belum diproses'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Status: </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    report.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : report.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {report.status}
                </span>
              </div>
            </div>

            {report.ai_summary && (
              <div>
                <h3 className="font-semibold text-gray-700">Ringkasan AI</h3>
                <p className="text-gray-600">{report.ai_summary}</p>
              </div>
            )}

            {report.blockchain_tx_hash && (
              <div>
                <h3 className="font-semibold text-gray-700">Blockchain Hash</h3>
                <p className="text-xs text-gray-500 font-mono">{report.blockchain_tx_hash}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Timeline</h3>
              <div className="space-y-2">
                {report.history.map((item) => (
                  <div key={item.id} className="border-l-2 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.status}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleString('id-ID')}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Oleh: {item.updated_by_name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

