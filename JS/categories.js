const queryString = location.search;
const loader = document.querySelector(".loader");
const urlParams = new URLSearchParams(queryString);
const category = urlParams.get('category').toLowerCase() ;
document.title += ` | ${category}`;
const title = document.querySelector("#category-title");
title.textContent = category == "general" ? "Latest" : category;
const key = "22fe9e88d4c7108bb689f567a7d4d342";
const url = "https://gnews.io/api/v4/";

// fetch news by category..
async function fetchNews(){
    try {
      let newsArray =  await (await fetch(`${url}top-headlines?category=${category}&country=in&max=10&lang=en&apikey=${key}`)).json();
      news = newsArray.articles;
      setNews(news ,document.querySelector("#news .wrapper") , document.querySelector("#template") ) ;
    } catch (error) {
      console.log(error);
        setNews([] , document.querySelector("#news .wrapper") , document.querySelector("#template") ) ;
    }
 }
 // display fetched news 
 function setNews(posts, container ,template){
   container.innerHTML = "";
    if(posts.length){
       posts.forEach(post => {
          let div = template.content.cloneNode(true);
          div.querySelector("img").addEventListener("click", () => {
            window.open(`${post.url}` , '_blank')
          });    
          div.querySelector('img').src = post.image ? post.image : "https://picsum.photos/400/300";
          div.querySelector('.date').textContent = updateTime(post.publishedAt);
          div.querySelector('.source').textContent = post.source.name ? post.source.name : "Unknown";
          div.querySelector('.post-title').textContent = post.title;
          if(div.querySelector('.post-text')) div.querySelector('.post-text').textContent = post.description ? post.description.slice(0,200) : post.content.slice(0,200);
          div.querySelector('.post-link').href = post.url;
          container.append(div);
       })
    }
    else if(!posts.length){
       container.innerHTML = ("<div class='col text-center text-danger small'> <img class='img-fluid d-block m-auto' src='images/Oops! 404 Error with a broken robot-rafiki.svg' width='240px' height='240px'/><p> Internal error. Please try again later <p></div>");
    }
 }
// dispaly custom time
function updateTime(str) {
   let date = new Date(str);
   let now = Date.now();
   let diff = now - date.getTime();
   let ss = Math.floor(diff / 1000);
   let mm = Math.floor(ss / 60);
   let hh = Math.floor(mm / 60);
   let dd = Math.floor(hh / 24);
   let month = Math.floor(dd / 30);
   let yy = Math.floor(dd / 365);
   let time = null;
   yy >= 1
     ? (time = yy + " year ago")
     : month >= 1
     ? (time = month + " month ago")
     : dd >= 1
     ? (time = dd + " day ago")
     : hh >= 1
     ? (time = hh + " hour ago")
     : mm >= 1
     ? (time = mm + " minute ago")
     : ss >= 1
     ? (time = ss + " second ago")
     : (time = "Unknown Time");
   return time;
 }
 fetchNews();
