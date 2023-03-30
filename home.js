// const myKey = "df17a4bb319e4bea914f5e40ba5384f5";
const myKey = "3ad24b429c9548c991ca5cbc9290254e";
async function fetchBreakingNews(){
   try {
      let breakingNews =  await (await fetch(`http://newsapi.org/v2/top-headlines?country=in&pageSize=1&apiKey=${myKey}`)).json();
      console.log(breakingNews)
   setBreakingNews(breakingNews.articles[0]);     
   } catch (error) {
      const errorPost = {
         title : "Opps .. something went wrong. Please refresh your page or try after sometime.",
         url : "",
         urlToImage : ""
      }
      setBreakingNews(errorPost);
   }
}

function setBreakingNews(post) {
   if(post){
      const heroSection = document.querySelector("#hero");
      heroSection.style.backgroundImage = `linear-gradient(#4070f0 , #ffffff99) , url(${post.urlToImage})`;
      heroSection.querySelector(".post-title").textContent = (post.title).length > 100 ? (post.title).slice(0 , 100)+"...": post.title;
      if(post.url){
      heroSection.querySelector(".post-link").href = post.url;
      heroSection.querySelector(".post-link").textContent = "Full coverage";
   }
}
}

async function fetchLatestNews(){
   try {
      let latestNews =  await (await fetch(`http://newsapi.org/v2/top-headlines?country=in&pageSize=7&apiKey=${myKey}`)).json();
      latestNews = latestNews.articles;
      latestNews.shift();
      setNews(latestNews, document.querySelector("#latest .row") , document.querySelector("#latest #template"));   
   } catch (error) {
      setNews([] , document.querySelector("#latest .row") , document.querySelector("#latest #template"));
   }
}
async function fetchTrendingNews(){
   try {
      let trendingNews =  await (await fetch(`http://newsapi.org/v2/top-headlines?category=technology&country=in&pageSize=2&apiKey=${myKey}`)).json();
      setNews(trendingNews.articles, document.querySelector("#trending .row") ,document.querySelector("#trending #template")) 
   } catch (error) {
      setNews([], document.querySelector("#trending .row") ,document.querySelector("#trending #template"));
   }
}
async function fetchSportsNews(){
   try {
      let news =  await (await fetch(`http://newsapi.org/v2/top-headlines?category=sports&country=in&pageSize=3&apiKey=${myKey}`)).json();
      setNews(news.articles ,document.querySelector(".sports-wrapper") , document.querySelector("#template3") ) ;
   } catch (error) {
      setNews([] , document.querySelector(".sports-wrapper") , document.querySelector("#template3")) ;
   }
}

async function fetchEntertainmentNews(){
   try {
      let news =  await (await fetch(`http://newsapi.org/v2/top-headlines?category=entertainment&country=in&pageSize=3&apiKey=${myKey}`)).json();
      setNews(news.articles ,document.querySelector(".entertainment-wrapper") , document.querySelector("#template3")) ;
   } catch (error) {
      setNews([] ,document.querySelector(".entertainment-wrapper") , document.querySelector("#template3")) ;
   }
}
function setNews(posts, container ,template){
   if(posts.length){
      posts.forEach(post => {
         let div = template.content.cloneNode(true);
         div.querySelector('img').src = post.urlToImage ? post.urlToImage : "/images/No_Image_Available.jpg";
         div.querySelector('.date').textContent = updateTime(post.publishedAt);
         div.querySelector('.source').textContent = post.source.name ? post.source.name : "Unknown";
         div.querySelector('.post-title').textContent = post.title;
         if(div.querySelector('.post-text')) div.querySelector('.post-text').textContent = post.description;
         div.querySelector('.post-link').href = post.url;
         container.append(div);
      })
   }
   else if(!posts.length){
      container.append("Didn't find anything");
   }
}
function updateTime(str) {
   str = str.replace(/[TZ]/g , " ");
   const date = new Date(str);
   const timeLaps =  new Date().getTime() - date.getTime() - 28000000;
   const yy = Math.floor(timeLaps / (1000*60*60*24*365));
   const mm = Math.floor(timeLaps / (1000*60*60*24*31));
   const dd = Math.floor(timeLaps / (1000*60*60*24));
   const hh = Math.floor(timeLaps / (1000*60*60));
   const mi = Math.floor(timeLaps / (1000*60));
   const ss = Math.floor(timeLaps / (1000));
   if( yy >= 1){
      return (yy + " year ago");
   }
   else if( mm >= 1){
      return (mm + " month ago");
   }
   else if( dd >= 2){
      return (dd + " day ago");
   }
   else if( hh >= 1){
      return (hh + " hour ago");
   }
   else if( mi >= 1){
      return (mi + " minute ago");
   }
   else if( ss >= 1){
      return (ss + " second ago");
   }
}
fetchBreakingNews();
fetchLatestNews();
fetchTrendingNews();
fetchSportsNews();
fetchEntertainmentNews();
