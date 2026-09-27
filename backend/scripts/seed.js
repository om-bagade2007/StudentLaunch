require("dotenv").config();

const { db } = require("../firebaseAdmin");

const opportunities = [
  {
    title: "Software Engineering Intern — Stripe",
    type: "internship",
    category: "internship",
    skills: ["JavaScript", "React", "Python", "SQL"],
    deadline: "2026-11-15",
    link: "https://stripe.com/jobs",
    description:
      "Build payments infrastructure used by millions of businesses. Work with a mentor on production services, code reviews, and intern project demos.",
  },
  {
    title: "Data Science Intern — Spotify",
    type: "internship",
    category: "internship",
    skills: ["Python", "SQL", "Machine Learning", "Statistics"],
    deadline: "2026-10-30",
    link: "https://lifeatspotify.com/jobs",
    description:
      "Analyze listener behavior and experiment on recommendation quality. Expect A/B testing, notebooks, and cross-team presentations.",
  },
  {
    title: "Product Design Intern — Figma",
    type: "internship",
    category: "internship",
    skills: ["Figma", "UI Design", "User Research", "Prototyping"],
    deadline: "2026-12-01",
    link: "https://www.figma.com/careers",
    description:
      "Ship design improvements on the Figma editor. Collaborate with PMs and engineers, run usability sessions, and present a portfolio case study.",
  },
  {
    title: "Frontend Intern — Shopify",
    type: "internship",
    category: "internship",
    skills: ["JavaScript", "React", "TypeScript", "CSS"],
    deadline: "2026-11-01",
    link: "https://www.shopify.com/careers",
    description:
      "Help merchants run their stores with performant React UIs. You will own a feature slice from spec to production.",
  },
  {
    title: "ML Research Intern — Hugging Face",
    type: "internship",
    category: "internship",
    skills: ["Python", "PyTorch", "NLP", "Transformers"],
    deadline: "2026-10-20",
    link: "https://huggingface.co/jobs",
    description:
      "Contribute to open-source models and datasets. Strong fit if you enjoy papers, reproducible experiments, and community docs.",
  },
  {
    title: "MLH Hackcon Student Hackathon",
    type: "hackathon",
    category: "hackathon",
    skills: ["JavaScript", "Python", "APIs", "Teamwork"],
    deadline: "2026-10-05",
    link: "https://mlh.io/seasons",
    description:
      "48-hour student hackathon with tracks for social good, AI, and beginner projects. Mentors, workshops, and sponsor prizes on site.",
  },
  {
    title: "NASA Space Apps Challenge",
    type: "hackathon",
    category: "hackathon",
    skills: ["Python", "Data Visualization", "Open Data", "Earth Science"],
    deadline: "2026-10-01",
    link: "https://www.spaceappschallenge.org/",
    description:
      "Global hackathon using NASA open data. Build tools that help people understand Earth and space science.",
  },
  {
    title: "ETHGlobal Online",
    type: "hackathon",
    category: "hackathon",
    skills: ["Solidity", "JavaScript", "Web3", "Smart Contracts"],
    deadline: "2026-11-20",
    link: "https://ethglobal.com/",
    description:
      "Remote Ethereum hackathon with workshops from ecosystem partners. Great if you want to ship a dapp in a weekend.",
  },
  {
    title: "HackMIT",
    type: "hackathon",
    category: "hackathon",
    skills: ["Python", "React", "Hardware", "Machine Learning"],
    // Projected annual application deadline; 2027 dates are not published yet.
    deadline: "2027-07-04",
    link: "https://hackmit.org/",
    description:
      "MIT's flagship student hackathon. Hardware lab, design mentors, and a mix of beginner and advanced tracks.",
  },
  {
    title: "Google Computer Science Scholarship",
    type: "scholarship",
    category: "scholarship",
    skills: ["Computer Science", "Java", "Python"],
    deadline: "2026-12-15",
    link: "https://buildyourfuture.withgoogle.com/scholarships",
    description:
      "Need-based scholarship for students pursuing CS degrees. Includes community programming and resume workshops.",
  },
  {
    title: "Generation Google Scholarship (APAC)",
    type: "scholarship",
    category: "scholarship",
    skills: ["Computer Science", "Leadership", "Problem Solving"],
    deadline: "2026-12-05",
    link: "https://buildyourfuture.withgoogle.com/scholarships",
    description:
      "Supports women in computer science across Asia-Pacific. Application includes essays and academic transcripts.",
  },
  {
    title: "Adobe Research Women-in-Technology Scholarship",
    type: "scholarship",
    category: "scholarship",
    skills: ["Design", "Computer Science", "Research"],
    deadline: "2026-11-30",
    link: "https://research.adobe.com/scholarship/",
    description:
      "Award for undergraduate and master's students in tech and creative fields. Includes a cash award and Adobe mentor.",
  },
  {
    title: "Palantir Future Interns Scholarship",
    type: "scholarship",
    category: "scholarship",
    skills: ["Python", "Java", "Algorithms"],
    deadline: "2027-01-15",
    link: "https://www.palantir.com/careers/students/",
    description:
      "Scholarship for students from underrepresented backgrounds in software engineering, with interview prep resources.",
  },
  {
    title: "CS50: Introduction to Computer Science",
    type: "course",
    category: "course",
    skills: ["C", "Python", "SQL", "Algorithms"],
    deadline: "2027-06-30",
    link: "https://cs50.harvard.edu/",
    description:
      "Harvard's introductory CS course. Problem sets cover C, Python, SQL, and a final project of your choice.",
  },
  {
    title: "Deep Learning Specialization — Coursera",
    type: "course",
    category: "course",
    skills: ["Python", "Deep Learning", "TensorFlow", "Neural Networks"],
    deadline: "2027-12-31",
    link: "https://www.coursera.org/specializations/deep-learning",
    description:
      "Andrew Ng's sequence on neural networks, CNNs, sequence models, and practical ML advice.",
  },
  {
    title: "Meta Front-End Developer Certificate",
    type: "course",
    category: "course",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    deadline: "2027-12-31",
    link: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    description:
      "Project-based certificate covering responsive layouts, React, and version control for junior frontend roles.",
  },
  {
    title: "Stanford Machine Learning Course",
    type: "course",
    category: "course",
    skills: ["Python", "Machine Learning", "Linear Algebra", "Statistics"],
    deadline: "2027-08-31",
    link: "https://www.coursera.org/learn/machine-learning",
    description:
      "Classic supervised and unsupervised learning course with programming assignments in Python.",
  },
  {
    title: "Google Code Jam / Kick Start Practice Round",
    type: "competition",
    category: "competition",
    skills: ["Algorithms", "C++", "Python", "Problem Solving"],
    deadline: "2026-10-12",
    link: "https://codingcompetitions.withgoogle.com/",
    description:
      "Timed algorithmic programming contest. Practice rounds are open to students warming up for onsite interviews.",
  },
  {
    title: "ICPC Regional Collegiate Programming Contest",
    type: "competition",
    category: "competition",
    skills: ["C++", "Algorithms", "Data Structures", "Teamwork"],
    deadline: "2026-10-08",
    link: "https://icpc.global/",
    description:
      "Team-based programming contest. Universities send 3-person teams to solve problems under a time limit.",
  },
  {
    title: "Kaggle Student Playground: Housing Prices",
    type: "competition",
    category: "competition",
    skills: ["Python", "Pandas", "Machine Learning", "Feature Engineering"],
    deadline: "2026-11-25",
    link: "https://www.kaggle.com/competitions",
    description:
      "Beginner-friendly Kaggle competition for tabular ML. Submit predictions, read kernels, and climb a public leaderboard.",
  },
  {
    title: "UX Design Challenge — ADPList Community",
    type: "competition",
    category: "competition",
    skills: ["Figma", "UX Research", "Prototyping", "Presentation"],
    deadline: "2026-10-22",
    link: "https://adplist.org/",
    description:
      "Weekend design challenge with mentor feedback. Submit a case study and compete for portfolio reviews.",
  },
];

async function seedDemoProfile() {
  const demoUid = process.env.DEMO_USER_UID;
  if (!demoUid) {
    throw new Error("DEMO_USER_UID is required to seed the demo profile.");
  }

  await db.collection("profiles").doc(demoUid).set(
    {
      education: "B.S. Computer Science, 2027",
      skills: ["JavaScript", "React", "Python", "SQL", "Machine Learning"],
      interests: ["Frontend development", "AI and data science", "Hackathons"],
      preferredCategories: ["internship", "hackathon", "course", "competition"],
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  console.log(`Seeded demo profile for UID ${demoUid}.`);
}

async function seed() {
  if (process.argv.includes("--profile-only")) {
    await seedDemoProfile();
    return;
  }

  const col = db.collection("opportunities");
  const existingSnapshot = await col.count().get();
  const existingCount = existingSnapshot.data().count;
  const force = process.argv.includes("--force");

  if (existingCount > 0 && !force) {
    console.warn(
      `Found ${existingCount} existing opportunities. Aborting seed; pass --force to add sample documents anyway.`
    );
    return;
  }

  const batch = db.batch();
  for (const opp of opportunities) {
    const ref = col.doc();
    batch.set(ref, opp);
  }
  await batch.commit();
  console.log(`Seeded ${opportunities.length} opportunities.`);

  if (process.env.DEMO_USER_UID) {
    await seedDemoProfile();
  } else {
    console.warn("DEMO_USER_UID is not set; skipped the demo profile.");
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
