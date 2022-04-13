# Credit Card OCR/Detect Text Example

> Vue2 + Vuetify + Google Cloud vision api as a Progressive Web App

## Example


|             Initial Form Screen             |    Credit Card Detected Text Screen    |
|:-------------------------------------------:|:--------------------------------------:|
| ![](static/img/images/initial_form_img.png) | ![](static/img/images/detect_text_img.png) |

## Getting Started

> Enable Google Cloud Vision api

At -> config/dev.env.js and -> config/prod.env.js, Replace 'GOOGLE_API_KEY' with key from [Google Cloud Api Browser Key](https://console.cloud.google.com/apis/dashboard)

``` bash
 GOOGLE_API_KEY: "Google Cloud Api Browser Key"
```

## Build Setup

### NPM
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
### Yarn
``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn dev

# build for production with minification
yarn build
```


