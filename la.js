window.onload = function() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messageArea = document.getElementById('messageArea');
 const youtubeContainer = document.getElementById("youtubeContainer");
    const youtubeFrame = document.getElementById("youtubeFrame");



    let isTyping = false;
    let currentTypingIndicator = null;
    const messageQueue = [];
    let latestUserMessageText = "";
    const API_KEY = "AIzaSyBq4Z0IeTD9BLXKLCP9AnZYUe5XAajTmYA"; 
    const Instruction = "You are Lalita, D.O.B.- 01/03/2006. You are my best female friend. You are brave,cool, attitude,roster,evasion on studies. you know bengali abuses . You sometimes use '🤧 '  this emoji  and use 'bal' abuse.If I say about suicide or die you tell 'dara tor Ma k bol6i'.  Respond concisely and professionally in bengali.";

    let conversationHistory = []; 

    function createUserMessage(messageText) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user-message');
        messageDiv.textContent = messageText;
        messageDiv.setAttribute('data-time', getCurrentTime()); 
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 10);
        return messageDiv;
    }

    function createGirlfriendMessage(messageText) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'girlfriend-message');
        messageDiv.innerHTML = messageText;
        messageDiv.setAttribute('data-time', getCurrentTime()); 

        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 10);
        return messageDiv;
    }

    function createQuotedUserMessage(messageText) {
        const quotedDiv = document.createElement('div');
        quotedDiv.classList.add('quoted-message');
        quotedDiv.textContent = messageText;
        return quotedDiv;
    }

    function createTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        return typingDiv;
    }

    function enqueueMessage(messageText) {
        messageQueue.push(messageText);
        if (!isTyping) {
            processMessageQueue();
        }
    }

    function getCurrentTime() {
        const now = new Date();
        return now.getHours() + ":" + now.getMinutes().toString().padStart(2, "0");
    }

    async function getGeminiResponse(messageText) {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        conversationHistory.push({ role: "user", parts: [{ text: messageText }] });

        const requestBody = {
            systemInstruction: {
                role: "user",
                parts: [{ text: Instruction }]
            },
            contents: conversationHistory,
            generationConfig: {
                temperature: 1,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048, 
                responseMimeType: "text/plain"
            }
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
                const modelResponseText = data.candidates[0].content.parts[0].text;
                conversationHistory.push({ role: "model", parts: [{ text: modelResponseText }] });

                if (conversationHistory.length > 100) {
                    conversationHistory = conversationHistory.slice(2);
                }

                return modelResponseText;
            } else {
                console.error("Unexpected API response format:", data);
                return "ki?";
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            return "Bal valo kore bol.";
        }
    }

    async function processMessageQueue() {
        if (messageQueue.length === 0 || isTyping) {
            return;
        }

        const userMessageText = messageQueue.shift();
        isTyping = true;
        currentTypingIndicator = createTypingIndicator();
        messageArea.appendChild(currentTypingIndicator);
        messageArea.scrollTop = messageArea.scrollHeight;

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const responseText = await getGeminiResponse(userMessageText);
            const quotedMessageDiv = createQuotedUserMessage(userMessageText);

            let girlfriendResponseHTML = quotedMessageDiv.textContent === latestUserMessageText ? responseText : quotedMessageDiv.outerHTML + "<br>" + responseText;

            setTimeout(() => {
                if (currentTypingIndicator) {
                    messageArea.removeChild(currentTypingIndicator);
                    currentTypingIndicator = null;
                }

                const girlfriendResponse = createGirlfriendMessage(girlfriendResponseHTML);
                messageArea.appendChild(girlfriendResponse);
                messageArea.scrollTop = messageArea.scrollHeight;
                isTyping = false;
                processMessageQueue();
            }, 1500);
        } catch (error) {
            console.error("Error processing message queue:", error);
            if (currentTypingIndicator) {
                messageArea.removeChild(currentTypingIndicator);
                currentTypingIndicator = null;
            }
            messageArea.appendChild(createGirlfriendMessage("ki sob bolchis?"));
            isTyping = false;
            processMessageQueue();
        }
    }

    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();

        if (messageText.toLowerCase().startsWith("video")) {
    const query = messageText.replace("video", "").trim();
    if (query) {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        window.open(searchUrl, "_blank"); // Opens in a new tab
    } else {
        alert("Please provide a search quary.");
    }
    return;
}

            if (messageText.toLowerCase().startsWith("song")) {
    const query = messageText.replace("song", "").trim();
    if (query) {
        const searchUrl = `https://open.spotify.com/search/${encodeURIComponent(query)}`;
        window.open(searchUrl, "_blank"); // Opens in a new tab
    } else {
        alert("Please provide a song name.");
    }
    return;
}


if (messageText.toLowerCase().startsWith("reels")) {
    const query = messageText.replace("reels", "").trim();
    if (query) {
        const searchUrl = `https://www.instagram.com/search/${encodeURIComponent(query)}`;
        window.open(searchUrl, "_blank"); // Opens in a new tab
    } else {
        alert("Please provide a reel name.");
    }
    return;
}

    if (messageText.toLowerCase().startsWith("profile")) {
    const query = messageText.replace("profile", "").trim();
    if (query) {
        const searchUrl = `https://m.facebook.com/search/people/?q=${encodeURIComponent(query)}`;
        window.open(searchUrl, "_blank"); // Opens Facebook Lite search
    } else {
        alert("Please provide a name.");
    }
    return;
}
    



 
        if (messageText !== "") {
            const messagesToSend = messageText.split('\n').filter(msg => msg.trim() !== "");

            messagesToSend.forEach(msg => {
                latestUserMessageText = msg;
                messageArea.appendChild(createUserMessage(msg));
                enqueueMessage(msg);
            });

            if (isTyping && currentTypingIndicator) {
                messageArea.appendChild(currentTypingIndicator);
                messageArea.scrollTop = messageArea.scrollHeight;
            }

            messageInput.value = "";
            messageArea.scrollTop = messageArea.scrollHeight;
        }
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            sendButton.click();
            event.preventDefault();
        }
    });
};

    function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour time to 12-hour format

    return `${hours}:${minutes} ${ampm}`;
}