document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const finalCode = "123456";
    const cursor = document.getElementById('custom-cursor');
    const overlay = document.getElementById('flashlight-overlay');
    const hSwitch = document.getElementById('hidden-switch');
    const bgTexture = document.getElementById('bg-texture');
    const app = document.getElementById('app');
    const neonContainer = document.getElementById('neon-container');

    let isLightOn = false;
    let currentStep = 0;

    // --- CRÉATION DES NÉONS ---
    const HEART_SVG = `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    const BUTTERFLY_SVG = `<svg viewBox="0 0 24 24"><path d="M12,10C12,10 10.5,5 8,5C5.5,5 4,7 4,9C4,11 6,13 8,13C6,13 3,15 3,18C3,21 6,22 8,20C10,22 12,20 12,20C12,20 14,22 16,20C18,22 21,21 21,18C21,15 18,13 16,13C18,13 20,11 20,9C20,7 18.5,5 16,5C13.5,5 12,10 12,10Z"/></svg>`;

    function createNeon() {
        for (let i = 0; i < 15; i++) {
            const neon = document.createElement('div');
            neon.className = 'neon-shape';
            neon.innerHTML = Math.random() > 0.5 ? HEART_SVG : BUTTERFLY_SVG;
            
            const x = Math.random() * 90 + 5;
            const y = Math.random() * 90 + 5;
            const size = Math.random() * 30 + 20;
            const rot = Math.random() * 360;
            
            neon.style.left = `${x}%`;
            neon.style.top = `${y}%`;
            neon.style.transform = `rotate(${rot}deg)`;
            const svg = neon.querySelector('svg');
            svg.style.width = `${size}px`;
            svg.style.height = `${size}px`;
            
            neon.style.animationDuration = `${Math.random() * 2 + 2}s`;
            neon.style.animationDelay = `${Math.random() * 5}s`;
            
            neonContainer.appendChild(neon);
        }
    }
    createNeon();

    // --- CURSEUR ET LAMPE TORCHE ---
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);

        if (!isLightOn) {
            const rect = hSwitch.getBoundingClientRect();
            const switchCenterX = rect.left + rect.width / 2;
            const switchCenterY = rect.top + rect.height / 2;
            const dist = Math.hypot(e.clientX - switchCenterX, e.clientY - switchCenterY);
            
            if (dist < 150) {
                hSwitch.classList.add('visible-under-torch');
            } else {
                hSwitch.classList.remove('visible-under-torch');
            }
        }

        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        document.body.appendChild(dot);
        dot.animate([{ opacity: 0.6, scale: 1 }, { opacity: 0, scale: 0 }], { duration: 800 }).onfinish = () => dot.remove();
    });

    // --- LOGIQUE UNIQUE DE L'INTERRUPTEUR ---
    function placeInitialSwitch() {
        const x = Math.random() * (window.innerWidth - 120) + 60;
        const y = Math.random() * (window.innerHeight - 120) + 60;
        hSwitch.style.left = `${x}px`;
        hSwitch.style.top = `${y}px`;
        hSwitch.style.display = 'block';
        bgTexture.style.opacity = '1';
    }

    hSwitch.addEventListener('click', () => {
        isLightOn = true;
        hSwitch.style.display = 'none';
        overlay.style.opacity = '0';
        bgTexture.style.opacity = '0.3';
        bgTexture.style.maskImage = 'none';
        bgTexture.style.webkitMaskImage = 'none';
        
        document.querySelectorAll('.neon-shape').forEach(n => n.style.opacity = '0.8');
        
        setTimeout(() => overlay.style.display = 'none', 1000);
        
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.inset = '0';
        flash.style.zIndex = '6000';
        flash.className = 'light-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 800);
        
        document.getElementById('step-0').style.visibility = 'visible';
    });

    // --- GESTION DES ÉTAPES ---
    window.goToStep = function(num) {
        currentStep = num;
        const steps = document.querySelectorAll('.step');
        app.style.opacity = '0';
        setTimeout(() => {
            steps.forEach(s => {
                s.classList.remove('active');
                s.style.visibility = 'hidden';
            });
            const target = document.getElementById(`step-${num}`);
            target.classList.add('active');
            target.style.visibility = 'visible';
            app.style.opacity = '1';
        }, 400);
    };

    startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToStep(1);
    });

    overlay.style.display = 'block';
    placeInitialSwitch();

    // --- LOGIQUE DU QUESTIONNAIRE ---
    window.validateQuestion = function(num) {
        if (num === 1) {
            const input = document.querySelector(`#q1 input`);
            if (input.value.toLowerCase().trim() === "saint-laurent-du-var") {
                showNext(1, 2);
            } else { errorFeedback(input); }
        } 
        else if (num === 4) {
            const checkboxes = document.querySelectorAll('#q4 input[type="checkbox"]');
            if (Array.from(checkboxes).every(cb => cb.checked)) {
                document.getElementById('q4').classList.add('hidden');
                document.getElementById('reward-1').classList.remove('hidden');
            } else { errorFeedback(document.getElementById('q4')); }
        }
    };

    window.selectOption = function(qNum, value) {
        const correct = { 2: "Visage", 3: "10/10" };
        if (value === correct[qNum]) { showNext(qNum, qNum + 1); }
        else { errorFeedback(document.getElementById(`q${qNum}`)); }
    };

    function showNext(current, next) {
        document.getElementById(`q${current}`).classList.add('hidden');
        document.getElementById(`q${next}`).classList.remove('hidden');
    }

    function errorFeedback(el) {
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 400);
    }

    // --- ÉTAPES ÉNIGMES ---
    document.getElementById('riddle-1-btn').addEventListener('click', () => {
        if (document.getElementById('riddle-1-input').value.toLowerCase().trim() === "secret") {
            document.getElementById('reward-2').classList.remove('hidden');
            document.getElementById('riddle-1-input').style.display = "none";
            document.getElementById('riddle-1-btn').style.display = "none";
        } else { errorFeedback(document.getElementById('riddle-1-input')); }
    });

    document.getElementById('riddle-2-btn').addEventListener('click', () => {
        const ans = document.getElementById('riddle-2-input').value.toLowerCase().trim();
        if (ans === "enveloppe" || ans === "une enveloppe") {
            document.getElementById('reward-3').classList.remove('hidden');
            document.getElementById('riddle-2-input').style.display = "none";
            document.getElementById('riddle-2-btn').style.display = "none";
        } else { errorFeedback(document.getElementById('riddle-2-input')); }
    });

    const finalCodeInput = document.getElementById('final-code-input');
    const unlockBtn = document.getElementById('unlock-btn');
    unlockBtn.addEventListener('click', () => {
        if (finalCodeInput.value.trim() === finalCode) {
            document.getElementById('final-result').classList.remove('hidden');
            finalCodeInput.style.display = "none";
            unlockBtn.style.display = "none";
            document.querySelector('#step-4 h2').innerText = "Accès Autorisé";
        } else { errorFeedback(finalCodeInput); }
    });
});
