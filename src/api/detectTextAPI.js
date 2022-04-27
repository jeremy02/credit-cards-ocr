import axios from 'axios'

const apiKey = process.env.GOOGLE_API_KEY

const api = axios.create({
  baseURL: 'https://vision.googleapis.com/v1/'
})

// Detect text in images
async function detectTextFromImage (requestBody) {
    const response = await api.post('images:annotate?key='+apiKey, requestBody);
    return response
}

export default {
  detectTextFromImage: (data) => detectTextFromImage(data)
}
