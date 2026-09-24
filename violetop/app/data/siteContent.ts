export const siteMeta = {
  title: "NYU Violet OP",
  description:
    "Violet OP is a collegiate esports community at New York University for VALORANT, League of Legends, events, and creative collaboration.",
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
    image: "/images/red.avif",
    summary:
      "VOP Ruby is our dedicated space for players of marginalized genders (women, non-binary, and genderqueer competitors).",
  },
];

export const leagueTeams = [
  {
    name: "VOP Elder",
    href: "/league1",
    tier: "Open rank",
    image: "/images/tealvoplogo.png",
    summary:
      "VOP Elder is an open-rank League of Legends roster built around flexible customs, review, and a consistent squad.",
  },
  {
    name: "VOP Baron",
    href: "/league2",
    tier: "Open rank",
    image: "/images/limevoplogo.png",
    summary:
      "VOP Baron is an open-rank League of Legends roster for team play, learning, and community.",
  },
];

export const allTeams = [...valorantTeams, ...leagueTeams];

export const homeContent = {
  eyebrow: "NYU Violet OP",
  body:
    "Based at New York University, Violet OP brings players together through VALORANT and League of Legends rosters, open-rank play, events, and creative work.",
  join:
    "Find a competitive roster, meet people in our community, or help make the next event happen.",
};

export const homeFaqs = [
  {
    question: "Do I Need to Be an NYU Student?",
    answer:
      "Violet OP is based at NYU, and the Discord and community events welcome people beyond campus. Ask the team about eligibility for a specific competitive roster.",
  },
  {
    question: "What If I'm New to Competitive Play?",
    answer:
      "There are open-rank paths alongside selective tryouts. Browse each team's requirements, or start by meeting people in Discord.",
  },
  {
    question: "How Much Time Does It Take?",
    answer:
      "Commitment depends on the path. Some rosters have structured practice, while community play is more flexible. Each listing on Join Us gives the current details.",
  },
  {
    question: "How Do I Join?",
    answer:
      "Join Discord to connect with the community. For a roster or staff role, use the open applications on Join Us; filled roles are marked there.",
  },
];

export type MemberImage = {
  src: string;
  focalPoint?: string;
  fit?: "cover" | "contain";
};

const memberImages = {
  katelyn: { src: "/images/katelyn.avif", focalPoint: "50% 9%" },
  logan: { src: "/images/logan.avif", focalPoint: "50% 7%" },
  eric: { src: "/images/eric.avif", focalPoint: "50% 5%" },
  augus: { src: "/images/augus.avif", focalPoint: "50% 8%" },
  jessica: { src: "/images/jessica.avif", focalPoint: "50% 7%" },
  emily: { src: "/images/emily.avif", focalPoint: "50% 8%" },
  kuan: { src: "/images/kuan.avif", focalPoint: "50% 6%" },
  artus: { src: "/images/artus.avif", focalPoint: "50% 7%" },
  alston: { src: "/images/alston.avif", focalPoint: "50% 5%" },
  ella: { src: "/images/ella.avif", focalPoint: "50% 8%" },
} satisfies Record<string, MemberImage>;

export const aboutContent = {
  title: "Who We Are",
  image: "/images/groupphoto.avif",
  paragraphs: [
    "Violet OP is a collegiate esports organization based at New York University. Its rosters span selective and open-rank competition, while events, content, and community play give players and fans ways to take part.",
    "We compete across multiple tiers of competition, ranging from high rank elite roster to open rank teams, making it easy for players of all skill levels to get involved.",
    "As a team, we're all about building a strong community, whether that's through competition, content, or just connecting people who love gaming.",
    "VOP is a space where players and fans alike can get involved, support each other, and be part of something bigger.",
  ],
  sections: [
    {
      eyebrow: "VOP E-Board",
      heading: "Executive Leadership",
      people: [
        { name: "Katelyn Nguyen", role: "President", image: memberImages.katelyn },
        { name: "Logan Tsai", role: "General Manager", image: memberImages.logan },
        { name: "Eric Qi", role: "Secretary", image: memberImages.eric },
        { name: "Augus Li", role: "Human Resources", image: memberImages.augus },
      ],
    },
    {
      eyebrow: "VOP E-Board",
      heading: "Competitive Department",
      people: [
        {
          name: "Jessica Wang",
          role: "VALORANT Esports Leader / GC Team Manager",
          image: memberImages.jessica,
        },
        {
          name: "Katelyn Nguyen",
          role: "Team Manager - Purple, Black",
          image: memberImages.katelyn,
        },
        {
          name: "Logan Tsai",
          role: "Team Manager - White / Coach & Analyst / Scouting Lead",
          image: memberImages.logan,
        },
        {
          name: "Emily Chen",
          role: "League of Legends Esports Leader",
          image: memberImages.emily,
        },
      ],
    },
    {
      eyebrow: "VOP E-Board",
      heading: "Events Department",
      people: [
        { name: "Charice Huang", role: "Head of Event Coordination" },
        { name: "Kuan Lin", role: "Event Designer/Helper", image: memberImages.kuan },
        {
          name: "Katelyn Nguyen",
          role: "Tournament Operations Lead",
          image: memberImages.katelyn,
        },
        { name: "Logan Tsai", role: "Tournament Operations Lead", image: memberImages.logan },
      ],
    },
    {
      eyebrow: "VOP E-Board",
      heading: "Creative Department",
      people: [
        { name: "Emily Chen", role: "Website Leader", image: memberImages.emily },
        { name: "Barry Chen", role: "Website Leader" },
        {
          name: "Artus Yeh",
          role: "Head of Marketing / Head of Design",
          image: memberImages.artus,
        },
      ],
    },
    {
      eyebrow: "VOP E-Board",
      heading: "Marketing & Growth",
      people: [
        {
          name: "Katelyn Nguyen",
          role: "Social Media Manager / Community Discord Manager",
          image: memberImages.katelyn,
        },
        { name: "Logan Tsai", role: "Social Media Manager", image: memberImages.logan },
        { name: "Eric Qi", role: "Social Media Manager", image: memberImages.eric },
        { name: "Nahian Sowalehin", role: "Head of Communications, Operations & Outreach" },
        { name: "Alston Li", role: "Campus Outreach Team/Partnership", image: memberImages.alston },
      ],
    },
    {
      eyebrow: "VOP E-Board",
      heading: "Finance",
      people: [
        {
          name: "Ella Kaplan",
          role: "Head of Financial Planning and Budgeting",
          image: memberImages.ella,
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
        "Eligibility: Previous VOP Black members or subs for Purple tryouts",
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
        "Rank: Open rank",
        "Student eligibility: Full-time NYU degree-seeking, in good academic standing",
        "Gender eligibility: Women and marginalized genders",
        "Participation: Open to media and events on or off campus",
        "Commitment: Medium/Flexible",
      ],
    },
    {
      name: "VOP Elder",
      game: "league",
      filled: false,
      joinHref: "https://forms.gle/24E8hzA8vopwxxZK7",
      details: ["Requirements: Open rank", "Access: Shared League of Legends tryout form"],
    },
    {
      name: "VOP Baron",
      game: "league",
      filled: false,
      joinHref: "https://forms.gle/24E8hzA8vopwxxZK7",
      details: ["Requirements: Open rank", "Access: Shared League of Legends tryout form"],
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
      question: "Do I Have to Be an NYU Student?",
      answer:
        "Violet OP is based at NYU, and the broader community is welcome at events and in Discord. Ask the team about eligibility for a specific competitive roster.",
    },
    {
      question: "How Do I Move from Black to Purple or White?",
      answer:
        "The transition from community play to our elite rosters is based on performance, attitude, and scouting.",
    },
    {
      question: "What If I Don't Play the Current Main Games?",
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
  subtitle: "VALORANT Videos",
  intro:
    "Watch recorded Violet OP VALORANT matches and moments from the team.",
  clips: [
    {
      id: "BUTEgoy3bXo",
      title: "WE DESERVE LAN... (NYU vs UMICH)",
      url: "https://www.youtube.com/watch?v=BUTEgoy3bXo",
    },
    {
      id: "cWTQb-wiOSI",
      title: "This Match is a HARD WATCH... (NYU vs RMU)",
      url: "https://www.youtube.com/watch?v=cWTQb-wiOSI",
    },
    {
      id: "Rx-xkubvrjs",
      title: "How it sounds to win our first game of the season (NYU vs USNA)",
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
      "Commitment: Daily scrims, VOD reviews, LAN travel",
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
        role: "Joe",
        username: "zyng",
        detail: "Head Coach",
      },
      {
        role: "TBA",
        detail: "Assistant Coach and Analyst",
      },
    ],
    roster: [
      { name: "Jake Rivera", username: "ajek2", role: "IGL" },
      { name: "Brandon Wu", username: "Brandon", role: "player" },
      { name: "Lucas Li", username: "fqll3n", role: "player" },
      { name: "Sajal Kaushik", username: "alpha9_", role: "player" },
      { name: "Ricky Zou", username: "solongyixia", role: "player" },
      { name: "Tyler Huynh", username: "tylorui", role: "super sub" },
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
      "Eligibility: Previous VOP Black member or sub for Purple tryouts",
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
      "VOP Purple uses the shared Purple/Black tryout form. The current form limits Purple tryouts to previous VOP Black members or subs.",
    staff: [
      { role: "Wayne Yee", username: "sumire", detail: "Coach" },
      { role: "Logan Tsai", username: "Phan10mX", detail: "Assistant Coach" },
    ],
    roster: [
      { name: "Evan Lee", username: "Soggy Bread", role: "IGL" },
      { name: "Logan Tsai", username: "Phan10mX", role: "player" },
      { name: "Eric Qi", username: "rickpizzaisgood", role: "player" },
      { name: "Nahian Sowalehin", username: "nahianishot", role: "player" },
      { name: "Kuan Lin", username: "Nauk", role: "player" },
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
      "Commitment: Low / flexible practice",
      "Access: Seasonal tryouts",
    ],
    paragraphs: [
      "VOP Black is the primary entry point into our competitive ecosystem. This roster focuses on identifying raw talent and integrating players into a professional team structure.",
      "As the foundational tier of our program, VOP Black is dedicated to developing the mechanical consistency and communication skills necessary to eventually transition into our senior rosters.",
    ],
    proof:
      "Entry into VOP Black is strictly through a formal tryout process. If you want to have fun, join a community, and represent the Black jersey:",
    staff: [{ role: "Brandon Wu", username: "Brandon", detail: "Coach" }],
    roster: [
      { name: "Ella Kaplan", username: "HockeySportsGuy", role: "IGL" },
      { name: "Ryan Lin", username: "Ethereal", role: "player" },
      { name: "Cho Man Bian", username: "Kira", role: "player" },
      { name: "Malik Umar", username: "toji", role: "player" },
      { name: "Magnus Wong", username: "sapphire", role: "player" },
      { name: "George Zhou", username: "SEN tence", role: "sub" },
      { name: "Dan Huang", username: "2t1cks", role: "sub" },
      { name: "Tony Lam", username: "yl9341", role: "sub" },
      { name: "Anna Zhang", username: "fufubawls", role: "sub" },
    ],
  },
  {
    slug: "ruby",
    name: "VOP Ruby",
    label: "Marginalized",
    image: "/images/red.avif",
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
      "Student eligibility: Full-time NYU degree-seeking, in good academic standing",
      "Gender eligibility: Women and marginalized genders",
      "Participation: Open to media and events on or off campus",
      "Commitment: Medium / flexible",
      "Access: Dedicated tryout process",
    ],
    paragraphs: [
      "VOP Ruby is our dedicated space for players of marginalized genders (women, non-binary, and genderqueer competitors).",
      "We are committed to fostering an inclusive, high-level competitive environment and a strong support network for gender-diverse gamers.",
    ],
    proof:
      "Entry into VOP Ruby is strictly through a formal tryout process. If you are ready to prove your skills and grow within a dedicated community:",
    staff: [{ role: "Nicholas Lui", username: "lui", detail: "Coach" }],
    roster: [
      { name: "Katelyn Nguyen", username: "kate", role: "player" },
      { name: "Jessica Wang", username: "zuyi", role: "player" },
      { name: "Lucy Zheng", username: "Tyjihn", role: "player" },
      { name: "Anna Zhang", username: "fufubawls", role: "player" },
      { name: "Emily Chen", username: "strawberrycow", role: "player" },
      { name: "Ella Kaplan", username: "HockeySportsGuy", role: "sub" },
    ],
  },
  {
    slug: "league1",
    name: "VOP Elder",
    label: "Open rank",
    image: "/images/tealvoplogo.png",
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
      "Access: Shared League of Legends tryout form",
    ],
    paragraphs: [
      "VOP Elder is one of Violet OP's open-rank League of Legends rosters, with space to learn alongside a consistent squad.",
      "We focus on balanced 5v5 customs where the goal is to learn, improve, and meet the people who make this organization great.",
    ],
    proof:
      "VOP Elder uses the shared League of Legends tryout form. Check the current joining page for details.",
    staff: [],
    roster: [
      { name: "Kuan Lin", username: "Nauk", role: "Top" },
      { name: "Sara Murphy", username: "dlcre", role: "Jungle" },
      { name: "Chris He", username: "chrissppy", role: "Middle" },
      { name: "David Shen", username: "snazzybeatle", role: "Bottom" },
      { name: "Marissa Yang", username: "iluvv.mari", role: "Support" },
    ],
  },
  {
    slug: "league2",
    name: "VOP Baron",
    label: "Open rank",
    image: "/images/limevoplogo.png",
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
      "Access: Shared League of Legends tryout form",
    ],
    paragraphs: [
      "VOP Baron is one of Violet OP's open-rank League of Legends rosters, with space for team play and community.",
      "We focus on balanced 5v5 customs where the goal is to learn, improve, and meet the people who make this organization great.",
    ],
    proof:
      "VOP Baron uses the shared League of Legends tryout form. Check the current joining page for details.",
    staff: [],
    roster: [
      { name: "Alston Li", username: "chineseperson12", role: "Top" },
      { name: "Rachel Cheng", username: "shampoo2119", role: "Jungle" },
      { name: "Tim Shi", username: "tsbear66f", role: "Middle" },
      { name: "Augus Li", username: "blink", role: "Bottom" },
      { name: "Emily Chen", username: "strawberrycow", role: "Support" },
      { name: "Cho Man Bian", username: "Kira", role: "Support / sub" },
    ],
  },
];
