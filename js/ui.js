// UI 관련 함수들

// DOM 요소 가져오기
const DOM = {
    get searchModal() { return document.getElementById('searchModal'); },
    get searchInput() { return document.getElementById('searchInput'); },
    get searchResults() { return document.getElementById('searchResults'); },
    get viewToggle() { return document.getElementById('viewToggle'); },
    get moviesContainer() { return document.getElementById('moviesContainer'); },
    get genreFilter() { return document.getElementById('genreFilter'); },
    get ratingFilter() { return document.getElementById('ratingFilter'); },
    get sortBy() { return document.getElementById('sortBy'); },
    get prevPage() { return document.getElementById('prevPage'); },
    get nextPage() { return document.getElementById('nextPage'); },
    get pageNumbers() { return document.getElementById('pageNumbers'); }
};

// UI 네임스페이스
const UI = {
    // 로딩 표시
    showLoading() {
        if (DOM.moviesContainer) {
            DOM.moviesContainer.innerHTML = '<div class="loading"><div class="spinner"></div>영화 데이터를 불러오는 중...</div>';
        }
    },

    // 로딩 숨기기
    hideLoading() {
        // 로딩은 renderMovies()에서 처리됨
    },

    // 에러 표시
    showError(message) {
        if (DOM.moviesContainer) {
            DOM.moviesContainer.innerHTML = `<div class="loading">${message}</div>`;
        }
    },

    // 뷰 전환
    toggleView() {
        STATE.currentView = STATE.currentView === 'grid' ? 'list' : 'grid';
        UI.updateViewToggle();
        UI.renderMovies();
    },

    // 뷰 토글 버튼 업데이트
    updateViewToggle() {
        const gridIcon = document.getElementById('gridIcon');
        const listIcon = document.getElementById('listIcon');

        if (gridIcon && listIcon) {
            if (STATE.currentView === 'grid') {
                gridIcon.style.color = '#4ecdc4';
                listIcon.style.color = '#888';
            } else {
                gridIcon.style.color = '#888';
                listIcon.style.color = '#4ecdc4';
            }
        }
    },

    // 영화 렌더링
    renderMovies() {
        const startIndex = (STATE.currentPage - 1) * CONFIG.MOVIES_PER_PAGE;
        const endIndex = startIndex + CONFIG.MOVIES_PER_PAGE;
        const moviesToShow = STATE.filteredMovies.slice(startIndex, endIndex);

        if (DOM.moviesContainer) {
            DOM.moviesContainer.innerHTML = '';

            if (moviesToShow.length === 0) {
                DOM.moviesContainer.innerHTML = '<div class="loading">검색 결과가 없습니다.</div>';
                return;
            }

            const containerClass = STATE.currentView === 'grid' ? 'movies-grid' : 'movies-list';
            DOM.moviesContainer.className = `movies-container ${containerClass}`;

            moviesToShow.forEach(movie => {
                const movieElement = UI.createMovieElement(movie);
                DOM.moviesContainer.appendChild(movieElement);
            });
        }
    },

    // 영화 요소 생성
    createMovieElement(movie) {
        const movieDiv = document.createElement('div');
        const className = STATE.currentView === 'grid' ? 'movie-card' : 'movie-list-item';
        movieDiv.className = className;
        movieDiv.setAttribute('data-movie-id', movie.id);

        if (STATE.currentView === 'grid') {
            movieDiv.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/300x400/333/fff?text=No+Image'">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-overview">${movie.overview}</p>
                    <div class="movie-meta">
                        <div class="movie-rating">
                            <span class="rating-stars">${'★'.repeat(Math.floor(movie.rating / 2))}${'☆'.repeat(5 - Math.floor(movie.rating / 2))}</span>
                            <span>${movie.rating}/10</span>
                        </div>
                        <span class="movie-date">${UI.formatDate(movie.releaseDate)}</span>
                    </div>
                    <div class="movie-genres">
                        ${movie.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                    </div>
                    <div class="korean-info">
                        <i class="fas fa-info-circle"></i>
                        <span>${movie.censorshipInfo}</span>
                    </div>
                    <div class="ott-platforms">
                        ${movie.ottPlatforms.map(platform => `<span class="ott-platform">${platform}</span>`).join('')}
                    </div>
                </div>
            `;
        } else {
            movieDiv.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" class="movie-list-poster" onerror="this.src='https://via.placeholder.com/300x400/333/fff?text=No+Image'">
                <div class="movie-list-content">
                    <div>
                        <h3 class="movie-list-title">${movie.title}</h3>
                        <p class="movie-list-overview">${movie.overview}</p>
                    </div>
                    <div class="movie-list-meta">
                        <div class="movie-list-rating">
                            <span class="rating-stars">${'★'.repeat(Math.floor(movie.rating / 2))}${'☆'.repeat(5 - Math.floor(movie.rating / 2))}</span>
                            <span>${movie.rating}/10</span>
                        </div>
                        <div class="movie-list-genres">
                            ${movie.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                        </div>
                        <div class="korean-info">
                            <i class="fas fa-info-circle"></i>
                            <span>${movie.censorshipInfo}</span>
                        </div>
                        <div class="ott-platforms">
                            ${movie.ottPlatforms.map(platform => `<span class="ott-platform">${platform}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        // 클릭 이벤트 (영화 상세 정보 모달 등)
        movieDiv.addEventListener('click', () => {
            UI.showMovieDetail(movie);
        });

        return movieDiv;
    },

    // 영화 상세 정보 페이지로 이동
    showMovieDetail(movie) {
        // URL 파라미터로 영화 ID 전달
        window.location.href = `movie-detail.html?id=${movie.id}`;
    },

    // 날짜 포맷팅
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // 페이지 변경
    changePage(page) {
        const totalPages = Math.ceil(STATE.filteredMovies.length / CONFIG.MOVIES_PER_PAGE);

        if (page < 1 || page > totalPages) return;

        STATE.currentPage = page;
        UI.renderMovies();
        UI.updatePagination();

        // 페이지 상단으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // 페이지네이션 업데이트
    updatePagination() {
        const totalPages = Math.ceil(STATE.filteredMovies.length / CONFIG.MOVIES_PER_PAGE);

        // 이전/다음 버튼 상태 업데이트
        if (DOM.prevPage) {
            DOM.prevPage.disabled = STATE.currentPage === 1;
        }
        if (DOM.nextPage) {
            DOM.nextPage.disabled = STATE.currentPage === totalPages;
        }

        // 페이지 번호 생성
        if (DOM.pageNumbers) {
            DOM.pageNumbers.innerHTML = '';

            const startPage = Math.max(1, STATE.currentPage - 2);
            const endPage = Math.min(totalPages, STATE.currentPage + 2);

            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `page-number ${i === STATE.currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => UI.changePage(i));
                DOM.pageNumbers.appendChild(pageBtn);
            }
        }
    },

    // 특정 영화로 스크롤
    scrollToMovie(movieId) {
        const movieElement = document.querySelector(`[data-movie-id="${movieId}"]`);
        if (movieElement) {
            movieElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            movieElement.style.animation = 'highlight 2s ease-in-out';
        }
    },

    // 하이라이트 애니메이션 CSS 추가
    addHighlightAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes highlight {
                0% { background-color: transparent; }
                50% { background-color: rgba(78, 205, 196, 0.3); }
                100% { background-color: transparent; }
            }
        `;
        document.head.appendChild(style);
    }
};