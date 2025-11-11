import axios from 'axios'

const API_URL = '/api/contacts'

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

apiClient.interceptors.request.use(
    config => {
        console.log(`🚀 发起请求: ${config.method?.toUpperCase()} ${config.url}`)
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        console.error('❌ 请求错误:', error)
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    response => {
        console.log('响应成功:', response.data)
        return response
    },
    error => {
        console.error('响应错误:', error)
        if (error.response) {
            const message = error.response.data?.message || error.response.data || '服务器错误'
            return Promise.reject(new Error(message))
        } else if (error.request) {
            return Promise.reject(new Error('网络连接失败，请检查网络连接'))
        } else {
            return Promise.reject(new Error('请求配置错误: ' + error.message))
        }
    }
)

const contactService = {
    getAllContacts() {
        return apiClient.get('/')
    },

    getContactById(id) {
        return apiClient.get(`/${id}`)
    },

    createContact(contact) {
        return apiClient.post('/', contact)
    },

    updateContact(id, contact) {
        return apiClient.put(`/${id}`, contact)
    },

    deleteContact(id) {
        return apiClient.delete(`/${id}`)
    },

    searchContacts(keyword) {
        return apiClient.get('/search', {
            params: { keyword }
        })
    },

    importContacts(file) {
        const formData = new FormData()
        formData.append('file', file)
        return apiClient.post('/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    exportContacts() {
        return apiClient.get('/export', {
            responseType: 'blob'
        })
    }
}

export default contactService