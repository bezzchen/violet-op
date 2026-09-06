export const siteMeta = {
  title: "NYU Violet OP",
  description:
    "We are a diverse collegiate VALORANT Esports team at New York University with the main goal of having esports and gaming to be brought into a bigger space.",
};

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Events", href: "/events" },
  { label: "Highlights", href: "/highlights" },
  { label: "Eboard", href: "/eboard" },
  { label: "Join Us", href: "/join-us" },
];

export const valorantTeams = [
  {
    name: "VOP White",
    href: "/vop-white",
    tier: "Varsity",
    image: "/images/vopwhite.avif",
    summary:
      "VOP White is the pinnacle of our competitive pipeline. This is an elite environment reserved for players who possess the mechanical skill, game sense, and dedication required to compete at the highest level.",
  },
  {
    name: "VOP Purple",
    href: "/vop-purple",
    tier: "Junior Varsity",
    image: "/images/voppurple.avif",
    summary:
      "VOP Purple serves as a core competitive pillar of our program, bridging the gap between talent and high-level collegiate execution.",
  },
  {
    name: "VOP Black",
    href: "/vop-black",
    tier: "Academy",
    image: "/images/vopblack.png",
    summary:
      "VOP Black is the primary entry point into our competitive ecosystem. This roster focuses on identifying raw talent and integrating players into a professional team structure.",
  },
  {
    name: "VOP Ruby",
    href: "/ruby",
    tier: "Marginalized",
    image: "/images/lavender.avif",
    summary:
      "VOP Ruby is our dedicated space for players of marginalized genders (women, non-binary, and genderqueer competitors).",
  },
];

export const leagueTeams = [
  {
    name: "VOP Elder",
    href: "/league1",
    tier: "Varsity",
    image: "/images/red.avif",
    summary:
      "VOP Elder is the heart of VOP's open-rank community. Whether you are new to the game or just looking for a consistent squad to vibe with, this is your home.",
  },
  {
    name: "VOP Baron",
    href: "/league2",
    tier: "Development",
    image: "/images/blue.avif",
    summary:
      "VOP Baron is the heart of VOP's open-rank community. Whether you are new to the game or just looking for a consistent squad to vibe with, this is your home.",
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
  sections: [
    {
      eyebrow: "VOP E-Board",
      heading: "Executive Leadership",
      people: [
        { name: "Katelyn Nguyen", role: "President", image: "/images/katelyn.avif" },
        { name: "Logan Tsai", role: "General Manager", image: "/images/logan.avif" },
        { name: "Eric Qi", role: "Secretary", image: "/images/eric.avif" },
        { name: "Augus Li", role: "Human Resources", image: "/images/augus.avif" },
      ],
    },
    {
      eyebrow: "VOP E-Board",
      heading: "Competitive Department",
      people: [
        {
          name: "Jessica Wang",
          role: "Valorant Esports Leader / GC Team Manager",
          image: "/images/jessica.avif",
        },
        {
          name: "Katelyn Nguyen",
          role: "Team Manager - Purple, Black",
          image: "/images/katelyn.avif",
        },
        {
          name: "Logan Tsai",
          role: "Team Manager - White / Coach & Analyst / Scouting Lead",
          image: "/images/logan.avif",
        },
        {
          name: "Emily Chen",
          role: "League of Legends Esports Leader",
          image: "/images/emily.avif",
        },
        { name: "TBA", role: "League Team Managers" },
        { name: "TBA", role: "League Coaches/Analysts" },
        { name: "TBA", role: "League Player Recruitment/Scouting Lead" },
      ],
    },
    {
      eyebrow: "VOP E-Board",
      heading: "Events Department",
      people: [
        { name: "Charice Huang", role: "Head of Event Coordination" },
        { name: "Kuan Lin", role: "Event Designer/Helper", image: "/images/kuan.avif" },
        {
          name: "Katelyn Nguyen",
          role: "Tournament Operations Lead",
          image: "/images/katelyn.avif",
        },
        { name: "Logan Tsai", role: "Tournament Operations Lead", image: "/images/logan.avif" },
        { name: "TBA", role: "Broadcast/Production Lead" },
      ],
    },
    {
      eyebrow: "VOP E-Board",
      heading: "Creative Department",
      people: [
        { name: "Emily Chen", role: "Website Leader", image: "/images/emily.avif" },
        { name: "Barry Chen", role: "Website Leader" },
        {
          name: "Artus Yeh",
          role: "Head of Design / Content Lead / Graphic Designer / Video Editor",
          image: "/images/artus.avif",
        },
        { name: "TBA", role: "Stream Content Creators" },
      ],
    },
    {
      eyebrow: "VOP E-Board",
      heading: "Marketing & Growth",
      people: [
        {
          name: "Artus Yeh",
          role: "Head of Marketing / Social Media Manager / Content Strategist",
          image: "/images/artus.avif",
        },
        {
          name: "Katelyn Nguyen",
          role: "Social Media Manager / Community Discord Manager",
          image: "/images/katelyn.avif",
        },
        { name: "Logan Tsai", role: "Social Media Manager", image: "/images/logan.avif" },
        { name: "Eric Qi", role: "Social Media Manager", image: "/images/eric.avif" },
        { name: "Nahian Sowalehin", role: "Head of Communications, Operations & Outreach" },
        { name: "Alston Li", role: "Campus Outreach Team/Partnership", image: "/images/alston.avif" },
      ],
    },
    {
      eyebrow: "VOP E-Board",
      heading: "Finance",
      people: [
        {
          name: "Ella Kaplan",
          role: "Head of Financial Planning and Budgeting",
          image: "/images/ella.avif",
        },
        { name: "George Zhou", role: "Fundraising Lead" },
      ],
    },
  ],
};

export const joinContent = {
  title: "Join the Vibe",
  intro:
    "At Violet OP, we believe there is a place for every player. Whether you are an elite competitor looking for the big stage or a casual player looking for a squad, your journey starts here.",
  paths: [
    {
      name: "VOP White",
      game: "valorant",
      filled: true,
      joinHref: "https://forms.gle/Y349hunA1hgqAiUu6",
      details: [
        "Requirements: Immo 1 or higher",
        "Commitment: High (Daily Scrims, VOD Reviews, LAN Travel)",
        "Access: Highly Selective Tryouts",
      ],
    },
    {
      name: "VOP Purple",
      game: "valorant",
      filled: false,
      joinHref: "https://forms.gle/ircHZ4YA3D1YyFm8A",
      details: [
        "Requirements: Open Rank",
        "Commitment: Structured Weekly Practice",
        "Access: Competitive Tryouts",
      ],
    },
    {
      name: "VOP Black",
      game: "valorant",
      filled: true,
      joinHref: "https://forms.gle/ircHZ4YA3D1YyFm8A",
      details: [
        "Requirements: Open Rank",
        "Commitment: Low/Flexible",
        "Access: Seasonal Tryouts",
      ],
    },
    {
      name: "VOP Ruby",
      game: "valorant",
      filled: false,
      joinHref: "https://forms.gle/PSpnnByGm8JihwUA9",
      details: [
        "Commitment: Medium/Flexible",
        "Access: Only those with marginalized genders",
      ],
    },
    {
      name: "VOP Elder",
      game: "league",
      filled: false,
      joinHref: "https://forms.gle/24E8hzA8vopwxxZK7",
      details: [],
    },
    {
      name: "VOP Baron",
      game: "league",
      filled: false,
      joinHref: "https://forms.gle/24E8hzA8vopwxxZK7",
      details: [],
    },
  ],
  staffIntro:
    "Behind every great team is an amazing support system. We are always looking for passionate NYU students to help build the VOP legacy behind the scenes.",
  staffRoles: [
    {
      name: "Head Coach for White",
      filled: false,
      joinHref: "https://forms.gle/YQqDfLcpYaKnXR2c7",
    },
    {
      name: "Assistant Coach and Analyst for White",
      filled: false,
      joinHref: "https://forms.gle/YQqDfLcpYaKnXR2c7",
    },
    {
      name: "Head Coach for Purple",
      filled: true,
      joinHref: "https://forms.gle/YQqDfLcpYaKnXR2c7",
    },
    {
      name: "Assistant Coach and Analyst for Purple",
      filled: false,
      joinHref: "https://forms.gle/YQqDfLcpYaKnXR2c7",
    },
    {
      name: "Head Coach for Black",
      filled: false,
      joinHref: "https://forms.gle/YQqDfLcpYaKnXR2c7",
    },
    {
      name: "Assistant Coach and Analyst for Black",
      filled: false,
      joinHref: "https://forms.gle/YQqDfLcpYaKnXR2c7",
    },
    {
      name: "Events Team",
      filled: false,
      joinHref: "https://forms.gle/u2pfFXngoD793Emu9",
    },
    {
      name: "Creative Team",
      filled: false,
      joinHref: "https://forms.gle/96cJSXrWno85WKC58",
    },
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

// Public Google Calendar iCal exports. Both are read server-side and parsed by
// app/lib/ical.ts, so the pages stay in sync with whatever the org schedules.
export const calendarFeeds = {
  events:
    "https://calendar.google.com/calendar/ical/c_e1cc26269e8592fafed866f2db60788a4b0d713574cb46931496d69196c58719%40group.calendar.google.com/public/basic.ics",
  eboard:
    "https://calendar.google.com/calendar/ical/nyuvalvop%40gmail.com/public/basic.ics",
};

export const eventsContent = {
  title: "What's Happening",
  emptyMessage:
    "Nothing on the calendar right now. Check back soon, or hop in our Discord for the latest.",
};

export const eboardContent = {
  title: "E-Board Calendar",
  intro: "Enter the E-Board PIN to view the internal meeting schedule.",
  emptyMessage: "No E-Board meetings are scheduled right now.",
};

export const highlightsContent = {
  title: "Highlights",
  subtitle: "Valorant Clips",
  intro:
    "A quick reel of Violet OP Valorant moments, from clean picks to round-closing plays.",
  clips: [
    {
      id: "BUTEgoy3bXo",
      title: "Valorant Highlight 01",
      url: "https://www.youtube.com/watch?v=BUTEgoy3bXo",
    },
    {
      id: "cWTQb-wiOSI",
      title: "Valorant Highlight 02",
      url: "https://www.youtube.com/watch?v=cWTQb-wiOSI",
    },
    {
      id: "Rx-xkubvrjs",
      title: "Valorant Highlight 03",
      url: "https://www.youtube.com/watch?v=Rx-xkubvrjs",
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
  baronNashor: "/images/baron-nashor.webp",
  elderDragon: "/images/elder-dragon.png",
};

const gameLogos = {
  league: "/images/lollogo.avif",
  valorant: "/images/valologo.webp",
};

export const teamPages = [
  {
    slug: "vop-white",
    name: "VOP White",
    label: "Varsity",
    image: "/images/vopwhite.avif",
    accent: "tertiary",
    game: "valorant",
    gameLabel: "VALORANT",
    gameLogo: gameLogos.valorant,
    feature: {
      label: "VOP",
      name: "White",
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
        role: "TBA",
        detail: "Head Coach",
      },
      {
        role: "TBA",
        detail: "Assistant Coach and Analyst",
      },
    ],
    roster: [
      { name: "Lucas Li", username: "fqll3n", role: "teammate" },
      { name: "Brandon Wu", username: "Brandon", role: "teammate" },
      { name: "Jake Rivera", username: "ajek2", role: "teammate" },
      { name: "Sajal Kaushik", username: "alpha9_", role: "teammate" },
      { name: "Ricky Zou", username: "solongyixia", role: "teammate" },
      { name: "Tyler Huynh", username: "tylorui", role: "teammate" },
      { name: "Damian Engenheiro", username: "mist", role: "sub" },
    ],
  },
  {
    slug: "vop-purple",
    name: "VOP Purple",
    label: "Junior Varsity",
    image: "/images/voppurple.avif",
    accent: "primary",
    game: "valorant",
    gameLabel: "VALORANT",
    gameLogo: gameLogos.valorant,
    feature: {
      label: "VOP",
      name: "Purple",
      image: valorantAgentPortraits.reyna,
      summary: "Explosive confidence, entry pressure, and clutch focus.",
    },
    requirements: [
      "Rank: Open rank",
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
        role: "TBA",
        detail: "Assistant Coach and Analyst",
      },
    ],
    roster: [
      { name: "Evan Lee", username: "Soggy Bread", role: "IGL" },
      { name: "Kuan Lin", username: "Nauk", role: "teammate" },
      { name: "Logan Tsai", username: "Phan10mX", role: "teammate" },
      { name: "Eric Qi", username: "rickpizzaisgood", role: "teammate" },
      { name: "Nahian Sowalehin", username: "nahianishot", role: "teammate" },
      { name: "Katelyn Nguyen", username: "kate", role: "sub" },
      { name: "Lucy Zheng", username: "Tyjihn", role: "sub" },
    ],
  },
  {
    slug: "vop-black",
    name: "VOP Black",
    label: "Academy",
    image: "/images/vopblack.png",
    accent: "tertiary",
    game: "valorant",
    gameLabel: "VALORANT",
    gameLogo: gameLogos.valorant,
    feature: {
      label: "VOP",
      name: "Black",
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
      { name: "George Zhou", username: "SEN tence", role: "teammate" },
      { name: "Ella Kaplan", username: "HockeySportsGuy", role: "IGL" },
      { name: "Ryan Lin", username: "Ethereal", role: "teammate" },
      { name: "Cho Man Bian", username: "Kira", role: "teammate" },
      { name: "TBA", username: "TBA", role: "teammate" },
    ],
  },
  {
    slug: "ruby",
    name: "VOP Ruby",
    label: "Marginalized",
    image: "/images/lavender.avif",
    accent: "primary",
    game: "valorant",
    gameLabel: "VALORANT",
    gameLogo: gameLogos.valorant,
    feature: {
      label: "VOP",
      name: "Ruby",
      image: valorantAgentPortraits.clove,
      summary: "Resilient controller play and fearless second-chance energy.",
    },
    requirements: [
      "Rank: Open rank",
      "Eligibility: Marginalized genders",
      "Access: Dedicated tryout process",
    ],
    paragraphs: [
      "VOP Ruby is our dedicated space for players of marginalized genders (women, non-binary, and genderqueer competitors).",
      "We are committed to fostering an inclusive, high-level competitive environment and a strong support network for gender-diverse gamers.",
    ],
    proof:
      "Entry into VOP Ruby is strictly through a formal tryout process. If you are ready to prove your skills and grow within a dedicated community:",
    staff: [],
    roster: [
      { name: "Katelyn Nguyen", username: "kate", role: "teammate" },
      { name: "Lucy Zheng", username: "Tyjihn", role: "teammate" },
      { name: "Jessica Wang", username: "zuyi", role: "teammate" },
      { name: "TBA", username: "TBA", role: "teammate" },
      { name: "TBA", username: "TBA", role: "teammate" },
      { name: "Ella Kaplan", username: "HockeySportsGuy", role: "sub" },
    ],
  },
  {
    slug: "league1",
    name: "VOP Elder",
    label: "Varsity",
    image: "/images/red.avif",
    accent: "tertiary",
    game: "league",
    gameLabel: "League of Legends",
    gameLogo: gameLogos.league,
    feature: {
      label: "VOP",
      name: "Elder Dragon",
      image: leagueCreatureRenders.elderDragon,
      summary: "Late-game power, decisive teamfights, and a relentless finish.",
    },
    requirements: [
      "Rank: Open rank",
      "Commitment: Flexible customs and review",
      "Access: Community signups",
    ],
    paragraphs: [
      "VOP Elder is the heart of VOP's open-rank community. Whether you are new to the game or just looking for a consistent squad to vibe with, this is your home.",
      "We focus on balanced 5v5 customs where the goal is to learn, improve, and meet the people who make this organization great.",
    ],
    proof:
      "Entry into VOP Elder is community-oriented. If you want to improve, queue with a squad, and represent the Red side of VOP:",
    staff: [],
    roster: [{ name: "TBA", username: "TBA", role: "teammate" }],
  },
  {
    slug: "league2",
    name: "VOP Baron",
    label: "Development",
    image: "/images/blue.avif",
    accent: "primary",
    game: "league",
    gameLabel: "League of Legends",
    gameLogo: gameLogos.league,
    feature: {
      label: "VOP",
      name: "Baron Nashor",
      image: leagueCreatureRenders.baronNashor,
      summary: "Objective control, coordinated pressure, and game-changing pushes.",
    },
    requirements: [
      "Rank: Open rank",
      "Commitment: Flexible customs and review",
      "Access: Community signups",
    ],
    paragraphs: [
      "VOP Baron is the heart of VOP's open-rank community. Whether you are new to the game or just looking for a consistent squad to vibe with, this is your home.",
      "We focus on balanced 5v5 customs where the goal is to learn, improve, and meet the people who make this organization great.",
    ],
    proof:
      "Entry into VOP Baron is community-oriented. If you want to improve, queue with a squad, and represent the Blue side of VOP:",
    staff: [],
    roster: [{ name: "TBA", username: "TBA", role: "teammate" }],
  },
];
