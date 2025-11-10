// 필터 관련 함수들

// 필터 네임스페이스
const Filters = {
    // 필터 적용
    applyFilters() {
        const selectedGenre = DOM.genreFilter ? DOM.genreFilter.value : '';
        const selectedRating = parseFloat(DOM.ratingFilter ? DOM.ratingFilter.value : '');
        const sortOption = DOM.sortBy ? DOM.sortBy.value : 'latest';

        STATE.filteredMovies = STATE.moviesData.filter(movie => {
            const genreMatch = !selectedGenre || movie.genres.includes(selectedGenre);
            const ratingMatch = !selectedRating || movie.rating >= selectedRating;
            return genreMatch && ratingMatch;
        });

        // 정렬
        switch (sortOption) {
            case 'rating':
                STATE.filteredMovies.sort((a, b) => b.rating - a.rating);
                break;
            case 'title':
                STATE.filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'latest':
            default:
                STATE.filteredMovies.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
        }

        STATE.currentPage = 1;
        UI.renderMovies();
        UI.updatePagination();
        
        // 사이드바 필터와 동기화
        Filters.syncSidebarFilters();
    },

    // 사이드바 필터와 메인 필터 동기화
    syncSidebarFilters() {
        const sidebarGenreFilter = document.getElementById('sidebarGenreFilter');
        const sidebarRatingFilter = document.getElementById('sidebarRatingFilter');
        const sidebarSortBy = document.getElementById('sidebarSortBy');
        
        if (DOM.genreFilter && sidebarGenreFilter) {
            sidebarGenreFilter.value = DOM.genreFilter.value;
        }
        if (DOM.ratingFilter && sidebarRatingFilter) {
            sidebarRatingFilter.value = DOM.ratingFilter.value;
        }
        if (DOM.sortBy && sidebarSortBy) {
            sidebarSortBy.value = DOM.sortBy.value;
        }
    },

    // 필터 이벤트 리스너 설정
    setupFilterEventListeners() {
        // 메인 필터
        if (DOM.genreFilter) {
            DOM.genreFilter.addEventListener('change', Filters.applyFilters);
        }
        if (DOM.ratingFilter) {
            DOM.ratingFilter.addEventListener('change', Filters.applyFilters);
        }
        if (DOM.sortBy) {
            DOM.sortBy.addEventListener('change', Filters.applyFilters);
        }

        // 페이지네이션
        if (DOM.prevPage) {
            DOM.prevPage.addEventListener('click', () => UI.changePage(STATE.currentPage - 1));
        }
        if (DOM.nextPage) {
            DOM.nextPage.addEventListener('click', () => UI.changePage(STATE.currentPage + 1));
        }
    }
};