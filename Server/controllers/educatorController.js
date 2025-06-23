import { clerkClient, getAuth } from '@clerk/express'
import Course from '../models/Course.js'
import { v2 as cloudinary } from 'cloudinary'
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'

// Update Role to Educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    console.log("User ID from Clerk auth:", userId);

    if (!userId) {
      return res.json({ success: false, message: 'User not authenticated' });
    }

    // TEMP: Bypass Clerk to confirm flow
    console.log("Simulating role update...");
    await new Promise(res => setTimeout(res, 500));
    
    res.json({ success: true, message: 'You can publish a course now (mocked)' });
  } catch (error) {
    console.error("Update role error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Add New Course
export const addCourse = async (req, res) => {
  try {
    
    const { courseData } = req.body
    if (!courseData) {
  return res.json({ success: false, message: 'Course data not provided' })
}

    const imageFile = req.file
    const { userId: educator } = getAuth(req)

    if (!imageFile) {
      return res.json({ success: false, message: 'Thumbnail not attached' })
    }

    const parsedCourseData = JSON.parse(courseData)
    parsedCourseData.educator = educator

    const newCourse = await Course.create(parsedCourseData)

    const imageUpload = await cloudinary.uploader.upload(imageFile.path)
    newCourse.courseThumbnail = imageUpload.secure_url
  

    await newCourse.save()

    res.json({ success: true, message: 'Course added' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}


// Get Educator Courses
export  const getEducatorCourses = async(req,res)=>{
  try {
      const { userId: educator } = getAuth(req)
      const courses = await Course.find({educator})
      res.json({success:true,courses})
  } catch (error) {
    res.json({success:false,message:error.message})
    
  }
}

// Get Educator Dashboard Data (Total Earning , Enrolled Stundents, No.of Courses)
export const educatorDashboardData = async (req, res) => {
  try {
    const { userId: educator } = getAuth(req);
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    let totalEarnings = 0;
    const enrolledStudentsData = [];

    for (const course of courses) {
      // Earnings calculation
      const priceAfterDiscount = course.coursePrice - (course.discount * course.coursePrice) / 100;
      totalEarnings += course.enrolledStudents.length * priceAfterDiscount;

      // Enrolled Students
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        'name imageUrl'
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings: Math.floor(totalEarnings),
        totalCourses,
        enrolledStudentsData,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



// Get Enrolled Students Data with Purchase Data

export const getEnrolledStudentsData =async(req,res)=>{
  try {
     const { userId: educator } = getAuth(req)
     const courses = await Course.find({educator})
      const courseIds = courses.map(course=>course._id)
      const purchases = await Purchase.find({
        courseId:{$in:courseIds},
        status:"completed"
      }).populate("userId","name imageUrl").populate('courseId','courseTitle')
      const enrolledStudents = purchases.map(purchase =>({
        student:purchase.userId,
        courseTitle:purchase.courseId.courseTitle,
        purchaseDate:purchase.createdAt
      }))
      res.json({success:true,enrolledStudents})
  } catch (error) {
   res.json({success:false,message:error.message}) 
  }
}