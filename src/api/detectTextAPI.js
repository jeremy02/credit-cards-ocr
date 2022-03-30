import axios from 'axios'

const apiKey = process.env.GOOGLE_API_KEY

const api = axios.create({
  baseURL: 'https://vision.googleapis.com/v1/images:annotate?key='
})

// Detect text in images 
async function detectTextFromImage (requestBody) {
    console.log(fileData)
    const response = await axios.post("baseURL"+apiKey, fileData);
    return response  
}

export default {
  detectTextFromImage: (data) => detectTextFromImage(data)
}