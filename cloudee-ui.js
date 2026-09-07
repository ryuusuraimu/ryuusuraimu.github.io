/**
 * Cloudee UI Integration & Interactive Mascot System
 * Features: Apple-Philosophy Floating Assistant Panel, Collapsible Suggested Question Templates,
 * Corner Floating Mascot with Drag & Drop, Live Scene Commentary, iPad Detailed Document Deep-Linking
 */

document.addEventListener("DOMContentLoaded", () => {
  const mountEl = document.getElementById("cloudee-canvas-mount");
  const dockWidget = document.getElementById("cloudee-dock-widget");
  const speechBubble = document.getElementById("cloudee-speech-bubble");
  const sparkleEl = document.getElementById("cloudee-bubble-sparkle");
  const textEl = document.getElementById("cloudee-bubble-text");
  const subtextEl = document.getElementById("cloudee-bubble-subtext");

  // Floating Panel Elements
  const floatingPanel = document.getElementById("cloudee-floating-panel");
  const panelCloseBtn = document.getElementById("cloudee-panel-close");
  const messagesArea = document.getElementById("cloudee-messages-area");
  const messageBubble = document.getElementById("cloudee-message-bubble");
  const actionRow = document.getElementById("cloudee-action-row");
  const actionBtn = document.getElementById("cloudee-panel-action-btn");
  const actionBtnText = document.getElementById("cloudee-action-btn-text");

  // Collapsible Templates Elements
  const templatesToggle = document.getElementById("cloudee-templates-toggle");
  const templatesDrawer = document.getElementById("cloudee-templates-drawer");
  const templateChips = document.querySelectorAll(".template-chip");

  // Chat Input Form
  const chatForm = document.getElementById("cloudee-chat-form");
  const chatInput = document.getElementById("cloudee-chat-input");

  if (!mountEl || !dockWidget || !floatingPanel) return;

  // =========================================================================
  // 1. Initialize 3D Avatar
  // =========================================================================
  let avatar = null;
  try {
    const isMobile = window.innerWidth <= 640;
    const canvasSize = isMobile ? 80 : 92;
    avatar = new window.CloudeeAvatar(mountEl, {
      width: canvasSize,
      height: canvasSize,
      defaultAnimation: "idle"
    });
  } catch (e) {
    console.error("[Cloudee] Failed to initialize avatar:", e);
  }

  // =========================================================================
  // 2. Initialize AI Search Agent
  // =========================================================================
  const agent = new window.AISearchAgent();

  // =========================================================================
  // 3. Panel Open & Close Controller
  // =========================================================================
  let isOpen = false;
  let bubbleHideTimer = null;
  let currentActiveScene = null;
  let sceneDebounceTimer = null;
  const sceneIndices = {};
  const conversationHistory = [];

  // Dynamic positioning: Anchors the chat panel directly above Cloudee's head
  function updateFloatingPanelPosition() {
    if (!floatingPanel || !dockWidget) return;

    const dockRect = dockWidget.getBoundingClientRect();
    const GAP = 4;
    const margin = 14;

    const panelWidth = floatingPanel.offsetWidth || Math.min(460, window.innerWidth - 28);
    const cloudeeCenterX = dockRect.left + dockRect.width / 2;
    const cloudeeHeadY = dockRect.top;
    const cloudeeBottomY = dockRect.bottom;

    // Center horizontally above Cloudee, clamped inside viewport
    let left = cloudeeCenterX - panelWidth / 2;
    left = Math.max(margin, Math.min(window.innerWidth - panelWidth - margin, left));

    // Calculate pointer tail X relative to the panel
    const tailX = cloudeeCenterX - left;
    const clampedTailX = Math.max(26, Math.min(panelWidth - 26, tailX));
    floatingPanel.style.setProperty("--cloudee-tail-x", `${clampedTailX}px`);

    // Determine vertical orientation: Above head vs Flipped below
    if (cloudeeHeadY < 260 && (window.innerHeight - cloudeeBottomY) > cloudeeHeadY) {
      floatingPanel.classList.add("is-flipped-bottom");
      floatingPanel.style.top = `${Math.round(cloudeeBottomY + GAP)}px`;
      floatingPanel.style.bottom = "auto";
      const maxH = Math.floor(window.innerHeight - cloudeeBottomY - GAP - margin);
      floatingPanel.style.maxHeight = `${Math.max(260, maxH)}px`;
    } else {
      floatingPanel.classList.remove("is-flipped-bottom");
      floatingPanel.style.bottom = `${Math.round(window.innerHeight - cloudeeHeadY + GAP)}px`;
      floatingPanel.style.top = "auto";
      const maxH = Math.floor(cloudeeHeadY - GAP - margin);
      floatingPanel.style.maxHeight = `${Math.max(260, maxH)}px`;
    }

    floatingPanel.style.left = `${Math.round(left)}px`;
    floatingPanel.style.right = "auto";
  }

  function openPanel() {
    isOpen = true;
    if (bubbleHideTimer) clearTimeout(bubbleHideTimer);
    if (speechBubble) speechBubble.classList.remove("is-active");

    dockWidget.classList.add("is-panel-open");
    updateFloatingPanelPosition();

    floatingPanel.classList.add("is-active");
    floatingPanel.setAttribute("aria-hidden", "false");

    requestAnimationFrame(() => {
      updateFloatingPanelPosition();
    });

    if (avatar) {
      avatar.setActive(true);
      avatar.triggerReaction("attentive-left", 1200);
    }

    if (chatInput) {
      setTimeout(() => chatInput.focus(), 260);
    }
  }

  function closePanel() {
    isOpen = false;
    dockWidget.classList.remove("is-panel-open");
    floatingPanel.classList.remove("is-active");
    floatingPanel.setAttribute("aria-hidden", "true");

    if (avatar) {
      avatar.setActive(false);
      avatar.playAnimation("idle");
    }

    // Auto-collapse templates drawer on close
    toggleTemplates(false);
  }

  if (panelCloseBtn) {
    panelCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closePanel();
    });
  }

  // Close when clicking outside of floating panel & dock widget
  document.addEventListener("pointerdown", (e) => {
    if (!isOpen) return;
    if (e.target.closest("#cloudee-floating-panel") || e.target.closest("#cloudee-dock-widget")) {
      return;
    }
    closePanel();
  });

  // ESC key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      closePanel();
    }
  });

  // =========================================================================
  // 4. Collapsible Templates Logic (折りたたみ式質問テンプレ)
  // =========================================================================
  function toggleTemplates(forceState = null) {
    if (!templatesToggle || !templatesDrawer) return;

    const isCurrentlyExpanded = templatesToggle.getAttribute("aria-expanded") === "true";
    const nextState = forceState !== null ? forceState : !isCurrentlyExpanded;

    templatesToggle.setAttribute("aria-expanded", String(nextState));
    if (nextState) {
      templatesDrawer.removeAttribute("hidden");
    } else {
      templatesDrawer.setAttribute("hidden", "");
    }

    if (isOpen) {
      setTimeout(() => {
        updateFloatingPanelPosition();
      }, 150);
    }
  }

  if (templatesToggle) {
    templatesToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleTemplates();
    });
  }

  templateChips.forEach((chip) => {
    chip.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const query = chip.dataset.query;
      if (query) {
        if (chatInput) chatInput.value = query;
        handleUserQuery(query);
        // Cleanly auto-collapse templates after tap to keep UI focused
        toggleTemplates(false);
      }
    });
  });

  // =========================================================================
  // 5. Query Processing & AI Synthesis
  // =========================================================================
  async function handleUserQuery(queryText) {
    if (!queryText || !queryText.trim()) return;

    if (chatInput) chatInput.value = "";
    if (actionRow) actionRow.style.display = "none";

    // Visual feedback of thinking
    if (messageBubble) {
      messageBubble.style.opacity = "0.4";
      messageBubble.style.transform = "translateY(4px)";
      messageBubble.style.transition = "all 0.2s ease";
    }

    if (avatar) {
      avatar.setThinking();
    }

    const ipadModalWrap = document.getElementById("ipad-modal-wrap");
    const isModalOpen = ipadModalWrap && ipadModalWrap.classList.contains("is-active");
    const activeDossierEl = document.querySelector(".ipad-dossier.is-active");

    const context = {
      scene: currentActiveScene || "hero",
      isModalOpen: !!isModalOpen,
      activeDossier: activeDossierEl ? activeDossierEl.id : null,
      history: conversationHistory.slice(-4)
    };

    try {
      const result = await agent.answer(queryText, context);

      conversationHistory.push({
        query: queryText,
        topic: result.topic || "general",
        text: result.text
      });
      if (conversationHistory.length > 8) {
        conversationHistory.shift();
      }

      let formatted = escapeHTML(result.text)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/• (.*?)(\n|$)/g, "・$1<br>")
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>");

      if (messageBubble) {
        messageBubble.innerHTML = formatted;
        messageBubble.style.opacity = "1";
        messageBubble.style.transform = "translateY(0)";
      }

      // Scroll message area to top of answer
      if (messagesArea) {
        messagesArea.scrollTop = 0;
      }

      // Check if quick links contain an iPad document link
      if (result.quickLinks && result.quickLinks.length > 0) {
        const dossierLink = result.quickLinks.find(
          (l) => l.targetId && l.targetId.startsWith("dossier-")
        );
        if (dossierLink && actionBtn && actionRow) {
          actionBtn.dataset.dossier = dossierLink.targetId;
          if (actionBtnText) {
            actionBtnText.textContent = `${dossierLink.label.replace("（iPad）", "")}`;
          }
          actionRow.style.display = "block";
        }
      }

      if (avatar) {
        const emotion = result.emotion || "celebrate";
        avatar.triggerReaction(emotion, 2800);
      }

      if (isOpen) {
        requestAnimationFrame(updateFloatingPanelPosition);
      }
    } catch (err) {
      console.error("[Cloudee] Query error:", err);
      if (messageBubble) {
        messageBubble.innerHTML = "ごめんね、少し考えがまとまらなかったよ。もう一度聞いてみて！☁️";
        messageBubble.style.opacity = "1";
        messageBubble.style.transform = "translateY(0)";
      }
      if (avatar) avatar.setActive(true);
      if (isOpen) {
        requestAnimationFrame(updateFloatingPanelPosition);
      }
    }
  }

  // Action Button (Open iPad Modal)
  if (actionBtn) {
    actionBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = actionBtn.dataset.dossier || "dossier-anchor";
      closePanel();
      if (typeof window.openIpadModal === "function") {
        window.openIpadModal(targetId);
      }
    });
  }

  // Form Submit & Input Engagement
  if (chatForm && chatInput) {
    chatInput.addEventListener("focus", () => {
      if (avatar && isOpen) {
        avatar.triggerReaction("curious-left", 1200);
      }
    });

    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleUserQuery(chatInput.value);
    });

    let typeReactionTimer = null;
    const typingReactions = ["small-attentive", "curious-left", "attentive-left", "playful-right"];
    let lastReactionIndex = -1;

    chatInput.addEventListener("input", () => {
      if (!avatar || !isOpen) return;
      if (typeReactionTimer) return;

      typeReactionTimer = setTimeout(() => {
        typeReactionTimer = null;
      }, 350);

      lastReactionIndex = (lastReactionIndex + 1) % typingReactions.length;
      avatar.triggerReaction(typingReactions[lastReactionIndex], 550);
    });
  }

  // =========================================================================
  // 6. Mascot Live Commentary & Dynamic Scene Reactions (スクロール連動の一言コメント)
  // =========================================================================
  const SCENE_COMMENTS = {
    hero: {
      sparkle: "✨",
      subtext: "スクロールしてみてね👀",
      reaction: "wide-excited",
      promptSuggestion: "この3Dモデルについて教えて！",
      comments: [
        "この3Dすごくない！？空中浮遊してるよ✨",
        "スクロールするとMacBookが机に降り立つよ👀",
        "M2 MacBook Airの質感を完全再現してるんだ💻"
      ]
    },
    anchor: {
      sparkle: "💻",
      subtext: "右側の詳細もぜひ読んでね！",
      reaction: "attentive-left",
      promptSuggestion: "Anchorの実績や背景について教えて",
      comments: [
        "パカッと開いた！AnchorのAI検索システムだよ🚀",
        "右側の詳細もぜひ読んでね！プロンプト設計が満載✨",
        "OpenAI API連携のこだわりが詰まってるんだ！"
      ]
    },
    "moftail-storefront": {
      sparkle: "🐦",
      subtext: "右側の詳細もぜひ読んでね！",
      reaction: "curious-left",
      promptSuggestion: "Moftailのピボットストーリーを教えて",
      comments: [
        "次はMoftail！野鳥×アパレルの世界観だよ✨",
        "3Dアバター連動のEC！右側の解説も必見👀",
        "ぼくたちアバター仲間も大活躍してるんだ！"
      ]
    },
    "moftail-ads": {
      sparkle: "📊",
      subtext: "右側の詳細もぜひ読んでね！",
      reaction: "playful-right",
      promptSuggestion: "MoftailでのA/Bテストやデータ検証の工夫を教えて",
      comments: [
        "広告の検証データ！実測CTR 5.26%を記録したよ📊",
        "直感じゃなく、数字の検証で主軸クリエイティブを決めたんだ！",
        "変数を1つに絞ったA/Bテストの工夫、右側の詳細も読んでね！"
      ]
    },
    "moftail-pod": {
      sparkle: "📦",
      subtext: "右側の詳細もぜひ読んでね！",
      reaction: "small-attentive",
      promptSuggestion: "オンデマンド製造やサプライチェーンの仕組みを教えて",
      comments: [
        "在庫ゼロのオンデマンド製造モデルだよ📦",
        "海外工場と自動連携する仕組み、右側の詳細も読んでみてね✨",
        "リスクを最小化する設計思想がポイントなんだ！"
      ]
    },
    "shopify-theme": {
      sparkle: "🛠️",
      subtext: "右側の詳細もぜひ読んでね！",
      reaction: "joyful-wide",
      promptSuggestion: "Shopifyカスタムテーマの技術的こだわりを教えて",
      comments: [
        "3Dビューア搭載のShopifyテーマ！技術満載だよ✨",
        "コードを極限まで軽量化！右側のこだわりも読んでね",
        "滑らかなアニメーション、触ってみてね！"
      ]
    },
    "how-i-work": {
      sparkle: "💡",
      subtext: "技術学習のサイクルをぜひ読んでね！",
      reaction: "small-attentive",
      promptSuggestion: "大切にしている技術哲学は？",
      comments: [
        "『本当に必要なものを形にするために、技術を学ぶ』技術は作るための手段なんだ💡",
        "『Problem → Idea → Build → Learn → Improve』の5ステップだよ！",
        "作るために必要なことを学ぶ、実践型のスタイルなんだ✨"
      ]
    },
    about: {
      sparkle: "☁️",
      subtext: "ぼくをクリックして何でも聞いてね！",
      reaction: "celebrate",
      promptSuggestion: "大切にしている技術哲学は？",
      comments: [
        "隆之介のコア哲学『本当に必要なものを形にするために、技術を学ぶ』ぜひ読んでね！",
        "技術の習得自体がゴールじゃない。誰かの課題を解決するために学ぶんだ☁️",
        "気になることがあったら、ぼくをクリックして何でも聞いてね✨"
      ]
    },
    contact: {
      sparkle: "💌",
      subtext: "メールやカジュアル面談いつでも大歓迎！",
      reaction: "celebrate",
      promptSuggestion: "連絡先や就職活動について教えて！",
      comments: [
        "最後まで見てくれてありがとう！✨ ぜひ一度お話しさせてください！",
        "カジュアル面談や技術の相談など、メールでお気軽に連絡してね📩",
        "ぼくともっとお喋りする？何でも聞いてね☁️"
      ]
    },
    "dossier-anchor": {
      sparkle: "📖",
      subtext: "画面をスクロールして全文読めるよ！",
      reaction: "attentive-left",
      promptSuggestion: "なぜ有事にAIを使わないの？",
      comments: [
        "Anchorの技術解説資料だよ！有事にAIを使わない救命の設計哲学が載ってるよ📖✨",
        "CryptoKitのローカルキャッシュやVoiceProxyの仕組みも解説してるよ！",
        "気になる点があったら、ぼくをタップして何でも聞いてね！"
      ]
    },
    "dossier-moftail": {
      sparkle: "📊",
      subtext: "画面をスクロールして全文読めるよ！",
      reaction: "playful-right",
      promptSuggestion: "Moftailのゴールデンサークルについて教えて",
      comments: [
        "Moftailの戦略資料だよ！なぜ野鳥観察ニッチへピボットしたかの真実が載ってるよ📊",
        "PDPバグ発見から時給$30案件獲得につながったエンジニアリング秘話も必見だよ！",
        "気になる点があったら、ぼくをタップして何でも聞いてね！"
      ]
    },
    "dossier-shopify": {
      sparkle: "🛠️",
      subtext: "画面をスクロールして全文読めるよ！",
      reaction: "joyful-wide",
      promptSuggestion: "Shopifyテーマのパフォーマンス最適化について教えて",
      comments: [
        "Shopifyテーマの詳細仕様だよ！Tailwind×Liquidの軽量設計だよ🛠️",
        "3Dモデル連動やパフォーマンス最適化の技術が詰まってるよ！",
        "気になる点があったら、ぼくをタップして何でも聞いてね！"
      ]
    }
  };

  function updateSpeechBubblePosition() {
    if (!speechBubble || !dockWidget) return;
    const rect = dockWidget.getBoundingClientRect();
    const isNearTop = rect.top < 140;
    const isNearLeft = rect.left < 200;

    speechBubble.classList.toggle("is-flipped-bottom", isNearTop);
    speechBubble.classList.toggle("is-aligned-left", isNearLeft);
  }

  function showSceneComment(sceneKey) {
    if (isOpen) return;
    const conf = SCENE_COMMENTS[sceneKey];
    if (!conf) return;

    currentActiveScene = sceneKey;
    const list = conf.comments;
    const lastIdx = sceneIndices[sceneKey] ?? -1;
    const nextIdx = (lastIdx + 1) % list.length;
    sceneIndices[sceneKey] = nextIdx;

    const comment = list[nextIdx];

    if (sparkleEl) sparkleEl.textContent = conf.sparkle;
    if (textEl) textEl.textContent = comment;
    if (subtextEl) subtextEl.textContent = conf.subtext;

    updateSpeechBubblePosition();

    speechBubble.classList.remove("has-pop");
    void speechBubble.offsetWidth;
    speechBubble.classList.add("has-pop");
    speechBubble.classList.add("is-active");

    if (avatar) {
      avatar.triggerReaction(conf.reaction, 2200);
    }

    if (bubbleHideTimer) clearTimeout(bubbleHideTimer);
    bubbleHideTimer = setTimeout(() => {
      speechBubble.classList.remove("is-active");
    }, 6500);
  }

  window.addEventListener("cloudee:scene-change", (e) => {
    const sceneKey = e.detail && e.detail.scene;
    if (!sceneKey) return;

    if (sceneDebounceTimer) clearTimeout(sceneDebounceTimer);
    sceneDebounceTimer = setTimeout(() => {
      showSceneComment(sceneKey);
    }, 120);
  });

  if (speechBubble) {
    speechBubble.addEventListener("mouseenter", () => {
      if (bubbleHideTimer) clearTimeout(bubbleHideTimer);
      speechBubble.classList.add("is-active");
    });

    speechBubble.addEventListener("mouseleave", () => {
      if (bubbleHideTimer) clearTimeout(bubbleHideTimer);
      bubbleHideTimer = setTimeout(() => {
        speechBubble.classList.remove("is-active");
      }, 2500);
    });

    speechBubble.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!isOpen) openPanel();
    });
  }

  setTimeout(() => {
    if (!isOpen && window.scrollY < 200) {
      showSceneComment("hero");
    }
  }, 1500);

  // =========================================================================
  // 7. Dynamic Mascot & Chat Floating System (頭上追従＆ドラッグ連動システム)
  // =========================================================================
  let isDragging = false;
  let dragMoved = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  dockWidget.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (e.target.closest("#cloudee-floating-panel")) return;

    const rect = dockWidget.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    initialLeft = rect.left;
    initialTop = rect.top;
    dragMoved = false;
    isDragging = true;

    dockWidget.setPointerCapture(e.pointerId);
  });

  dockWidget.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!dragMoved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      dragMoved = true;
      dockWidget.classList.add("is-dragging");
      if (avatar) {
        avatar.applyExpression("surprised-wide-left", 140);
      }
    }

    if (dragMoved) {
      const size = dockWidget.offsetWidth;
      const margin = 10;
      const maxLeft = window.innerWidth - size - margin;
      const maxTop = window.innerHeight - size - margin;

      let newLeft = Math.max(margin, Math.min(maxLeft, initialLeft + dx));
      let newTop = Math.max(margin, Math.min(maxTop, initialTop + dy));

      dockWidget.style.left = `${newLeft}px`;
      dockWidget.style.top = `${newTop}px`;
      dockWidget.style.right = "auto";
      dockWidget.style.bottom = "auto";

      updateSpeechBubblePosition();
      if (isOpen) {
        updateFloatingPanelPosition();
      }
    }
  });

  const endDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    dockWidget.classList.remove("is-dragging");

    try {
      dockWidget.releasePointerCapture(e.pointerId);
    } catch (err) {}

    if (dragMoved) {
      if (avatar) {
        avatar.triggerReaction("playful-right", 1100);
      }
      updateSpeechBubblePosition();
      if (isOpen) {
        updateFloatingPanelPosition();
      }
    } else {
      // Click without drag: Toggle panel open/close
      if (isOpen) {
        closePanel();
      } else {
        openPanel();
      }
    }
  };

  dockWidget.addEventListener("pointerup", endDrag);
  dockWidget.addEventListener("pointercancel", endDrag);

  // Dragging directly from the Chat Panel Header
  const panelHeader = floatingPanel.querySelector(".cloudee-panel-header");
  if (panelHeader) {
    let isHeaderDragging = false;
    let headerDragMoved = false;
    let headerStartX = 0;
    let headerStartY = 0;
    let headerInitialDockLeft = 0;
    let headerInitialDockTop = 0;

    panelHeader.addEventListener("pointerdown", (e) => {
      if (e.target.closest("#cloudee-panel-close")) return;
      if (e.button !== 0 && e.pointerType === "mouse") return;

      const dockRect = dockWidget.getBoundingClientRect();
      headerStartX = e.clientX;
      headerStartY = e.clientY;
      headerInitialDockLeft = dockRect.left;
      headerInitialDockTop = dockRect.top;
      headerDragMoved = false;
      isHeaderDragging = true;

      panelHeader.setPointerCapture(e.pointerId);
    });

    panelHeader.addEventListener("pointermove", (e) => {
      if (!isHeaderDragging) return;
      const dx = e.clientX - headerStartX;
      const dy = e.clientY - headerStartY;

      if (!headerDragMoved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        headerDragMoved = true;
      }

      if (headerDragMoved) {
        const size = dockWidget.offsetWidth;
        const margin = 10;
        const maxLeft = window.innerWidth - size - margin;
        const maxTop = window.innerHeight - size - margin;

        let newLeft = Math.max(margin, Math.min(maxLeft, headerInitialDockLeft + dx));
        let newTop = Math.max(margin, Math.min(maxTop, headerInitialDockTop + dy));

        dockWidget.style.left = `${newLeft}px`;
        dockWidget.style.top = `${newTop}px`;
        dockWidget.style.right = "auto";
        dockWidget.style.bottom = "auto";

        updateSpeechBubblePosition();
        updateFloatingPanelPosition();
      }
    });

    const endHeaderDrag = (e) => {
      if (!isHeaderDragging) return;
      isHeaderDragging = false;
      try {
        panelHeader.releasePointerCapture(e.pointerId);
      } catch (err) {}
      if (headerDragMoved && avatar) {
        avatar.triggerReaction("playful-right", 1000);
      }
    };

    panelHeader.addEventListener("pointerup", endHeaderDrag);
    panelHeader.addEventListener("pointercancel", endHeaderDrag);

    // Double click header to return home
    panelHeader.addEventListener("dblclick", (e) => {
      if (e.target.closest("#cloudee-panel-close")) return;
      resetToHome();
    });
  }

  // Double Click Mascot: Return to Home Position (Right-bottom corner)
  dockWidget.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    resetToHome();
  });

  function resetToHome() {
    dockWidget.style.transition = "left 0.4s cubic-bezier(0.16, 1, 0.3, 1), top 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
    floatingPanel.style.transition = "left 0.4s cubic-bezier(0.16, 1, 0.3, 1), top 0.4s cubic-bezier(0.16, 1, 0.3, 1), bottom 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
    const size = dockWidget.offsetWidth;
    const margin = window.innerWidth <= 640 ? 18 : 32;
    const homeLeft = window.innerWidth - size - margin;
    const homeTop = window.innerHeight - size - margin;

    dockWidget.style.left = `${homeLeft}px`;
    dockWidget.style.top = `${homeTop}px`;

    if (isOpen) {
      updateFloatingPanelPosition();
    }

    setTimeout(() => {
      dockWidget.style.transition = "";
      dockWidget.style.left = "";
      dockWidget.style.top = "";
      dockWidget.style.right = "";
      dockWidget.style.bottom = "";
      floatingPanel.style.transition = "";
      updateSpeechBubblePosition();
      if (isOpen) updateFloatingPanelPosition();
      if (avatar) avatar.triggerReaction("celebrate", 1000);
    }, 420);
  }

  // Sync on window resize
  window.addEventListener("resize", () => {
    updateSpeechBubblePosition();
    if (isOpen) {
      updateFloatingPanelPosition();
    }
  });

  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
