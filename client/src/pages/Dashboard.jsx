import { useState, useEffect } from 'react'
import { BookOpen, PlayCircle, Trophy, Clock, ChevronRight, Loader2, Award, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from '../api/axios'
import { useAuth } from '../context/auth'

const Dashboard = () => {
  const { user } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [unrolling, setUnrolling] = useState(null)

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const { data } = await axios.get('/profile/enrolled-courses')
      setEnrolledCourses(data.enrolledCourses)
    } catch (error) {
      console.error('Failed to fetch enrollments', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnenroll = async (e, courseId) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!window.confirm('Are you sure you want to unenroll from this course? Your progress will be lost.')) return

    setUnrolling(courseId)
    try {
      await axios.delete(`/enroll/${courseId}`)
      setEnrolledCourses(enrolledCourses.filter(c => c._id !== courseId))
    } catch (err) {
      console.warn('Unenrollment failed:', err.message)
      alert('Failed to unenroll')
    } finally {
      setUnrolling(null)
    }
  }

  const stats = [
    { label: 'Courses Enrolled', value: enrolledCourses.length, icon: <BookOpen className="h-6 w-6 text-primary" /> },
    { label: 'Lessons Completed', value: '28', icon: <PlayCircle className="h-6 w-6 text-secondary" /> },
    { label: 'Certificates Earned', value: '2', icon: <Trophy className="h-6 w-6 text-accent" /> },
    { label: 'Learning Hours', value: '42h', icon: <Clock className="h-6 w-6 text-primary" /> },
  ]

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="dashboard-page py-16 animate-fade-in bg-background">
      <div className="container mx-auto px-6">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-center bg-surface p-10 rounded-3xl border border-border/50 shadow-2xl relative overflow-hidden">
          <div className="z-10">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 flex items-center gap-3">
              Welcome Back, {user?.firstName}! 👋
            </h1>
            <p className="text-text-muted text-lg">You've completed <span className="text-primary font-bold">65%</span> of your weekly goal. Keep learning!</p>
          </div>
          {(user?.role === 'instructor' || user?.role === 'admin') && (
            <Link to="/instructor/dashboard" className="btn-primary px-8 py-3 text-sm font-bold flex items-center gap-2 mt-6 md:mt-0">
               <BookOpen className="h-4 w-4" /> Instructor Controls
            </Link>
          )}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 filter blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card glass p-8 rounded-3xl border border-border/30 flex flex-col gap-3 group hover:border-primary/40 transition-all">
              <div className="stat-icon p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div>
                <div className="stat-value text-3xl font-bold">{stat.value}</div>
                <div className="stat-label text-[10px] text-text-muted uppercase font-bold tracking-widest leading-none">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Learning Progress */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <PlayCircle className="text-primary h-7 w-7" />
              Continue Learning
            </h2>
            
            {enrolledCourses.length > 0 ? (
              <div className="learning-grid flex flex-col gap-6">
                {enrolledCourses.map((course, i) => (
                  <div key={i} className="relative group">
                    <Link 
                        to={`/course/${course._id}`} 
                        className="course-progress-card glass p-6 rounded-3xl border border-border/30 hover:border-primary/40 transition-all flex flex-col md:flex-row gap-8 block overflow-hidden"
                    >
                        <div className="aspect-video w-full md:w-56 rounded-2xl overflow-hidden shadow-2xl relative">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle className="h-10 w-10 text-white" />
                        </div>
                        </div>
                        <div className="flex-grow flex flex-col justify-center pr-10">
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{course.title}</h3>
                        <p className="text-sm text-text-muted mb-6">Last Session: <span className="text-white font-medium">Introduction</span></p>
                        
                        <div className="progress-container flex flex-col gap-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-text-muted">Progress</span>
                            <span className="text-primary">65%</span>
                            </div>
                            <div className="progress-track w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div className="progress-fill h-full bg-gradient-to-r from-primary to-primary-hover shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `65%` }}></div>
                            </div>
                        </div>
                        </div>
                    </Link>
                    <button 
                        onClick={(e) => handleUnenroll(e, course._id)}
                        disabled={unrolling === course._id}
                        className="absolute top-4 right-4 p-2 bg-danger/10 text-danger rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger hover:text-white border border-danger/20"
                        title="Unenroll from course"
                    >
                        {unrolling === course._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 glass rounded-3xl border border-dashed border-border/50">
                <BookOpen className="h-12 w-12 text-text-muted mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-bold mb-2">No courses enrolled</h3>
                <p className="text-text-muted mb-8">Ready to start your journey? Discover our premium courses.</p>
                <Link to="/courses" className="btn-primary px-8 py-3">Browse Courses</Link>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-8">
            <h2 className="text-2xl font-bold mb-8">Updates</h2>
            <div className="flex flex-col gap-6">
              <div className="glass p-8 rounded-3xl border border-border/30 hover:bg-white/5 transition-all">
                <div className="text-[10px] text-secondary font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                  <Award className="h-4 w-4" /> New Achievement
                </div>
                <h4 className="font-bold text-lg mb-3">Fast Learner Week</h4>
                <p className="text-sm text-text-muted leading-relaxed">You've completed 5 lessons in the last 24 hours. Keep this streak alive for a special badge!</p>
              </div>
              
              <div className="glass p-8 rounded-3xl border border-border/30 relative overflow-hidden group">
                <div className="text-[10px] text-primary font-bold mb-3 uppercase tracking-widest">System Update</div>
                <h4 className="font-bold text-lg mb-3">Cloudinary v2 Active</h4>
                <p className="text-sm text-text-muted leading-relaxed">Video streaming performance improved by 40% using our new global edge hosting strategy.</p>
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 filter blur-[30px] rounded-full group-hover:scale-150 transition-transform" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
