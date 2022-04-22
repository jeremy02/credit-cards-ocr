// The Detect text Request JSON body
let detectTextRequestBody = { // OCR request
    "requests":[
            {
                "image":{
                "content":null,
            },
            "features": [
                {
                    "maxResults": 50,
                    "model": "builtin/latest",
                    "type": "TEXT_DETECTION" // DOCUMENT_TEXT_DETECTION
                },
            ],
            "imageContext": {
                // "languageHints": ["en"],
                "cropHintsParams": {
                    "aspectRatios": [
                        0.8,
                        1,
                        1.2
                    ]
                }
            }
        }
    ]
};

export default {
  detectTextRequestBody: detectTextRequestBody
}
