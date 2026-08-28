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
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  return `
    <div class="app-shell">
      ${nav()}
      <main class="main">
        <header class="topbar">
          <div class="topbar-title">ABC Passport</div>
          <div class="topbar-actions">
            <button class="icon-button" title="Notifications">${icon("notifications")}</button>
            <button class="icon-button" title="Record status">${icon("verified_user")}</button>
            ${isLoggedIn 
              ? `<button class="icon-button" id="logout-btn" title="Log Out">${icon("logout")}</button>`
              : `<button class="button secondary" data-go="login" style="min-height:36px; padding:0 12px; font-size:12px">${icon("login")} Login</button>`
            }
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

function login() {
  const studentName = model ? model.student.name : "Aarav Sharma";
  const studentId = model ? model.student.id : "SYN-2023-AIML-045";
  const degree = model ? model.student.degree : "B.E. AI & ML";

  return `
    <div class="login-wrapper">
      <div class="login-card">
        <div class="brand-mark" style="margin: 0 auto 16px; width:44px; height:44px;">${icon("school")}</div>
        <h2>Student Login</h2>
        <p class="login-desc">Sign in with your student credentials to access your passport.</p>
        
        <div class="quick-user-box">
          <div class="avatar photo">AS</div>
          <div>
            <b style="font-size:15px; color:var(--ink);">${studentName}</b>
            <small>${studentId} • ${degree}</small>
          </div>
        </div>

        <form id="login-form" class="login-form">
          <div class="form-group">
            <label>Student ID</label>
            <input type="text" id="login-id" value="${studentId}" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="login-pass" value="demo123" required />
          </div>
          <button type="submit" class="button" style="width:100%; justify-content:center; margin-top:6px;">
            Sign In ${icon("arrow_forward")}
          </button>
        </form>
        
        <button class="link" data-go="landing" style="margin-top:20px; font-size:13px; border:0; background:none; color:var(--muted); cursor:pointer;">${icon("arrow_back")} Return to Home</button>
      </div>
    </div>
    <div class="toast" id="toast"></div>`;
}

function landing() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  return `
    <section class="landing">
      <nav class="landing-nav">
        ${brand()}
        <div style="display:flex; align-items:center; gap:10px;">
          ${isLoggedIn 
            ? `<button class="button secondary" data-go="passport">${icon("badge")} View Passport</button>`
            : `<button class="button secondary" data-go="login">${icon("login")} Login</button>`
          }
          <span class="prototype-chip">Prototype</span>
        </div>
      </nav>
      <main class="hero">
        <div class="hero-copy">
          <div class="eyebrow">Your academic journey, made useful</div>
          <h1>ABC Student Passport</h1>
          <p>Turn a student's academic record into a clear, personal view of degree progress, remaining requirements, and next best courses.</p>
          <div class="hero-actions">
            ${isLoggedIn
              ? `<button class="button" data-go="passport">View Demo ${icon("arrow_forward")}</button>`
              : `<button class="button" data-go="login">Login ${icon("arrow_forward")}</button>`
            }
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
              <button class="add-button ${selectedPlan.includes(course.name) ? 'remove-state' : ''}" data-add="${course.name}">${selectedPlan.includes(course.name) ? "Remove" : "Add to plan"}</button>
            </div>`).join("")}
        </div>
      </section>
      <aside class="card whatif">
        <h2>What if I take more?</h2>
        <p class="card-desc">See how a next-term load changes your path.</p>
        
        <div class="whatif-details">
           <div style="display:flex; justify-content: space-between;"><span>Projected Earned:</span> <b id="projected-earned">...</b></div>
           <div style="display:flex; justify-content: space-between;"><span>Projected Remaining:</span> <b id="projected-remaining">...</b></div>
           <ul id="dynamic-req-list" class="dynamic-req-list"></ul>
        </div>

        <div class="slider-row">
          <label><span>Next-term credits</span><span id="credit-value">${model.planning.defaultLoad} credits</span></label>
          <input id="credit-slider" type="range" min="8" max="22" value="${model.planning.defaultLoad}" />
        </div>
        <div class="whatif-result">
          <b id="result-date">On track for May 2027</b>
          <span id="result-copy"></span>
        </div>
      </aside>
    </div>`,
    "Academic Planning",
    "Build a course plan that closes the right gaps at the right time.");
}

async function bootstrap() {
  app.innerHTML = `<div class="loader">Loading student passport...</div>`;
  model = await api("/api/dashboard");
  try {
    const stored = JSON.parse(localStorage.getItem("selectedPlan") || "[]");
    const validNames = new Set(model.planning.recommendations.map(r => r.name));
    selectedPlan = stored.filter(name => validNames.has(name));
  } catch (e) {
    selectedPlan = [];
  }
  render();
}

function doQuickLogin() {
  sessionStorage.setItem("isLoggedIn", "true");
  current = "passport";
  render();
  window.scrollTo(0, 0);
  showToast(`Welcome back, ${model ? model.student.name : "Aarav"}!`);
}

function render() {
  if (current === "login") {
    app.innerHTML = login();
  } else if (current === "landing") {
    app.innerHTML = landing();
  } else {
    app.innerHTML = ({ passport, record, need, ask, planning }[current]());
  }
  bind();
  if (current === "planning") {
    updateWhatIf();
  }
}

function bind() {
  document.querySelectorAll("[data-go]").forEach((element) => {
    element.addEventListener("click", () => {
      current = element.dataset.go;
      render();
      window.scrollTo(0, 0);
    });
  });

  const instantBtn = document.querySelector("#instant-login-btn");
  if (instantBtn) {
    instantBtn.addEventListener("click", () => doQuickLogin());
  }

  const loginForm = document.querySelector("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      doQuickLogin();
    });
  }

  const logoutBtn = document.querySelector("#logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("isLoggedIn");
      showToast("Logged out successfully");
      current = "landing";
      render();
    });
  }

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
      if (selectedPlan.includes(name)) {
        selectedPlan = selectedPlan.filter(n => n !== name);
        element.textContent = "Add to plan";
        element.classList.remove("remove-state");
        showToast(`${name} removed from your draft plan`);
      } else {
        selectedPlan = [...new Set([...selectedPlan, name])];
        element.textContent = "Remove";
        element.classList.add("remove-state");
        showToast(`${name} added to your draft plan`);
      }
      localStorage.setItem("selectedPlan", JSON.stringify(selectedPlan));
      updateWhatIf();
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
  const sendButton = document.querySelector("#send");
  
  input.value = "";
  input.disabled = true;
  if (sendButton) sendButton.disabled = true;

  chat.insertAdjacentHTML("beforeend", `<div class="message ai typing-indicator" id="typing-indicator"><span></span><span></span><span></span></div>`);
  chat.lastElementChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
  
  let aiBubble = null;
  let accumulatedText = "";
  let renderTimeout = null;

  function safeScroll() {
    // Only auto-scroll if the user is near the bottom
    const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 150;
    if (isAtBottom && chat.lastElementChild) {
      chat.lastElementChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function flushRender() {
    if (renderTimeout) clearTimeout(renderTimeout);
    if (aiBubble) {
      aiBubble.innerHTML = DOMPurify.sanitize(marked.parse(accumulatedText));
      safeScroll();
    }
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      if (!chunk) continue;
      
      if (!aiBubble) {
        const typing = document.querySelector("#typing-indicator");
        if (typing) typing.remove();
        
        chat.insertAdjacentHTML("beforeend", `<div class="message ai"></div>`);
        aiBubble = chat.lastElementChild;
      }
      
      accumulatedText += chunk;

      if (!renderTimeout) {
        renderTimeout = setTimeout(() => {
          aiBubble.innerHTML = DOMPurify.sanitize(marked.parse(accumulatedText));
          safeScroll();
          renderTimeout = null;
        }, 50);
      }
    }
    
    const finalChunk = decoder.decode();
    if (finalChunk) accumulatedText += finalChunk;
    flushRender();

  } catch (error) {
    console.error("Chat Error:", error);
    const typing = document.querySelector("#typing-indicator");
    if (typing) typing.remove();
    
    if (!aiBubble) {
      chat.insertAdjacentHTML("beforeend", `<div class="message ai"></div>`);
      aiBubble = chat.lastElementChild;
    }
    
    if (!accumulatedText.trim()) {
       aiBubble.innerHTML = "Your record assistant is temporarily unavailable. Please try again.";
    } else {
       aiBubble.innerHTML = DOMPurify.sanitize(marked.parse(accumulatedText + "\n\n*(Connection interrupted)*"));
    }
    chat.lastElementChild.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } finally {
    input.disabled = false;
    if (sendButton) sendButton.disabled = false;
    input.focus();
  }
}

function updateWhatIf(sliderValue) {
  const plannedCourses = selectedPlan
    .map(name => model.planning.recommendations.find(r => r.name === name))
    .filter(Boolean);
  
  const explicitlyPlannedCredits = plannedCourses.reduce((sum, c) => sum + c.credits, 0);
  let currentSliderMin = Math.max(8, explicitlyPlannedCredits);
  
  const slider = document.querySelector("#credit-slider");
  if (slider) {
    slider.min = currentSliderMin;
    if (Number(slider.value) < currentSliderMin) {
      slider.value = currentSliderMin;
      sliderValue = currentSliderMin;
    } else if (sliderValue === undefined) {
      sliderValue = Number(slider.value);
    }
  } else {
    sliderValue = Math.max(currentSliderMin, sliderValue || model.planning.defaultLoad);
  }

  const hypotheticalCredits = Math.max(0, sliderValue - explicitlyPlannedCredits);
  const totalProjectedCredits = explicitlyPlannedCredits + hypotheticalCredits;

  const projectedEarned = model.student.earned + totalProjectedCredits;
  const projectedRemaining = Math.max(0, model.student.remaining - totalProjectedCredits);

  const reqDeductions = {};
  plannedCourses.forEach(c => {
    if (c.satisfiesRequirementId) {
      reqDeductions[c.satisfiesRequirementId] = (reqDeductions[c.satisfiesRequirementId] || 0) + c.credits;
    }
  });

  const aheadOfPace = (projectedRemaining / 2) <= 14;
  const dateText = aheadOfPace ? "May 2027 looks achievable" : "On track for May 2027";
  
  let copyText = `You will have ${projectedRemaining} credits remaining after next term`;
  if (explicitlyPlannedCredits > 0 || hypotheticalCredits > 0) {
     copyText += ` (including ${explicitlyPlannedCredits} selected`;
     if (hypotheticalCredits > 0) {
        copyText += ` and ${hypotheticalCredits} hypothetical additional`;
     }
     copyText += ` credits).`;
  } else {
     copyText += `.`;
  }

  if (document.querySelector("#credit-value")) document.querySelector("#credit-value").textContent = `${sliderValue} credits`;
  if (document.querySelector("#result-date")) document.querySelector("#result-date").textContent = dateText;
  if (document.querySelector("#result-copy")) document.querySelector("#result-copy").textContent = copyText;
  
  const reqList = document.querySelector("#dynamic-req-list");
  if (reqList) {
    reqList.innerHTML = model.requirements.map(req => {
      const deduction = reqDeductions[req.title] || 0;
      const projReqRem = Math.max(0, req.credits - deduction);
      if (deduction > 0) {
        return `<li><b>${req.title}</b>: ${projReqRem} remaining (${deduction} planned)</li>`;
      }
      return "";
    }).join("");
  }
  
  const totalProj = document.querySelector("#projected-earned");
  if (totalProj) totalProj.textContent = projectedEarned;
  
  const remProj = document.querySelector("#projected-remaining");
  if (remProj) remProj.textContent = projectedRemaining;
}

function showToast(message) {
  let toast = document.querySelector("#toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
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
