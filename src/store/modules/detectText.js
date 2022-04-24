// store the regexes here
const numberWithSpacesRegex_version_1 = /\b(?:\d{4}[ -]?){3}(?=\d{4}\b)/gm
const numberWithSpacesRegex_version_2 = /\b(\s*[0-9]+\s*)\b/
const numberWithSpacesRegexMatch_version_1 = /\\b(\\d{4}[- ]?){4}/
const numberWithSpacesRegexMatch_version_2 = /\b(\d{4}[- ]?){4}/

const replaceExpiryCardRegex = /[^\d/\///\/]/g
const trimEmptySpaceRegex = /\s+/g

// Check pattern for expiry data
const moreThan3DigitsPattern = /(?:\d.*?){3,7}/
const moreThan3DigitsPattern_2 = /(.*?\\d){3,7}/

// NB Replace all the [0-9] below here with [1-9]
const expiryDatePattern = /^(0[0-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/
// using word boundaries
const expiryDatePattern_2 = /\b(0[0-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})\b/ // these are outliers
const expiryDatePattern_3 = /^(0[0-9]|1[0-2])\/?(([0-9]{4}|[0-9]{2})$)/
const expiryDatePattern_4 = /\b(0[0-9]|1[0-2])\/?(([0-9]{4}|[0-9]{2})\b)/ // these are outliers

/*
*   From the detected text Check if we can get the Card Number
*/
function getCardNumberFromDetectedText (detectedText) {
    let result = -1

    // loop through the detected text and get the card number
    for( let index in detectedText ) {
        let element = detectedText[index]

        // to check if string contains digits with spaces but 12 characters or more
        if(element.length >= 12) {
            // calculation using ratio // this will minimise the number of elements we will have to loop through
            let cardNumberResRatio = checkForPossibleCardNumberUsingRatio(element)

            // has the element met the ratio criteria
            if(cardNumberResRatio != -1) {
                // calculation using first regex test
                let cardNumberResTestReg1 = checkForPossibleCardNumberUsingRegex(element, numberWithSpacesRegex_version_1, false)

                // calculation using second regex test
                let cardNumberResTestReg2 = checkForPossibleCardNumberUsingRegex(element, numberWithSpacesRegex_version_2, false)

                try {
                    // calculation using first regex match
                    let cardNumberResMatchReg1 = checkForPossibleCardNumberUsingRegex(element, numberWithSpacesRegexMatch_version_1, false)

                    // calculation using second regex match
                    let cardNumberResMatchReg2 = checkForPossibleCardNumberUsingRegex(element, numberWithSpacesRegexMatch_version_2, false)


                    console.log("cardNumberResMatchReg1 no:::"+ cardNumberResMatchReg1+"")

                    console.log("cardNumberResMatchReg2 no:::"+ cardNumberResMatchReg2+"")

                } catch(e){
                    // an exception doing the match for the elements
                    result = -1
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
            if(expiryDatePattern.test(element)){
                result = index
                return result
                break
            }

            if(expiryDatePattern_2.test(element)){
                result = index
                return result
                break
            }

            if(expiryDatePattern_3.test(element)){
                result = index
                return result
                break
            }

            if(expiryDatePattern_4.test(element)){
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
function checkForPossibleCardNumberUsingRegex(str, cardNumberRegex, isMatch) {
    let result = -1
    if(isMatch) {
        if(str.match(cardNumberRegex)) {
            result = str
        }
    } else {
        if(cardNumberRegex.test(str)) {
            result = str
        }
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
