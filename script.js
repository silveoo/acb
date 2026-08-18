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
  const delay = currentSlide >= 3 ? 900 : 2300;
  introTimer = window.setTimeout(showNextSlide, delay);
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
}, { threshold: 0.15 });
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
  const travelDistance = journey.clientHeight - 64;
  traveler.style.transform = `translateY(calc(-50% + ${progress * travelDistance}px))`;
}
window.addEventListener('scroll', updateProgress, { passive:true });
window.addEventListener('resize', updateProgress);
updateProgress();
