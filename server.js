const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 4174;
const root = __dirname;

const dashboard = {
  student: {
    name: "Aarav Sharma",
    id: "SYN-2023-AIML-045",
    degree: "B.E. Artificial Intelligence & Machine Learning",
    year: "3rd Year",
    earned: 96,
    total: 124,
    remaining: 28,
    percent: 77,
    status: "On track",
    cgpa: "8.47",
  },
  categories: [
    { name: "Programme core", earned: 46, total: 52, tone: "" },
    { name: "Core engineering", earned: 23, total: 25, tone: "blue" },
    { name: "Foundation", earned: 12, total: 14, tone: "green" },
    { name: "Open electives", earned: 9, total: 18, tone: "orange" },
  ],
  requirements: [
    {
      title: "Final-year capstone project",
      credits: 8,
      when: "Sem 7-8",
      icon: "rocket_launch",
      why: "Build and present a substantial applied AI/ML project. It demonstrates that you can turn classroom learning into real-world problem solving.",
    },
    {
      title: "Advanced AI/ML electives",
      credits: 9,
      when: "Sem 6-8",
      icon: "neurology",
      why: "Complete two approved electives to deepen a specialist area before graduation.",
    },
    {
      title: "Industry internship",
      credits: 4,
      when: "Summer",
      icon: "work",
      why: "Gain supervised industry exposure and reflect on how your skills apply outside the classroom.",
    },
    {
      title: "Humanities & social science",
      credits: 4,
      when: "Sem 6",
      icon: "forum",
      why: "Build context, judgement, and communication beyond technical work.",
    },
    {
      title: "Open elective",
      credits: 3,
      when: "Sem 6-7",
      icon: "explore",
      why: "Explore a discipline outside your programme, such as product, economics, design, or another approved domain.",
    },
  ],
  activity: [
    { date: "MAY 18", title: "Deep Learning marked complete", detail: "4 programme-core credits added" },
    { date: "MAY 16", title: "Semester 4 record updated", detail: "CGPA now 8.47" },
    { date: "APR 02", title: "Professional Ethics completed", detail: "2 foundation credits added" },
  ],
  records: [
    {
      name: "Semester 1 - Aug-Dec 2023",
      credits: 13,
      courses: [
        { code: "MA101", name: "Calculus & Linear Algebra", category: "Core engineering", credits: 4, tone: "core" },
        { code: "CS101", name: "Programming for Problem Solving", category: "Core engineering", credits: 4, tone: "core" },
        { code: "EE105", name: "Basic Electrical Engineering", category: "Core engineering", credits: 3, tone: "core" },
        { code: "HS101", name: "Communication Skills", category: "Foundation", credits: 2, tone: "foundation" },
      ],
    },
    {
      name: "Semester 2 - Jan-May 2024",
      credits: 13,
      courses: [
        { code: "MA102", name: "Probability & Statistics", category: "Core engineering", credits: 4, tone: "core" },
        { code: "CS112", name: "Data Structures", category: "Core engineering", credits: 4, tone: "core" },
        { code: "AI110", name: "Introduction to AI", category: "Programme core", credits: 3, tone: "" },
        { code: "EVS100", name: "Environmental Studies", category: "Foundation", credits: 2, tone: "foundation" },
      ],
    },
    {
      name: "Semester 3 - Aug-Dec 2024",
      credits: 14,
      courses: [
        { code: "CS201", name: "Database Management Systems", category: "Programme core", credits: 4, tone: "" },
        { code: "AI202", name: "Machine Learning Foundations", category: "Programme core", credits: 4, tone: "" },
        { code: "CS220", name: "Computer Networks", category: "Core engineering", credits: 3, tone: "core" },
        { code: "OE201", name: "Design Thinking", category: "Open elective", credits: 3, tone: "elective" },
      ],
    },
    {
      name: "Semester 4 - Jan-May 2025",
      credits: 12,
      courses: [
        { code: "AI251", name: "Deep Learning", category: "Programme core", credits: 4, tone: "" },
        { code: "CS231", name: "Operating Systems", category: "Core engineering", credits: 4, tone: "core" },
        { code: "AI240", name: "Data Analytics Lab", category: "Programme core", credits: 2, tone: "" },
        { code: "HS220", name: "Professional Ethics", category: "Foundation", credits: 2, tone: "foundation" },
      ],
    },
  ],
  suggestions: [
    "Can I graduate next year?",
    "What credits am I missing?",
    "What should I take next?",
  ],
  planning: {
    defaultLoad: 14,
    recommendations: [
      { name: "Natural Language Processing", credits: 4, satisfies: "Advanced AI/ML elective", reason: "It also supports a language-AI capstone direction.", icon: "record_voice_over" },
      { name: "Cloud Computing", credits: 3, satisfies: "Open elective", reason: "It gives practical deployment context for AI systems.", icon: "cloud" },
      { name: "Technology, Society & Policy", credits: 4, satisfies: "Humanities & social science", reason: "It strengthens judgement around real-world technical decisions.", icon: "policy" },
      { name: "Applied Reinforcement Learning", credits: 4, satisfies: "Advanced AI/ML elective", reason: "It builds depth for robotics, optimisation, and gaming use cases.", icon: "psychology_alt" },
    ],
  },
};

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function sendJson(response, body, status = 200) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function handleApi(request, response, url) {
  if (request.method === "GET" && url.pathname === "/api/dashboard") {
    sendJson(response, dashboard);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/what-if") {
    const load = Math.max(8, Math.min(22, Number(url.searchParams.get("load")) || dashboard.planning.defaultLoad));
    const remaining = Math.max(0, dashboard.student.remaining - load);
    const ahead = load >= 16;
    sendJson(response, {
      load,
      status: ahead ? "Ahead of pace for May 2027" : "On track for May 2027",
      copy: ahead
        ? `You could leave ${remaining} credits after next term and create more room for the capstone.`
        : `You will have ${remaining} credits remaining after next term, including your capstone.`,
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/chat") {
    let body = "";
    request.on("data", (chunk) => { body += chunk; });
    request.on("end", () => {
      const parsed = JSON.parse(body || "{}");
      const question = String(parsed.question || "").toLowerCase();
      let answer = "For your next term, prioritise Natural Language Processing, Cloud Computing, and Technology, Society & Policy. Together they earn 11 credits and satisfy three different remaining requirements.";
      if (question.includes("graduate")) {
        answer = "Yes. Based on 96 completed credits, Aarav needs 28 more. Completing about 14 credits in each of the next two terms keeps him on track for May 2027, alongside the capstone.";
      } else if (question.includes("missing") || question.includes("credit")) {
        answer = "Aarav has 28 credits remaining: 8 capstone credits, 9 advanced AI/ML elective credits, 4 internship credits, 4 humanities credits, and 3 open-elective credits.";
      }
      sendJson(response, { answer });
    });
    return;
  }

  sendJson(response, { error: "Not found" }, 404);
}

function serveStatic(response, url) {
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.normalize(path.join(root, requestedPath));
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    response.end(content);
  });
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname.startsWith("/api/")) {
    handleApi(request, response, url);
  } else {
    serveStatic(response, url);
  }
});

server.listen(port, () => {
  console.log(`ABC Student Passport prototype running at http://localhost:${port}`);
});
