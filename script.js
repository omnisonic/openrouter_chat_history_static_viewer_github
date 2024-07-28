document.addEventListener('DOMContentLoaded', () => {
    const fileList = document.getElementById('fileList');
    const chatContent = document.getElementById('chatContent');
    const loadingIndicator = document.createElement('p');

    // List of JSON files available in the data folder
    const jsonFiles = [
        'data/ORPG - Sun Jul 28 2024-2.json',
        // Add more JSON paths here if you have more files
    ];

    // Populate the sidebar with links to each JSON file
    jsonFiles.forEach(file => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = file.split('/').pop(); // Display the file name only
        a.addEventListener('click', (event) => {
            event.preventDefault();
            loadChatHistory(file);
        });
        li.appendChild(a);
        fileList.appendChild(li);
    });

    // Function to load chat history from a JSON file
    const loadChatHistory = async (file) => {
        chatContent.innerHTML = ''; // Clear the content
        loadingIndicator.textContent = 'Loading chat history...';
        chatContent.appendChild(loadingIndicator); // Show loading indicator

        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            displayChat(data);
        } catch (error) {
            console.error('Error loading chat history:', error);
            chatContent.innerHTML = `<p>Error loading chat history: ${error.message}</p>`;
        } finally {
            loadingIndicator.remove(); // Remove loading indicator
        }
    };

    // Display chat data in the content area
    const displayChat = (data) => {
        if (Object.keys(data.messages).length === 0) {
            chatContent.innerHTML = `<p>No messages found.</p>`;
            return;
        }

        let content = '';

        for (const messageId in data.messages) {
            const message = data.messages[messageId];
            const characterId = data.characters[message.characterId]?.modelInfo?.name || "Unknown Character";
            content += `<p><strong>${characterId}:</strong><br>${message.content.replace(/\n/g, '<br>')}</p><hr>`;
        }

        chatContent.innerHTML = content;
    };
});
