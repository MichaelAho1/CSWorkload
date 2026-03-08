# CS Workload

A browser-based graduation planning tool for JMU Computer Science majors. It models your remaining coursework against prerequisite chains, difficulty weights, and preferred semester load — then outputs an optimized multi-semester schedule you can export. No backend, no install, just open and plan.

---

## Key Features

- **Prerequisite-aware scheduling** — the planner validates every generated plan against the full prerequisite graph and automatically reschedules conflicts across semesters
- **Difficulty balancing** — each class carries a numeric difficulty rating (1–10); the algorithm caps per-semester difficulty totals to prevent burnout-inducing schedules
- **Career path explorer** — maps four CS career tracks (Machine Learning, Game Development, Software Engineering, Cybersecurity) to their relevant JMU courses with live salary data per location
- **Real-time salary lookup** — integrates the JSearch RapidAPI to show estimated salary ranges (min/max) for each career path by metro area
- **Persistent state** — completed classes are stored in `localStorage`, so your progress survives page refreshes without any login or account
- **JSON export** — generates and downloads a structured `gradPlan.json` so you can save, share, or import your plan elsewhere

---

## Tech Stack

| Technology | Role |
|---|---|
| **Vanilla JavaScript (ES6)** | Core application logic — no framework overhead for a static, algorithmic tool |
| **Bootstrap 4.5** | Responsive grid and modal system; avoids writing boilerplate layout CSS |
| **jQuery 3.5** | DOM traversal and event handling for the class selection tables and modals |
| **Browser LocalStorage** | Zero-infrastructure persistence for completed classes across sessions |
| **Fetch API** | Native HTTP client for the salary estimation API call |
| **JSearch (RapidAPI)** | Provides real-world salary range data by job title and location |
| **VS Code Live Server** | Local development server on port 5501 — no build step required |

---

## Architecture

The app is three static HTML pages sharing a common stylesheet and a set of focused JavaScript modules. There is no build pipeline, bundler, or backend.

```
index.html          →  homePage.js           (career paths + salary API)
grad_planner.html   →  completedClasses.js   (class selection UI + localStorage)
                    →  planAlgorithim.js      (scheduling algorithm)
                    →  exportPlan.js          (JSON download)
class_desc.html     →  (static content)

classes.js          →  shared class data model (AllClasses map, difficulty ratings, prerequisites)
```

Data flows entirely client-side: the user's completed classes live in `localStorage`, the scheduling algorithm runs in-browser, and the only network call is the optional salary lookup on the home page.

---

## Getting Started

### Prerequisites

- A modern browser (Chrome, Firefox, Edge, Safari)
- [VS Code](https://code.visualstudio.com/) with the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension — **or** any static file server

### Run Locally

```bash
# Clone the repository
git clone https://github.com/MichaelAho1/CSWorkload.git
cd CSWorkload

# Open with VS Code Live Server
# Right-click index.html → "Open with Live Server"
# App opens at http://127.0.0.1:5501
```

Alternatively, serve with Python or Node:

```bash
# Python 3
python -m http.server 5501

# Node (npx)
npx serve . -l 5501
```

### API Key Setup

The salary lookup on the home page uses [JSearch via RapidAPI](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch).

1. Create a free account at [rapidapi.com](https://rapidapi.com)
2. Subscribe to the **JSearch** API (free tier available)
3. Copy your API key
4. Open `script/homePage.js` and replace the placeholder on line 8:

```js
'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY_HERE'
```

> **Note:** This is a frontend-only project with no build process. In a production setup, the API key should be proxied through a backend service or environment variable to avoid exposure in client-side code.

---

## Screenshots

### Home Page — Career Paths & Salary Lookup
![Home Page](img/screenshot-home.png)

### Graduation Planner — Class Selection
![Graduation Planner](img/screenshot-planner.png)

### Generated Schedule
![Generated Schedule](img/screenshot-schedule.png)

> _Screenshots above are placeholders. Run the app locally to see the live UI._

---

## API Reference

### JSearch — Estimated Salary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `https://jsearch.p.rapidapi.com/estimated-salary` | Returns estimated salary range for a job title and location |

**Query Parameters**

| Parameter | Value | Description |
|-----------|-------|-------------|
| `job_title` | e.g. `"Machine Learning"` | Career track to look up |
| `location` | e.g. `"San Francisco"` | Target metro area |
| `location_type` | `"ANY"` | Location matching strategy |
| `years_of_experience` | `"LESS_THAN_ONE"` | Experience filter |

**Response shape used by the app:**

```json
{
  "data": [
    {
      "min_salary": 80000,
      "max_salary": 150000
    }
  ]
}
```

---

## Engineering Notes

The core challenge in this project was building a scheduler that respects an arbitrary prerequisite DAG while also honoring user constraints (semester count, classes per semester) and difficulty limits. A naive topological sort produces a valid ordering but ignores load balancing — so the algorithm runs in three passes: priority sort, greedy bin-packing by difficulty, then a prerequisite-conflict repair pass that scans each generated semester and pushes violating courses forward. This repair loop can create new semesters beyond the user's target, which is surfaced to the user rather than silently discarded.

---

## Contact

**Michael Aho**
- GitHub: [@MichaelAho1](https://github.com/MichaelAho1)
- LinkedIn: [linkedin.com/in/michaelaho](https://linkedin.com/in/michaelaho)
- Portfolio: _Coming soon_
