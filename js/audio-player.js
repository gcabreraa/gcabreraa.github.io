// js/audio-player.js
(() => {
  const audio = document.getElementById('bg-audio');
  const cdWindow = document.querySelector('.bg-window--cd');
  const button = document.querySelector('.cd-player__button');

  if (!audio || !button || !cdWindow) return;

  const setState = (isPlaying) => {
    cdWindow.classList.toggle('is-playing', isPlaying);
    button.setAttribute('aria-pressed', String(isPlaying));
    button.setAttribute('aria-label', isPlaying ? 'Pause audio' : 'Play audio');
  };

  button.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => setState(true)).catch(() => {});
    } else {
      audio.pause();
      setState(false);
    }
  });

  audio.addEventListener('ended', () => setState(false));
})();
