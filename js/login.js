// 로그인 페이지 JavaScript

// DOM 요소들
const DOM = {
  loginForm: document.getElementById("loginForm"),
  emailInput: document.getElementById("email"),
  passwordInput: document.getElementById("password"),
  passwordToggle: document.getElementById("passwordToggle"),
  loginBtn: document.getElementById("loginBtn"),
  rememberMe: document.getElementById("rememberMe"),
  forgotPassword: document.getElementById("forgotPassword"),
  googleLogin: document.getElementById("googleLogin"),
  kakaoLogin: document.getElementById("kakaoLogin"),
  signupBtn: document.getElementById("signupBtn"),
  emailError: document.getElementById("emailError"),
  passwordError: document.getElementById("passwordError"),
  loginError: document.getElementById("loginError"),
};

// 로그인 상태 관리
const LoginState = {
  isSubmitting: false,
  isPasswordVisible: false,
};

// 이메일 유효성 검사
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 비밀번호 유효성 검사
function validatePassword(password) {
  return password.length >= 6;
}

// 에러 메시지 표시
function showError(element, message) {
  element.textContent = message;
  element.style.display = "block";
  element.parentElement.classList.add("error");
}

// 에러 메시지 숨기기
function hideError(element) {
  element.textContent = "";
  element.style.display = "none";
  element.parentElement.classList.remove("error");
}

// 모든 에러 메시지 숨기기
function hideAllErrors() {
  hideError(DOM.emailError);
  hideError(DOM.passwordError);
  hideError(DOM.loginError);
}

// 폼 유효성 검사
function validateForm() {
  let isValid = true;
  const email = DOM.emailInput.value.trim();
  const password = DOM.passwordInput.value;

  // 이메일 검사
  if (!email) {
    showError(DOM.emailError, "이메일을 입력해주세요.");
    isValid = false;
  } else if (!validateEmail(email)) {
    showError(DOM.emailError, "올바른 이메일 형식을 입력해주세요.");
    isValid = false;
  } else {
    hideError(DOM.emailError);
  }

  // 비밀번호 검사
  if (!password) {
    showError(DOM.passwordError, "비밀번호를 입력해주세요.");
    isValid = false;
  } else if (!validatePassword(password)) {
    showError(DOM.passwordError, "비밀번호는 6자 이상이어야 합니다.");
    isValid = false;
  } else {
    hideError(DOM.passwordError);
  }

  return isValid;
}

// 로딩 상태 설정
function setLoadingState(isLoading) {
  LoginState.isSubmitting = isLoading;
  DOM.loginBtn.disabled = isLoading;

  if (isLoading) {
    DOM.loginBtn.classList.add("loading");
    DOM.loginBtn.querySelector(".btn-text").style.display = "none";
    DOM.loginBtn.querySelector(".btn-loading").style.display = "flex";
  } else {
    DOM.loginBtn.classList.remove("loading");
    DOM.loginBtn.querySelector(".btn-text").style.display = "block";
    DOM.loginBtn.querySelector(".btn-loading").style.display = "none";
  }
}

// 로그인 API 호출 (실제 구현에서는 서버와 통신)
async function loginUser(email, password, rememberMe) {
  // 시뮬레이션을 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 실제 구현에서는 서버 API를 호출
  // const response = await fetch('/api/login', {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ email, password, rememberMe })
  // });

  // 임시 로그인 로직 (실제로는 서버에서 검증)
  const validCredentials = {
    "admin@geekflex.com": "password123",
  };

  if (validCredentials[email] === password) {
    return { success: true, user: { email, name: "사용자" } };
  } else {
    return {
      success: false,
      message: "이메일 또는 비밀번호가 올바르지 않습니다.",
    };
  }
}

// 로그인 처리
async function handleLogin(event) {
  event.preventDefault();

  if (LoginState.isSubmitting) return;

  hideAllErrors();

  if (!validateForm()) {
    return;
  }

  const email = DOM.emailInput.value.trim();
  const password = DOM.passwordInput.value;
  const rememberMe = DOM.rememberMe.checked;

  setLoadingState(true);

  try {
    const result = await loginUser(email, password, rememberMe);

    if (result.success) {
      // 로그인 성공
      DOM.loginBtn.classList.add("success");
      DOM.loginBtn.querySelector(".btn-text").textContent = "로그인 성공!";

      // 사용자 정보 저장
      const userData = {
        email: result.user.email,
        name: result.user.name,
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe,
      };

      if (rememberMe) {
        localStorage.setItem("userData", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("userData", JSON.stringify(userData));
      }

      // 메인 페이지로 리다이렉트
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      // 로그인 실패
      showError(DOM.loginError, result.message);
      setLoadingState(false);
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    showError(
      DOM.loginError,
      "로그인 중 오류가 발생했습니다. 다시 시도해주세요."
    );
    setLoadingState(false);
  }
}

// 비밀번호 표시/숨기기 토글
function togglePasswordVisibility() {
  LoginState.isPasswordVisible = !LoginState.isPasswordVisible;

  if (LoginState.isPasswordVisible) {
    DOM.passwordInput.type = "text";
    DOM.passwordToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
  } else {
    DOM.passwordInput.type = "password";
    DOM.passwordToggle.innerHTML = '<i class="fas fa-eye"></i>';
  }
}

// 비밀번호 찾기 처리
function handleForgotPassword(event) {
  event.preventDefault();

  const email = DOM.emailInput.value.trim();

  if (!email) {
    alert("이메일을 먼저 입력해주세요.");
    DOM.emailInput.focus();
    return;
  }

  if (!validateEmail(email)) {
    alert("올바른 이메일 형식을 입력해주세요.");
    DOM.emailInput.focus();
    return;
  }

  // 실제 구현에서는 비밀번호 재설정 이메일 발송
  alert(`비밀번호 재설정 링크를 ${email}로 발송했습니다.`);
}

// Google 로그인 처리
function handleGoogleLogin() {
  // 실제 구현에서는 Google OAuth API 사용
  alert("Google 로그인 기능은 준비 중입니다.");
}

// Kakao 로그인 처리
function handleKakaoLogin() {
  // 실제 구현에서는 Kakao OAuth API 사용
  alert("Kakao 로그인 기능은 준비 중입니다.");
}

// 회원가입 버튼 처리
function handleSignup() {
  window.location.href = "signup.html";
}

// 입력 필드 실시간 유효성 검사
function setupRealTimeValidation() {
  // 이메일 실시간 검사
  DOM.emailInput.addEventListener("input", function () {
    const email = this.value.trim();
    if (email && !validateEmail(email)) {
      showError(DOM.emailError, "올바른 이메일 형식을 입력해주세요.");
    } else {
      hideError(DOM.emailError);
    }
  });

  // 비밀번호 실시간 검사
  DOM.passwordInput.addEventListener("input", function () {
    const password = this.value;
    if (password && !validatePassword(password)) {
      showError(DOM.passwordError, "비밀번호는 6자 이상이어야 합니다.");
    } else {
      hideError(DOM.passwordError);
    }
  });
}

// 키보드 이벤트 처리
function setupKeyboardEvents() {
  document.addEventListener("keydown", function (event) {
    // Enter 키로 로그인
    if (event.key === "Enter" && !LoginState.isSubmitting) {
      if (
        document.activeElement === DOM.emailInput ||
        document.activeElement === DOM.passwordInput
      ) {
        DOM.loginForm.dispatchEvent(new Event("submit"));
      }
    }

    // Escape 키로 에러 메시지 숨기기
    if (event.key === "Escape") {
      hideAllErrors();
    }
  });
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 폼 제출
  DOM.loginForm.addEventListener("submit", handleLogin);

  // 비밀번호 토글
  DOM.passwordToggle.addEventListener("click", togglePasswordVisibility);

  // 비밀번호 찾기
  DOM.forgotPassword.addEventListener("click", handleForgotPassword);

  // 소셜 로그인
  DOM.googleLogin.addEventListener("click", handleGoogleLogin);
  DOM.kakaoLogin.addEventListener("click", handleKakaoLogin);

  // 회원가입 버튼
  DOM.signupBtn.addEventListener("click", handleSignup);

  // 실시간 유효성 검사
  setupRealTimeValidation();

  // 키보드 이벤트
  setupKeyboardEvents();
}

// 로그인 상태 확인
function checkLoginStatus() {
  const userData =
    localStorage.getItem("userData") || sessionStorage.getItem("userData");

  if (userData) {
    try {
      const user = JSON.parse(userData);
      const loginTime = new Date(user.loginTime);
      const now = new Date();
      const timeDiff = now - loginTime;

      // 24시간 후 자동 로그아웃 (rememberMe가 false인 경우)
      if (!user.rememberMe && timeDiff > 24 * 60 * 60 * 1000) {
        localStorage.removeItem("userData");
        sessionStorage.removeItem("userData");
        return;
      }

      // 이미 로그인된 경우 메인 페이지로 리다이렉트
      window.location.href = "index.html";
    } catch (error) {
      console.error("사용자 데이터 파싱 오류:", error);
      localStorage.removeItem("userData");
      sessionStorage.removeItem("userData");
    }
  }
}

// 페이지 초기화
function initializeLoginPage() {
  // 로그인 상태 확인
  checkLoginStatus();

  // 이벤트 리스너 설정
  setupEventListeners();

  // 첫 번째 입력 필드에 포커스
  DOM.emailInput.focus();

  console.log("로그인 페이지가 초기화되었습니다.");
}

// DOM이 로드되면 초기화
document.addEventListener("DOMContentLoaded", initializeLoginPage);

// 디버깅용: 필요시 콘솔에서 접근 가능
// window.Login 네임스페이스는 사용되지 않으므로 제거
