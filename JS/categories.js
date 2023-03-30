const queryString = location.search;
const loader = document.querySelector(".loader");
const urlParams = new URLSearchParams(queryString);
const category = /*urlParams.get('category').toLowerCase() || */ "sports";
const title = document.querySelector("#category-title");
title.textContent = category == "general" ? "Latest" : category;
const myKey = "93b0fc75424140e49d2d3ea092cbeb85";
const loadMoreBtn = document.querySelector(".load-more");
let page = 1;
const pageSize = 12;
let totalPage = 0 ;
let totalPosts = 0;
(async function (){
await fetchNews();
setPagination();
})();
async function fetchNews(){
    try {
       let news =  await (await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&country=in&page=${page}&pageSize=${pageSize}&apiKey=${myKey}`)).json();
       totalPosts = news.totalResults;
       console.log(news)
       setNews(news.articles ,document.querySelector("#news .wrapper") , document.querySelector("#template") ) ;
    } catch (error) {
        setNews([] , document.querySelector("#news .wrapper") , document.querySelector("#template") ) ;
    }
 }
 
 function setNews(posts, container ,template){
    if(posts.length){
       posts.forEach(post => {
          let div = template.content.cloneNode(true);
          div.querySelector('img').src = post.urlToImage ? post.urlToImage : "/images/posts/No_Image_Available.jpg";
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
 function setPagination(){
   totalPage = Math.ceil(totalPosts/pageSize);
   console.log(totalPage,totalPosts,pageSize);
   if(totalPage > 1) loadMoreBtn.classList.remove('d-none')
 }
 loadMoreBtn.addEventListener('click' , (event)=>{
   page += 1;
   if(page == totalPage) loadMoreBtn.classList.add('d-none')
   fetchNews();
 })

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
   else if( dd >= 1){
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

 