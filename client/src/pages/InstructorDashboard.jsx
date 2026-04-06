import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  BarChart3, 
  Loader2, 
  MoreVertical,
  ExternalLink
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../api/axios'

const InstructorDashboard = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchInstructorData()
  }, [])

  const fetchInstructorData = async () => {
    setLoading(true)
    try {
      const [coursesRes, statsRes] = await Promise.all([
        axios.get('/courses/instructor/my-courses'),
        axios.get('/courses/instructor/stats')
      ])
      setCourses(coursesRes.data.courses)
      setStats(statsRes.data.stats)
    } catch (err) {
      console.warn('Failed to fetch instructor stats:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return
    
    setDeleting(id)
    try {
      await axios.delete(`/courses/${id}`)
      setCourses(courses.filter(c => c._id !== id))
      // Refresh stats
      const statsRes = await axios.get('/courses/instructor/stats')
      setStats(statsRes.data.stats)
    } catch (err) {
      alert('Failed to delete course')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
    </div>
  )

  return (
    <div className="instructor-dashboard py-12 animate-fade-in px-6">
      <div className="container mx-auto max-w-7xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Instructor Dashboard</h1>
            <p className="text-text-muted text-lg">Manage your curriculum and track student engagement.</p>
          </div>
          <Link to="/courses/create" className="btn-primary flex items-center gap-2 px-8 py-4 text-lg">
            <Plus className="h-6 w-6" /> Create New Course
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass p-8 rounded-[32px] border border-border/40 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="bg-primary/10 p-3 rounded-2xl w-fit mb-6">
                <BookOpen className="text-primary h-8 w-8" />
              </div>
              <p className="text-text-muted font-bold text-sm uppercase tracking-widest mb-1">Active Courses</p>
              <h3 className="text-4xl font-black">{stats?.totalCourses || 0}</h3>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen size={160} />
            </div>
          </div>

          <div className="glass p-8 rounded-[32px] border border-border/40 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="bg-secondary/10 p-3 rounded-2xl w-fit mb-6">
                <Users className="text-secondary h-8 w-8" />
              </div>
              <p className="text-text-muted font-bold text-sm uppercase tracking-widest mb-1">Total Students</p>
              <h3 className="text-4xl font-black">{stats?.totalStudents || 0}</h3>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users size={160} />
            </div>
          </div>

          <div className="glass p-8 rounded-[32px] border border-border/40 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="bg-accent/10 p-3 rounded-2xl w-fit mb-6">
                <DollarSign className="text-accent h-8 w-8" />
              </div>
              <p className="text-text-muted font-bold text-sm uppercase tracking-widest mb-1">Total Revenue</p>
              <h3 className="text-4xl font-black">${stats?.totalEarnings?.toLocaleString() || 0}</h3>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <DollarSign size={160} />
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
                <BarChart3 className="text-primary h-6 w-6" />
                Your Courses
            </h2>
            <div className="h-px flex-grow mx-8 bg-border/30 hidden md:block"></div>
            <p className="text-text-muted text-sm font-medium">{courses.length} courses published</p>
        </div>

        {courses.length === 0 ? (
          <div className="glass rounded-[40px] p-20 text-center border border-border/30">
            <div className="bg-white/5 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-text-muted" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No courses yet</h3>
            <p className="text-text-muted mb-8 max-w-sm mx-auto">Launch your first course and start impacting students around the world.</p>
            <Link to="/courses/create" className="btn-primary px-8">Get Started</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="glass rounded-[32px] border border-border/30 overflow-hidden group hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                      {course.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">{course.title}</h3>
                  
                  <div className="flex items-center justify-between mb-8 text-sm font-bold opacity-70">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{course.enrolledCount} Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>${course.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-auto pt-6 border-t border-border/20">
                    <button 
                      onClick={() => navigate(`/courses/edit/${course._id}`)}
                      className="flex-grow bg-white/5 hover:bg-primary/10 text-white hover:text-primary border border-border/20 hover:border-primary/30 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      <Edit3 className="h-4 w-4" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course._id)}
                      disabled={deleting === course._id}
                      className="aspect-square bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/20 p-3 rounded-2xl transition-all flex items-center justify-center"
                    >
                      {deleting === course._id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                    </button>
                    <Link 
                      to={`/course/${course._id}`}
                      className="aspect-square bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 p-3 rounded-2xl transition-all flex items-center justify-center"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorDashboard
