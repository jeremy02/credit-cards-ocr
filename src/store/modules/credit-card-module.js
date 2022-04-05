import axios from 'axios'
import detectTextApi from '../../api/detectTextAPI'
import detectTextRequestBody from '../../api/models/detectTextModel'

import detectTextFunctions from './detectText';

// store the regexes here
const replaceExpiryCardRegex = /[^\d/\///\/]/g
const trimEmptySpaceRegex = /\s+/g

let initialMessage = {
    success: false,
    message: null,
};

const state = { 
    selectedImage: null,
    selectedImageBase64: null,
    messageResult: {
      success: false,
      message: null,
    },
    textAnnotationsDesc: null,
    fullTextAnnotationsDesc: null,
    extractedDetectedText: null,
    extractedCardNumber: null,
    extractedExpiryDate: null
};

const getters = {
    selectedImage: state => state.selectedImage,
    selectedImageBase64: state => state.selectedImageBase64,
    messageResult: state => state.messageResult,
    textAnnotationsDesc: state => state.textAnnotationsDesc,
    fullTextAnnotationsDesc: state => state.fullTextAnnotationsDesc,
    extractedDetectedText: state => state.extractedDetectedText,
    extractedCardNumber: state => state.extractedCardNumber,
    extractedExpiryDate: state => state.extractedExpiryDate,
}

const actions = {
    async handleImageSelect({commit}, event){
        // reset the data and fields 
        commit("resetData")

        // init the message to return
        let msg = initialMessage;
        
        // Check if there is a file
        if(!event.target.files) {
            msg.message = "No file was found to perform operation";
        }
        
        // Check if there was a file object
        if(event.target.files.length < 1) {
            msg.message = "Please upload an image/file to perform operation";
        }

        // should not allow upload of more than one file 
        if(event.target.files.length > 1) {
            msg.message = "Only one file or image allowed to perform operation";
        }
        
        // if we have a message
        if(msg.message) {
            commit("addMessage", msg)
        }else{
            const fileObject = event.target.files[0]
            
            commit("setSelectedImage", fileObject) // set the image src

            // create Base64 Image
            const reader = new FileReader()
            reader.onload = (e) => {
                commit("setSelectedImageBase64", e.target.result)  // get first file and add the image to store
            }
            reader.readAsDataURL(fileObject)
        }
    },
    async detectTextFromImage({commit}){
        // init the message to return
        let msg = initialMessage;

        // Check if we have an image to detect text
        if(!state.selectedImageBase64) {
            msg.message = "No file was found to detect text operation";
            await commit("addMessage", msg)
        }else{
            // OCR Google Vision Deetxt Text Request body 
            let detextTextData = detectTextRequestBody.detectTextRequestBody   
                        
            this.dispatch('formatDetectedText', detextTextData)
            
            try {
                const base64Image = (state.selectedImageBase64).substring((state.selectedImageBase64).indexOf("base64,") + 7);
            
                // add the base64 image to the request body
                detextTextData.requests[0].image.content = base64Image;

                const response = await detectTextApi.detectTextFromImage(detextTextData)

                // get the first index response
                const detectedTextResponse = response.data .responses[0];

                // we have all the descriptions from textAnnotations
                const annotationResult = detectedTextResponse.textAnnotations;

                // annotationResult.forEach(text => console.log(text))

                // this is the text annotation
                let textAnnotationsDesc= annotationResult[0].description ? annotationResult[0].description : null;

                // this is the full text annotation
                let fullTextAnnotationsDesc = detectedTextResponse.fullTextAnnotation.text ? detectedTextResponse.fullTextAnnotation.text : null;

                //  do we have text that was detected    
                if(!textAnnotationsDesc && !fullTextAnnotationsDesc) {
                    // init the message to return
                    msg.message = "No text was detected from the image";
                    commit("addMessage", msg)
                }else{
                    // set the responses
                    // commit("setDetectTextDescResponse", textAnnotationsDesc)
                    // commit("setDetectTextFullDescResponse", fullTextAnnotationsDesc)

                    // just do operations on one of the above results
                    // format the text to extract details
                    if(fullTextAnnotationsDesc) {
                       this.dispatch('formatDetectedText', fullTextAnnotationsDesc.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/));
                    }else{
                        if(textAnnotationsDesc) {
                            this.dispatch('formatDetectedText', textAnnotationsDesc.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/));
                        }else{
                            msg.message = "No text was detected from the image to perform operation";
                            commit("addMessage", msg)
                        }
                    }             
                }  
            } catch (error) {
                if (error.response.data.error.message) {
                    msg.message = error.response.data.error.message
                } else{
                    msg.message = error.message
                }
                
                // add the error message
                await commit("addMessage", msg)
            }
        }
    },
    formatDetectedText({ dispatch, commit }, detectedText) {
        let extractedCardNumber = null
        let extractedExpiryDate = null
        let extractedDetectedText = detectedText

        // get the card number
        let cardNumberIndex = detectTextFunctions.getCardNumberFromDetectedText(detectedText)
        if(cardNumberIndex && cardNumberIndex != -1) {
            extractedCardNumber = detectedText[cardNumberIndex]
            detectedText.splice(cardNumberIndex, 1)  // remove this element from the array
        }    

        // get the expiry dates
        let expiryDateIndex = detectTextFunctions.getExpiryDateFromDetectedText(detectedText)
        if(expiryDateIndex && expiryDateIndex != -1) {
            extractedExpiryDate = detectedText[expiryDateIndex]

            // Replace all non digit characters
            extractedExpiryDate = extractedExpiryDate.replace(replaceExpiryCardRegex, '')
            // trim all the empty spaces
            extractedExpiryDate = extractedExpiryDate.replace(trimEmptySpaceRegex, '')

            detectedText.splice(expiryDateIndex, 1)  // remove this element from the array
        }
        
        commit("setDetectedText", extractedDetectedText)  // the detected text
        commit("setCardNumber", extractedCardNumber)  // the detected Card Number
        commit("setExpiryDate", extractedExpiryDate) // the detected Expiry Date
    }
}

const mutations = { 
    addMessage: (state, data) => (
        state.messageResult = data
    ),
    setSelectedImage: function(state, fileObject) {
        // set the image
        state.selectedImage = fileObject
    },
    setSelectedImageBase64: function(state, base64FileObject) {
        // set the Base64 Image
        state.selectedImageBase64 = base64FileObject
    },
    resetData: function() { // reset the data
        state.selectedImage = null;
        state.selectedImageBase64 = null;
        state.messageResult = initialMessage
    },
    setDetectTextDescResponse: function(state, textAnnotationsDesc) {
        state.textAnnotationsDesc = textAnnotationsDesc
    },
    setDetectTextFullDescResponse: function(state, fullTextAnnotationsDesc) {
        state.fullTextAnnotationsDesc = fullTextAnnotationsDesc
    },
    setDetectedText: function(state, detectedText) {
        state.extractedDetectedText = detectedText
    },
    setCardNumber: function(state, cardNumber) {
        state.extractedCardNumber = cardNumber
    },
    setExpiryDate: function(state, expiryDate) {
        state.extractedExpiryDate = expiryDate
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}