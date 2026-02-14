document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const finalCode = "123456";
    const cursor = document.getElementById('custom-cursor');
    const overlay = document.getElementById('flashlight-overlay');
    const hSwitch = document.getElementById('hidden-switch');
    const app = document.getElementById('app');

    let isLightOn = false;
    let currentStep = 0;

    // --- CURSEUR ET LAMPE TORCHE ---
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        if (!isLightOn) {
            document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
            
            // Vérifier si l'interrupteur est sous la lampe
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

        // Traînée
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        document.body.appendChild(dot);
        dot.animate([{ opacity: 0.6, scale: 1 }, { opacity: 0, scale: 0 }], { duration: 800 }).onfinish = () => dot.remove();
    });

    // --- LOGIQUE UNIQUE DE L'INTERRUPTEUR (Étape 0 seulement) ---
    function placeInitialSwitch() {
        const x = Math.random() * (window.innerWidth - 120) + 60;
        const y = Math.random() * (window.innerHeight - 120) + 60;
        hSwitch.style.left = `${x}px`;
        hSwitch.style.top = `${y}px`;
        hSwitch.style.display = 'block';
    }

    hSwitch.addEventListener('click', () => {
        isLightOn = true;
        hSwitch.style.display = 'none';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 1000);
        
        // Flash blanc
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.inset = '0';
        flash.style.zIndex = '6000';
        flash.className = 'light-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 800);
        
        // Rendre visible le contenu de la landing
        document.getElementById('step-0').style.visibility = 'visible';
    });

    // --- GESTION DES ÉTAPES ---
    window.goToStep = function(num) {
        currentStep = num;
        const steps = document.querySelectorAll('.step');
        
        // Transition de fondu entre les questions
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

    // --- BOUTON COMMENCER ---
    startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToStep(1);
    });

    // Initialisation
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

    document.getElementById('unlock-btn').addEventListener('click', () => {
        if (document.getElementById('final-code-input').value.trim() === finalCode) {
            document.getElementById('final-result').classList.remove('hidden');
            document.getElementById('final-code-input').style.display = "none";
            document.getElementById('unlock-btn').style.display = "none";
            document.querySelector('#step-4 h2').innerText = "Accès Autorisé";
        } else { errorFeedback(document.getElementById('final-code-input')); }
    });
});
