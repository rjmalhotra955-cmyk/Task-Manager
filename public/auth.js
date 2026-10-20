const getToken = () => localStorage.getItem('token')

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('name')
  window.location.href = 'login.html'
}

// no token → go to login
if (!getToken()) {
  window.location.href = 'login.html'
}

// send the token with every axios request
axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`

// if the server says 401 (expired/invalid token) → log out
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout()
    }
    return Promise.reject(error)
  }
)