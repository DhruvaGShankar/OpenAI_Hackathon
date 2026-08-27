const app = document.querySelector("#app");
let current = "landing";
let model = null;
let selectedPlan = [];

const navItems = [
  ["passport", "badge", "Passport"],
  ["record", "library_books", "Academic Record"],
  ["need", "task_alt", "What I Need"],
  ["ask", "psychology", "Ask My Record"],
  ["planning", "route", "Academic Planning"],
];

const api = async (path, options = {}) => {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json();
};

function icon(name, fill = false) {
  return `<span class="material-symbols-outlined ${fill ? "icon-fill" : ""}">${name}</span>`;
}

function brand() {
  return `<a class="brand" data-go="landing"><span class="brand-mark">${icon("school")}</span><span>ABC Student Passport</span></a>`;
}

function nav() {
  const items = navItems.map(([id, symbol, label]) => `
    <button class="nav-item ${current === id ? "active" : ""}" data-go="${id}">
      ${icon(symbol, current === id)}
      <span>${label}</span>
    </button>
  `).join("");

  return `
    <aside class="sidebar">
      ${brand()}
      <button class="sidebar-action" data-go="passport">${icon("verified_user")} View Demo Passport</button>
      <div class="nav-group">${items}</div>
      <div class="sidebar-foot">
        Prototype experience<br />
        All student information is synthetic.<br />
        Not affiliated with any government body.
      </div>
    </aside>
    <nav class="mobile-nav">
      ${navItems.map(([id, symbol, label]) => `
        <button class="nav-item ${current === id ? "active" : ""}" data-go="${id}">
          ${icon(symbol, current === id)}
          <span>${label.replace("Academic ", "").replace("My ", "")}</span>
        </button>
      `).join("")}
    </nav>`;
}

function shell(content, title, desc) {
  return `
    <div class="app-shell">
      ${nav()}
      <main class="main">
        <header class="topbar">
          <div class="topbar-title">ABC Passport</div>
          <div class="topbar-actions">
            <button class="icon-button" title="Notifications">${icon("notifications")}</button>
            <button class="icon-button" title="Record status">${icon("verified_user")}</button>
            <div class="profile-mini"><span>${model.student.name}</span><div class="avatar">AS</div></div>
          </div>
        </header>
        <div class="content">
          <div class="page-head">
            <div>
              <div class="overline">Synthetic academic passport</div>
              <h1>${title}</h1>
              <p>${desc}</p>
            </div>
            ${current === "passport" ? `<span class="status">${model.student.status}</span>` : ""}
          </div>
          ${content}
        </div>
      </main>
    </div>
    <div class="toast" id="toast"></div>`;
}

function landing() {
  return `
    <section class="landing">
      <nav class="landing-nav">
        ${brand()}
        <span class="prototype-chip">Prototype - synthetic data only</span>
      </nav>
      <main class="hero">
        <div class="hero-copy">
          <div class="eyebrow">Your academic journey, made useful</div>
          <h1>ABC Student Passport</h1>
          <p>Turn a student's academic record into a clear, personal view of degree progress, remaining requirements, and next best courses.</p>
          <div class="hero-actions">
            <button class="button" data-go="passport">Try Demo ${icon("arrow_forward")}</button>
            <button class="button secondary" data-go="record">View Record</button>
          </div>
          <span class="microcopy">A visual prototype using fictional student data. Not affiliated with, endorsed by, or connected to any government service.</span>
        </div>
        <div class="preview-stage">
          <div class="preview-grid">
            <div class="mini-card">
              <div class="preview-id">
                <div>
                  <div class="avatar photo">AS</div>
                  <h3>${model.student.name}</h3>
                  <p>${model.student.degree} - ${model.student.year}</p>
                </div>
                <span class="status">${model.student.status}</span>
              </div>
              <div class="stat-grid">
                <div class="stat"><small>Credits</small><b>${model.student.earned}</b></div>
                <div class="stat"><small>CGPA</small><b>${model.student.cgpa}</b></div>
              </div>
            </div>
            <div class="mini-card">
              <div class="overline">Degree progress</div>
              <h3>${model.student.earned} / ${model.student.total} credits</h3>
              <p>${model.student.remaining} credits remaining across capstone, electives, internship, and humanities.</p>
              <div class="stat-grid">
                <div class="stat"><small>Target</small><b>May 2027</b></div>
                <div class="stat"><small>Year</small><b>3rd</b></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>`;
}

function passport() {
  const categories = model.categories.map((c) => `
    <div class="category-line">
      <span>${c.name}</span>
      <div class="meter ${c.tone}"><b style="width:${Math.round((c.earned / c.total) * 100)}%"></b></div>
      <span class="number">${c.earned}/${c.total}</span>
    </div>`).join("");

  return shell(`
    <div class="grid dashboard-grid">
      <section class="card credit-card">
        <div>
          <h2>Degree progress</h2>
          <p class="card-desc">${model.student.degree} - ${model.student.year}</p>
        </div>
        <div class="credits-summary">
          <div class="ring"><div class="ring-text"><b>${model.student.earned}</b><span>of ${model.student.total} credits</span></div></div>
          <div>
            <div class="large-label">${model.student.percent}% complete</div>
            <p class="large-copy">You are pacing well for a May 2027 graduation. Keep your final-year project and open elective on your radar.</p>
            <button class="link" data-go="need">See what remains ${icon("arrow_forward")}</button>
          </div>
        </div>
      </section>
      <section class="card">
        <h2>Credits by category</h2>
        <p class="card-desc">A quick scan of where your completed credits sit.</p>
        <div class="category-list">${categories}</div>
      </section>
      <section class="card">
        <h2>Missing requirements</h2>
        <p class="card-desc">The highest-impact gaps to plan next.</p>
        ${model.requirements.slice(0, 3).map((r) => `
          <div class="requirement">
            <div class="req-icon">${icon(r.icon)}</div>
            <div><b>${r.title}</b><p>${r.credits} credits - ${r.when}</p></div>
          </div>`).join("")}
        <button class="link" data-go="need">View all requirements ${icon("arrow_forward")}</button>
      </section>
      <section class="card">
        <h2>Recent academic activity</h2>
        ${model.activity.map((a) => `
          <div class="activity-row">
            <span class="activity-date">${a.date}</span>
            <div><b>${a.title}</b><p>${a.detail}</p></div>
          </div>`).join("")}
      </section>
    </div>`,
    "My Academic Passport",
    "A clear, student-friendly view of progress, status, and what matters next.");
}

function record() {
  return shell(`
    <section class="records">
      ${model.records.map((sem) => `
        <div class="semester">
          <div class="semester-header"><b>${sem.name}</b><span>${sem.credits} credits earned</span></div>
          ${sem.courses.map((course) => `
            <div class="course">
              <div><div class="course-code">${course.code}</div><strong>${course.name}</strong></div>
              <span class="pill ${course.tone} category">${course.category}</span>
              <span>${course.credits} cr</span>
              <span class="complete">${icon("check_circle", true)} Complete</span>
            </div>`).join("")}
        </div>`).join("")}
    </section>`,
    "Academic Record",
    "Your completed coursework, organised semester by semester.");
}

function need() {
  return shell(`
    <div class="grid need-grid">
      <section class="card">
        <h2>Your remaining requirements</h2>
        <p class="card-desc">${model.student.remaining} credits left. Each item below is required for the degree.</p>
        <div class="checklist">
          ${model.requirements.map((r) => `
            <div class="need">
              <div class="need-check">${icon("radio_button_unchecked")}</div>
              <div><b>${r.title}</b><p>${r.why}</p></div>
              <div class="need-meta">${r.credits} credits<br>${r.when}</div>
            </div>`).join("")}
        </div>
      </section>
      <aside class="side-note">
        <div class="overline">Graduation estimate</div>
        <h3>May 2027 looks achievable.</h3>
        <p>At about 14 credits per semester across the next two terms, Aarav can comfortably finish the remaining ${model.student.remaining} credits. The capstone should span both final-year semesters.</p>
        <button class="link" data-go="planning" style="margin-top:16px">Plan next term ${icon("arrow_forward")}</button>
      </aside>
    </div>`,
    "What I Need",
    "A practical checklist for finishing your degree with confidence.");
}

function ask() {
  return shell(`
    <div class="chat-layout">
      <div class="chat-intro">
        <div class="overline">Mocked record assistant</div>
        <h2>Ask anything about your record.</h2>
        <p>Answers below come from the prototype backend. In the finished product, they would be generated from the student's verified academic record.</p>
      </div>
      <div class="suggestions">
        ${model.suggestions.map((s) => `<button class="suggestion">${s}</button>`).join("")}
      </div>
      <div class="chat" id="chat">
        <div class="message ai">Hi Aarav - I can help you make sense of your academic record. Try one of the questions above.</div>
      </div>
      <div class="chat-input">
        <input id="question" aria-label="Ask about your record" placeholder="Ask about your academic record..." />
        <button id="send">Ask</button>
      </div>
    </div>`,
    "Ask My Record",
    "A conversational way to understand the academic data you already have.");
}

function planning() {
  return shell(`
    <div class="grid planning-grid">
      <section class="card">
        <h2>Recommended for your next term</h2>
        <p class="card-desc">These choices directly move remaining requirements forward.</p>
        <div style="margin-top:15px">
          ${model.planning.recommendations.map((course) => `
            <div class="recommendation">
              <div class="course-icon">${icon(course.icon)}</div>
              <div><b>${course.name}</b><p>${course.credits} credits - satisfies ${course.satisfies}. ${course.reason}</p></div>
              <button class="add-button" data-add="${course.name}" ${selectedPlan.includes(course.name) ? "disabled" : ""}>${selectedPlan.includes(course.name) ? "Added" : "Add to plan"}</button>
            </div>`).join("")}
        </div>
      </section>
      <aside class="card whatif">
        <h2>What if I take more?</h2>
        <p class="card-desc">See how a next-term load changes your path.</p>
        <div class="slider-row">
          <label><span>Next-term credits</span><span id="credit-value">${model.planning.defaultLoad} credits</span></label>
          <input id="credit-slider" type="range" min="8" max="22" value="${model.planning.defaultLoad}" />
        </div>
        <div class="whatif-result">
          <b id="result-date">On track for May 2027</b>
          <span id="result-copy">You will have ${model.student.remaining - model.planning.defaultLoad} credits remaining after next term, including your capstone.</span>
        </div>
      </aside>
    </div>`,
    "Academic Planning",
    "Build a course plan that closes the right gaps at the right time.");
}

async function bootstrap() {
  app.innerHTML = `<div class="loader">Loading student passport...</div>`;
  model = await api("/api/dashboard");
  render();
}

function render() {
  app.innerHTML = current === "landing" ? landing() : ({ passport, record, need, ask, planning }[current]());
  bind();
}

function bind() {
  document.querySelectorAll("[data-go]").forEach((element) => {
    element.addEventListener("click", () => {
      current = element.dataset.go;
      render();
      window.scrollTo(0, 0);
    });
  });

  document.querySelectorAll(".suggestion").forEach((element) => {
    element.addEventListener("click", () => askQuestion(element.textContent));
  });

  const send = document.querySelector("#send");
  if (send) {
    send.addEventListener("click", () => askQuestion(document.querySelector("#question").value));
    document.querySelector("#question").addEventListener("keydown", (event) => {
      if (event.key === "Enter") askQuestion(event.target.value);
    });
  }

  document.querySelectorAll("[data-add]").forEach((element) => {
    element.addEventListener("click", () => {
      const name = element.dataset.add;
      selectedPlan = [...new Set([...selectedPlan, name])];
      element.textContent = "Added";
      element.disabled = true;
      showToast(`${name} added to your draft plan`);
    });
  });

  const slider = document.querySelector("#credit-slider");
  if (slider) {
    slider.addEventListener("input", (event) => updateWhatIf(Number(event.target.value)));
  }
}

async function askQuestion(question) {
  if (!question.trim()) return;
  const chat = document.querySelector("#chat");
  chat.insertAdjacentHTML("beforeend", `<div class="message user">${escapeHtml(question)}</div>`);
  const input = document.querySelector("#question");
  input.value = "";
  const { answer } = await api("/api/chat", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
  chat.insertAdjacentHTML("beforeend", `<div class="message ai">${answer}</div>`);
  chat.lastElementChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function updateWhatIf(load) {
  const result = await api(`/api/what-if?load=${load}`);
  document.querySelector("#credit-value").textContent = `${load} credits`;
  document.querySelector("#result-date").textContent = result.status;
  document.querySelector("#result-copy").textContent = result.copy;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

bootstrap().catch((error) => {
  app.innerHTML = `<div class="loader">Could not load prototype data. Start the backend with <code>node server.js</code>.</div>`;
  console.error(error);
});
