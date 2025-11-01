import React, { useEffect } from "react";

export default function WordPuzzle() {
  useEffect(() => {
    const allQuestions = [
      { text: "Form a 5-letter word for a fruit 🍎 starting with 'A':", letters: ['T','E','P','L','P','S','A','N'], answers: ['APPLE'] },
      { text: "Find a 5-letter word for a place where we study 📚:", letters: ['H','C','S','L','O','L','H','O'], answers: ['SCHOOL'] },
      { text: "Create a 5-letter word meaning 'feeling good 😊':", letters: ['A','H','P','E','Y','L','P','E'], answers: ['HAPPY'] },
      { text: "Find a 5-letter word for a color 🎨 starting with 'G':", letters: ['G','N','Z','E','R','L','E','P'], answers: ['GREEN'] },
      { text: "Form a 5-letter word for 'something you drink 🥤':", letters: ['W','A','T','E','R','S','O','N'], answers: ['WATER'] },
      { text: "Make a 6-letter word for 'a place to live 🏠':", letters: ['H','O','U','S','E','S','T','R'], answers: ['HOUSE'] },
      { text: "Find a 5-letter word for a season 🌸:", letters: ['S','P','R','I','N','G','S','L'], answers: ['SPRING'] },
      { text: "Form a 5-letter word meaning 'friend 🧑‍🤝‍🧑':", letters: ['F','R','I','E','N','D','S','O'], answers: ['FRIEND'] },
      { text: "Make a 6-letter word for a flying bird 🕊️:", letters: ['P','I','G','E','O','N','S','A'], answers: ['PIGEON'] },
      { text: "Create a 5-letter word for 'sleep time 🌙':", letters: ['N','I','G','H','T','D','Y','S'], answers: ['NIGHT'] }
    ];

    let usedQuestions: any[] = [];
    let currentQuestion: any, selectedLetters: string[] = [];
    let score = 0, timerInterval: number | undefined, timeLeft = 60;

    const questionEl = document.getElementById("question") as HTMLDivElement | null;
    const lettersEl = document.getElementById("letters") as HTMLDivElement | null;
    const answerBox = document.getElementById("answer-box") as HTMLDivElement | null;
    const feedback = document.getElementById("feedback") as HTMLDivElement | null;
    const scoreEl = document.getElementById("score") as HTMLSpanElement | null;
    const timeEl = document.getElementById("time") as HTMLSpanElement | null;

    function startGame(){
      score = 0;
      usedQuestions = [];
      loadQuestion();
      resetTimer();
    }

    function resetTimer(){
      if (timerInterval) window.clearInterval(timerInterval);
      timeLeft = 60;
      if (timeEl) timeEl.textContent = String(timeLeft);
      timerInterval = window.setInterval(()=>{
        timeLeft--;
        if (timeEl) timeEl.textContent = String(timeLeft);
        if(timeLeft <= 0){
          if (timerInterval) window.clearInterval(timerInterval);
          showTimeUp();
        }
      },1000);
    }

    function loadQuestion(){
      if(!questionEl || !lettersEl) return;
      if(usedQuestions.length === allQuestions.length){
        if (feedback) { feedback.textContent = "🎉 You completed all questions!"; feedback.className = "correct"; }
        if (timerInterval) window.clearInterval(timerInterval);
        return;
      }
      let q: any;
      do{
        q = allQuestions[Math.floor(Math.random()*allQuestions.length)];
      }while(usedQuestions.includes(q));
      usedQuestions.push(q);
      currentQuestion = q;
      questionEl.textContent = q.text;
      lettersEl.innerHTML = "";
      q.letters.forEach((l: string)=>{
        const el = document.createElement("span");
        el.textContent = l;
        el.className = "alphabet-block";
        el.onclick = ()=>{selectedLetters.push(l);updateAnswerBox();};
        lettersEl.appendChild(el);
      });
      selectedLetters = [];
      updateAnswerBox();
      if (feedback) feedback.textContent = "";
    }

    function updateAnswerBox(){
      if (answerBox) answerBox.textContent = selectedLetters.join("");
    }

    const submitBtn = document.getElementById("submit");
    const restartBtn = document.getElementById("restart");

    function onSubmit(){
      const userAns = selectedLetters.join("").toUpperCase();
      if(currentQuestion.answers.includes(userAns)){
        score += 10;
        if (feedback) { feedback.textContent = "✅ Correct!"; feedback.className = "correct"; }
        if (scoreEl) scoreEl.textContent = String(score);
        createConfetti();
        window.setTimeout(loadQuestion,1000);
      }else{
        if (feedback) { feedback.textContent = "❌ Try again!"; feedback.className = "incorrect"; }
      }
    }

    function onRestart(){ startGame(); }

    function showTimeUp(){
      if (feedback) { feedback.textContent = "⏰ Time’s up! Correct answer: " + currentQuestion.answers[0]; feedback.className = "incorrect"; }
      window.setTimeout(()=>{ loadQuestion(); resetTimer(); },10000);
    }

    function createConfetti(){
      for(let i=0;i<15;i++){
        const conf = document.createElement("div");
        conf.className="confetti";
        conf.style.left=Math.random()*100+"%";
        conf.style.background=`hsl(${Math.random()*360},80%,60%)`;
        document.body.appendChild(conf);
        window.setTimeout(()=>conf.remove(),3000);
      }
    }

    submitBtn?.addEventListener("click", onSubmit);
    restartBtn?.addEventListener("click", onRestart);

    startGame();

    return () => {
      submitBtn?.removeEventListener("click", onSubmit);
      restartBtn?.removeEventListener("click", onRestart);
      if (timerInterval) window.clearInterval(timerInterval);
    };
  }, []);

  return (
    <div>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;font-family:"Comic Sans MS",cursive}
        body.word-puzzle-scope{background:linear-gradient(45deg,#fceabb,#f8b500)}
        h1{font-size:2.5rem;margin-bottom:10px;color:#ff6f00;text-shadow:1px 1px #fff}
        #game-container{background:#fffbea;padding:20px 30px;border-radius:20px;box-shadow:0 4px 15px rgba(0,0,0,0.2);text-align:center;width:90%;max-width:500px;margin:0 auto}
        #question{font-size:1.2rem;margin:10px 0 20px;color:#444}
        #letters{margin-bottom:20px}
        .alphabet-block{display:inline-block;margin:5px;padding:10px 14px;font-size:1.4rem;border-radius:10px;background-color:#ffb6c1;color:#fff;cursor:pointer;transition:transform .3s ease, background-color .3s ease}
        .alphabet-block:hover{transform:scale(1.15);background-color:#ff8fab}
        #answer-box{min-height:40px;margin-bottom:10px;font-size:1.4rem;color:#222}
        button{background:#ffca28;border:none;padding:10px 20px;margin:5px;border-radius:10px;cursor:pointer;font-size:1rem;transition:background .3s ease}
        button:hover{background:#ffc107}
        #feedback{font-size:1.2rem;height:25px;margin-top:10px}
        #feedback.correct{color:#00c853}
        #feedback.incorrect{color:#e53935}
        #score-board{margin-top:15px;font-size:1.1rem;color:#555}
        #timer{font-size:1.3rem;margin-top:8px;color:#ff3d00;font-weight:bold}
        .confetti{position:absolute;width:8px;height:8px;opacity:.8;border-radius:50%;animation:softFall 3s ease-in-out forwards}
        @keyframes softFall{from{transform:translateY(-10px) rotate(0);opacity:1}to{transform:translateY(300px) rotate(180deg);opacity:0}}
      `}</style>
      <div className="word-puzzle-scope px-4 py-6">
        <h1>🧩 Word Puzzle Game</h1>
        <div id="game-container">
          <div id="question"></div>
          <div id="letters"></div>
          <div id="answer-box"></div>
          <button id="submit">Submit</button>
          <button id="restart">Restart</button>
          <div id="feedback"></div>
          <div id="score-board">Score: <span id="score">0</span></div>
          <div id="timer">Time Left: <span id="time">60</span>s</div>
        </div>
      </div>
    </div>
  );
}
