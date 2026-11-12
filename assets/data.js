/* Many Mansions — quiz data.
   Every axis is scored 0–100 = percent toward the RIGHT pole.
   Question d: +1 means agreeing pushes toward the right pole, -1 toward the left. */
(function (root) {
  const FAMILIES = {
    faith:     { name: 'Faith',     color: 'var(--fam-faith)' },
    culture:   { name: 'Culture',   color: 'var(--fam-culture)' },
    community: { name: 'Community', color: 'var(--fam-community)' },
    worldview: { name: 'Worldview', color: 'var(--fam-worldview)' }
  };

  const AXES = [
    { key: 'doc', name: 'Doctrine', fam: 'faith', left: 'By the Book', right: 'Big Picture',
      note: 'How you relate to rules and counsel: exact obedience to the letter, or the spirit and context behind it.' },
    { key: 'std', name: 'Testimony', fam: 'faith', left: 'Study & Reason', right: 'Feeling & Prayer',
      note: 'Where your faith gets its fuel: deep study and evidence, or personal spiritual experience.' },
    { key: 'wor', name: 'Worship', fam: 'faith', left: 'Sacred Ritual', right: 'Daily Service',
      note: 'Where you feel closest to God: temple and ordinances, or everyday acts of service.' },
    { key: 'roo', name: 'Roots', fam: 'culture', left: 'Zion Core', right: 'Mission Field',
      note: 'Whether you live surrounded by members (the Wasatch Front experience) or as a minority faith.' },
    { key: 'her', name: 'Heritage', fam: 'culture', left: 'Pioneer Stock', right: 'Fresh Start',
      note: 'Multi-generation pioneer heritage, or first- and second-generation members writing a new story.' },
    { key: 'wow', name: 'Lifestyle', fam: 'culture', left: 'Caffeine-Free', right: 'Dirty Soda',
      note: 'How strictly you read the Word of Wisdom beyond the basics. No wrong answers, only drink orders.' },
    { key: 'wrd', name: 'Ward Life', fam: 'community', left: 'Activity Committee', right: 'Back Row',
      note: 'Whether ward life energizes you, or you prefer to worship quietly and go home.' },
    { key: 'shr', name: 'Sharing', fam: 'community', left: 'Every-Member Missionary', right: 'Quiet Faith',
      note: 'How openly you talk about the gospel with friends, coworkers and online.' },
    { key: 'hom', name: 'Home', fam: 'community', left: 'Big Family', right: 'Small & Simple',
      note: 'Your family-life ideal: a packed pew and huge reunions, or a smaller, simpler home.' },
    { key: 'pol', name: 'Politics', fam: 'worldview', left: 'Conservative', right: 'Progressive',
      note: 'Where you land on public policy. Members are found all across this line.' },
    { key: 'his', name: 'History', fam: 'worldview', left: 'History Buff', right: 'Present Focus',
      note: 'How much Church history (Nauvoo, Kirtland, the pioneers) shapes your faith today.' },
    { key: 'med', name: 'Media', fam: 'worldview', left: 'Conference Classic', right: 'LDS Internet',
      note: 'Where your gospel content comes from: Conference and the Liahona, or podcasts and creators.' }
  ];

  // 5 statements per axis. Quick uses #1–2, Full uses #1–4, #5 is the swap spare.
  const Q = {
    doc: [
      ['If the handbook says it, that settles it for me.', -1],
      ['I think some Church practices are more about culture than doctrine.', 1],
      ['Following counsel exactly, even in the small details, matters a lot to me.', -1],
      ["I'm comfortable living with questions that don't have answers yet.", 1],
      ["I follow prophetic counsel even when I don't understand the reason.", -1]
    ],
    std: [
      ["I'd rather dig into footnotes and cross-references than just read the chapter.", -1],
      ['A feeling from the Spirit matters more to me than a well-reasoned argument.', 1],
      ['I keep study notes, a gospel journal or heavily marked-up scriptures.', -1],
      ['My testimony rests more on personal experiences than on evidence.', 1],
      ['I enjoy scholarship, apologetics and Book of Mormon geography debates.', -1]
    ],
    wor: [
      ['The temple is the center of my spiritual life.', -1],
      ["I feel closest to God when I'm serving someone.", 1],
      ['Ordinances and covenants are the heart of the gospel for me.', -1],
      ['Bringing dinner to a struggling family is worship, as much as anything on Sunday.', 1],
      ['I try to attend the temple as often as I possibly can.', -1]
    ],
    roo: [
      ['Most of my neighbors are members of the Church.', -1],
      ["I'm used to being the only Latter-day Saint in the room.", 1],
      ['I know what funeral potatoes are, and I have opinions about them.', -1],
      ["Explaining my beliefs to people who've never met a member is normal for me.", 1],
      ['BYU sports are a big deal in my house.', -1]
    ],
    her: [
      ['I can name ancestors who crossed the plains.', -1],
      ['I joined the Church as a teen or adult, or my parents did.', 1],
      ['Family history and pioneer stories are a big part of who I am.', -1],
      ['Church culture still sometimes feels new or surprising to me.', 1],
      ['Pioneer Day (July 24) genuinely means something to me.', -1]
    ],
    wow: [
      ['I avoid caffeinated soda, just to be safe.', -1],
      ['A dirty soda run is a perfectly good way to spend a Tuesday.', 1],
      ['I live the Word of Wisdom more strictly than the minimum.', -1],
      ['Energy drinks and caffeine are a personal choice, not a spiritual issue.', 1],
      ['Green tea and kombucha make me a little nervous.', -1]
    ],
    wrd: [
      ["I'd volunteer to organize the ward Christmas party.", -1],
      ["I'd rather slip in, feel the Spirit, and head home.", 1],
      ['Ward activities are one of my favorite parts of Church.', -1],
      ["I'd rather not be asked to give a talk or say the opening prayer.", 1],
      ['I know most people in my ward by name.', -1]
    ],
    shr: [
      ['I look for chances to share the gospel with friends.', -1],
      ["My faith is personal, and I rarely bring it up at work or school.", 1],
      ["I'd post a General Conference quote on my social media.", -1],
      ["I'd rather show my beliefs through how I live than talk about them.", 1],
      ["Inviting someone to church doesn't feel awkward to me.", -1]
    ],
    hom: [
      ['I want, or already have, a big family.', -1],
      ["Family size is nobody else's business, including at church.", 1],
      ['A full minivan on Sunday morning sounds like the dream.', -1],
      ["I'd rather pour into a small household than have a big one.", 1],
      ['Big family reunions energize me.', -1]
    ],
    pol: [
      ['Traditional values should guide public policy.', -1],
      ['Members should lead the way on welcoming immigrants and refugees.', 1],
      ['I usually vote for the more conservative candidate.', -1],
      ["I'd like to see more members speak up about caring for the environment.", 1],
      ['Government should stay small so families and churches can do more.', -1]
    ],
    his: [
      ["I've read the Saints history volumes, or I want to.", -1],
      ['What matters is living the gospel today, not what happened in the 1800s.', 1],
      ['I could talk for an hour about Nauvoo or Kirtland.', -1],
      ["Church history details don't affect my faith much either way.", 1],
      ["I've visited, or dream of visiting, Church history sites.", -1]
    ],
    med: [
      ['I watch every session of General Conference live.', -1],
      ['I get a lot of my gospel content from podcasts, TikTok or Instagram.', 1],
      ['The Tabernacle Choir is my Sunday soundtrack.', -1],
      ['I follow Latter-day Saint creators and influencers.', 1],
      ["I'd rather read the Liahona than scroll church content online.", -1]
    ]
  };

  const QUESTIONS = [];
  AXES.forEach(a => Q[a.key].forEach(([text, d], i) => QUESTIONS.push({ id: a.key + i, axis: a.key, text, d, slot: i })));

  const PROFILE = [
    { key: 'member', title: 'Your story', q: 'Which best describes you?',
      opts: ['Lifelong member', 'Convert', 'Coming back to church', 'Friend of the Church', 'Former member'] },
    { key: 'mission', title: 'Mission', q: 'Have you served a mission?',
      opts: ['Returned missionary', 'Serving right now', 'Planning to serve', "Didn't serve"] },
    { key: 'region', title: 'Where you live', q: 'Where do you live?',
      opts: ['Utah, Idaho or Arizona', 'Elsewhere in the US or Canada', 'Latin America', 'Africa', 'Europe', 'Asia or the Pacific'] }
  ];

  // Profiles in AXES order: doc std wor roo her wow wrd shr hom pol his med
  const T = (slug, name, tag, v, quote, blurb, strengths, watch, calling) =>
    ({ slug, name, tag, v, quote, blurb, strengths, watch, calling });

  const TYPES = [
    T('seminary-scholar', 'The Seminary Scholar', 'Studious · Devoted',
      [25, 15, 45, 40, 40, 25, 35, 40, 45, 35, 15, 30],
      'I have a highlighter color for every gospel topic.',
      'You treat the scriptures like a lifelong research project. Cross-references, footnotes and the Bible Dictionary are your happy place, and your Sunday School comments make everyone grab a pen.',
      ['Deep doctrinal knowledge', 'Teaches with clarity', 'Steady, study-built testimony'],
      'Remember that not everyone learns from footnotes. Leave space for the quiet, feeling-first members in class.',
      'Gospel Doctrine teacher'),
    T('relief-society-powerhouse', 'The Relief Society Powerhouse', 'Organized · Caring',
      [35, 55, 80, 35, 40, 45, 10, 35, 30, 40, 55, 45],
      "If someone's moving, I've already got the casseroles scheduled.",
      "You're the person the ward calls first. Meal trains, move-in crews and baby showers run on your spreadsheets, and your faith shows up as action.",
      ['Turns love into logistics', 'Knows everyone', 'Shows up first'],
      'Let others serve you sometimes. Burnout is real even for powerhouses.',
      'Compassionate service coordinator'),
    T('pioneer-purist', 'The Pioneer Purist', 'Traditional · Rooted',
      [10, 35, 35, 15, 5, 10, 35, 35, 10, 15, 10, 15],
      'My great-great-grandma pulled a handcart, and I think about it weekly.',
      'Heritage runs deep in you. You honor the sacrifices that built Zion, keep the traditions, and like your faith with the classics: hymns, Conference and family history.',
      ['Rock-solid commitment', 'Keeper of family stories', 'Lives the standards fully'],
      "Not everyone's story starts on the plains. Make room for converts and newcomers in yours.",
      'Family history consultant'),
    T('dirty-soda-diplomat', 'The Dirty Soda Diplomat', 'Social · Easygoing',
      [55, 65, 60, 15, 35, 90, 25, 50, 40, 45, 70, 85],
      'Coconut cream, extra lime, and a testimony.',
      "You're warm, fun and plugged into modern member culture. You know the best soda shop in three counties and you make church feel welcoming for people who think it's stiff.",
      ['Makes church feel human', 'Great at friendship', 'Culturally fluent'],
      "Fun is a gift. Pair it with depth so friends see what's under the lime.",
      'Activities committee'),
    T('convert-trailblazer', 'The Convert Trailblazer', 'Passionate · New Roots',
      [35, 50, 55, 85, 95, 25, 30, 10, 50, 50, 45, 50],
      'I found this, and I want everyone to know.',
      "Your faith was chosen, not inherited, and it shows. You bring fresh eyes, real conviction and a story that other people can't stop listening to.",
      ['Contagious conviction', 'Brave and honest', 'Bridges two worlds'],
      'Church culture can be confusing. Ask questions freely; lifelong members learn from you too.',
      'Ward mission leader'),
    T('temple-regular', 'The Temple Regular', 'Reverent · Covenant-Centered',
      [25, 70, 10, 45, 45, 20, 45, 45, 40, 35, 40, 25],
      'My favorite part of the week is the quiet of the temple.',
      "The house of the Lord is your anchor. You schedule life around temple trips, carry family names with you and find peace in covenants that others feel only on special occasions.",
      ['Deep spiritual peace', 'Covenant-keeper', 'Calm in hard times'],
      'Share that peace out loud now and then. People around you want to know where it comes from.',
      'Temple worker'),
    T('back-row-believer', 'The Back-Row Believer', 'Low-Key · Faithful',
      [60, 70, 60, 50, 50, 65, 90, 85, 55, 50, 60, 55],
      'I sit in the back, but I never miss a week.',
      "You're not loud about it, but you're always there. You worship your own way, skip the spotlight, and your faithfulness is the kind nobody notices until you're gone.",
      ['Consistent', 'Unpretentious', 'Good listener'],
      'Your perspective matters. Say the comment you are thinking in Sunday School once in a while.',
      'Ward clerk'),
    T('nuanced-navigator', 'The Nuanced Navigator', 'Thoughtful · Questioning',
      [90, 25, 55, 55, 50, 70, 60, 75, 65, 75, 25, 70],
      "I've read every Gospel Topics Essay, and I'm still here.",
      "You've looked hard at the difficult questions and chosen to stay, holding faith and complexity together. You're the person struggling members feel safe talking to.",
      ['Intellectual honesty', 'Safe space for doubters', 'Faith with depth'],
      'Nuance can drift into distance. Keep the practices that keep you close.',
      'Institute teacher'),
    T('forever-missionary', 'The Forever Missionary', 'Bold · Mission-Minded',
      [25, 45, 50, 40, 40, 20, 15, 5, 30, 30, 50, 40],
      "I still say 'elder' when I mean 'dude.'",
      'Your mission never really ended. You still share the gospel with anyone, still do splits in your head, and your mission stories have their own playlist.',
      ['Fearless sharing', 'Disciplined habits', 'Natural testimony'],
      'Not every conversation is a teaching appointment. Friendship first works too.',
      'Ward missionary'),
    T('ward-party-planner', 'The Ward Party Planner', 'Energetic · Connector',
      [50, 75, 75, 25, 40, 60, 5, 30, 25, 40, 70, 65],
      "Trunk-or-treat doesn't run itself.",
      "Chili cook-offs, Christmas pageants and Pioneer Day breakfasts: you're the reason the ward actually knows each other. Community is your love language.",
      ['Builds belonging', 'Creative and energetic', 'Gets people in the door'],
      "Busy isn't the same as fed. Make time for your own quiet study.",
      'Activities committee chair'),
    T('gospel-content-creator', 'The Gospel Content Creator', 'Online · Modern',
      [50, 60, 55, 30, 50, 70, 30, 15, 35, 45, 65, 98],
      'Come Follow Me in 60 seconds. Link in bio.',
      'You live where faith meets the feed. Podcasts, Reels and a carefully curated Instagram are how you learn and share, and you reach people a chapel never could.',
      ['Reaches the next generation', 'Creative communicator', 'Always current'],
      "Algorithms reward outrage. Keep your feed pointed at Christ, not controversy.",
      'Ward communications specialist'),
    T('quiet-disciple', 'The Quiet Disciple', 'Humble · Service-First',
      [40, 75, 85, 55, 50, 35, 70, 80, 50, 45, 55, 25],
      "Nobody saw me shovel the bishop's driveway. That's the point.",
      "You do your discipleship quietly. You notice the person sitting alone, mow the lawn before anyone asks, and let your service do the talking.",
      ['Christlike humility', 'Notices the overlooked', 'Service without credit'],
      "Quiet is beautiful, but don't hide your light completely. Your example teaches.",
      'Ministering brother or sister'),
    T('history-detective', 'The Church History Detective', 'Curious · Analytical',
      [65, 10, 45, 40, 30, 50, 55, 60, 55, 55, 5, 55],
      "Ask me about Kirtland. Actually, don't. We'll be here for hours.",
      "Journals, Joseph Smith Papers, old maps: you love the real story with all its texture. Church history isn't a threat to you, it's a treasure hunt.",
      ['Encyclopedic knowledge', 'Loves primary sources', 'Brings history to life'],
      "Not everyone needs the footnotes. Lead with the faith in the story.",
      'Church history specialist'),
    T('global-saint', 'The Global Saint', 'Worldly · Inclusive',
      [45, 50, 50, 95, 70, 35, 30, 30, 45, 55, 50, 50],
      'My ward speaks three languages and runs one excellent potluck.',
      "You know the Church as a worldwide family, not a Utah export. You're at home in a branch of thirty people and you see the gospel through many cultures.",
      ['Cross-cultural wisdom', 'Welcoming to everyone', 'Sees the big picture'],
      'Not every member has your range. Be patient with the ones who only know one culture.',
      'Branch president'),
    T('primary-parent', 'The Primary Parent', 'Busy · Family-First',
      [35, 65, 70, 30, 40, 50, 40, 45, 5, 35, 70, 55],
      'Sacrament meeting is a contact sport.',
      "Cheerios in the hymnbook, a toddler under the pew, and you're still there every week. Your faith is lived in the chaos of a full home, and it is very real.",
      ['Endless patience', 'Faith that works under pressure', 'Raising the next generation'],
      "You can't pour from an empty cup. Take the five quiet minutes when they come.",
      'Primary president'),
    T('progressive-saint', 'The Progressive Saint', 'Compassionate · Reform-Minded',
      [85, 55, 75, 60, 55, 75, 55, 70, 75, 95, 45, 75],
      "'Love one another' is the whole assignment.",
      'For you, the gospel is a call to compassion and justice. You lead with Christ\'s love for the marginalized and push your community to widen the circle.',
      ['Big-hearted', 'Advocates for the overlooked', 'Brave voice'],
      'Not everyone in the pew sees it your way. Stay in the room; your presence matters.',
      'Humanitarian service missionary')
  ];

  const F = (name, era, v, line) => ({ name, era, v, line });
  const FIGURES = [
    F('Nephi', 'Book of Mormon', [10, 25, 35, 60, 30, 15, 30, 30, 30, 25, 15, 20], 'Goes and does, and keeps a very detailed record of it.'),
    F('Ammon', 'Book of Mormon', [35, 60, 85, 85, 60, 40, 20, 5, 50, 50, 50, 50], 'Serves first, shares the gospel second, guards the flocks always.'),
    F('Captain Moroni', 'Book of Mormon', [15, 55, 70, 30, 20, 20, 10, 20, 40, 20, 35, 30], 'Writes a manifesto on his coat and rallies the whole city.'),
    F('Alma the Younger', 'Book of Mormon', [50, 40, 50, 70, 90, 50, 30, 10, 50, 55, 45, 50], 'A total turnaround story who never stops telling it.'),
    F('Mormon', 'Book of Mormon', [20, 10, 45, 40, 25, 25, 45, 50, 40, 35, 3, 15], 'Abridged a thousand years of records. The original history buff.'),
    F('Abish', 'Book of Mormon', [50, 80, 70, 80, 90, 40, 80, 40, 55, 50, 50, 45], 'Quiet faith for years, then the bravest move in the room.'),
    F('Enos', 'Book of Mormon', [50, 95, 40, 55, 40, 35, 85, 85, 60, 45, 45, 25], 'Prays all day and all night, and gets an answer.'),
    F('Ruth', 'Old Testament', [45, 75, 80, 90, 95, 40, 60, 60, 35, 50, 50, 40], '"Whither thou goest, I will go." A convert who chose her people.'),
    F('Esther', 'Old Testament', [60, 50, 50, 75, 50, 50, 70, 70, 50, 55, 50, 50], 'Quiet until the moment called for courage. Then unstoppable.'),
    F('Deborah', 'Old Testament', [40, 70, 60, 30, 30, 40, 15, 25, 50, 55, 40, 60], 'A judge and leader who sits under her palm tree and settles things.'),
    F('Mary, mother of Jesus', 'New Testament', [30, 85, 40, 50, 50, 30, 75, 85, 30, 45, 50, 20], 'Keeps the sacred things and ponders them in her heart.'),
    F('Martha', 'New Testament', [35, 60, 90, 30, 40, 45, 5, 40, 25, 40, 60, 50], 'Hosts the dinner, runs the kitchen, and has strong faith.'),
    F('Peter', 'New Testament', [55, 75, 60, 40, 70, 55, 10, 5, 40, 50, 70, 70], 'First to jump out of the boat. Every time.'),
    F('Paul', 'New Testament', [70, 15, 55, 90, 85, 50, 20, 5, 90, 55, 40, 60], 'Writes long letters, travels everywhere, argues brilliantly.')
  ];

  const M = (name, v, line) => ({ name, v, line });
  const MISSIONS = [
    M('Japan Tokyo Mission', [30, 40, 50, 90, 70, 15, 60, 60, 70, 50, 50, 40], 'Patient, precise and quietly devoted. Every convert is hard-won and treasured.'),
    M('Peru Lima Mission', [40, 65, 65, 85, 70, 40, 20, 20, 15, 45, 55, 50], 'Big families, big hearts, and more ceviche than you can eat.'),
    M('Uganda Kampala Mission', [35, 70, 70, 95, 90, 30, 15, 10, 25, 45, 60, 55], 'One of the fastest-growing areas of the Church. Pure joy and boda-bodas.'),
    M('Philippines Manila Mission', [40, 70, 60, 90, 80, 40, 10, 15, 20, 45, 60, 70], 'Karaoke after baptisms and the warmest members on earth.'),
    M('Brazil São Paulo Mission', [50, 70, 65, 85, 75, 50, 10, 15, 30, 50, 60, 65], 'Huge city, huge wards, and someone always has a churrasco going.'),
    M('England London Mission', [65, 30, 45, 80, 60, 45, 55, 55, 70, 60, 15, 50], 'Thoughtful conversations, early Church history and a lot of rain.'),
    M('Utah Salt Lake City Temple Square Mission', [30, 35, 40, 10, 15, 30, 30, 15, 40, 40, 10, 30], 'Welcome the world at the heart of it all, in every language.'),
    M('Ghana Accra Mission', [35, 70, 55, 95, 90, 30, 20, 15, 20, 40, 55, 50], 'Singing that shakes the chapel, and investigators who read ahead.'),
    M('Korea Seoul Mission', [35, 35, 40, 90, 75, 20, 40, 40, 60, 45, 50, 60], 'Disciplined, fast-paced and fueled by kimchi stew.'),
    M('France Paris Mission', [75, 35, 50, 85, 60, 60, 60, 65, 75, 65, 30, 55], 'Deep conversations with skeptics. Every yes is earned.'),
    M('Mexico City Mission', [40, 65, 60, 80, 60, 45, 15, 25, 20, 45, 55, 55], 'Tacos, big families and some of the oldest branches outside the US.'),
    M('New Zealand Auckland Mission', [40, 60, 50, 70, 40, 50, 20, 35, 25, 45, 60, 55], 'Pacific Islander faith, rugby on Saturdays and the haka at farewells.'),
    M('Illinois Nauvoo Mission', [20, 30, 40, 30, 10, 25, 25, 30, 30, 30, 5, 20], 'Historic sites, pioneer reenactments and the City Beautiful.')
  ];

  const SS = { FAMILIES, AXES, QUESTIONS, PROFILE, TYPES, FIGURES, MISSIONS };

  // ---- scoring helpers (shared by browser + build script) ----
  SS.matchPct = function (user, v) {
    let d = 0;
    for (let i = 0; i < 12; i++) d += Math.abs(user[i] - v[i]);
    d /= 12; // mean distance, 0–100
    return Math.max(1, Math.min(99, Math.round(100 - d * 1.6)));
  };
  SS.rank = function (user, list) {
    return list.map(x => ({ ...x, pct: SS.matchPct(user, x.v) })).sort((a, b) => b.pct - a.pct);
  };
  // Direction-based match (cosine of leanings around the 50 midpoint). Used for figures and
  // missions so near-center profiles don't win for everyone.
  SS.rankDir = function (user, list) {
    const u = user.map(x => x - 50);
    const nu = Math.hypot(...u) || 1;
    return list.map(x => {
      const m = x.v.map(y => y - 50);
      const cos = u.reduce((t, ui, i) => t + ui * m[i], 0) / (nu * (Math.hypot(...m) || 1));
      return { ...x, cos, pct: Math.max(1, Math.min(99, Math.round(62 + 37 * cos))) };
    }).sort((a, b) => b.cos - a.cos);
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = SS;
  else root.SS = SS;
})(typeof window !== 'undefined' ? window : globalThis);
