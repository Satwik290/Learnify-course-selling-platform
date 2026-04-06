import { useState, useEffect } from 'react'
import { Plus, Trash2, Video, FileText, Layout, Save, X, ArrowLeft, Loader2 } from 'lucide-react'
import axios from '../api/axios'
import { useNavigate, useParams, Link } from 'react-router-dom'

const CourseCreation = ({ isEdit = false }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Web Development',
    level: 'Beginner',
    thumbnail: null,
    sections: [
      { id: Date.now(), title: 'Introduction', lessons: [{ id: Date.now() + 1, title: 'Welcome to the Course', videoUrl: '' }] }
    ]
  })

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (isEdit && id) {
      fetchCourseDetails()
    }
  }, [isEdit, id])

  const fetchCourseDetails = async () => {
    try {
      const { data } = await axios.get(`/courses/view/${id}`)
      const course = data.course
      setCourseData({
        title: course.title,
        description: course.description,
        price: course.price,
        category: course.category,
        level: course.level,
        thumbnail: null, // Keep null to not overwrite unless changed
        sections: course.sections.map(s => ({ ...s, id: s._id || Date.now() + Math.random() }))
      })
    } catch (err) {
      console.error('Failed to fetch course details', err)
      alert('Could not load course details')
      navigate('/instructor/dashboard')
    } finally {
      setFetching(false)
    }
  }

  const handleAddSection = () => {
    setCourseData({
      ...courseData,
      sections: [...courseData.sections, { id: Date.now(), title: 'New Section', lessons: [] }]
    })
  }

  const handleAddLesson = (sectionId) => {
    const updatedSections = courseData.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: [...section.lessons, { id: Date.now(), title: 'New Lesson', videoUrl: '' }]
        }
      }
      return section
    })
    setCourseData({ ...courseData, sections: updatedSections })
  }

  const handleRemoveLesson = (sectionId, lessonId) => {
    const updatedSections = courseData.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
        }
      }
      return section
    })
    setCourseData({ ...courseData, sections: updatedSections })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Thumbnail required only for new courses
    if (!isEdit && !courseData.thumbnail) {
      alert('Please upload a course thumbnail.')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', courseData.title)
      formData.append('description', courseData.description)
      formData.append('price', courseData.price)
      formData.append('category', courseData.category)
      formData.append('level', courseData.level)
      
      if (courseData.thumbnail) {
        formData.append('thumbnail', courseData.thumbnail)
      }
      
      formData.append('sections', JSON.stringify(courseData.sections))

      if (isEdit) {
        await axios.put(`/courses/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        alert('Course updated successfully!')
      } else {
        await axios.post('/courses/create', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        alert('Course created successfully!')
      }
      
      navigate('/instructor/dashboard')
    } catch (error) {
      console.error('Action failed', error)
      alert(error.response?.data?.error || 'Error occurred. Check console.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
    </div>
  )

  return (
    <div className="course-creation-page py-16 animate-fade-in bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <header className="mb-12 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/instructor/dashboard" className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
                <h1 className="text-4xl font-bold mb-2">{isEdit ? 'Edit Course' : 'Create New Course'}</h1>
                <p className="text-text-muted">{isEdit ? 'Update your course content and details' : 'Fill in the details to launch your premium learning content.'}</p>
            </div>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2 px-8 py-3">
            {loading ? (isEdit ? 'Updating...' : 'Creating...') : <> <Save className="h-5 w-5" /> {isEdit ? 'Save Changes' : 'Publish Course'} </>}
          </button>
        </header>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <section className="glass p-8 rounded-3xl border border-border/50">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="text-primary h-6 w-6" />
                Basic Information
              </h2>
              <div className="flex flex-col gap-6">
                <div className="form-group flex flex-col gap-2">
                  <label className="text-sm font-semibold opacity-70">Course Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Master Advanced React Patterns" 
                    value={courseData.title}
                    onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                    required
                    className="w-full text-lg" 
                  />
                </div>
                <div className="form-group flex flex-col gap-2">
                  <label className="text-sm font-semibold opacity-70">Description</label>
                  <textarea 
                    placeholder="Provide a detailed roadmap of what students will learn..." 
                    value={courseData.description}
                    onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                    required
                    className="w-full h-48 resize-none" 
                  />
                </div>
              </div>
            </section>

            <section className="glass p-8 rounded-3xl border border-border/50">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Layout className="text-secondary h-6 w-6" />
                Course Curriculum
              </h2>
              
              <div className="sections-container flex flex-col gap-6">
                {courseData.sections.map((section, sIdx) => (
                  <div key={section.id || sIdx} className="section-item border border-border/30 rounded-2xl bg-white/5 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <input 
                        type="text" 
                        value={section.title}
                        onChange={(e) => {
                          const newSections = [...courseData.sections]
                          newSections[sIdx].title = e.target.value
                          setCourseData({...courseData, sections: newSections})
                        }}
                        className="bg-transparent border-none text-lg font-bold p-0 focus:ring-0 w-2/3 underline decoration-primary/30 underline-offset-4"
                      />
                      <button 
                        onClick={() => {
                          const newSections = courseData.sections.filter((_, idx) => idx !== sIdx)
                          setCourseData({...courseData, sections: newSections})
                        }}
                        type="button"
                        className="text-danger p-2 hover:bg-danger/10 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="lessons-container flex flex-col gap-3 pl-4 border-l-2 border-primary/20">
                      {(section.lessons || []).map((lesson, lIdx) => (
                        <div key={lesson.id || lIdx} className="lesson-item flex items-center gap-4 bg-background/50 p-4 rounded-xl border border-border/20">
                          <Video className="h-5 w-5 text-text-muted" />
                          <input 
                            type="text" 
                            placeholder="Lesson Title" 
                            value={lesson.title}
                            onChange={(e) => {
                              const newSections = [...courseData.sections]
                              newSections[sIdx].lessons[lIdx].title = e.target.value
                              setCourseData({...courseData, sections: newSections})
                            }}
                            required
                            className="bg-transparent border-none text-sm p-0 focus:ring-0 flex-grow"
                          />
                          <button onClick={() => handleRemoveLesson(section.id, lesson.id)} type="button" className="text-text-muted hover:text-danger p-1"><X className="h-4 w-4" /></button>
                        </div>
                      ))}
                      <button 
                        onClick={() => handleAddLesson(section.id)}
                        type="button"
                        className="flex items-center gap-2 text-xs font-bold text-primary mt-2 p-2 hover:bg-primary/5 rounded-lg w-fit"
                      >
                        <Plus className="h-4 w-4" /> Add Lesson
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={handleAddSection}
                  type="button"
                  className="w-full py-4 border-2 border-dashed border-border/50 rounded-2xl text-text-muted hover:border-primary hover:text-primary transition-all font-bold flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" /> Add New Section
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar Settings */}
          <aside className="flex flex-col gap-8">
            <section className="glass p-8 rounded-3xl border border-border/50">
              <h3 className="text-lg font-bold mb-6">Pricing & Details</h3>
              <div className="flex flex-col gap-6">
                <div className="form-group flex flex-col gap-2">
                  <label className="text-sm font-semibold opacity-70">Price ($)</label>
                  <input 
                    type="number" 
                    placeholder="99" 
                    value={courseData.price}
                    onChange={(e) => setCourseData({...courseData, price: e.target.value})}
                    required
                    min="0"
                    className="w-full" 
                  />
                </div>
                <div className="form-group flex flex-col gap-2">
                  <label className="text-sm font-semibold opacity-70">Category</label>
                  <select 
                    value={courseData.category}
                    onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                    required
                    className="w-full"
                  >
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>Design</option>
                  </select>
                </div>
                <div className="form-group flex flex-col gap-2">
                  <label className="text-sm font-semibold opacity-70">Course Level</label>
                  <select 
                    value={courseData.level}
                    onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                    required
                    className="w-full"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="glass p-8 rounded-3xl border border-border/50">
              <h3 className="text-lg font-bold mb-6">Course Thumbnail</h3>
              <div className="thumbnail-upload aspect-video w-full rounded-2xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-4 bg-white/5 overflow-hidden relative group">
                {courseData.thumbnail ? (
                  <img src={URL.createObjectURL(courseData.thumbnail)} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Layout className="h-10 w-10 text-text-muted" />
                    <span className="text-xs text-text-muted font-medium text-center px-4">Upload a high-quality thumbnail (16:9)</span>
                  </>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setCourseData({...courseData, thumbnail: e.target.files[0]})}
                />
                <div className="absolute inset-0 bg-black/40 items-center justify-center hidden group-hover:flex">
                  <span className="text-white text-xs font-bold">Replace Image</span>
                </div>
              </div>
              {isEdit && <p className="text-[10px] text-text-muted mt-2 text-center italic">Only upload a new image if you want to replace the current one.</p>}
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CourseCreation
