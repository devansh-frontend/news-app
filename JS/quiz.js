const container = document.querySelector("#quizzes-container .row");
const template = document.querySelector("#quizzes-container #template");
const playedQuizzes = JSON.parse(localStorage.getItem("playedQuizzes")) || [];
// fetch all available quizzes..
(async function(){
    try {
        let quizList = await (await fetch("quiz.json")).json();
        showQuizList(quizList);
    } catch (error) {
        console.log(error)
    }
})();
// display all quizzes
function showQuizList(quizList) {
    quizList.forEach(quiz => {
        let div = template.content.cloneNode(true);
        div.querySelector(".quiz-title").textContent = quiz.quizTitle;
        div.querySelector(".total-questions #number").textContent = quiz.totalQus;
        div.querySelector(".score-btn").textContent = isPlayed(quiz.quizID) ? `Last Score : ${isPlayed(quiz.quizID)}` : "Not played yet" ;
        div.querySelector(".play-btn").textContent = isPlayed(quiz.quizID) ? `Play Again` : "Start" ;
        div.querySelector(".play-btn").href = `single_quiz.html#${quiz.quizID}`;
        container.append(div);
    });
}
// check if user already played quiz
function isPlayed(quizID){
    let quiz = playedQuizzes.find(q => q.ID == quizID)
    if(quiz) return quiz.score || "0";
    return false;
}
