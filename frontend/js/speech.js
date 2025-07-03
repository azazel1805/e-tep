// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
    recognition.continuous = true;
    recognition.lang = 'en-US';
}

const synthesis = window.speechSynthesis;

function speak(text, onEndCallback) {
    if (synthesis.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.onend = () => {
        onEndCallback();
    };
    utterThis.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror');
    };
    synthesis.speak(utterThis);
}

function startRecognition(onResultCallback) {
    if (!recognition) {
        alert("Sorry, your browser does not support Speech Recognition.");
        return;
    }
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        onResultCallback(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
    }
}