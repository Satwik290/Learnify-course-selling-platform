import axios from 'axios'

// Configure axios globally, runs before any component mounts
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://learnify-server-df24.onrender.com/api'
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'

export default axios
