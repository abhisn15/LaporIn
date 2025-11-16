'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Report {
  id: number;
  title: string;
  description: string;
  urgency: string;
  status: string;
  created_at: string;
  category?: string;
}

interface ReportsListProps {
  filter?: Record<string, string>;
}

export default function ReportsList({ filter = {} }: ReportsListProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams(filter);
      const { data } = await api.get(`/reports?${params}`);
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Link
          key={report.id}
          href={`/reports/${report.id}`}
          className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{report.title}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {report.description.substring(0, 100)}...
              </p>
              <div className="flex gap-2 mt-2">
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
            <div className="text-sm text-gray-500">
              {new Date(report.created_at).toLocaleDateString('id-ID')}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

