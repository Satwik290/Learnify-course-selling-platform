import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Courses from './pages/Courses'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import CourseCreation from './pages/CourseCreation'
import CourseDetail from './pages/CourseDetail'
import AdminDashboard from './pages/AdminDashboard'
import InstructorDashboard from './pages/InstructorDashboard'
import InstructorProfile from './pages/InstructorProfile'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthProvider'

function App() {
  return (
    <AuthProvider>
      <div className="app-container min-h-screen flex flex-col bg-background text-text-main">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/instructor/:id" element={<InstructorProfile />} />

            {/* Protected Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student', 'admin', 'instructor']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin/Instructor Protected Routes (Future/Current) */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'instructor']} />}>
              <Route path="/courses/create" element={<CourseCreation />} />
              <Route path="/courses/edit/:id" element={<CourseCreation isEdit={true} />} />
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            </Route>

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
