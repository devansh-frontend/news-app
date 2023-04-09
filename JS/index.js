const key = "22fe9e88d4c7108bb689f567a7d4d342";
const url = "https://gnews.io/api/v4/";
// fetching news from API
fetchNews();
async function fetchNews() {
  try {
    let news = await (await fetch(`${url}top-headlines?country=in&max=10&lang=en&apikey=${key}`)).json();
    let breakingNews = news.articles[0];
    let latestNews = news.articles.slice(1, 7);
    let trendingNews = news.articles.slice(8, 10);
    setBreakingNews(breakingNews);
    setNews(latestNews, document.querySelector("#latest .wrapper"), document.querySelector("#latest #template"));
    setNews(trendingNews, document.querySelector("#trending .wrapper"), document.querySelector("#trending #template"));
    let sportsNews = await (await fetch(`${url}top-headlines?category=sports&country=in&max=10&lang=en&apikey=${key}`)).json(),
      entertainmentNews = await (await fetch(`${url}top-headlines?category=world&country=in&max=10&lang=en&apikey=${key}`)).json();
    sportsNews = sportsNews.articles.slice(0, 3);
    entertainmentNews = entertainmentNews.articles.slice(0, 3);
    setNews(sportsNews, document.querySelector(".sports-wrapper"), document.querySelector("#template3"));
    setNews(entertainmentNews, document.querySelector(".entertainment-wrapper"), document.querySelector("#template3"));
  } catch (error) {
    console.log(error);
    const errorPost = {
      title: "Something went wrong. Please refresh your page or try after sometime.",
      link: "",
      image_url: "",
      error: "error",
    };
    setBreakingNews(errorPost);
    setNews([], document.querySelector("#latest .wrapper"), document.querySelector("#latest #template"));
    setNews([], document.querySelector("#trending .wrapper"), document.querySelector("#trending #template"));
  }
}
// display breaking news...
function setBreakingNews(post) {
  const heroSection = document.querySelector("#banner");
  heroSection.querySelector(".post-title").textContent = post.title.length > 100 ? post.title.slice(0, 100) + "..." : post.title;
  heroSection.querySelector(".post-link").href = post.url;
  heroSection.querySelector(".post-link").textContent = "Full coverage";
  heroSection.querySelector(".post-link").classList.remove("placeholder", "disabled");
  if (post.error) {
    heroSection.querySelector(".post-link").textContent = "";
    heroSection.querySelector(".post-link").classList.add("placeholder", "disabled");
  }
}
//display other news ..
function setNews(posts, container, template) {
  container.innerHTML = "";
  if (posts.length) {
    posts.forEach((post) => {
      let div = template.content.cloneNode(true);
      div.querySelector("img").addEventListener("click", () => {
        window.open(`${post.url}` , '_blank')
      });
      div.querySelector("img").src = post.image ? post.image : "https://picsum.photos/400/300";
      div.querySelector(".date").textContent = updateTime(post.publishedAt);
      div.querySelector(".source").textContent = post.source.name ? post.source.name : "Unknown";
      div.querySelector(".post-title").textContent = post.title;
      if (div.querySelector(".post-text")) div.querySelector(".post-text").textContent = post.description ? post.description.slice(0, 200) : post.content.slice(0, 200);
      div.querySelector(".post-link").href = post.url;
      container.append(div);
    });
  } else if (!posts.length) {
    container.innerHTML =
      "<div class='col text-center text-danger small'> <img class='img-fluid d-block m-auto position-relative' src='images/Oops! 404 Error with a broken robot-rafiki.svg' width='240px' height='240px'/><p> Network error. Please try again later <p></div>";
  }
}
//creating custom time for dispaly..
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
