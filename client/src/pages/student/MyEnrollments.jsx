import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Line } from 'rc-progress';
import Footer from '../../components/student/Footer';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyEnrollments = () => {
  const {
    enrolledCourses,
    setEnrolledCourses,
    calculateCourseDuration,
    navigate,
    userData,
    getToken,
    backendUrl,
    calculateNoOfLectures,
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch full course data from course IDs
  const fetchFullCourseData = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const fullCourses = await Promise.all(
        enrolledCourses.map(async (courseId) => {
          const { data } = await axios.get(`${backendUrl}/api/course/enrolled-courses`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return data.course;
        })
      );

      setEnrolledCourses(fullCourses);
    } catch (error) {
      toast.error('Failed to fetch full course data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch progress for all enrolled courses
  const getCourseProgress = async () => {
    try {
      const token = await getToken();

      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            backendUrl + '/api/user/get-course-progress',
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;

          return { totalLectures, lectureCompleted };
        })
      );

      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData && enrolledCourses.length > 0 ) {
      fetchFullCourseData();
    }
  }, [userData, enrolledCourses]);

  useEffect(() => {
    if (enrolledCourses.length > 0 ) {
      getCourseProgress();
    }
  }, [enrolledCourses]);

  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>

        {loading ? (
          <p className="mt-10 text-gray-600">Loading your enrolled courses...</p>
        ) : enrolledCourses.length === 0 ? (
          <div className="mt-10 text-gray-600">
            You haven't enrolled in any course yet.
          </div>
        ) : (
          <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Course</th>
                <th className="px-4 py-3 font-semibold truncate">Duration</th>
                <th className="px-4 py-3 font-semibold truncate">Completed</th>
                <th className="px-4 py-3 font-semibold truncate">Status</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map((course, index) => {
                if (!course || !course._id) return null;

                const progress = progressArray[index];
                const percentCompleted =
                  progress && progress.totalLectures > 0
                    ? (progress.lectureCompleted * 100) / progress.totalLectures
                    : 0;

                return (
                  <tr key={course._id} className="border-b border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                      <img
                        src={course.courseThumbnail}
                        alt="Course Thumbnail"
                        className="w-14 sm:w-24 md:w-28"
                      />
                      <div className="flex-1">
                        <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                        <Line
                          strokeWidth={2}
                          percent={percentCompleted}
                          className="bg-gray-300 rounded-full"
                        />
                      </div>
                    </td>
                    <td>{calculateCourseDuration(course)}</td>
                    <td>
                      {progress ? (
                        <>
                          {progress.lectureCompleted} / {progress.totalLectures}{' '}
                          <span>Lectures</span>
                        </>
                      ) : (
                        <span>No data</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => navigate('/player/' + course._id)}
                        className="px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white"
                      >
                        {progress && progress.lectureCompleted === progress.totalLectures
                          ? 'Completed'
                          : 'On Going'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Footer />
    </>
  );
};

export default MyEnrollments;
