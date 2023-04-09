const ID = location.hash.slice(1);
const title = document.querySelector(".title");
const container = document.querySelector("#quiz-container .wrapper");
let playedQuizzes = JSON.parse(localStorage.getItem("playedQuizzes")) || [];

//display quiz...
function displayQuiz(quiz){
    let score = 0;
    const template = document.querySelector("#quiz-container #template");
    let currentQus = 1;
    let totalQus = quiz.totalQus;
    loadQustion(currentQus-1);
    function loadQustion(number){
        let div = template.content.cloneNode(true);
        div.querySelector(".currentQus").textContent = currentQus;
        div.querySelector(".totalQus").textContent = totalQus;
        div.querySelector(".qus").textContent = quiz.questions[number].question;
        let optionDisabled;
        const options = div.querySelectorAll(".option");
        quiz.questions[number].options.forEach((opt , index) => {
            options[index].textContent = opt;
            options[index].addEventListener('click' , (event) => {
                if(!optionDisabled) { 
                    if(options[index].textContent == quiz.questions[number].answer){
                        score++;
                        options[index].classList.add('bg-success' , 'text-white');
                    }
                    else{
                        options[index].classList.add('bg-danger' , 'text-white');
                        const option = [...options].find(option => option.textContent == quiz.questions[number].answer);
                        option.classList.add("bg-success" , "text-white");
                    }
                }
                optionDisabled = true;
            })
        });    
        if((currentQus) == totalQus) div.querySelector(".btn").textContent = "Submit";
        div.querySelector(".btn").addEventListener('click' , (event) => {
            currentQus += 1;
            if(currentQus > totalQus){
                submitQuiz(score , totalQus) ;
                return;
            } 
            loadQustion(currentQus-1);
        })
        container.innerHTML = "";
        container.append(div);
    }
    }

//fetch single quiz
(async function(){
    try {
        let quizList = await (await fetch("quiz.json")).json();
        let quiz = quizList.find(q => q.quizID == ID);
        title.textContent = quiz.quizTitle;
        document.title += ` | ${quiz.quizTitle}`;
        displayQuiz(quiz);
    } catch (error) {
        // console.log(error);
        alert("Somthing went wrong");
    }
})();
// generate result
function submitQuiz(score , total) {
    let data = {ID , score: score};
    console.log(score,total);
    let quiz = playedQuizzes.find(q => q.ID == ID);
    if(quiz) quiz.score = score;
    else playedQuizzes = [...playedQuizzes , data];
    localStorage.setItem("playedQuizzes" , JSON.stringify(playedQuizzes))
    const template = document.querySelector("#quiz-container #result-template");
    const div = template.content.cloneNode(true);
    div.querySelector("#score").textContent = `${score}/${total}`;
    div.querySelector(".circle").textContent = `${Math.round((score / total) *100)}%`;
    container.innerHTML = "";
    container.append(div);
}