document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const finalCode = "123456";

    // --- EFFET DE PARTICULES ---
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        
        document.body.appendChild(particle);
        
        const destinationX = (Math.random() - 0.5) * 300;
        const destinationY = (Math.random() - 0.5) * 300;
        
        const animation = particle.animate([
            { transform: 'translate(0, 0)', opacity: 0 },
            { transform: `translate(${destinationX/2}px, ${destinationY/2}px)`, opacity: 0.8, offset: 0.5 },
            { transform: `translate(${destinationX}px, ${destinationY}px)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => particle.remove();
    }

    // Générer des particules de temps en temps
    setInterval(() => {
        if (Math.random() > 0.7) createParticle();
    }, 500);

    // --- BOUTON INITIAL ---
    startBtn.style.opacity = "0"; // Force l'invisibilité au départ
    startBtn.addEventListener('mouseenter', () => startBtn.style.opacity = "1");
    startBtn.addEventListener('mouseleave', () => startBtn.style.opacity = "0");

    startBtn.addEventListener('click', () => {
        goToStep(1);
    });

    // --- LOGIQUE DU QUESTIONNAIRE ---
    window.validateQuestion = function(num) {
        if (num === 1) {
            const input = document.querySelector(`#q1 input`);
            const answer = input.getAttribute('data-answer').toLowerCase();
            if (input.value.toLowerCase().trim() === answer.toLowerCase()) {
                showNext(1, 2);
            } else {
                errorFeedback(input);
            }
        } 
        else if (num === 4) {
            const checkboxes = document.querySelectorAll('#q4 input[type="checkbox"]');
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            if (allChecked) {
                document.getElementById('q4').classList.add('hidden');
                document.getElementById('reward-1').classList.remove('hidden');
            } else {
                errorFeedback(document.getElementById('q4'));
            }
        }
    };

    window.selectOption = function(qNum, value) {
        const correctAnswers = {
            2: "Visage",
            3: "10/10"
        };

        if (value === correctAnswers[qNum]) {
            showNext(qNum, qNum + 1);
        } else {
            errorFeedback(document.getElementById(`q${qNum}`));
        }
    };

    function showNext(current, next) {
        document.getElementById(`q${current}`).classList.add('hidden');
        document.getElementById(`q${next}`).classList.remove('hidden');
    }

    function errorFeedback(el) {
        el.classList.add('shake');
        setTimeout(() => el.classList.remove('shake'), 400);
    }

    // --- ÉTAPE 2: Énigme 1 ---
    const riddle1Input = document.getElementById('riddle-1-input');
    const riddle1Btn = document.getElementById('riddle-1-btn');

    riddle1Btn.addEventListener('click', () => {
        if (riddle1Input.value.toLowerCase().trim() === "secret") {
            document.getElementById('reward-2').classList.remove('hidden');
            riddle1Input.style.display = "none";
            riddle1Btn.style.display = "none";
        } else {
            errorFeedback(riddle1Input);
        }
    });

    // --- ÉTAPE 3: Énigme 2 ---
    const riddle2Input = document.getElementById('riddle-2-input');
    const riddle2Btn = document.getElementById('riddle-2-btn');

    riddle2Btn.addEventListener('click', () => {
        const ans = riddle2Input.value.toLowerCase().trim();
        if (ans === "enveloppe" || ans === "une enveloppe") {
            document.getElementById('reward-3').classList.remove('hidden');
            riddle2Input.style.display = "none";
            riddle2Btn.style.display = "none";
        } else {
            errorFeedback(riddle2Input);
        }
    });

    // --- ÉTAPE 4: Code Final ---
    const finalInput = document.getElementById('final-code-input');
    const unlockBtn = document.getElementById('unlock-btn');

    unlockBtn.addEventListener('click', () => {
        if (finalInput.value.trim() === finalCode) {
            document.getElementById('final-result').classList.remove('hidden');
            finalInput.style.display = "none";
            unlockBtn.style.display = "none";
            document.querySelector('#step-4 h2').innerText = "Accès Autorisé";
        } else {
            errorFeedback(finalInput);
        }
    });
});

function goToStep(num) {
    const steps = document.querySelectorAll('.step');
    steps.forEach(s => s.classList.remove('active'));
    
    setTimeout(() => {
        const target = document.getElementById(`step-${num}`);
        target.classList.add('active');
    }, 100);
}
