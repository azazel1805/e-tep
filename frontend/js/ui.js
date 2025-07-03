const appContainer = document.getElementById('app-container');

function showLoader() {
    appContainer.innerHTML = '<div class="loader"></div>';
}

function renderError(message) {
    appContainer.innerHTML = `<div class="error"><h2>Error</h2><p>${message}</p></div>`;
}

function renderReadingMatching(data) {
    const passageHtml = data.passage.map(p => `<p><b>${p.paragraph}</b> ${p.content}</p>`).join('');
    
    const questionsHtml = data.questions.map(q => `
        <div class="question-item" data-question-id="${q.id}">
            <p>${q.statement}</p>
            <div class="options-grid">
                ${data.passage.map(p => `
                    <label>
                        ${p.paragraph}
                        <input type="radio" name="question-${q.id}" value="${p.paragraph}">
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');

    appContainer.innerHTML = `
        <h2>Reading Section 1 – Part 1 – Matching Items</h2>
        <div class="reading-container">
            <div class="reading-passage">${passageHtml}</div>
            <div class="reading-questions">${questionsHtml}</div>
        </div>
        <button id="next-btn">Next Section</button>
    `;
}

function renderSpeakingPrompt(data) {
    appContainer.innerHTML = `
        <h2>Speaking Section</h2>
        <div class="speaking-container" data-question-id="speaking_1">
            <h3>${data.question}</h3>
            <p>You have ${data.preparation_time} seconds to prepare.</p>
            <p>You will have ${data.speaking_time} seconds to speak.</p>
            <button id="start-recording-btn">Start Recording</button>
            <p id="mic-status" class="mic-status">Not recording</p>
            <textarea id="speaking-answer" placeholder="Your transcribed text will appear here..." readonly></textarea>
        </div>
        <button id="next-btn">Finish Exam</button>
    `;
}

function renderResults(data) {
    const resultsHtml = data.results.map(r => `
        <li>
            <strong>Question ${r.question_id}:</strong> Score ${r.score * 100}%
            <p><em>Feedback: ${r.feedback}</em></p>
        </li>
    `).join('');

    appContainer.innerHTML = `
        <h2>Exam Results</h2>
        <h3>Overall Score: ${Math.round(data.overall_score * 100)}%</h3>
        <ul>${resultsHtml}</ul>
        <button onclick="location.reload()">Take Exam Again</button>
    `;
}