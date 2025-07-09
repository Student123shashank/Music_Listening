import React, { useEffect, useState } from "react";
import { Music, Users, Crown } from "lucide-react";

const AdminDashboard = () => {
  const [totalSongs, setTotalSongs] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Using fetch instead of axios
        const [songsRes, usersRes, subsRes] = await Promise.all([
          fetch("http://localhost:1000/api/v1/total-songs"),
          fetch("http://localhost:1000/api/v1/total-users"),
          fetch("http://localhost:1000/api/v1/subscription/total-subscriptions"),
        ]);

        // Check if all responses are ok
        if (!songsRes.ok || !usersRes.ok || !subsRes.ok) {
          throw new Error('One or more API calls failed');
        }

        const songsData = await songsRes.json();
        const usersData = await usersRes.json();
        const subsData = await subsRes.json();

        console.log('API Responses:', { songsData, usersData, subsData });

        setTotalSongs(songsData.count || 0);
        setTotalUsers(usersData.count || 0);
        setTotalSubscriptions(subsData.count || 0);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        setError(error.message);
        
        // For demo purposes, set some mock data when API fails
        setTotalSongs(2);
        setTotalUsers(3);
        setTotalSubscriptions(1);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Songs",
      count: totalSongs,
      icon: <Music className="w-8 h-8 text-blue-600" />,
      color: "from-blue-100 to-blue-50",
    },
    {
      title: "Total Users",
      count: totalUsers,
      icon: <Users className="w-8 h-8 text-green-600" />,
      color: "from-green-100 to-green-50",
    },
    {
      title: "Total Subscriptions",
      count: totalSubscriptions,
      icon: <Crown className="w-8 h-8 text-yellow-600" />,
      color: "from-yellow-100 to-yellow-50",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-100 to-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Music Admin Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white shadow-lg rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Music Admin Dashboard</h1>
        
        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} shadow-lg rounded-xl p-6 flex items-center gap-4 hover:scale-105 transform transition-all duration-300 ease-in-out cursor-pointer`}
            >
              <div className="p-4 bg-white rounded-full shadow-inner">{stat.icon}</div>
              <div>
                <p className="text-sm font-semibold text-gray-500">{stat.title}</p>
                <h2 className="text-3xl font-bold text-gray-800">{stat.count}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;