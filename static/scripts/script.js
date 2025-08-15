    // Pega o username da sessão do Flask
    const username = "{{ session['username'] }}";

    window.onload = function() {
        const socket = io(); // conecta com o servidor

        // Função para adicionar mensagem no chat
        function addToChat(msg) {
            const span = document.createElement('span');

            // Data e hora
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

        // Enviar mensagem ao apertar "Enter" no form
        document.querySelector('form').addEventListener('submit', function(event) {
            event.preventDefault();

            const messageInput = event.target[0].value;
            if (messageInput.trim() === "") return; // não envia vazio

            // Emite para o servidor
            socket.emit('sendMessage', {
                message: messageInput,
                user: username
            });

            event.target[0].value = ''; // limpa input
        });

        // Recebe mensagem do servidor
        socket.on('getMessage', (msg) => {
            addToChat(msg);
        });

        // Opcional: mostrar quando alguém entra
        socket.emit('sendMessage', {
            user: username,
            message: "entrou no chat!"
        });
    }
