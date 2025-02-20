// client/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [modelReply, setModelReply] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setModelReply('');    // reset any previous reply
    setErrorMsg('');      // reset any previous error

    try {
      // POST request to our Flask backend
      const response = await axios.post('http://localhost:8000/api/qm9', {
        user_input: userInput
      });

      if (response.data.error) {
        // If server returned an error
        setErrorMsg(response.data.error);
      } else {
        // Otherwise, we have a model reply
        setModelReply(response.data.reply);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong. Check the console.');
    }
  };

  return (
    <div className="App">
      <header className="header-bar">
        <h1>QM9 Fine-Tuned LLM Tester</h1>
        <button className="interact-button" onClick={() => alert('Hello!')}>
          Interact
        </button>
      </header>

      <div className="content-container">
        <section className="card">
          <h2>Ask a Question or Provide a Molecule</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your question or molecule description here..."
            />
            <button type="submit" className="submit-button">
              Submit to Model
            </button>
          </form>

          <div className="status">
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
          </div>

          <div className="results">
            {modelReply && (
              <>
                <h3>Model Reply:</h3>
                <p>{modelReply}</p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
