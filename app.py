import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import joblib
import pandas as pd  # Assuming the file is CSV or something similar
import test_model as tm

# Set up paths
model_path = './SavedModels/RandomForest/model.pkl'
scaler_path = './SavedModels/RandomForest/scaler.pkl'

# Load model and scaler
model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        print("File upload route hit!")  # Debugging
        # Check if a file is part of the request
        if 'file' not in request.files:
            print("No file part in the request")
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        if file.filename == '':
            print("No file selected")
            return jsonify({"error": "No selected file"}), 400
        
        print(f"Received file: {file.filename}")

        # Save the file name to a variable
        uploaded_file_name = file.filename
        print(f"Uploaded file name: {uploaded_file_name}")

        # prediction 
        csv_file_path = f"./upload/{uploaded_file_name}"
        output_csv_path = f"./predictions/predictions_{uploaded_file_name}"
        tm.predict_and_save_to_csv(csv_file_path, output_csv_path)
        send_file(output_csv_path, as_attachement=True)
        
        return jsonify({"message": f"File received and prediction will be downloaded in few seconds"}), 200
    except Exception as e:
        print(f"Error: {e}")  # Log the actual error
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
