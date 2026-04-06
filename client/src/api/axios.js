import axios from 'axios'

// Configure axios globally, runs before any component mounts
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

export default axios
