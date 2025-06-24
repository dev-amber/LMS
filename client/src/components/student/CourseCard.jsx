import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  const rawRating = calculateRating(course);
  const rating = isNaN(rawRating) ? 0 : rawRating;

  const hasValidPrice = typeof course.coursePrice === 'number' && typeof course.discount === 'number';
  const discountedPrice = hasValidPrice
    ? (course.coursePrice - (course.discount * course.coursePrice / 100)).toFixed(2)
    : '0.00';

  return (
    <Link
      to={`/course/${course._id}`}
      onClick={() => scrollTo(0, 0)}
      className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg"
    >
      <img className="w-full" src={course.courseThumbnail} alt="Course Thumbnail" />
      <div className="p-3 text-left">
        <h3 className="text-base font-semibold">{course.courseTitle}</h3>
      <p className="text-sm">
  <span className="text-gray-500">
    {course.educator?.name || 'Unknown'}
  </span>
</p>

        <div className="flex items-center space-x-2">
          <p>{rating.toFixed(1)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                alt="rating star"
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          <p className="text-gray-500">
            ({course.courseRatings?.length || 0})
          </p>
        </div>

        <p className="text-base font-semibold text-gray-800">
          {currency}{discountedPrice}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
