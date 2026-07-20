let lockedScrollY = 0;

function lockPageScroll() {
  lockedScrollY = window.scrollY;
  document.body.style.top = `-${lockedScrollY}px`;
  document.body.classList.add("modal-open");
}

function unlockPageScroll() {
  document.body.classList.remove("modal-open");
  document.body.style.top = "";
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo(0, lockedScrollY);
  window.requestAnimationFrame(() => { document.documentElement.style.scrollBehavior = ""; });
}

const caseStudies = {
  moftail: {
    kicker: "Case Study 01",
    title: "Moftail",
    link: { type: "moftail", url: "https://moftail.com", label: "Visit website" },
    image: "./assets/365Zen-Image.jpg",
    imageAlt: "Still Fox Tee visual from Moftail",
    imageFit: "cover",
    role: "I run Moftail as a Shopify-based product lab where I test commerce, creative, UX, and operating workflows in public.",
    decision: "I treated the brand as a learning system rather than a collection of apparel: every product page, creative, review, and delivery detail had to teach me something.",
    output: "A Brand OS around Balance of Life, a Hero Product strategy, PDP improvement principles, advertising notes, and a repeatable content workflow.",
    tools: ["Shopify", "Printify", "Meta Ads", "Documentation", "Markdown"],
    summary: "Moftail is my real-world product lab for the US market. I use the brand to test how story, trust, and conversion work together in a live store.",
    problem: "The challenge was not finding more ideas. It was turning a point of view into a reliable sequence of actions. When the world, the ad, the product page, and the trust information are disconnected, a beautiful brand still struggles to earn a decision.",
    process: [
      "Define Balance of Life, Enso, and Still Fox as the brand's core language",
      "Place Still Fox Tee at the centre of the first purchase journey",
      "Break down size, material, delivery, returns, and reviews as separate trust questions",
      "Design 365 Zen Moments as a quiet content engine for calm, stillness, and balance",
      "Record decisions, hypotheses, open questions, and next metrics in an Obsidian Brand OS",
    ],
    ai: [
      "Review brand philosophy, ad angles, product copy, and FAQ from multiple viewpoints",
      "Audit the path to purchase through customer, UX, and marketing lenses",
      "Generate and edit visual prompts, short Zen lines, and post structures",
      "Break growth work into a sequence of winning creative, winning message, and PDP improvement",
    ],
    learning: "A beautiful idea does not move forward by itself. It needs a visible current state: what is decided, what is a hypothesis, and what should be checked next.",
  },
  anchor: {
    kicker: "Case Study 02",
    title: "Anchor",
    link: { type: "github", url: "https://github.com/ryuusuraimu/Anchor.swiftpm", label: "View repository" },
    image: "./assets/Anchor-Screens.jpg",
    imageAlt: "Anchor app screens",
    imageFit: "cover-left",
    role: "I integrated problem definition, UX design, SwiftUI implementation, accessibility decisions, and product writing around a family experience.",
    decision: "In a panic, even looking at a phone can be too much. I prioritised prepared messages, offline QR sharing, and shortcut-based actions over adding more features.",
    output: "An offline-first QR Shield, Shortcuts / App Intents exploration, high-contrast states, and a calm-tech MVP designed around supporter clarity.",
    tools: ["SwiftUI", "Xcode", "Product writing", "UI design"],
    summary: "Anchor is an iOS app for moments when speaking, reading, or deciding becomes difficult. It lets a person make support visible without having to explain everything.",
    problem: "During panic or sensory overload, the ability to read, speak, and decide can collapse. The person may freeze while everyone nearby wonders what to do. Anchor turns that silence into clear instructions that can be understood without a conversation.",
    process: [
      "Set the North Star: make Prepare part of everyday calm, then make Shield immediate in a crisis",
      "Save Situation, Please Do, and Please Don't messages before they are needed",
      "Embed the message inside a QR so it can be shared without relying on a network",
      "Explore Back Tap, Action Button, Shortcuts, and App Intents as low-friction entry points",
      "Prioritise contrast, large type, short sentences, and generous tap targets",
    ],
    ai: [
      "Organise SwiftUI, Observation, App Intents, QR generation, and state-management options",
      "Test onboarding structures that move from chaos toward calm",
      "Reduce actor-isolation and implementation errors to small, verifiable examples",
      "Shape the problem, audience, accessibility, and technology story for a public submission",
    ],
    learning: "Removing a feature is harder than adding one. Anchor made accessibility feel less like a layer and more like the first design constraint.",
  },
  "anchor-student": {
    kicker: "Anchor / Swift Student Challenge",
    title: "Swift Student Challenge",
    link: { type: "github", url: "https://github.com/ryuusuraimu/Anchor.swiftpm", label: "View repository" },
    image: "./assets/anchor-student-challenge-home.png",
    imageAlt: "Latest Anchor Swift Student Challenge simulator screenshot",
    imageFit: "contain",
    role: "I designed and built the first Anchor prototype as a Swift Student Challenge submission, combining SwiftUI, accessibility, and a prepared communication aid.",
    decision: "The first version focused on one high-stakes question: how can someone make their needs understood when speaking is difficult? I kept the path short and the message explicit.",
    output: "A SwiftUI prototype with a prepared Shield, offline QR sharing, large type, high contrast, and a supporter-first interaction model.",
    tools: ["SwiftUI", "Xcode", "Accessibility", "QR code", "Product writing"],
    summary: "The Swift Student Challenge was the starting point for Anchor: a small, focused prototype that turns a difficult moment into a readable signal for the people nearby.",
    problem: "A panic episode can make language and decision-making unreliable. The first design challenge was not to build a complete health platform, but to create one dependable way to communicate what helps and what to avoid.",
    process: [
      "Define the supporter as the first reader of the emergency message",
      "Reduce the crisis flow to a prepared Shield and one clear next action",
      "Embed text into an offline QR so the message can travel without a network",
      "Test type size, contrast, spacing, and wording against a low-attention moment",
    ],
    ai: [
      "Compare SwiftUI screen structures and accessibility trade-offs",
      "Review the wording from the perspective of a person offering support",
      "Break implementation issues into small, testable Xcode examples",
    ],
    learning: "The first version taught me that a small surface can carry a serious responsibility. Clarity is a feature, not a finishing touch.",
  },
  "anchor-buildweek": {
    kicker: "Anchor / OpenAI Build Week",
    title: "OpenAI Build Week",
    link: { type: "devpost", url: "https://devpost.com/software/anchor-human-signal", label: "View Build Week project" },
    image: "./assets/anchor-buildweek-shield.png",
    imageAlt: "Latest Anchor OpenAI Build Week Shield simulator screenshot",
    imageFit: "contain",
    imageTone: "dark",
    role: "I extended Anchor during OpenAI Build Week into a calmer iOS product system, combining product direction, SwiftUI implementation, accessibility review, and scenario-based QA.",
    decision: "The Build Week version separates calm preparation from crisis-time use: one question at a time in Prepare, a deterministic Shield with no unnecessary choices, and clear guidance for the people who arrive to help.",
    output: "A current iOS release candidate with Home, one-question Prepare, static Shield, two-minute Reset, offline QR, manual Support Relay, optional Aftercare, and locally saved voice reading.",
    tools: ["SwiftUI", "Native Canvas", "Accessibility", "OpenAI speech proxy", "Xcode"],
    summary: "OpenAI Build Week gave Anchor a second chapter. The current Human Signal release candidate keeps the hard-moment Shield deterministic and offline-capable while making calm-time preparation clearer.",
    problem: "The first prototype proved the signal. The next challenge was making it feel dependable in real life: quick to open, readable at a glance, usable offline, and emotionally calm for everyone involved.",
    process: [
      "Separate everyday preparation from the crisis-time Shield",
      "Design the Shield as a single, deterministic surface with no unnecessary choices",
      "Prepare the selected reading voice during calm setup and save it for offline Shield playback",
      "Add manual Support Relay, QR sharing, and shortcut entry points for real-world handoff",
      "Shape the product narrative around the family experience that motivated Anchor",
    ],
    ai: [
      "Use Codex and GPT-5.6 as product-design, implementation, critique, and QA partners",
      "Keep OpenAI speech generation inside calm preparation; the accepted voice is saved locally for Shield",
      "Review accessibility, offline behaviour, Reduce Motion, and failure states as first-class requirements",
      "Turn the build into a concise Devpost and demo-video story",
    ],
    learning: "Build Week taught me how much a product changes when the story, the interface, and the implementation are judged as one experience.",
  },
  shopify: {
    kicker: "Case Study 03",
    title: "Shopify Theme Debugging",
    image: "./assets/Shopify-Theme.png",
    imageAlt: "Build My POD logo",
    imageFit: "contain",
    role: "As a store operator, I observe storefront friction and turn it into reproducible steps and cause hypotheses.",
    decision: "I focused on translating “something feels broken” into a technical brief that separates expected behaviour, actual behaviour, and impact.",
    output: "A shareable document that separates Shopify defaults from theme-specific behaviour and gives an external team a clear improvement path.",
    tools: ["Shopify", "Liquid", "JavaScript", "Markdown"],
    summary: "I investigated price and size-selection behaviour on product pages and turned the findings into a reproducible brief.",
    problem: "A storefront issue may look like a platform problem while actually living in Liquid or frontend code. A vague report leaves the next person unable to move, so the first product decision is often to make the problem testable.",
    process: [
      "Confirm which product pages show the behaviour",
      "Observe size selection, price display, and update timing",
      "Separate Shopify default behaviour from theme-specific behaviour",
      "Document preconditions, steps, expected result, actual result, and impact",
    ],
    ai: [
      "Organise likely causes across Liquid, JavaScript, variants, and theme settings",
      "Adjust technical explanations for non-engineering readers",
      "Rewrite findings into a brief an external team can act on",
    ],
    learning: "Saying “this feels wrong” is a useful start. Saying “under these conditions, this changes in this way” makes it useful to someone else.",
  },
  zen: {
    kicker: "Case Study 04",
    title: "365 Zen Moments",
    image: "./assets/365Zen-Image.jpg",
    imageAlt: "365 Zen Moments content visual",
    imageFit: "cover",
    role: "I designed the structure, tone, and visual prompts for a daily content system that keeps Moftail's world coherent over time.",
    decision: "Instead of making every post a sales message, I treated calm, stillness, and balance as a quiet brand asset that compounds through repetition.",
    output: "A Visual + Short Zen line + MOFTAIL format, motif library, caption principles, and a reusable content foundation.",
    tools: ["Content planning", "Markdown", "Social planning"],
    summary: "365 Zen Moments is a content engine that turns Moftail's calm, stillness, balance, awareness, and nature into a daily practice.",
    problem: "A small brand needs quiet repetition as well as strong ads. Starting from zero every day creates inconsistency and turns a point of view into a feed of disconnected aesthetic images.",
    process: [
      "Fix the minimum structure: Visual + Short Zen line + MOFTAIL",
      "Collect motifs such as morning light, forest, water, mist, tea ritual, and windows",
      "Define principles: never over-sell, never over-explain, never leave the brand's centre",
      "Design posts as assets that can travel into ad copy, Zen Micro Film, and product-page context",
    ],
    ai: [
      "Expand and organise post themes",
      "Design English prompts for image generation",
      "Draft short captions and tune them to the brand's tone",
    ],
    learning: "Volume does not create coherence. Editing — deciding what belongs and what to leave out — is the real content system.",
  },
  stockwise: {
    kicker: "Case Study 05",
    title: "StockWise",
    link: { type: "github", url: "https://github.com/ryuusuraimu/stockwise", label: "View repository" },
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 760'%3E%3Crect width='1200' height='760' fill='%230c172b'/%3E%3Cg fill='none' stroke='%2350f58d' stroke-width='18' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M150 540h900' opacity='.28'/%3E%3Cpath d='M190 520 350 390l130 70 210-240 130 120 190-190'/%3E%3C/g%3E%3Crect x='126' y='110' width='948' height='150' rx='28' fill='%23fff8e8' stroke='%230d1628' stroke-width='10'/%3E%3Ctext x='170' y='202' font-family='Arial,sans-serif' font-size='56' font-weight='900' fill='%230d1628'%3EFAQ search: PER / PBR / NISA%3C/text%3E%3Cg font-family='Arial,sans-serif' font-weight='900'%3E%3Crect x='150' y='315' width='260' height='88' rx='20' fill='%23ffd91f'/%3E%3Ctext x='190' y='372' font-size='38' fill='%230d1628'%3EDividend%3C/text%3E%3Crect x='450' y='315' width='210' height='88' rx='20' fill='%23ddf1ff'/%3E%3Ctext x='500' y='372' font-size='38' fill='%230d1628'%3ENISA%3C/text%3E%3Crect x='700' y='315' width='260' height='88' rx='20' fill='%23ffe3ea'/%3E%3Ctext x='755' y='372' font-size='38' fill='%230d1628'%3EPER/PBR%3C/text%3E%3C/g%3E%3C/svg%3E",
    imageAlt: "StockWise FAQ search app concept",
    imageFit: "cover",
    imageTone: "dark",
    role: "I designed the search UX, FAQ structure, and explanation level for beginner investors, then built the concept with React and TypeScript.",
    decision: "Rather than adding more investment information, I focused on the first terms beginners search for: PER, PBR, NISA, and dividend yield.",
    output: "A FAQ-style knowledge search app, category model, search UI, and question decomposition for foundational investing terms.",
    tools: ["React", "TypeScript", "Search UX", "FAQ design"],
    summary: "StockWise is a FAQ-style knowledge search app that helps beginner investors find a clear first explanation before they reach for jargon-heavy sources.",
    problem: "There is plenty of beginner investing information, but people still struggle to find the exact term they need, understand the right level of detail, or see the question that should come next.",
    process: [
      "Collect terms and questions a beginner is likely to search",
      "Break PER, PBR, NISA, and dividend yield into FAQ-sized answers",
      "Connect search results to related questions",
      "Implement the search UI and FAQ structure with React and TypeScript",
    ],
    ai: [
      "Surface questions a beginner may be trying to ask",
      "Tune the level of each explanation",
      "Review the FAQ structure and search path",
      "Support React and TypeScript implementation decisions",
    ],
    learning: "Search UX is less about the amount of knowledge and more about building a generous first doorway into it.",
  },
};

const translations = {
  en: {
    "nav.work": "Selected work", "nav.method": "Approach", "nav.skills": "Capabilities", "nav.contact": "Contact", "header.open": "Open to opportunities", "header.status": "Building in public / 2026",
    "hero.eyebrow": "Product thinker · builder · student", "hero.title1": "I turn friction", "hero.title2": "into something useful.", "hero.subtitle": "I observe real-world friction, frame it into product problems, and ship practical solutions people can trust.", "hero.explore": "Explore selected work", "hero.collaborate": "Let’s work together", "hero.note": "From calmer iOS experiences to Shopify systems, I like working where people, information, and technology meet.",
    "hero.signalCurrent": "Current focus / latest build", "hero.signalTitle": "Anchor / Human Signal", "hero.signalBody": "A calmer iOS system for preparing support before the hard moment.", "hero.signalMeta": "OpenAI Build Week 2026 · current release candidate", "latest.label": "▣ Latest Build / 2026.07", "latest.title": "Anchor: make support visible when the moment gets hard.", "latest.body": "The current Build Week version combines one-question preparation, a deterministic offline Shield, Reset, QR sharing, and manual Support Relay.",
    "intro.kicker": "A small, product-minded practice", "intro.statement": "Good products make the next step feel clear — especially when the moment is difficult.",
    "profile.label": "About", "profile.title1": "Make the invisible", "profile.title2": "easier to see.", "profile.body": "I am a university student and independent builder exploring product, UX, iOS, e-commerce, and AI-assisted workflows.", "profile.link": "More about me",
    "moftail.label": "Product lab / 01", "moftail.imageLabel": "Shopify · POD · US market", "moftail.title1": "Moftail is my", "moftail.title2": "real-world laboratory.", "moftail.body": "A Shopify-based brand where I test product pages, creative, trust signals, and operating systems against the reality of running a store.", "common.readCase": "Read case study",
    "anchor.label": "Featured build / 02", "anchor.title1": "When words fail,", "anchor.title2": "support stays visible.", "anchor.body": "An iOS app for panic situations. Prepared messages, offline QR sharing, and shortcut-based actions help a person ask for support without having to explain everything.", "anchor.link": "Open Anchor case study", "anchor.preview": "Shield / Prepare / Support", "anchor.trackLabel": "⚓ Anchor / Two Chapters", "anchor.trackTitle1": "One idea.", "anchor.trackTitle2": "Two chapters.", "anchor.trackBody": "Anchor began as a student challenge and grew into a Build Week project. The core stayed the same: make support visible when words become difficult.", "anchor.studentLabel": "01 / Swift Student Challenge", "anchor.studentTitle": "Build the quiet foundation.", "anchor.studentBody": "SwiftUI, accessibility, prepared communication, and an offline-first Shield shaped the first version of Anchor.", "anchor.buildweekLabel": "02 / OpenAI Build Week", "anchor.buildweekTitle": "Turn a prototype into a human signal.", "anchor.buildweekBody": "Anchor expanded into a calmer product system with one-question preparation, a deterministic Shield, Reset, offline QR, and manual Support Relay.", "anchor.openStory": "Open story",
    "method.label": "How I work", "method.lead": "Less noise. Better questions. A working answer.", "method.observe": "Observe", "method.observeBody": "Notice the friction before reaching for a feature.", "method.frame": "Frame", "method.frameBody": "Turn a vague feeling into a shared product problem.", "method.ship": "Ship", "method.shipBody": "Make a small, testable version and learn from contact with reality.",
    "signal.label": "Design principle", "signal.quote": "“The best interface is often the one that helps someone else know what to do.”", "signal.body": "A supporter-first lens for moments where attention, time, or language is limited.",
    "ai.label": "How I use AI", "ai.title1": "I use AI to", "ai.title2": "create better tension.", "ai.body": "AI helps me widen the field, challenge assumptions, and move from a blank page to a decision. I still own the judgment, the constraints, and the final call.", "ai.explore": "Explore", "ai.exploreBody": "Ask several models the same question. Compare the edges.", "ai.debate": "Debate", "ai.debateBody": "Invite disagreement before committing to a direction.", "ai.design": "Design", "ai.designBody": "Use prototypes to make the flow and its friction visible.", "ai.ship": "Ship", "ai.shipBody": "Write the constraints down, then build and review the result.", "ai.footer": "AI can widen the conversation. A person still has to choose.",
    "work.kicker": "Selected work", "work.title1": "Small systems,", "work.title2": "real constraints.", "work.body": "Click a project to see the problem, the decision, the workflow, and what changed.", "work.moftailMeta": "Product lab / Commerce / Brand", "terminal.observe": "> observing real-world friction", "terminal.frame": "> framing it into product problems", "terminal.body": "I define the question, review the output, document the decision, and turn the idea into something people can actually use.", "highlight.shopifyLabel": "Shopify theme debugging", "highlight.shopifyTitle": "“Something feels broken” → a reproducible issue.", "highlight.shopifyBody": "Turning a vague storefront problem into a shared, testable brief.", "highlight.stockwiseTitle": "Search before jargon.", "highlight.stockwiseBody": "A FAQ-style knowledge app for people taking their first steps into investing.",
    "skills.productLabel": "01 / Product thinking", "skills.productBody": "Problem framing · MVP definition · Information architecture · UX review", "skills.frontendLabel": "02 / Frontend & iOS", "skills.researchLabel": "03 / Research & writing", "skills.researchBody": "Decision logs · specs · debugging notes · testing plans · product copy", "skills.commerceLabel": "04 / Commerce & ops", "skills.knowledgeLabel": "05 / Knowledge UX", "skills.knowledgeBody": "FAQ structure · search flows · question decomposition · clear explanations",
    "contact.kicker": "A good next step", "contact.title1": "Have a hard problem?", "contact.title2": "Let’s make it clearer.", "contact.body": "I am currently a university student looking for opportunities to learn, contribute, and build with people who care about useful technology. I am especially open to global, text-first collaboration while I continue improving my spoken English.", "contact.note": "If this work resonates, I would love to hear your feedback — or explore whether we could bring one of these ideas into the real world together.", "contact.start": "Start a conversation", "contact.copy": "Copy email", "contact.portfolio": "Portfolio",
  },
  ja: {
    "nav.work": "制作実績", "nav.method": "考え方", "nav.skills": "できること", "nav.contact": "連絡する", "header.open": "仕事の相談を受付中", "header.status": "公開制作中 / 2026",
    "hero.eyebrow": "プロダクト思考 · 実装 · 大学生", "hero.title1": "違和感を見つけ、", "hero.title2": "役に立つ形へ。", "hero.subtitle": "現実の小さな摩擦を観察し、プロダクト課題として整理し、信頼できる体験へ落とし込みます。", "hero.explore": "制作実績を見る", "hero.collaborate": "一緒につくる", "hero.note": "落ち着いて使えるiOS体験からShopifyの仕組みまで、人・情報・技術が交わる場所で考えるのが好きです。",
    "hero.signalCurrent": "現在の注力 / 最新ビルド", "hero.signalTitle": "Anchor / Human Signal", "hero.signalBody": "難しい瞬間の前に支援を準備できる、落ち着いたiOSシステム。", "hero.signalMeta": "OpenAI Build Week 2026 · 現在のリリース候補", "latest.label": "▣ 最新ビルド / 2026.07", "latest.title": "Anchor：難しい瞬間にも、支援を見える形に。", "latest.body": "現在のBuild Week版は、一問ずつのPrepare、決定的なオフラインShield、Reset、QR共有、手動のSupport Relayを組み合わせています。",
    "intro.kicker": "プロダクトを考え、つくる小さな実践", "intro.statement": "良いプロダクトは、難しい瞬間ほど次の一歩を分かりやすくする。",
    "profile.label": "プロフィール", "profile.title1": "見えない困りごとを", "profile.title2": "見える形にする。", "profile.body": "大学生として学びながら、プロダクト、UX、iOS、EC、AIを使った開発ワークフローを探究しています。", "profile.link": "プロフィールを見る",
    "moftail.label": "プロダクトラボ / 01", "moftail.imageLabel": "Shopify · POD · 米国市場", "moftail.title1": "Moftailは", "moftail.title2": "現実で試せる実験室。", "moftail.body": "商品ページ、クリエイティブ、信頼情報、運営の仕組みを、実際にストアを運営しながら検証するShopifyブランドです。", "common.readCase": "ケーススタディを読む",
    "anchor.label": "注力プロジェクト / 02", "anchor.title1": "言葉が出ない時も、", "anchor.title2": "支援を見える形に。", "anchor.body": "パニック発作などの緊急時に、事前に用意したメッセージやオフラインQR、ショートカットで助けを求められるiOSアプリです。", "anchor.link": "Anchorのケースを見る", "anchor.preview": "Shield / Prepare / Support", "anchor.trackLabel": "⚓ Anchor / 2つの章", "anchor.trackTitle1": "一つのアイデア。", "anchor.trackTitle2": "二つの章。", "anchor.trackBody": "Anchorは学生向けチャレンジから始まり、Build Weekで発展しました。中心にあるのは、言葉が難しい時も支援を見える形にすることです。", "anchor.studentLabel": "01 / Swift Student Challenge", "anchor.studentTitle": "静かな土台をつくる。", "anchor.studentBody": "SwiftUI、アクセシビリティ、事前メッセージ、オフラインShieldから最初のAnchorを形にしました。", "anchor.buildweekLabel": "02 / OpenAI Build Week", "anchor.buildweekTitle": "プロトタイプをHuman Signalへ。", "anchor.buildweekBody": "一問ずつのPrepare、決定的なShield、Reset、オフラインQR、手動のSupport Relayを持つ落ち着いたプロダクトシステムへ広げました。", "anchor.openStory": "ストーリーを見る",
    "method.label": "仕事の進め方", "method.lead": "ノイズを減らし、問いを磨き、動く答えへ。", "method.observe": "Observe", "method.observeBody": "機能を考える前に、現実の摩擦を観察する。", "method.frame": "Frame", "method.frameBody": "曖昧な違和感を、共有できる課題へ変える。", "method.ship": "Ship", "method.shipBody": "小さく試せる形にして、現実との接点から学ぶ。",
    "signal.label": "デザイン原則", "signal.quote": "「最良のインターフェースは、周りの人が何をすればいいか分かるようにする。」", "signal.body": "注意力・時間・言葉が限られる瞬間のための、支援者ファーストの視点。",
    "ai.label": "AIとの仕事", "ai.title1": "AIと一緒に", "ai.title2": "問いの質を上げる。", "ai.body": "AIで視野を広げ、前提を揺さぶり、白紙から判断までの距離を短くします。最終的な判断、制約、責任は自分が持ちます。", "ai.explore": "広げる", "ai.exploreBody": "同じ問いを複数のモデルに投げ、違いを見る。", "ai.debate": "議論する", "ai.debateBody": "方向を決める前に、あえて反対意見を出す。", "ai.design": "設計する", "ai.designBody": "プロトタイプで流れと違和感を見える化する。", "ai.ship": "届ける", "ai.shipBody": "制約を言葉にしてから実装し、結果をレビューする。", "ai.footer": "AIは会話を広げられる。でも最後に選ぶのは人です。",
    "work.kicker": "制作実績", "work.title1": "小さな仕組みを、", "work.title2": "現実の制約の中で。", "work.body": "プロジェクトをクリックすると、課題・判断・ワークフロー・変化を確認できます。", "work.moftailMeta": "プロダクトラボ / EC / ブランド", "terminal.observe": "> 現実の摩擦を観察中", "terminal.frame": "> プロダクト課題へ整理中", "terminal.body": "問いを定義し、出力を見直し、判断を記録し、実際に使える形へ変えていきます。", "highlight.shopifyLabel": "Shopifyテーマのデバッグ", "highlight.shopifyTitle": "「何かおかしい」→再現できる課題へ。", "highlight.shopifyBody": "曖昧なストアの違和感を、共有できる検証可能なメモに変える。", "highlight.stockwiseTitle": "専門用語より、まず検索。", "highlight.stockwiseBody": "投資を始めた人が最初の一歩を踏み出せるFAQ型ナレッジアプリ。",
    "skills.productLabel": "01 / プロダクト思考", "skills.productBody": "課題整理 · MVP定義 · 情報設計 · UXレビュー", "skills.frontendLabel": "02 / フロントエンド & iOS", "skills.researchLabel": "03 / 調査 & ライティング", "skills.researchBody": "意思決定ログ · 仕様書 · デバッグメモ · 検証計画 · プロダクトコピー", "skills.commerceLabel": "04 / EC & オペレーション", "skills.knowledgeLabel": "05 / ナレッジUX", "skills.knowledgeBody": "FAQ構造 · 検索導線 · 質問分解 · 分かりやすい説明",
    "contact.kicker": "次の一歩", "contact.title1": "難しい課題があれば、", "contact.title2": "一緒に整理しましょう。", "contact.body": "現在は大学生として、役に立つ技術を大切にするチームで学び、貢献し、つくる機会を探しています。英語は勉強中ですが、テキスト中心のグローバルな協働にも関心があります。", "contact.note": "この活動に共感していただけたら、感想や評価をぜひ聞かせてください。アイデアを社会に届けるために、一緒に開発する可能性も探せたら嬉しいです。", "contact.start": "話を始める", "contact.copy": "メールをコピー", "contact.portfolio": "ポートフォリオ",
  },
};

const modalJa = {
  moftail: { kicker: "ケーススタディ 01", role: "ShopifyベースのプロダクトラボとしてMoftailを運営し、EC、クリエイティブ、UX、運用ワークフローを現実の中で検証しています。", decision: "ブランドをアパレル作品の集合ではなく、商品ページ、広告、レビュー、配送情報の一つひとつが学びを生む仕組みとして扱いました。", output: "Balance of Lifeを核にしたBrand OS、Hero Product戦略、PDP改善方針、広告メモ、再利用できるコンテンツワークフロー。", summary: "Moftailは米国市場向けのリアルなプロダクトラボです。ストーリー、信頼、購入体験がどうつながるかを、実際のストアで検証しています。", problem: "課題はアイデアを増やすことではなく、考え方を実行の順番へ変えることでした。世界観、広告、商品ページ、信頼情報が分断されると、きれいなブランドでも選ばれません。", learning: "美しいアイデアだけでは前に進みません。決まったこと、仮説、次に検証することを見えるようにする必要があります。" },
  anchor: { kicker: "ケーススタディ 02", role: "家族の実体験を起点に、課題定義、UX設計、SwiftUI実装、アクセシビリティ、プロダクト文章を一つに統合しました。", decision: "発作中はスマホを見ること自体が負荷になります。機能を増やすより、事前メッセージ、オフラインQR、ショートカットを優先しました。", output: "オフラインで使えるQR Shield、Shortcuts / App Intentsの導線、高コントラストの画面、支援者の理解を中心にしたCalm TechのMVP。", summary: "Anchorは、話す・読む・判断することが難しい瞬間のためのiOSアプリです。説明をしなくても、必要な支援を見える形にします。", problem: "パニックや感覚過負荷の中では、読む・話す・判断する力が落ちることがあります。本人が固まり、周囲も何をすればいいか分からない沈黙を、会話なしで読める指示へ変える必要がありました。", learning: "機能を削ることは、足すことより難しい。アクセシビリティは後付けではなく、最初の設計条件だと実感しました。" },
  "anchor-student": { kicker: "Anchor / Swift Student Challenge", role: "Swift Student Challenge向けの最初のAnchorプロトタイプを、SwiftUI、アクセシビリティ、事前メッセージを組み合わせて設計・実装しました。", decision: "話すことが難しい時、どうすれば必要なことを理解してもらえるか。この一点に絞り、経路を短く、メッセージを明確にしました。", output: "事前に用意したShield、オフラインQR、大きな文字、高コントラスト、支援者ファーストの操作モデルを備えたSwiftUIプロトタイプ。", summary: "Swift Student ChallengeはAnchorの出発点でした。難しい瞬間を、そばにいる人が読めるシグナルへ変える小さく集中したプロトタイプです。", problem: "パニック発作では、言葉や判断が不安定になることがあります。完全なヘルスプラットフォームではなく、助けになること・避けてほしいことを一つ確実に伝えることから始めました。", learning: "小さな画面でも大きな責任を持てると学びました。明確さは仕上げではなく、機能そのものです。" },
  "anchor-buildweek": { kicker: "Anchor / OpenAI Build Week", role: "OpenAI Build WeekでAnchorを、プロダクト方針、SwiftUI実装、アクセシビリティレビュー、シナリオQAまで含む落ち着いたiOSシステムへ拡張しました。", decision: "Prepareでは一問ずつ準備し、難しい瞬間のShieldは不要な選択肢を持たない決定的な画面に分けました。", output: "Home、一問ずつのPrepare、静的なShield、2分間のReset、オフラインQR、手動Support Relay、任意のAftercare、端末に保存した読み上げ音声を含むリリース候補。", summary: "OpenAI Build WeekはAnchorの第二章です。難しい瞬間のShieldは決定的かつオフライン対応のまま、落ち着いている時の準備を分かりやすくしました。", problem: "最初のプロトタイプはシグナルを証明しました。次は、すぐ開ける、ひと目で読める、オフラインで動く、関わる全員に落ち着きを与える体験へ磨く必要がありました。", learning: "物語、インターフェース、実装、QAを一つの体験として評価すると、プロダクトの意味が変わると学びました。" },
  shopify: { kicker: "ケーススタディ 03", role: "ストア運営者として商品ページの違和感を観察し、再現手順と原因仮説へ変換しました。", decision: "「何かおかしい」を、期待値・実際の挙動・影響範囲に分け、第三者が検証できる技術メモにしました。", output: "Shopify標準の挙動とテーマ固有の挙動を分けた共有ドキュメントと、外部チーム向けの改善提案。", summary: "商品ページの価格とサイズ選択を調査し、再現できる課題として整理しました。", problem: "プラットフォームの問題に見えても、原因がLiquidやフロントエンドにあることがあります。曖昧な報告では次の人が動けないため、まず検証できる形にしました。", learning: "「なんか変」を「この条件で、このように変」と言い直すだけで、技術的な問題の解像度は上がります。" },
  zen: { kicker: "ケーススタディ 04", role: "Moftailの世界観を継続するため、日々の投稿構造、文体、画像生成プロンプトを設計しました。", decision: "毎回売り込むのではなく、calm、stillness、balanceを静かに積み重ねるブランド資産として扱いました。", output: "Visual + Short Zen line + MOFTAILの型、モチーフ集、キャプション方針、再利用できるコンテンツ基盤。", summary: "365 Zen Momentsは、Moftailのcalm、stillness、balance、awareness、natureを毎日の習慣に変えるコンテンツエンジンです。", problem: "小さなブランドには強い広告だけでなく静かな反復も必要です。毎回ゼロから投稿を作ると、世界観がぶれてしまいます。", learning: "量だけでは一貫性は生まれません。何を残し、何を捨てるかを決める編集がシステムになります。" },
  stockwise: { kicker: "ケーススタディ 05", role: "投資初心者向けに検索UX、FAQ構造、説明の粒度を設計し、ReactとTypeScriptで構築しました。", decision: "情報を増やすのではなく、PER、PBR、NISA、配当利回りなど最初に調べる言葉へ導線を絞りました。", output: "FAQ型ナレッジ検索アプリ、カテゴリ設計、検索UI、基本用語の質問分解。", summary: "StockWiseは、投資初心者が専門用語の多い情報へ進む前に、最初の説明を見つけられるFAQ型検索アプリです。", problem: "投資情報は多い一方で、知りたい言葉に辿り着けない、説明が難しい、次に見る質問が分からない課題があります。", learning: "検索UXで大切なのは知識量より、最初の入口をどうつくるかです。" },
};

const modalJaLists = {
  moftail: {
    process: ["Balance of Life、Enso、Still Foxをブランドの核として定義", "Still Fox Teeを最初の購入導線の中心に置く", "サイズ、素材、配送、返品、レビューを購入前の不安として分解", "365 Zen Momentsをcalm / stillness / balanceのコンテンツエンジンとして設計", "決定事項、仮説、未解決の問い、次の指標をObsidianに記録"],
    ai: ["ブランド哲学、広告、商品コピー、FAQを複数視点でレビュー", "顧客・UX・マーケティングの視点で購入導線を点検", "画像生成プロンプト、短いZen line、投稿構造を作成", "広告、訴求、PDP改善の順番に成長施策を分解"],
  },
  anchor: {
    process: ["Prepareを日常の安心にし、危機時はShieldを即時表示するNorth Starを設定", "Situation、Please Do、Please Don'tを事前に登録", "メッセージをQRに埋め込み、通信なしで共有", "Back Tap、Action Button、Shortcuts、App Intentsの導線を検討", "コントラスト、文字サイズ、短い文、余白をアクセシビリティの中心に置く"],
    ai: ["SwiftUI、Observation、App Intents、QR生成、状態管理の選択肢を整理", "ChaosからCalmへ移るオンボーディングを検討", "actor isolationや実装エラーを小さな検証単位に分解", "問題、対象者、アクセシビリティ、技術の説明を整理"],
  },
  "anchor-student": {
    process: ["緊急メッセージの最初の読者を支援者に設定", "危機時の経路を事前に用意したShieldと一つの行動へ絞る", "ネットワークなしで届くよう文章をオフラインQRへ埋め込む", "注意力が低い状態を想定して文字サイズ、コントラスト、余白を検証"],
    ai: ["SwiftUIの画面構造とアクセシビリティのトレードオフを比較", "助ける側の視点でメッセージをレビュー", "実装課題を小さなXcode検証へ分解"],
  },
  "anchor-buildweek": {
    process: ["日常の準備と危機時のShieldを分離", "不要な選択肢をなくした決定的なShieldを設計", "読むことが難しい時のために音声読み上げを追加", "連絡先リレー、QR、ショートカットで現実の引き渡しを設計", "Anchorを生んだ家族の体験をプロダクトの物語に整理"],
    ai: ["CodexとGPT-5.6でプロダクト方向、UX階層、実装制約を議論", "OpenAIの音声機能で選択・保存できる読み上げ音声を設計", "アクセシビリティ、オフライン動作、失敗状態を主要要件としてレビュー", "Devpostとデモ動画に伝わるストーリーへ編集"],
  },
  shopify: {
    process: ["どの商品ページで発生するかを確認", "サイズ選択、価格表示、更新タイミングを観察", "Shopify標準とテーマ固有の挙動を分離", "前提、手順、期待値、実際の挙動、影響範囲を記録"],
    ai: ["Liquid、JavaScript、バリアント、テーマ設定から原因候補を整理", "非エンジニアにも伝わる粒度に説明を調整", "外部チームが動ける共有文へ書き換え"],
  },
  zen: {
    process: ["Visual + Short Zen line + MOFTAILの最小構造を固定", "朝の光、森、水、霧、茶、窓などのモチーフを収集", "売り込みすぎず、説明しすぎず、核から外さない原則を定義", "広告コピー、Zen Micro Film、商品ページにも転用できる資産として設計"],
    ai: ["投稿テーマを発散し、整理", "英語の画像生成プロンプトを設計", "短いキャプションを作り、トーンを調整"],
  },
  stockwise: {
    process: ["初心者が検索しそうな用語と質問を収集", "PER、PBR、NISA、配当利回りをFAQ単位に分解", "検索結果から関連質問へ移れる導線を設計", "ReactとTypeScriptで検索UIとFAQ構造を実装"],
    ai: ["初心者が抱きそうな質問を洗い出す", "説明の粒度を調整する", "FAQ構造と検索導線をレビューする", "React / TypeScriptの実装判断を補助する"],
  },
};

let currentLanguage = localStorage.getItem("pario-language") || "en";

const legacyPageCopy = {
  en: {
    ".nav-links a": ["Work", "Method", "Skills", "Contact"],
    ".intro-card p": "A Shopify-based POD brand for the US market where I test product pages, creative, reviews, delivery explanations, and production workflows.",
    ".plate-card h2": "HOW I WORK",
    ".plate-card p": "Problem framing / UX review / debugging / specs / testing ideas",
    ".talks-card .section-label": "▤ My Method",
    ".scribble": "needs to be tested in the real world",
    ".talk-list li span": ["Name the friction before naming the feature", "Review it from more than one viewpoint", "Turn it into something people can use"],
    "#ai-title": "HOW I USE AI",
    ".ai-lead": "I use several AI systems while building products. Not to hand over the decision, but to create a better debate before I decide.",
    ".ai-phase-card strong": ["Widen the question", "Let AI debate", "Think from the interface", "Ship with clear constraints"],
    ".ai-phase-card p": ["Ask several models the same question and compare the edges.", "Invite different opinions, then read them as a judge rather than a believer.", "Prototype the screen early so the flow and its friction become visible.", "Write the specification before handing implementation to Claude Code or Codex."],
    ".ai-phase-card code": ["// compare the edges", "// do not depend on one model", "// design makes friction visible", "// avoid vibe coding"],
    ".ai-footer p": "AI can widen the conversation. I still own the judgement.",
    ".projects-section .label-pill": "▣ Product-minded Work",
    ".work-highlight p": ["Investigate product-page behaviour and document the steps, expected result, actual result, and cause hypothesis.", "A search-first FAQ app for beginners looking up PER, PBR, NISA, and dividend yield."],
    ".skills-band .skill-card strong": ["Problem framing / MVP design / Information architecture / UX review / Hypothesis testing", "HTML / CSS / JavaScript / React / TypeScript / SwiftUI", "Specifications / debugging support / research notes / review / test planning", "Shopify / Liquid investigation / Printify / Meta Ads / PDP improvement / FAQ design", "FAQ structure / search flows / information organisation / question decomposition"],
    ".contact-card h2": "I want to build products that make difficult information easier to navigate — with search, UX, and clear systems.",
    ".dialog-meta-grid h3": ["Role", "Decision", "Output"],
    ".dialog-tools h3": "Tools",
    ".dialog-grid h3": ["Problem", "Process", "Workflow", "Learning"],
  },
  ja: {
    ".nav-links a": ["制作実績", "考え方", "できること", "連絡する"],
    ".intro-card p": "米国市場向けのShopifyベースPODブランド。商品ページ、広告、レビュー、配送説明、制作ワークフローを実際の運営で検証しています。",
    ".plate-card h2": "仕事の進め方",
    ".plate-card p": "課題整理 / UXレビュー / デバッグ / 仕様化 / 検証アイデア",
    ".talks-card .section-label": "▤ 私の方法",
    ".scribble": "現実の中で試せる形にする",
    ".talk-list li span": ["違和感を先に言葉にする", "複数の視点から見直す", "使える形へ落とし込む"],
    "#ai-title": "AIとの仕事",
    ".ai-lead": "複数のAIを使い分けながらプロダクトを作ります。任せきるのではなく、議論させてから自分で判断します。",
    ".ai-phase-card strong": ["問いを広げる", "AIに議論させる", "画面から考える", "制約を決めて届ける"],
    ".ai-phase-card p": ["同じ問いを複数のモデルに投げ、出力の違いを見る。", "複数の意見を出させ、判定者として読む。", "早く画面を作り、流れと違和感を見えるようにする。", "Claude CodeやCodexへ渡す前に仕様を言葉にする。"],
    ".ai-phase-card code": ["// 出力の差分を見る", "// 一つのモデルに依存しない", "// 画面で違和感を見る", "// バイブコーディングを避ける"],
    ".ai-footer p": "AIに答えを出させるのではなく、議論させて、自分で判断する。",
    ".projects-section .label-pill": "▣ プロダクト思考の制作",
    ".work-highlight p": ["商品ページの挙動を調査し、再現手順、期待値、実際の挙動、原因仮説を記録します。", "PER、PBR、NISA、配当利回りなどを調べられる初心者向け検索型FAQアプリ。"],
    ".skills-band .skill-card strong": ["課題分解 / MVP設計 / 情報設計 / UXレビュー / 仮説検証", "HTML / CSS / JavaScript / React / TypeScript / SwiftUI", "仕様書作成 / デバッグ補助 / 調査メモ / レビュー / 検証計画", "Shopify / Liquid調査 / Printify / Meta Ads / PDP改善 / FAQ設計", "FAQ構造化 / 検索導線 / 情報整理 / ユーザー質問の分解"],
    ".contact-card h2": "検索・UX・情報設計を組み合わせ、人が難しい情報に迷う瞬間を減らすプロダクトをつくりたい。",
    ".dialog-meta-grid h3": ["役割", "判断", "成果"],
    ".dialog-tools h3": "使用ツール",
    ".dialog-grid h3": ["課題", "プロセス", "ワークフロー", "学び"],
  },
};

function applyLegacyPageCopy(language) {
  const copy = legacyPageCopy[language];
  for (const [selector, value] of Object.entries(copy)) {
    const elements = [...document.querySelectorAll(selector)];
    elements.forEach((element, index) => {
      element.textContent = Array.isArray(value) ? (value[index] ?? element.textContent) : value;
    });
  }
}

function applyLanguage(language) {
  currentLanguage = language === "ja" ? "ja" : "en";
  localStorage.setItem("pario-language", currentLanguage);
  document.documentElement.lang = currentLanguage;
  document.title = currentLanguage === "ja" ? "中邨隆之介 — プロダクトポートフォリオ" : "Ryunosuke Nakamura — Product Portfolio";
  document.querySelector('meta[name="description"]').setAttribute("content", currentLanguage === "ja" ? "現実の摩擦をプロダクト課題として整理し、役に立つ体験へ落とし込む中邨隆之介のポートフォリオ。" : "The product portfolio of Ryunosuke Nakamura: turning real-world friction into practical products, calm interfaces, and clearer systems.");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = translations[currentLanguage][element.dataset.i18n];
    if (!value) return;
    const cursor = element.querySelector(".cursor");
    element.textContent = value;
    if (cursor) element.append(cursor);
  });
  applyLegacyPageCopy(currentLanguage);
  const languageLabel = document.querySelector("#language-label");
  const languageToggle = document.querySelector("#language-toggle");
  languageLabel.textContent = currentLanguage === "en" ? "日本語" : "English";
  languageToggle.setAttribute("aria-label", currentLanguage === "en" ? "日本語に切り替える" : "Switch to English");
}

const dialog = document.querySelector("#case-dialog");
const closeButton = document.querySelector(".dialog-close");
const fields = {
  banner: document.querySelector("#dialog-banner"), image: document.querySelector("#dialog-image"), kicker: document.querySelector("#dialog-kicker"), title: document.querySelector("#dialog-title"), actionLink: document.querySelector("#dialog-action-link"), actionImage: document.querySelector("#dialog-action-image"), actionSvg: document.querySelector("#dialog-action-svg"), actionText: document.querySelector("#dialog-action-text"), summary: document.querySelector("#dialog-summary"), role: document.querySelector("#dialog-role"), decision: document.querySelector("#dialog-decision"), output: document.querySelector("#dialog-output"), tools: document.querySelector("#dialog-tools"), problem: document.querySelector("#dialog-problem"), process: document.querySelector("#dialog-process"), ai: document.querySelector("#dialog-ai"), learning: document.querySelector("#dialog-learning"),
};

function escapeHTML(text) {
  return String(text ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function renderList(target, items) {
  target.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.innerHTML = escapeHTML(item);
    target.append(li);
  }
}

function renderTags(target, items) {
  target.innerHTML = "";
  for (const item of items) {
    const tag = document.createElement("span");
    tag.textContent = item;
    target.append(tag);
  }
}

function openCase(key) {
  const study = caseStudies[key];
  if (!study) return;
  const localized = currentLanguage === "ja" ? { ...study, ...(modalJa[key] || {}) } : study;
  fields.kicker.textContent = localized.kicker;
  fields.banner.dataset.fit = study.imageFit || "cover";
  fields.banner.dataset.tone = study.imageTone || "";
  fields.image.src = study.image || "";
  fields.image.alt = study.imageAlt || `${study.title} visual`;
  fields.title.textContent = study.title;
  if (study.link) {
    fields.actionLink.href = study.link.url;
    fields.actionText.textContent = currentLanguage === "ja" ? (key === "moftail" ? "ウェブサイトを見る" : "リポジトリを見る") : study.link.label;
    fields.actionLink.style.display = "inline-flex";
    if (study.link.type === "moftail") { fields.actionImage.src = "./assets/Moftail-logo.png"; fields.actionImage.style.display = "block"; fields.actionSvg.style.display = "none"; }
    else if (study.link.type === "github") { fields.actionImage.style.display = "none"; fields.actionSvg.style.display = "block"; }
    else { fields.actionImage.style.display = "none"; fields.actionSvg.style.display = "none"; }
  } else fields.actionLink.style.display = "none";
  fields.summary.textContent = localized.summary;
  fields.role.textContent = localized.role;
  fields.decision.textContent = localized.decision;
  fields.output.textContent = localized.output;
  fields.problem.textContent = localized.problem;
  fields.learning.textContent = localized.learning;
  renderTags(fields.tools, study.tools || []);
  const localizedLists = currentLanguage === "ja" ? (modalJaLists[key] || {}) : study;
  renderList(fields.process, localizedLists.process || study.process || []);
  renderList(fields.ai, localizedLists.ai || study.ai || []);
  lockPageScroll();
  dialog.showModal();
  dialog.scrollTop = 0;
}

document.querySelectorAll("[data-case]").forEach((card) => card.addEventListener("click", () => openCase(card.dataset.case)));
document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", async () => {
    const email = button.dataset.copyEmail;
    const originalText = button.textContent;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(email);
      else {
        const fallback = document.createElement("textarea");
        fallback.value = email; fallback.setAttribute("readonly", ""); fallback.style.position = "fixed"; fallback.style.opacity = "0";
        document.body.append(fallback); fallback.select(); document.execCommand("copy"); fallback.remove();
      }
      button.textContent = "Copied";
      window.setTimeout(() => { button.textContent = originalText; }, 1800);
    } catch { button.textContent = email; }
  });
});

document.querySelector("#language-toggle").addEventListener("click", () => {
  applyLanguage(currentLanguage === "en" ? "ja" : "en");
});

closeButton.addEventListener("click", () => dialog.close());
dialog.addEventListener("close", unlockPageScroll);
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

applyLanguage(currentLanguage);
