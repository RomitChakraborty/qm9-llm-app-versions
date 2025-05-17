# server/server.py
import os
from openai import OpenAI
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import numpy as np
import base64
import io
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pyscf import gto, scf

# Load environment variables (OPENAI_API_KEY, etc.)
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

FINE_TUNED_MODEL = "ft:gpt-4o-2024-08-06:personal::B2SEozjc"
client = OpenAI(api_key=api_key)
app = Flask(__name__)
CORS(app)

@app.route("/api/qm9", methods=["POST"])
def query_qm9_model():
    """
    Receives a JSON object with { user_input: string },
    calls the fine-tuned GPT model, and returns the model's response.
    """
    data = request.json
    user_query = data.get("user_input", "")

    try:
        # Construct the messages for ChatCompletion
        messages = [
            {"role": "system", "content": "You are a quantum chemistry expert."},
            {"role": "user", "content": user_query}
        ]

        response = client.chat.completions.create(
            model=FINE_TUNED_MODEL,
            messages=messages,
            temperature=0.0
        )
        model_reply = response.choices[0].message.content
        return jsonify({"reply": model_reply})

    except Exception as e:
        # Return an error message if something goes wrong
        return jsonify({"error": str(e)}), 500


def generate_orbital_images(atom_spec: str, num_orbitals: int = 4):
    """Run a minimal PySCF HF calculation and return images of the orbitals."""
    mol = gto.M(atom=atom_spec, basis="sto-3g")
    mf = scf.RHF(mol)
    mf.kernel()

    ngrid = 40
    xs = np.linspace(-2, 2, ngrid)
    ys = np.linspace(-2, 2, ngrid)
    X, Y = np.meshgrid(xs, ys)
    Z = np.zeros_like(X)
    coords = np.stack([X, Y, Z], axis=-1).reshape(-1, 3)

    ao_values = mol.eval_gto("GTOval_sph", coords)
    mo_values = np.dot(ao_values, mf.mo_coeff)

    images = []
    for i in range(min(num_orbitals, mo_values.shape[1])):
        grid = mo_values[:, i].reshape(ngrid, ngrid)
        fig, ax = plt.subplots()
        im = ax.imshow(
            grid,
            extent=[xs.min(), xs.max(), ys.min(), ys.max()],
            origin="lower",
            cmap="coolwarm",
        )
        ax.set_title(f"Orbital {i+1}")
        plt.colorbar(im, ax=ax)
        buf = io.BytesIO()
        plt.savefig(buf, format="png")
        buf.seek(0)
        images.append(base64.b64encode(buf.read()).decode("ascii"))
        plt.close(fig)

    return images


@app.route("/api/pyscf", methods=["POST"])
def run_pyscf():
    """Runs a background HF calculation and returns base64-encoded orbital images."""
    data = request.json
    atom_spec = data.get("molecule", "")

    try:
        images = generate_orbital_images(atom_spec)
        return jsonify({"images": images})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # You can adjust debug=True or port as desired.
    app.run(debug=True, host="0.0.0.0", port=8000)
