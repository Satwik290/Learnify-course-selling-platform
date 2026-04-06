import { useState, useEffect } from 'react'
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Shield, 
  Trash2, 
  Search, 
  Filter, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [instructorPerformance, setInstructorPerformance] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, coursesRes, performanceRes] = await Promise.all([
        axios.get('/admin/stats'),
        axios.get('/admin/users'),
        axios.get('/admin/courses'),
        axios.get('/admin/instructors-performance')
      ])
      setStats(statsRes.data.stats)
      setUsers(usersRes.data.users)
      setCourses(coursesRes.data.courses)
      setInstructorPerformance(performanceRes.data.performance)
    } catch (err) {
      console.error('Failed to fetch admin data', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    setActionLoading(userId)
    try {
      await axios.patch(`/admin/role/${userId}`, { role: newRole })
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u))
      fetchData() // Refresh performance and stats
    } catch (err) {
      console.warn('Failed to update role:', err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure? This will delete the user and all their context.')) return
    setActionLoading(userId)
    try {
      await axios.delete(`/admin/user/${userId}`)
      setUsers(users.filter(u => u._id !== userId))
      fetchData() // Refresh stats
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course permanently?')) return
    setActionLoading(courseId)
    try {
      await axios.delete(`/admin/course/${courseId}`)
      setCourses(courses.filter(c => c._id !== courseId))
      fetchData() // Refresh stats
    } catch (err) {
      console.error('Course deletion error:', err.message)
      alert('Failed to delete course')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
    </div>
  )

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPerformance = instructorPerformance.filter(p => 
    `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="admin-dashboard py-12 animate-fade-in px-6">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold flex items-center gap-3 mb-2">
            <Shield className="text-primary h-10 w-10" />
            Admin Control Center
          </h1>
          <p className="text-text-muted text-lg">Manage users, courses, and platform health.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass p-8 rounded-[32px] border border-border/40 relative overflow-hidden group">
            <div className="relative z-10">
              <Users className="text-primary h-8 w-8 mb-4" />
              <p className="text-text-muted font-bold text-sm uppercase tracking-widest mb-1">Total Users</p>
              <h3 className="text-4xl font-black">{stats?.totalUsers || 0}</h3>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users size={160} />
            </div>
          </div>
          <div className="glass p-8 rounded-[32px] border border-border/40 relative overflow-hidden group">
            <div className="relative z-10">
              <BookOpen className="text-secondary h-8 w-8 mb-4" />
              <p className="text-text-muted font-bold text-sm uppercase tracking-widest mb-1">Total Courses</p>
              <h3 className="text-4xl font-black">{stats?.totalCourses || 0}</h3>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen size={160} />
            </div>
          </div>
          <div className="glass p-8 rounded-[32px] border border-border/40 relative overflow-hidden group">
            <div className="relative z-10">
              <BarChart3 className="text-accent h-8 w-8 mb-4" />
              <p className="text-text-muted font-bold text-sm uppercase tracking-widest mb-1">Enrollments</p>
              <h3 className="text-4xl font-black">{stats?.totalEnrollments || 0}</h3>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <BarChart3 size={160} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-background/40 p-2 rounded-2xl border border-border/30 w-fit">
          {['overview', 'users', 'courses', 'instructors'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-bold capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-text-muted hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="glass rounded-[40px] border border-border/40 p-8 min-h-[500px]">
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="text-primary h-5 w-5" /> User Roles Breakdown
                </h4>
                <div className="flex flex-col gap-4">
                  {Object.entries(stats?.roles || {}).map(([role, count]) => (
                    <div key={role} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-border/20">
                      <span className="capitalize font-medium">{role}s</span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Filter className="text-secondary h-5 w-5" /> Course Categories
                </h4>
                <div className="flex flex-col gap-4">
                   {Object.entries(stats?.categories || {}).map(([cat, count]) => (
                    <div key={cat} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-border/20">
                      <span className="font-medium">{cat}</span>
                      <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <>
              <div className="flex justify-between items-center mb-8 gap-4">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 w-full"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/30 text-text-muted text-sm uppercase tracking-widest font-bold">
                      <th className="pb-4 px-4">User</th>
                      <th className="pb-4 px-4">Role</th>
                      <th className="pb-4 px-4">Joined</th>
                      <th className="pb-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id} className="border-b border-border/10 group hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-primary/20 overflow-hidden">
                              {user.photoUrl ? <img src={user.photoUrl} alt="" className="w-full h-full object-cover" /> : user.firstName[0]}
                            </div>
                            <div>
                              <p className="font-bold">{user.firstName} {user.lastName}</p>
                              <p className="text-xs text-text-muted">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <select 
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                            disabled={actionLoading === user._id}
                            className="bg-background/50 border-none text-xs font-bold py-1 px-3 rounded-full cursor-pointer focus:ring-0"
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-sm text-text-muted">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button 
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={actionLoading === user._id}
                            className="text-text-muted hover:text-danger p-2 transition-colors"
                          >
                            {actionLoading === user._id ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'courses' && (
            <>
              <div className="flex justify-between items-center mb-8 gap-4">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Search courses..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {filteredCourses.map(course => (
                  <div key={course._id} className="flex items-center gap-6 bg-white/5 p-4 rounded-3xl border border-border/20 group hover:border-border/40 transition-all">
                    <img src={course.thumbnail} className="h-20 w-32 object-cover rounded-xl border border-border/20" alt="" />
                    <div className="flex-grow">
                      <p className="font-bold text-lg mb-1">{course.title}</p>
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                         <span className="flex items-center gap-1"><Users className="h-3 w-3" /> By {course.creator?.firstName} {course.creator?.lastName}</span>
                         <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 px-4">
                       <div className="text-right">
                          <p className="text-sm font-bold text-primary">${course.price}</p>
                          <p className="text-[10px] text-text-muted uppercase font-black uppercase tracking-tighter">{course.level}</p>
                       </div>
                       <button 
                        onClick={() => handleDeleteCourse(course._id)}
                        disabled={actionLoading === course._id}
                        className="bg-danger/10 text-danger p-3 rounded-2xl hover:bg-danger hover:text-white transition-all shadow-lg hover:shadow-danger/20"
                       >
                         {actionLoading === course._id ? <Loader2 className="animate-spin h-5 w-5" /> : <Trash2 className="h-5 w-5" />}
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'instructors' && (
            <>
              <div className="flex justify-between items-center mb-8 gap-4">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Search instructors..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 w-full"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-text-muted text-sm uppercase tracking-widest font-bold">
                      <th className="pb-4 px-6">Instructor</th>
                      <th className="pb-4 px-6">Courses</th>
                      <th className="pb-4 px-6">Students</th>
                      <th className="pb-4 px-6 text-right">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPerformance.map(inst => (
                      <tr 
                        key={inst._id} 
                        className="bg-white/5 hover:bg-white/10 transition-all rounded-3xl cursor-pointer group"
                        onClick={() => navigate(`/instructor/${inst._id}`)}
                      >
                        <td className="py-6 px-6 first:rounded-l-3xl">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-secondary/20 flex items-center justify-center font-bold text-secondary border border-secondary/20 overflow-hidden">
                              {inst.photoUrl ? <img src={inst.photoUrl} alt="" className="w-full h-full object-cover" /> : inst.firstName[0]}
                            </div>
                            <div>
                              <p className="font-bold text-lg leading-none mb-1 group-hover:text-primary transition-colors">{inst.firstName} {inst.lastName}</p>
                              <p className="text-xs text-text-muted">{inst.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                           <div className="flex items-center gap-2">
                             <BookOpen className="h-4 w-4 text-secondary/70" />
                             <span className="font-bold">{inst.totalCourses}</span>
                           </div>
                        </td>
                        <td className="py-6 px-6">
                           <div className="flex items-center gap-2">
                             <Users className="h-4 w-4 text-primary/70" />
                             <span className="font-bold">{inst.totalStudents}</span>
                           </div>
                        </td>
                        <td className="py-6 px-6 text-right last:rounded-r-3xl">
                           <div className="flex items-center justify-end gap-2">
                             <DollarSign className="h-4 w-4 text-accent" />
                             <span className="text-2xl font-black text-accent">${inst.totalRevenue.toLocaleString()}</span>
                           </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPerformance.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-20 text-text-muted font-bold italic">No instructor performance data found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
