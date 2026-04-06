import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  Star, 
  ArrowLeft, 
  Mail, 
  Award,
  ChevronRight,
  Loader2
} from 'lucide-react'
import axios from '../api/axios'

const InstructorProfile = () => {
  const { id } = useParams()
  const [instructor, setInstructor] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInstructorProfile = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`/courses/instructor/${id}`)
        setCourses(data.courses)
        
        if (data.courses.length > 0) {
            const courseDetail = await axios.get(`/courses/view/${data.courses[0]._id}`)
            setInstructor(courseDetail.data.course.creator)
        }
      } catch (error) {
        console.error('Failed to fetch instructor profile', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInstructorProfile()
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="text-text-muted font-medium">Loading instructor profile...</p>
    </div>
  )

  if (!instructor && !loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Instructor Not Found</h2>
      <Link to="/courses" className="btn-secondary flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </Link>
    </div>
  )

  return (
    <div className="instructor-profile py-16 animate-fade-in px-6">
      <div className="container mx-auto max-w-6xl">
        <Link to="/courses" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-12 font-bold group">
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Back to all courses
        </Link>

        {/* Profile Header */}
        <div className="glass rounded-[40px] p-10 md:p-14 border border-border/40 relative overflow-hidden mb-16">
          <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
            <div className="relative">
              <div className="h-40 w-40 rounded-[40px] overflow-hidden border-4 border-primary/20 shadow-2xl relative z-10">
                <img 
                  src={instructor.photoUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor'} 
                  alt={instructor.firstName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-white p-3 rounded-2xl shadow-xl z-20">
                <Award className="h-6 w-6" />
              </div>
            </div>

            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  {instructor.firstName} {instructor.lastName}
                </h1>
                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20 w-fit mx-auto md:mx-0">
                  Top Instructor
                </span>
              </div>
              
              <p className="text-lg text-text-muted mb-8 max-w-2xl leading-relaxed italic">
                "{instructor.about || 'Passionate educator dedicated to sharing knowledge and empowering the next generation of creators.'}"
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                 <div className="flex items-center gap-3">
                    <div className="bg-secondary/10 p-2 rounded-xl">
                        <BookOpen className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="font-bold">{courses.length} Published Courses</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="bg-accent/10 p-2 rounded-xl">
                        <Star className="h-5 w-5 text-accent" />
                    </div>
                    <span className="font-bold">4.9 Instructor Rating</span>
                 </div>
                 <div className="flex items-center gap-3 text-text-muted hover:text-white transition-colors cursor-pointer">
                    <Mail className="h-5 w-5" />
                    <span className="font-medium underline underline-offset-4">{instructor.email}</span>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 filter blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 filter blur-[80px] rounded-full" />
        </div>

        {/* Instructor Courses */}
        <div className="mb-12">
            <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
              <span className="bg-secondary p-2 rounded-xl text-white">
                <BookOpen className="h-6 w-6" />
              </span>
              Courses by {instructor.firstName}
            </h2>
            
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {courses.map(course => (
                  <Link 
                    to={`/course/${course._id}`} 
                    key={course._id} 
                    className="glass rounded-3xl overflow-hidden border border-border/40 hover:border-primary/40 transition-all hover:-translate-y-2 group flex flex-col h-full"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                        {course.category}
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">{course.title}</h3>
                      
                      <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/20">
                        <div className="flex items-center gap-2 text-text-muted font-bold text-sm">
                           <Users className="h-4 w-4" />
                           <span>{course.enrolledCount || 0} Students</span>
                        </div>
                        <div className="text-2xl font-black text-white">${course.price}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass rounded-[40px] border border-dashed border-border/40">
                <p className="text-text-muted text-lg italic">No courses found for this instructor.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default InstructorProfile
