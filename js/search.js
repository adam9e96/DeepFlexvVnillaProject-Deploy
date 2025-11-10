// 검색 관련 함수들

let searchTimeout;

// 검색 네임스페이스
const Search = {
  // 검색 처리
  handleSearch() {
    const searchInput = DOM.searchInput;
    const searchResults = DOM.searchResults;

    if (!searchInput || !searchResults) return;

    const query = searchInput.value.trim();

    // 이전 타이머 클리어
    clearTimeout(searchTimeout);

    // 한글 검색을 위해 최소 1자 이상 입력 필요
    if (query.length < 1) {
      searchResults.innerHTML = "";
      // 검색어가 비어있으면 히스토리 표시
      if (query.length === 0) {
        Search.displaySearchHistory();
      }
      return;
    }

    // 디바운싱: 500ms 후에 검색 실행
    searchTimeout = setTimeout(() => {
      API.searchMovies(query);
    }, CONFIG.SEARCH_DEBOUNCE_DELAY);
  },

  // 검색 결과 표시
  displaySearchResults(results) {
    const searchResults = DOM.searchResults;
    if (!searchResults) return;

    searchResults.innerHTML = "";

    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="search-no-results">검색 결과가 없습니다.</div>';
      return;
    }

    results.forEach((movie) => {
      const resultItem = document.createElement("div");
      resultItem.className = "search-result-item";
      resultItem.innerHTML = `
                <div class="search-result-content">
                    <div class="search-result-poster">
                        <img src="${movie.poster}" alt="${
        movie.title
      }" onerror="this.src='https://via.placeholder.com/60x90/333/fff?text=No+Image'">
                    </div>
                    <div class="search-result-info">
                        <h3 class="search-result-title">${movie.title}</h3>
                        <div class="search-result-meta">
                            <span class="search-result-rating">
                                <i class="fas fa-star"></i>
                                ${movie.rating}/10
                            </span>
                            <span class="search-result-year">${
                              movie.releaseDate
                                ? new Date(movie.releaseDate).getFullYear()
                                : "N/A"
                            }</span>
                        </div>
                        <p class="search-result-overview">${
                          movie.overview.length > 100
                            ? movie.overview.substring(0, 100) + "..."
                            : movie.overview
                        }</p>
                        <div class="search-result-genres">
                            ${movie.genres
                              .slice(0, 3)
                              .map(
                                (genre) =>
                                  `<span class="genre-tag">${genre}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
            `;

      resultItem.addEventListener("click", () => {
        // 검색 결과 클릭 시 해당 영화를 메인 리스트에 추가하고 스크롤
        Search.closeSearchModal();
        Search.addMovieToMainList(movie);
      });

      searchResults.appendChild(resultItem);
    });
  },

  // 검색 선택 업데이트
  updateSearchSelection(searchItems, activeIndex) {
    // 모든 항목에서 active 클래스 제거
    searchItems.forEach((item) => item.classList.remove("active"));

    // 선택된 항목에 active 클래스 추가
    if (searchItems[activeIndex]) {
      searchItems[activeIndex].classList.add("active");
      searchItems[activeIndex].scrollIntoView({ block: "nearest" });
    }
  },

  // 검색 히스토리 표시
  displaySearchHistory() {
    const searchResults = DOM.searchResults;
    if (!searchResults) return;

    if (STATE.searchHistory.length === 0) {
      searchResults.innerHTML =
        '<div class="search-no-results">최근 검색어가 없습니다.</div>';
      return;
    }

    searchResults.innerHTML = "";

    const historyTitle = document.createElement("div");
    historyTitle.className = "search-history-title";
    historyTitle.innerHTML = "<h4>최근 검색어</h4>";
    searchResults.appendChild(historyTitle);

    STATE.searchHistory.slice(0, 5).forEach((query, index) => {
      const historyItem = document.createElement("div");
      historyItem.className = "search-history-item";
      historyItem.innerHTML = `
                <i class="fas fa-history"></i>
                <span>${query}</span>
                <button class="remove-history" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;

      historyItem.addEventListener("click", (e) => {
        if (!e.target.closest(".remove-history")) {
          const searchInput = DOM.searchInput;
          if (searchInput) {
            searchInput.value = query;
            API.searchMovies(query);
          }
        }
      });

      // 삭제 버튼 이벤트
      const removeBtn = historyItem.querySelector(".remove-history");
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        Search.removeFromHistory(index);
      });

      searchResults.appendChild(historyItem);
    });
  },

  // 검색어를 히스토리에 추가
  addToSearchHistory(query) {
    // 중복 제거
    STATE.searchHistory = STATE.searchHistory.filter((item) => item !== query);

    // 맨 앞에 추가
    STATE.searchHistory.unshift(query);

    // 최대 10개까지만 저장
    STATE.searchHistory = STATE.searchHistory.slice(
      0,
      CONFIG.MAX_SEARCH_HISTORY
    );

    // 로컬 스토리지에 저장
    localStorage.setItem("searchHistory", JSON.stringify(STATE.searchHistory));
  },

  // 히스토리에서 제거
  removeFromHistory(index) {
    STATE.searchHistory.splice(index, 1);
    localStorage.setItem("searchHistory", JSON.stringify(STATE.searchHistory));
    Search.displaySearchHistory();
  },

  // 검색된 영화를 메인 리스트에 추가
  addMovieToMainList(movie) {
    // 영화가 이미 리스트에 있는지 확인
    const existingMovie = STATE.moviesData.find((m) => m.id === movie.id);

    if (!existingMovie) {
      // 새로운 영화를 리스트에 추가
      STATE.moviesData.unshift(movie);
      STATE.filteredMovies = [...STATE.moviesData];
      STATE.currentPage = 1;
      UI.renderMovies();
      UI.updatePagination();
    }

    // 해당 영화로 스크롤
    setTimeout(() => {
      UI.scrollToMovie(movie.id);
    }, CONFIG.TRANSITION_DELAY);
  },

  // 검색 모달 열기
  openSearchModal() {
    if (DOM.searchModal) {
      DOM.searchModal.style.display = "block";
      document.body.style.overflow = "hidden";

      // 검색 입력 필드에 포커스
      if (DOM.searchInput) {
        DOM.searchInput.focus();
      }

      // 검색 히스토리 표시
      Search.displaySearchHistory();
    }
  },

  // 검색 모달 닫기
  closeSearchModal() {
    if (DOM.searchModal) {
      DOM.searchModal.style.display = "none";

      // 검색 입력 필드 초기화
      if (DOM.searchInput) {
        DOM.searchInput.value = "";
      }

      // 검색 결과 초기화
      if (DOM.searchResults) {
        DOM.searchResults.innerHTML = "";
      }

      document.body.style.overflow = "auto";
    }
  },

  // 검색 이벤트 리스너 설정
  setupSearchEventListeners() {
    // 검색 버튼 - 이벤트 위임 사용 (헤더가 동적으로 로드되므로)
    const header = document.querySelector(".header");
    if (header) {
      // 기존 이벤트 리스너가 있는지 확인하고 제거
      const existingHandler = header._searchBtnHandler;
      if (existingHandler) {
        header.removeEventListener("click", existingHandler);
      }

      // 새로운 이벤트 핸들러 생성
      const searchBtnHandler = (e) => {
        const searchBtn = e.target.closest("#searchBtn");
        if (searchBtn) {
          e.preventDefault();
          Search.openSearchModal();
        }
      };

      header.addEventListener("click", searchBtnHandler);
      header._searchBtnHandler = searchBtnHandler; // 참조 저장
    }

    // 검색 모달 닫기 버튼
    const closeBtn = document.querySelector(".close");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        Search.closeSearchModal();
      });
    }

    // 검색 기능 - 중복 방지를 위해 기존 리스너 제거 후 추가
    if (DOM.searchInput) {
      // 기존 이벤트 리스너 제거
      const newInput = DOM.searchInput.cloneNode(true);
      DOM.searchInput.parentNode.replaceChild(newInput, DOM.searchInput);

      // 새로운 참조로 이벤트 리스너 추가
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.addEventListener("input", Search.handleSearch);

        // 검색 모달 키보드 네비게이션
        searchInput.addEventListener("keydown", function (event) {
          const searchItems = document.querySelectorAll(".search-result-item");
          const currentActive = document.querySelector(
            ".search-result-item.active"
          );
          let activeIndex = -1;

          if (currentActive) {
            activeIndex = Array.from(searchItems).indexOf(currentActive);
          }

          switch (event.key) {
            case "ArrowDown":
              event.preventDefault();
              activeIndex = Math.min(activeIndex + 1, searchItems.length - 1);
              Search.updateSearchSelection(searchItems, activeIndex);
              break;
            case "ArrowUp":
              event.preventDefault();
              activeIndex = Math.max(activeIndex - 1, 0);
              Search.updateSearchSelection(searchItems, activeIndex);
              break;
            case "Enter":
              event.preventDefault();
              if (currentActive) {
                currentActive.click();
              }
              break;
          }
        });
      }
    }
  },
};
