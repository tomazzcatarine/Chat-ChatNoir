from flask import Flask, redirect, render_template, request,session,url_for
from controllers.usuarios import Usuario
from controllers.sql import Banco
from flask_socketio import SocketIO, emit,send
import sqlite3

app = Flask(__name__)
io = SocketIO(app)

app.secret_key = 'wjsn'


messages = []

def conectar_bd():
    return sqlite3.connect("models/banco.db")

# Index ----------------------------------------------------
@app.route('/')
def index():
    return render_template('index.html')


# Cadastro --------------------------------------------------
@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        usuario = Usuario(request.form.get('usuario'), request.form.get('senha'))
        try:
            with conectar_bd() as con:
                cur = con.cursor()
                cur.execute("INSERT INTO tb_login (usuario, senha) VALUES (?, ?)", (usuario.usuario, usuario.senha))
                con.commit()
            return redirect(url_for("login"))
        except sqlite3.IntegrityError:
            return render_template("cadastro.html", erro="Usuário já existe!")

    return render_template("cadastro.html")


# Login -----------------------------------------------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form.get('usuario')
        senha = request.form.get('senha')

        user = Usuario(usuario, senha)
        
        if user.login():
            session['username'] = usuario
            return redirect('/chat')
        else:
            return redirect('/login')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/')


@app.route('/chat', methods=['POST', 'GET'])
def home():
    return render_template('chat.html')

@io.on('sendMessage')
def send_message_handler(msg):
    messages.append(msg) 
    emit('getMessage', msg, broadcast=True)

@io.on('message')
def message_handler(msg):
    send(messages)

if __name__ == '__main__':    
    io.run(app, host="0.0.0.0", port=5000, debug=True)
