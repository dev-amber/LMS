import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyCourses = () => {
  const { currency, backendUrl, getToken, isEducator } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + '/api/educator/courses',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      data.success && setCourses(data.courses);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  return courses ? (
    <div className='h-screen flex flex-col items-start justify-between md:p-8 p-4 pt-8'>
      <div className='w-full'>
        <h2 className='pb-4 text-lg font-medium'>My Courses</h2>
        <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-300'>
          <table className='table-auto w-full text-sm text-left'>
            <thead className='text-gray-900 border-b border-gray-300'>
              <tr>
                <th className='px-4 py-3 font-semibold truncate'>All Courses</th>
                <th className='px-4 py-3 font-semibold truncate'>Earnings</th>
                <th className='px-4 py-3 font-semibold truncate'>Students</th>
                <th className='px-4 py-3 font-semibold truncate'>Published On</th>
              </tr>
            </thead>
            <tbody className='text-gray-700'>
              {courses.map((course) => (
                <tr key={course._id} className='border-b border-gray-200'>
                  <td className='px-4 py-3 flex items-center space-x-3'>
                    <img
                      src={course.courseThumbnail || '/default-course.png'}
                      alt='Course thumbnail'
                      className='w-16 h-16 object-cover rounded'
                    />
                    <span className='truncate hidden md:block'>{course.courseTitle}</span>
                  </td>
                  <td className='px-4 py-3'>
                    {currency}{" "}
                    {Math.floor(
                      course.enrolledStudents.length *
                      (course.coursePrice * (1 - course.discount / 100))
                    )}
                  </td>
                  <td className='px-4 py-3'>{course.enrolledStudents.length}</td>
                  <td className='px-4 py-3'>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
