import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://filters.dev.speedio.com.br/api/v3/filters.json'
})

export const api = {
  get (url) {
    return axiosInstance.get(url)
  }
}
