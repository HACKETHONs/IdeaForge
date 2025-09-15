# 🚀 SIH 2025 IdeaForge Backend

Welcome to the official backend for the SIH 2025 IdeaForge platform. This project enables innovation teams, mentors, and investors to manage ideas, match resources, and collaborate efficiently—all via a modern FastAPI-based REST API.

---

## ✨ Features

- User, Idea, Mentor, and Investor management APIs
- Idea submission and automated scoring (AI)
- Mentor matching based on expertise/tags
- Investor dashboard: browse, rate, and review ideas
- Full CRUD support and swap-friendly database layer (SQLite)
- Auto-generated Swagger docs for testing

---

## 📦 Technologies

- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- Python 3.8+
- (Google GenerativeAI for idea scoring)
- Other dependencies (see `requirements.txt`)

---

## 💻 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Clone and Install

git clone 


### Run the App (Development)

uvicorn app:app --reload


Go to [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) for the Swagger UI.

---

## 📝 Major API Endpoints

- `POST /submit-idea` — Submit a new idea
- `GET /ideas` — List all ideas
- `POST /create-mentor` — Add a mentor
- `GET /mentors` — Get all mentors
- `POST /create-investor` — Add an investor
- `GET /investors` — List investors
- `POST /ideas/{idea_id}/review` — Submit investor feedback on an idea
- `GET /ideas/{idea_id}/reviews` — List all reviews for an idea
- `GET /investor-dashboard` — Browse/filter ideas for investors
- `GET /match-mentors/{idea_id}` — Get best mentor matches for an idea

For a full list, see the Swagger UI docs.

---

## 🧑‍💻 Contributing

1. Fork this repo
2. Create a branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to your fork (`git push origin feature/my-feature`)
5. Open a Pull Request and describe your contribution

---

## ⚖️ License

This project is MIT Licensed. See `LICENSE` for details.

---

## 🙋 Authors & Credits

- Atharva (project & backend lead)
- pavan (Api Layering & Testing )
- FastAPI community, RealPython, and open-source contributors

---

## 📮 Support / Contact

- Email - kalhatkaratharva01@hmail.com