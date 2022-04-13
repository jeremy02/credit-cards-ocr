<template>
    <div class="clearfix">

       <div class="clearfix mb-4">
            <v-layout row wrap>

                <!--The Image-->
                <v-flex xs12 sm12 md6 lg6 xl6>
                    <v-card  class="pa-2 mb-2" :class="[messageResult.success ? 'green' : 'red',]" v-if="messageResult.message">
                        <span class="text-white">
                            {{ messageResult.message }}
                        </span>
                    </v-card>
                  
                    <v-card v-if="selectedImageBase64">
                      <img class="img-responsive img-thumbnail" width="100%" height="50%" :src="selectedImageBase64" alt="Credit Card Image">
                      <canvas id="canvas" width="600" height="480" style="display: none;"></canvas>
                    </v-card>

                    <v-card  v-if="!selectedImageBase64 && !detectingTextStatus">
                        <div class="dropbox">
                            <input type="file" :disabled="detectingTextStatus" @change="handleImageSelect($event)"
                                   block accept="image/x-png,image/gif,image/jpeg,image/jpg" class="input-file">
                            <p v-if="!detectingTextStatus">
                                Drag your file(s) here to begin<br> or click to browse
                            </p>
                            <p v-if="detectingTextStatus">
                                Uploading and detecting text in file...
                            </p>
                        </div>
                    </v-card>


                    <v-layout row wrap xs12 sm12 md6 lg6 xl6>

                        <!--Detect Text Button-->
                        <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-btn @click.native="detectTextFromImage" class="ma-2 white--text green" :disabled="!selectedImageBase64 && !detectingTextStatus">
                                <v-icon left dark mr-2>
                                  camera_alt
                                </v-icon>
                                Detect Text
                            </v-btn>
                        </v-flex>

                        <!--Reset Button -->
                        <v-flex xs12 sm12 md6 lg6 xl6>
                            <v-btn class="ma-2 white--text orange" @click.native="reset" :disabled="!selectedImageBase64">
                                <v-icon left dark mr-2>
                                    cancel
                                </v-icon>
                                Reset
                            </v-btn>

                        </v-flex>

                    </v-layout>
                </v-flex>

                <!--The Results-->
                <v-flex xs12 sm12 md6 lg6 xl6>
                    <h2 class="orange--text text-xs-center">Result</h2>
                    <div class="text-xs-center" v-show="detectingTextStatus">
                        <v-progress-circular indeterminate v-bind:size="100" v-bind:width="3" class="teal--text"></v-progress-circular>
                    </div>
                    <div v-show="textAnnotationsDesc || fullTextAnnotationsDesc || extractedDetectedText || extractedCardNumber || extractedExpiryDate" class="text-md-center">
                        <p v-show="textAnnotationsDesc">Extracted Text: <span class="blue--text">{{ textAnnotationsDesc }}</span></p>
                        <p v-show="fullTextAnnotationsDesc">Full Text: <span class="red--text">{{ fullTextAnnotationsDesc }}</span></p>
                        <p v-show="extractedDetectedText">Text Detected: <span class="red--text">{{ extractedDetectedText }}</span></p>
                        <p v-show="extractedCardNumber">Card Number Detected: <span class="red--text">{{ extractedCardNumber }}</span></p>
                        <p v-show="extractedExpiryDate">Card Expiry Date Detected: <span class="red--text">{{ extractedExpiryDate }}</span></p>
                    </div>
                </v-flex>

            </v-layout>
       </div>
    </div>

</template>

<script>

import {mapGetters, mapActions} from "vuex";

export default {
    name: 'CreditCard',
    data: function() {
        return{

        }
    },
    computed: {
        ...mapGetters({
            messageResult: 'messageResult',
            selectedImage: 'selectedImage',
            selectedImageBase64: 'selectedImageBase64',
            textAnnotationsDesc: 'textAnnotationsDesc',
            fullTextAnnotationsDesc: 'fullTextAnnotationsDesc',
            extractedDetectedText: 'extractedDetectedText',
            extractedCardNumber: 'extractedCardNumber',
            extractedExpiryDate: 'extractedExpiryDate',
            detectingTextStatus: 'detectingTextStatus',
        }),
    },
    methods: {
        ...mapActions(["handleImageSelect", "detectTextFromImage", "reset"]),
    },
    mounted() {
      this.reset();
    },
}

</script>


<style>

.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
  p {
      font-size: 18px
  }
</style>
