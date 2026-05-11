const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let spotlightFrame = null;

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

const caseStudies = {
  moftail: {
    kicker: "Case Study 01",
    title: "Moftail",
    image: "./assets/365Zen-Image.jpg",
    imageAlt: "Moftail Still Fox Tee visual",
    imageFit: "cover",
    role:
      "実際に運営しているShopifyベースのPODブランドとして、EC、広告、UX、制作ワークフローを検証するProduct Labを設計・運営。",
    decision:
      "単なるアパレル作品ではなく、商品ページ、広告クリエイティブ、レビュー、配送説明、制作ワークフローを検証できる場として扱いました。",
    output:
      "Balance of Lifeを中心にしたBrand OS、Hero Product戦略、PDP改善観点、広告・SNS運用メモ、制作ワークフローを整備。",
    tools: ["Shopify", "Printify", "Meta Ads", "Documentation", "Markdown"],
    summary:
      "Moftail is my real-world product lab. Shopify-based POD brand for the US marketとして、商品ページ、広告、レビュー、配送説明、制作ワークフローを実際の運営の中で検証しています。",
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
      "ブランド哲学、広告訴求、商品説明、FAQを複数視点でレビュー",
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
      "パニック時はスマホを見ることすら負荷になるため、機能を増やすより、事前メッセージ、オフラインQR、ショートカットで判断負荷を減らすことを優先しました。",
    output:
      "Offline-first QR、Shield、Shortcuts / App Intents、高コントラストUI、提出用の英日ドキュメントを含むMVPを作成。",
    tools: ["SwiftUI", "Xcode", "Product Writing", "UI Design"],
    summary:
      "Anchor is an iOS app designed for panic situations, where even opening a phone can feel difficult. Prepared messages, offline QR sharing, and shortcut-based actions reduce decision load.",
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
      "SwiftUI構成、Observation、App Intents、QR生成、状態管理の実装案を整理",
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
      "“Something feels broken” を、再現可能な技術課題へ変換することを重視し、期待値、実際の挙動、影響範囲を分けて第三者が検証できる形にしました。",
    output:
      "Shopify標準挙動とテーマ固有挙動を切り分けた共有ドキュメントと、外部チームに伝わる改善提案を作成。",
    tools: ["Shopify", "Liquid", "JavaScript", "Markdown"],
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
      "Visual + Short Zen line + MOFTAILの投稿構造、モチーフ集、キャプション方針、転用可能なコンテンツ基盤を作成。",
    tools: ["Content Planning", "Markdown", "SNS Planning"],
    summary:
      "Moftailのcalm、stillness、balance、awareness、natureを毎日の投稿として蓄積するブランド・コンテンツエンジンです。",
    problem:
      "小規模ブランドは、強い広告だけではなく静かな反復で信頼を積み上げる必要があります。ただし毎回ゼロから投稿を考えると、世界観がぶれ、単なるaesthetic画像集になってしまいます。",
    process: [
      "Visual + Short Zen line + MOFTAILという最小構造を固定",
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
      "量を出すだけでは、ブランドはまとまりません。何を選び、何を捨てるかを決める編集力が重要だと学びました。",
  },
  stockwise: {
    kicker: "Case Study 05",
    title: "StockWise",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 760'%3E%3Crect width='1200' height='760' fill='%230c172b'/%3E%3Cg fill='none' stroke='%2350f58d' stroke-width='18' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M150 540h900' opacity='.28'/%3E%3Cpath d='M190 520 350 390l130 70 210-240 130 120 190-190'/%3E%3C/g%3E%3Crect x='126' y='110' width='948' height='150' rx='28' fill='%23fff8e8' stroke='%230d1628' stroke-width='10'/%3E%3Ctext x='170' y='202' font-family='Inter,Arial,sans-serif' font-size='56' font-weight='900' fill='%230d1628'%3EFAQ search: PER / PBR / NISA%3C/text%3E%3Cg font-family='Inter,Arial,sans-serif' font-weight='900'%3E%3Crect x='150' y='315' width='260' height='88' rx='20' fill='%23ffd91f'/%3E%3Ctext x='190' y='372' font-size='38' fill='%230d1628'%3EDividend%3C/text%3E%3Crect x='450' y='315' width='210' height='88' rx='20' fill='%23ddf1ff'/%3E%3Ctext x='500' y='372' font-size='38' fill='%230d1628'%3ENISA%3C/text%3E%3Crect x='700' y='315' width='260' height='88' rx='20' fill='%23ffe3ea'/%3E%3Ctext x='755' y='372' font-size='38' fill='%230d1628'%3EPER/PBR%3C/text%3E%3C/g%3E%3C/svg%3E",
    imageAlt: "StockWise FAQ search app concept",
    imageFit: "cover",
    imageTone: "dark",
    role:
      "株式投資初心者向けに、検索UX、FAQ構造、用語説明の粒度を設計。React + TypeScriptで検索型FAQアプリとして構築。",
    decision:
      "投資情報を増やすのではなく、初心者が最初につまずくPER、PBR、NISA、配当利回りなどの基本用語をすぐ調べられる導線に絞りました。",
    output:
      "FAQ-style knowledge search app、カテゴリ設計、検索UI、基本用語の質問分解、React + TypeScript構成。",
    tools: ["React", "TypeScript", "Search UX", "FAQ Design"],
    summary:
      "FAQ-style knowledge search app for beginner investors. 株式投資初心者が、PER、PBR、NISA、配当利回りなどの基本用語をすぐに調べられる検索型FAQアプリです。",
    problem:
      "初心者向けの投資情報は多い一方で、知りたい言葉にすぐ辿り着けない、説明の粒度が難しすぎる、関連質問が見えないという課題があります。",
    process: [
      "初心者が検索しそうな用語と質問を整理",
      "PER、PBR、NISA、配当利回りなどをFAQ単位に分解",
      "検索結果から関連質問へ移れる情報設計を検討",
      "React + TypeScriptで検索UIとFAQ構造を実装",
    ],
    ai: [
      "初心者が抱く質問の洗い出し",
      "用語説明の粒度調整",
      "FAQ構造と検索導線のレビュー",
      "React / TypeScript実装の補助",
    ],
    learning:
      "検索UXでは、情報量よりも質問の入口をどう作るかが重要です。StockWiseでは、知識を並べるだけでなく、初心者の言葉から辿れる構造を意識しました。",
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
  fields.banner.dataset.tone = study.imageTone || "";
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
window.addEventListener("resize", requestSpotlightUpdate);
updateSpotlight();
