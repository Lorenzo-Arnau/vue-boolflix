new Vue({
  el: '#root',
  data: {
      listMovies:[],
      userSearch:'',
  },
  mounted() {

  },
  methods:{
    searchAPI : function(){
      const self = this;
        axios.get('https://api.themoviedb.org/3/search/movie?api_key=7f4bd6b9c8030a418c2d09489d3ddda7&query=' + self.userSearch)
        .then(function(response) {
         self.listMovies = response.data.results;
         console.log( self.listMovies);
        });
    },
  },
});
Vue.config.devtools = true


// Axios CALL
// const self = this;
//   axios.get('API')
//   .then(function(response) {
//     response.data.response
//   });
