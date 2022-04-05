// store the regexes here
const numberWithSpacesRegex = /\b(\s*[0-9]+\s*)\b/
const replaceExpiryCardRegex = /[^\d/\///\/]/g
const trimEmptySpaceRegex = /\s+/g

// Check pattern for expiry data
const moreThan3DigitsPattern = /(?:\d.*?){3,7}/
const moreThan3DigitsPattern_2 = /(.*?\\d){3,7}/

// NB Replace all the [0-9] below here with [1-9]
const expriyDatePattern = /^(0[0-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/
// using word boundaries
const expriyDatePattern_2 = /\b(0[0-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})\b/ // these are outliers
const expriyDatePattern_3 = /^(0[0-9]|1[0-2])\/?(([0-9]{4}|[0-9]{2})$)/
const expriyDatePattern_4 = /\b(0[0-9]|1[0-2])\/?(([0-9]{4}|[0-9]{2})\b)/ // these are outliers

/*
*   From the detected text Check if we can get the Card Number   
*/
function getCardNumberFromDetectedText (detectedText) { 
    let result = -1

    // loop through the detected text and get the card number
    for( let index in detectedText ) {
        let element = detectedText[index]

        // to check if string contains digits with spaces but 12 characters or more
        if(element.length >=12) {
            // calculation using regex
            let cardNumberRes = checkForPossibleCardNumberUsingRegex(element)

            if(cardNumberRes !=-1) {
                result = index
                return result
                break
            }else{
                // calculation using ratio
                let cardNumberResRatio = checkForPossibleCardNumberUsingRatio(element)
                if(cardNumberResRatio != -1) {
                    result = index
                    return result
                    break
                }
            } 
        }
    }
    return result   
}

/*
*   From the detected text Check if we can get the Expiry Date   
*/
function getExpiryDateFromDetectedText (detectedText) { 
    let result = -1
    // loop through the detected text and get the card number
    for( let index in detectedText ) {
        let element = detectedText[index]
        
        // to check if string contains digits 3 to 7 characters
        if((moreThan3DigitsPattern.test(element) || moreThan3DigitsPattern_2.test(element)) && element.indexOf("/") != -1) {
            // Check for Expiry Date using Regexes
            if(expriyDatePattern.test(element)){
                result = index
                return result
                break
            }

            if(expriyDatePattern_2.test(element)){
                result = index
                return result
                break
            }

            if(expriyDatePattern_3.test(element)){
                result = index
                return result
                break
            }

            if(expriyDatePattern_4.test(element)){
                result = index
                return result
                break
            }
        }
    }
    return result 
}

// Check if the string passed is a possible Credit Number
// Using Regular Expressions
function checkForPossibleCardNumberUsingRegex(str) {
    let result = -1
    if(numberWithSpacesRegex.test(str)) {
        result = str       
    }
    return result   
}

// Check if the string passed is a possible Credit Number
// Using Calculations of the possible digits to character ratio
function checkForPossibleCardNumberUsingRatio(str) {
    let result = -1

    // trim the string of empty spaces
    const trimmedString = str.replace(trimEmptySpaceRegex, '') // && str.replace(" ", "")

    let numbersRatio = (findTotalCount(trimmedString) / trimmedString.length) * 100
    
    if(parseFloat(numbersRatio) > parseFloat(80.0)) {
        result = str
    }
    return result
}

function findTotalCount(str) {
  let digitsArr = str.match(/\d+/g)
  // let digitsArr = str.replace(/[^0-9]/g, '').length;
  if (digitsArr) {
    return digitsArr.join("").length
  }
  return 0
}

export default {
  getCardNumberFromDetectedText: (data) => getCardNumberFromDetectedText(data),
  getExpiryDateFromDetectedText: (data) => getExpiryDateFromDetectedText(data)
}