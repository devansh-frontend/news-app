const queryString = location.search;
const loader = document.querySelector(".loader");
const urlParams = new URLSearchParams(queryString);
const search = urlParams.get('Search'); // devansh chauhan
const searchKeywords = search.replace(/ /g , "%20");
console.log(searchKeywords , search);
const title = document.querySelector("#search-title");
title.textContent = `News related to '${search}'`;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'df7b70526amshdc8d1642ef9b45fp1507fbjsn4a9c67738fc1',
		'X-RapidAPI-Host': 'newsdata2.p.rapidapi.com'
	}
};

async function fetchNews(){
    try {
      let news =  await (await fetch(`https://newsdata2.p.rapidapi.com/news?language=en&q=${searchKeywords}`, options)).json();
       news = news.results;
       setNews(news ,document.querySelector("#news .wrapper") , document.querySelector("#template") ) ;
    } catch (error) {
      console.log(error);
        setError(error , document.querySelector("#news .wrapper")) ;
    }
 }
 
 function setNews(posts, container ,template){
    console.log(posts , posts.length);
    container.innerHTML = "";
    if(posts.length){
       posts.forEach(post => {
          let div = template.content.cloneNode(true);
          div.querySelector('img').src = post.image_url ? post.image_url : "https://picsum.photos/400/300";
          div.querySelector('.date').textContent = updateTime(post.pubDate);
          div.querySelector('.source').textContent = post.source_id ? post.source_id : "Unknown";
          div.querySelector('.post-title').textContent = post.title;
          if(div.querySelector('.post-text')) div.querySelector('.post-text').textContent = post.description ? post.description.slice(0,200) : null;
          div.querySelector('.post-link').href = post.link;
          container.append(div);
       })
    }
    else if(posts.length == 0){
       container.innerHTML = (`
       <div class='col text-center'>
        <img class='img-fluid d-block m-auto' src='./images/No data-amico.svg' width='240px'/>
        <h4 >Result Not Found</h4>
        <a href='index.html' class='btn btn-outline-primary'>Go Back</a>
        </div>`);
    }
 }
 function setError(error , container ) {
    container.innerHTML = ("<div class='col text-center text-danger small'> <img class='img-fluid d-block m-auto' src='./images/Oops! 404 Error with a broken robot-rafiki.svg' width='240px'/><p> Network error. Please try again later <p></div>");
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
fetchNews();
