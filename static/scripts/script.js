window.onload = function() {
    const socket = io(); // conecta com o servidor

    const username = "{{ session['username'] }}";

    function addToChat(msg) {
        const span = document.createElement('span');

        const now = new Date();
        const hora = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const data = now.toLocaleDateString();

        span.innerHTML = `
            <strong>${msg.user}</strong>: ${msg.message}
            <div style="font-size: 0.75em; color: #bbb; margin-top: 6px; text-align: right;">
                ${data} ${hora}
            </div>
        `;

        const messagesDiv = document.getElementById('messages');
        messagesDiv.appendChild(span);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();

        const input = event.target[0].value;
        if (input.trim() === "") return;

        socket.emit('sendMessage', {
            user: username,
            message: input
        });

        event.target[0].value = '';
    });

    socket.on('getMessage', (msg) => {
        addToChat(msg);
    });

    // Mostra quando entra no chat
    socket.emit('sendMessage', {
        user: username,
        message: 'entrou no chat!'
    });
}
