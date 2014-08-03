from flask import Flask, render_template, jsonify
app = Flask(__name__)

@app.route("/")
def hello():
    return render_template("index.html")

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
    app.run()
