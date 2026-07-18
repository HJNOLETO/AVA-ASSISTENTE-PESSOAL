// Lógica para Dark Mode
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Carrega a preferência do usuário
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    // Alterna o tema
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            let theme = 'light';
            if (body.classList.contains('dark-mode')) {
                theme = 'dark';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // Lógica do Quiz
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            checkQuiz();
        });
    }
});

function checkQuiz() {
    const quizForm = document.getElementById('quiz-form');
    const questions = quizForm.querySelectorAll('.quiz-question');
    let score = 0;
    let totalQuestions = 0;

    questions.forEach((question, index) => {
        totalQuestions++;
        const feedbackDiv = question.querySelector('.quiz-feedback');
        const correctAnswer = question.getAttribute('data-correct-answer');
        let isCorrect = false;

        // Limpa feedback anterior
        feedbackDiv.style.display = 'none';
        feedbackDiv.classList.remove('correct', 'incorrect');

        // Verifica a resposta (para múltipla escolha e verdadeiro/falso)
        const selectedOption = question.querySelector(`input[name="q${index}"]:checked`);
        if (selectedOption) {
            if (selectedOption.value === correctAnswer) {
                isCorrect = true;
            }
        }

        // Verifica a resposta (para exercícios de código - simplificado para string match)
        const codeAnswer = question.querySelector('textarea');
        if (codeAnswer) {
            // Para exercícios de código, o gabarito é o valor do atributo data-correct-answer
            // Em um quiz real, isso seria mais complexo (execução, testes unitários)
            const userAnswer = codeAnswer.value.trim().replace(/\s+/g, ' ');
            const expectedAnswer = correctAnswer.trim().replace(/\s+/g, ' ');
            if (userAnswer === expectedAnswer) {
                isCorrect = true;
            }
        }

        if (isCorrect) {
            score++;
            feedbackDiv.classList.add('correct');
            feedbackDiv.innerHTML = '✅ **Correto!** ' + question.getAttribute('data-explanation');
        } else {
            feedbackDiv.classList.add('incorrect');
            feedbackDiv.innerHTML = '❌ **Incorreto.** A resposta correta é: ' + correctAnswer + '. ' + question.getAttribute('data-explanation');
        }
        feedbackDiv.style.display = 'block';
    });

    const resultDiv = document.getElementById('quiz-result');
    if (resultDiv) {
        resultDiv.innerHTML = `Sua pontuação final: **${score} de ${totalQuestions}** (${((score / totalQuestions) * 100).toFixed(0)}%)`;
    }
}

// Função para gerar o HTML do Quiz (será usada na fase de desenvolvimento)
function generateQuizHTML(quizData) {
    let html = `<form id="quiz-form">`;
    quizData.forEach((q, index) => {
        html += `<div class="quiz-question" data-correct-answer="${q.correctAnswer}" data-explanation="${q.explanation}">`;
        html += `<h4>Questão ${index + 1}: ${q.question}</h4>`;

        if (q.type === 'multiple-choice' || q.type === 'true-false') {
            html += `<div class="quiz-options">`;
            q.options.forEach((option, optIndex) => {
                html += `<label><input type="${q.type === 'true-false' ? 'radio' : 'radio'}" name="q${index}" value="${option.value}"> ${option.text}</label>`;
            });
            html += `</div>`;
        } else if (q.type === 'code-exercise') {
            html += `<textarea rows="5" name="q${index}" placeholder="Insira seu código aqui..."></textarea>`;
        } else if (q.type === 'conceptual') {
            html += `<textarea rows="3" name="q${index}" placeholder="Responda aqui..."></textarea>`;
        }

        html += `<div class="quiz-feedback"></div>`;
        html += `</div>`;
    });

    html += `<button type="submit" class="btn btn-primary">Verificar Respostas</button>`;
    html += `</form>`;
    html += `<div id="quiz-result"></div>`;
    return html;
}
