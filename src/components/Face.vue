<template>
<v-layout row wrap>
        <v-flex xs12 sm12 md6 lg6 xl6>
                <v-card>
            
            <img id="video" width="100%" height="50%" :src="myImage" class="center"/>

            <canvas id="canvas" width="600" height="480" style="display: none;"></canvas>
                </v-card>
            <v-btn @click.native="process" block secondary dark>
                <v-icon left>camera_alt</v-icon> Analyze</v-btn>
        </v-flex>
        <v-flex xs12 sm12 md6 lg6 xl6>
            <h2 class="orange--text text-xs-center">Result</h2>
            <div class="text-xs-center" v-show="loader">
                <v-progress-circular indeterminate v-bind:size="100" v-bind:width="3" class="teal--text"></v-progress-circular>
            </div>
            <div v-show="result" class="text-md-center">
                <p>Anger: <span class="blue--text">{{anger}}</span></p>
                <p>Blurred: <span class="blue--text"> {{blur}}</span></p>
                <p>Joy: <span class="blue--text">  {{joy}} </span> </p>
                <p>Sorrow: <span class="blue--text">  {{sorrow}} </span> </p>
                <p>Surprised: <span class="blue--text">  {{surprised}} </span> </p>
                <h4 class="red--text">Confidence: {{ confidence }} %</h4>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
import $ from "jquery";

import axios from 'axios';

import myImage from "../../assets/card3.png";

export default {
    data: function() {
        return{
                    loader: false,
                    result: false,
                    myImage: myImage,
                    apiKey: "AIzaSyAuX0eP9CBzbkfqrVtCC0gPL4BiUm_EUUo",  //google cloud api  Browser key 
                    anger: null,
                    blur: null,
                    headwear: null,
                    sorrow: null,
                    joy: null,
                    surprised: null,
                    confidence: null,
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
                                "type":"TEXT_DETECTION"
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
    methods: {
        process: function() {
            const canvas = document.getElementById('canvas');
            const context = canvas.getContext('2d');
            const vm = this;
            this.result = false;
            this.loader = true;

            let bg = new Image();
            bg.src = myImage;

            bg.onload = function() {
                context.drawImage(bg, 0 ,0, 640, 480);

                console.log("image is loaded:::");
            };

            bg.src = myImage;

            const base64 = canvas.toDataURL();
            
            const finalImage = base64.replace("data:image/png;base64,", "");
            
            // Facial Detection
            vm.data.requests[0].image.content = finalImage;

            /*
                axios.post(`https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAuX0eP9CBzbkfqrVtCC0gPL4BiUm_EUUo`,
                    vm.data).then(response => {
                    const result = response.data.responses[0].faceAnnotations[0];
                    vm.anger = result.angerLikelihood;
                    vm.blur = result.blurredLikelihood;
                    vm.headwear = result.headwearLikelihood;
                    vm.joy = result.joyLikelihood;
                    vm.sorrow = result.sorrowLikelihood;
                    vm.surprised = result.surpriseLikelihood;
                    vm.confidence = vm.confidenceInt(result.detectionConfidence);
                    vm.loader = false;
                    vm.result = true;
                }).catch(error => {
                    console.log(error);
                })
            */
        
        
            // Text OCR Detection
            const newDataUrl = new Buffer(myImage).toString('base64');
            vm.textData.requests[0].image.content = finalImage;

            axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${vm.apiKey}`,
                vm.textData
                ).then(result => {
                    /*
                          const [annotation] = textDetections.textAnnotations;
                          const text = annotation ? annotation.description : '';
                        */
                        console.log(">>>>>>>>>>>>>>>>>>>");

                        const textDetections = result.data.responses[0];
                        const annotationResult = textDetections.textAnnotations;
                        const text = annotationResult ? annotationResult.description : '';

                        // we have all the descriptions
                        // lets get the first description
                        const firstDescription = 
                        console.log(">>>>>>>>>textAnnotations::::"+JSON.stringify(result.data.responses[0].textAnnotations));  
                        
                }).catch(error => {
                    console.log("detections.text Error::::"+error);
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
    }
}
</script>


<style>
p {
    font-size: 18px
}
</style>
