<template>
    <div class="clearfix">
    
       <div class="clearfix mb-4">            
            <v-layout row wrap>
                
                <!--The Image-->
                <v-flex xs12 sm12 md6 lg6 xl6>
                
                    <v-card  class="pa-2 mb-2" 
                    :class="[
                        messageResult.success ? 'green' : 'red',
                    ]" v-if="messageResult.message"> 
                        <span class="text-white">
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
                    <div v-show="textAnnotationsDesc || fullTextAnnotationsDesc" class="text-md-center">
                        <p v-show="textAnnotationsDesc">Extracted Text: <span class="blue--text">{{ textAnnotationsDesc }}</span></p>
                        <p v-show="fullTextAnnotationsDesc">Full Text: <span class="red--text">{{ fullTextAnnotationsDesc }}</span></p>
                        <!-- <p class="black--text" v-for="(item, index) in fullTextAnnotationSplit" :key="index">
                            {{ index }} - {{ item }}
                        </p> -->
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
            result: false
        }
    },

    computed: {
        ...mapGetters({
            selectedImage: 'selectedImage',
            selectedImageBase64: 'selectedImageBase64',
            messageResult: 'messageResult',
            textAnnotationsDesc: 'textAnnotationsDesc',
            fullTextAnnotationsDesc: 'fullTextAnnotationsDesc',
        }),
    },

    methods: {
        ...mapActions(["handleImageSelect", "detectTextFromImage"]),     
    },
}
</script>


<style>
p {
    font-size: 18px
}
</style>
