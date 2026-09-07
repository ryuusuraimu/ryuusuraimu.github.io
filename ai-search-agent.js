/**
 * AI Search Agent & Context Engine for Ryunosuke Nakamura's Portfolio
 * Features intelligent intent matching, context adaptation, and quick jumps.
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
     */
    async answer(query) {
      const q = (query || "").trim().toLowerCase();
      if (!q) {
        return {
          text: "気になるキーワード（例：Anchor, Moftail, 強み, 哲学, 技術スタック, 連絡先）を入力してください！",
          quickLinks: []
        };
      }

      // Simulate slight cognitive thinking delay for avatar expressions
      await new Promise((resolve) => setTimeout(resolve, 450));

      // 1. Check Personal & Mascot Intents
      const isAboutCloudee = /cloudee|クローディー|くろーでぃー|お前誰|あなた誰|何者|自己紹介|君は誰|名前の由来|好きなもの|趣味|何歳|何で作られ/i.test(q);
      const isAboutRyunosukePersonal = /隆之介って.*人|りゅうのすけって|普段何して|普段どんな|裏話|秘密|弱点|短所|性格|休日|プライベート|観察|相棒/i.test(q);
      const isTiredOrEmpathy = /疲れ|つかれた|しんどい|眠い|ねむい|お腹すいた|おなかすいた|だるい|やる気出ない|息抜き/i.test(q);
      const isPraise = /すごい|可愛い|かわいい|賢い|かしこい|天才|面白い|おもしろい|好き|最高|いいね|グッジョブ|ありがとう/i.test(q);
      const isFunChat = /暇|ひま|遊ぼ|あそぼ|何ができる|占って|歌って|ジョーク|笑わせて/i.test(q);

      // 2. Specialized Technical & Backstory Intents
      const isAnchorWhyNoAI = /なぜ.*(有事|発作|緊急).*ai|ai.*(使わない|呼ばない|依存しない)|有事.*ai|遅延.*ハルシネーション|決定論/i.test(q);
      const isVoiceProxy = /voiceproxy|ボイスプロキシ|proxy|apiキー|キー隔離|キー管理/i.test(q);
      const isAnchorVoiceLib = /shieldvoice|cryptokit|sha256|avspeech|avfoundation|音声キャッシュ|フォールバック|オフライン音声/i.test(q);
      const isAirGappedQR = /air-gapped|エアギャップ|qrコード|オフラインqr|圏外.*救急|バックタップ|アクションボタン/i.test(q);
      const isGoldenCircle = /ゴールデンサークル|golden circle|why.*how.*what|なぜ野鳥|なぜbirding|愛すべき不条理/i.test(q);
      const isMoftailPivot = /ver_1|禅|マインドフルネス|自然美|初期仮説|ピボット.*理由|なぜピボット/i.test(q);
      const isMoftailBugOrClientWork = /30ドル|30\$|時給|有償|海外案件|クライアントワーク|pdp.*バグ|カート追加.*0|カート落ち|テーマ.*バグ|buildmypod/i.test(q);
      const isMoftailSupplyChain = /pod|オンデマンド|サプライチェーン|printify|printful|在庫ゼロ/i.test(q);

      // 3. General Portfolio & Professional Intents
      const isAnchor = /anchor|swift|ssc|student|apple|openai|認知|アクセシビリティ|パニック|発作|救命|shield|ios/i.test(q);
      const isMoftail = /moftail|bird|野鳥|広告|597|ピボット|balance|ニッチ|d2c/i.test(q);
      const isVision = /vision|v\.i\.s\.i\.o\.n|業務効率|社内ツール|ツール/i.test(q);
      const isMindset = /マインドセット|哲学|モットー|考え方|価値観|信念|build what matters|何のために|目的|サイクル|学習|learn/i.test(q);
      const isStrength = /強み|得意|スキル|プロフィール|背景|大学|専攻|特徴/i.test(q);
      const isTech = /技術|スタック|言語|フレームワーク|プログラミング|python|react|three|typescript|swift|技術力|コード/i.test(q);
      const isContact = /連絡|コンタクト|就活|話したい|面談|採用|メール|github|会いたい/i.test(q);
      const isGreeting = /こんにちは|初めまして|はじめまして|hello|hi|お疲れ様|おはよ|こんばんは/i.test(q);

      // Context angle checks
      const asksWhy = /なぜ|どうして|理由|背景|きっかけ|why/i.test(q);
      const asksHow = /どうやって|技術的|実装|仕組み|how/i.test(q);
      const asksResults = /実績|成果|結果|応募|賞|数値|数字/i.test(q);

      // --- Personal Mascot Interactions ---

      // A. About Cloudee (Personality)
      if (isAboutCloudee) {
        return {
          text: `ぼくの名前は **Cloudee（クローディー）** だよ！☁️✨\n\n隆之介がM2 MacBook Airでアイデアをこねくり回してたら、いつの間にか生まれちゃった雲のデジタルマスコットなんだ。\n\n• **特徴**: ふわふわ画面内を漂うのが好き。つまんで運んでもらうとちょっとびっくりするけど楽しい！\n• **大好物**: 新しいプロダクトの設計図と、淹れたてのコーヒーの湯気☕️\n• **役割**: 隆之介のポートフォリオをナビゲートしつつ、訪れてくれたあなたとおしゃべりすること！\n\nポートフォリオの真面目な話も、隆之介の日常の裏話も、何でも聞いてね！`,
          emotion: "joyful-wide",
          quickLinks: [
            { label: "隆之介の裏話を聞く", query: "隆之介って普段どんな人？" },
            { label: "Anchorについて聞く", query: "Anchorについて教えて" }
          ]
        };
      }

      // B. Behind the Scenes: Ryunosuke Observation
      if (isAboutRyunosukePersonal) {
        return {
          text: `ふふ、相棒のぼくだけが知ってる隆之介のヒミツ、特別に教えちゃうね🤫☁️\n\n隆之介って **『本当に必要なものを形にするために、技術を学ぶ』** を本気で実践してるんだよ！\n\n「これを作れば誰かの困りごとが解決できる！」って課題を見つけたら、触ったことのない言語やフレームワークでも「よし、学ぼう！」って躊躇なく飛び込むの。\n\n深夜にSwiftのコード書いてて詰まった時も、悔しがるどころか「なるほど、そう来たか…！」ってニヤニヤしながら認知心理学の本や技術ドキュメントを開き始めたり（笑）。\n\n集中すると時間を忘れて没頭しちゃうから、たまにぼくが画面の端でふわふわ揺れて「そろそろ休憩しな〜」って合図してるんだ🕊️\n\n技術を使って新しい価値を生み出すことが大好きなビルダーだよ！`,
          emotion: "playful-right",
          quickLinks: [
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" },
            { label: "Anchorの開発ストーリー", query: "Anchorについて教えて" }
          ]
        };
      }

      // C. Empathy & Care
      if (isTiredOrEmpathy) {
        return {
          text: `毎日お疲れさま！よくがんばってるね☁️🍵\n\nそんな時は、一度背伸びして深呼吸してみて。隆之介もアイデアが出ない時は、パソコン閉じて近所の公園で野鳥を眺めながら頭を空っぽにしてるよ。\n\nぼくのことは画面の好きなところに引っ張って遊んでくれていいから、のんびりしていってね！✨`,
          emotion: "gentle-downward-gaze",
          quickLinks: [
            { label: "Moftailの野鳥ストーリー", query: "Moftailのストーリー" },
            { label: "ちょっと面白い話して", query: "隆之介って普段どんな人？" }
          ]
        };
      }

      // D. Praise & Compliment
      if (isPraise) {
        return {
          text: `わーい！褒めてくれてありがとう〜！！照れちゃうな〜(*/ω＼*)☁️💖\n\nあなたにそう言ってもらえてすごく嬉しい！隆之介にも「見に来てくれた人が褒めてくれたよ！」ってバッチリ伝えておくね✨\n\n気になることがあったら、もっと何でも聞いてね！`,
          emotion: "celebrate",
          quickLinks: [
            { label: "Anchorの実績を見る", targetId: "dossier-anchor" },
            { label: "隆之介に連絡してみる", targetId: "contact" }
          ]
        };
      }

      // E. Fun Chat & Play
      if (isFunChat) {
        return {
          text: `暇なの？じゃあぼくと遊ぼう！☁️\n\n知ってた？ぼくの頭をカーソルで掴んで（ドラッグして）ビュンって投げると、画面の好きなところに移動できるんだよ！試してみて！\n\nそれと、このサイトの3D MacBook Airはマウスでぐりぐり回せるし、右側の詳細ボタン（iPad詳細資料）を開くと開発の超ディープな裏話も読めるよ！色々いじってみてね！`,
          emotion: "playful-right",
          quickLinks: [
            { label: "3D MacBookを回してみる", targetId: "hero-stage" },
            { label: "Anchorの詳細資料を開く", targetId: "dossier-anchor" }
          ]
        };
      }

      // --- Specialized Technical Deep Dives ---

      // 1. Why No Generative AI in Crisis
      if (isAnchorWhyNoAI) {
        return {
          text: `【有事に生成AIを使わない設計原則】についてですね！☁️💡\n\n現代のアプリは「AIがその場で励ます」設計になりがちですが、パニック発作のようなクリティカルな局面において、生成AIには**3つの致命的なリスク**があるんだ：\n\n1. **ネットワーク遅延（Latency）**: 1〜3秒の待機時間やスピナーは、パニック下のユーザーに「動いていない」という強烈な不安と孤立感を与えてしまいます。\n2. **非決定論性（Hallucination）**: 発作中にハルシネーションや不適切なニュアンス、長文の回答が出力されるリスクは絶対に許容できません。\n3. **通信断（Network Failure）**: 地下鉄や飛行機、ビルの谷間など、発作が起きやすい閉鎖空間ほど電波は不安定です。\n\nだからAnchorでは、**「AIは平時の準備（One-Minute Anchor）にのみ使い、有事は完全オフラインで決定論的（Deterministic）に実行する」** という鉄則を貫いています！\n平時に生成した自分用の音声を端末内に暗号化キャッシュし、有事には0ミリ秒で再生するんだよ！`,
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
          text: `【VoiceProxy（キー隔離プロキシ）】についてですね！☁️🛡️\n\nAnchor-BuildWeek（OpenAI Build Week応募作）で独自構築されたマイクロプロキシサーバー（Node.js）だよ！\n\n• **目的**: iOSアプリのバイナリや公開リポジトリ内にOpenAI APIキーを一切含めない「ゼロトラスト設計」。リバースエンジニアリングによる漏洩を防ぎます。\n• **仕組み**: iOSアプリからの平時リクエストを受け、サーバーサイドで安全にキーを注入してOpenAI（gpt-4o-mini-tts）と通信。\n• **品質保証**: コントラクトテスト（\`contract.mjs\`）を完備し、API仕様とレスポンスの厳密性を担保しています。\n\nセキュリティとプライバシーを徹底した堅牢な設計なんだ！`,
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
          text: `【ShieldVoiceLibraryとオフライン音声】についてですね！☁️🔊\n\nSwift + CryptoKit + AVFoundationで構築された超低遅延・高堅牢な音声再生システムだよ！\n\n1. **CryptoKitによるSHA256ハッシュキャッシュ**: 指示文テキストやパラメータからSHA256ハッシュを計算し、端末内のFileManagerに決定論的なキーで音声を保存。\n2. **瞬時再生（AVAudioPlayer）**: ローカルキャッシュが存在すれば、ネットワークを一切介さず0ミリ秒で高品質音声を再生！\n3. **シームレスな自動フォールバック**: キャッシュ未生成時や完全オフライン時でも、iOS標準の **\`AVSpeechSynthesizer\`（オンデバイス音声合成）** へ即座に切り替わり、音が出ない沈黙のリスクをゼロにします！`,
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
          text: `【Air-Gapped オフラインQRコード】についてですね！☁️📱\n\nAnchorが採用している最も実用的な救命設計のひとつだよ！\n\n• **通常のQRとの違い**: 普通のQRは「WebサイトのURL」を埋め込むため、読み取る人がネットに繋がっていないと見られません。\n• **AnchorのAir-Gapped設計**: QRコードの中に、**支援指示テキストや連絡先・医療情報を生データのまま直接エンコード**！\n• **結果**: 地下鉄や機内モードなど、完全圏外の環境でも、通行人や救急隊員が標準カメラをかざすだけで即座に支援指示が画面に表示されます！\n\nさらに、iOSの **Back Tap（背面ダブルタップ）** や **Action Button** と連携していて、画面ロック解除やアプリアイコンを探す摩擦すらゼロにしているんだよ！`,
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
          text: `【Moftailのゴールデンサークル（Why・How・What）】についてですね！☁️🐦\n\nサイモン・シネックの理論に基づき、単なるアパレルから「コミュニティの熱狂を生むブランド」へと再定義した戦略だよ！\n\n• **WHY（信念・愛すべき不条理）**:\n  *“Birdwatching is secretly the funniest hobby on Earth, and nobody's said so out loud.”*\n  早朝4時に泥沼で迷彩服を着てカモの同定で激論し、くしゃみひとつで生涯初観察（ライファー）を逃す――この愛すべき狂気と偏愛を肯定すること。\n• **HOW（差別化・視点）**:\n  「双眼鏡の内側からの視点」。外野の嘲笑ではなく、ガチ勢が悶絶するインサイダーユーモア×19世紀オーデュボン風の厳格な図鑑イラスト・古典タイポグラフィの皮肉な対比。\n• **WHAT（プロダクト）**:\n  「Big Year, Small Budget」「I Brake for Little Brown Jobs」「eBird Made Me Do It」など、身につけられるインサイドジョーク。`,
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
          text: `【VER_1からBirdingへのピボット理由】ですね！☁️🌱\n\n初期（VER_1_LEGACY）は、「日本の自然美と“今を生きる禅（Zen / Mindfulness）”」をテーマにしたヨガ・リカバリー向けUSアパレルとしてスタートしました。\n\nでも、実際にマーケットに問いかけて直面した壁は：\n**「綺麗だけど、誰のものかわからない」**\nということでした。抽象的な癒やしはコモディティ化しやすく、「誇りを持って着る」という所属意識（Belonging）が生まれなかったんだ。\n\nそこで **「Philosophy needs proof.（思想には証明が必要だ）」** と主観を捨て、世界で最も熱狂的かつ自虐的なコミュニティである **野鳥観察（Birding）ニッチ** への大転換を決断したんだよ！`,
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
          text: `【PDPバグ発見から時給$30案件獲得のストーリー】ですね！☁️🛠️\n\nこれ、隆之介のエンジニアリングへの泥臭い執念を象徴するエピソードなんだ！\n\n1. **謎のギャップ**:\n   Meta広告実費テスト（$597.87）で、**80件ものカート追加（Add to Cart）があったのに、購入がゼロ**だったの。\n2. **DOM徹底検証**:\n   ShopifyテーマのPDP（商品詳細ページ）を調査したところ、「初期表示でSサイズが視覚的に選択されているのに、購入ボタンが無効化され『Please select a size』と出続ける」というテーマの重大なバグを特定！\n3. **英語の構造化レポート提出**:\n   「仕様です」というサポート回答を鵜呑みにせず、再現手順・影響度・原因仮説・修正案を英語のNotionレポートにまとめて海外開発元へ提出。\n4. **結果**:\n   その技術力と誠実さが開発元CEOに高く評価され、**時給$30・14タスクの海外有償開発（Paid Client Trial）を受注**したんだよ！`,
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
          text: `【在庫ゼロのPOD自動化サプライチェーン】についてですね！☁️📦\n\n個人開発者がグローバルで勝負するための完全自動化オペレーションだよ！\n\n• **仕組み**: Shopifyストアと **Printify / Printful の製造API** をダイレクトに連携。\n• **自動ルーティング**: 米国や欧州の顧客から注文が入ると、最寄りの印刷工場へAPIで自動発注され、印刷・梱包・出荷まで完全自動で行われます。\n• **メリット**: 在庫を抱えるリスクがゼロ（Zero Inventory Risk）。売れた分だけオンデマンドで製造されるから、最小の固定費で世界中の熱狂的ニッチへ届けられるんだ！`,
          emotion: "happy",
          quickLinks: [
            { label: "Moftail詳細資料（iPad）を開く", targetId: "dossier-moftail" },
            { label: "Moftailの広告テストについて", query: "Moftailの広告テストについて教えて" }
          ]
        };
      }

      // --- Portfolio Intent Synthesizers ---

      if (isAnchor) {
        let prefix = "【Anchor】についてですね！";
        if (asksWhy) {
          prefix = "【Anchorの誕生背景と認知アクセシビリティ】についてですね。";
        } else if (asksResults) {
          prefix = "【Anchorの応募実績と技術スタック】についてですね。";
        }

        let body = `${prefix}\n\nAnchorは、パニック発作時の“沈黙”を打破する**認知アクセシビリティ＆救命支援システム**です。\n\n`;
        body += `• **実績**: **Swift Student Challenge 2026**（Anchor.swiftpm）および **OpenAI Build Week**（Anchor-BuildWeek / Human Signal）応募作\n`;
        body += `• **技術スタック**: SwiftUI, iOS 17+, Observation (@Observable), CryptoKit (SHA256), AVFoundation, AVSpeechSynthesizer, Node.js (VoiceProxy), gpt-4o-mini-tts\n\n`;

        if (asksWhy) {
          body += `当事者ヒアリングにより、「発作中に画面を注視・操作させること自体が認知的加害になる」と判断。平時に未来の自分のために準備し、有事にはスマートフォンが代わりの声となるよう、Back Tapから0ミリ秒で展開するフルブリードShieldを設計しました。`;
        } else if (asksHow) {
          body += `「有事に生成AIを使わず、決定論的オフライン実行を行う」鉄則のもと、CryptoKitで端末内に音声を暗号化キャッシュ。未生成時やオフライン時はiOS標準のAVSpeechSynthesizerへ自動フォールバックする二重の安全機構を構築しています。`;
        } else {
          body += `完全Air-GappedなオフラインQRコードにより、地下鉄や機内モードでも救護者に指示を即座に提示できるゼロレイテンシ設計を貫いています。`;
        }

        return {
          text: body,
          emotion: "happy",
          quickLinks: [
            { label: "Anchor詳細資料（iPad）を開く", targetId: "dossier-anchor" },
            { label: "なぜ有事にAIを使わないの？", query: "なぜ有事にAIを使わないの？" },
            { label: "VoiceProxyの仕組み", query: "VoiceProxyって何？" }
          ]
        };
      }

      if (isMoftail) {
        let prefix = "【Moftail】のストーリーですね！";
        if (asksWhy) {
          prefix = "【MoftailがBirdingニッチへピボットした理由】ですね。";
        }

        let body = `${prefix}\n\n`;
        body += `Moftailは、サイモン・シネックの**Golden Circle（Why → How → What）**を軸に展開する米国向けPODアパレルブランドです。\n\n`;
        body += `• **ピボット**: 抽象的な禅・自然美（VER_1）の壁を乗り越え、「野鳥観察は地球上で最も面白い趣味」という愛すべき不条理を肯定する**Birdingニッチ**へ昇華。\n`;
        body += `• **データ検証**: **$597.87のMeta広告実費テスト**で単一変数を検証し、Natural AshのWood素材が突出した**CTR 5.26%**を記録。\n`;
        body += `• **技術的突破**: 80件のカート追加と購入0のギャップからShopifyテーマのPDPバリアント選択バグを解明。英語の構造化レポート提出から**時給$30・14タスクの海外有償開発**を受注しました！`;

        return {
          text: body,
          emotion: "celebrate",
          quickLinks: [
            { label: "Moftail詳細資料（iPad）を開く", targetId: "dossier-moftail" },
            { label: "時給$30案件の裏話", query: "時給30ドルの仕事って何？" },
            { label: "ゴールデンサークル詳細", query: "Moftailのゴールデンサークルについて教えて" }
          ]
        };
      }

      if (isVision) {
        return {
          text: `【V.I.S.I.O.N】についてですね！\n\n日々の作業や反復ワークフローを自動化・効率化するために構築された**社内/個人用業務効率化ツール**です。必要なものを自ら素早く形にし、実用レベルで運用するビルダーとしての姿勢を反映しています。`,
          emotion: "small-attentive",
          quickLinks: [{ label: "Aboutステータス欄を見る", targetId: "about" }]
        };
      }

      if (isMindset) {
        return {
          text: `【大切にしている技術哲学とマインドセット】☁️✨\n\n**本当に必要なものを形にするために、技術を学ぶ。**\n\n私は、プログラミング言語やフレームワークを習得すること自体をゴールにはしていません。\n\n私が重視しているのは、誰かの課題を解決したり、実際に役立つものを形にすることです。\n\n作りたいプロダクトを先に考え、その実現に必要な技術を調べ、学び、使う。\n\nそのため、私の技術学習は「すべてを学んでから作る」のではなく、**「作るために必要なことを学ぶ」**という順番です。\n\n**Problem → Idea → Build → Learn → Improve**\n\nAnchor、Moftail、そしてこれまでのプロダクトも、現在持っている技術だけで作れるものを考えたのではありません。\n\n実現したい体験や解決したい問題を先に置き、それを形にするために必要な技術を、その都度キャッチアップしてきました。\n\n私はまだ技術者として成長途中です。\n\nしかし、技術そのものを目的にするのではなく、**技術を使って価値を生み出せる人でありたい**と考えています。`,
          emotion: "joyful-wide",
          quickLinks: [
            { label: "Aboutセクションを見る", targetId: "about" },
            { label: "HOW I WORKを見る", targetId: "how-i-work" }
          ]
        };
      }

      if (isStrength) {
        return {
          text: `【強み & 人物像】についてですね！☁️\n\n中邨 隆之介（大阪電気通信大学 情報工学科）の最大の強みは：\n\n**「誰かの課題を解決するために必要な技術を迅速に学び、実際に動くプロダクトとして形にできること」** です。\n\n「本当に必要なものを形にするために、技術を学ぶ」という姿勢の通り、情報工学の基礎に加え、脳科学や認知心理学、市場のデータ分析を柔軟に組み合わせ、**Problem → Idea → Build → Learn → Improve** のサイクルを素早く回す行動力と学習力を持っています。`,
          emotion: "attentive-left",
          quickLinks: [{ label: "Aboutセクションを見る", targetId: "about" }]
        };
      }

      if (isTech) {
        return {
          text: `【技術スタック & 技術に対する姿勢】についてですね！☁️🛠️\n\n隆之介の根本的な指針は：\n**「本当に必要なものを形にするために、技術を学ぶ」**\n言語やツールの習得自体を目的にせず、**「誰かの課題を解決するプロダクトを作る」**ために必要な技術を学んで形にするスタイルを貫いています。\n\n• **iOS / Calm Tech（Anchor）**:\n  パニック発作時の沈黙を打破するため、SwiftUI、iOS 17+ Observation、CryptoKit（暗号化オフライン音声キャッシュ）、AVSpeechSynthesizer、Node.js（APIキー隔離VoiceProxy）を習得・実装。\n• **Commerce & Full-Stack（Moftail）**:\n  ニッチコミュニティの検証と完全自動化のため、Shopify、Liquid、Meta広告Graph API、Print on Demand APIを連携。\n• **Frontend & Creative Tech（Portfolio）**:\n  直感的な世界観を届けるため、Three.js、WebGL、GSAPによる3Dモデル・スモークガラスUIを構築。\n\n**「Problem → Idea → Build → Learn → Improve」** の順番で、まだ技術者として成長途中であることを自覚しながらも、技術を使って確かな価値を生み出し続けています！`,
          emotion: "attentive-left",
          quickLinks: [
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" },
            { label: "Anchorの技術詳細（iPad）", targetId: "dossier-anchor" }
          ]
        };
      }

      if (isContact) {
        return {
          text: `【ご連絡・次の挑戦】についてですね！\n\nフッターにある通り：\n**「NEXT CHALLENGE. ぜひ一度お話しさせてください。」**\n\n新卒採用・インターン・共同開発など、いつでも前向きにお話しさせていただきます。GitHub等を通じてもお気軽にご連絡ください！`,
          emotion: "joyful-wide",
          quickLinks: [{ label: "フッター（Contact）へジャンプ", targetId: "contact" }]
        };
      }

      if (isGreeting) {
        return {
          text: `こんにちは！Cloudeeだよ ☁️✨\n中邨 隆之介のポートフォリオへ遊びに来てくれてありがとう！\n\n開発したプロダクト（Anchor, Moftail, V.I.S.I.O.N）や、大切にしている技術哲学（本当に必要なものを形にするために、技術を学ぶ）、隆之介の普段の様子など、何でも聞いてね！`,
          emotion: "happy",
          quickLinks: [
            { label: "大切にしている技術哲学", query: "大切にしている技術哲学は？" },
            { label: "Anchorの実績", query: "Anchorについて教えて" },
            { label: "隆之介ってどんな人？", query: "隆之介って普段どんな人？" }
          ]
        };
      }

      // Default contextual synthesis
      return {
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

