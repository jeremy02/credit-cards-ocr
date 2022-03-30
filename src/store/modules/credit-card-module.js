import axios from 'axios'

let initialMessage = {
      success: false,
      message: null,
};

const state = { 
    users: [],
    selectedImage: null,
    selectedImageBase64: null,
    messageResult: {
      success: false,
      message: null,
    },
    initialMessage: initialMessage
};

const getters = {
    usersList: state => state.users,
    selectedImage: state => state.selectedImage,
    selectedImageBase64: state => state.selectedImageBase64,
    messageResult: state => state.messageResult
};

const actions = { 
    async fetchUsers({commit}){
      const response = await axios.get("http://localhost:3000/users");
      commit("setUsers", response.data)
    },
    async addUsers({commit}, user){
      const response = await axios.post("http://localhost:3000/users", user);
      commit("addNewUser", response.data)
    },
    async deleteUser({commit}, id){
      await axios.delete(`http://localhost:3000/users/${id}`);
      commit("removeUser", id)
    },
    async handleImageSelect({commit}, event){
      // init the message to return
      let msg = state.initialMessage;
       
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
    setUsers: (state, users) => (
        state.users = users
    ),
    addNewUser: (state, user) => state.users.unshift(user),
    removeUser: (state, id) => (
        state.users.filter(user => user.id !== id),
        state.users.splice(user => user.id, 1)
    ),
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