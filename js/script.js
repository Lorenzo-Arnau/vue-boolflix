const votazione = 'vote_average';
new Vue({
  el: '#root',
  data: {
      actors:'',
      switcher:false,
      changeView:'moviestv',
      genresList:[],
      listMovies:[],
      listTvSeries:[],
      listPopoularTV:[],
      firstElement:[],
      listPopoularMovies:[],
      allList:[],
      userSelect:'',
      userSearch:'',
      listLang: ['en','de','fr','it','es'],
      key:'?api_key=7f4bd6b9c8030a418c2d09489d3ddda7',
  },
  mounted() {
      const self = this;
      axios.all([
      axios.get('https://api.themoviedb.org/3/genre/movie/list' + self.key),
      axios.get('https://api.themoviedb.org/3/trending/movie/day'+  self.key),
      axios.get('https://api.themoviedb.org/3/trending/tv/day' + self.key)])
      .then(axios.spread((...responses) => {
        const responseOne = responses[0]
        const responseTwo = responses[1]
        const responesThree = responses[2]
        self.genresList = responseOne.data.genres;
        self.listPopoularMovies = responseTwo.data.results;
        self.listPopoularTV = responesThree.data.results;
        self.makingRating(self.listPopoularMovies,votazione);
        self.makingRating(self.listPopoularTV,votazione);
        self.firstElement = self.listPopoularTV[0];
        self.actorsbyID(self.listPopoularTV[0].id)
      })).catch(errors => {
        console.log('error on load');
      })
  },
  methods:{
    searchAPI : function(){
      const self = this;
      axios.all([
      axios.get('https://api.themoviedb.org/3/search/movie'+  self.key + '&query=' + self.userSearch),
      axios.get('https://api.themoviedb.org/3/search/tv'+  self.key + '&query=' + self.userSearch)])
      .then(axios.spread((...responses) => {
        const responseMovie = responses[0]
        const responseTv = responses[1]
        self.listMovies =responseMovie.data.results;
        self.listTvSeries = responseTv.data.results;
        self.allList = self.listMovies.concat(self.listTvSeries)
        self.checkingTitle(self.allList)
        self.makingRating(self.allList,votazione);
        self.actorsbyID(self.allList[0].id)
        self.firstElement = self.allList[0];
      })).catch(errors => {
        console.log('error on load');
      })
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
      if (imgPath) {
        return 'https://image.tmdb.org/t/p/w500/'+ imgPath;
      }else {
        return 'img/notAvailable.png'
      }
    },
    filterListByGenre : function(element) {
      this.switcher = true;
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
    return axios.get('https://api.themoviedb.org/3/movie/'+ elementId +'/credits'+  self.key)
      .then(function(response) {
        let actorsList =[];
        let actorsArray = response.data.cast;
        actorsArray.forEach((item, i) => {
          actorsList.push(item.name)
         });
         var actors='';
         for (var i = 0; i < 5; i++) {
         actors += (actorsList[i] + ' - ')
         }
         return self.actors = actors
       }).catch(errors => {
         return self.actors = 'Oops! something gone wrong no actors finded'
       });
    },
    changeModel : function(){
      switch (this.changeView) {
          case 'moviestv':
          return this.allList
          break;
          case 'movies':
          this.actorsbyID(this.listMovies[0].id);
          this.firstElement = this.listMovies[0];
          return this.listMovies
          break;
          case 'tv':
          this.actorsbyID(this.listTvSeries[0].id);
          this.firstElement = this.listTvSeries[0];
          return this.listTvSeries
          break;
          default:
          this.actorsbyID(this.allList[0].id);
          this.firstElement = this.allList[0];
          return this.allList;
      }
    },
    setFirst: function(element){
      this.firstElement = element;
      this.actorsbyID(element.id);
      window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
      });
    },
  },
});
Vue.config.devtools = true
