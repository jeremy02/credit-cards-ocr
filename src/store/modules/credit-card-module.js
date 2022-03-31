import axios from 'axios'
import detectTextApi from '../../api/detectTextAPI'
import detectTextRequestBody from '../../api/models/detectTextModel'

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
    fullTextAnnotationsDesc: null
};

const getters = {
    selectedImage: state => state.selectedImage,
    selectedImageBase64: state => state.selectedImageBase64,
    messageResult: state => state.messageResult,
    textAnnotationsDesc: state => state.textAnnotationsDesc,
    fullTextAnnotationsDesc: state => state.fullTextAnnotationsDesc
};

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
            // add the image to store
            await commit("setSelectedImage", event.target.files[0])  // get first file
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
                    commit("setDetectTextDescResponse", textAnnotationsDesc)
                    commit("setDetectTextFullDescResponse", fullTextAnnotationsDesc)

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
                if(error.response.data.error.message) {
                    msg.message = error.response.data.error.message
                }else{
                    msg.message = error.message
                }
                
                // add the error message
                await commit("addMessage", msg)
            }
        }
    },
    formatDetectedText({ dispatch, commit }, detectedText) {
        console.log(detectedText)

        // loop through the detected text
        detectedText.forEach( (element) => {
            console.log(">>>>>>>>>>>>>>>:::"+element)
        })
    }
};

const mutations = { 
    addMessage: (state, data) => (
        state.messageResult = data
    ),
    setSelectedImage: function(state, fileObject) {
        // set the image
        state.selectedImage = fileObject

        // create Base64 Image
        const reader = new FileReader()
        reader.onload = (e) => {
            state.selectedImageBase64 = e.target.result
        };
        reader.readAsDataURL(fileObject);
    },
    resetData: function() {
        // reset the data
        state.selectedImage = null;
        state.selectedImageBase64 = null;
        state.messageResult = initialMessage
    },
    setDetectTextDescResponse: function(state, textAnnotationsDesc) {
        state.textAnnotationsDesc = textAnnotationsDesc
    },
    setDetectTextFullDescResponse: function(state, fullTextAnnotationsDesc) {
        state.fullTextAnnotationsDesc = fullTextAnnotationsDesc
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}