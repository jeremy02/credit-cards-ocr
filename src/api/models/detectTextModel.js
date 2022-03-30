// The Detect text Request JSON body
let detectTextRequestBody = { // OCR request
    "requests":[
            {
                "image":{
                "content":null,
            },
            "features": [
                {
                "type":"TEXT_DETECTION" // DOCUMENT_TEXT_DETECTION
                }
            ],
            "imageContext": {
            "languageHints": ["en"]
            }
        }
    ]
};

export default {
  detectTextRequestBody: detectTextRequestBody
}