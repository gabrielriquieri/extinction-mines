from flask import Flask, send_from_directory, jsonify, request

app = Flask(__name__, static_folder='.')

dados_usuario = {"saldo": 100.0}

# Serve o index.html direto da pasta principal
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/saldo', methods=['GET', 'POST'])
def gerenciar_saldo():
    if request.method == 'POST':
        dados = request.get_json()
        if dados and 'saldo' in dados:
            dados_usuario['saldo'] = float(dados['saldo'])
        return jsonify({"status": "sucesso", "saldo": dados_usuario['saldo']})
    
    return jsonify({"saldo": dados_usuario['saldo']})

if __name__ == '__main__':
    app.run(debug=True)