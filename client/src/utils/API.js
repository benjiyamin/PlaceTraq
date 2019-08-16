import axios from 'axios'

export default {
  getProjects: query => {
    let url = '/api/projects'
    if (query.search) url += `?search=${query.search}`
    if (query.userId) url += `?userId=${query.userId}`
    return axios.get(url)
  },
  getProject: id => axios.get(`/api/projects/${id}`),
  followProject: id => axios.put(`/api/projects/${id}/follow`),
  unfollowProject: id => axios.put(`/api/projects/${id}/follow?unfollow=true`),
  postProject: projectData => axios.post('/api/projects', projectData),
  putProject: projectData => axios.put('/api/projects', projectData),
  getGroups: () => axios.get('/api/groups'),
  getGroup: id => axios.get(`/api/groups/${id}`),
  postGroup: groupData => axios.post('/api/groups', groupData),
  putGroup: groupData => axios.put('/api/groups', groupData),
  getRequestUser: () => axios.get('/auth/user'),
  getEvents: query => {
    let url = '/api/events'
    if (query.userId) url += `?userId=${query.userId}`
    return axios.get(url)
  },
  login: loginData => axios.post('/auth/login', loginData),
  signup: signupData => axios.post('/auth/signup', signupData),
  logout: () => axios.get('/auth/logout')
}
