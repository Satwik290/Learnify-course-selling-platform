import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PlayCircle, Clock, BookOpen, User, CheckCircle, ChevronRight, Lock } from 'lucide-react'
import axios from '../api/axios'
import { useAuth } from '../context/auth'

const CourseDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`/courses/view/${id}`)
        setCourse(data.course)
        
        // Check if user is enrolled
        if (user && user.enrolledCourses.includes(id)) {
          setIsEnrolled(true)
        }
      } catch (error) {
        console.error('Failed to fetch course', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id, user])

  const handleEnroll = async () => {
    try {
      await axios.post(`/payment/enroll/${id}`)
      setIsEnrolled(true)
      alert('Successfully enrolled! Check your dashboard.')
    } catch (error) {
      console.error('Enrollment failed', error)
      alert('Enrollment failed. Please try again.')
    }
  }

  if (loading) return <div className="py-24 text-center">Loading Course Details...</div>
  if (!course) return <div className="py-24 text-center text-danger font-bold">Course Not Found</div>

  return (
    <div className="course-detail-page py-16 animate-fade-in bg-background">
      <div className="container mx-auto px-6">
        <header className="mb-12 grid md:grid-cols-3 gap-12 items-center bg-surface p-10 rounded-3xl border border-border/50 relative overflow-hidden">
          <div className="md:col-span-2 z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">{course.category}</span>
              <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full border border-secondary/20">{course.level}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{course.title}</h1>
            <p className="text-xl text-text-muted mb-8 leading-relaxed max-w-2xl">{course.description}</p>
            
            <div className="flex items-center gap-8 text-sm font-medium mb-8">
              <Link to={`/instructor/${course.creator._id}`} className="flex items-center gap-2 hover:text-primary transition-colors group/inst">
                <User className="h-5 w-5 text-primary group-hover/inst:scale-110 transition-transform" />
                <span className="font-bold border-b border-transparent group-hover/inst:border-primary">By {course.creator.firstName} {course.creator.lastName}</span>
              </Link>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                <span>Last updated 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                <span>{course.sections.length} Sections</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isEnrolled ? (
                <Link to="/dashboard" className="btn-primary px-10 py-4 text-lg flex items-center justify-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Continue Learning
                </Link>
              ) : (
                <button onClick={handleEnroll} className="btn-primary px-10 py-4 text-lg">
                  Enroll Now - ${course.price}
                </button>
              )}
              <button className="btn-secondary px-8 py-4 text-lg">Wishlist</button>
            </div>
          </div>

          <div className="md:col-span-1 rounded-2xl overflow-hidden shadow-2xl border border-border/50 aspect-video relative group">
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 transition-opacity">
              <PlayCircle className="h-16 w-16 text-white/80 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 filter blur-[80px] rounded-full" />
        </header>

        <div className="grid md:grid-cols-3 gap-12">
          <main className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-8">Course Curriculum</h2>
            <div className="curriculum-accordion flex flex-col gap-4">
              {course.sections.map((section, sIdx) => (
                <div key={sIdx} className="section-item glass rounded-2xl border border-border/30 overflow-hidden">
                  <div className="section-header p-6 bg-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-lg">{section.title}</h3>
                    <span className="text-sm text-text-muted">{section.lessons.length} Lessons</span>
                  </div>
                  <div className="lessons-list">
                    {section.lessons.map((lesson, lIdx) => (
                      <div key={lIdx} className="lesson-row p-5 flex items-center justify-between hover:bg-white/5 border-t border-border/20 transition-all">
                        <div className="flex items-center gap-4">
                          {isEnrolled || lesson.isFreePreview ? (
                            <PlayCircle className="h-5 w-5 text-primary" />
                          ) : (
                            <Lock className="h-5 w-5 text-text-muted" />
                          )}
                          <div>
                            <div className="text-sm font-semibold">{lesson.title}</div>
                            {lesson.duration && <div className="text-xs text-text-muted">{lesson.duration}</div>}
                          </div>
                        </div>
                        {lesson.isFreePreview && !isEnrolled && (
                          <span className="text-[10px] uppercase font-bold text-secondary border border-secondary/30 px-2 py-0.5 rounded">Preview</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>

          <aside className="flex flex-col gap-8">
            <div className="glass p-8 rounded-3xl border border-border/50">
              <h3 className="text-lg font-bold mb-6">This course includes:</h3>
              <ul className="flex flex-col gap-4 text-sm font-medium">
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success" /> 24+ hours on-demand video</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success" /> 12 Downloadable resources</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success" /> Lifetime access</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success" /> Access on mobile and TV</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success" /> Certificate of completion</li>
              </ul>
            </div>

            <div className="glass p-8 rounded-3xl border border-border/50">
              <h3 className="text-lg font-bold mb-4">Requirements</h3>
              <p className="text-sm text-text-muted leading-relaxed">No prior knowledge required. We start from the absolute basics and work our way up to professional level.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
