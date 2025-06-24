import React, { useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import Quill from 'quill';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  });

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          chapterId: uuidv4(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters[chapters.length - 1].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            const updatedContent = [...chapter.chapterContent];
            updatedContent.splice(lectureIndex, 1);
            return { ...chapter, chapterContent: updatedContent };
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    const updatedChapters = chapters.map((chapter) => {
      if (chapter.chapterId === currentChapterId) {
        const newLecture = {
          ...lectureDetails,
          isPreviewFree: Boolean(lectureDetails.isPreviewFree),
          lectureOrder:
            chapter.chapterContent.length > 0
              ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
              : 1,
          lectureId: uuidv4(),
        };
        return {
          ...chapter,
          chapterContent: [...chapter.chapterContent, newLecture],
        };
      }
      return chapter;
    });

    setChapters(updatedChapters);
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error('Thumbnail not selected');

    const courseData = {
      courseTitle,
      courseDescription: quillRef.current.root.innerHTML,
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      courseContent: chapters,
    };

    const formData = new FormData();
    formData.append('courseData', JSON.stringify(courseData));
    formData.append('image', image);

    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setCourseTitle('');
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = '';
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='p-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder='Course Title' className='border p-2 w-full' required />
        <div ref={editorRef} className='h-40 border'></div>
        <input value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} type='number' placeholder='Course Price' className='border p-2 w-full' required />
        <input value={discount} onChange={(e) => setDiscount(e.target.value)} type='number' placeholder='Discount %' className='border p-2 w-full' required />
        <input type='file' accept='image/*' onChange={(e) => setImage(e.target.files[0])} className='border p-2 w-full' />
        {image && <img src={URL.createObjectURL(image)} alt='thumbnail' className='h-20' />}

        {chapters.map((chapter, i) => (
          <div key={chapter.chapterId} className='border p-2'>
            <div className='flex justify-between items-center mb-2'>
              <span>{i + 1}. {chapter.chapterTitle}</span>
              <button type='button' onClick={() => handleChapter('remove', chapter.chapterId)} className='text-red-500'>Remove Chapter</button>
            </div>
            {!chapter.collapsed && (
              <>
                {chapter.chapterContent.map((lecture, idx) => (
                  <div key={lecture.lectureId} className='ml-4 flex justify-between'>
                    <span>{idx + 1}. {lecture.lectureTitle}</span>
                    <button type='button' onClick={() => handleLecture('remove', chapter.chapterId, idx)} className='text-red-500'>Remove</button>
                  </div>
                ))}
                <button type='button' onClick={() => handleLecture('add', chapter.chapterId)} className='ml-4 mt-2 text-blue-600'>+ Add Lecture</button>
              </>
            )}
          </div>
        ))}

        <button type='button' onClick={() => handleChapter('add')} className='bg-gray-200 px-3 py-1'>+ Add Chapter</button>

        {showPopup && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white p-6 rounded shadow-md w-full max-w-md'>
              <h2 className='text-lg font-semibold mb-2'>Add Lecture</h2>
              <input
                value={lectureDetails.lectureTitle}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                placeholder='Lecture Title'
                className='border p-2 w-full mb-2'
              />
              <input
                value={lectureDetails.lectureDuration}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                placeholder='Duration (e.g., 10 min)'
                className='border p-2 w-full mb-2'
              />
              <input
                value={lectureDetails.lectureUrl}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                placeholder='Lecture URL (video link)'
                className='border p-2 w-full mb-2'
              />
              <label className='flex items-center gap-2 mb-4'>
                <input
                  type='checkbox'
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                />
                Preview Free
              </label>
              <div className='flex justify-end gap-4'>
                <button onClick={addLecture} className='bg-blue-600 text-white px-4 py-2 rounded'>Add Lecture</button>
                <button onClick={() => setShowPopup(false)} className='text-red-500'>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <button type='submit' className='bg-black text-white px-4 py-2 rounded'>ADD</button>
      </form>
    </div>
    
  );
};

export default AddCourse;