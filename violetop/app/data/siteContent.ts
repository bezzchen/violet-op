export const siteMeta = {
  title: "NYU Violet OP",
  description:
    "We are a diverse collegiate VALORANT Esports team at New York University with the main goal of having esports and gaming to be brought into a bigger space.",
};

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Events", href: "/events" },
  { label: "Join Us", href: "/join-us" },
];

export const valorantTeams = [
  {
    name: "VOP White",
    href: "/vop-white",
    tier: "The Elite",
    image: "/images/vopwhite.avif",
    summary:
      "VOP White is the pinnacle of our competitive pipeline. This is an elite environment reserved for players who possess the mechanical skill, game sense, and dedication required to compete at the highest level.",
  },
  {
    name: "VOP Purple",
    href: "/vop-purple",
    tier: "The Competitive",
    image: "/images/voppurple.avif",
    summary:
      "VOP Purple serves as a core competitive pillar of our program, bridging the gap between talent and high-level collegiate execution.",
  },
  {
    name: "VOP Black",
    href: "/vop-black",
    tier: "The Foundation",
    image: "/images/vopblack.png",
    summary:
      "VOP Black is the primary entry point into our competitive ecosystem. This roster focuses on identifying raw talent and integrating players into a professional team structure.",
  },
  {
    name: "VOP Gamechangers",
    href: "/gamechangers",
    tier: "The Heart",
    image: "/images/lavender.avif",
    summary:
      "VOP Game Changers is our dedicated space for players of marginalized genders (women, non-binary, and genderqueer competitors).",
  },
];

export const leagueTeams = [
  {
    name: "VOP League 1",
    href: "/league1",
    tier: "The Foundation",
    image: "/images/red.avif",
    summary:
      "League 1 is the heart of VOP's open-rank community. Whether you are new to the game or just looking for a consistent squad to vibe with, this is your home.",
  },
  {
    name: "VOP League 2",
    href: "/league2",
    tier: "The Foundation",
    image: "/images/blue.avif",
    summary:
      "League 2 is the heart of VOP's open-rank community. Whether you are new to the game or just looking for a consistent squad to vibe with, this is your home.",
  },
];

export const allTeams = [...valorantTeams, ...leagueTeams];

export const homeContent = {
  eyebrow: "NYU Violet OP",
  body:
    "We are a diverse collegiate esports team at New York University with the main goal of having esports and gaming to be brought into a bigger space.",
  join:
    "Join NYU's collegiate VALORANT team and be part of a diverse community working to elevate esports and gaming to new heights on campus and beyond.",
};

export const aboutContent = {
  title: "Who We Are",
  image: "/images/groupphoto.avif",
  paragraphs: [
    "Violet OP is a competitive collegiate team based at New York University, bringing together a diverse group of players who share a passion for gaming.",
    "We compete across multiple tiers of competition, ranging from high rank elite roster to open rank teams, making it easy for players of all skill levels to get involved.",
    "As a team, we're all about building a strong community, whether that's through competition, content, or just connecting people who love gaming.",
    "VOP is a space where players and fans alike can get involved, support each other, and be part of something bigger.",
  ],
  management: [
    { name: "Katelyn Nguyen", role: "President", image: "/images/katelyn.avif" },
    { name: "Jessica Wang", role: "Valorant Esports Leader", image: "/images/jessica.avif" },
    { name: "Kuan Lin", role: "Event Coordination", image: "/images/kuan.avif" },
    { name: "Jenny Guo", role: "Design" },
    { name: "Artus Yeh", role: "Marketing & Content", image: "/images/artus.avif" },
    { name: "Augus Li", role: "Outreach Leader", image: "/images/augus.avif" },
    { name: "George Zhou", role: "Budgeting" },
    { name: "Ella Kaplan", role: "General Manager", image: "/images/ella.avif" },
    { name: "Logan Tsai", role: "Secretary", image: "/images/logan.avif" },
    { name: "Eric Qi", role: "Financial Planning", image: "/images/eric.avif" },
  ],
  staff: [
    { name: "Emily Chen", role: "Partnerships", image: "/images/emily.avif" },
    { name: "Alston Li", role: "Website Designer", image: "/images/alston.avif" },
    { name: "Charice Huang", role: "Event Designer" },
  ],
};

export const joinContent = {
  title: "Join the Vibe",
  intro:
    "At Violet OP, we believe there is a place for every player. Whether you are an elite competitor looking for the big stage or a casual player looking for a squad, your journey starts here.",
  paths: [
    {
      name: "VOP White",
      details: [
        "Requirements: Immo 1 or higher",
        "Commitment: High (Daily Scrims, VOD Reviews, LAN Travel)",
        "Access: Highly Selective Tryouts",
      ],
    },
    {
      name: "VOP Black",
      details: [
        "Requirements: Open Rank",
        "Commitment: Low/Flexible",
        "Access: Seasonal Tryouts",
      ],
    },
    {
      name: "VOP Gamechangers",
      details: [
        "Commitment: Medium/Flexible",
        "Access: Only those with marginalized genders",
      ],
    },
    { name: "VOP League 1", details: [] },
    { name: "VOP League 2", details: [] },
  ],
  staffIntro:
    "Behind every great team is an amazing support system. We are always looking for passionate NYU students to help build the VOP legacy behind the scenes.",
  staffRoles: [
    "Head Coach for White",
    "Assistant Coach and Analyst for White",
    "Assistant Coach and Analyst for Purple",
    "Head Coach for Black",
    "Assistant Coach and Analyst for Black",
  ],
  faqs: [
    {
      question: "Do I have to be an NYU student?",
      answer:
        "While our primary focus is the NYU collegiate scene, we welcome the broader community to our events, teams, and Discord.",
    },
    {
      question: "How do I move from Black to Purple or White?",
      answer:
        "The transition from community play to our elite rosters is based on performance, attitude, and scouting.",
    },
    {
      question: "What if I don't play the current main games?",
      answer:
        "Join our Discord! We are always looking to expand our reach based on community interest.",
    },
  ],
};

export const eventsContent = {
  title: "What's Happening",
  subtitle: "Community Events",
  events: [
    {
      month: "APR",
      day: "11",
      title: "Late Night Listening Party",
      time: "8:00 PM - 10:00 PM",
      category: "Music",
    },
    {
      month: "APR",
      day: "14",
      title: "Creator Q&A with @maya.r",
      time: "6:30 PM - 7:30 PM",
      category: "Live",
    },
    {
      month: "APR",
      day: "18",
      title: "Community Game Night",
      time: "7:00 PM - 9:00 PM",
      category: "Gaming",
    },
  ],
};

const valorantAgentPortraits = {
  clove:
    "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/fullportrait.png",
  omen:
    "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/fullportrait.png",
  reyna:
    "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/fullportrait.png",
  vyse:
    "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/fullportrait.png",
};

const leagueCreatureRenders = {
  krug: "https://wiki.leagueoflegends.com/en-us/images/Krug_Render.png?82903",
  raptor: "https://wiki.leagueoflegends.com/en-us/images/Raptor_Render.png?bb810",
};

const gameLogos = {
  league: "/images/lollogo.avif",
  valorant: "/images/valologo.webp",
};

export const teamPages = [
  {
    slug: "vop-white",
    name: "VOP White",
    label: "The Elite",
    image: "/images/vopwhite.avif",
    accent: "tertiary",
    game: "valorant",
    gameLabel: "VALORANT",
    gameLogo: gameLogos.valorant,
    feature: {
      label: "Featured Agent",
      name: "Vyse",
      image: valorantAgentPortraits.vyse,
      summary: "Sentinel pressure and disciplined late-round control.",
    },
    requirements: [
      "Rank: Immortal 1 or higher",
      "Commitment: Daily scrims, VOD review, tournament play",
      "Access: Highly selective tryouts",
    ],
    paragraphs: [
      "VOP White is the pinnacle of our competitive pipeline. This is an elite environment reserved for players who possess the mechanical skill, game sense, and dedication required to compete at the highest level.",
      "As our flagship roster, VOP White is built for the highest level of competition. We aren't just looking for high-rank players; we are looking for teammates who can perform under the pressure of a stage light.",
    ],
    support:
      "VOP White is fully supported by a dedicated performance team to ensure our players reach their ceiling.",
    proof:
      "Entry into VOP White is strictly through a formal tryout process. If you have the rank, the experience, and the drive to represent the White jersey:",
    staff: [
      {
        role: "NEEDED*** Head Coach",
        detail: "Leading strategy and individual player development",
      },
      {
        role: "NEEDED*** Assistant Coach and Analyst",
        detail: "Providing data-driven insights and VOD reviews to stay ahead of the meta",
      },
    ],
    roster: ["Brandon", "Jake", "Justin", "Fallen", "Alpha"],
  },
  {
    slug: "vop-purple",
    name: "VOP Purple",
    label: "The Competitive",
    image: "/images/voppurple.avif",
    accent: "primary",
    game: "valorant",
    gameLabel: "VALORANT",
    gameLogo: gameLogos.valorant,
    feature: {
      label: "Featured Agent",
      name: "Reyna",
      image: valorantAgentPortraits.reyna,
      summary: "Explosive confidence, entry pressure, and clutch focus.",
    },
    requirements: [
      "Rank: TBA",
      "Commitment: Structured weekly practice",
      "Access: Competitive tryouts",
    ],
    paragraphs: [
      "VOP Purple serves as a core competitive pillar of our program, bridging the gap between talent and high-level collegiate execution.",
      "This roster is designed for dedicated players who have already cut their teeth in the collegiate circuit and are looking to refine their playstyle within a structured team environment.",
    ],
    support:
      "VOP Purple is supported by coaching, analysis, and staff systems as roles become available.",
    proof:
      "Entry into VOP Purple is handled through a formal tryout process. If you have the mechanics, communication, and drive to represent the Purple jersey:",
    staff: [
      { role: "Wayne Yee", detail: "Head Coach" },
      {
        role: "NEEDED*** Assistant Coach and Analyst",
        detail: "Providing data-driven insights and VOD reviews to stay ahead of the meta",
      },
    ],
    roster: ["Katelyn Nguyen", "Nahian Sowalehin", "Evan Lee (IGL)", "TBA", "TBA"],
  },
  {
    slug: "vop-black",
    name: "VOP Black",
    label: "The Foundation",
    image: "/images/vopblack.png",
    accent: "tertiary",
    game: "valorant",
    gameLabel: "VALORANT",
    gameLogo: gameLogos.valorant,
    feature: {
      label: "Featured Agent",
      name: "Omen",
      image: valorantAgentPortraits.omen,
      summary: "Shadow control, patient defaults, and team-first utility.",
    },
    requirements: [
      "Rank: Open rank",
      "Commitment: Flexible practice blocks",
      "Access: Seasonal tryouts",
    ],
    paragraphs: [
      "VOP Black is the primary entry point into our competitive ecosystem. This roster focuses on identifying raw talent and integrating players into a professional team structure.",
      "As the foundational tier of our program, VOP Black is dedicated to developing the mechanical consistency and communication skills necessary to eventually transition into our senior rosters.",
    ],
    proof:
      "Entry into VOP Black is strictly through a formal tryout process. If you want to have fun, join a community, and represent the Black jersey:",
    staff: [],
    roster: [
      "Ella",
      "George",
      "Artus",
      "Augus",
      "Choman",
      "Rick (Purple Tryout)",
      "Kuan (Purple Tryout)",
    ],
  },
  {
    slug: "gamechangers",
    name: "VOP Gamechangers",
    label: "The Heart",
    image: "/images/lavender.avif",
    accent: "primary",
    game: "valorant",
    gameLabel: "VALORANT",
    gameLogo: gameLogos.valorant,
    feature: {
      label: "Featured Agent",
      name: "Clove",
      image: valorantAgentPortraits.clove,
      summary: "Resilient controller play and fearless second-chance energy.",
    },
    requirements: [
      "Eligibility: Marginalized genders",
      "Rank: TBA",
      "Access: Dedicated tryout process",
    ],
    paragraphs: [
      "VOP Game Changers is our dedicated space for players of marginalized genders (women, non-binary, and genderqueer competitors).",
      "We are committed to fostering an inclusive, high-level competitive environment and a strong support network for gender-diverse gamers.",
    ],
    proof:
      "Entry into VOP Game Changers is strictly through a formal tryout process. If you are ready to prove your skills and grow within a dedicated community:",
    staff: [],
    roster: ["TBD"],
  },
  {
    slug: "league1",
    name: "VOP League 1",
    label: "The Foundation",
    image: "/images/red.avif",
    accent: "tertiary",
    game: "league",
    gameLabel: "League of Legends",
    gameLogo: gameLogos.league,
    feature: {
      label: "Featured Camp",
      name: "Raptor",
      image: leagueCreatureRenders.raptor,
      summary: "Fast clears, early momentum, and sharp map tempo.",
    },
    requirements: [
      "Rank: Open rank",
      "Commitment: Flexible customs and review",
      "Access: Community signups",
    ],
    paragraphs: [
      "League 1 is the heart of VOP's open-rank community. Whether you are new to the game or just looking for a consistent squad to vibe with, this is your home.",
      "We focus on balanced 5v5 customs where the goal is to learn, improve, and meet the people who make this organization great.",
    ],
    proof:
      "Entry into VOP League 1 is community-oriented. If you want to improve, queue with a squad, and represent the Red side of VOP:",
    staff: [],
    roster: ["TBD"],
  },
  {
    slug: "league2",
    name: "VOP League 2",
    label: "The Foundation",
    image: "/images/blue.avif",
    accent: "primary",
    game: "league",
    gameLabel: "League of Legends",
    gameLogo: gameLogos.league,
    feature: {
      label: "Featured Camp",
      name: "Krug",
      image: leagueCreatureRenders.krug,
      summary: "Durable fundamentals, lane patience, and steady objective setup.",
    },
    requirements: [
      "Rank: Open rank",
      "Commitment: Flexible customs and review",
      "Access: Community signups",
    ],
    paragraphs: [
      "League 2 is the heart of VOP's open-rank community. Whether you are new to the game or just looking for a consistent squad to vibe with, this is your home.",
      "We focus on balanced 5v5 customs where the goal is to learn, improve, and meet the people who make this organization great.",
    ],
    proof:
      "Entry into VOP League 2 is community-oriented. If you want to improve, queue with a squad, and represent the Blue side of VOP:",
    staff: [],
    roster: ["TBD"],
  },
];
