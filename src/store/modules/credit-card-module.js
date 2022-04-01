import axios from 'axios'
import detectTextApi from '../../api/detectTextAPI'
import detectTextRequestBody from '../../api/models/detectTextModel'

// store the regexes here
const numberWithSpacesRegex = /\b(\s*[0-9]+\s*)\b/

// re = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
// OR using word boundaries:

// re = /\b(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})\b/;




// Store the regexes as globals so they're cached and not re-parsed on every call:
// visa card regex patterns
let visaPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/
let visaPattern_2 = / ^4[0-9]{12}(?:[0-9]{3})?$/

// Visa Master Card regex patterns
let visaMasterCardPattern  = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/

// master card regex patterns
let mastPattern = /^(?:5[1-5][0-9]{14})$/
var mastPattern_2 = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/
let mastPattern_3 = /^5[1-5][0-9]{14}$/

// Union Pay Card regex patterns
let unionPayCardPattern = /^(62[0-9]{14,17})$/ 

// American Express card regex patterns
let amexPattern = /^(?:3[47][0-9]{13})$/
let amexPattern_2 = /^3[47][0-9]{13}$/

// Diners Club regex patterns
let dinersClubPattern = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/

// Discover Card regex patterns
let discPattern = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/
let discPattern_2 = /^6(?:011|5[0-9]{2})[0-9]{12}$/
let discPattern_3 = /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/

// JCB: Card regex patterns
let jDBPattern = /^(?:2131|1800|35\d{3})\d{11}$/

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
            // let detextTextData = detectTextRequestBody.detectTextRequestBody   
            
            let detectedText = ['792451', 'GDABSA', 'TITANIUM', '5311 1700 0000 0000', '00/00', 'Mastercard', 'HS CARDHOLDER', ''];

            let discoveryCardText = ['AUTHORIZED SIGNATURE', 'CE CADENCE', 'CE CADENCE CA', 'ENCE CADENCE', 'ADENCE CADEN', 'CADEN', 'NOT VALID UNLESS SIGNED', 'E CADENCE CAL', 'NCE CADENCE', 'CE CADENCE C', 'CE CADENCE', 'DENCE CADENC', '6011 0000 0000 000O', 'VALID', 'THRU 08/15', 'CADENCE CADE', 'CADENCE CADE', 'ENCE CADENCE', 'CUSTOMER SERVICE: 1-800-636-7622', 'www.cadencebank.com', 'E CADENCE CA', 'DISCOVER', 'pulse', 'A DISCOVER COMPANY', 'CADENCE CAD', 'CE CADEN', 'ADEN', '']
            
            let discoveryCardText_2 = ['2X', 'DISC VER', 'CASHBACK', 'CHECKING', 'Rewards', 'b011 DO0D ODDD DD0D', '9 00/00', 'JL VEBB', 'Debit', '']
            
            let discoveryCardText_3 = ['DISCOVER', '6OL1 0000 5656 0001', 'MEMBER SINCE', 'VALID THRU', '1999', '07/20', 'NR BRIAN COHEN', '']

            this.dispatch('formatDetectedText', detectedText)
            
            // try {
            //     const base64Image = (state.selectedImageBase64).substring((state.selectedImageBase64).indexOf("base64,") + 7);
            
            //     // add the base64 image to the request body
            //     detextTextData.requests[0].image.content = base64Image;

            //     const response = await detectTextApi.detectTextFromImage(detextTextData)

            //     // get the first index response
            //     const detectedTextResponse = response.data .responses[0];

            //     // we have all the descriptions from textAnnotations
            //     const annotationResult = detectedTextResponse.textAnnotations;

            //     // annotationResult.forEach(text => console.log(text))

            //     // this is the text annotation
            //     let textAnnotationsDesc= annotationResult[0].description ? annotationResult[0].description : null;

            //     // this is the full text annotation
            //     let fullTextAnnotationsDesc = detectedTextResponse.fullTextAnnotation.text ? detectedTextResponse.fullTextAnnotation.text : null;

            //     //  do we have text that was detected    
            //     if(!textAnnotationsDesc && !fullTextAnnotationsDesc) {
            //         // init the message to return
            //         msg.message = "No text was detected from the image";
            //         commit("addMessage", msg)
            //     }else{
            //         // set the responses
            //         commit("setDetectTextDescResponse", textAnnotationsDesc)
            //         commit("setDetectTextFullDescResponse", fullTextAnnotationsDesc)

            //         // just do operations on one of the above results
            //         // format the text to extract details
            //         if(fullTextAnnotationsDesc) {
            //            this.dispatch('formatDetectedText', fullTextAnnotationsDesc.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/));
            //         }else{
            //             if(textAnnotationsDesc) {
            //                 this.dispatch('formatDetectedText', textAnnotationsDesc.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/));
            //             }else{
            //                 msg.message = "No text was detected from the image to perform operation";
            //                 commit("addMessage", msg)
            //             }
            //         }             
            //     }  
            // } catch (error) {
            //     if(error.response.data.error.message) {
            //         msg.message = error.response.data.error.message
            //     }else{
            //         msg.message = error.message
            //     }
                
            //     // add the error message
            //     await commit("addMessage", msg)
            // }
        }
    },
    formatDetectedText({ dispatch, commit }, detectedText) {

        console.log("formatDetectedText>>>>", detectedText)

        let letPossibleCardNumber = null        

        // loop through the detected text
        detectedText.forEach( (element, index) => {
            // to check if string contains digits with spaces but 12 characters or more

            if(element.length >=12) {
                const trimmedElement = element.replace(/\s+/g, '') // && element.replace(" ", "")

                let percentageOfNumbers = (findTotalCount(trimmedElement) / trimmedElement.length) * 100
                if(percentageOfNumbers > 60) {
                    console.log("percentageOfNumbers>>>>"+percentageOfNumbers+" :::" + element)  
                }    


                if(numberWithSpacesRegex.test(element)) {
                    console.log("numberWithSpacesRegex>>>>"+element)        
                }

            }

            // if((numberWithSpacesRegex.test(element) || numberWithSpaceRegexOption.test(element)) 
            //     && element.length >=12) {                

            //         if(numberWithSpaceRegexOption_2.test(element)) {
            //             console.log("numberWithSpaceRegexOption_2>>>>"+numberWithSpaceRegexOption_2)        
            //         }


            //         letPossibleCardNumber = element
            //         // remove this from the array
            //         detectedText.splice(index, 1)    
            // }

            // Check if we can have the name from here
        })

        console.log("letPossibleCardNumber", letPossibleCardNumber)
        console.log("detectedText", detectedText)

        if(letPossibleCardNumber) {
            validateCreditCardNumber(letPossibleCardNumber)
        }else{
            console.log("No func")
        }
    }
}

function findTotalCount(str) {
  let digitsArr = str.match(/\d+/g)
  // let digitsArr = str.replace(/[^0-9]/g, '').length;
  if (digitsArr) {
    return digitsArr.join("").length;
    // return digitsArr
  }
  return 0
}

function validateCreditCardNumber(ccNum) {
    ccNum = ccNum.replace(/\s+/g, '')

    var isVisa = visaPattern.test( ccNum ) === true;
    var isMast = mastPattern.test( ccNum ) === true;
    var isMast2 = mastPattern2Short.test( ccNum ) === true;
    var isAmex = amexPattern.test( ccNum ) === true
    var isDisc = discPattern.test( ccNum ) === true || discPattern_2.test( ccNum ) === true || discPattern_3.test( ccNum ) === true

    if( isVisa || isMast || isAmex || isDisc ) {
        // at least one regex matches, so the card number is valid.

        if( isVisa ) {
            // Visa-specific logic goes here
            console.log("isVisa")
        }
        else if( isMast ) {
             // Mastercard-specific logic goes here
            console.log("isMast")
        }
        else if( isMast2 ) {
            // Mastercard-specific logic goes here
            console.log("isMast2")
        }
        else if( isAmex ) {
            // AMEX-specific logic goes here
            console.log("isAmex")
        }
        else if( isDisc ) {
            // Discover-specific logic goes here
            console.log("isDisc")

            console.log("discPattern_1:::" +discPattern_1.test( ccNum ))
            console.log("discPattern_2:::" +discPattern_2.test( ccNum ))
            console.log("discPattern_3:::" +discPattern_3.test( ccNum ))
        }
    }
    else {
        console.log("Please enter a valid card number.");
    }
}

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