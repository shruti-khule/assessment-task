from flask import Flask, jsonify, request
from flask_cors import CORS
import json
# from PIL import Image
import base64
import time 

app = Flask(__name__)
CORS(app)

NODES = [
  {
    "_id": "8d36a8c6-b3bc-4e97-ae5e-fe6c5ae792e5",
    "type": "PromptNode",
    "start": True,
    "config": {
      "text": "Das ist ein Test",
      "answer": []
    },
    "outputs": ["f4db9b1a-dce2-4060-892f-ff0b2892d730"]
  },
  {
    "_id": "f4db9b1a-dce2-4060-892f-ff0b2892d730",
    "type": "PromptNode",
    "config": {
      "text": "Das ist ein Test 2",
      "answer": []
    },
    "outputs": ["f4db9b1a-dce2-4060-892f-ff0b2892d731"]
  },
  {
    "_id": "f4db9b1a-dce2-4060-892f-ff0b2892d731",
    "type": "SignNode",
    "config": {
      "text": "Das ist ein Test 3",
      "answer": []
    },
    "outputs": []
  }
]

@app.route('/process', methods=['GET'])
def api():
    if request.method == 'GET':
      return jsonify(NODES)

@app.route('/process', methods=['POST'])
def api2():
    if request.method == 'POST':
      data = json.loads(request.data)
      for i, item in enumerate(NODES):
        if item["_id"] == data["_id"]:
           item["config"]["answer"].append(data["answer"])
           NODES[i] = item
           
      return jsonify(NODES)
    
@app.route('/process', methods=['DELETE'])
def api3():
    if request.method == 'DELETE':
      data = json.loads(request.data)
      print(data)
      for i, item in enumerate(NODES):
        if item["_id"] == data["_id"]:
           item["config"]["answer"].remove(data["deleteAnswer"])
           NODES[i] = item
           
      return jsonify(NODES)

@app.route('/process/sign', methods=['POST'])
def api4():
    if request.method == 'POST':
      image  = request.form['image']
      imgdata = base64.b64decode(str(image.split(",")[-1])) 

      time_stamp = time.time()
      image_filename = "./flask/images/" + str(time_stamp) + ".png"
      with open(image_filename, 'wb+') as f:
        f.write(imgdata)
           
      return image_filename

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1337)
