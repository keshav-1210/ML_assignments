import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [age, setAge] = useState('');
  const [model_type, setmodel_type] = useState('naive_bayes');
  const [bmi, setBmi] = useState('');
  const [glucose, setGlucose] = useState('');
  const [insulin, setInsulin] = useState('');
  const [output, setOutput] = useState(null);

  useEffect(() => {
    if (age && model_type && bmi && glucose && insulin) {
      fetch('http://127.0.0.1:5000/predict', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          age: age,
          glucose: glucose,
          insulin: insulin,
          bmi: bmi,
          model_type: model_type
        })
      })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data)
        setOutput(data.diabetes_type)
      })
      .catch((error) => console.error('Error:', error));
    }
  }, [age, model_type, bmi, glucose, insulin]);

  return (
    <>
   
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Diabetes Prediction</h1>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your age"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">BMI:</label>
          <input
            type="number"
            value={bmi}
            onChange={(e) => setBmi(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your BMI"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Glucose:</label>
          <input
            type="number"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter glucose level"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Insulin:</label>
          <input
            type="number"
            value={insulin}
            onChange={(e) => setInsulin(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter insulin level"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Model Type:</label>
          <select
            value={model_type}
            onChange={(e) => setmodel_type(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="naive_bayes">Naive Bayes</option>
            <option value="perceptron">Perceptron</option>
          </select>
        </div>

          <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
            <p className="font-semibold">Predicted Diabetes Type :</p>
            <p>{output}</p>
          </div>
        
      </div>
    </div></>
    
  );
}

export default App;
