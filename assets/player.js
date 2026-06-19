(function () {
    var box = document.querySelector('[data-video-box]');
    var video = box ? box.querySelector('video') : null;
    var button = box ? box.querySelector('[data-play-button]') : null;

    if (!box || !video || !button) {
        return;
    }

    var media = video.querySelector('source');
    var url = media ? media.getAttribute('src') : '';
    var ready = false;

    function attach() {
        if (ready || !url) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            ready = true;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            ready = true;
        }
    }

    function start() {
        attach();
        box.classList.add('playing');
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                box.classList.remove('playing');
            });
        }
    }

    button.addEventListener('click', start);
    video.addEventListener('click', function () {
        if (video.paused) {
            start();
        }
    });
    video.addEventListener('playing', function () {
        box.classList.add('playing');
    });
    video.addEventListener('pause', function () {
        if (!video.ended) {
            box.classList.remove('playing');
        }
    });
})();
