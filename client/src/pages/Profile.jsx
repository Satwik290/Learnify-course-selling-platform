import { useState, useEffect } from 'react'
import { User, Camera, Settings, Shield, Bell, Loader2, Save, X, Trash2, AlertTriangle } from 'lucide-react'
import axios from '../api/axios'
import { useAuth } from '../context/auth'

const Profile = () => {
  const { user: authUser, logout } = useAuth()
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    about: '',
    skills: [],
    photoUrl: '',
    role: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [activeSettingsTab, setActiveSettingsTab] = useState('general')

  useEffect(() => {
    if (authUser) {
      setProfile(authUser)
      setLoading(false)
    }
  }, [authUser])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await axios.put('/profile/update', profile)
      setProfile(data.user)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Update failed', error)
      alert('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirm1 = window.confirm('WARNING: This will permanently delete your account and all associated data (courses, progress, certificates). Are you absolutely sure?')
    if (!confirm1) return
    
    const confirm2 = window.prompt('To confirm deletion, please type your email address below:')
    if (confirm2 !== profile.email) {
        alert('Email mismatch. Deletion cancelled.')
        return
    }

    setDeleting(true)
    try {
      await axios.delete('/profile/delete-account')
      alert('Your account has been successfully deleted.')
      logout()
    } catch (err) {
      alert('Failed to delete account. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const addSkill = () => {
    if (newSkill && !profile.skills.includes(newSkill)) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill] })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) })
  }

  if (loading) return <div className="py-24 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" /></div>

  return (
    <div className="profile-page py-16 animate-fade-in bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-12 flex flex-col md:flex-row items-center gap-10 bg-surface p-12 rounded-[40px] border border-border/50 shadow-2xl relative overflow-hidden group">
          <div className="relative">
            <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-primary/10 shadow-inner group-hover:scale-105 transition-transform duration-500">
              <img src={profile.photoUrl || 'https://i.ibb.co/4pDNDk1/avatar.png'} alt={profile.firstName} className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-1 right-1 p-3 bg-primary text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all">
              <Camera className="h-5 w-5" />
            </button>
          </div>
          
          <div className="text-center md:text-left z-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
              <h1 className="text-4xl font-extrabold tracking-tight">{profile.firstName} {profile.lastName}</h1>
              <span className="px-4 py-1.5 bg-secondary/10 text-secondary text-[10px] font-bold rounded-full border border-secondary/20 uppercase tracking-widest">
                {profile.role}
              </span>
            </div>
            <p className="text-xl text-text-muted mb-6 font-medium">{profile.email}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {profile.skills.map(skill => (
                <span key={skill} className="px-4 py-1.5 bg-white/5 text-text-muted text-xs font-bold rounded-xl border border-border/30 hover:border-primary/30 transition-colors uppercase tracking-tight">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 filter blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        </header>

        <div className="grid lg:grid-cols-4 gap-12">
          <aside className="lg:col-span-1 flex flex-col gap-3">
            <button 
                onClick={() => setActiveSettingsTab('general')}
                className={`flex items-center gap-4 p-5 rounded-2xl transition-all border ${activeSettingsTab === 'general' ? 'bg-primary/10 text-primary font-bold border-primary/10' : 'text-text-muted hover:bg-white/5 border-transparent'}`}
            >
              <User className="h-5 w-5" />
              General
            </button>
            <button 
                onClick={() => setActiveSettingsTab('danger')}
                className={`flex items-center gap-4 p-5 rounded-2xl transition-all border ${activeSettingsTab === 'danger' ? 'bg-danger/10 text-danger font-bold border-danger/10' : 'text-text-muted hover:bg-danger/5 border-transparent group'}`}
            >
              <Trash2 className={`h-5 w-5 ${activeSettingsTab === 'danger' ? 'text-danger' : 'group-hover:text-danger'}`} />
              Danger Zone
            </button>
            <button onClick={logout} className="flex items-center gap-4 p-5 rounded-2xl text-danger hover:bg-danger/5 transition-all mt-6 border border-transparent hover:border-danger/10">
              <X className="h-5 w-5" />
              Sign Out
            </button>
          </aside>

          <main className="lg:col-span-3 glass p-12 rounded-[40px] border border-border/50 shadow-xl">
            {activeSettingsTab === 'general' ? (
                <>
                <h2 className="text-2xl font-bold mb-10 flex items-center gap-2">
                    <Settings className="text-primary h-6 w-6" /> Personal Details
                </h2>
                
                <form onSubmit={handleUpdate} className="flex flex-col gap-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="form-group flex flex-col gap-3">
                    <label className="text-sm font-bold text-text-muted uppercase tracking-widest">First Name</label>
                    <input 
                        type="text" 
                        value={profile.firstName} 
                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                        className="w-full text-lg h-14 bg-background/50" 
                    />
                    </div>
                    <div className="form-group flex flex-col gap-3">
                    <label className="text-sm font-bold text-text-muted uppercase tracking-widest">Last Name</label>
                    <input 
                        type="text" 
                        value={profile.lastName} 
                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                        className="w-full text-lg h-14 bg-background/50" 
                    />
                    </div>
                </div>

                <div className="form-group flex flex-col gap-3">
                    <label className="text-sm font-bold text-text-muted uppercase tracking-widest">About / Bio</label>
                    <textarea 
                    value={profile.about} 
                    onChange={(e) => setProfile({...profile, about: e.target.value})}
                    placeholder="Tell us about yourself, your career goals, and passions..."
                    className="w-full h-36 resize-none bg-background/50 p-5 text-lg" 
                    />
                </div>

                <div className="form-group flex flex-col gap-3">
                    <label className="text-sm font-bold text-text-muted uppercase tracking-widest">Manage Skills</label>
                    <div className="flex flex-wrap gap-2 mb-4 bg-background/30 p-4 rounded-2xl border border-border/20 min-h-[60px]">
                    {profile.skills.map(skill => (
                        <span key={skill} className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg border border-primary/20">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)}><X className="h-3 w-3 hover:text-white" /></button>
                        </span>
                    ))}
                    </div>
                    <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="E.g. Full-stack development, Python, AWS..." 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="flex-grow h-14 bg-background/50 text-base"
                    />
                    <button type="button" onClick={addSkill} className="btn-secondary h-14 px-8 font-bold">Add</button>
                    </div>
                </div>
                
                <div className="flex justify-end pt-10 border-t border-border/30">
                    <button type="submit" disabled={saving} className="btn-primary px-12 py-4 text-lg font-extrabold flex items-center gap-3">
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Save All Changes
                    </button>
                </div>
                </form>
                </>
            ) : (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-danger">
                        <AlertTriangle className="h-7 w-7" /> Platform Danger Zone
                    </h2>
                    <p className="text-text-muted mb-10 leading-relaxed">
                        Deleting your account is a permanent action. All your course enrollments, progress, certificates, 
                        and contributions will be scrubbed from our systems. There is no recovery process.
                    </p>
                    
                    <div className="bg-danger/5 border border-danger/20 p-8 rounded-[32px]">
                        <h4 className="font-bold text-lg mb-2">Delete My Account</h4>
                        <p className="text-sm text-text-muted mb-8">Once you delete your account, there is no going back. Please be certain.</p>
                        <button 
                            onClick={handleDeleteAccount}
                            disabled={deleting}
                            className="bg-danger text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-danger-hover shadow-xl shadow-danger/20 flex items-center gap-3 transition-all active:scale-95"
                        >
                            {deleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                            Permanently Delete My Account
                        </button>
                    </div>
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Profile
