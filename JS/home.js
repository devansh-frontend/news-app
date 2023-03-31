const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'df7b70526amshdc8d1642ef9b45fp1507fbjsn4a9c67738fc1',
		'X-RapidAPI-Host': 'newsdata2.p.rapidapi.com'
	}
};
fetchNews();
async function fetchNews(){
   try {
      let news =  await (await fetch('https://newsdata2.p.rapidapi.com/news?country=in&language=en', options)).json();
      console.log(news)
      let breakingNews = news.results[0];
      let latestNews = (news.results).slice(1,7);
      let trendingNews = (news.results).slice(8,10);
      setBreakingNews(breakingNews);  
      setNews(latestNews, document.querySelector("#latest .wrapper") , document.querySelector("#latest #template"));   
      setNews(trendingNews, document.querySelector("#trending .wrapper") ,document.querySelector("#trending #template")); 
      let sportsNews =  await (await fetch('https://newsdata2.p.rapidapi.com/news?country=in&category=sports&language=en', options)).json(),
      entertainmentNews = await (await fetch('https://newsdata2.p.rapidapi.com/news?country=in&category=entertainment&language=en', options)).json();
      sportsNews = (sportsNews.results).slice(0,3);
      entertainmentNews = (entertainmentNews.results).slice(0,3);
      setNews(sportsNews ,document.querySelector(".sports-wrapper") , document.querySelector("#template3") ) ;
      setNews(entertainmentNews ,document.querySelector(".entertainment-wrapper") , document.querySelector("#template3") );

   } catch (error) {
      console.log(error)
      const errorPost = {
         title : "Something went wrong. Please refresh your page or try after sometime.",
         link : "",
         image_url : ""
      }
      setBreakingNews(errorPost);
      setNews([], document.querySelector("#latest .wrapper") , document.querySelector("#latest #template"));   
      setNews([], document.querySelector("#trending .wrapper") ,document.querySelector("#trending #template")); 
   }
}

function setBreakingNews(post) {
   if(post){
      const heroSection = document.querySelector("#hero");
      heroSection.querySelector(".post-title").textContent = (post.title).length > 100 ? (post.title).slice(0 , 100)+"...": post.title;
      heroSection.querySelector(".post-link").href = post.link;
      heroSection.querySelector(".post-link").textContent = "Full coverage";
      heroSection.querySelector(".post-link").classList.remove('placeholder');
}
}
function setNews(posts, container ,template){
   container.innerHTML = "";
   if(posts.length){
      posts.forEach(post => {
         let div = template.content.cloneNode(true);
         div.querySelector('img').src = post.image_url ? post.image_url : "https://picsum.photos/400/300";
         div.querySelector('.date').textContent = updateTime(post.pubDate);
         div.querySelector('.source').textContent = post.source_id ? post.source_id: "Unknown";
         div.querySelector('.post-title').textContent = post.title;
         if(div.querySelector('.post-text')) div.querySelector('.post-text').textContent = post.description ? post.description.slice(0,200) : null;
         div.querySelector('.post-link').href = post.link;
         container.append(div);
      })
   }
   else if(!posts.length){
      container.innerHTML = ("<div class='col text-center text-danger small'> <img class='img-fluid d-block m-auto' src='./images/Oops! 404 Error with a broken robot-rafiki.svg' width='240px'/><p> Network error. Please try again later <p></div>");
   }
}
function updateTime(str) {
   let date = new Date(str)
   let now = Date.now();
   let diff = now - date.getTime();
   let ss = Math.floor(diff / 1000 )
   let mm = Math.floor(ss / 60)
   let hh = Math.floor(mm / 60)
   let dd = Math.floor(hh / 24)
   let month = Math.floor(dd / 30);
   let yy = Math.floor(dd / 365 );
   let time = null;
   yy >= 1 ? time = yy + " year ago" : 
   month >= 1 ? time = month + " month ago" :
   dd >= 1 ? time = dd + " day ago" :
   hh >= 1 ? time = hh+ " hour ago" :
   mm >= 1 ? time = mm + " minute ago" :
   ss >= 1 ? time = ss + " second ago" :
   time = "Unknown Time";
   return time
   }
