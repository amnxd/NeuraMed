import React, { useEffect, useRef } from "react";

export default function CandyMatch() {
  const newBtnRef = useRef<HTMLButtonElement | null>(null);
  const restartBtnRef = useRef<HTMLButtonElement | null>(null);
  const muteBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const GRID_SIZE = 6;
    const COLORS = ["red", "blue", "green", "yellow", "purple", "pink"] as const;
    const ICONS = ["🍭", "🍬", "🧁", "🍪", "🎂", "🍰"];

    let grid: (typeof COLORS[number] | null)[][] = [];
    let score = 0;
    let selected: { r: number; c: number } | null = null;
    let isAnimating = false;
    let isMuted = false;

    const gridEl = document.getElementById("grid") as HTMLDivElement | null;
    const scoreEl = document.getElementById("score") as HTMLSpanElement | null;
    const miniCelebration = document.getElementById("miniCelebration") as HTMLDivElement | null;
    const bg = document.getElementById("bgMusic") as HTMLAudioElement | null;
    const pop = document.getElementById("popSound") as HTMLAudioElement | null;

    function init() {
      if (!bg || !gridEl || !scoreEl) return;
      bg.volume = 0.3;
      bg.play().catch(() => {});
      makeGrid();
    }

    function makeGrid() {
      if (!gridEl) return;
      gridEl.innerHTML = "";
      grid = [];
      gridEl.style.gridTemplateColumns = `repeat(${GRID_SIZE},1fr)`;
      for (let r = 0; r < GRID_SIZE; r++) {
        grid[r] = [] as any;
        for (let c = 0; c < GRID_SIZE; c++) {
          let color: typeof COLORS[number];
          do {
            color = COLORS[Math.floor(Math.random() * COLORS.length)];
          } while (match(r, c, color));
          grid[r][c] = color;
          const el = document.createElement("div");
          el.className = `candy ${color}`;
          el.textContent = ICONS[COLORS.indexOf(color)];
          el.setAttribute("data-row", String(r));
          el.setAttribute("data-col", String(c));
          el.onclick = () => select(r, c);
          gridEl.appendChild(el);
        }
      }
    }

    function match(r: number, c: number, color: string) {
      let cnt = 1;
      if (c > 0 && grid[r][c - 1] === color) cnt++;
      if (c > 1 && grid[r][c - 2] === color) cnt++;
      if (cnt >= 3) return true;
      cnt = 1;
      if (r > 0 && grid[r - 1] && grid[r - 1][c] === color) cnt++;
      if (r > 1 && grid[r - 2] && grid[r - 2][c] === color) cnt++;
      return cnt >= 3;
    }

    function select(r: number, c: number) {
      if (isAnimating) return;
      const el = document.querySelector(`[data-row="${r}"][data-col="${c}"]`) as HTMLDivElement | null;
      if (!el) return;
      if (selected) {
        document.querySelector(".selected")?.classList.remove("selected");
        if (selected.r === r && selected.c === c) {
          selected = null;
          return;
        }
        if (adj(selected, { r, c })) {
          swap(selected, { r, c });
          selected = null;
        } else {
          selected = { r, c };
          el.classList.add("selected");
        }
      } else {
        selected = { r, c };
        el.classList.add("selected");
      }
    }

    function adj(a: { r: number; c: number }, b: { r: number; c: number }) {
      const dr = Math.abs(a.r - b.r), dc = Math.abs(a.c - b.c);
      return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
    }

    function swap(a: { r: number; c: number }, b: { r: number; c: number }) {
      isAnimating = true;
      [grid[a.r][a.c], grid[b.r][b.c]] = [grid[b.r][b.c], grid[a.r][a.c]];
      draw();
      setTimeout(() => {
        const m = find();
        if (!m.length) {
          [grid[a.r][a.c], grid[b.r][b.c]] = [grid[b.r][b.c], grid[a.r][a.c]];
          draw();
          isAnimating = false;
        } else handle();
      }, 300);
    }

    function find() {
      const m: { r: number; c: number }[] = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        let cnt = 1, col = grid[r][0];
        for (let c = 1; c < GRID_SIZE; c++) {
          if (grid[r][c] === col) cnt++;
          else {
            if (cnt >= 3) for (let i = c - cnt; i < c; i++) m.push({ r, c: i });
            cnt = 1; col = grid[r][c];
          }
        }
        if (cnt >= 3) for (let i = GRID_SIZE - cnt; i < GRID_SIZE; i++) m.push({ r, c: i });
      }
      for (let c = 0; c < GRID_SIZE; c++) {
        let cnt = 1, col = grid[0][c];
        for (let r = 1; r < GRID_SIZE; r++) {
          if (grid[r][c] === col) cnt++;
          else {
            if (cnt >= 3) for (let i = r - cnt; i < r; i++) m.push({ r: i, c });
            cnt = 1; col = grid[r][c];
          }
        }
        if (cnt >= 3) for (let i = GRID_SIZE - cnt; i < GRID_SIZE; i++) m.push({ r: i, c });
      }
      return m;
    }

    function handle() {
      const m = find();
      if (!m.length) { isAnimating = false; return; }
      miniCelebrate();
      m.forEach(x => {
        const el = document.querySelector(`[data-row="${x.r}"][data-col="${x.c}"]`) as HTMLDivElement | null;
        if (el) el.classList.add("popping");
        grid[x.r][x.c] = null;
        if (!isMuted && pop) { pop.currentTime = 0; pop.play().catch(() => {}); }
      });
      score += m.length * 10;
      if (scoreEl) scoreEl.textContent = String(score);
      setTimeout(() => drop(), 400);
    }

    function drop() {
      let moved = false;
      for (let c = 0; c < GRID_SIZE; c++) {
        let w = GRID_SIZE - 1;
        for (let r = GRID_SIZE - 1; r >= 0; r--) {
          if (grid[r][c]) { if (r !== w) { grid[w][c] = grid[r][c]; grid[r][c] = null; moved = true; } w--; }
        }
        for (let r = w; r >= 0; r--) { grid[r][c] = COLORS[Math.floor(Math.random() * COLORS.length)]; moved = true; }
      }
      draw();
      if (moved) setTimeout(() => handle(), 500); else isAnimating = false;
    }

    function draw() {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const el = document.querySelector(`[data-row="${r}"][data-col="${c}"]`) as HTMLDivElement | null;
          const color = grid[r][c];
          if (el && color) {
            el.className = `candy ${color}`;
            el.textContent = ICONS[COLORS.indexOf(color)];
          }
        }
      }
    }

    function miniCelebrate() {
      if (!miniCelebration) return;
      for (let i = 0; i < 6; i++) {
        const candy = document.createElement("div");
        candy.className = "falling-candy";
        candy.textContent = ICONS[Math.floor(Math.random() * ICONS.length)];
        candy.style.left = Math.random() * 100 + "%";
        candy.style.animationDelay = Math.random() * 0.5 + "s";
        miniCelebration.appendChild(candy);
        setTimeout(() => candy.remove(), 2500);
      }
    }

    function newGame() {
      score = 0;
      if (scoreEl) scoreEl.textContent = "0";
      selected = null; isAnimating = false; makeGrid();
    }

    function restartGame() { newGame(); }

    function toggleMute() {
      isMuted = !isMuted;
      const btn = muteBtnRef.current;
      if (!bg || !btn) return;
      if (isMuted) { bg.pause(); btn.textContent = "🔇"; }
      else { bg.play().catch(() => {}); btn.textContent = "🔊"; }
    }

    // Attach event listeners
    const newBtn = newBtnRef.current;
    const restartBtn = restartBtnRef.current;
    const muteBtn = muteBtnRef.current;
    newBtn?.addEventListener("click", newGame);
    restartBtn?.addEventListener("click", restartGame);
    muteBtn?.addEventListener("click", toggleMute);

    const clickOnce = () => { if (!isMuted && bg && bg.paused) bg.play().catch(() => {}); window.removeEventListener("click", clickOnce); };
    window.addEventListener("click", clickOnce);

    init();

    return () => {
      newBtn?.removeEventListener("click", newGame);
      restartBtn?.removeEventListener("click", restartGame);
      muteBtn?.removeEventListener("click", toggleMute);
      window.removeEventListener("click", clickOnce);
      if (bg) { try { bg.pause(); } catch {} }
    };
  }, []);

  return (
    <div>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        .header{display:flex;justify-content:space-between;align-items:center;width:100%;max-width:400px;margin-bottom:15px;flex-wrap:wrap;gap:10px}
        .score-section{text-align:center;color:#fff;text-shadow:2px 2px 4px rgba(0,0,0,.4)}
        .score{font-size:30px;font-weight:bold}
        .controls{display:flex;gap:8px;align-items:center}
        button{padding:8px 15px;border:none;border-radius:20px;background:linear-gradient(45deg,#ff6b6b,#ee5a24);color:#fff;font-weight:bold;cursor:pointer;transition:transform .2s;box-shadow:0 3px 10px rgba(0,0,0,.2);font-size:18px}
        button:hover{transform:translateY(-2px)}
        .mute-btn{background:linear-gradient(45deg,#74b9ff,#0984e3);padding:8px;border-radius:50%;width:35px;height:35px}
        .game-container{background:rgba(255,255,255,.95);border-radius:15px;padding:15px;box-shadow:0 8px 25px rgba(0,0,0,.15);transform:scale(1.5);transform-origin:top center;margin-top:20px}
        .grid{display:grid;grid-template-columns:repeat(6,1fr);gap:3px;background:#333;border-radius:8px;padding:5px}
        .candy{width:45px;height:45px;border-radius:8px;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);display:flex;align-items:center;justify-content:center;font-size:24px;user-select:none;position:relative}
        .candy:hover{transform:scale(1.1);box-shadow:0 0 15px rgba(255,255,255,.9)}
        .candy.selected{transform:scale(1.15);box-shadow:0 0 20px #fff;border:2px solid #fff}
        .candy.red{background:linear-gradient(45deg,#ff6b6b,#ee5a24)}
        .candy.blue{background:linear-gradient(45deg,#74b9ff,#0984e3)}
        .candy.green{background:linear-gradient(45deg,#00b894,#00a085)}
        .candy.yellow{background:linear-gradient(45deg,#fdcb6e,#e17055)}
        .candy.purple{background:linear-gradient(45deg,#a29bfe,#6c5ce7)}
        .candy.pink{background:linear-gradient(45deg,#fd79a8,#e84393)}
        .candy.popping{animation:pop .4s ease-out forwards}
        @keyframes pop{0%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:.7}100%{transform:scale(0);opacity:0}}
        .candy.falling{animation:fall .5s ease-in forwards}
        @keyframes fall{0%{transform:translateY(-100px);opacity:0}100%{transform:translateY(0);opacity:1}}
        .mini-celebration{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1000;overflow:hidden}
        .falling-candy{position:absolute;font-size:30px;animation:candyFall 2.5s linear forwards}
        @keyframes candyFall{0%{transform:translateY(-10vh) rotate(0deg);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
        .wrapper{font-family:"Comic Sans MS",cursive;background:linear-gradient(45deg,#ff9a9e,#fecfef,#fad0c4,#ffd1ff);min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:10px;overflow-x:hidden}
      `}</style>
      <div className="wrapper">
        <div className="header">
          <div className="score-section">
            <div className="score">Score: <span id="score">0</span></div>
          </div>
          <div className="controls">
            <button ref={newBtnRef}>🆕 New Game</button>
            <button ref={restartBtnRef}>🔁 Restart</button>
            <button className="mute-btn" ref={muteBtnRef} id="muteBtn">🔊</button>
          </div>
        </div>
        <div className="game-container"><div className="grid" id="grid"></div></div>
        <div className="mini-celebration" id="miniCelebration"></div>
        <audio id="bgMusic" loop><source src="https://actions.google.com/sounds/v1/ambiences/game_background.ogg" type="audio/ogg" /></audio>
        <audio id="popSound"><source src="https://actions.google.com/sounds/v1/cartoon/pop.ogg" type="audio/ogg" /></audio>
      </div>
    </div>
  );
}
