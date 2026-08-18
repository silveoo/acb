const intro = document.querySelector('#intro');
const slides = [...document.querySelectorAll('.intro__slide')];
const skipButton = document.querySelector('#skipIntro');
let introTimer;
let currentSlide = 0;

function finishIntro() {
  clearTimeout(introTimer);
  intro.classList.add('is-finished');
  document.body.classList.remove('intro-active');
  window.setTimeout(() => intro.setAttribute('aria-hidden', 'true'), 1000);
  revealVisibleElements();
}

function showNextSlide() {
  slides[currentSlide].classList.remove('is-visible');
  currentSlide += 1;
  if (currentSlide >= slides.length) {
    finishIntro();
    return;
  }
  slides[currentSlide].classList.add('is-visible');
  introTimer = window.setTimeout(showNextSlide, currentSlide >= 3 ? 900 : 2300);
}

introTimer = window.setTimeout(showNextSlide, 2600);
skipButton.addEventListener('click', finishIntro);

const reveals = [...document.querySelectorAll('.reveal')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || document.body.classList.contains('intro-active')) return;
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
    const delay = Math.max(0, siblings.indexOf(entry.target)) * 130;
    window.setTimeout(() => entry.target.classList.add('is-revealed'), delay);
    observer.unobserve(entry.target);
  });
}, { threshold:0.15 });
reveals.forEach((element) => observer.observe(element));

function revealVisibleElements() {
  reveals.forEach((element, index) => {
    if (element.getBoundingClientRect().top < window.innerHeight * 0.95) {
      window.setTimeout(() => element.classList.add('is-revealed'), index * 130);
    }
  });
}

const fill = document.querySelector('#progressFill');
const traveler = document.querySelector('#traveler');
const journey = document.querySelector('#journey');
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  fill.style.height = `${progress * 100}%`;
  traveler.style.transform = `translateY(calc(-50% + ${progress * (journey.clientHeight - 64)}px))`;
}
window.addEventListener('scroll', updateProgress, { passive:true });
window.addEventListener('resize', updateProgress);
updateProgress();

const rejectButton = document.querySelector('#rejectButton');
const virusScreen = document.querySelector('#virusScreen');
const virusBar = virusScreen.querySelector('[role="progressbar"]');
const virusFill = document.querySelector('#virusFill');
const virusPercent = document.querySelector('#virusPercent');
const virusCode = document.querySelector('#virusCode');
const virusResult = document.querySelector('#virusResult');
const returnButton = document.querySelector('#returnButton');
let virusFrame;

function randomCode() {
  const alphabet = '01ABCDEF';
  return Array.from({ length:600 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

function startFakeVirus() {
  document.body.classList.add('virus-active');
  virusScreen.classList.add('is-active');
  virusScreen.classList.remove('is-complete');
  virusScreen.setAttribute('aria-hidden', 'false');
  virusCode.textContent = randomCode();
  virusResult.textContent = 'Не стоило нажимать эту кнопку...';
  const startedAt = performance.now();

  function tick(now) {
    const percentage = Math.min(100, Math.floor(((now - startedAt) / 5000) * 100));
    virusFill.style.width = `${percentage}%`;
    virusPercent.value = `${percentage}%`;
    virusBar.setAttribute('aria-valuenow', String(percentage));
    if (percentage < 100) {
      if (percentage % 8 === 0) virusCode.textContent = randomCode();
      virusFrame = requestAnimationFrame(tick);
    } else {
      virusResult.textContent = 'Загрузка завершена. Шутка. Никакого вируса нет :)';
      virusScreen.classList.add('is-complete');
      returnButton.focus();
    }
  }
  virusFrame = requestAnimationFrame(tick);
}

function closeFakeVirus() {
  cancelAnimationFrame(virusFrame);
  virusScreen.classList.remove('is-active', 'is-complete');
  virusScreen.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('virus-active');
  rejectButton.focus();
}

rejectButton.addEventListener('click', startFakeVirus);
returnButton.addEventListener('click', closeFakeVirus);
