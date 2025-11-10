// 사이드바 관련 함수들

// 사이드바 네임스페이스
const Sidebar = {
  // 사이드바 이벤트 리스너 설정
  setupSidebarEventListeners() {
    console.log("Setting up sidebar event listeners...");

    // 사이드바 토글 버튼
    const sidebarToggle = document.getElementById("sidebarToggle");
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", Sidebar.toggleSidebar);
    }

    // 사이드바 오버레이 클릭 시 닫기
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener("click", Sidebar.closeSidebar);
    }

    // 사이드바 네비게이션 메뉴
    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    sidebarLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const category = this.getAttribute("data-category");
        if (category) {
          API.handleCategoryChange(category);
          Sidebar.updateSidebarActiveState(this);
        }
      });
    });

    // 사이드바 필터
    const sidebarGenreFilter = document.getElementById("sidebarGenreFilter");
    if (sidebarGenreFilter) {
      sidebarGenreFilter.addEventListener("change", function () {
        if (DOM.genreFilter) {
          DOM.genreFilter.value = this.value;
        }
        Filters.applyFilters();
      });
    }

    const sidebarRatingFilter = document.getElementById("sidebarRatingFilter");
    if (sidebarRatingFilter) {
      sidebarRatingFilter.addEventListener("change", function () {
        if (DOM.ratingFilter) {
          DOM.ratingFilter.value = this.value;
        }
        Filters.applyFilters();
      });
    }

    const sidebarSortBy = document.getElementById("sidebarSortBy");
    if (sidebarSortBy) {
      sidebarSortBy.addEventListener("change", function () {
        if (DOM.sortBy) {
          DOM.sortBy.value = this.value;
        }
        Filters.applyFilters();
      });
    }

    // 사이드바 로그인 버튼
    const sidebarLoginBtn = document.getElementById("sidebarLoginBtn");
    if (sidebarLoginBtn) {
      sidebarLoginBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "login.html";
      });
    }

    // 사이드바 사용자 정보 클릭
    const userInfo = document.querySelector(".user-info");
    if (userInfo) {
      userInfo.addEventListener("click", function () {
        alert("로그인 기능은 준비 중입니다.");
      });
    }
  },

  // 사이드바 토글
  toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const main = document.querySelector(".main");
    const isMobile = window.innerWidth <= 1024;

    if (sidebar) {
      const isClosed = sidebar.classList.contains("closed");

      if (isClosed) {
        // 사이드바 열기
        sidebar.classList.remove("closed");
        if (isMobile && sidebarOverlay) {
          sidebarOverlay.classList.add("active");
        }
        if (main && !isMobile) {
          main.style.marginLeft = "280px";
        }
      } else {
        // 사이드바 닫기
        sidebar.classList.add("closed");
        if (sidebarOverlay) {
          sidebarOverlay.classList.remove("active");
        }
        if (main && !isMobile) {
          main.style.marginLeft = "0";
        }
      }
    }
  },

  // 사이드바 열기
  openSidebar() {
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const main = document.querySelector(".main");

    if (sidebar) {
      sidebar.classList.remove("closed");

      if (window.innerWidth <= 1024 && sidebarOverlay) {
        sidebarOverlay.classList.add("active");
      }

      if (main) {
        main.style.marginLeft = "280px";
      }
    }
  },

  // 사이드바 닫기
  closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const main = document.querySelector(".main");

    if (sidebar) {
      sidebar.classList.add("closed");

      if (sidebarOverlay) {
        sidebarOverlay.classList.remove("active");
      }

      if (main) {
        main.style.marginLeft = "0";
      }
    }
  },

  // 사이드바 활성 상태 업데이트
  updateSidebarActiveState(activeLink) {
    // 모든 사이드바 아이템에서 active 클래스 제거
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    sidebarItems.forEach((item) => item.classList.remove("active"));

    // 클릭된 링크의 부모 아이템에 active 클래스 추가
    if (activeLink) {
      activeLink.closest(".sidebar-item").classList.add("active");
    }
  },
};
