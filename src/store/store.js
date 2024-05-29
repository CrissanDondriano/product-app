import Vuex from 'vuex'
import axios from 'axios'
export const store = new Vuex.Store({
    name: 'store',
    state: {
        apiUrl: 'http://127.0.0.1:8000/api', //store the api url so that it can changed if needed later in production environment
        posts: [], //use for all posts
        post: [], //use for single post
        searchQuery: '',
    },
    
    getters: {
        //this getter will return all the posts and is triggered when the user first loads the page
        getPosts: state => {
            return axios.get(state.apiUrl + '/posts')
                .then(response => {
                    state.posts = response.data; //store all posts in the state
                })
                .catch(error => {   
                    console.error("Error fetching posts:", error);
                });
        },
        //this getter will return a single post and is triggered when the user clicks on a edit or delete post
        getPost: (state) => (id) => {
            return axios.get(state.apiUrl + '/post/' + id)
                .then(response => {
                    state.post = response.data; //store specific post in the state
                })
                .catch(error => {   
                    //handle error as needed
                    alert(error.message)
                });
        }
    },

    mutations: {
        async refreshPosts(state, posts) {
            // this mutation will refresh the posts that display on the page
            // its triggered every time the user adds, edits, or deletes a post
            await axios.get(state.apiUrl + '/posts')
                .then(response => {
                    posts = response.data;
                })
                .catch(error => {   
                    alert(error.message)
                });
            state.posts = posts;
        },
        async filteredPosts(state, searchQuery) {
            await axios.get(state.apiUrl + '/search/' + searchQuery)
                .then(response => {
                    state.posts = response.data; //store all posts in the state that match the searchQuery
                })
                .catch(error => {   
                    alert(error.message)
                    state.posts= []; //reset the state if an error occurs
                });
            // state.posts = posts;
        },
        updateTitle (state, title) {
            state.post.title = title; //update the post title 
        },
        updateContent (state, content) {
            state.post.content = content; //update the post content
        }
    },

    actions: {
        refreshPosts({ commit }) {
            commit('refreshPosts'); //call the refreshPosts mutation
        },

        updateTitle({ commit }, title) {
            commit('updateTitle', title); //call the updateTitle mutation and pass in the title
        },
        updateContent({ commit }, content) {
            commit('updateContent', content); //call the updateContent mutation and pass in the content
        },
        filteredPosts({ commit }, searchQuery) {
            if (searchQuery === '') {
                commit('refreshPosts'); //call the refreshPosts mutation if the searchQuery is empty
            }else{
                commit('filteredPosts', searchQuery); //call the filteredPosts mutation and pass in the searchQuery
            }
        }

    }
})