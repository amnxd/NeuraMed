import React, { useEffect } from "react";

export default function HealAvatar() {
  useEffect(() => {
    let score = 0;
    let selectedAvatar = "";
    let currentQuestion: { hint: string; options: string[]; correct: number } = { hint: "", options: [], correct: 0 };
    let usedQuestions: number[] = [];

    const questions = [
      { hint: "I'm too tired of working the whole day.", options: ["Go to sleep", "Have a meal", "Talk to a friend"], correct: 0 },
      { hint: "I feel so lonely and isolated.", options: ["Exercise alone", "Call a friend", "Stay in bed"], correct: 1 },
      { hint: "I haven't eaten anything today.", options: ["Skip another meal", "Order some food", "Just drink water"], correct: 1 },
      { hint: "I feel overwhelmed with everything.", options: ["Take deep breaths", "Panic more", "Ignore it"], correct: 0 },
      { hint: "I can't stop thinking negative thoughts.", options: ["Think more", "Go for a walk", "Stay inside"], correct: 1 },
      { hint: "I feel like I have no energy.", options: ["Stay in bed", "Get some sunlight", "Drink coffee only"], correct: 1 },
      { hint: "I'm stressed about my future.", options: ["Worry more", "Make a plan", "Give up"], correct: 1 },
      { hint: "I feel disconnected from others.", options: ["Isolate more", "Reach out to someone", "Stay alone"], correct: 1 },
      { hint: "I can't focus on anything.", options: ["Try meditation", "Watch TV all day", "Stress about it"], correct: 0 },
      { hint: "I feel worthless and useless.", options: ["Believe it", "List your achievements", "Compare to others"], correct: 1 },
      { hint: "I'm having trouble sleeping at night.", options: ["Drink more coffee", "Create a bedtime routine", "Use phone in bed"], correct: 1 },
      { hint: "I don't feel motivated to do anything.", options: ["Force yourself", "Start with small tasks", "Give up completely"], correct: 1 },
      { hint: "I'm constantly comparing myself to others.", options: ["Compare more", "Focus on your journey", "Feel worse about it"], correct: 1 },
      { hint: "I feel like I have crying all the time.", options: ["Hold it in", "Let it out safely", "Feel ashamed"], correct: 1 },
      { hint: "I'm avoiding all my responsibilities.", options: ["Avoid more", "Take one small step", "Panic about it"], correct: 1 },
      { hint: "I feel like nobody understands me.", options: ["Stay silent", "Express your feelings", "Assume the worst"], correct: 1 },
      { hint: "I'm scared of failing at everything.", options: ["Don't try anything", "Accept failure as learning", "Worry constantly"], correct: 1 },
      { hint: "I feel physically drained and weak.", options: ["Ignore your body", "Get some exercise", "Stay sedentary"], correct: 1 },
      { hint: "I can't enjoy things I used to love.", options: ["Force enjoyment", "Try new small activities", "Give up hobbies"], correct: 1 },
      { hint: "I feel guilty about everything I do.", options: ["Feel more guilty", "Practice self-compassion", "Blame yourself more"], correct: 1 },
    ];

    function selectGender(avatar: string) {
      selectedAvatar = avatar;
      document.getElementById("genderSelection")?.classList.add("hidden");
      document.getElementById("gameScreen")?.classList.remove("hidden");
      updateAvatar();
      generateQuestion();
    }

    function updateAvatar() {
      const avatarElement = document.getElementById("avatar");
      if (!avatarElement) return;
      avatarElement.classList.add("avatar-happy");
      setTimeout(() => avatarElement.classList.remove("avatar-happy"), 600);

      if (score < 30) avatarElement.textContent = "😔";
      else if (score < 60) avatarElement.textContent = "😐";
      else if (score < 90) avatarElement.textContent = "🙂";
      else avatarElement.textContent = "😊";
    }

    function generateQuestion() {
      if (usedQuestions.length === questions.length) usedQuestions = [];
      const available = questions.filter((_, idx) => !usedQuestions.includes(idx));
      const randomIndex = Math.floor(Math.random() * available.length);
      currentQuestion = available[randomIndex];
      const originalIndex = questions.indexOf(currentQuestion);
      usedQuestions.push(originalIndex);

      const hintEl = document.getElementById("hint");
      if (hintEl) hintEl.textContent = currentQuestion.hint;

      const optionsContainer = document.getElementById("options");
      if (!optionsContainer) return;
      optionsContainer.innerHTML = "";
      currentQuestion.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.className = "option-btn";
        button.textContent = option;
        button.onclick = () => selectOption(index);
        optionsContainer.appendChild(button);
      });

      const msg = document.getElementById("message");
      if (msg) msg.textContent = "";
    }

    function selectOption(selectedIndex: number) {
      const messageElement = document.getElementById("message");
      if (!messageElement) return;

      if (selectedIndex === currentQuestion.correct) {
        score += 10;
        updateScore();
        updateAvatar();
        messageElement.textContent = "Great choice! +10 points";
        messageElement.className = "message success";
        playSuccessSound();

        if (score >= 100) setTimeout(showVictory, 1000);
        else setTimeout(generateQuestion, 1500);
      } else {
        messageElement.textContent = "Try again...";
        messageElement.className = "message error";
        playErrorSound();
      }
    }

    function updateScore() {
      const s = document.getElementById("scoreValue");
      const bar = document.getElementById("progressBar");
      if (s) s.textContent = String(score);
      if (bar) (bar as HTMLDivElement).style.width = score + "%";
    }

    function showVictory() {
      document.getElementById("gameScreen")?.classList.add("hidden");
      document.getElementById("victoryScreen")?.classList.remove("hidden");
      document.body.classList.add("celebration");
      createBalloons();
      createFireworks();
      playCelebrationSound();
    }

    function createBalloons() {
      const balloonsContainer = document.getElementById("balloons");
      if (!balloonsContainer) return;
      const balloonEmojis = ["🎈", "🎀", "🎉", "✨", "🌟", "🎊", "💖", "🌈", "⭐", "💫"];
      for (let i = 0; i < 30; i++) {
        setTimeout(() => {
          const balloon = document.createElement("div");
          balloon.className = "balloon";
          balloon.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
          balloon.style.left = Math.random() * 100 + "%";
          balloon.style.animationDelay = Math.random() * 2 + "s";
          balloon.style.animationDuration = 2 + Math.random() * 2 + "s";
          balloonsContainer.appendChild(balloon);
          setTimeout(() => balloon.remove(), 4000);
        }, i * 150);
      }
    }

    function createFireworks() {
      const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff"];
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          const firework = document.createElement("div");
          firework.className = "firework";
          firework.style.background = colors[Math.floor(Math.random() * colors.length)];
          firework.style.left = Math.random() * 100 + "%";
          firework.style.top = Math.random() * 100 + "%";
          firework.style.animation = "firework 1s ease-out";
          document.body.appendChild(firework);
          setTimeout(() => firework.remove(), 1000);
        }, i * 300);
      }
    }

    function restartGame() {
      score = 0;
      usedQuestions = [];
      selectedAvatar = "";
      document.body.classList.remove("celebration");
      document.getElementById("victoryScreen")?.classList.add("hidden");
      document.getElementById("genderSelection")?.classList.remove("hidden");
      const balloons = document.getElementById("balloons");
      if (balloons) balloons.innerHTML = "";
    }

    function playSuccessSound() {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode); gainNode.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime); oscillator.stop(audioContext.currentTime + 0.4);
      } catch {}
    }

    function playErrorSound() {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode); gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 150; oscillator.type = "sawtooth";
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime); oscillator.stop(audioContext.currentTime + 0.3);
      } catch {}
    }

    function playCelebrationSound() {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const notes = [523, 659, 784, 1047, 1319];
        notes.forEach((freq, index) => {
          setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode); gainNode.connect(audioContext.destination);
            oscillator.frequency.value = freq; oscillator.type = "sine";
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime); oscillator.stop(audioContext.currentTime + 0.3);
          }, index * 150);
        });
      } catch {}
    }

    // Expose selectGender/restartGame to buttons via window for simplicity
    (window as any).selectGender = selectGender;
    (window as any).restartGame = restartGame;

    return () => {
      delete (window as any).selectGender;
      delete (window as any).restartGame;
    };
  }, []);

  return (
    <div>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        .container{text-align:center;max-width:500px;padding:30px;background:rgba(255,255,255,.9);border-radius:20px;box-shadow:0 10px 30px rgba(0,0,0,.1);backdrop-filter:blur(10px);margin:0 auto}
        .avatar{font-size:80px;margin:20px 0;transition:all .5s ease;animation:breathe 2s ease-in-out infinite}
        @keyframes breathe{0%,100%{transform:scale(1) rotate(0)}25%{transform:scale(1.08) rotate(-2deg)}75%{transform:scale(1.08) rotate(2deg)}}
        .avatar-happy{animation:bounce .6s ease-in-out}
        @keyframes bounce{0%,100%{transform:scale(1) translateY(0)}50%{transform:scale(1.2) translateY(-10px)}}
        .progress-container{width:100%;height:20px;background:#e0e0e0;border-radius:10px;margin:20px 0;overflow:hidden}
        .progress-bar{height:100%;background:linear-gradient(90deg,#ff9a9e,#fecfef,#fecfef);width:0%;transition:width .5s ease;border-radius:10px}
        .score{font-size:24px;color:#6a1b9a;margin:10px 0;font-weight:bold}
        .hint{font-size:18px;color:#424242;margin:20px 0;padding:15px;background:#f5f5f5;border-radius:10px;border-left:4px solid #9c27b0}
        .options{display:flex;flex-direction:column;gap:10px;margin:20px 0}
        .option-btn{padding:15px 20px;border:none;border-radius:25px;background:linear-gradient(135deg,#81c784,#aed581);color:#fff;font-size:16px;cursor:pointer;transition:all .3s ease;box-shadow:0 4px 15px rgba(0,0,0,.1)}
        .option-btn:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 8px 25px rgba(0,0,0,.2);background:linear-gradient(135deg,#66bb6a,#9ccc65)}
        .option-btn:active{transform:translateY(0) scale(.98)}
        .gender-btn{padding:20px 30px;margin:10px;border:none;border-radius:20px;background:linear-gradient(135deg,#64b5f6,#81c784);color:#fff;font-size:18px;cursor:pointer;transition:all .3s ease}
        .gender-btn:hover{transform:scale(1.05)}
        .message{font-size:18px;margin:15px 0;padding:10px;border-radius:10px;transition:all .3s ease}
        .success{background:#c8e6c9;color:#2e7d32}
        .error{background:#ffcdd2;color:#c62828}
        .celebration{background:linear-gradient(45deg,#ff9a9e,#fecfef,#fecfef,#a8edea,#fed6e3);background-size:400% 400%;animation:gradientShift 3s ease infinite}
        @keyframes gradientShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        .balloons{position:fixed;top:-50px;width:100%;height:100vh;pointer-events:none;z-index:1000}
        .balloon{position:absolute;font-size:30px;animation:fall 3s linear infinite}
        @keyframes fall{0%{transform:translateY(-50px) rotate(0) scale(.5);opacity:0}10%{opacity:1;transform:translateY(0) rotate(36deg) scale(1)}100%{transform:translateY(100vh) rotate(720deg) scale(.8);opacity:.7}}
        .hidden{display:none}
        h1{color:#6a1b9a;margin-bottom:20px;font-size:28px}
        .final-message{font-size:24px;color:#6a1b9a;font-weight:bold;margin:20px 0;animation:rainbow-text 2s ease-in-out infinite,bounce-text 1s ease-in-out infinite}
        @keyframes rainbow-text{0%{color:#ff6b6b}16%{color:#feca57}33%{color:#48dbfb}50%{color:#ff9ff3}66%{color:#54a0ff}83%{color:#5f27cd}100%{color:#ff6b6b}}
        @keyframes bounce-text{0%,100%{transform:scale(1) translateY(0)}50%{transform:scale(1.05) translateY(-5px)}}
        .restart-btn{padding:15px 30px;margin:20px 10px;border:none;border-radius:25px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:16px;cursor:pointer;transition:all .3s ease;box-shadow:0 4px 15px rgba(0,0,0,.2)}
        .restart-btn:hover{transform:translateY(-2px) scale(1.05);box-shadow:0 6px 20px rgba(0,0,0,.3)}
        .firework{position:fixed;width:4px;height:4px;border-radius:50%;pointer-events:none;z-index:1001}
        @keyframes firework{0%{transform:scale(0) rotate(0);opacity:1}100%{transform:scale(20) rotate(360deg);opacity:0}}
      `}</style>
      <div className="container">
        <div id="genderSelection">
          <h1>Heal the Depressed Avatar</h1>
          <p style={{ marginBottom: 30, color: "#666" }}>Choose your avatar:</p>
          <button className="gender-btn" onClick={() => (window as any).selectGender("👦")}>Male 👦</button>
          <button className="gender-btn" onClick={() => (window as any).selectGender("👧")}>Female 👧</button>
        </div>

        <div id="gameScreen" className="hidden">
          <div className="score">Score: <span id="scoreValue">0</span>/100</div>
          <div className="progress-container"><div className="progress-bar" id="progressBar"></div></div>
          <div className="avatar" id="avatar">😔</div>
          <div className="hint" id="hint"></div>
          <div className="options" id="options"></div>
          <div className="message" id="message"></div>
        </div>

        <div id="victoryScreen" className="hidden">
          <div className="avatar">😊</div>
          <div className="final-message">THANK YOU — YOU MADE ME HAPPY!</div>
          <button className="restart-btn" onClick={() => (window as any).restartGame()}>🎮 Play Again</button>
        </div>
      </div>

      <div className="balloons" id="balloons"></div>
    </div>
  );
}
