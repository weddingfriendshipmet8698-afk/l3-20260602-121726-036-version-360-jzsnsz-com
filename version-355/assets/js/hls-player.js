(function () {
  function setupPlayer(video) {
    var source = video.getAttribute('data-src');
    if (!source) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      video._hlsInstance = hls;
      return;
    }

    video.src = source;
  }

  function playVideo(video, button) {
    if (!video.getAttribute('src') && !video._hlsInstance) {
      setupPlayer(video);
    }

    var playPromise = video.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      }).catch(function () {
        if (button) {
          button.classList.remove('is-hidden');
        }
      });
    } else if (button) {
      button.classList.add('is-hidden');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var video = document.querySelector('.js-hls-player');
    var button = document.querySelector('[data-play-button]');
    if (!video) {
      return;
    }

    setupPlayer(video);

    if (button) {
      button.addEventListener('click', function () {
        playVideo(video, button);
      });
    }

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (button && video.currentTime === 0) {
        button.classList.remove('is-hidden');
      }
    });
  });
})();
