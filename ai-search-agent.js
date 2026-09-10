/**
 * Portfolio Guide Bot & Search Agent for Ryunosuke Nakamura's Portfolio
 * Features:
 * - Portfolio Guide Bot Architecture (Formal, polite, disciplined business navigation bot)
 * - Structured Context Engine (Anchor, Moftail, Engineering Mindset, Tech Specs)
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
          text: "関心のあるキーワード（例：Anchor, Moftail, 強み, 哲学, 技術スタック, 連絡先）を入力してください。",
          quickLinks: []
        };
      }

      const scene = (context.scene || "hero").toLowerCase();
      const history = Array.isArray(context.history) ? context.history : [];
      const lastTurn = history.length > 0 ? history[history.length - 1] : null;
      const lastTopic = lastTurn ? lastTurn.topic : null;

      // Cognitive thinking delay for smooth UI feedback
      await new Promise((resolve) => setTimeout(resolve, 380));

      // 0. Follow-up & Anaphora Detection
      const isPureFollowUp =
        /^(なぜ|どうして|なんで|理由は|詳しく|もっと|それで|どうなった|技術的には|実装は|仕組みは|失敗は|他には|具体的には|結果は|どうやって|教え(て|てよ|てください))(\?|？|！|!)?$/i.test(q) ||
        (/^(なぜ|どうして|どうやって)/.test(q) && q.length <= 10);

      // 1. Bot & Personal Intents
      const isAboutCloudee = /cloudee|クローディー|くろーでぃー|お前誰|あなた誰|何者|自己紹介|君は誰|名前の由来|好きなもの|趣味|何歳|何で作られ/i.test(q);
      const isAboutRyunosukePersonal = /隆之介って.*人|りゅうのすけって|普段何して|普段どんな|裏話|秘密|弱点|短所|性格|休日|プライベート|観察|人物像/i.test(q);
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
      // Section A: Navigation Bot System Identity & Profile
      // =========================================================================

      // Cloudee System Identity
      if (isAboutCloudee) {
        return {
          topic: "cloudee",
          text: `当Bot（Cloudee）は、中邨 隆之介のポートフォリオにおける制作実績、技術選定、および設計思想をご案内するナビゲーションBotです。\n\n• **主な役割**: 画面右下に常駐し、各セクションの解説や詳細ドシエ（iPad資料）への誘導を行います。\n• **操作機能**: 画面内のドラッグによる位置変更に対応しています。中央のMacBook Air 3Dモデルも同様にドラッグで回転可能です。\n• **ご案内範囲**: 救命支援システム「Anchor」、米国向けブランド「Moftail」、開発哲学「HOW I WORK」、各種技術スタックについて回答いたします。\n\nご関心のある項目を下記のテンプレートまたは入力欄よりご指定ください。`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "中邨 隆之介の人物像・経歴", query: "中邨 隆之介の人物像や経歴について" },
            { label: "救命アプリ「Anchor」について", query: "Anchorについて教えて" }
          ]
        };
      }

      // Profile & Work Style of Ryunosuke
      if (isAboutRyunosukePersonal) {
        return {
          topic: "personal",
          text: `制作者である中邨 隆之介（大阪電気通信大学 情報工学科）についてご案内いたします。\n\n『本当に必要なものを形にするために、技術を学ぶ』を開発指針とし、課題解決を起点としたプロダクト開発に取り組んでいます。\n\n「誰かの困りごとを解決できる」という明確な課題を見出した際、未経験の言語やフレームワークであっても躊躇なく習得し、実装まで完結させるスタイルを特徴としています。\n\n情報工学の基礎に加え、脳科学や認知心理学の知見、定量的な市場データ分析を柔軟に組み合わせ、Problem → Idea → Build → Learn → Improve のサイクルを自律的に推進しています。`,
          emotion: "attentive-left",
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
          text: `ポートフォリオをご覧いただき誠にありがとうございます。長時間の画面閲覧の合間に、必要に応じて適宜ご休憩ください。\n\n各プロジェクトの技術資料や設計思想は、いつでもご都合のよいタイミングでご確認いただけます。`,
          emotion: "gentle-downward-gaze",
          quickLinks: [
            { label: "Moftailのストーリー", query: "Moftailのストーリー" },
            { label: "中邨 隆之介の人物像", query: "中邨 隆之介の人物像や経歴について" }
          ]
        };
      }

      // Praise & Compliment
      if (isPraise) {
        return {
          topic: "praise",
          text: `温かい評価をいただき、誠にありがとうございます。制作者の中邨にも共有させていただきます。\n\n引き続きご関心のある技術仕様や制作背景がございましたら、お気軽にお尋ねください。`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "Anchorの実績を見る", targetId: "dossier-anchor" },
            { label: "コンタクト先を確認する", targetId: "contact" }
          ]
        };
      }

      // Navigation Assistance
      if (isFunChat) {
        return {
          topic: "fun",
          text: `当ポートフォリオでは、以下のインタラクティブ操作をご利用いただけます：\n\n• **3Dモデルの操作**: 中央のM2 MacBook Airをドラッグすることで、360度任意の角度から閲覧可能です。\n• **Botの移動**: 当Bot（Cloudee）もドラッグ操作により、画面内の任意の位置へ移動していただけます。\n• **詳細ドシエの閲覧**: 各セクション右側のボタンより、iPad形式の詳細ドキュメントを開いて仕様やコードをご確認いただけます。`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "3Dモデルを操作する", targetId: "hero-stage" },
            { label: "Anchor詳細資料を開く", targetId: "dossier-anchor" }
          ]
        };
      }

      // =========================================================================
      // Section B: Deep-Dive Technical Answers
      // =========================================================================

      // 1. Why No Generative AI in Crisis
      if (isAnchorWhyNoAI) {
        return {
          topic: "anchor-why-no-ai",
          text: `【有事における生成AI不採用の設計判断】\n\nパニック発作のような極限の緊急状態において、有事の画面操作に生成AIを採用しない理由は主に以下の3点です：\n\n1. **ネットワーク遅延の排除（Zero Latency）**: 1〜3秒の待機時間やローディング表示は、発作下の当事者に強い不安を与えます。\n2. **非決定論性・ハルシネーションの排除**: 救命・支援要請の文脈において、不適切な回答や長文生成のリスクは許容できません。\n3. **通信途絶への耐性（Offline Determinism）**: 地下鉄やビル地下など電波の届かない閉鎖空間でも確実に作動する必要があります。\n\nこのためAnchorでは、「生成AIは平時の準備（One-Minute Anchor）でのみ活用し、有事は完全オフライン・決定論的（0ms）に実行する」という厳格なアーキテクチャを採用しています。`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "Anchor詳細資料（iPad）を開く", targetId: "dossier-anchor" },
            { label: "VoiceProxyの仕組み", query: "VoiceProxyって何？" }
          ]
        };
      }

      // 2. VoiceProxy Key Isolation
      if (isVoiceProxy) {
        return {
          topic: "anchor-voiceproxy",
          text: `【VoiceProxy（APIキー隔離プロキシ）のアーキテクチャ】\n\nAnchor-BuildWeek（OpenAI Build Week応募作）向けに構築されたNode.jsマイクロプロキシサーバーです。\n\n• **ゼロトラスト設計**: iOSアプリのバイナリや公開リポジトリにOpenAI APIキーを一切含めず、リバースエンジニアリングによる漏洩を防止します。\n• **通信フロー**: iOS端末からの平時リクエストを受け、サーバーサイドで安全にAPIキーを付与してOpenAI（gpt-4o-mini-tts）と通信します。\n• **品質保証**: コントラクトテスト（\`contract.mjs\`）を完備し、API仕様とレスポンスの整合性を厳密に検証しています。`,
          emotion: "attentive-left",
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
          text: `【ShieldVoiceLibraryとオフライン音声制御】\n\nSwift + CryptoKit + AVFoundationにより構築された低遅延・高堅牢な音声再生サブシステムです。\n\n1. **CryptoKitによるSHA256ハッシュキャッシュ**: 指示文テキストや音声パラメータからハッシュ値を計算し、端末内FileManagerに決定論的なキーでローカル保存します。\n2. **0ミリ秒の瞬時再生**: ローカルキャッシュが存在する場合、ネットワーク通信を一切介さず即座に高品質音声を再生します。\n3. **自動フォールバック機構**: キャッシュ未生成時や完全オフライン時でも、iOS標準の \`AVSpeechSynthesizer\`（オンデバイス音声合成）へ即座に切り替わり、音声が出力されないリスクを排除します。`,
          emotion: "attentive-left",
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
          text: `【Air-Gapped オフラインQRコード仕様】\n\n通信環境に依存しない支援情報伝達のための設計です。\n\n• **通常のURL埋め込みQRとの違い**: 一般的なQRコードはWebサイトのURLを保持するため、読み取り側の通信環境に依存します。\n• **直接エンコード方式**: Anchorでは、支援指示テキストや緊急連絡先・医療情報を生データのままQRコードに直接埋め込んでいます。\n• **完全オフライン対応**: 地下鉄や機内モード等の完全圏外環境でも、救護者のスマートフォンカメラで読み取るだけで指示が瞬時に表示されます。\n\nまた、iOSのBack Tap（背面タップ）やAction Buttonと連携し、ロック解除やアプリ探索の工数をゼロにする導線を確保しています。`,
          emotion: "attentive-left",
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
          text: `【Moftailにおけるゴールデンサークル（Why・How・What）の適用】\n\nサイモン・シネックのゴールデンサークル理論を実務に落とし込んだブランド戦略です。\n\n• **WHY（存在理由・信念）**:\n  “Birdwatching is secretly the funniest hobby on Earth, and nobody's said so out loud.”（野鳥観察は地球上で最も面白い趣味であるにもかかわらず、誰もそれを言語化してこなかった）という愛すべき偏愛と不条理の肯定。\n• **HOW（独自視点・表現手法）**:\n  当事者視点（双眼鏡の内側からの視点）に基づき、愛好家が共感するインサイダーユーモアと、19世紀オーデュボン風の精密な図鑑イラスト・古典タイポグラフィを対比させる設計。\n• **WHAT（提供プロダクト）**:\n  「Big Year, Small Budget」「I Brake for Little Brown Jobs」等の文脈を落とし込んだアパレルプロダクト。`,
          emotion: "attentive-left",
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
          text: `【VER_1から野鳥観察（Birding）へのピボット経緯】\n\n初期（VER_1_LEGACY）は「日本の自然美と今を生きる禅（Zen / Mindfulness）」を掲げたヨガ・リカバリー向けUSアパレルとして立ち上げました。\n\nしかし、市場テストの結果「デザインは整っているが、誰の課題・所属意識にも結びつかない」というコモディティ化の課題に直面しました。\n\n制作者の中邨は「思想には証明が必要である（Philosophy needs proof）」という認識に基づき、主観的な拘りを排して市場分析を再実施。熱狂的な当事者コミュニティが存在する野鳥観察（Birding）ニッチへと戦略転換を行いました。`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "Moftail詳細資料（iPad）を開く", targetId: "dossier-moftail" },
            { label: "ゴールデンサークルについて", query: "Moftailのゴールデンサークルについて教えて" }
          ]
        };
      }

      // 7. PDP Bug & $30/h Client Work
      if (isMoftailBugOrClientWork) {
        return {
          topic: "moftail-bug",
          text: `【Shopify PDPバグの解明と海外案件受注の経緯】\n\nMeta広告の実費テスト（$597.87）において、**80件のカート追加（Add to Cart）に対し購入が0件**という異常な乖離が発生しました。\n\nDOMおよびテーマスクリプトの徹底的な調査を実施した結果、商品詳細ページ（PDP）において「初期表示で特定サイズが視覚的に選択されているにもかかわらず、購入ボタンが無効化され『サイズを選択してください』と表示され続ける」というテーマ固有の重大な欠陥を特定しました。\n\n再現手順、影響範囲、原因分析、修正コードを英語の構造化レポートとしてテーマ開発元へ提出した結果、その技術的洞察力が高く評価され、**時給$30・計14タスクの海外有償開発案件（Paid Client Trial）を受注**するに至りました。`,
          emotion: "attentive-left",
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
          text: `【無在庫オンデマンド製造（POD）サプライチェーン】\n\n個人開発における固定費および在庫リスクを最小化するための自動化アーキテクチャです。\n\n• **API連携**: ShopifyストアとPrintify / Printfulの製造APIをダイレクトに統合。\n• **自動ルーティング**: 注文発生時、顧客の所在地（米国・欧州等）に応じて最寄りの提携印刷工場へAPI経由で即座に製造指示を発行。\n• **運用の効率化**: 印刷・検品・梱包・発送・追跡番号連携までを完全自動化し、在庫リスクゼロでグローバル展開を可能にしています。`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "Moftail詳細資料（iPad）を開く", targetId: "dossier-moftail" },
            { label: "Moftailの広告テストについて", query: "Moftailの広告テストについて教えて" }
          ]
        };
      }

      // =========================================================================
      // Section C: Portfolio Section Synthesizers (Scene-Aware)
      // =========================================================================

      // Anchor Synthesis
      if (isAnchor) {
        let hook = "パニック発作時の“沈黙”を打破する救命支援システム「Anchor」についてご案内いたします。";
        if (scene.includes("anchor") || scene === "dossier-anchor") {
          hook = "現在表示されている「Anchor」のセクションについてご案内いたします。";
        }

        let body = `${hook}\n\n`;
        body += `• **実績**: **Swift Student Challenge 2026**（Anchor.swiftpm）および **OpenAI Build Week**（Anchor-BuildWeek / Human Signal）応募作\n`;
        body += `• **技術スタック**: SwiftUI, iOS 17+, Observation (@Observable), CryptoKit (SHA256), AVFoundation, AVSpeechSynthesizer, Node.js (VoiceProxy), gpt-4o-mini-tts\n\n`;

        if (asksWhy) {
          body += `当事者ヒアリングを経て、「発作中に画面を注視・操作させること自体が認知的加害になる」という課題を特定。平時に未来の自分のために準備し、有事にはスマートフォンが代わりの声となる0ミリ秒シールドへと設計を削ぎ落としました。`;
        } else if (asksHow) {
          body += `「有事に生成AIを使わず、決定論的オフライン実行を行う」原則のもと、CryptoKitで端末内に音声を暗号化キャッシュ。未生成時やオフライン時はiOS標準のAVSpeechSynthesizerへ自動フォールバックする二重の安全機構を構築しています。`;
        } else {
          body += `完全Air-GappedなオフラインQRコードにより、地下鉄や機内モードなどの通信途絶環境でも救護者へ的確な支援指示を即座に提示できるゼロレイテンシ設計を採用しています。`;
        }

        return {
          topic: "anchor",
          text: body,
          emotion: "attentive-left",
          quickLinks: [
            { label: "Anchor詳細資料（iPad）を開く", targetId: "dossier-anchor" },
            { label: "なぜ有事にAIを使わないのか", query: "なぜ有事にAIを使わないの？" },
            { label: "VoiceProxyの仕組み", query: "VoiceProxyって何？" }
          ]
        };
      }

      // Moftail Synthesis
      if (isMoftail) {
        let hook = "米国向けD2Cブランド「Moftail」についてご案内いたします。";
        if (scene.includes("moftail") || scene === "dossier-moftail") {
          hook = "現在表示されている「Moftail」のセクションについてご案内いたします。";
        }

        let body = `${hook}\n\n`;
        body += `サイモン・シネックの**Golden Circle（Why → How → What）**を軸に展開する米国向けPODアパレルブランドです。\n\n`;
        body += `• **ピボット**: 抽象的な禅・自然美（VER_1）の課題を乗り越え、「野鳥観察は地球上で最も面白い趣味」という愛すべき不条理を肯定する**Birdingニッチ**へ昇華。\n`;
        body += `• **データ検証**: **$597.87のMeta広告実費テスト**で単一変数を検証し、Natural AshのWood素材が突出した**CTR 5.26%**を記録。\n`;
        body += `• **技術的成果**: 80件のカート追加と購入0のギャップからShopifyテーマのPDPバリアント選択バグを解明。英語の構造化レポート提出を契機に**時給$30・計14タスクの海外有償開発**を受注しました。`;

        return {
          topic: "moftail",
          text: body,
          emotion: "attentive-left",
          quickLinks: [
            { label: "Moftail詳細資料（iPad）を開く", targetId: "dossier-moftail" },
            { label: "時給$30案件の経緯", query: "時給30ドルの仕事って何？" },
            { label: "ゴールデンサークル詳細", query: "Moftailのゴールデンサークルについて教えて" }
          ]
        };
      }

      // Vision Internal Tool
      if (isVision) {
        return {
          topic: "vision",
          text: `【V.I.S.I.O.N】\n\n日々の作業や反復ワークフローを自動化・効率化するために中邨が構築した**社内・個人用業務効率化ツール**です。必要な機能を自ら素早く形にし、実用レベルで運用するビルダーとしての姿勢を反映しています。`,
          emotion: "attentive-left",
          quickLinks: [{ label: "Aboutステータス欄を見る", targetId: "about" }]
        };
      }

      // Mindset & Philosophy
      if (isMindset) {
        let hook = "制作者の中邨が重視している開発指針と技術哲学です。";
        if (scene === "how-i-work") {
          hook = "現在画面に表示されている【HOW I WORK】の根本哲学についてご案内いたします。";
        }

        return {
          topic: "mindset",
          text: `【大切にしている技術哲学とマインドセット】\n\n${hook}\n\n**本当に必要なものを形にするために、技術を学ぶ。**\n\n私は、プログラミング言語やフレームワークを習得すること自体をゴールにはしていません。\n\n私が重視しているのは、誰かの課題を解決したり、実際に役立つものを形にすることです。\n\n作りたいプロダクトを先に考え、その実現に必要な技術を調べ、学び、使う。\n\nそのため、私の技術学習は「すべてを学んでから作る」のではなく、**「作るために必要なことを学ぶ」**という順番です。\n\n**Problem → Idea → Build → Learn → Improve**\n\nAnchor、Moftail、そしてこれまでのプロダクトも、現在持っている技術だけで作れるものを考えたのではありません。\n\n実現したい体験や解決したい問題を先に置き、それを形にするために必要な技術を、その都度キャッチアップしてきました。\n\n私はまだ技術者として成長途中です。\n\nしかし、技術そのものを目的にするのではなく、**技術を使って価値を生み出せる人でありたい**と考えています。`,
          emotion: "attentive-left",
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
          text: `【強みおよび人物像について】\n\n中邨 隆之介（大阪電気通信大学 情報工学科）の主要な強みは以下の通りです：\n\n**「誰かの課題を解決するために必要な技術を迅速に学び、実際に動くプロダクトとして具現化できる実行力」**\n\n「本当に必要なものを形にするために、技術を学ぶ」という指針に基づき、情報工学の基礎に加え、脳科学や認知心理学、市場のデータ分析を柔軟に統合。**Problem → Idea → Build → Learn → Improve** のサイクルを自律的かつ迅速に推進できる点を特徴としています。`,
          emotion: "attentive-left",
          quickLinks: [{ label: "Aboutセクションを見る", targetId: "about" }]
        };
      }

      // Technology Stack (Fully Context-Aware!)
      if (isTech) {
        if (scene.includes("anchor") || scene === "dossier-anchor") {
          return {
            topic: "tech-anchor",
            text: `現在表示されている【Anchor】の技術選定についてご案内いたします。\nパニック発作時の沈黙を打破するため、完全な低遅延性とオフライン信頼性を最重要要件として選定されています。\n\n• **SwiftUI & Observation**: iOS 17+の \`@Observable\` により不要な再描画とCPU負荷を極小化\n• **CryptoKit**: 指示文ハッシュからローカル音声キャッシュを暗号化生成し、0ミリ秒再生を実現\n• **AVSpeechSynthesizer**: キャッシュ不在時やオフライン時のオンデバイス自動フォールバック\n• **Node.js (VoiceProxy)**: OpenAI APIキーをiOSバイナリに一切含めない完全隔離マイクロプロキシ\n\n有事における決定論的救命に必要な技術スタックを厳格に統合しています。`,
            emotion: "attentive-left",
            quickLinks: [
              { label: "Anchor技術詳細（iPad）を開く", targetId: "dossier-anchor" },
              { label: "有事にAIを使わない理由", query: "なぜ有事にAIを使わないの？" }
            ]
          };
        }

        if (scene.includes("moftail") || scene === "dossier-moftail") {
          return {
            topic: "tech-moftail",
            text: `現在表示されている【Moftail】の技術スタックおよび運用基盤です。\n個人開発においてグローバル展開を可能にする完全自動化オペレーションを構築しています。\n\n• **Shopify & Liquid / JS**: カスタムテーマ設計、PDPバグ修正パッチ\n• **Meta Graph API**: $597.87の広告実費検証、単一変数A/Bテスト（Wood CTR 5.26%特定）\n• **Print on Demand API**: Printify / PrintfulとShopifyを直結し、無在庫・自動ルーティング製造\n\n直感に頼らず、コードとデータで事業課題を解決するアプローチを貫いています。`,
            emotion: "attentive-left",
            quickLinks: [
              { label: "Moftail戦略資料（iPad）を開く", targetId: "dossier-moftail" },
              { label: "時給$30案件の経緯", query: "時給30ドルの仕事って何？" }
            ]
          };
        }

        if (scene.includes("shopify") || scene === "dossier-shopify") {
          return {
            topic: "tech-shopify",
            text: `Shopifyカスタムテーマ【Build My POD】の技術仕様です。\n\n• **Liquid & Tailwind**: 読み込み速度を極限まで高めた超軽量コードベース\n• **3Dモデルビューア**: 商品を立体的にプレビューするインタラクティブ実装\n• **DOM解析 & バグ特定**: テーマの価格・サイズ不整合を突き止め、修正案を提出して時給$30案件を受注\n\n技術を自らの用途に留めず、事業者の課題解決へ還元したプロジェクトです。`,
            emotion: "attentive-left",
            quickLinks: [
              { label: "Shopifyテーマ詳細資料を開く", targetId: "dossier-shopify" }
            ]
          };
        }

        if (scene === "hero") {
          return {
            topic: "tech-portfolio",
            text: `当ポートフォリオにおける3D演出およびフロントエンド実装についてご案内いたします。\n\n• **Three.js & WebGL**: M2 MacBook Airのミッドナイトブルー質感、ヒンジ開閉、デスク着地演出の制御\n• **GSAP & ScrollTrigger**: スクロール進行度と3Dカメラ・モデル姿勢・ライティングの連動\n• **CSS Backdrop-Filter**: AppleライクなフロストガラスUIと流麗なタイポグラフィ\n\n中央のMacBook Airはドラッグして回転させることが可能です。`,
            emotion: "attentive-left",
            quickLinks: [
              { label: "3Dモデルを操作する", targetId: "hero-stage" },
              { label: "Anchorの技術スタックを見る", targetId: "dossier-anchor" }
            ]
          };
        }

        // Global Tech Stacks
        return {
          topic: "tech-global",
          text: `【技術スタックおよび技術習得の指針】\n\n中邨の根本的な指針は以下の通りです：\n**「本当に必要なものを形にするために、技術を学ぶ」**\n言語やツールの習得自体を目的にせず、**「誰かの課題を解決するプロダクトを作る」**ために必要な技術を学んで形にするスタイルを貫いています。\n\n• **iOS / Calm Tech（Anchor）**:\n  パニック発作時の沈黙を打破するため、SwiftUI、iOS 17+ Observation、CryptoKit（暗号化オフライン音声キャッシュ）、AVSpeechSynthesizer、Node.js（APIキー隔離VoiceProxy）を習得・実装。\n• **Commerce & Full-Stack（Moftail）**:\n  ニッチコミュニティの検証と完全自動化のため、Shopify、Liquid、Meta広告Graph API、Print on Demand APIを連携。\n• **Frontend & Creative Tech（Portfolio）**:\n  プロダクトの世界観を的確に伝えるため、Three.js、WebGL、GSAPによる3D演出・グラスモーフィズムUIを構築。\n\n**「Problem → Idea → Build → Learn → Improve」** のプロセスに沿って、価値の具現化に取り組んでいます。`,
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
          text: `【ご連絡および今後の挑戦について】\n\n**「NEXT CHALLENGE. ぜひ一度お話しさせてください。」**\n\n新卒採用、インターンシップ、共同開発等のご相談を歓迎しております。当ポートフォリオ最下部のContactフォーム、またはGitHub等よりご連絡いただけます。`,
          emotion: "attentive-left",
          quickLinks: [{ label: "Contactフォームへ移動", targetId: "contact" }]
        };
      }

      // Greeting (Scene-Aware!)
      if (isGreeting) {
        let sceneHint = "開発したプロダクト（Anchor, Moftail, V.I.S.I.O.N）や、大切にしている技術哲学、各プロジェクトの技術仕様など、関心のある項目をご指定ください。";
        if (scene.includes("anchor") || scene === "dossier-anchor") {
          sceneHint = "救命支援アプリ「Anchor」の有事救命の設計思想や、なぜAIを使わないのかといった技術仕様をご案内可能です。";
        } else if (scene.includes("moftail") || scene === "dossier-moftail") {
          sceneHint = "「Moftail」の野鳥観察ニッチへのピボット経緯や広告テストの検証データ、海外案件受注の経緯をご案内可能です。";
        } else if (scene === "how-i-work") {
          sceneHint = "「HOW I WORK」セクションに記載の開発プロセス（Problem → Idea → Build → Learn → Improve）についてご案内可能です。";
        }

        return {
          topic: "greeting",
          text: `中邨 隆之介のポートフォリオへようこそ。\n当ポートフォリオの制作実績や技術仕様をご案内するナビゲーションBotの Cloudee です。\n\n${sceneHint}`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" },
            { label: "救命アプリ「Anchor」について", query: "Anchorについて教えて" },
            { label: "中邨 隆之介の人物像・経歴", query: "中邨 隆之介の人物像や経歴について" }
          ]
        };
      }

      // =========================================================================
      // Default Contextual Guidance (Scene-Aware Fallback)
      // =========================================================================

      if (scene.includes("anchor") || scene === "dossier-anchor") {
        return {
          topic: "anchor",
          text: `救命支援システム「Anchor」のセクションをご案内いたします。\n\nパニック発作時の沈黙を打破する認知アクセシビリティアプリであり、平時準備と0ミリ秒オフライン実行を最大の特徴としています。\n\n有事における生成AI不採用の理由、VoiceProxyの設計、オフラインQRコードの仕様など、関心のある項目をお尋ねください。`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "なぜ有事にAIを使わないのか", query: "なぜ有事にAIを使わないの？" },
            { label: "Anchor詳細資料を開く", targetId: "dossier-anchor" },
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" }
          ]
        };
      }

      if (scene.includes("moftail") || scene === "dossier-moftail") {
        return {
          topic: "moftail",
          text: `米国向けD2Cブランド「Moftail」のセクションをご案内いたします。\n\n野鳥観察（Birding）ニッチへのピボット経緯、$597.87のMeta広告実費検証、テーマバグ解明から時給$30案件を受注した経緯などをご案内可能です。\n\n下記のテンプレート項目をご利用いただくか、直接ご入力ください。`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "野鳥観察へのピボット理由", query: "Moftailのピボット理由を教えて" },
            { label: "時給$30案件の経緯", query: "時給30ドルの仕事って何？" },
            { label: "Moftail詳細資料を開く", targetId: "dossier-moftail" }
          ]
        };
      }

      if (scene.includes("shopify") || scene === "dossier-shopify") {
        return {
          topic: "shopify-theme",
          text: `Shopifyカスタムテーマ【Build My POD】のセクションをご案内いたします。\n\n3Dモデル連動や超軽量化の取り組み、バグ調査レポートの提出から海外案件を受注した経緯などについてお尋ねください。`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "Shopifyテーマ詳細資料を開く", targetId: "dossier-shopify" },
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" }
          ]
        };
      }

      if (scene === "how-i-work") {
        return {
          topic: "how-i-work",
          text: `【HOW I WORK】セクションをご案内いたします。\n\n「本当に必要なものを形にするために、技術を学ぶ」という方針のもと、5つのプロセス（Problem → Idea → Build → Learn → Improve）について解説いたします。`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" },
            { label: "Anchorの開発ストーリー", query: "Anchorについて教えて" }
          ]
        };
      }

      if (scene === "about") {
        return {
          topic: "about",
          text: `制作者（中邨 隆之介）のプロフィールセクションをご案内いたします。\n\n情報工学と脳科学・認知心理学の横断的なアプローチや、これまでの活動背景についてご案内いたします。`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" },
            { label: "人物像・経歴について", query: "中邨 隆之介の人物像や経歴について" }
          ]
        };
      }

      // Default Global Fallback
      return {
        topic: "general",
        text: `中邨 隆之介のポートフォリオへようこそ。\n\n制作者の中邨は「本当に必要なものを形にするために、技術を学ぶ」を指針とし、誰かの課題を解決するプロダクトを作るために必要な技術を学んで形にするプロダクトビルダーです。\n\n**「Problem → Idea → Build → Learn → Improve」** のプロセスに沿って、日々ものづくりに取り組んでいます。\n\n各プロジェクトの技術仕様や開発背景について、下記の項目または入力欄よりお尋ねください。`,
        emotion: "attentive-left",
        quickLinks: [
          { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" },
          { label: "救命アプリ「Anchor」", query: "Anchorについて教えて" },
          { label: "Moftail（市場検証）", query: "Moftailのストーリー" },
          { label: "ご連絡について", targetId: "contact" }
        ]
      };
    }
  }

  window.AISearchAgent = AISearchAgent;
})();
