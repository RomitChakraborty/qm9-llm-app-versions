# DoIHaveACase.com

This repository contains a minimal MVP for **DoIHaveACase.com**. It provides a FastAPI backend and a React frontend to score the merit of a potential legal claim based on provided facts and plaintiff persona metadata.

## Architecture

- **backend/** – FastAPI app with `/predict` endpoint
- **frontend/** – React + TypeScript client
- **docker-compose.yml** – development environment for both services
- **.github/workflows/ci.yml** – GitHub Actions for linting and tests

## Development

### Requirements
- Python 3.10+
- Node 18+
- Docker (optional but recommended)

### Running locally

```bash
# start backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

In another terminal:

```bash
# start frontend
cd frontend
npm install
npm run dev
```

Then open <http://localhost:3000>.

### Docker

```bash
docker-compose up --build
```

### Tests

```bash
pytest backend/tests
npm test --prefix frontend -- --watchAll=false
```

## Contributing

Pull requests are welcome. Ensure `pytest` and `npm test` pass before submitting.

## License

MIT
