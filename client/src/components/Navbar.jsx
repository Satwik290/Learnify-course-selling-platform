import { Link, NavLink } from 'react-router-dom'
import { BookOpen, User, LogOut, Menu, X, Shield, BarChart3 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/auth'
import './Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <nav className="navbar glass sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="logo flex items-center gap-2">
          <BookOpen className="text-primary h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">Learnify</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
          <NavLink to="/courses" className={({ isActive }) => isActive ? 'active' : ''}>Courses</NavLink>
          {user ? (
            <>
              {user.role === 'admin' && (
                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : 'flex items-center gap-1'}>
                  <Shield className="h-4 w-4" /> Admin
                </NavLink>
              )}
              {(user.role === 'instructor' || user.role === 'admin') && (
                <NavLink to="/instructor/dashboard" className={({ isActive }) => isActive ? 'active' : 'flex items-center gap-1'}>
                  <BarChart3 className="h-4 w-4" /> Instructor
                </NavLink>
              )}
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
              <div className="flex items-center gap-4 border-l border-border pl-6">
                <Link to="/profile" className="flex items-center gap-2 text-text-muted hover:text-white">
                  <User className="h-5 w-5" />
                  {user.firstName}
                </Link>
                <button onClick={logout} className="text-danger flex items-center gap-2 hover:opacity-80">
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/signup" className="btn-primary">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden glass fixed inset-0 top-[72px] z-40 p-6 animate-fade-in">
          <div className="flex flex-col gap-6 text-lg font-medium">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/courses" onClick={() => setIsOpen(false)}>Courses</Link>
            {user ? (
               <>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> Admin Panel
                  </Link>
                )}
                {(user.role === 'instructor' || user.role === 'admin') && (
                  <Link to="/instructor/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-secondary" /> Instructor Panel
                  </Link>
                )}
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
                <button onClick={() => { logout(); setIsOpen(false); }} className="text-left text-danger">Logout</button>
               </>
            ) : (
              <>
                <div className="h-px bg-border my-4" />
                <Link to="/login" className="w-full text-center py-3 rounded-lg border border-primary text-primary" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/signup" className="w-full text-center py-3 rounded-lg bg-primary text-white" onClick={() => setIsOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
