# SmartDoc - Intelligent PDF Assistant 🤖📄

SmartDoc is an AI-powered web application that allows users to upload PDF documents and interact with them using natural language queries. It intelligently reads, parses, and extracts information from PDF files to answer user questions accurately and efficiently.

---

## 🛠️ Tech Stack

- **Frontend**: Angular
- **Backend**: Python (FastAPI) & Node.js
- **AI Models**: OpenAI / Anthropic Claude (for intelligent document Q&A)
- **Database**: Optional (e.g., for storing uploaded files or chat history)
- **PDF Parsing**: PyMuPDF, LangChain

---

## 🌐 Frontend (React)

The frontend allows users to:

- Upload PDF documents
- Enter natural language questions
- View chat-style answers powered by the backend
- Handle file previews and loading indicators

### Frontend Setup:

```bash
cd smart-doc-frontend
npm install
npm start
