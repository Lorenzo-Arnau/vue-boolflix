const votazione = 'vote_average';
const code = '';
new Vue({
  el: '#root',
  data: {
      genresList:[],
      listMovies:[],
      listTvSeries:[],
      allList:[],
      userSelect:'',
      userSearch:'',
      listLang: ['en','de','fr','it','es'],
  },
  mounted() {
      const self = this;
        axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=7f4bd6b9c8030a418c2d09489d3ddda7')
        .then(function(response) {
         self.genresList = response.data.genres;
         console.log(self.genresList);
         });
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
    searchAPItvSeries : function(){
      const self = this;
        axios.get('https://api.themoviedb.org/3/search/tv?api_key=7f4bd6b9c8030a418c2d09489d3ddda7&query=' + self.userSearch)
        .then(function(response) {
         self.listTvSeries = response.data.results;
         console.log( self.listTvSeries);
         self.allList = self.listMovies.concat(self.listTvSeries)
         console.log(self.allList);
         self.checkingTitle(self.allList)
         self.makingRating(self.allList,votazione);
        });
    },
    checkingTitle :function(array){
      array.forEach((item, i) => {
        if (item.title == item.original_title) {
          item.original_title = '';
        }
      });
    },
    makingRating :function(array,vote){
      array.forEach((item, i) => {
        item[vote] =   Math.floor(item[vote] / 2);
      })
    },
    langToFlag : function(lang){
      if (this.listLang.includes(lang)) {
        return lang
      }else {
        return 'others'
      }
    },
    imageNotAvailable : function(imgPath){
      if (imgPath != null) {
        return 'https://image.tmdb.org/t/p/w500/'+ imgPath;
      }else {
        return 'img/notAvailable.png'
      }
    },
    filterListByGenre : function(element) {
      if (element.genre_ids[0] === this.userSelect) {
      return true;
      }
    },
    convertGenre : function(elementGenre){
    const findElement = this.genresList.find((element)=>{
       return element.id == elementGenre;
     });
     if (findElement) {
       return findElement.name
     }else {
       return elementGenre;
     }
    },
    actorsbyID : function(elementId){
    const self = this;
    return axios.get('https://api.themoviedb.org/3/movie/'+ elementId +'/credits?api_key=7f4bd6b9c8030a418c2d09489d3ddda7')
      .then(function(response) {
        let actorsList =[];
        let actorsArray = response.data.cast;
        actorsArray.forEach((item, i) => {
          actorsList.push(item.name)
         });
         console.log(actorsList);
         console.log(actorsList[0]);
         return actorsList[0];
       });
    },

  },
});
Vue.config.devtools = true
