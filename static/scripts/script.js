window.onload = function() {
    const socket = io('');
    console.log(username);

    function addToChat(msg) {
        const span = document.createElement('span');

        // Formata a data e hora
        const now = new Date();
        const hora = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const data = now.toLocaleDateString();

        // Cria o conteúdo com a data/hora
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

    socket.on('connect', () => {
        socket.send("Usuário conectado");
    });

    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();

        socket.emit('sendMessage', {
            message: event.target[0].value,
            user: username
        });
        event.target[0].value = '';
    });

    socket.on('getMessage', (msg) => {
        addToChat(msg);
    });

    socket.on('message', (msgs) => {
        for (msg of msgs) {
            addToChat(msg);
        }
    });
}
