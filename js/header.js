// 헤더 관련 함수들

// 헤더 네임스페이스
const Header = {
  // 사용자 정보 관리
  userData: null,

  // 사용자 정보 가져오기
  getUserData() {
    const userData =
      localStorage.getItem("userData") || sessionStorage.getItem("userData");
    if (userData) {
      try {
        this.userData = JSON.parse(userData);
        return this.userData;
      } catch (error) {
        console.error("사용자 데이터 파싱 오류:", error);
        this.clearUserData();
        return null;
      }
    }
    return null;
  },

  // 사용자 정보 저장
  saveUserData(userData) {
    this.userData = userData;
    if (userData.rememberMe) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }
  },

  // 사용자 정보 삭제
  clearUserData() {
    this.userData = null;
    localStorage.removeItem("userData");
    sessionStorage.removeItem("userData");
  },

  // 로그인 상태 확인
  isLoggedIn() {
    const userData = this.getUserData();
    if (!userData) return false;

    // rememberMe가 false인 경우 24시간 후 자동 로그아웃
    if (!userData.rememberMe) {
      const loginTime = new Date(userData.loginTime);
      const now = new Date();
      const timeDiff = now - loginTime;

      if (timeDiff > 24 * 60 * 60 * 1000) {
        this.clearUserData();
        return false;
      }
    }

    return true;
  },

  // 헤더 UI 업데이트
  updateHeaderUI() {
    const userMenu = document.getElementById("userMenu");
    const loginBtn = document.getElementById("loginBtn");

    if (this.isLoggedIn()) {
      // 로그인된 상태
      const userData = this.getUserData();
      if (userData && userMenu && loginBtn) {
        // 사용자 정보 표시
        const userName = document.getElementById("userName");
        const userEmail = document.getElementById("userEmail");

        if (userName) userName.textContent = userData.name || "사용자";
        if (userEmail) userEmail.textContent = userData.email;

        // UI 표시/숨김
        userMenu.style.display = "flex";
        loginBtn.style.display = "none";
      }
    } else {
      // 로그인되지 않은 상태
      if (userMenu && loginBtn) {
        userMenu.style.display = "none";
        loginBtn.style.display = "flex";
      }
    }
  },

  // 로그인 처리
  handleLogin() {
    window.location.href = "login.html";
  },

  // 로그아웃 처리
  handleLogout() {
    this.clearUserData();
    this.updateHeaderUI();

    // 로그아웃 성공 메시지
    this.showNotification("로그아웃되었습니다.", "success");

    // 페이지 새로고침 (선택사항)
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  },

  // 알림 표시
  showNotification(message, type = "info") {
    // 간단한 알림 구현
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: 0 4px 12px var(--shadow-primary);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  },

  // 헤더 관련 이벤트 리스너 설정
  setupHeaderEventListeners() {
    console.log("Setting up header event listeners...");

    // 뷰 전환 - 이벤트 위임 사용
    const header = document.querySelector(".header");
    if (header) {
      console.log("Adding view toggle event listener with event delegation");
      header.addEventListener("click", function (e) {
        if (e.target.closest("#viewToggle")) {
          console.log("View toggle clicked!");
          e.preventDefault();
          UI.toggleView();
        }
      });
    }

    // 헤더 사이드바 토글 버튼 - 중복 방지를 위해 기존 리스너 제거 후 추가
    const headerSidebarToggle = document.getElementById("headerSidebarToggle");
    if (headerSidebarToggle) {
      // 기존 이벤트 리스너 제거
      const existingHandler = headerSidebarToggle._sidebarToggleHandler;
      if (existingHandler) {
        headerSidebarToggle.removeEventListener("click", existingHandler);
      }
      
      // 새로운 이벤트 핸들러 생성
      const sidebarToggleHandler = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof Sidebar !== "undefined") {
          Sidebar.toggleSidebar();
        }
      };
      
      headerSidebarToggle.addEventListener("click", sidebarToggleHandler);
      headerSidebarToggle._sidebarToggleHandler = sidebarToggleHandler; // 참조 저장
    }

    // 로고 배너 클릭 - 메인 페이지로 이동
    if (header) {
      header.addEventListener("click", function (e) {
        const logoBanner = e.target.closest(".logo, #logoBanner");
        if (logoBanner) {
          e.preventDefault();
          const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

          // 현재 페이지가 index.html이 아니면 메인 페이지로 이동
          if (currentPage !== "index.html") {
            window.location.href = "index.html";
          } else {
            // 이미 메인 페이지면 페이지 상단으로 스크롤
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      });
    }

    // 네비게이션 메뉴 - 이벤트 위임 사용
    if (header) {
      console.log("Adding navigation event listener with event delegation");
      header.addEventListener("click", function (e) {
        const navLink = e.target.closest(".nav-link");
        if (navLink) {
          console.log(
            "Nav link clicked:",
            navLink.getAttribute("data-category")
          );
          e.preventDefault();
          const category = navLink.getAttribute("data-category");
          API.handleCategoryChange(category);

          // 활성 상태 업데이트
          document
            .querySelectorAll(".nav-link")
            .forEach((l) => l.parentElement.classList.remove("active"));
          navLink.parentElement.classList.add("active");
        }
      });
    }

    // 로그인 버튼 이벤트
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) {
      loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        Header.handleLogin();
      });
    }

    // 로그아웃 링크 이벤트
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        Header.handleLogout();
      });
    }

    // 프로필 링크 이벤트
    const profileLink = document.getElementById("profileLink");
    if (profileLink) {
      profileLink.addEventListener("click", (e) => {
        e.preventDefault();
        Header.showNotification("프로필 기능은 준비 중입니다.", "info");
      });
    }

    // 설정 링크 이벤트
    const settingsLink = document.getElementById("settingsLink");
    if (settingsLink) {
      settingsLink.addEventListener("click", (e) => {
        e.preventDefault();
        Header.showNotification("설정 기능은 준비 중입니다.", "info");
      });
    }
  },

  // 헤더 초기화
  initialize() {
    Header.updateHeaderUI();
    Header.setupHeaderEventListeners();
  },
};
