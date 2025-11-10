// TMDB API 관련 함수들

// API 네임스페이스
const API = {
  // 현재 상영중인 영화 데이터 가져오기
  async fetchNowPlayingMovies() {
    if (STATE.isLoading) return;

    STATE.isLoading = true;
    UI.showLoading();

    try {
      const response = await fetch(
        `${CONFIG.TMDB_BASE_URL}/movie/now_playing?language=ko&page=1&api_key=${CONFIG.TMDB_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // TMDB 데이터를 우리 형식으로 변환
      STATE.moviesData = data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview || "줄거리가 없습니다.",
        poster: movie.poster_path
          ? `${CONFIG.TMDB_IMAGE_BASE_URL}${movie.poster_path}`
          : "https://via.placeholder.com/300x400/333/fff?text=No+Image",
        rating: Math.round(movie.vote_average * 10) / 10,
        releaseDate: movie.release_date,
        genres: movie.genre_ids.map((id) => GENRE_MAP[id] || "기타"),
        ottPlatforms: API.getRandomOTTPlatforms(),
        censorshipInfo: API.getCensorshipInfo(movie.vote_average, movie.adult),
        director: "감독 정보 없음",
        cast: ["출연진 정보 없음"],
      }));

      STATE.filteredMovies = [...STATE.moviesData];
      UI.hideLoading();
      UI.renderMovies();
      UI.updatePagination();
    } catch (error) {
      console.error("Error fetching movies:", error);
      UI.hideLoading();
      UI.showError("영화 데이터를 불러오는데 실패했습니다.");
    } finally {
      STATE.isLoading = false;
    }
  },

  // 카테고리 변경 처리
  async handleCategoryChange(category) {
    UI.showLoading();

    try {
      let apiUrl = "";

      switch (category) {
        case "now_playing":
          apiUrl = `${CONFIG.TMDB_BASE_URL}/movie/now_playing?language=ko&page=1&api_key=${CONFIG.TMDB_API_KEY}`;
          break;
        case "popular":
          apiUrl = `${CONFIG.TMDB_BASE_URL}/movie/popular?language=ko&page=1&api_key=${CONFIG.TMDB_API_KEY}`;
          break;
        case "animation":
          apiUrl = `${CONFIG.TMDB_BASE_URL}/discover/movie?language=ko&page=1&with_genres=16&api_key=${CONFIG.TMDB_API_KEY}`;
          break;
        case "drama":
          apiUrl = `${CONFIG.TMDB_BASE_URL}/discover/movie?language=ko&page=1&with_genres=18&api_key=${CONFIG.TMDB_API_KEY}`;
          break;
        default:
          apiUrl = `${CONFIG.TMDB_BASE_URL}/movie/now_playing?language=ko&page=1&api_key=${CONFIG.TMDB_API_KEY}`;
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // TMDB 데이터를 우리 형식으로 변환
      STATE.moviesData = data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview || "줄거리가 없습니다.",
        poster: movie.poster_path
          ? `${CONFIG.TMDB_IMAGE_BASE_URL}${movie.poster_path}`
          : "https://via.placeholder.com/300x400/333/fff?text=No+Image",
        rating: Math.round(movie.vote_average * 10) / 10,
        releaseDate: movie.release_date,
        genres: movie.genre_ids.map((id) => GENRE_MAP[id] || "기타"),
        ottPlatforms: API.getRandomOTTPlatforms(),
        censorshipInfo: API.getCensorshipInfo(movie.vote_average, movie.adult),
        director: "감독 정보 없음",
        cast: ["출연진 정보 없음"],
      }));

      STATE.filteredMovies = [...STATE.moviesData];
      STATE.currentPage = 1;
      UI.renderMovies();
      UI.updatePagination();
    } catch (error) {
      console.error("Error fetching movies:", error);
      UI.showError("영화 데이터를 불러오는데 실패했습니다.");
    }
  },

  // TMDB API를 사용한 영화 검색 (한글 검색 지원)
  async searchMovies(query) {
    if (!query.trim()) return;

    const searchResults = document.getElementById("searchResults");
    if (!searchResults) return;

    // 검색어를 히스토리에 추가
    Search.addToSearchHistory(query);

    try {
      // 로딩 표시
      searchResults.innerHTML = '<div class="search-loading">검색 중...</div>';

      // 한글 검색을 위한 URL 파라미터 구성
      // language=ko: 한국어 결과 반환
      // region=KR: 한국 지역 결과 우선
      // include_adult=false: 성인 콘텐츠 제외
      const encodedQuery = encodeURIComponent(query.trim());
      const searchUrl = `${CONFIG.TMDB_BASE_URL}/search/movie?api_key=${CONFIG.TMDB_API_KEY}&language=ko&region=KR&include_adult=false&query=${encodedQuery}&page=1`;

      const response = await fetch(searchUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // 검색 결과를 우리 형식으로 변환
        const searchResultsData = data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          overview: movie.overview || "줄거리가 없습니다.",
          poster: movie.poster_path
            ? `${CONFIG.TMDB_IMAGE_BASE_URL}${movie.poster_path}`
            : "https://via.placeholder.com/300x400/333/fff?text=No+Image",
          rating: Math.round(movie.vote_average * 10) / 10,
          releaseDate: movie.release_date,
          genres: movie.genre_ids.map((id) => GENRE_MAP[id] || "기타"),
          ottPlatforms: API.getRandomOTTPlatforms(),
          censorshipInfo: API.getCensorshipInfo(
            movie.vote_average,
            movie.adult
          ),
          director: "감독 정보 없음",
          cast: ["출연진 정보 없음"],
        }));

        Search.displaySearchResults(searchResultsData);
      } else {
        searchResults.innerHTML =
          '<div class="search-no-results">검색 결과가 없습니다.<br><small>다른 검색어로 시도해보세요.</small></div>';
      }
    } catch (error) {
      console.error("Error searching movies:", error);
      searchResults.innerHTML =
        '<div class="search-error">검색 중 오류가 발생했습니다.<br><small>잠시 후 다시 시도해주세요.</small></div>';
    }
  },

  // 랜덤 OTT 플랫폼 생성
  getRandomOTTPlatforms() {
    const platforms = [
      "Netflix",
      "왓챠",
      "디즈니+",
      "티빙",
      "쿠팡플레이",
      "웨이브",
    ];
    const count = Math.floor(Math.random() * 3) + 1; // 1-3개
    return platforms.sort(() => 0.5 - Math.random()).slice(0, count);
  },

  // 검열 정보 생성
  getCensorshipInfo(rating, adult) {
    if (adult) return "18세 관람가";
    if (rating >= 8.0) return "12세 관람가";
    if (rating >= 6.0) return "15세 관람가";
    return "전체 관람가";
  },

  // 영화 상세 정보 가져오기 (감독, 출연진 포함)
  async fetchMovieDetails(movieId) {
    try {
      // 병렬로 영화 상세 정보와 출연진 정보 가져오기
      const [movieResponse, creditsResponse] = await Promise.all([
        fetch(
          `${CONFIG.TMDB_BASE_URL}/movie/${movieId}?api_key=${CONFIG.TMDB_API_KEY}&language=ko`
        ),
        fetch(
          `${CONFIG.TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${CONFIG.TMDB_API_KEY}&language=ko`
        ),
      ]);

      if (!movieResponse.ok || !creditsResponse.ok) {
        throw new Error(`HTTP error! status: ${movieResponse.status}`);
      }

      const movieData = await movieResponse.json();
      const creditsData = await creditsResponse.json();

      // 감독 찾기
      const director = creditsData.crew.find(
        (person) => person.job === "Director"
      );

      // 주연 배우 (상위 10명)
      const cast = creditsData.cast.slice(0, 10).map((actor) => actor.name);

      // 데이터 변환
      const movieDetails = {
        id: movieData.id,
        title: movieData.title,
        originalTitle: movieData.original_title,
        overview: movieData.overview || "줄거리가 없습니다.",
        poster: movieData.poster_path
          ? `${CONFIG.TMDB_IMAGE_BASE_URL}${movieData.poster_path}`
          : "https://via.placeholder.com/300x400/333/fff?text=No+Image",
        backdrop: movieData.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
          : null,
        rating: Math.round(movieData.vote_average * 10) / 10,
        voteCount: movieData.vote_count,
        releaseDate: movieData.release_date,
        runtime: movieData.runtime, // 분 단위
        genres: movieData.genres.map((genre) => genre.name),
        director: director ? director.name : "감독 정보 없음",
        cast: cast.length > 0 ? cast : ["출연진 정보 없음"],
        productionCompanies: movieData.production_companies.map(
          (company) => company.name
        ),
        budget: movieData.budget,
        revenue: movieData.revenue,
        tagline: movieData.tagline,
        homepage: movieData.homepage,
        imdbId: movieData.imdb_id,
        ottPlatforms: API.getRandomOTTPlatforms(),
        censorshipInfo: API.getCensorshipInfo(
          movieData.vote_average,
          movieData.adult
        ),
      };

      return movieDetails;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    }
  },
};
