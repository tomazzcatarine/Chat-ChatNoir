# controllers/sql.py
import sqlite3
 
class Banco:
    def __init__(self):
        pass
 
    def conectar(self):
        self.conexao = sqlite3.connect("models/banco.db")
        self.cursor = self.conexao.cursor()
 
    def desconectar(self):
        self.conexao.close()
 
    def inserir(self, tabela, dados: dict):
        self.conectar()
        colunas = ", ".join(dados.keys())
        valores = ", ".join(['?'] * len(dados))
        lista = list(dados.values())
 
        sql = f"INSERT INTO {tabela} ({colunas}) VALUES ({valores})"
        self.cursor.execute(sql, lista)
        self.conexao.commit()
        self.desconectar()
 
    def verificar_login(self, usuario, senha):
        self.conectar()
        sql = "SELECT * FROM tb_login WHERE usuario = ? AND senha = ?"
        self.cursor.execute(sql, (usuario, senha))
        resultado = self.cursor.fetchone()
        self.desconectar()
        return resultado is not None
