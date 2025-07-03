document.addEventListener('DOMContentLoaded', () => {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker Registered'))
            .catch(error => console.error('Service Worker Registration Failed:', error));
    }

    const startExamBtn = document.getElementById('start-exam-btn');
    if (startExamBtn) {
        startExamBtn.addEventListener('click', startExam);
    }
});

const examState = {
    currentSectionIndex: 0,
    sections: [
        { type: 'reading-matching', renderer: renderReadingMatching },
        { type: 'speaking-prompt', renderer: renderSpeakingPrompt },
        // Add more sections here
    ],
    answers: {}
};

function startExam() {
    loadSection(examState.currentSectionIndex);
}

async function loadSection(index) {
    showLoader();
    const section = examState.sections[index];
    const questionData = await fetchQuestion(section.type);

    if (questionData.error) {
        renderError(questionData.error);
        return;
    }

    // Store the original question data for evaluation
    examState.answers[`section_${index}`] = { question: questionData, userAnswer: null };
    section.renderer(questionData);
    addSectionEventListeners();
}

function addSectionEventListeners() {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNext);
    }

    const startRecordingBtn = document.getElementById('start-recording-btn');
    if (startRecordingBtn) {
        startRecordingBtn.addEventListener('click', handleRecording);
    }
}

function handleNext() {
    collectAnswers();
    examState.currentSectionIndex++;
    if (examState.currentSectionIndex < examState.sections.length) {
        loadSection(examState.currentSectionIndex);
    } else {
        submitExam();
    }
}

function collectAnswers() {
    const sectionData = examState.answers[`section_${examState.currentSectionIndex}`];
    if (sectionData.question.type === 'reading-matching') {
        const userAnswers = {};
        sectionData.question.questions.forEach(q => {
            const selected = document.querySelector(`input[name="question-${q.id}"]:checked`);
            userAnswers[q.id] = selected ? selected.value : null;
        });
        sectionData.userAnswer = userAnswers;
    } else if (sectionData.question.type === 'speaking-prompt') {
        sectionData.userAnswer = document.getElementById('speaking-answer').value;
    }
}

function handleRecording() {
    const startBtn = document.getElementById('start-recording-btn');
    const micStatus = document.getElementById('mic-status');
    const answerTextarea = document.getElementById('speaking-answer');
    
    startBtn.disabled = true;
    startBtn.textContent = 'Recording...';
    micStatus.textContent = 'Recording...';
    micStatus.classList.add('recording');

    startRecognition((transcript) => {
        answerTextarea.value = transcript;
    });

    // For demo, stop after 10 seconds. In reality, you'd use the exam timer.
    setTimeout(() => {
        stopRecognition();
        micStatus.textContent = 'Recording finished.';
        micStatus.classList.remove('recording');
        startBtn.textContent = 'Start Recording';
        startBtn.disabled = false;
    }, 10000); // 10 seconds
}

async function submitExam() {
    showLoader();
    console.log("Final Answers to Submit:", examState.answers);
    const evaluation = await submitExamForEvaluation(examState.answers);
    if (evaluation.error) {
        renderError(evaluation.error);
    } else {
        renderResults(evaluation);
    }
}