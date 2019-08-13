import axios from 'axios'

export default {
  getProjects: search => {
    let url = '/api/projects'
    if (search) url += `?search=${search}`
    return axios.get(url)
  },
  getProject: id => axios.get(`/api/projects/${id}`),
  followProject: id => axios.put(`/api/projects/${id}/follow`),
  unfollowProject: id => axios.put(`/api/projects/${id}/follow?unfollow=true`),
  postProject: projectData => axios.post('/api/projects', projectData),
  putProject: projectData => axios.put('/api/projects', projectData),
  getGroup: id => axios.get(`/api/groups/${id}`),
  postGroup: groupData => axios.post('/api/groups', groupData),
  putGroup: groupData => axios.put('/api/groups', groupData),
  getRequestUser: () => axios.get('/auth/user'),
  login: loginData => axios.post('/auth/login', loginData),
  logout: () => axios.get('/auth/logout')
}
