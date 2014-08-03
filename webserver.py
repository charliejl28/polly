from flask import Flask, render_template, jsonify, request, redirect
from werkzeug.utils import secure_filename
import os
import sh
app = Flask(__name__)
app.debug = True

@app.route("/")
def hello():
    return render_template("index.html")

@app.route("/upload", methods=['GET', 'POST'])
def upload():
    if request.method == 'GET':
        return render_template("upload.html")
    else:
        f = request.files['file']
        filename = secure_filename(f.filename)
        if not os.path.exists('/tmp/polly'):
            os.makedirs('/tmp/polly')
        f.save(os.path.join('/tmp/polly', filename))
        sh.python("/srv/polly/python-client/send_file.py")
        return redirect('/')

@app.route("/network.json")
def network():
    import json
    try:
        with open("/tmp/polly/_polly_status.json") as psj:
            data = json.loads(psj.read())
        return jsonify(**data)
    except IOError:
        return jsonify(packets=[], ports=[])

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
