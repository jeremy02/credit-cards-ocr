<template>
    <div class="clearfix">
    
       <div class="clearfix mb-4">            
            <v-layout row wrap>
                
                <!--The Image-->
                <v-flex xs12 sm12 md6 lg6 xl6>
                
                    <v-card  class="py-2 px-2 mb-2" 
                    :class="[
                        messageResult.success ? 'green' : 'red',
                    ]" v-if="messageResult.message"> 
                        <span class="text-white text-">
                            {{ messageResult.message }}
                        </span>
                    </v-card>

                    <v-card>   
                        <img style="" width="100%" height="50%" :src="selectedImageBase64" alt="Credit Card Image">
                        <canvas id="canvas" width="600" height="480" style="display: none;"></canvas>
                    </v-card>

                    <input @change="handleImageSelect($event)" class="custom-input my-4" 
                        type="file" block accept="image/x-png,image/gif,image/jpeg,image/jpg">

                    <v-btn @click.native="detectTextFromImage" block class="red" :disabled="!selectedImageBase64">
                        <v-icon left>camera_alt</v-icon> Detect Text
                    </v-btn>

                </v-flex>

                <!--The Results-->
                <v-flex xs12 sm12 md6 lg6 xl6>
                    <h2 class="orange--text text-xs-center">Result</h2>
                    <div class="text-xs-center" v-show="loader">
                        <v-progress-circular indeterminate v-bind:size="100" v-bind:width="3" class="teal--text"></v-progress-circular>
                    </div>
                    <div v-show="result" class="text-md-center">
                        <p>Extracted Text: <span class="blue--text">{{textAnnotation}}</span></p>
                        <p>Full Text: <span class="red--text">{{fullTextAnnotation}}</span></p>
                        <p class="black--text" v-for="(item, index) in fullTextAnnotationSplit" :key="index">
                            {{ index }} - {{ item }}
                        </p>
                    </div>
                </v-flex>
            
            </v-layout>           
       </div> 
       
       <hr/>

       <div class="clearfix mt-4">
            <v-layout row wrap>
                <!--The Image-->
                <v-flex xs12 sm12 md6 lg6 xl6>
                    <v-card>   
                        <img style="" width="100%" height="50%" :src="myImage" alt="Credit Card Image">
                        <canvas id="canvas" width="600" height="480" style="display: none;"></canvas>
                    </v-card>

                    <br/>
                    <br/>    
                    <input @change="handleImage" class="custom-input" type="file" block>
                    <br/>
                    <br/>

                    <v-btn @click.native="process" block class="red">
                        <v-icon left>camera_alt</v-icon> Scan
                    </v-btn>

                </v-flex>

                <!--The Results-->
                <v-flex xs12 sm12 md6 lg6 xl6>
                    <h2 class="orange--text text-xs-center">Result</h2>
                    <div class="text-xs-center" v-show="loader">
                        <v-progress-circular indeterminate v-bind:size="100" v-bind:width="3" class="teal--text"></v-progress-circular>
                    </div>
                    <div v-show="result" class="text-md-center">
                        <p>Extracted Text: <span class="blue--text">{{textAnnotation}}</span></p>
                        <p>Full Text: <span class="red--text">{{fullTextAnnotation}}</span></p>
                        <p class="black--text" v-for="(item, index) in fullTextAnnotationSplit" :key="index">
                            {{ index }} - {{ item }}
                        </p>
                    </div>
                </v-flex>
            
            </v-layout>           
       </div> 
    </div>

</template>

<script>
import $ from "jquery";

import axios from 'axios';

import {mapGetters, mapActions} from "vuex";

export default {
    name: 'CreditCard',
    data: function() {
        return{
            loader: false,
            result: false,
            myImage: "",
            apiKey: "AIzaSyAuX0eP9CBzbkfqrVtCC0gPL4BiUm_EUUo",  //google cloud api  Browser key 
            textAnnotation: null,
            fullTextAnnotation: null,
            fullTextAnnotationSplit: [],
            data: {               //type vision api Request
                "requests": [{
                    "features": [{
                        "type": "FACE_DETECTION"
                    }],
                    "image": {
                        "content": null
                    }
                }]
            },
            textData : { // OCR request
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
            }   
        }
    },
    
    computed: mapGetters({
        usersList: 'usersList',
        selectedImage: 'selectedImage',
        selectedImageBase64: 'selectedImageBase64',
        messageResult: 'messageResult',
    }),

    methods: {
        ...mapActions(["handleImageSelect", "detectTextFromImage"]),
        handleImage: function(e) {
            const selectedImage = e.target.files[0]; // get first file
            this.createBase64Image(selectedImage);
        },
        createBase64Image: function(fileObject) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.myImage = e.target.result;
                // this.setImageUri();
            };
            reader.readAsDataURL(fileObject);
        },
        process: function() {
            const vm = this;
            this.result = false;
            this.loader = true;

            const base64 = vm.myImage;

            // Convert the image data to a Buffer and base64 encode it.
            // const encodedImage = Buffer.from(vm.myImage).toString('base64');
            
            // const finalImage = base64.replace("data:image/png;base64,", "");

            const finalImage = base64.substring(base64.indexOf("base64,") + 7);
        
            // Text OCR Detection
            vm.textData.requests[0].image.content = finalImage; // encodedImage

            axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${vm.apiKey}`,
                vm.textData
                ).then(result => {
                        const textDetections = result.data.responses[0];

                        // we have all the descriptions from textAnnotations
                        const annotationResult = textDetections.textAnnotations;

                        /* for (let i = 1; i < annotationResult.length; i++) {
                            console.log(i + ": " + annotationResult[i].description); 
                        } */

                        // console.log('Text:');
                        // annotationResult.forEach(text => console.log(text))

                        vm.textAnnotation = annotationResult[0].description ? annotationResult[0].description : "" ;

                        // lets get the text from fullTextAnnotation
                        vm.fullTextAnnotation = textDetections.fullTextAnnotation.text ? textDetections.fullTextAnnotation.text : '';

                        vm.fullTextAnnotationSplit = vm.fullTextAnnotation.replace(/\r\n/g, "\r").replace(/\n/g, "\r").split(/\r/);

                        vm.loader = false;
                        vm.result = true;
                        
                }).catch(error => {
                    console.log("detections.text Error::::"+error);
                    vm.textAnnotation = null;
                    vm.fullTextAnnotation = null;
                })
        
            // context.drawImage(video, 0, 0, 640, 480);
        },
        confidenceInt(num){
            const dig = num.toFixed(2);
            if(dig == 1.0){
                return 100;
            }else{
                const str = dig.toString();
                return str.substring(2, 4);
            }
        },
    },
}
</script>


<style>
p {
    font-size: 18px
}
</style>
