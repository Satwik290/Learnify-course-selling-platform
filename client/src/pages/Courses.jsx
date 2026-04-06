import { useState, useEffect } from 'react'
import { Search, Filter, BookOpen, Clock, User, ChevronRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from '../api/axios'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/courses/view')
      setCourses(data.courses)
    } catch (error) {
      console.error('Failed to fetch courses', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-text-muted font-medium">Discovering premium courses...</p>
      </div>
    )
  }

  return (
    <div className="courses-page py-16 animate-fade-in bg-background">
      <div className="container mx-auto px-6">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">Explore Our Courses</h1>
            <p className="text-text-muted max-w-lg">Discover world-class learning content from industry experts and master new skills today.</p>
          </div>
          
          <div className="search-box relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search for courses, tech, skills..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 h-14 bg-surface border-border/50 focus:border-primary/50" 
            />
          </div>
        </header>
        
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <Link 
                to={`/course/${course._id}`} 
                key={course._id} 
                className="course-card glass rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all hover:-translate-y-2 group flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-wider">
                    {course.category || 'Featured'}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-white text-sm font-bold flex items-center gap-2">View Curriculum <ChevronRight className="h-4 w-4" /></span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h3>
                  </div>
                  <p className="text-text-muted text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">{course.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border/30">
                    <div className="flex items-center gap-2 group/creator">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <Link 
                        to={`/instructor/${course.creator?._id}`}
                        onClick={(e) => e.stopPropagation()} 
                        className="flex flex-col hover:text-primary transition-colors cursor-pointer"
                      >
                        <span className="text-xs text-white font-bold">{course.creator?.firstName}</span>
                        <span className="text-[10px] text-text-muted">Instructor</span>
                      </Link>
                    </div>
                    <div className="text-2xl font-bold text-success">${course.price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass rounded-3xl border border-dashed border-border/50">
            <Search className="h-12 w-12 text-text-muted mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No courses found</h3>
            <p className="text-text-muted">Try adjusting your search terms to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses
