from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

class Perceptron_cust:
    def __init__(self, eta=0.01, n_iter=10):
        self.eta = eta
        self.n_iter = n_iter

    def weighted_sum(self, X):
        return np.dot(X, self.w[1:]) + self.w[0]

    def predict(self, X):
        return np.where(self.weighted_sum(X) >= 0.0, 1, -1)

    def fit(self, X, y):
        X = np.array(X)
        y = np.array(y)
        self.w = np.zeros(1 + X.shape[1])
        self.errors_ = []
        y = np.where(y == 0, -1, y)

        for _ in range(self.n_iter):
            error = 0
            for xi, target in zip(X, y):
                y_pred = self.predict(xi)
                update = self.eta * (target - y_pred)
                self.w[1:] += update * xi
                self.w[0] += update
                error += int(update != 0.0)

            self.errors_.append(error)
        return self

# Load your models
with open('gnb.pkl', 'rb') as f:
    loaded_nb_model = pickle.load(f)

with open('percep.pkl', 'rb') as fi:
    loaded_perceptron_model = pickle.load(fi)

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"]) # Enable CORS for all routes

@app.route('/predict', methods=['POST'])
@app.route('/predict', methods=['POST'])
def predict():
    # Get JSON data from the request
    data = request.get_json()
    
    try:
        # Extract features and convert them to numeric values
        age = float(data["age"])
        glucose = float(data["glucose"])
        insulin = float(data["insulin"])
        bmi = float(data["bmi"])
        
        # Prepare input features as a NumPy array
        input_features = np.array([[glucose, insulin, bmi,age]])
        print(input_features)
        # Choose the model based on input
        model_type = data.get('model_type', 'naive_bayes')
        if model_type == 'naive_bayes':
            prediction = loaded_nb_model.predict(input_features)
            
        elif model_type == 'perceptron':
            prediction = loaded_perceptron_model.predict(input_features)
        else:
            return jsonify({'error': 'Invalid model type'}), 400
        print(prediction[0])
        # Return the prediction as JSON
        if prediction[0]==-1:
            return jsonify({'diabetes_type':0})
        return jsonify({'diabetes_type': int(prediction[0])})
    
    except ValueError as e:
        return jsonify({'error': 'Invalid input type: All inputs should be numbers.'}), 400

if __name__ == '__main__':
    app.run(debug=True)
