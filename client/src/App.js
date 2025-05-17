// client/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [modelReply, setModelReply] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [orbitalImages, setOrbitalImages] = useState([]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setModelReply('');    // reset any previous reply
    setErrorMsg('');      // reset any previous error
    setOrbitalImages([]); // reset orbitals

    try {
      const [llmRes, pyscfRes] = await Promise.all([
        axios.post('http://localhost:8000/api/qm9', {
          user_input: userInput
        }),
        axios.post('http://localhost:8000/api/pyscf', {
          molecule: userInput
        })
      ]);

      if (llmRes.data.error) {
        setErrorMsg(llmRes.data.error);
      } else {
        setModelReply(llmRes.data.reply);
      }

      if (pyscfRes.data.images) {
        setOrbitalImages(pyscfRes.data.images);
      } else if (pyscfRes.data.error) {
        setErrorMsg(pyscfRes.data.error);
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
            {orbitalImages.length > 0 && (
              <div className="orbital-grid">
                {orbitalImages.map((img, idx) => (
                  <div key={idx} className="orbital-item">
                    <img src={`data:image/png;base64,${img}`} alt={`Orbital ${idx + 1}`} />
                    <p>Orbital {idx + 1}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
