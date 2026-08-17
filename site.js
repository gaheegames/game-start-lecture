document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll("[data-sequence]").forEach((player) => {
  const frames = [...player.querySelectorAll(".seq-frame")];
  const dotsHost = player.querySelector(".seq-dots");
  const delay = Number(player.dataset.delay || 3200);
  let index = 0;
  let timer = null;

  const show = (next) => {
    index = (next + frames.length) % frames.length;
    frames.forEach((frame, i) => frame.classList.toggle("active", i === index));
    [...dotsHost.children].forEach((dot, i) => dot.classList.toggle("active", i === index));
  };

  frames.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `${i + 1}번째 장면 보기`);
    dot.addEventListener("click", () => show(i));
    dotsHost.appendChild(dot);
  });
  show(0);

  if (frames.length > 1) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !timer) timer = window.setInterval(() => show(index + 1), delay);
        if (!entry.isIntersecting && timer) {
          window.clearInterval(timer);
          timer = null;
        }
      });
    }, { threshold: 0.35 });
    observer.observe(player);
  }
});

document.querySelectorAll("[data-number-demo]").forEach((demo) => {
  const value = demo.querySelector(".number-value");
  const operation = demo.querySelector(".number-operation");
  const steps = [
    ["10", "게임을 시작합니다"],
    ["8", "주사위 2 → 2를 뺍니다"],
    ["3", "주사위 5 → 5를 뺍니다"],
    ["-2", "주사위 5 → 게임 끝"],
  ];
  let step = 1;
  let timer = null;
  const render = () => {
    value.textContent = steps[step][0];
    operation.textContent = steps[step][1];
    step = (step + 1) % steps.length;
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !timer) timer = window.setInterval(render, 1500);
      if (!entry.isIntersecting && timer) {
        window.clearInterval(timer);
        timer = null;
      }
    });
  }, { threshold: 0.4 });
  observer.observe(demo);
});
