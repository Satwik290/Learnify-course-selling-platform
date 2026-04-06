import { Link, useNavigate } from 'react-router-dom'
import { Rocket, Target, Zap, Award, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { useAuth } from '../context/auth'
import './Home.css'

const Home = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else if (user.role === 'instructor') {
        navigate('/instructor/dashboard')
      } else {
        navigate('/dashboard')
      }
    }
  }, [user, loading, navigate])

  if (loading) return null // Wait for auth to resolve before showing home
  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center z-10">
          <div className="badge inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold">
            <Zap className="h-4 w-4" />
            Discover the future of learning
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            Elevate Your Skills <br />
            <span className="text-primary">Master Any Field</span>
          </h1>
          <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto">
            Join thousands of learners on Learnify. Access premium courses, expert instructors, 
            and practical skills to transform your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              Get Started for Free
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link to="/courses" className="btn-secondary text-lg px-8 py-4">
              Browse All Courses
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary opacity-10 filter blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary opacity-10 filter blur-[100px] rounded-full" />
      </section>

      {/* Stats/Social Proof */}
      <section className="stats py-16 border-y border-border">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="stat-value text-3xl font-bold mb-1">50K+</div>
            <div className="stat-label text-text-muted text-sm uppercase tracking-wider font-semibold">Active Students</div>
          </div>
          <div>
            <div className="stat-value text-3xl font-bold mb-1">500+</div>
            <div className="stat-label text-text-muted text-sm uppercase tracking-wider font-semibold">Premium Courses</div>
          </div>
          <div>
            <div className="stat-value text-3xl font-bold mb-1">4.8/5</div>
            <div className="stat-label text-text-muted text-sm uppercase tracking-wider font-semibold">Student Ratings</div>
          </div>
          <div>
            <div className="stat-value text-3xl font-bold mb-1">95%</div>
            <div className="stat-label text-text-muted text-sm uppercase tracking-wider font-semibold">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Features/Why Choose Us */}
      <section className="features py-24 bg-surface/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Learn with Learnify?</h2>
            <p className="text-text-muted max-w-xl mx-auto">Experience a learning platform designed for growth, flexibility, and real-world results.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card glass p-8 rounded-2xl border border-border/50 hover:bg-white/5 transition-all">
              <div className="icon-box w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Expert Instructors</h3>
              <p className="text-text-muted leading-relaxed">Learn from top industry leaders who bring years of practical experience and passion to every lesson.</p>
            </div>
            
            <div className="feature-card glass p-8 rounded-2xl border border-border/50 hover:bg-white/5 transition-all">
              <div className="icon-box w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Practical Skills</h3>
              <p className="text-text-muted leading-relaxed">Focus on hands-on learning with real projects that build a portfolio you can show to potential employers.</p>
            </div>
            
            <div className="feature-card glass p-8 rounded-2xl border border-border/50 hover:bg-white/5 transition-all">
              <div className="icon-box w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">Recognized Certificates</h3>
              <p className="text-text-muted leading-relaxed">Earn industry-recognized certificates upon completion to validate your skills and advance your career.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
