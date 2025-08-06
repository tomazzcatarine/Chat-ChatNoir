# controllers/usuarios.py
from controllers.sql import Banco

class Usuario:
    def __init__ (self, usuario=None, senha=None):
        self.usuario = usuario
        self.senha = senha
        self.banco = Banco()

    def cadastrar(self):
        try: 
            dados = {
                'usuario': self.usuario,
                'senha': self.senha 
            }

            
            print(f"Inserindo no banco: {dados}")
            self.banco.inserir('tb_login', dados)
            print('aeee cadastrouu')
        
        except Exception as e:
            print(f"afe deu erro :7 : {e}")        

    def login(self):
        if self.banco.verificar_login(self.usuario, self.senha):
            print("Login bem-sucedido!")
            return True
        else:
            print("Usuário ou senha incorretos.")
            return False
