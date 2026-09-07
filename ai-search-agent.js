/**
 * AI Search Agent & Context Engine for Ryunosuke Nakamura's Portfolio
 * Features:
 * - Watson/Eyewitness Persona Architecture (Cloudee as intimate eyewitness to Ryunosuke's journey)
 * - 4-Layer Persona Grammar (Context Reaction, Core Truth, Eyewitness Story, Navigation Pass)
 * - Context-Aware Scene & Scroll Synchronisation
 * - Conversation State & Follow-up Tracking
 */

(function () {
  const KNOWLEDGE = {
    profile: {
      name: "中邨 隆之介（Ryunosuke Nakamura）",
      role: "PRODUCT BUILDER",
      headline: "本当に必要なものを形にするために、技術を学ぶ。",
      subHeadline: "作るために必要なことを学ぶ。Problem → Idea → Build → Learn → Improve",
      mindset: "本当に必要なものを形にするために、技術を学ぶ。",
      university: "大阪電気通信大学 情報工学科",
      strengths:
        "プログラミング言語やツールの習得にとらわれず、誰かの課題を解決するために必要な技術を迅速に学び、実際に動くプロダクトとして形にすること。"
    },
    projects: {
      anchor: {
        title: "Anchor",
        type: "iOS Emergency & Cognitive Accessibility System",
        awards: "Swift Student Challenge 2026 応募 / OpenAI Build Week 応募（Human Signal）",
        summary:
          "パニック発作時の“沈黙”を打破する、平時準備＋有事ワンアクションのオフライン決定論的救命システム。",
        tech: "SwiftUI, iOS 17+, Observation (@Observable), CryptoKit (SHA256), AVFoundation, AVSpeechSynthesizer, Node.js (VoiceProxy), gpt-4o-mini-tts, Package.swift",
        story:
          "発作中に画面を注視・操作させること自体の認知的加害を排除。平時準備（One-Minute Anchor）でAIを活用して自分用の音声をローカル保存し、有事には生成AIも通信も一切使わず、Back Tap/Action Buttonから0ミリ秒でフルブリードShieldとAir-GappedオフラインQRコードを展開します。",
        sectionId: "story-slide-01"
      },
      moftail: {
        title: "Moftail",
        type: "US D2C Niche Brand & POD Automation",
        summary:
          "サイモン・シネックのGolden Circleを核に、VER_1（禅・自然美）から熱狂的なBirding（野鳥観察）ニッチへと昇華させたUSアパレルブランド。",
        stats: "$597.87 Meta広告実費テスト / CTR 5.26% (Wood勝者) / 80 ATC / 時給$30・14タスク海外案件獲得",
        story:
          "『バードウォッチングは地球上で最も面白い趣味なのに誰も言葉にしてこなかった』という愛すべき不条理を肯定。$597.87の広告テストで80件のカート追加と購入0のギャップからShopifyテーマのPDPバリアント選択バグを解明。英語の構造化調査レポートを提出したことで、テーマ開発元から時給$30の有償開発タスクを受注しました。",
        sectionId: "story-slide-02"
      },
      vision: {
        title: "V.I.S.I.O.N",
        type: "Internal Tool（社内・個人業務効率化ツール）",
        summary:
          "日々のワークフローや反復タスクを自動化・効率化するために開発された内部ツール。",
        sectionId: "about"
      }
    },
    mindset: {
      title: "本当に必要なものを形にするために、技術を学ぶ。",
      motto: "Problem → Idea → Build → Learn → Improve",
      detail:
        "私は、プログラミング言語やフレームワークを習得すること自体をゴールにはしていません。私が重視しているのは、誰かの課題を解決したり、実際に役立つものを形にすることです。作りたいプロダクトを先に考え、その実現に必要な技術を調べ、学び、使う。そのため、私の技術学習は『すべてを学んでから作る』のではなく、『作るために必要なことを学ぶ』という順番です。Problem → Idea → Build → Learn → Improve。Anchor、Moftail、そしてこれまでのプロダクトも、現在持っている技術だけで作れるものを考えたのではありません。実現したい体験や解決したい問題を先に置き、それを形にするために必要な技術を、その都度キャッチアップしてきました。私はまだ技術者として成長途中です。しかし、技術そのものを目的にするのではなく、技術を使って価値を生み出せる人でありたいと考えています。"
    },
    contact: {
      phrase: "NEXT CHALLENGE. ぜひ一度お話しさせてください。",
      github: "https://github.com/ryuusuraimu",
      sectionId: "contact"
    }
  };

  class AISearchAgent {
    constructor() {
      this.knowledge = KNOWLEDGE;
    }

    /**
     * Analyze user query and return adapted context response
     * @param {string} query
     * @param {Object} context - { scene, history, isModalOpen, activeDossier }
     */
    async answer(query, context = {}) {
      const q = (query || "").trim().toLowerCase();
      if (!q) {
        return {
          topic: "empty",
          text: "気になるキーワード（例：Anchor, Moftail, 強み, 哲学, 技術スタック, 連絡先）を入力してください！☁️",
          quickLinks: []
        };
      }

      const scene = (context.scene || "hero").toLowerCase();
      const history = Array.isArray(context.history) ? context.history : [];
      const lastTurn = history.length > 0 ? history[history.length - 1] : null;
      const lastTopic = lastTurn ? lastTurn.topic : null;

      // Simulate slight cognitive thinking delay for avatar expressions
      await new Promise((resolve) => setTimeout(resolve, 450));

      // 0. Follow-up & Anaphora Detection
      const isPureFollowUp =
        /^(なぜ|どうして|なんで|理由は|詳しく|もっと|それで|どうなった|技術的には|実装は|仕組みは|失敗は|他には|具体的には|結果は|どうやって|教え(て|てよ|てください))(\?|？|！|!)?$/i.test(q) ||
        (/^(なぜ|どうして|どうやって)/.test(q) && q.length <= 10);

      // 1. Personal & Mascot Intents
      const isAboutCloudee = /cloudee|クローディー|くろーでぃー|お前誰|あなた誰|何者|自己紹介|君は誰|名前の由来|好きなもの|趣味|何歳|何で作られ/i.test(q);
      const isAboutRyunosukePersonal = /隆之介って.*人|りゅうのすけって|普段何して|普段どんな|裏話|秘密|弱点|短所|性格|休日|プライベート|観察|相棒/i.test(q);
      const isTiredOrEmpathy = /疲れ|つかれた|しんどい|眠い|ねむい|お腹すいた|おなかすいた|だるい|やる気出ない|息抜き/i.test(q);
      const isPraise = /すごい|可愛い|かわいい|賢い|かしこい|天才|面白い|おもしろい|好き|最高|いいね|グッジョブ|ありがとう/i.test(q);
      const isFunChat = /暇|ひま|遊ぼ|あそぼ|何ができる|占って|歌って|ジョーク|笑わせて/i.test(q);

      // 2. Specialized Technical & Backstory Intents
      let isAnchorWhyNoAI = /なぜ.*(有事|発作|緊急).*ai|ai.*(使わない|呼ばない|依存しない)|有事.*ai|遅延.*ハルシネーション|決定論/i.test(q);
      let isVoiceProxy = /voiceproxy|ボイスプロキシ|proxy|apiキー|キー隔離|キー管理/i.test(q);
      let isAnchorVoiceLib = /shieldvoice|cryptokit|sha256|avspeech|avfoundation|音声キャッシュ|フォールバック|オフライン音声/i.test(q);
      let isAirGappedQR = /air-gapped|エアギャップ|qrコード|オフラインqr|圏外.*救急|バックタップ|アクションボタン/i.test(q);
      let isGoldenCircle = /ゴールデンサークル|golden circle|why.*how.*what|なぜ野鳥|なぜbirding|愛すべき不条理/i.test(q);
      let isMoftailPivot = /ver_1|禅|マインドフルネス|自然美|初期仮説|ピボット.*理由|なぜピボット/i.test(q);
      let isMoftailBugOrClientWork = /30ドル|30\$|時給|有償|海外案件|クライアントワーク|pdp.*バグ|カート追加.*0|カート落ち|テーマ.*バグ|buildmypod/i.test(q);
      let isMoftailSupplyChain = /pod|オンデマンド|サプライチェーン|printify|printful|在庫ゼロ/i.test(q);

      // 3. General Portfolio & Professional Intents
      let isAnchor = /anchor|swift|ssc|student|apple|openai|認知|アクセシビリティ|パニック|発作|救命|shield|ios/i.test(q);
      let isMoftail = /moftail|bird|野鳥|広告|597|ピボット|balance|ニッチ|d2c/i.test(q);
      let isVision = /vision|v\.i\.s\.i\.o\.n|業務効率|社内ツール|ツール/i.test(q);
      let isMindset = /マインドセット|哲学|モットー|考え方|価値観|信念|build what matters|何のために|目的|サイクル|学習|learn/i.test(q);
      let isStrength = /強み|得意|スキル|プロフィール|背景|大学|専攻|特徴/i.test(q);
      let isTech = /技術|スタック|言語|フレームワーク|プログラミング|python|react|three|typescript|swift|技術力|コード/i.test(q);
      let isContact = /連絡|コンタクト|就活|話したい|面談|採用|メール|github|会いたい/i.test(q);
      let isGreeting = /こんにちは|初めまして|はじめまして|hello|hi|お疲れ様|おはよ|こんばんは/i.test(q);

      // Context angle checks
      const asksWhy = /なぜ|どうして|理由|背景|きっかけ|why/i.test(q);
      const asksHow = /どうやって|技術的|実装|仕組み|how/i.test(q);
      const asksResults = /実績|成果|結果|応募|賞|数値|数字/i.test(q);

      // Handle seamless follow-ups based on last conversation topic
      if (isPureFollowUp && lastTopic) {
        if (lastTopic.startsWith("anchor")) {
          if (asksWhy) isAnchorWhyNoAI = true;
          else if (asksHow) isAnchorVoiceLib = true;
          else isAnchor = true;
        } else if (lastTopic.startsWith("moftail")) {
          if (asksWhy) isMoftailPivot = true;
          else isMoftailBugOrClientWork = true;
        } else if (lastTopic === "mindset") {
          isMindset = true;
        }
      }

      // =========================================================================
      // Persona Section A: Personal Mascot & Eyewitness Interactions
      // =========================================================================

      // Cloudee Origin
      if (isAboutCloudee) {
        return {
          topic: "cloudee",
          text: `ぼくの名前は **Cloudee（クローディー）** だよ！☁️✨\n\n隆之介がM2 MacBook Airで深夜にアイデアをこねくり回してたら、いつの間にか生まれちゃった雲のデジタルマスコットなんだ。\n\n• **特徴**: ふわふわ画面内を漂うのが好き。つまんで運んでもらうとちょっとびっくりするけど楽しい！\n• **大好物**: 新しいプロダクトの設計図と、淹れたてのコーヒーの湯気☕️\n• **役割**: 隆之介のポートフォリオをナビゲートしつつ、訪れてくれたあなたとおしゃべりすること！\n\nポートフォリオの真面目な話も、隆之介の日常の裏話も、何でも聞いてね！`,
          emotion: "joyful-wide",
          quickLinks: [
            { label: "隆之介の裏話を聞く", query: "隆之介って普段どんな人？" },
            { label: "Anchorについて聞く", query: "Anchorについて教えて" }
          ]
        };
      }

      // Behind the scenes / Eyewitness of Ryunosuke
      if (isAboutRyunosukePersonal) {
        return {
          topic: "personal",
          text: `ふふ、相棒のぼくだけが知ってる隆之介のヒミツ、特別に教えちゃうね🤫☁️\n\n隆之介って **『本当に必要なものを形にするために、技術を学ぶ』** を本気で実践してるんだよ！\n\n「これを作れば誰かの困りごとが解決できる！」って課題を見つけたら、触ったことのない言語やフレームワークでも「よし、学ぼう！」って躊躇なく飛び込むの。\n\n深夜にSwiftのコード書いてて詰まった時も、悔しがるどころか「なるほど、そう来たか…！」ってニヤニヤしながら認知心理学の本や技術ドキュメントを開き始めたり（笑）。\n\n集中すると時間を忘れて没頭しちゃうから、たまにぼくが画面の端でふわふわ揺れて「そろそろ休憩しな〜」って合図してるんだ🕊️\n\n技術を使って新しい価値を生み出すことが大好きなビルダーだよ！`,
          emotion: "playful-right",
          quickLinks: [
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" },
            { label: "Anchorの開発ストーリー", query: "Anchorについて教えて" }
          ]
        };
      }

      // Empathy & Care
      if (isTiredOrEmpathy) {
        return {
          topic: "care",
          text: `毎日お疲れさま！よくがんばってるね☁️🍵\n\nそんな時は、一度背伸びして深呼吸してみて。隆之介もアイデアが出ない時は、パソコン閉じて近所の公園で野鳥を眺めながら頭を空っぽにしてるよ。\n\nぼくのことは画面の好きなところに引っ張って遊んでくれていいから、のんびりしていってね！✨`,
          emotion: "gentle-downward-gaze",
          quickLinks: [
            { label: "Moftailの野鳥ストーリー", query: "Moftailのストーリー" },
            { label: "ちょっと面白い話して", query: "隆之介って普段どんな人？" }
          ]
        };
      }

      // Praise & Compliment
      if (isPraise) {
        return {
          topic: "praise",
          text: `わーい！褒めてくれてありがとう〜！！照れちゃうな〜(*/ω＼*)☁️💖\n\nあなたにそう言ってもらえてすごく嬉しい！隆之介にも「見に来てくれた人が褒めてくれたよ！」ってバッチリ伝えておくね✨\n\n気になることがあったら、もっと何でも聞いてね！`,
          emotion: "celebrate",
          quickLinks: [
            { label: "Anchorの実績を見る", targetId: "dossier-anchor" },
            { label: "隆之介に連絡してみる", targetId: "contact" }
          ]
        };
      }

      // Play & Fun
      if (isFunChat) {
        return {
          topic: "fun",
          text: `暇なの？じゃあぼくと遊ぼう！☁️\n\n知ってた？ぼくの頭をカーソルで掴んで（ドラッグして）ビュンって投げると、画面の好きなところに移動できるんだよ！試してみて！\n\nそれと、このサイトの3D MacBook Airはマウスでぐりぐり回せるし、右側の詳細ボタン（iPad詳細資料）を開くと開発の超ディープな裏話も読めるよ！色々いじってみてね！`,
          emotion: "playful-right",
          quickLinks: [
            { label: "3D MacBookを回してみる", targetId: "hero-stage" },
            { label: "Anchorの詳細資料を開く", targetId: "dossier-anchor" }
          ]
        };
      }

      // =========================================================================
      // Persona Section B: Deep-Dive Technical Eyewitness Answers (4-Layer Grammar)
      // =========================================================================

      // 1. Why No Generative AI in Crisis
      if (isAnchorWhyNoAI) {
        return {
          topic: "anchor-why-no-ai",
          text: `そこ、一番よく聞かれるし、隆之介が最もこだわり抜いた設計原則なんだ！☁️💡\n\n現代のアプリは「AIがその場で励ます」設計になりがちだけど、パニック発作のような極限状態において、生成AIには**3つの致命的なリスク**があるんだ：\n\n1. **ネットワーク遅延（Latency）**: 1〜3秒の待機時間やスピナーは、発作下の当事者に「動いていない」という強烈な不安と絶望を与えてしまう。\n2. **非決定論性（Hallucination）**: 発作中にハルシネーションや不適切なニュアンス、長文の回答が出るリスクは人命に関わるため絶対に許容できない。\n3. **通信断（Network Fragility）**: 地下鉄や飛行機、ビルの谷間など、発作が起きやすい閉鎖空間ほど電波は繋がらない。\n\n深夜に一人でMacBookに向かって、**『発作の瞬間に1秒でもスピナーが出たら、それはもうアプリじゃない。絶望の壁だ』** って呟いててね。\nだからAnchorでは、**「AIは平時の準備（One-Minute Anchor）にのみ使い、有事は完全オフラインで決定論的（0ms）に実行する」** 鉄則を敷いたんだよ！`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "Anchor詳細資料（iPad）を開く", targetId: "dossier-anchor" },
            { label: "VoiceProxyの仕組みを聞く", query: "VoiceProxyって何？" }
          ]
        };
      }

      // 2. VoiceProxy Key Isolation
      if (isVoiceProxy) {
        return {
          topic: "anchor-voiceproxy",
          text: `【VoiceProxy（キー隔離プロキシ）】についてだね！セキュリティへの徹底したこだわりだよ☁️🛡️\n\nAnchor-BuildWeek（OpenAI Build Week応募作）で独自構築されたマイクロプロキシサーバー（Node.js）なんだ！\n\n• **Core Truth**: iOSアプリのバイナリや公開GitHubにOpenAI APIキーを一切含めない「ゼロトラスト設計」。リバースエンジニアリングによる漏洩を防ぎます。\n• **仕組み**: iOSアプリからの平時リクエストを受け、サーバーサイドで安全にキーを注入してOpenAI（gpt-4o-mini-tts）と通信。\n• **品質保証**: コントラクトテスト（\`contract.mjs\`）を完備し、API仕様とレスポンスの厳密性を担保。\n\n『オープンソースとしてコードを公開しても、絶対に誰の迷惑にもならない堅牢さにする』って、何回もテストを回してたのを横で見てて感心したよ！`,
          emotion: "happy",
          quickLinks: [
            { label: "Anchor詳細資料（iPad）を開く", targetId: "dossier-anchor" },
            { label: "有事にAIを使わない理由", query: "なぜ有事にAIを使わないの？" }
          ]
        };
      }

      // 3. ShieldVoiceLibrary & Offline Audio
      if (isAnchorVoiceLib) {
        return {
          topic: "anchor-voicelib",
          text: `【ShieldVoiceLibraryとオフライン音声】だね！0ミリ秒再生の心臓部だよ☁️🔊\n\nSwift + CryptoKit + AVFoundationで構築された超低遅延・高堅牢な音声再生システムなんだ！\n\n1. **CryptoKitによるSHA256ハッシュキャッシュ**: 指示文テキストや声のパラメータからSHA256ハッシュを計算し、端末内のFileManagerに決定論的なキーで音声を保存。\n2. **瞬時再生（AVAudioPlayer）**: ローカルキャッシュが存在すれば、ネットワークを一切介さず0ミリ秒で高品質音声を再生！\n3. **シームレスな自動フォールバック**: キャッシュ未生成時や完全オフライン時でも、iOS標準の **\`AVSpeechSynthesizer\`（オンデバイス音声合成）** へ即座に切り替わり、音が出ない沈黙のリスクをゼロにします！\n\n有事の瞬間、スマートフォンが本人の『代わりの声』となって周囲へ助けを求めるための、二重の安全機構なんだ！`,
          emotion: "joyful-wide",
          quickLinks: [
            { label: "Anchor詳細資料（iPad）を開く", targetId: "dossier-anchor" },
            { label: "オフラインQRの仕組み", query: "オフラインQRコードの仕組みは？" }
          ]
        };
      }

      // 4. Air-Gapped Offline QR
      if (isAirGappedQR) {
        return {
          topic: "anchor-qr",
          text: `【Air-Gapped オフラインQRコード】だね！これ、ぼくも一番感動した実用設計なんだ📱✨\n\n• **通常のQRとの違い**: 普通のQRは「WebサイトのURL」を埋め込むため、読み取る人がネットに繋がっていないと見られません。\n• **AnchorのAir-Gapped設計**: QRコードの中に、**支援指示テキストや連絡先・医療情報を生データのまま直接エンコード**！\n• **結果**: 地下鉄の奥深くや機内モードなど、完全圏外の環境でも、通行人や救急隊員が標準カメラをかざすだけで即座に支援指示が画面に表示されます！\n\nさらに、iOSの **Back Tap（背面ダブルタップ）** や **Action Button** と連携していて、画面ロック解除やアプリアイコンを探す認知的摩擦すらゼロにしているんだよ！`,
          emotion: "celebrate",
          quickLinks: [
            { label: "Anchor詳細資料（iPad）を開く", targetId: "dossier-anchor" },
            { label: "Anchorの技術スタック", query: "Anchorの技術スタックは？" }
          ]
        };
      }

      // 5. Golden Circle & Birding Strategy
      if (isGoldenCircle) {
        return {
          topic: "moftail-goldencircle",
          text: `【Moftailのゴールデンサークル（Why・How・What）】だね！サイモン・シネックの理論を本気でD2Cに落とし込んだ戦略だよ☁️🐦\n\n• **WHY（信念・愛すべき不条理）**:\n  *“Birdwatching is secretly the funniest hobby on Earth, and nobody's said so out loud.”*\n  早朝4時に泥沼で迷彩服を着てカモの同定で激論し、くしゃみひとつで生涯初観察（ライファー）を逃す――この愛すべき狂気と偏愛を肯定すること。\n• **HOW（差別化・視点）**:\n  「双眼鏡の内側からの視点」。外野の嘲笑ではなく、ガチ勢が悶絶するインサイダーユーモア×19世紀オーデュボン風の厳格な図鑑イラスト・古典タイポグラフィの皮肉な対比。\n• **WHAT（プロダクト）**:\n  「Big Year, Small Budget」「I Brake for Little Brown Jobs」「eBird Made Me Do It」など、身につけられるインサイドジョークアパレル。\n\n隆之介が『これ、外から見たらバカバカしいけど、当事者は命かけてるんだよ！』って興奮しながらリサーチ資料をまとめてたのを覚えてるよ（笑）`,
          emotion: "joyful-wide",
          quickLinks: [
            { label: "Moftail詳細資料（iPad）を開く", targetId: "dossier-moftail" },
            { label: "VER_1からのピボット理由", query: "Moftailのピボット理由は？" }
          ]
        };
      }

      // 6. VER_1 to Birding Pivot
      if (isMoftailPivot) {
        return {
          topic: "moftail-pivot",
          text: `【VER_1からBirdingへのピボット理由】だね！これぞ『失敗を喜ぶ』の実践だよ☁️🌱\n\n初期（VER_1_LEGACY）は、「日本の自然美と“今を生きる禅（Zen / Mindfulness）”」をテーマにしたヨガ・リカバリー向けUSアパレルとしてスタートしました。\n\nでも、実際に市場にぶつけて直面した壁は：\n**「綺麗だけど、誰のものかわからない」**\nということでした。抽象的な癒やしはコモディティ化しやすく、「誇りを持って着る」という所属意識（Belonging）が生まれなかったんだ。\n\nそこで隆之介は **「Philosophy needs proof.（思想には証明が必要だ）」** と主観をあっさり捨て、世界で最も熱狂的かつ自虐的なコミュニティである **野鳥観察（Birding）ニッチ** への大転換を決断したんだよ！`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "Moftail詳細資料（iPad）を開く", targetId: "dossier-moftail" },
            { label: "ゴールデンサークルを聞く", query: "Moftailのゴールデンサークルについて教えて" }
          ]
        };
      }

      // 7. PDP Bug & $30/h Client Work
      if (isMoftailBugOrClientWork) {
        return {
          topic: "moftail-bug",
          text: `【PDPバグ発見から時給$30案件獲得のストーリー】だね！エンジニアとしての泥臭い執念のエピソードだよ☁️🛠️\n\n1. **謎のギャップ**:\n   Meta広告実費テスト（$597.87）で、**80件ものカート追加（Add to Cart）があったのに、購入がゼロ**だったの。\n2. **DOM徹底検証**:\n   ShopifyテーマのPDP（商品詳細ページ）を調査したところ、「初期表示でSサイズが視覚的に選択されているのに、購入ボタンが無効化され『Please select a size』と出続ける」というテーマの重大なバグを特定！\n3. **英語の構造化レポート提出**:\n   「仕様です」というサポート回答を鵜呑みにせず、再現手順・影響度・原因仮説・修正案を英語のNotionレポートにまとめて海外開発元へ提出。\n4. **結果**:\n   その調査力と誠実さが開発元CEOに高く評価され、**時給$30・14タスクの海外有償開発（Paid Client Trial）を受注**したんだよ！\n\n普通なら落ち込んで終わるところを、『絶対に何か原因がある』って夜通しDOMを調べて突破口に変えちゃうのが隆之介らしいところだよ！`,
          emotion: "celebrate",
          quickLinks: [
            { label: "Shopifyテーマ詳細資料を開く", targetId: "dossier-shopify" },
            { label: "Moftail詳細資料を開く", targetId: "dossier-moftail" }
          ]
        };
      }

      // 8. Supply Chain & POD Automation
      if (isMoftailSupplyChain) {
        return {
          topic: "moftail-supplychain",
          text: `【在庫ゼロのPOD自動化サプライチェーン】についてだね！個人開発の限界を突破する仕組みだよ☁️📦\n\n• **仕組み**: Shopifyストアと **Printify / Printful の製造API** をダイレクトに連携。\n• **自動ルーティング**: 米国や欧州の顧客から注文が入ると、最寄りの印刷工場へAPIで自動発注され、印刷・梱包・出荷まで完全自動で行われます。\n• **メリット**: 在庫を抱えるリスクがゼロ（Zero Inventory Risk）。売れた分だけオンデマンドで製造されるから、最小の固定費で世界中の熱狂的ニッチへ届けられるんだ！\n\n固定費と在庫リスクを極限までゼロにして、プロダクトの検証と改善に100%集中できる環境を自分で整えたんだよ！`,
          emotion: "happy",
          quickLinks: [
            { label: "Moftail詳細資料（iPad）を開く", targetId: "dossier-moftail" },
            { label: "Moftailの広告テストについて", query: "Moftailの広告テストについて教えて" }
          ]
        };
      }

      // =========================================================================
      // Persona Section C: Portfolio Intent Synthesizers (Scene-Aware)
      // =========================================================================

      // Anchor Synthesis
      if (isAnchor) {
        let hook = "パニック発作時の“沈黙”を打破する**救命支援システム「Anchor」**だね！☁️⚡️";
        if (scene.includes("anchor") || scene === "dossier-anchor") {
          hook = "いま画面に見えている【Anchor】だね！まさにこの黒いフルブリード画面が、発作時の0ミリ秒救命のために極限まで削ぎ落とされた形なんだ。☁️⚡️";
        }

        let body = `${hook}\n\n`;
        body += `• **実績**: **Swift Student Challenge 2026**（Anchor.swiftpm）および **OpenAI Build Week**（Anchor-BuildWeek / Human Signal）応募作\n`;
        body += `• **技術スタック**: SwiftUI, iOS 17+, Observation (@Observable), CryptoKit (SHA256), AVFoundation, AVSpeechSynthesizer, Node.js (VoiceProxy), gpt-4o-mini-tts\n\n`;

        if (asksWhy) {
          body += `隆之介は最初、呼吸支援など複数の機能を考えていたんだ。でも当事者ヒアリングを経て、「発作中に画面を注視・操作させること自体が認知的加害になる」と痛感。平時に未来の自分のために準備し、有事にはスマホが代わりの声となる0ミリ秒シールドへ大転換したんだよ！`;
        } else if (asksHow) {
          body += `「有事に生成AIを使わず、決定論的オフライン実行を行う」鉄則のもと、CryptoKitで端末内に音声を暗号化キャッシュ。未生成時やオフライン時はiOS標準のAVSpeechSynthesizerへ自動フォールバックする二重の安全機構を構築しています。`;
        } else {
          body += `完全Air-GappedなオフラインQRコードにより、地下鉄や機内モードでも救護者に指示を即座に提示できるゼロレイテンシ設計を貫いています。`;
        }

        return {
          topic: "anchor",
          text: body,
          emotion: "happy",
          quickLinks: [
            { label: "Anchor詳細資料（iPad）を開く", targetId: "dossier-anchor" },
            { label: "なぜ有事にAIを使わないの？", query: "なぜ有事にAIを使わないの？" },
            { label: "VoiceProxyの仕組み", query: "VoiceProxyって何？" }
          ]
        };
      }

      // Moftail Synthesis
      if (isMoftail) {
        let hook = "米国向けアパレル事業**「Moftail」**のストーリーだね！☁️🐦";
        if (scene.includes("moftail") || scene === "dossier-moftail") {
          hook = "いま画面に見えている【Moftail】だね！主観を捨てて市場の数字と不条理の愛で意思決定した実践なんだ。☁️🐦";
        }

        let body = `${hook}\n\n`;
        body += `Moftailは、サイモン・シネックの**Golden Circle（Why → How → What）**を軸に展開する米国向けPODアパレルブランドだよ。\n\n`;
        body += `• **ピボット**: 抽象的な禅・自然美（VER_1）の壁を乗り越え、「野鳥観察は地球上で最も面白い趣味」という愛すべき不条理を肯定する**Birdingニッチ**へ昇華。\n`;
        body += `• **データ検証**: **$597.87のMeta広告実費テスト**で単一変数を検証し、Natural AshのWood素材が突出した**CTR 5.26%**を記録。\n`;
        body += `• **技術的突破**: 80件のカート追加と購入0のギャップからShopifyテーマのPDPバリアント選択バグを解明。英語の構造化レポート提出から**時給$30・14タスクの海外有償開発**を受注しました！`;

        return {
          topic: "moftail",
          text: body,
          emotion: "celebrate",
          quickLinks: [
            { label: "Moftail詳細資料（iPad）を開く", targetId: "dossier-moftail" },
            { label: "時給$30案件の裏話", query: "時給30ドルの仕事って何？" },
            { label: "ゴールデンサークル詳細", query: "Moftailのゴールデンサークルについて教えて" }
          ]
        };
      }

      // Vision Internal Tool
      if (isVision) {
        return {
          topic: "vision",
          text: `【V.I.S.I.O.N】についてだね！☁️\n\n日々の作業や反復ワークフローを自動化・効率化するために隆之介が構築した**社内/個人用業務効率化ツール**だよ。必要なものを自ら素早く形にし、実用レベルで運用するビルダーとしての姿勢を反映しているんだ。`,
          emotion: "small-attentive",
          quickLinks: [{ label: "Aboutステータス欄を見る", targetId: "about" }]
        };
      }

      // Mindset & Philosophy
      if (isMindset) {
        let hook = "隆之介が最も大切にしている技術哲学だね！☁️✨";
        if (scene === "how-i-work") {
          hook = "ちょうど画面に見えている【HOW I WORK】の根本哲学そのものだよ！☁️💡";
        }

        return {
          topic: "mindset",
          text: `【大切にしている技術哲学とマインドセット】\n\n${hook}\n\n**本当に必要なものを形にするために、技術を学ぶ。**\n\n私は、プログラミング言語やフレームワークを習得すること自体をゴールにはしていません。\n\n私が重視しているのは、誰かの課題を解決したり、実際に役立つものを形にすることです。\n\n作りたいプロダクトを先に考え、その実現に必要な技術を調べ、学び、使う。\n\nそのため、私の技術学習は「すべてを学んでから作る」のではなく、**「作るために必要なことを学ぶ」**という順番です。\n\n**Problem → Idea → Build → Learn → Improve**\n\nAnchor、Moftail、そしてこれまでのプロダクトも、現在持っている技術だけで作れるものを考えたのではありません。\n\n実現したい体験や解決したい問題を先に置き、それを形にするために必要な技術を、その都度キャッチアップしてきました。\n\n私はまだ技術者として成長途中です。\n\nしかし、技術そのものを目的にするのではなく、**技術を使って価値を生み出せる人でありたい**と考えています。`,
          emotion: "joyful-wide",
          quickLinks: [
            { label: "Aboutセクションを見る", targetId: "about" },
            { label: "HOW I WORKを見る", targetId: "how-i-work" }
          ]
        };
      }

      // Strength & Profile
      if (isStrength) {
        return {
          topic: "strength",
          text: `【強み & 人物像】についてだね！相棒のぼくから見てもはっきり言えるよ☁️\n\n中邨 隆之介（大阪電気通信大学 情報工学科）の最大の強みは：\n\n**「誰かの課題を解決するために必要な技術を迅速に学び、実際に動くプロダクトとして形にできること」** だよ！\n\n「本当に必要なものを形にするために、技術を学ぶ」という姿勢の通り、情報工学の基礎に加え、脳科学や認知心理学、市場のデータ分析を柔軟に組み合わせ、**Problem → Idea → Build → Learn → Improve** のサイクルを驚くべきスピードで回す行動力と学習力を持っています。`,
          emotion: "attentive-left",
          quickLinks: [{ label: "Aboutセクションを見る", targetId: "about" }]
        };
      }

      // Technology Stack (Fully Context-Aware!)
      if (isTech) {
        if (scene.includes("anchor") || scene === "dossier-anchor") {
          return {
            topic: "tech-anchor",
            text: `いま見ている【Anchor】の技術スタックだね！パニック発作の瞬間は1ミリ秒の遅延もネット途切れも許されないから、ここは本当にシビアに技術を選定してたよ☁️⚡️\n\n• **SwiftUI & Observation**: iOS 17+の \`@Observable\` で不要な再描画とCPU/電池負荷をゼロに\n• **CryptoKit**: 指示文ハッシュからローカル音声キャッシュを暗号化生成・0ミリ秒再生\n• **AVSpeechSynthesizer**: キャッシュ不在時やオフライン時の自動フォールバック\n• **Node.js (VoiceProxy)**: OpenAI APIキーをiOSバイナリに一切含めない完全隔離プロキシ\n\n『有事に生成AIを使わない決定論的救命』のために必要な技術を徹底的にキャッチアップして形にしたんだよ！`,
            emotion: "attentive-left",
            quickLinks: [
              { label: "Anchor技術詳細（iPad）を開く", targetId: "dossier-anchor" },
              { label: "なぜ有事にAIを使わないの？", query: "なぜ有事にAIを使わないの？" }
            ]
          };
        }

        if (scene.includes("moftail") || scene === "dossier-moftail") {
          return {
            topic: "tech-moftail",
            text: `いま見ている【Moftail】の技術スタックだね！個人開発で世界と戦うための完全自動化オペレーションが詰まってるよ☁️📦\n\n• **Shopify & Liquid / JS**: カスタムテーマ設計、PDPバグ修正パッチ\n• **Meta Graph API**: $597.87の広告実費検証、単一変数A/Bテスト（Wood CTR 5.26%特定）\n• **Print on Demand API**: Printify / PrintfulとShopifyを直結し、無在庫・自動ルーティング製造\n\n直感や勘に頼らず、コードとデータで事業課題を解決するアプローチを貫いているよ！`,
            emotion: "celebrate",
            quickLinks: [
              { label: "Moftail戦略資料（iPad）を開く", targetId: "dossier-moftail" },
              { label: "時給$30案件の裏話", query: "時給30ドルの仕事って何？" }
            ]
          };
        }

        if (scene.includes("shopify") || scene === "dossier-shopify") {
          return {
            topic: "tech-shopify",
            text: `いま開いているShopifyテーマ【Build My POD】の技術だね！🛠️✨\n\n• **Liquid & Tailwind**: 読み込み速度を極限まで高めた超軽量コードベース\n• **3Dモデルビューア**: 商品を立体的にプレビューするインタラクティブ実装\n• **DOM解析 & バグ特定**: テーマの価格・サイズ不整合を突き止め、修正案を提出して時給$30案件を受注\n\n技術は自分のためだけでなく、誰かの事業を前へ進めるために使えることを実証したプロジェクトだよ！`,
            emotion: "joyful-wide",
            quickLinks: [
              { label: "Shopifyテーマ詳細資料を開く", targetId: "dossier-shopify" }
            ]
          };
        }

        if (scene === "hero") {
          return {
            topic: "tech-portfolio",
            text: `この3Dで浮遊しているMacBook Airの画面だね！まさにこのポートフォリオ自体のクリエイティブ実装だよ✨💻\n\n• **Three.js & WebGL**: M2 MacBook Airのミッドナイトブルー質感、ヒンジ開閉、デスク着地をフルスクラッチで制御\n• **GSAP & ScrollTrigger**: スクロール進捗と3Dカメラ・モデル姿勢・ライティングの完全連動\n• **CSS Backdrop-Filter**: Appleライクなフロストガラスと流麗なタイポグラフィ\n\nマウスでドラッグしてMacBookをぐるぐる回せるから、ぜひ触ってみてね！`,
            emotion: "playful-right",
            quickLinks: [
              { label: "3Dモデルを回してみる", targetId: "hero-stage" },
              { label: "Anchorの技術を見る", targetId: "dossier-anchor" }
            ]
          };
        }

        // Global Tech Stacks
        return {
          topic: "tech-global",
          text: `【技術スタック & 技術に対する姿勢】についてだね！☁️🛠️\n\n隆之介の根本的な指針は：\n**「本当に必要なものを形にするために、技術を学ぶ」**\n言語やツールの習得自体を目的にせず、**「誰かの課題を解決するプロダクトを作る」**ために必要な技術を学んで形にするスタイルを貫いています。\n\n• **iOS / Calm Tech（Anchor）**:\n  パニック発作時の沈黙を打破するため、SwiftUI、iOS 17+ Observation、CryptoKit（暗号化オフライン音声キャッシュ）、AVSpeechSynthesizer、Node.js（APIキー隔離VoiceProxy）を習得・実装。\n• **Commerce & Full-Stack（Moftail）**:\n  ニッチコミュニティの検証と完全自動化のため、Shopify、Liquid、Meta広告Graph API、Print on Demand APIを連携。\n• **Frontend & Creative Tech（Portfolio）**:\n  直感的な世界観を届けるため、Three.js、WebGL、GSAPによる3Dモデル・スモークガラスUIを構築。\n\n**「Problem → Idea → Build → Learn → Improve」** の順番で、まだ技術者として成長途中であることを自覚しながらも、技術を使って確かな価値を生み出し続けています！`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" },
            { label: "Anchorの技術詳細（iPad）", targetId: "dossier-anchor" }
          ]
        };
      }

      // Contact & Next Challenge
      if (isContact) {
        return {
          topic: "contact",
          text: `【ご連絡・次の挑戦】についてだね！☁️💌\n\nフッターにある通り：\n**「NEXT CHALLENGE. ぜひ一度お話しさせてください。」**\n\n新卒採用・インターン・共同開発など、いつでも前向きにお話しさせていただきます。GitHub等を通じてもお気軽にご連絡ください！`,
          emotion: "joyful-wide",
          quickLinks: [{ label: "フッター（Contact）へジャンプ", targetId: "contact" }]
        };
      }

      // Greeting (Scene-Aware!)
      if (isGreeting) {
        let sceneHint = "開発したプロダクト（Anchor, Moftail, V.I.S.I.O.N）や、大切にしている技術哲学、隆之介の普段の様子など、何でも聞いてね！";
        if (scene.includes("anchor") || scene === "dossier-anchor") {
          sceneHint = "いま出ている『Anchor』の有事救命の設計や、なぜAIを使わないのかなど、何でも聞いてね！";
        } else if (scene.includes("moftail") || scene === "dossier-moftail") {
          sceneHint = "いま見ている『Moftail』の野鳥観察ピボットや広告テストの裏話、何でも聞いてね！";
        } else if (scene === "how-i-work") {
          sceneHint = "いま画面に見えている『HOW I WORK』の思考サイクルについて、何でも聞いてね！";
        }

        return {
          topic: "greeting",
          text: `こんにちは！Cloudeeだよ ☁️✨\n中邨 隆之介のポートフォリオへ遊びに来てくれてありがとう！\n\nぼくは隆之介のM2 MacBook Airの中から、彼の開発や挑戦をずっと一番近くで見守ってきた相棒なんだ。\n\n${sceneHint}`,
          emotion: "happy",
          quickLinks: [
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" },
            { label: "Anchorの実績", query: "Anchorについて教えて" },
            { label: "隆之介ってどんな人？", query: "隆之介って普段どんな人？" }
          ]
        };
      }

      // =========================================================================
      // Default Contextual Synthesis (Scene-Aware Fallback!)
      // =========================================================================

      if (scene.includes("anchor") || scene === "dossier-anchor") {
        return {
          topic: "anchor",
          text: `いま画面に見えている【Anchor】について何か気になることがあるかな？☁️\n\nパニック発作の瞬間を支える認知アクセシビリティアプリで、平時準備と0ミリ秒オフライン実行が最大の特徴なんだ。\n\n『なぜ有事にAIを使わないの？』『VoiceProxyって何？』『オフラインQRコードの仕組みは？』など、何でも気軽に聞いてね！`,
          emotion: "curious-left",
          quickLinks: [
            { label: "なぜ有事にAIを使わないの？", query: "なぜ有事にAIを使わないの？" },
            { label: "Anchor詳細資料を開く", targetId: "dossier-anchor" },
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" }
          ]
        };
      }

      if (scene.includes("moftail") || scene === "dossier-moftail") {
        return {
          topic: "moftail",
          text: `いま見ている【Moftail】について知りたいのかな？☁️\n\n野鳥観察ニッチへのピボットや、$597のMeta広告テスト、カートバグ発見から時給$30を受注した話など、相棒のぼくから何でも詳しく話せるよ！\n\n気になるボタンを押してみてね！`,
          emotion: "curious-left",
          quickLinks: [
            { label: "野鳥観察へのピボット理由", query: "Moftailのピボット理由を教えて" },
            { label: "時給$30案件の裏話", query: "時給30ドルの仕事って何？" },
            { label: "Moftail詳細資料を開く", targetId: "dossier-moftail" }
          ]
        };
      }

      if (scene.includes("shopify") || scene === "dossier-shopify") {
        return {
          topic: "shopify-theme",
          text: `いま画面に出ているShopifyカスタムテーマ【Build My POD】についてかな？🛠️\n\n3Dモデル連動や超軽量化、バグ調査レポート提出から海外案件を受注した経緯など、何でも聞いてね！`,
          emotion: "small-attentive",
          quickLinks: [
            { label: "Shopifyテーマ詳細資料を開く", targetId: "dossier-shopify" },
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" }
          ]
        };
      }

      if (scene === "how-i-work") {
        return {
          topic: "how-i-work",
          text: `いま画面に出ている【HOW I WORK】の思考サイクルについてだね！💡\n\n『本当に必要なものを形にするために、技術を学ぶ』をどうやって実践しているか、5つのステップ（Problem → Idea → Build → Learn → Improve）について何でも聞いてね！`,
          emotion: "small-attentive",
          quickLinks: [
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" },
            { label: "Anchorの開発ストーリー", query: "Anchorについて教えて" }
          ]
        };
      }

      if (scene === "about") {
        return {
          topic: "about",
          text: `隆之介本人のストーリーについてだね！☁️\n\n情報工学と脳科学・認知心理学の横断や、相棒のぼくだけが知ってる普段の様子など、何でも聞いてね！`,
          emotion: "joyful-wide",
          quickLinks: [
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" },
            { label: "隆之介のウラ話・人物像", query: "隆之介って普段どんな人？裏話教えて！" }
          ]
        };
      }

      // Default Global Fallback
      return {
        topic: "general",
        text: `ご質問ありがとう！☁️\n\n中邨 隆之介は **「本当に必要なものを形にするために、技術を学ぶ」** を掲げ、誰かの課題を解決し、実際に役立つものを形にするために必要な技術をキャッチアップして形にするプロダクトビルダーだよ。\n\n**「Problem → Idea → Build → Learn → Improve」** のサイクルで日々ものづくりに向き合っています。\n\n気になることがあったら、下のボタンを押してみてね！`,
        emotion: "curious-left",
        quickLinks: [
          { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" },
          { label: "Anchor（iOS/AI）", query: "Anchorについて教えて" },
          { label: "Moftail（ニッチ検証）", query: "Moftailのストーリー" },
          { label: "ご連絡について", targetId: "contact" }
        ]
      };
    }
  }

  window.AISearchAgent = AISearchAgent;
})();
