const API_BASE_URL = 'http://127.0.0.1:5001'; // For local dev. Change for Render.

async function fetchQuestion(type) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: type }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching question:", error);
        return { error: "Could not load question. Please try again." };
    }
}

async function submitExamForEvaluation(answers) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/evaluate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answers),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error submitting for evaluation:", error);
        return { error: "Could not evaluate exam. Please try again." };
    }
}