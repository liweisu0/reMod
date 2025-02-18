import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  // State to store message from test API
  const [message, setMessage] = useState('');
  // State for the selected file
  const [selectedFile, setSelectedFile] = useState(null);
  // State for upload response message
  const [uploadResponse, setUploadResponse] = useState('');
  // State to store data fetched from PostgreSQL
  const [queryData, setQueryData] = useState(null);

  // Fetch a test message from the backend on mount
  useEffect(() => {
    fetch('http://localhost:3001/api/test')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error:', error));
  }, []);

  // Handle file input changes
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload form submission
  const handleFileUpload = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.text())
      .then(data => {
        setUploadResponse(data);
      })
      .catch(error => {
        console.error('Upload error:', error);
      });
  };

  // Handler to fetch data from PostgreSQL endpoint
  const fetchQueryData = () => {
    fetch('http://localhost:3001/api/data')
      .then(response => response.json())
      .then(data => setQueryData(data.data))
      .catch(error => {
        console.error('Error fetching query data:', error);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>roMed React App</h1>
        <p>Backend says: {message}</p>
        <form onSubmit={handleFileUpload}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload File</button>
        </form>
        {uploadResponse && <p>Upload response: {uploadResponse}</p>}
        <button onClick={fetchQueryData}>
          Fetch PostgreSQL Data
        </button>
        {queryData && (
          <div>
            <h3>Query Data:</h3>
            <pre>{JSON.stringify(queryData, null, 2)}</pre>
          </div>
        )}
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
