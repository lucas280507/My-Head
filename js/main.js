/**
 * Lucas Dev - My-Head GSAP Interactive Engine
 * Controle de animação contínua e interativa com GSAP 3
 */

document.addEventListener('DOMContentLoaded', () => {
    const headImg = document.getElementById('img');
    const btnPlayPause = document.getElementById('btnPlayPause');
    const playIcon = document.getElementById('playIcon');
    const playText = document.getElementById('playText');
    const btnReverse = document.getElementById('btnReverse');
    const reverseText = document.getElementById('reverseText');
    const speedButtons = document.querySelectorAll('.btn-speed');
    const speedSlider = document.getElementById('speedSlider');
    const filterButtons = document.querySelectorAll('.btn-filter');
    const btnReset = document.getElementById('btnReset');

    // Status elements
    const statusState = document.getElementById('statusState');
    const statusSpeed = document.getElementById('statusSpeed');
    const statusDirection = document.getElementById('statusDirection');
    const statusFilter = document.getElementById('statusFilter');

    // State
    let isPlaying = true;
    let isClockwise = true;
    let currentSpeed = 1.0;
    let currentFilterName = 'Normal';

    // GSAP 3 Infinite Rotation Tween
    const rotationTween = gsap.to(headImg, {
        rotation: 360,
        duration: 10,
        ease: "none",
        repeat: -1
    });

    // Helper: Update UI Status
    function updateUIStatus() {
        if (statusState) {
            statusState.textContent = isPlaying ? "Girando" : "Pausado";
            statusState.className = isPlaying ? "badge bg-success-subtle text-success border border-success" : "badge bg-warning-subtle text-warning border border-warning";
        }
        if (statusSpeed) {
            statusSpeed.textContent = `${currentSpeed.toFixed(1)}x`;
        }
        if (statusDirection) {
            statusDirection.textContent = isClockwise ? "Horário" : "Anti-horário";
        }
        if (statusFilter) {
            statusFilter.textContent = currentFilterName;
        }
    }

    // Play / Pause Toggle
    function togglePlayPause() {
        if (isPlaying) {
            rotationTween.pause();
            isPlaying = false;
            if (playIcon) playIcon.className = "bi bi-play-fill me-1";
            if (playText) playText.textContent = "Retomar";
        } else {
            rotationTween.play();
            isPlaying = true;
            if (playIcon) playIcon.className = "bi bi-pause-fill me-1";
            if (playText) playText.textContent = "Pausar";
        }
        updateUIStatus();
    }

    if (btnPlayPause) {
        btnPlayPause.addEventListener('click', togglePlayPause);
    }

    // Direction Toggle
    function toggleDirection() {
        isClockwise = !isClockwise;
        const targetTimeScale = isClockwise ? Math.abs(currentSpeed) : -Math.abs(currentSpeed);
        gsap.to(rotationTween, { timeScale: targetTimeScale, duration: 0.3 });
        if (reverseText) {
            reverseText.textContent = isClockwise ? "Inverter (Anti-horário)" : "Inverter (Horário)";
        }
        updateUIStatus();
    }

    if (btnReverse) {
        btnReverse.addEventListener('click', toggleDirection);
    }

    // Speed Control
    function setSpeed(newSpeed) {
        currentSpeed = parseFloat(newSpeed);
        const signedSpeed = isClockwise ? currentSpeed : -currentSpeed;
        gsap.to(rotationTween, { timeScale: signedSpeed, duration: 0.2 });
        if (speedSlider) speedSlider.value = currentSpeed;
        
        speedButtons.forEach(btn => {
            if (parseFloat(btn.getAttribute('data-speed')) === currentSpeed) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        updateUIStatus();
    }

    speedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const speedVal = parseFloat(btn.getAttribute('data-speed'));
            setSpeed(speedVal);
        });
    });

    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
            setSpeed(e.target.value);
        });
    }

    // Filter Controls
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterClass = btn.getAttribute('data-filter');
            currentFilterName = btn.getAttribute('data-filter-name') || 'Personalizado';
            
            headImg.classList.remove('filter-neon', 'filter-sepia', 'filter-grayscale', 'filter-invert');
            if (filterClass && filterClass !== 'none') {
                headImg.classList.add(filterClass);
            }
            
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Quick GSAP pulse feedback
            gsap.fromTo(headImg, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
            updateUIStatus();
        });
    });

    // Reset Engine
    function resetAll() {
        currentSpeed = 1.0;
        isClockwise = true;
        currentFilterName = 'Normal';
        
        if (!isPlaying) {
            togglePlayPause();
        }
        
        headImg.classList.remove('filter-neon', 'filter-sepia', 'filter-grayscale', 'filter-invert');
        filterButtons.forEach(b => {
            if (b.getAttribute('data-filter') === 'none') b.classList.add('active');
            else b.classList.remove('active');
        });

        gsap.to(rotationTween, { timeScale: 1.0, duration: 0.4 });
        if (reverseText) reverseText.textContent = "Inverter (Anti-horário)";
        if (speedSlider) speedSlider.value = 1.0;
        
        speedButtons.forEach(btn => {
            if (parseFloat(btn.getAttribute('data-speed')) === 1.0) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        gsap.to(headImg, { scale: 1, duration: 0.4, ease: "power2.out" });
        updateUIStatus();
    }

    if (btnReset) {
        btnReset.addEventListener('click', resetAll);
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        } else if (e.key === 'r' || e.key === 'R') {
            toggleDirection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSpeed(Math.min(currentSpeed + 0.5, 5.0));
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSpeed(Math.max(currentSpeed - 0.5, 0.2));
        }
    });

    // Init
    updateUIStatus();
});
