/* Major Match — data layer
 * Scalable by design: add more questions to QUESTIONS and more majors to MAJORS.
 * Each question is a Likert statement tagged with trait weights (w).
 * Each major is a vector (vec) over the same trait keys.
 * Trait keys: analytical, creative, social, investigative, building, enterprising, nature, tech
 */

const TRAITS = {
  analytical:    { label: "Analytical",    blurb: "logic, numbers, problem-solving" },
  creative:      { label: "Creative",      blurb: "design, art, expression" },
  social:        { label: "People-first",  blurb: "helping, teaching, communicating" },
  investigative: { label: "Curious",       blurb: "research, science, asking why" },
  building:      { label: "Hands-on",      blurb: "making, fixing, building" },
  enterprising:  { label: "Driven",        blurb: "leading, business, persuading" },
  nature:        { label: "Nature-loving", blurb: "environment, living things" },
  tech:          { label: "Tech-minded",   blurb: "computers, AI, digital tools" },
};

/* 18 statements. Add more freely — scoring auto-scales. */
const QUESTIONS = [
  { id: "q1",  text: "I like figuring out why things work the way they do.", w: { investigative: 2, analytical: 1 } },
  { id: "q2",  text: "I'd rather build or fix something with my hands than just read about it.", w: { building: 2 } },
  { id: "q3",  text: "Sketching, designing, or making art energizes me.", w: { creative: 2 } },
  { id: "q4",  text: "Helping a friend through a tough time feels really rewarding.", w: { social: 2 } },
  { id: "q5",  text: "I enjoy solving puzzles, riddles, or tricky math problems.", w: { analytical: 2 } },
  { id: "q6",  text: "I'm curious about how apps, computers, and AI actually work.", w: { tech: 2, investigative: 1 } },
  { id: "q7",  text: "I like being in charge and organizing people toward a goal.", w: { enterprising: 2, social: 1 } },
  { id: "q8",  text: "Being outdoors or learning about nature excites me.", w: { nature: 2 } },
  { id: "q9",  text: "I notice patterns in data, numbers, or trends quickly.", w: { analytical: 2, tech: 1 } },
  { id: "q10", text: "I'd love to start my own business or product someday.", w: { enterprising: 2 } },
  { id: "q11", text: "Writing, storytelling, or making videos is fun for me.", w: { creative: 2, social: 1 } },
  { id: "q12", text: "I care a lot about protecting the environment.", w: { nature: 2, social: 1 } },
  { id: "q13", text: "I like running experiments to test my own ideas.", w: { investigative: 2, building: 1 } },
  { id: "q14", text: "Explaining things so other people 'get it' comes naturally to me.", w: { social: 2 } },
  { id: "q15", text: "I'm fascinated by living things — the body, animals, plants.", w: { investigative: 2, nature: 1 } },
  { id: "q16", text: "Coding, or the idea of teaching a computer to do things, appeals to me.", w: { tech: 2, analytical: 1 } },
  { id: "q17", text: "How something looks and feels — its design — really matters to me.", w: { creative: 2, building: 1 } },
  { id: "q18", text: "I'm good at convincing people and debating ideas.", w: { enterprising: 2, social: 1 } },
];

/* Majors. Each has a trait vector (1–3), a one-liner, careers, free resources, role models.
 * Salaries are approximate U.S. medians for context, not promises.
 * `tone` picks one of the badge color tints defined in CSS (a–f). */
const MAJORS = [
  {
    id: "cs",
    name: "Computer Science",
    tone: "a",
    vec: { tech: 3, analytical: 3, investigative: 1 },
    tagline: "Design software, algorithms, and the AI systems shaping the future.",
    careers: [
      { title: "Software Engineer", pay: "$120k" },
      { title: "Machine Learning Engineer", pay: "$150k" },
      { title: "Game Developer", pay: "$95k" },
    ],
    resources: [
      { name: "CS50: Intro to Computer Science", org: "Harvard / edX", url: "https://cs50.harvard.edu/x/" },
      { name: "freeCodeCamp", org: "Full-stack, free", url: "https://www.freecodecamp.org/" },
      { name: "Python for Everybody", org: "Coursera (audit free)", url: "https://www.py4e.com/" },
    ],
    roleModels: [
      { name: "Fei-Fei Li", note: "AI researcher, built ImageNet" },
      { name: "Demis Hassabis", note: "DeepMind, AlphaFold" },
    ],
  },
  {
    id: "data",
    name: "Data Science & Statistics",
    tone: "b",
    vec: { analytical: 3, tech: 2, investigative: 2 },
    tagline: "Turn messy data into insight that drives real decisions.",
    careers: [
      { title: "Data Scientist", pay: "$130k" },
      { title: "Data Analyst", pay: "$80k" },
      { title: "Quantitative Researcher", pay: "$160k" },
    ],
    resources: [
      { name: "Khan Academy: Statistics", org: "Free", url: "https://www.khanacademy.org/math/statistics-probability" },
      { name: "Kaggle Learn", org: "Hands-on datasets", url: "https://www.kaggle.com/learn" },
      { name: "Intro to Data Science", org: "Coursera (audit free)", url: "https://www.coursera.org/" },
    ],
    roleModels: [
      { name: "Hilary Mason", note: "Pioneering data scientist" },
      { name: "DJ Patil", note: "First U.S. Chief Data Scientist" },
    ],
  },
  {
    id: "mech",
    name: "Mechanical Engineering",
    tone: "c",
    vec: { building: 3, analytical: 2, tech: 1 },
    tagline: "Design machines, vehicles, robots, and the things that move our world.",
    careers: [
      { title: "Mechanical Engineer", pay: "$96k" },
      { title: "Robotics Engineer", pay: "$105k" },
      { title: "Aerospace Engineer", pay: "$130k" },
    ],
    resources: [
      { name: "MIT OpenCourseWare: Mechanics", org: "Free", url: "https://ocw.mit.edu/" },
      { name: "Tinkercad (3D + circuits)", org: "Free, beginner", url: "https://www.tinkercad.com/" },
      { name: "Khan Academy: Physics", org: "Free", url: "https://www.khanacademy.org/science/physics" },
    ],
    roleModels: [
      { name: "Mary Jackson", note: "NASA's first Black female engineer" },
      { name: "Burt Rutan", note: "Aerospace designer" },
    ],
  },
  {
    id: "robo",
    name: "Robotics & Electrical Eng.",
    tone: "d",
    vec: { building: 2, tech: 3, analytical: 2 },
    tagline: "Bring hardware to life — sensors, circuits, and intelligent machines.",
    careers: [
      { title: "Robotics Engineer", pay: "$110k" },
      { title: "Electrical Engineer", pay: "$104k" },
      { title: "Embedded Systems Dev", pay: "$115k" },
    ],
    resources: [
      { name: "Arduino Project Hub", org: "Free builds", url: "https://projecthub.arduino.cc/" },
      { name: "CrashCourse: Engineering", org: "YouTube, free", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtO4A_tL6DLZRotxEb114cMR" },
      { name: "MIT OCW: Circuits", org: "Free", url: "https://ocw.mit.edu/" },
    ],
    roleModels: [
      { name: "Cynthia Breazeal", note: "Social robotics pioneer" },
      { name: "Nikola Tesla", note: "Electrical visionary" },
    ],
  },
  {
    id: "bio",
    name: "Biology & Pre-Med",
    tone: "e",
    vec: { investigative: 3, nature: 2, social: 1 },
    tagline: "Study life itself — from cells to the human body to new medicines.",
    careers: [
      { title: "Physician", pay: "$230k" },
      { title: "Biomedical Researcher", pay: "$100k" },
      { title: "Genetic Counselor", pay: "$92k" },
    ],
    resources: [
      { name: "Khan Academy: Biology", org: "Free", url: "https://www.khanacademy.org/science/biology" },
      { name: "HHMI BioInteractive", org: "Free labs + videos", url: "https://www.biointeractive.org/" },
      { name: "Crash Course Biology", org: "YouTube, free", url: "https://www.youtube.com/playlist?list=PL3EED4C1D684D3ADF" },
    ],
    roleModels: [
      { name: "Jennifer Doudna", note: "CRISPR gene editing" },
      { name: "Anthony Fauci", note: "Immunologist" },
    ],
  },
  {
    id: "env",
    name: "Environmental Science",
    tone: "f",
    vec: { nature: 3, investigative: 2, social: 1 },
    tagline: "Use science to protect ecosystems and tackle climate change.",
    careers: [
      { title: "Environmental Scientist", pay: "$78k" },
      { title: "Conservation Scientist", pay: "$68k" },
      { title: "Climate Analyst", pay: "$85k" },
    ],
    resources: [
      { name: "edX: Environmental Science", org: "Audit free", url: "https://www.edx.org/" },
      { name: "NASA Climate Kids", org: "Free", url: "https://climatekids.nasa.gov/" },
      { name: "Khan Academy: Ecology", org: "Free", url: "https://www.khanacademy.org/science/biology/ecology" },
    ],
    roleModels: [
      { name: "Jane Goodall", note: "Primatologist, conservationist" },
      { name: "Katharine Hayhoe", note: "Climate scientist" },
    ],
  },
  {
    id: "psy",
    name: "Psychology",
    tone: "a",
    vec: { social: 3, investigative: 2 },
    tagline: "Understand how the mind works and why people do what they do.",
    careers: [
      { title: "Clinical Psychologist", pay: "$92k" },
      { title: "UX Researcher", pay: "$108k" },
      { title: "School Counselor", pay: "$64k" },
    ],
    resources: [
      { name: "Crash Course Psychology", org: "YouTube, free", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6" },
      { name: "Yale: Intro to Psychology", org: "Coursera (audit free)", url: "https://www.coursera.org/learn/introduction-psychology" },
      { name: "Khan Academy: Behavior", org: "Free", url: "https://www.khanacademy.org/test-prep/mcat/behavior" },
    ],
    roleModels: [
      { name: "Carol Dweck", note: "Growth mindset researcher" },
      { name: "Daniel Kahneman", note: "Behavioral economics" },
    ],
  },
  {
    id: "health",
    name: "Nursing & Health Sciences",
    tone: "b",
    vec: { social: 3, investigative: 1, building: 1 },
    tagline: "Care for people directly and keep communities healthy.",
    careers: [
      { title: "Registered Nurse", pay: "$86k" },
      { title: "Physician Assistant", pay: "$126k" },
      { title: "Physical Therapist", pay: "$97k" },
    ],
    resources: [
      { name: "Khan Academy: Health & Medicine", org: "Free", url: "https://www.khanacademy.org/science/health-and-medicine" },
      { name: "Osmosis (intro videos)", org: "Free samples", url: "https://www.osmosis.org/" },
      { name: "Red Cross: First Aid", org: "Free basics", url: "https://www.redcross.org/take-a-class" },
    ],
    roleModels: [
      { name: "Florence Nightingale", note: "Founder of modern nursing" },
      { name: "Patricia Bath", note: "Doctor & inventor" },
    ],
  },
  {
    id: "biz",
    name: "Business & Entrepreneurship",
    tone: "c",
    vec: { enterprising: 3, social: 2 },
    tagline: "Build companies, lead teams, and turn ideas into ventures.",
    careers: [
      { title: "Product Manager", pay: "$125k" },
      { title: "Marketing Manager", pay: "$98k" },
      { title: "Startup Founder", pay: "varies" },
    ],
    resources: [
      { name: "Y Combinator: Startup School", org: "Free", url: "https://www.startupschool.org/" },
      { name: "HubSpot Academy", org: "Free certs", url: "https://academy.hubspot.com/" },
      { name: "Khan Academy: Entrepreneurship", org: "Free", url: "https://www.khanacademy.org/college-careers-more/career-content" },
    ],
    roleModels: [
      { name: "Sara Blakely", note: "Self-made founder of Spanx" },
      { name: "Daniel Ek", note: "Co-founder of Spotify" },
    ],
  },
  {
    id: "econ",
    name: "Economics & Finance",
    tone: "d",
    vec: { analytical: 3, enterprising: 2 },
    tagline: "Study how money, markets, and incentives shape the world.",
    careers: [
      { title: "Financial Analyst", pay: "$96k" },
      { title: "Economist", pay: "$113k" },
      { title: "Investment Banker", pay: "$150k" },
    ],
    resources: [
      { name: "Khan Academy: Economics", org: "Free", url: "https://www.khanacademy.org/economics-finance-domain" },
      { name: "Marginal Revolution University", org: "Free videos", url: "https://mru.org/" },
      { name: "Crash Course Economics", org: "YouTube, free", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtPNZwz5_o_5uirJ8gQXnhEO" },
    ],
    roleModels: [
      { name: "Esther Duflo", note: "Nobel economist" },
      { name: "Warren Buffett", note: "Legendary investor" },
    ],
  },
  {
    id: "comm",
    name: "Communications & Journalism",
    tone: "e",
    vec: { creative: 2, social: 3, enterprising: 1 },
    tagline: "Tell stories that inform, move, and connect people.",
    careers: [
      { title: "Journalist / Reporter", pay: "$58k" },
      { title: "Content Strategist", pay: "$78k" },
      { title: "PR Manager", pay: "$92k" },
    ],
    resources: [
      { name: "Poynter NewsU", org: "Free journalism courses", url: "https://www.poynter.org/" },
      { name: "Google: Digital Garage", org: "Free marketing certs", url: "https://learndigital.withgoogle.com/digitalgarage" },
      { name: "Crash Course Media Literacy", org: "YouTube, free", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtM6jSpzb5gMNsx9kdmqBfmY" },
    ],
    roleModels: [
      { name: "Christiane Amanpour", note: "Chief international anchor" },
      { name: "Ira Glass", note: "Radio storyteller" },
    ],
  },
  {
    id: "design",
    name: "Design & Digital Media",
    tone: "f",
    vec: { creative: 3, tech: 2 },
    tagline: "Shape how products, brands, and experiences look and feel.",
    careers: [
      { title: "UX/UI Designer", pay: "$98k" },
      { title: "Motion Designer", pay: "$80k" },
      { title: "Art Director", pay: "$105k" },
    ],
    resources: [
      { name: "Figma: Learn Design", org: "Free", url: "https://www.figma.com/resource-library/" },
      { name: "Google UX Design Cert", org: "Coursera (audit free)", url: "https://www.coursera.org/professional-certificates/google-ux-design" },
      { name: "Canva Design School", org: "Free", url: "https://www.canva.com/designschool/" },
    ],
    roleModels: [
      { name: "Paula Scher", note: "Iconic graphic designer" },
      { name: "Jony Ive", note: "Designed the iPhone" },
    ],
  },
  {
    id: "arch",
    name: "Architecture",
    tone: "a",
    vec: { creative: 3, analytical: 2, building: 2 },
    tagline: "Design the buildings and spaces people live, work, and gather in.",
    careers: [
      { title: "Architect", pay: "$93k" },
      { title: "Urban Planner", pay: "$81k" },
      { title: "Interior Architect", pay: "$76k" },
    ],
    resources: [
      { name: "SketchUp Free", org: "3D modeling", url: "https://www.sketchup.com/products/sketchup-free" },
      { name: "edX: Architectural Imagination", org: "Harvard, audit free", url: "https://www.edx.org/" },
      { name: "ArchDaily", org: "Free inspiration + reading", url: "https://www.archdaily.com/" },
    ],
    roleModels: [
      { name: "Zaha Hadid", note: "Boundary-pushing architect" },
      { name: "Bjarke Ingels", note: "Playful modern architect" },
    ],
  },
  {
    id: "edu",
    name: "Education & Teaching",
    tone: "b",
    vec: { social: 3, creative: 1, investigative: 1 },
    tagline: "Spark curiosity and help the next generation learn and grow.",
    careers: [
      { title: "Teacher (K–12)", pay: "$62k" },
      { title: "Instructional Designer", pay: "$74k" },
      { title: "EdTech Specialist", pay: "$82k" },
    ],
    resources: [
      { name: "Khan Academy (be a learner first)", org: "Free", url: "https://www.khanacademy.org/" },
      { name: "Coursera: Foundations of Teaching", org: "Audit free", url: "https://www.coursera.org/" },
      { name: "TED-Ed", org: "Free lessons", url: "https://ed.ted.com/" },
    ],
    roleModels: [
      { name: "Sal Khan", note: "Founder of Khan Academy" },
      { name: "Maria Montessori", note: "Education innovator" },
    ],
  },
  {
    id: "law",
    name: "Political Science & Law",
    tone: "c",
    vec: { social: 2, enterprising: 3, analytical: 1 },
    tagline: "Understand power, policy, and justice — and argue for change.",
    careers: [
      { title: "Lawyer / Attorney", pay: "$135k" },
      { title: "Policy Analyst", pay: "$86k" },
      { title: "Public Affairs Manager", pay: "$98k" },
    ],
    resources: [
      { name: "Khan Academy: U.S. Government", org: "Free", url: "https://www.khanacademy.org/humanities/us-government-and-civics" },
      { name: "Yale: Moral Foundations of Politics", org: "Coursera (audit free)", url: "https://www.coursera.org/" },
      { name: "iCivics", org: "Free interactive games", url: "https://www.icivics.org/" },
    ],
    roleModels: [
      { name: "Ruth Bader Ginsburg", note: "Supreme Court Justice" },
      { name: "Bryan Stevenson", note: "Justice advocate" },
    ],
  },
];
