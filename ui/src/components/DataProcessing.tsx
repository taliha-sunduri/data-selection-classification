import React, { useState } from 'react';
import axios from 'axios';
import '../index.css';

const DataProcessing: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleRun = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:5000/api/firefly/process', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error running algorithm:', error);
        setMessage('Failed to run the algorithm. Please try again.');
      }
    }
  };

  return (
    <div className="parameters-container">
      <div className="file-input-container">
        <input type="file" onChange={handleFileChange} className="file-input" />
      </div>
      <div className="parameters-input-container">
        <div className="input-group">
          <label>Number of trees for random forest:</label>
          <input type="number" defaultValue={5000} />
        </div>
        <div className="input-group">
          <label>Gamma:</label>
          <input type="number" defaultValue={1} />
        </div>
        <div className="input-group">
          <label>Alpha:</label>
          <input type="number" defaultValue={0.7} />
        </div>
        <div className="input-group">
          <label>Beta0:</label>
          <input type="number" defaultValue={2} />
        </div>
        <div className="input-group">
          <label>Alpha damping ratio:</label>
          <input type="number" defaultValue={0.98} />
        </div>
        <div className="input-group">
          <label>Number of fireflies:</label>
          <input type="number" defaultValue={10} />
        </div>
        <div className="input-group">
          <label>Number of iterations:</label>
          <input type="number" defaultValue={100} />
        </div>
        <div className="input-group">
          <label>Most important Genes:</label>
          <input type="number" defaultValue={500} />
        </div>
        <div className="input-group">
          <label>Omega:</label>
          <input type="number" defaultValue={0.9999} />
        </div>
      </div>
      <button onClick={handleRun} className="run-button">Run</button>
      <p>{message}</p>
    </div>
  );
};

export default DataProcessing;
