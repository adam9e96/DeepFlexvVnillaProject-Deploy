// 메인 JavaScript 파일 - 모든 모듈을 통합하고 초기화

// HTML include 기능
function includeHTML() {
  const elements = document.querySelectorAll("[data-include-path]");

  elements.forEach((element) => {
    const filePath = element.getAttribute("data-include-path");

    fetch(filePath)
      .then((response) => response.text())
      .then((html) => {
        element.innerHTML = html;

        // 헤더가 로드된 후 이벤트 리스너 재설정
        if (filePath.includes("header.html")) {
          setTimeout(() => {
            Header.initialize();
            // 헤더 로드 후 검색 버튼 이벤트 리스너 재설정
            Search.setupSearchEventListeners();
          }, CONFIG.TRANSITION_DELAY);
        }

        // 사이드바가 로드된 후 이벤트 리스너 재설정
        if (filePath.includes("sidebar.html")) {
          setTimeout(() => {
            Sidebar.setupSidebarEventListeners();
            // 사이드바 상태에 따라 메인 컨텐츠 영역 조정
            updateMainMargin();
          }, CONFIG.TRANSITION_DELAY);
        }
      })
      .catch((error) => {
        console.error("Error loading HTML:", error);
        element.innerHTML = "<p>Error loading content</p>";
      });
  });
}

// 이벤트 리스너 초기화
function initializeEventListeners() {
  // 전역 이벤트 리스너들
  window.addEventListener("click", function (event) {
    if (event.target === DOM.searchModal) {
      Search.closeSearchModal();
    }
  });

  // Ctrl+K 단축키
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "k") {
      event.preventDefault();
      Search.openSearchModal();
    }
    if (event.key === "Escape") {
      Search.closeSearchModal();
      Sidebar.closeSidebar();
    }
  });

  // 필터 이벤트 리스너 설정
  Filters.setupFilterEventListeners();

  // 검색 이벤트 리스너 설정
  Search.setupSearchEventListeners();
}

// 사이드바 상태에 따라 메인 컨텐츠 영역 조정
function updateMainMargin() {
  const sidebar = document.getElementById("sidebar");
  const main = document.querySelector(".main");
  if (sidebar && main) {
    const isMobile = window.innerWidth <= 1024;
    if (!isMobile) {
      if (sidebar.classList.contains("closed")) {
        main.style.marginLeft = "0";
      } else {
        main.style.marginLeft = "280px";
      }
    }
  }
}

// API 키 모달 관리
const ApiKeyModal = {
  modal: null,
  input: null,
  saveBtn: null,
  errorMsg: null,

  init() {
    this.modal = document.getElementById("apiKeyModal");
    this.input = document.getElementById("apiKeyInput");
    this.saveBtn = document.getElementById("saveApiKeyBtn");
    this.errorMsg = document.getElementById("apiKeyError");

    if (!this.modal || !this.input || !this.saveBtn) return;

    // 저장 버튼 클릭 이벤트
    this.saveBtn.addEventListener("click", () => this.saveApiKey());

    // Enter 키로 저장
    this.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.saveApiKey();
      }
    });

    // 모달 외부 클릭으로 닫기 방지 (API 키는 필수)
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        e.stopPropagation();
      }
    });
  },

  show() {
    if (this.modal) {
      this.modal.style.display = "block";
      // 입력 필드에 포커스
      setTimeout(() => {
        if (this.input) {
          this.input.focus();
        }
      }, 100);
    }
  },

  hide() {
    if (this.modal) {
      this.modal.style.display = "none";
    }
  },

  showError(message) {
    if (this.errorMsg) {
      this.errorMsg.textContent = message;
      this.errorMsg.style.display = "block";
    }
  },

  hideError() {
    if (this.errorMsg) {
      this.errorMsg.textContent = "";
      this.errorMsg.style.display = "none";
    }
  },

  async saveApiKey() {
    const apiKey = this.input.value.trim();

    if (!apiKey) {
      this.showError("API 키를 입력해주세요.");
      return;
    }

    if (apiKey.length < 20) {
      this.showError("올바른 API 키 형식이 아닙니다.");
      return;
    }

    this.hideError();
    this.saveBtn.disabled = true;
    this.saveBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> <span>확인 중...</span>';

    // API 키 유효성 검사 (간단한 테스트 요청)
    try {
      const testUrl = `${CONFIG.TMDB_BASE_URL}/configuration?api_key=${apiKey}`;
      const response = await fetch(testUrl);

      if (!response.ok) {
        throw new Error("API 키가 유효하지 않습니다.");
      }

      // API 키 저장
      localStorage.setItem("tmdb_api_key", apiKey);
      CONFIG.TMDB_API_KEY = apiKey;

      // 모달 숨기기
      this.hide();

      // 페이지 초기화
      location.reload();
    } catch (error) {
      this.showError(error.message || "API 키 확인 중 오류가 발생했습니다.");
      this.saveBtn.disabled = false;
      this.saveBtn.innerHTML =
        '<i class="fas fa-save"></i> <span>저장하고 시작하기</span>';
    }
  },

  checkApiKey() {
    // API 키가 없으면 모달 표시
    if (!CONFIG.TMDB_API_KEY || CONFIG.TMDB_API_KEY === "") {
      this.show();
      return false;
    }
    return true;
  },
};

// 현재 페이지가 상세 페이지인지 확인
function isMovieDetailPage() {
  return (
    window.location.pathname.includes("movie-detail.html") ||
    document.querySelector(".movie-detail-main") !== null
  );
}

// 초기화
document.addEventListener("DOMContentLoaded", function () {
  // API 키 모달 초기화
  ApiKeyModal.init();

  // API 키 확인
  if (!ApiKeyModal.checkApiKey()) {
    // API 키가 없으면 여기서 중단
    return;
  }

  // 하이라이트 애니메이션 CSS 추가
  UI.addHighlightAnimation();

  // HTML include 기능
  includeHTML();

  // 사이드바 상태 변경 감지 및 모바일 초기화
  setTimeout(() => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      // 모바일 환경에서 사이드바 기본적으로 닫기
      const isMobile = window.innerWidth <= 1024;
      if (isMobile) {
        sidebar.classList.add("closed");
      }

      const sidebarObserver = new MutationObserver(updateMainMargin);
      sidebarObserver.observe(sidebar, {
        attributes: true,
        attributeFilter: ["class"],
      });
      updateMainMargin();
    }
  }, 500);

  // 윈도우 리사이즈 시 메인 컨텐츠 영역 조정 및 모바일 사이드바 상태 관리
  window.addEventListener("resize", () => {
    updateMainMargin();
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      const isMobile = window.innerWidth <= 1024;
      if (isMobile && !sidebar.classList.contains("closed")) {
        // 모바일로 전환될 때 사이드바가 열려있으면 닫기
        const sidebarOverlay = document.getElementById("sidebarOverlay");
        if (sidebarOverlay) {
          sidebarOverlay.classList.remove("active");
        }
        sidebar.classList.add("closed");
      }
    }
  });

  // 상세 페이지가 아닐 때만 메인 페이지 전용 초기화 실행
  if (!isMovieDetailPage()) {
    // sessionStorage에서 선택된 카테고리 확인
    const selectedCategory = sessionStorage.getItem("selectedCategory");
    if (selectedCategory) {
      // 저장된 카테고리 로드
      sessionStorage.removeItem("selectedCategory");
      setTimeout(() => {
        API.handleCategoryChange(selectedCategory);
        // 활성 상태 업데이트
        const navLink = document.querySelector(
          `.nav-link[data-category="${selectedCategory}"]`
        );
        if (navLink) {
          document
            .querySelectorAll(".nav-link")
            .forEach((l) => l.parentElement.classList.remove("active"));
          navLink.parentElement.classList.add("active");
        }
      }, 300);
    } else {
      // 기본: 현재 상영중인 영화 로드
      API.fetchNowPlayingMovies();
    }

    // 뷰 토글 버튼 업데이트
    UI.updateViewToggle();
  }

  // 이벤트 리스너 초기화 (모든 페이지에서 필요)
  initializeEventListeners();
});

// 전역 네임스페이스 설정
window.API = API;
window.UI = UI;
window.Filters = Filters;
window.Search = Search;
window.Sidebar = Sidebar;
window.Header = Header;
