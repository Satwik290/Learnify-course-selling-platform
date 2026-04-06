import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn, Loader2, Zap } from 'lucide-react'
import { useAuth } from '../context/auth'

const DEMO_ACCOUNTS = [
  {
    label: 'Student',
    email: 'student@learnify.com',
    password: 'Demo@1234',
    color: '#10b981',
    emoji: '👨‍🎓',
    description: 'Browse & enroll in courses',
  },
  {
    label: 'Instructor',
    email: 'instructor@learnify.com',
    password: 'Demo@1234',
    color: '#6366f1',
    emoji: '👨‍🏫',
    description: 'Create & manage courses',
  },
  {
    label: 'Admin',
    email: 'admin@learnify.com',
    password: 'Demo@1234',
    color: '#f59e0b',
    emoji: '🛡️',
    description: 'Full platform access',
  },
]

const Login = () => {
  const navigate = useNavigate()
  const { user, login, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(null)
  const [error, setError] = useState('')

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (account) => {
    setError('')
    setDemoLoading(account.label)
    try {
      await login(account.email, account.password)
    } catch (err) {
      setError('Demo login failed. Make sure the server is running and seeded.')
    } finally {
      setDemoLoading(null)
    }
  }

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      background: 'var(--background)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        animation: 'fadeIn 0.4s ease',
      }}>

        {/* Demo Quick Login */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '1.5rem',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            color: 'var(--primary)',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            <Zap style={{ width: '1rem', height: '1rem' }} />
            Demo Quick Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.label}
                onClick={() => handleDemoLogin(account)}
                disabled={!!demoLoading}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.875rem 0.5rem',
                  borderRadius: '1rem',
                  border: `1.5px solid ${account.color}30`,
                  background: `${account.color}08`,
                  cursor: demoLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: demoLoading && demoLoading !== account.label ? 0.5 : 1,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${account.color}18`
                  e.currentTarget.style.borderColor = `${account.color}60`
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = `${account.color}08`
                  e.currentTarget.style.borderColor = `${account.color}30`
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>
                  {demoLoading === account.label
                    ? <Loader2 style={{ width: '1.5rem', height: '1.5rem', animation: 'spin 1s linear infinite', color: account.color }} />
                    : account.emoji
                  }
                </span>
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: account.color }}>
                  {account.label}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>
                  {account.description}
                </span>
              </button>
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textAlign: 'center', marginTop: '0.75rem', opacity: 0.7 }}>
            All demo accounts use password: <code style={{ color: 'var(--primary)', fontWeight: 700 }}>Demo@1234</code>
          </p>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>or sign in manually</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Login Card */}
        <div className="glass" style={{
          padding: '2.5rem',
          borderRadius: '2rem',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to continue.</p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '0.75rem',
              padding: '0.875rem 1rem',
              color: '#ef4444',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute', left: '1rem', top: '50%',
                transform: 'translateY(-50%)', width: '1.1rem', height: '1.1rem',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.75rem', height: '3rem', background: 'var(--background)' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute', left: '1rem', top: '50%',
                transform: 'translateY(-50%)', width: '1.1rem', height: '1.1rem',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '2.75rem', height: '3rem', background: 'var(--background)' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ height: '3rem', fontSize: '1rem', gap: '0.5rem', marginTop: '0.5rem' }}
            >
              {loading ? <Loader2 style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} /> : <LogIn style={{ width: '1.25rem', height: '1.25rem' }} />}
              Sign In
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            New to Learnify?{' '}
            <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
