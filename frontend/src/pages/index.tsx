import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiUsers, FiWifi, FiAlertCircle, FiServer, FiActivity } from 'react-icons/fi';

// Mock data for the dashboard
const stats = [
  { name: 'Total Pelanggan', value: '1,245', icon: <FiUsers className="h-6 w-6" />, change: '+12%', changeType: 'increase' },
  { name: 'Router Aktif', value: '28', icon: <FiWifi className="h-6 w-6" />, change: '+2', changeType: 'increase' },
  { name: 'Masalah Hari Ini', value: '5', icon: <FiAlertCircle className="h-6 w-6" />, change: '-3', changeType: 'decrease' },
  { name: 'Uptime', value: '99.98%', icon: <FiServer className="h-6 w-6" />, change: '0.02%', changeType: 'increase' },
];

const trafficData = [
  { name: 'Sen', upload: 4000, download: 2400 },
  { name: 'Sel', upload: 3000, download: 1398 },
  { name: 'Rab', upload: 2000, download: 9800 },
  { name: 'Kam', upload: 2780, download: 3908 },
  { name: 'Jum', upload: 1890, download: 4800 },
  { name: 'Sab', upload: 2390, download: 3800 },
  { name: 'Min', upload: 3490, download: 4300 },
];

const recentActivities = [
  { id: 1, type: 'info', message: 'Router RT-01 melakukan restart otomatis', time: '5 menit yang lalu' },
  { id: 2, type: 'success', message: 'Pelanggan baru terdaftar: John Doe', time: '1 jam yang lalu' },
  { id: 3, type: 'warning', message: 'Pemakaian bandwidth melebihi 80% di RT-03', time: '3 jam yang lalu' },
  { id: 4, type: 'error', message: 'Gangguan koneksi di RT-02', time: '5 jam yang lalu' },
  { id: 5, type: 'info', message: 'Update firmware tersedia untuk Router RT-05', time: '1 hari yang lalu' },
];

const Home: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isLoadingData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      // In a real app, you would fetch this from your API
      return {
        totalCustomers: 1245,
        activeRouters: 28,
        issuesToday: 5,
        uptime: '99.98%',
      };
    },
  });

  if (isLoading || isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirecting, no need to render anything
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Dashboard - Gobes.net</title>
        <meta name="description" content="Dashboard monitoring jaringan Gobes.net" />
      </Head>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Selamat datang kembali, {user?.name || 'Admin'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Berikut adalah ringkasan aktivitas jaringan Anda hari ini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              <p
                className={`text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.change} {stat.changeType === 'increase' ? '↑' : '↓'} dari kemarin
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Traffic Jaringan</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-md">
                Hari Ini
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                Minggu Ini
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                Bulan Ini
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trafficData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Legend />
                <Bar dataKey="download" name="Download" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="upload" name="Upload" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Aktivitas Terkini</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start">
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                      activity.type === 'success'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                        : activity.type === 'warning'
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
                        : activity.type === 'error'
                        ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                    }`}
                  >
                    <FiActivity className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Lihat Semua Aktivitas
            </button>
          </div>
        </div>
      </div>

      {/* Router Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Status Router</h2>
          <button className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-md">
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Nama Router
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  IP Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Uptime
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  CPU Load
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Memory Usage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Router-{i}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Online
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    192.168.1.{i}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {Math.floor(Math.random() * 30) + 1}d {Math.floor(Math.random() * 24)}h {Math.floor(
                      Math.random() * 60
                    )}m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 30) + 10}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.floor(Math.random() * 30) + 10}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${Math.floor(Math.random() * 40) + 20}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.floor(Math.random() * 40) + 20}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Lihat Semua Router
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
