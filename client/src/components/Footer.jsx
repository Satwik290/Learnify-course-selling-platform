import { Link } from 'react-router-dom'
import { BookOpen, Code2, Globe, Briefcase, Share2 } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-surface py-16 border-t border-border mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="footer-brand">
          <Link to="/" className="logo flex items-center gap-2 mb-6" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <BookOpen style={{ color: 'var(--primary)', width: '2rem', height: '2rem' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Learnify</span>
          </Link>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            Empowering the next generation of creators, developers, and designers with 
            industry-leading skills and practical knowledge.
          </p>
          <div className="social-links" style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }} onMouseEnter={e => e.target.style.color='var(--primary)'} onMouseLeave={e => e.target.style.color='var(--text-muted)'}><Code2 style={{ width: '1.25rem', height: '1.25rem' }} /></a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }} onMouseEnter={e => e.target.style.color='var(--primary)'} onMouseLeave={e => e.target.style.color='var(--text-muted)'}><Globe style={{ width: '1.25rem', height: '1.25rem' }} /></a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }} onMouseEnter={e => e.target.style.color='var(--primary)'} onMouseLeave={e => e.target.style.color='var(--text-muted)'}><Briefcase style={{ width: '1.25rem', height: '1.25rem' }} /></a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }} onMouseEnter={e => e.target.style.color='var(--primary)'} onMouseLeave={e => e.target.style.color='var(--text-muted)'}><Share2 style={{ width: '1.25rem', height: '1.25rem' }} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Quick Links</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', listStyle: 'none' }}>
            <li><Link to="/courses" className="footer-link">All Courses</Link></li>
            <li><Link to="/login" className="footer-link">Sign In</Link></li>
            <li><Link to="/signup" className="footer-link">Join for Free</Link></li>
            <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Support</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', listStyle: 'none' }}>
            <li><a href="#" className="footer-link">Help Center</a></li>
            <li><a href="#" className="footer-link">Terms of Service</a></li>
            <li><a href="#" className="footer-link">Privacy Policy</a></li>
            <li><a href="#" className="footer-link">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Stay Updated</h4>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>Subscribe to our newsletter for the latest updates.</p>
          <div className="newsletter-form" style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="email" placeholder="email@example.com" style={{ flex: 1, fontSize: '0.875rem' }} />
            <button className="btn-primary" style={{ padding: '0.625rem 1rem', whiteSpace: 'nowrap' }}>Join</button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>© 2024 Learnify Platform. Built with ❤️ for passionate learners.</p>
      </div>
    </footer>
  )
}

export default Footer
