// 영화 상세 정보 페이지 JavaScript

// DOM 요소 가져오기
const MovieDetailDOM = {
    get backButton() { return document.getElementById('backButton'); },
    get loadingContainer() { return document.getElementById('loadingContainer'); },
    get errorContainer() { return document.getElementById('errorContainer'); },
    get errorMessage() { return document.getElementById('errorMessage'); },
    get retryButton() { return document.getElementById('retryButton'); },
    get movieDetailContainer() { return document.getElementById('movieDetailContainer'); },
    get movieBackdrop() { return document.getElementById('movieBackdrop'); },
    get movieTitle() { return document.getElementById('movieTitle'); },
    get movieTagline() { return document.getElementById('movieTagline'); },
    get moviePoster() { return document.getElementById('moviePoster'); },
    get movieRating() { return document.getElementById('movieRating'); },
    get ratingStars() { return document.getElementById('ratingStars'); },
    get voteCount() { return document.getElementById('voteCount'); },
    get releaseDate() { return document.getElementById('releaseDate'); },
    get runtime() { return document.getElementById('runtime'); },
    get censorshipInfo() { return document.getElementById('censorshipInfo'); },
    get genresList() { return document.getElementById('genresList'); },
    get movieOverview() { return document.getElementById('movieOverview'); },
    get director() { return document.getElementById('director'); },
    get productionCompanies() { return document.getElementById('productionCompanies'); },
    get castList() { return document.getElementById('castList'); },
    get ottPlatformsList() { return document.getElementById('ottPlatformsList'); },
    get budget() { return document.getElementById('budget'); },
    get revenue() { return document.getElementById('revenue'); },
    get homepageItem() { return document.getElementById('homepageItem'); },
    get homepageLink() { return document.getElementById('homepageLink'); },
    get imdbItem() { return document.getElementById('imdbItem'); },
    get imdbLink() { return document.getElementById('imdbLink'); },
    get favoriteBtn() { return document.getElementById('favoriteBtn'); },
    get watchlistBtn() { return document.getElementById('watchlistBtn'); }
};

// 영화 상세 정보 페이지 네임스페이스
const MovieDetail = {
    movieId: null,
    movieData: null,

    // URL에서 영화 ID 가져오기
    getMovieIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    },

    // 로딩 상태 표시
    showLoading() {
        MovieDetailDOM.loadingContainer.style.display = 'flex';
        MovieDetailDOM.errorContainer.style.display = 'none';
        MovieDetailDOM.movieDetailContainer.style.display = 'none';
    },

    // 에러 상태 표시
    showError(message) {
        MovieDetailDOM.loadingContainer.style.display = 'none';
        MovieDetailDOM.errorContainer.style.display = 'flex';
        MovieDetailDOM.movieDetailContainer.style.display = 'none';
        MovieDetailDOM.errorMessage.textContent = message || '알 수 없는 오류가 발생했습니다.';
    },

    // 영화 정보 표시
    showMovieDetails() {
        MovieDetailDOM.loadingContainer.style.display = 'none';
        MovieDetailDOM.errorContainer.style.display = 'none';
        MovieDetailDOM.movieDetailContainer.style.display = 'block';
    },

    // 영화 데이터 렌더링
    renderMovieDetails(movieData) {
        // 제목
        MovieDetailDOM.movieTitle.textContent = movieData.title;
        document.title = `${movieData.title} - GeekFlex`;

        // 태그라인
        if (movieData.tagline) {
            MovieDetailDOM.movieTagline.textContent = movieData.tagline;
            MovieDetailDOM.movieTagline.style.display = 'block';
        } else {
            MovieDetailDOM.movieTagline.style.display = 'none';
        }

        // 백드롭 이미지
        if (movieData.backdrop) {
            MovieDetailDOM.movieBackdrop.style.backgroundImage = `url(${movieData.backdrop})`;
        } else {
            MovieDetailDOM.movieBackdrop.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }

        // 포스터
        MovieDetailDOM.moviePoster.src = movieData.poster;
        MovieDetailDOM.moviePoster.alt = movieData.title;

        // 평점
        MovieDetailDOM.movieRating.textContent = movieData.rating;
        const stars = Math.floor(movieData.rating / 2);
        MovieDetailDOM.ratingStars.innerHTML = '★'.repeat(stars) + '☆'.repeat(5 - stars);

        // 투표 수
        MovieDetailDOM.voteCount.textContent = movieData.voteCount.toLocaleString();

        // 개봉일
        MovieDetailDOM.releaseDate.textContent = this.formatDate(movieData.releaseDate);

        // 상영시간
        if (movieData.runtime) {
            const hours = Math.floor(movieData.runtime / 60);
            const minutes = movieData.runtime % 60;
            MovieDetailDOM.runtime.textContent = hours > 0 
                ? `${hours}시간 ${minutes}분` 
                : `${minutes}분`;
        } else {
            MovieDetailDOM.runtime.textContent = '정보 없음';
        }

        // 관람등급
        MovieDetailDOM.censorshipInfo.textContent = movieData.censorshipInfo;

        // 장르
        MovieDetailDOM.genresList.innerHTML = '';
        movieData.genres.forEach(genre => {
            const genreTag = document.createElement('span');
            genreTag.className = 'genre-tag-large';
            genreTag.textContent = genre;
            MovieDetailDOM.genresList.appendChild(genreTag);
        });

        // 줄거리
        MovieDetailDOM.movieOverview.textContent = movieData.overview || '줄거리 정보가 없습니다.';

        // 감독
        MovieDetailDOM.director.textContent = movieData.director;

        // 제작사
        if (movieData.productionCompanies && movieData.productionCompanies.length > 0) {
            MovieDetailDOM.productionCompanies.textContent = movieData.productionCompanies.join(', ');
        } else {
            MovieDetailDOM.productionCompanies.textContent = '정보 없음';
        }

        // 출연진
        MovieDetailDOM.castList.innerHTML = '';
        movieData.cast.forEach(actor => {
            const castItem = document.createElement('div');
            castItem.className = 'cast-item';
            castItem.textContent = actor;
            MovieDetailDOM.castList.appendChild(castItem);
        });

        // OTT 플랫폼
        MovieDetailDOM.ottPlatformsList.innerHTML = '';
        movieData.ottPlatforms.forEach(platform => {
            const platformTag = document.createElement('div');
            platformTag.className = 'ott-platform-large';
            platformTag.innerHTML = `<i class="fas fa-tv"></i><span>${platform}</span>`;
            MovieDetailDOM.ottPlatformsList.appendChild(platformTag);
        });

        // 예산
        if (movieData.budget > 0) {
            MovieDetailDOM.budget.textContent = this.formatCurrency(movieData.budget);
        } else {
            MovieDetailDOM.budget.textContent = '정보 없음';
        }

        // 수익
        if (movieData.revenue > 0) {
            MovieDetailDOM.revenue.textContent = this.formatCurrency(movieData.revenue);
        } else {
            MovieDetailDOM.revenue.textContent = '정보 없음';
        }

        // 홈페이지
        if (movieData.homepage) {
            MovieDetailDOM.homepageLink.href = movieData.homepage;
            MovieDetailDOM.homepageLink.textContent = '공식 웹사이트 방문';
            MovieDetailDOM.homepageItem.style.display = 'block';
        } else {
            MovieDetailDOM.homepageItem.style.display = 'none';
        }

        // IMDb
        if (movieData.imdbId) {
            const imdbUrl = `https://www.imdb.com/title/${movieData.imdbId}`;
            MovieDetailDOM.imdbLink.href = imdbUrl;
            MovieDetailDOM.imdbLink.textContent = 'IMDb에서 보기';
            MovieDetailDOM.imdbItem.style.display = 'block';
        } else {
            MovieDetailDOM.imdbItem.style.display = 'none';
        }
    },

    // 날짜 포맷팅
    formatDate(dateString) {
        if (!dateString) return '정보 없음';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // 통화 포맷팅
    formatCurrency(amount) {
        if (amount >= 1000000000) {
            return `$${(amount / 1000000000).toFixed(1)}B`;
        } else if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`;
        }
        return `$${amount.toLocaleString()}`;
    },

    // 영화 정보 로드
    async loadMovieDetails() {
        this.movieId = this.getMovieIdFromURL();

        if (!this.movieId) {
            this.showError('영화 ID가 제공되지 않았습니다.');
            return;
        }

        this.showLoading();

        try {
            const movieData = await API.fetchMovieDetails(this.movieId);
            this.movieData = movieData;
            this.renderMovieDetails(movieData);
            this.showMovieDetails();
        } catch (error) {
            console.error('Error loading movie details:', error);
            this.showError('영화 정보를 불러오는 중 오류가 발생했습니다.');
        }
    },

    // 뒤로가기
    goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    },

    // 찜하기 토글
    toggleFavorite() {
        const isFavorite = MovieDetailDOM.favoriteBtn.classList.contains('active');
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const icon = MovieDetailDOM.favoriteBtn.querySelector('i');

        if (isFavorite) {
            // 제거
            const index = favorites.indexOf(this.movieId);
            if (index > -1) {
                favorites.splice(index, 1);
            }
            MovieDetailDOM.favoriteBtn.classList.remove('active');
            icon.classList.remove('fas', 'fa-heart');
            icon.classList.add('far', 'fa-heart');
        } else {
            // 추가
            favorites.push(this.movieId);
            MovieDetailDOM.favoriteBtn.classList.add('active');
            icon.classList.remove('far', 'fa-heart');
            icon.classList.add('fas', 'fa-heart');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    },

    // 보고싶어요 토글
    toggleWatchlist() {
        const isInWatchlist = MovieDetailDOM.watchlistBtn.classList.contains('active');
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');

        if (isInWatchlist) {
            // 제거
            const index = watchlist.indexOf(this.movieId);
            if (index > -1) {
                watchlist.splice(index, 1);
            }
            MovieDetailDOM.watchlistBtn.classList.remove('active');
        } else {
            // 추가
            watchlist.push(this.movieId);
            MovieDetailDOM.watchlistBtn.classList.add('active');
        }

        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    },

    // 초기화
    init() {
        // 뒤로가기 버튼
        if (MovieDetailDOM.backButton) {
            MovieDetailDOM.backButton.addEventListener('click', () => this.goBack());
        }

        // 재시도 버튼
        if (MovieDetailDOM.retryButton) {
            MovieDetailDOM.retryButton.addEventListener('click', () => this.loadMovieDetails());
        }

        // 찜하기 버튼
        if (MovieDetailDOM.favoriteBtn) {
            MovieDetailDOM.favoriteBtn.addEventListener('click', () => this.toggleFavorite());
            // 기존 찜하기 상태 확인
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            const icon = MovieDetailDOM.favoriteBtn.querySelector('i');
            if (favorites.includes(this.getMovieIdFromURL())) {
                MovieDetailDOM.favoriteBtn.classList.add('active');
                icon.classList.remove('far', 'fa-heart');
                icon.classList.add('fas', 'fa-heart');
            }
        }

        // 보고싶어요 버튼
        if (MovieDetailDOM.watchlistBtn) {
            MovieDetailDOM.watchlistBtn.addEventListener('click', () => this.toggleWatchlist());
            // 기존 보고싶어요 상태 확인
            const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
            if (watchlist.includes(this.getMovieIdFromURL())) {
                MovieDetailDOM.watchlistBtn.classList.add('active');
            }
        }

        // 영화 정보 로드
        this.loadMovieDetails();
    }
};

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    // HTML include가 완료될 때까지 대기
    setTimeout(() => {
        MovieDetail.init();
    }, 500);
});

