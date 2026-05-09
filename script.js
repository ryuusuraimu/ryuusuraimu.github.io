const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let spotlightFrame = null;
let knowledgeGraphFrame = null;

const knowledgeLinks = [
  ["core", "moftail"],
  ["core", "anchor"],
  ["core", "shopify"],
  ["core", "zen"],
  ["core", "strategy"],
  ["core", "ai"],
  ["core", "doc"],
  ["moftail", "ai"],
  ["moftail", "zen"],
  ["anchor", "strategy"],
  ["shopify", "zen"],
  ["zen", "strategy"],
  ["doc", "anchor"],
];

function updateSpotlight() {
  spotlightFrame = null;
  if (prefersReduced) return;

  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = window.scrollY / maxScroll;
  const wave = Math.sin(progress * Math.PI * 4.8);
  const scale = 1 + Math.abs(wave) * 0.26;
  const x = (progress - 0.5) * 120;
  const y = Math.sin(progress * Math.PI * 2) * 32;

  document.documentElement.style.setProperty("--spotlight-scale", scale.toFixed(3));
  document.documentElement.style.setProperty("--spotlight-x", `${x.toFixed(1)}px`);
  document.documentElement.style.setProperty("--spotlight-y", `${y.toFixed(1)}px`);
}

function requestSpotlightUpdate() {
  if (spotlightFrame !== null) return;
  spotlightFrame = window.requestAnimationFrame(updateSpotlight);
}

function drawKnowledgeGraph() {
  knowledgeGraphFrame = null;

  const net = document.querySelector(".knowledge-net");
  const svg = document.querySelector(".knowledge-edges");
  if (!net || !svg) return;

  const netRect = net.getBoundingClientRect();
  if (!netRect.width || !netRect.height) return;

  svg.setAttribute("viewBox", `0 0 ${netRect.width} ${netRect.height}`);
  svg.setAttribute("width", `${netRect.width}`);
  svg.setAttribute("height", `${netRect.height}`);

  const points = new Map();
  document.querySelectorAll(".knowledge-net [data-node]").forEach((node) => {
    const dot = node.querySelector("i");
    if (!dot) return;

    const dotRect = dot.getBoundingClientRect();
    points.set(node.dataset.node, {
      x: dotRect.left + dotRect.width / 2 - netRect.left,
      y: dotRect.top + dotRect.height / 2 - netRect.top,
    });
  });

  const fragment = document.createDocumentFragment();
  for (const [from, to] of knowledgeLinks) {
    const start = points.get(from);
    const end = points.get(to);
    if (!start || !end) continue;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", start.x.toFixed(1));
    line.setAttribute("y1", start.y.toFixed(1));
    line.setAttribute("x2", end.x.toFixed(1));
    line.setAttribute("y2", end.y.toFixed(1));
    fragment.append(line);
  }

  svg.replaceChildren(fragment);
}

function requestKnowledgeGraphDraw() {
  if (knowledgeGraphFrame !== null) return;
  knowledgeGraphFrame = window.requestAnimationFrame(drawKnowledgeGraph);
}

const caseStudies = {
  moftail: {
    kicker: "Case Study 01",
    title: "Moftail",
    image: "./assets/365Zen-Image.jpg",
    imageAlt: "Moftail Still Fox Tee visual",
    imageFit: "cover",
    role:
      "個人事業として、ブランド哲学、商品戦略、Shopify導線、広告、SNS、ドキュメント化までを一貫して設計。",
    decision:
      "商品数を広げる前に、Still Fox TeeをHero Productとして固定し、思想を検証可能な購入導線へ落とすことを優先しました。",
    output:
      "Balance of Lifeを中心にしたBrand OS、Hero Product戦略、PDP改善観点、365 Zen Moments、広告・SNS運用メモを整備。",
    tools: ["Shopify", "Printify", "Meta Ads", "Claude", "ChatGPT", "Markdown"],
    summary:
      "服を売るブランドではなく、Balance of Lifeという状態価値を日常に届けるPODブランド。Still Fox Teeを入口に、Shopify、広告、SNS、商品ページを一つの世界観として設計しています。",
    problem:
      "Moftailの課題は、思想を増やすことではなく、思想を売上につながる実行順序へ落とし込むことでした。世界観、広告、モックアップ、商品ページ、信頼情報が分断されると、ブランドは美しくても購入にはつながりません。",
    process: [
      "Balance of Life、Enso、Still Foxをブランドの核として定義",
      "Still Fox TeeをHero Productに置き、広告、PDP、世界観の入口を固定",
      "サイズ、素材、配送、返品、レビューなど購入前の不安をPDPで分解",
      "365 Zen Momentsを、calm / stillness / balanceを蓄積するコンテンツエンジンとして設計",
      "決定済み、仮説、未確定、次に見る指標をObsidian上のBrand OSとして整理",
    ],
    ai: [
      "ブランド哲学、広告訴求、商品説明、FAQを複数視点で生成・レビュー",
      "顧客視点、UX視点、広告視点で購入導線と信頼情報を点検",
      "画像生成プロンプト、短いZen line、投稿構造を作り、世界観から外れる表現を削る",
      "成長戦略を、勝ちモックアップ、勝ち訴求、商品ページ改善の順序に分解",
    ],
    learning:
      "きれいな思想を持っていても、何が決まっていて何が仮説かを整理しないと前に進めません。Moftailを通して、現在地を見えるようにすることが動き方を変えると気づきました。",
  },
  anchor: {
    kicker: "Case Study 02",
    title: "Anchor",
    image: "./assets/Anchor-Screens.jpg",
    imageAlt: "Anchor app screens",
    imageFit: "cover-left",
    role:
      "家族の実体験を起点に、問題定義、UX設計、SwiftUI実装方針、提出文章までを自分で統合。",
    decision:
      "緊急時に機能を増やしても使えません。事前のShield表示に絞り、声が出ない瞬間に判断させないようにしました。",
    output:
      "Offline-first QR、Shield、Shortcuts / App Intents、高コントラストUI、提出用の英日ドキュメントを含むMVPを作成。",
    tools: ["SwiftUI", "Xcode", "ChatGPT", "Claude", "UI Design"],
    summary:
      "家族のパニック時の実体験をもとに、声が出せない場面でも状況と助け方を伝えられる、オフライン完結の支援依頼カードとして設計しました。",
    problem:
      "パニック発作や感覚過負荷が起きる場面では、読む、話す、判断する能力がほぼゼロに近くなることがあります。本人は固まり、周囲の人も何をすべきか分からない。この沈黙を、会話なしで読める指示へ変える必要がありました。",
    process: [
      "North Starを「Prepareを日常の安心にし、Crisisで迷いなくShieldを展開できる」に設定",
      "Situation / Please Do / Please Don'tを事前に登録し、危機時はShieldとして即表示",
      "QRの中身にメッセージを直接埋め込み、通信不要で第三者に共有できる設計にした",
      "Shortcuts / App IntentsでBack TapやAction Buttonから起動できる導線を検討",
      "高コントラスト、大きい文字、短い文、誤タップしにくい余白で認知アクセシビリティを優先",
    ],
    ai: [
      "SwiftUI構成、Observation、App Intents、QR生成、状態管理の実装案を相談",
      "ChaosからCalmへ移るオンボーディング構造と、危機時文言の明確さを検討",
      "エラーやactor isolationの問題を最小再現に分け、Xcode / Playgroundsで検証",
      "提出文章では、問題、対象ユーザー、アクセシビリティ、使用技術を英日で整理",
    ],
    learning:
      "機能を足すより削る方が難しいと、Anchorを作って実感しました。アクセシビリティは後から乗せるものではなく、最初から設計の中心に置くものです。",
  },
  shopify: {
    kicker: "Case Study 03",
    title: "Shopify Theme Debugging",
    image: "./assets/Shopify-Theme.png",
    imageAlt: "Build My POD logo",
    imageFit: "contain",
    role:
      "ストア運営者として、商品ページ上の違和感を観察し、再現手順と原因仮説を整理。",
    decision:
      "感覚的に問い合わせるのではなく、期待値、実際の挙動、影響範囲を分けて第三者が検証できる形にしました。",
    output:
      "Shopify標準挙動とテーマ固有挙動を切り分けた共有ドキュメントと、外部チームに伝わる改善提案を作成。",
    tools: ["Shopify", "Liquid", "JavaScript", "Claude", "Markdown"],
    summary:
      "商品ページの価格やサイズ選択の挙動を調査し、再現手順、期待値、実際の挙動、原因仮説を共有可能な資料に整理しました。",
    problem:
      "最初はプラットフォームの問題に見えても、テーマのLiquidやフロントエンド実装が原因のことがあります。感覚で問い合わせると相手も動けないので、再現できる形にする必要がありました。",
    process: [
      "どの商品ページで発生するかを確認",
      "サイズ選択、価格表示、更新タイミングを観察",
      "Shopify標準挙動とテーマ固有挙動を切り分け",
      "前提条件、手順、期待値、実際の挙動、影響範囲を資料化",
    ],
    ai: [
      "Liquid、JavaScript、バリアント、テーマ設定の原因候補を整理",
      "技術的説明を非エンジニアにも伝わる粒度に調整",
      "外部チームへ共有しやすい文面へ変換",
    ],
    learning:
      "「なんか変」を「どの条件で、どう変か」に言い直すだけで、技術的な問題は解像度が上がります。",
  },
  zen: {
    kicker: "Case Study 04",
    title: "365 Zen Moments",
    image: "./assets/365Zen-Image.jpg",
    imageAlt: "365 Zen Moments content visual",
    imageFit: "cover",
    role:
      "Moftailの世界観を継続的に蓄積するため、SNS投稿の構造、文体、画像生成プロンプトを設計。",
    decision:
      "売り込み投稿ではなく、calm / stillness / balanceを静かに反復するブランド資産として扱いました。",
    output:
      "Image + Short Zen line + MOFTAILの投稿構造、モチーフ集、キャプション方針、転用可能なコンテンツ基盤を作成。",
    tools: ["Image Generation", "ChatGPT", "Claude", "Markdown", "SNS Planning"],
    summary:
      "Moftailのcalm、stillness、balance、awareness、natureを毎日の投稿として蓄積するブランド・コンテンツエンジンです。",
    problem:
      "小規模ブランドは、強い広告だけではなく静かな反復で信頼を積み上げる必要があります。ただし毎回ゼロから投稿を考えると、世界観がぶれ、単なるaesthetic画像集になってしまいます。",
    process: [
      "Image + Short Zen line + MOFTAILという最小構造を固定",
      "morning light、forest、water、mist、tea ritual、windowsなどのモチーフを整理",
      "売り込みすぎない、説明しすぎない、ブランドの核から外れない原則を定義",
      "投稿を広告コピー、Zen Micro Film、商品ページ文脈へ転用できる資産として設計",
    ],
    ai: [
      "投稿テーマの発散と整理",
      "英語の画像生成プロンプト設計",
      "短いキャプション案の作成とトーン調整",
    ],
    learning:
      "AIは量を出してくれますが、何を選んで何を捨てるかは自分が決めないとブランドはぶれます。",
  },
};

const dialog = document.querySelector("#case-dialog");
const closeButton = document.querySelector(".dialog-close");
const fields = {
  banner: document.querySelector("#dialog-banner"),
  image: document.querySelector("#dialog-image"),
  kicker: document.querySelector("#dialog-kicker"),
  title: document.querySelector("#dialog-title"),
  summary: document.querySelector("#dialog-summary"),
  role: document.querySelector("#dialog-role"),
  decision: document.querySelector("#dialog-decision"),
  output: document.querySelector("#dialog-output"),
  tools: document.querySelector("#dialog-tools"),
  problem: document.querySelector("#dialog-problem"),
  process: document.querySelector("#dialog-process"),
  ai: document.querySelector("#dialog-ai"),
  learning: document.querySelector("#dialog-learning"),
};

// Wrap the last character + trailing CJK punctuation in a white-space:nowrap
// span so punctuation can never be stranded alone on the final line.
function noOrphan(text) {
  if (!text) return text;
  const esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(/(.)([。、！？…]+)$/u, (_, c, p) =>
    `<span style="white-space:nowrap">${c}${p}</span>`
  );
}

function renderList(target, items) {
  target.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.innerHTML = noOrphan(item);
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

  fields.kicker.textContent = study.kicker;
  fields.banner.dataset.fit = study.imageFit || "cover";
  fields.image.src = study.image || "";
  fields.image.alt = study.imageAlt || `${study.title} visual`;
  fields.title.textContent = study.title;
  fields.summary.innerHTML = noOrphan(study.summary);
  fields.role.innerHTML = noOrphan(study.role);
  fields.decision.innerHTML = noOrphan(study.decision);
  fields.output.innerHTML = noOrphan(study.output);
  fields.problem.innerHTML = noOrphan(study.problem);
  fields.learning.innerHTML = noOrphan(study.learning);
  renderTags(fields.tools, study.tools || []);
  renderList(fields.process, study.process);
  renderList(fields.ai, study.ai);
  dialog.showModal();
}

document.querySelectorAll("[data-case]").forEach((card) => {
  card.addEventListener("click", () => openCase(card.dataset.case));
});

document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", async () => {
    const email = button.dataset.copyEmail;
    const originalText = button.textContent;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const fallback = document.createElement("textarea");
        fallback.value = email;
        fallback.setAttribute("readonly", "");
        fallback.style.position = "fixed";
        fallback.style.opacity = "0";
        document.body.append(fallback);
        fallback.select();
        document.execCommand("copy");
        fallback.remove();
      }

      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = originalText;
      }, 1800);
    } catch {
      button.textContent = email;
    }
  });
});

closeButton.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  const isBackdropClick =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (isBackdropClick) {
    dialog.close();
  }
});

window.addEventListener("scroll", requestSpotlightUpdate, { passive: true });
window.addEventListener("resize", () => {
  requestSpotlightUpdate();
  requestKnowledgeGraphDraw();
});

if ("ResizeObserver" in window) {
  const knowledgeNet = document.querySelector(".knowledge-net");
  if (knowledgeNet) {
    new ResizeObserver(requestKnowledgeGraphDraw).observe(knowledgeNet);
  }
}

if (document.fonts?.ready) {
  document.fonts.ready.then(requestKnowledgeGraphDraw);
}

window.addEventListener("load", requestKnowledgeGraphDraw);
updateSpotlight();
requestKnowledgeGraphDraw();
