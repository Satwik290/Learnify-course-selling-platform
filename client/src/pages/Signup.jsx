import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, UserPlus, Loader2 } from 'lucide-react'
import { useAuth } from '../context/auth'

const Signup = () => {
  const navigate = useNavigate()
  const { user, signup, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    gender: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else if (user.role === 'instructor') {
        navigate('/instructor/dashboard')
      } else {
        navigate('/dashboard')
      }
    }
  }, [user, authLoading, navigate])

  if (authLoading) return null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signup(formData)
    } catch (error) {
      console.error('Signup failed', error)
      alert(error.response?.data?.message || 'Error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page py-24 flex items-center justify-center animate-fade-in bg-background">
      <div className="glass p-12 rounded-[40px] border border-border/50 w-full max-w-lg shadow-2xl relative overflow-hidden">
        <div className="text-center mb-10 relative z-10">
          <h2 className="text-4xl font-extrabold mb-3 tracking-tighter">Join Learnify Platform</h2>
          <p className="text-text-muted font-medium text-lg leading-relaxed">Start your journey with thousands of world-class learners today.</p>
        </div>

        {/* Demo hint banner */}
        <div style={{
          background: 'rgba(99,102,241,0.07)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '0.875rem',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          position: 'relative',
          zIndex: 10,
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🚀 <strong style={{ color: 'var(--text-main)' }}>Recruiter?</strong> Use the demo quick-login on Sign In page.
          </span>
          <Link to="/login" style={{
            fontSize: '0.75rem', fontWeight: 700,
            color: 'var(--primary)', whiteSpace: 'nowrap',
          }}>Login → </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group flex flex-col gap-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest">First Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input 
                  type="text" 
                  name="firstName"
                  placeholder="John" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 h-14 bg-background/50 border-border/30 focus:border-primary/50" 
                />
              </div>
            </div>
            <div className="form-group flex flex-col gap-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Last Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                <input 
                  type="text" 
                  name="lastName"
                  placeholder="Doe" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 h-14 bg-background/50 border-border/30 focus:border-primary/50" 
                />
              </div>
            </div>
          </div>
          
          <div className="form-group flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input 
                type="email" 
                name="email"
                placeholder="john@example.com" 
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 h-14 bg-background/50 border-border/30 focus:border-primary/50" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group flex flex-col gap-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Age</label>
              <input 
                type="number" 
                name="age"
                placeholder="25" 
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full h-14 bg-background/50 border-border/30" 
              />
            </div>
            <div className="form-group flex flex-col gap-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Gender</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full h-14 bg-background/50 border-border/30"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-group flex flex-col gap-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input 
                type="password" 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 h-14 bg-background/50 border-border/30 focus:border-primary/50" 
              />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-6 flex items-center justify-center gap-3 font-extrabold shadow-lg">
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <UserPlus className="h-6 w-6" />}
            Join Learnify Now
          </button>
        </form>
        
        <div className="text-center mt-10 pt-8 border-t border-border/30 relative z-10">
          <p className="text-text-muted">Already a member? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link></p>
        </div>

        {/* Decorative flair */}
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-secondary/10 filter blur-[40px] rounded-full" />
      </div>
    </div>
  )
}

export default Signup
