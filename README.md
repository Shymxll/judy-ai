## Project Story

### 🎯 About the Project  
**Judy** is a “societal AI prosecutor” designed to bring justice to everyday micro‑disputes that courts or official bodies can’t prioritize. Judy collects both parties’ claims, evidence, and demands; fills in gaps with intelligent follow‑up questions; delivers a fair verdict; and drafts a new community law to prevent similar conflicts.

---

### 💡 Source of Inspiration  
- While having a small argument with my partner, I realized it wasn’t worth taking to court—but still deserved a fair resolution.  
- Talking with law students at university, we noticed “minor” cases have no formal venue.  
- Watching simple disagreements on social platforms spiral into long disputes sparked the idea for a fast, objective solution.  
- Our vision “justice for everyone, at every level” motivated us to bring this project to life.

---

### 📚 What We Learned  
1. **NLP & Dialogue Management:** Explored how to adapt GPT‑4’s dynamic Q&A capabilities to real legal scenarios.  
2. **Data Modeling:** Overcame challenges in designing a consistent, queryable format for evidence and timelines.  
3. **Product Processes:** Experienced the importance of rapid prototyping, MVP‑focused development, and gathering user feedback in a hackathon setting.

---

### 🛠️ How We Built It  
1. **Rapid Design Workshop:** Mapped user flows and scenarios to define the core experience.  
2. **API & Database:** Implemented basic CRUD operations with Node.js + Express and designed the case schema in PostgreSQL.  
3. **AI Integration:** Developed prototypes of the “question module” and “decision engine” by connecting Python to the OpenAI GPT‑4 API.  
4. **UI Development:** Created user‑friendly submission and result pages using React + Tailwind CSS.  
5. **Testing & Refinement:** Tested with real case examples and refined question accuracy and decision pipeline consistency.

---

### ⚔️ Challenges We Faced  
- **Missing & Conflicting Information:** Parties sometimes provided contradictory dates or documents, requiring us to expand the scope of follow‑up questions.  
- **Formulating Justice Criteria:** Translating legal principles into quantifiable algorithmic rules for “fairness” was complex.  
- **Performance & Scale:** To minimize latency during the hackathon, we implemented caching and preprocessing strategies for OpenAI calls.

---

### 🚀 Next Steps  
- **User Testing:** Plan pilot trials with real users to gather feedback.  
- **Multi‑Language Support:** Add language options for international deployment.  
- **Legal Advisory Integration:** Strengthen law proposals with lawyer‑approved templates.

> “Justice should be accessible not only for major cases but for every claim and right.”  
