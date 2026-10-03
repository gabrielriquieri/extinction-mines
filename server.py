from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
import json

saldo = 1000   # as moedas do jogador

class Servidor(BaseHTTPRequestHandler):

    def do_GET(self):
        if self.path == "/saldo":
            # O JavaScript pediu o saldo: respondemos com ele
            self.responder("application/json", json.dumps({"saldo": saldo}))
        else:
            # Qualquer outro pedido: entregamos a página do jogo
            pagina = Path(__file__).parent / "index.html"
            self.responder("text/html; charset=utf-8", pagina.read_text(encoding="utf-8"))

    def responder(self, tipo, texto):
        dados = texto.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", tipo)
        self.send_header("Content-Length", str(len(dados)))
        self.end_headers()
        self.wfile.write(dados)

print("Jogo rodando em http://localhost:8000  (Ctrl+C para parar)")
HTTPServer(("", 8000), Servidor).serve_forever()