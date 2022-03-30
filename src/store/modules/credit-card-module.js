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
    }
};

const getters = {
    selectedImage: state => state.selectedImage,
    selectedImageBase64: state => state.selectedImageBase64,
    messageResult: state => state.messageResult
};

const actions = {
    async detectTextFromImage({commit}){
        // init the message to return
        let msg = initialMessage;
        
        // Check if we have an image to detect text
        if(!state.selectedImageBase64) {
            msg.message = "No file was found to detect text operation";
        }    

        // OCR/Google Vision Deetxt Text Request body 
        let detextTextData = detectTextRequestBody
        
        const response = await detectTextApi.detectTextFromImage(detextTextData)
        console.log(JSON.stringify(response));
    },
    async handleImageSelect({commit}, event){
      // init the message to return
      let msg = initialMessage;
       
      // Check if there is a file
      if(!event.target.files) {
          msg.message = "No file was found to perform operation";
      }
      
      // should not allow upload of more than one file 
      if(event.target.files.length < 1) {
          msg.message = "Please upload an image/file to perform operation";
      }

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
    }
};

const mutations = { 
    addMessage: (state, data) => (
        state.messageResult = data
    ),
    setSelectedImage: function(state, fileObject) {
        // set the image
        state.selectedImage = fileObject;

        // create Base64 Image
        const reader = new FileReader();
        reader.onload = (e) => {
            state.selectedImageBase64 = e.target.result;
        };
        reader.readAsDataURL(fileObject);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}