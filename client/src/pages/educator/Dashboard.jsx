import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import Loading from '../../components/student/Loading';
import { toast } from 'react-toastify';
import axios from 'axios';

const Dashboard = () => {
  const { currency, backendUrl, getToken, isEducator } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  if (!dashboardData) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col gap-8 md:p-8 p-4 pt-8">
      {/* Dashboard Stats */}
      <div className="flex flex-wrap gap-5">
        <DashboardCard
          icon={assets.patients_icon}
          label="Total Enrollments"
          value={dashboardData.enrolledStudentsData?.length || 0}
        />
        <DashboardCard
          icon={assets.appointments_icon}
          label="Total Courses"
          value={dashboardData.totalCourses || 0}
        />
        <DashboardCard
          icon={assets.earning_icon}
          label="Total Earnings"
          value={`${currency} ${dashboardData.totalEarnings || 0}`}
        />
      </div>

      {/* Latest Enrollments Table */}
      <div className="w-full max-w-4xl">
        <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2>
        <div className="rounded-md bg-white border border-gray-500/20 overflow-hidden">
          <table className="table-fixed md:table-auto w-full text-sm text-gray-700">
            <thead className="text-gray-900 border-b border-gray-500/20">
              <tr>
                <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                <th className="px-4 py-3 font-semibold">Student Name</th>
                <th className="px-4 py-3 font-semibold">Course Title</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.enrolledStudentsData?.map((item, index) => (
                <tr key={item._id || index} className="border-b border-gray-500/20">
                  <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                  <td className="md:px-4 py-3 flex items-center gap-3">
                    <img
                      src={item.student?.imageUrl || assets.default_profile}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span className="truncate">{item.student?.name || 'Unknown'}</span>
                  </td>
                  <td className="px-4 py-3 truncate">{item.courseTitle || 'Untitled Course'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reusable Dashboard Card Component
const DashboardCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md">
    <img src={icon} alt={label} />
    <div>
      <p className="text-2xl font-medium text-gray-600">{value}</p>
      <p className="text-base text-gray-500">{label}</p>
    </div>
  </div>
);

export default Dashboard;
