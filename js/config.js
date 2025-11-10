// 설정 및 상수
// CONFIG에서 페이지 설정, 검색 설정 등을 할 수 있다.
const CONFIG = {
  // TMDB API 설정
  TMDB_API_KEY: localStorage.getItem("tmdb_api_key") || "", // localStorage에서 API 키 읽기
  TMDB_BASE_URL: "https://api.themoviedb.org/3", // API 주소
  TMDB_IMAGE_BASE_URL: "https://image.tmdb.org/t/p/w500", // 이미지 주소

  // 페이지 설정
  MOVIES_PER_PAGE: 6,
  DEFAULT_VIEW: "grid", // 기본 뷰 (그리드) | 리스트

  // 검색 설정
  SEARCH_DEBOUNCE_DELAY: 500,
  MAX_SEARCH_HISTORY: 10,

  // 애니메이션 설정
  TRANSITION_DELAY: 100,
};

// 장르 ID 매핑 (TMDB 장르 ID를 한국어 이름으로 변환)
const GENRE_MAP = {
  28: "액션",
  12: "모험",
  16: "애니메이션",
  35: "코미디",
  80: "범죄",
  99: "다큐멘터리",
  18: "드라마",
  10751: "가족",
  14: "판타지",
  36: "역사",
  27: "공포",
  10402: "음악",
  9648: "미스터리",
  10749: "로맨스",
  878: "SF",
  10770: "TV 영화",
  53: "스릴러",
  10752: "전쟁",
  37: "서부",
};

// 전역 상태
// API 요청시 값을 담을 상태 객체
const STATE = {
  moviesData: [],
  filteredMovies: [],
  currentView: CONFIG.DEFAULT_VIEW,
  currentPage: 1,
  isLoading: false,
  searchHistory: JSON.parse(localStorage.getItem("searchHistory") || "[]"),
};
