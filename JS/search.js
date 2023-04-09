const queryString = location.search;
const loader = document.querySelector(".loader");
const urlParams = new URLSearchParams(queryString);
const search = urlParams.get("Search").trim();
const searchKeywords = search.replace(/ /g, "%20");
console.log(searchKeywords, search);
const title = document.querySelector("#search-title");
title.textContent = `News related to '${search}'`;
const key = "22fe9e88d4c7108bb689f567a7d4d342";
//fetching news from API
async function fetchNews() {
  try {
    let news = await (
      await fetch(
        `https://gnews.io/api/v4/search?q=${searchKeywords}&apikey=${key}`
      )
    ).json();
    news = news.articles;
    setNews(
      news,
      document.querySelector("#news .wrapper"),
      document.querySelector("#template")
    );
  } catch (error) {
    console.log(error);
    setError(error, document.querySelector("#news .wrapper"));
  }
}
// display news related to search keyword..
function setNews(posts, container, template) {
  container.innerHTML = "";
  if (posts.length) {
    posts.forEach((post) => {
      let div = template.content.cloneNode(true);
      div.querySelector("img").addEventListener("click", () => {
        window.open(`${post.url}` , '_blank')
      });
      div.querySelector("img").src = post.image
        ? post.image
        : "https://picsum.photos/400/300";
      div.querySelector(".date").textContent = updateTime(post.publishedAt);
      div.querySelector(".source").textContent = post.source.name
        ? post.source.name
        : "Unknown";
      div.querySelector(".post-title").textContent = post.title;
      if (div.querySelector(".post-text"))
        div.querySelector(".post-text").textContent = post.description
          ? post.description.slice(0, 200)
          : post.content.slice(0, 200);
      div.querySelector(".post-link").href = post.link;
      container.append(div);
    });
  } else if (posts.length == 0) {
    container.innerHTML = `
       <div class='col text-center'>
        <img class='img-fluid d-block m-auto' src='images/No data-amico.svg' width='240px' height='240px'/>
        <h4 >Result Not Found</h4>
        <a href='index.html' class='btn btn-outline-primary'>Go Back</a>
        </div>`;
  }
}
function setError(error, container) {
  container.innerHTML =
    `<div class='col text-center text-danger small'> <img class='img-fluid d-block m-auto position-relative' src='images/Oops! 404 Error with a broken robot-rafiki.svg' width='240px' height='240px'/><p>Network Error<p></div>`;
}
//creating custom time for display
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
