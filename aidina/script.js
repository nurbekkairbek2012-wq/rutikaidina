/* =========================================
   1. АЙНЫМАЛЫЛАРДЫ АЛУ
   ========================================= */
const menu = document.getElementById("menuScreen");
const selectionScreen = document.getElementById("selectionScreen");
const main = document.getElementById("mainContent");
const imgBlock = document.getElementById("animatedNewImage");
const music = document.getElementById("bgMusic");
const infoText = document.getElementById("infoText"); 

/* =========================================
   2. ЖҮКТЕЛУ ЖӘНЕ АНИМАЦИЯ (INTRO ЛОГИКАСЫ)
   ========================================= */
function showAnimatedImage() {
  if (imgBlock) {
      imgBlock.style.right = '-350px';
      imgBlock.style.opacity = '0';
      setTimeout(() => {
        imgBlock.style.right = '20px';
        imgBlock.style.opacity = '1';
      }, 50);
  }
}

// ВИКИПЕДИЯДАН ҚАЙТЫП КЕЛГЕНДЕ (skipIntro)
window.addEventListener('load', () => {
  if (sessionStorage.getItem('skipIntro') === 'true') {
      // 1. Интроны жасырамыз
      menu.style.display = 'none';
      menu.classList.add('hidden');
      if (imgBlock) imgBlock.classList.add("hide");

      // 2. Лоббиді бірден ашамыз
      if (main) {
          main.style.display = 'block';
          setTimeout(() => main.classList.add('show'), 50);
      }
      
      // Белгіні өшіреміз
      sessionStorage.removeItem('skipIntro');
  } else {
      // Әдеттегі анимация
      setTimeout(showAnimatedImage, 300);
  }
});

/* =========================================
   3. "ОЙЫНДЫ БАСТАУ" БАТЫРМАСЫ (ТҮЗЕТІЛДІ)
   ========================================= */
document.getElementById("startBtn").addEventListener("click", () => {
  if (music) {
      music.volume = 1.0;
      music.play().catch((e) => console.log("Audio play error:", e));
  }

  // Интроны жабамыз
  if (imgBlock) imgBlock.classList.add("hide");
  menu.classList.add("hidden");

  setTimeout(() => {
    menu.style.display = "none";
    
    // МАҢЫЗДЫ ТҮЗЕТУ: 'block' емес, 'flex' болуы керек!
    if (selectionScreen) {
        selectionScreen.style.display = "flex"; // <--- ОСЫ ЖЕР ТҮЗЕТІЛДІ
        selectionScreen.style.flexDirection = "column";
        selectionScreen.style.alignItems = "center";
        selectionScreen.style.justifyContent = "center";
        
        selectionScreen.classList.remove("hidden");
        selectionScreen.style.opacity = "1";
    }
  }, 800);
});

/* =========================================
   4. ШАЙҚАСТЫ ТАҢДАУ (BattleNav)
   ========================================= */
const nav = document.getElementById("battleNav");
const high = document.getElementById("cursorHighlight");

if (nav) {
    const links = nav.querySelectorAll("a");
    const colors = ["#1abc9c", "#e74c3c", "#3498db", "#9b59b6", "#e67e22"];

    links.forEach((link, i) => {
      
      // Анимация фона
      link.addEventListener("mousemove", () => {
        const rect = link.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        high.style.width = rect.width + "px";
        high.style.left = (rect.left - navRect.left) + "px";
        high.style.background = colors[i];
        high.style.opacity = 1;
      });

      // Текст көрсету
      link.addEventListener("mouseenter", () => {
        const text = link.getAttribute("data-desc");
        if (text && infoText) {
          infoText.textContent = text; 
          infoText.classList.add("visible"); 
        }
      });

      // Текст жасыру
      link.addEventListener("mouseleave", () => {
        if (infoText) infoText.classList.remove("visible");
      });

      // КЛИК (Таңдау логикасы)
      link.addEventListener("click", (e) => {
        const href = link.getAttribute('href');
        // Егер href="#" болса ғана тоқтатамыз
        if (!href || href === '#') {
            e.preventDefault();
        }

        if (link.classList.contains("locked")) {
          alert("Уақытша жабық"); 
        } 
        else if (link.classList.contains("active")) {
          // Орбұлақты таңдағанда -> Лобби ашылады
          if (selectionScreen) {
              selectionScreen.classList.add("hidden"); // Selection жабылады
              
              setTimeout(() => {
                selectionScreen.style.display = "none";
                
                // Main ашылады
                if (main) {
                    main.style.display = "block";
                    setTimeout(() => {
                      main.classList.add("show");
                    }, 50);
                }
              }, 800);
          }
        }
      });
    });

    nav.addEventListener("mouseleave", () => {
      high.style.opacity = 0;
    });
}

/* =========================================
   5. МОДАЛЬДЫ ТЕРЕЗЕЛЕР (БАПТАУЛАР & БІЗ ТУРАЛЫ)
   ========================================= */
const settingsBtn = document.getElementById('settingsBtn'); 
const aboutBtn = document.getElementById('aboutBtn');       

const settingsModal = document.getElementById('settingsModal');
const aboutModal = document.getElementById('aboutModal');
const closeButtons = document.querySelectorAll('.close-modal');
const backToMenuBtn = document.getElementById('backToMenuBtn');

// АШУ
if (settingsBtn) {
    settingsBtn.addEventListener('click', () => openModal(settingsModal));
}
if (aboutBtn) {
    aboutBtn.addEventListener('click', () => openModal(aboutModal));
}

// ЖАБУ (Крестик)
closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay'); 
        closeModal(modal);
    });
});

// ЖАБУ (Сыртқы фон)
window.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeModal(settingsModal);
    if (e.target === aboutModal) closeModal(aboutModal);
});

// ФУНКЦИЯЛАР
function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('open');
    }, 10);
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// ТЕРЕЗЕНІ ЖАБУ БАТЫРМАСЫ (Settings ішіндегі)
if (backToMenuBtn) {
    backToMenuBtn.addEventListener('click', () => {
        closeModal(settingsModal);
    });
}