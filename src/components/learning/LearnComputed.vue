<template>
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col cols="12" sm="4">
        <v-card
            class="mx-auto my-12 pa-4"
            max-width="374"
        >            
            <v-card-title>Cafe Badilico</v-card-title>

            <v-divider class="mx-4"></v-divider>

            <div class="text-center pt-2 pb-2">
              <p>Has published books:</p>
              <span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
              <p class="my-2"> Using Computed Properies: 
                <strong>{{ publishedBooksMessage  }}</strong>
              </p>
              <p class="my-2"> Using Method Properies: 
                <strong>{{ calculateBooksMessage() }}</strong>
              </p>
            </div>

            <v-divider class="mx-4"></v-divider>

            <div class="text-center pt-2 pb-2">
              <p>Difference between method and computed:</p>
              <p class="my-2"> Using Computed Properies: 
                <strong>{{ now  }}</strong>
              </p>
              <p class="my-2"> Using Method Properies: 
                <strong>{{ dateNow() }}</strong>
              </p>
            </div>

            <v-divider class="mx-4"></v-divider>

            <div class="text-center pt-2 pb-2">
              <p>Writable Computed:</p>
              <span>To get a "writable" computed property, you can create one by providing both a getter and a setter</span>
              <p class="my-2"> Using Computed Properies: 
                <strong>{{ fullName }}</strong>
              </p>
            </div>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
    data: function() {
        return{
            demoData:'',
            author: {
                name: 'John Doe',
                books: [
                'Vue 2 - Advanced Guide',
                'Vue 3 - Basic Guide',
                'Vue 4 - The Mystery'
                ]
            },
            firstName: 'John',
            lastName: 'Doe',
        }
    },
    methods: {
        calculateBooksMessage() {
          // Instead of a computed property, we can define the same function as a method
          // However computed properties are cached based on their reactive dependencies
          return this.author.books.length > 0 ? 'Yes' : 'No'
        },
        //  a method invocation will always run the function whenever a re-render happens.
        // In cases where you do not want caching, use a method call instead
        dateNow() {
          return Date.now()
        },
    },
    computed: {
      // a computed getter
      publishedBooksMessage() {
        return this.author.books.length > 0 ? 'Yes' : 'No';
      },
      
      // computed property will never update, because Date.now() is not a reactive dependency:
      // will only re-evaluate when some of its reactive dependencies have changed
      now() {
        return Date.now()
      },
      fullName: {
        // getter
        get() {
          return this.firstName + ' ' + this.lastName;
        },
        // setter 
        set(newValue) {
          // Note: we are using destructuring assignment syntax here.   
          [this.firstName, this.lastName] = newValue.split(' ')
        }
      }
    }
}
</script>