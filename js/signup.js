// 회원가입 페이지 JavaScript

// DOM 요소들
const DOM = {
    signupForm: document.getElementById('signupForm'),
    userIdInput: document.getElementById('userId'),
    userNameInput: document.getElementById('userName'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    confirmPasswordInput: document.getElementById('confirmPassword'),
    passwordToggle: document.getElementById('passwordToggle'),
    confirmPasswordToggle: document.getElementById('confirmPasswordToggle'),
    signupBtn: document.getElementById('signupBtn'),
    profileImageInput: document.getElementById('profileImage'),
    filePreview: document.getElementById('filePreview'),
    previewImage: document.getElementById('previewImage'),
    removeImage: document.getElementById('removeImage'),
    bioTextarea: document.getElementById('bio'),
    bioCharCount: document.getElementById('bioCharCount'),
    termsAgreement: document.getElementById('termsAgreement'),
    marketingAgreement: document.getElementById('marketingAgreement'),
    // 에러 메시지 요소들
    userIdError: document.getElementById('userIdError'),
    userNameError: document.getElementById('userNameError'),
    emailError: document.getElementById('emailError'),
    passwordError: document.getElementById('passwordError'),
    confirmPasswordError: document.getElementById('confirmPasswordError'),
    profileImageError: document.getElementById('profileImageError'),
    bioError: document.getElementById('bioError'),
    termsAgreementError: document.getElementById('termsAgreementError'),
    signupError: document.getElementById('signupError')
};

// 회원가입 상태 관리
const SignupState = {
    isSubmitting: false,
    isPasswordVisible: false,
    isConfirmPasswordVisible: false,
    selectedImage: null
};

// 유효성 검사 함수들
const Validation = {
    // 아이디 유효성 검사 (영문, 숫자 4-20자)
    validateUserId(userId) {
        const userIdRegex = /^[a-zA-Z0-9]{4,20}$/;
        return userIdRegex.test(userId);
    },

    // 이메일 유효성 검사
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // 비밀번호 유효성 검사 (8자 이상, 영문, 숫자, 특수문자 포함)
    validatePassword(password) {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return passwordRegex.test(password);
    },

    // 닉네임 유효성 검사 (2-20자)
    validateUserName(userName) {
        return userName.length >= 2 && userName.length <= 20;
    },

    // 자기소개 유효성 검사 (최대 300자)
    validateBio(bio) {
        return bio.length <= 300;
    }
};

// 에러 메시지 표시
function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.parentElement.classList.add('error');
}

// 에러 메시지 숨기기
function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
    element.parentElement.classList.remove('error');
}

// 모든 에러 메시지 숨기기
function hideAllErrors() {
    Object.values(DOM).forEach(element => {
        if (element && element.id && element.id.includes('Error')) {
            hideError(element);
        }
    });
}

// 폼 유효성 검사
function validateForm() {
    let isValid = true;
    
    const userId = DOM.userIdInput.value.trim();
    const userName = DOM.userNameInput.value.trim();
    const email = DOM.emailInput.value.trim();
    const password = DOM.passwordInput.value;
    const confirmPassword = DOM.confirmPasswordInput.value;
    const bio = DOM.bioTextarea.value.trim();
    const termsAgreed = DOM.termsAgreement.checked;

    // 아이디 검사
    if (!userId) {
        showError(DOM.userIdError, '아이디를 입력해주세요.');
        isValid = false;
    } else if (!Validation.validateUserId(userId)) {
        showError(DOM.userIdError, '아이디는 영문, 숫자 4-20자여야 합니다.');
        isValid = false;
    } else {
        hideError(DOM.userIdError);
    }

    // 닉네임 검사
    if (!userName) {
        showError(DOM.userNameError, '닉네임을 입력해주세요.');
        isValid = false;
    } else if (!Validation.validateUserName(userName)) {
        showError(DOM.userNameError, '닉네임은 2-20자여야 합니다.');
        isValid = false;
    } else {
        hideError(DOM.userNameError);
    }

    // 이메일 검사
    if (!email) {
        showError(DOM.emailError, '이메일을 입력해주세요.');
        isValid = false;
    } else if (!Validation.validateEmail(email)) {
        showError(DOM.emailError, '올바른 이메일 형식을 입력해주세요.');
        isValid = false;
    } else {
        hideError(DOM.emailError);
    }

    // 비밀번호 검사
    if (!password) {
        showError(DOM.passwordError, '비밀번호를 입력해주세요.');
        isValid = false;
    } else if (!Validation.validatePassword(password)) {
        showError(DOM.passwordError, '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.');
        isValid = false;
    } else {
        hideError(DOM.passwordError);
    }

    // 비밀번호 확인 검사
    if (!confirmPassword) {
        showError(DOM.confirmPasswordError, '비밀번호 확인을 입력해주세요.');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError(DOM.confirmPasswordError, '비밀번호가 일치하지 않습니다.');
        isValid = false;
    } else {
        hideError(DOM.confirmPasswordError);
    }

    // 자기소개 검사
    if (bio && !Validation.validateBio(bio)) {
        showError(DOM.bioError, '자기소개는 300자 이하여야 합니다.');
        isValid = false;
    } else {
        hideError(DOM.bioError);
    }

    // 약관 동의 검사
    if (!termsAgreed) {
        showError(DOM.termsAgreementError, '이용약관 및 개인정보처리방침에 동의해주세요.');
        isValid = false;
    } else {
        hideError(DOM.termsAgreementError);
    }

    return isValid;
}

// 로딩 상태 설정
function setLoadingState(isLoading) {
    SignupState.isSubmitting = isLoading;
    DOM.signupBtn.disabled = isLoading;
    
    if (isLoading) {
        DOM.signupBtn.classList.add('loading');
        DOM.signupBtn.querySelector('.btn-text').style.display = 'none';
        DOM.signupBtn.querySelector('.btn-loading').style.display = 'flex';
    } else {
        DOM.signupBtn.classList.remove('loading');
        DOM.signupBtn.querySelector('.btn-text').style.display = 'block';
        DOM.signupBtn.querySelector('.btn-loading').style.display = 'none';
    }
}

// 회원가입 API 호출 (실제 구현에서는 서버와 통신)
async function signupUser(formData) {
    // 시뮬레이션을 위한 지연
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 실제 구현에서는 서버 API를 호출
    // const response = await fetch('/api/signup', {
    //     method: 'POST',
    //     body: formData
    // });
    
    // 임시 회원가입 로직 (실제로는 서버에서 처리)
    const userId = formData.get('userId');
    const email = formData.get('email');
    
    // 중복 체크 시뮬레이션
    const existingUsers = ['admin', 'user', 'test'];
    if (existingUsers.includes(userId)) {
        return { success: false, message: '이미 사용 중인 아이디입니다.' };
    }
    
    const existingEmails = ['admin@geekflex.com', 'user@geekflex.com', 'test@geekflex.com'];
    if (existingEmails.includes(email)) {
        return { success: false, message: '이미 사용 중인 이메일입니다.' };
    }
    
    return { success: true, message: '회원가입이 완료되었습니다.' };
}

// 회원가입 처리
async function handleSignup(event) {
    event.preventDefault();
    
    if (SignupState.isSubmitting) return;
    
    hideAllErrors();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = new FormData(DOM.signupForm);
    
    setLoadingState(true);
    
    try {
        const result = await signupUser(formData);
        
        if (result.success) {
            // 회원가입 성공
            DOM.signupBtn.classList.add('success');
            DOM.signupBtn.querySelector('.btn-text').textContent = '가입 완료!';
            
            // 성공 메시지 표시
            showSuccessMessage(result.message);
            
            // 로그인 페이지로 리다이렉트
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } else {
            // 회원가입 실패
            showError(DOM.signupError, result.message);
            setLoadingState(false);
        }
        
    } catch (error) {
        console.error('회원가입 오류:', error);
        showError(DOM.signupError, '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        setLoadingState(false);
    }
}

// 성공 메시지 표시
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-success);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: 0 4px 12px var(--shadow-primary);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

// 비밀번호 표시/숨기기 토글
function togglePasswordVisibility() {
    SignupState.isPasswordVisible = !SignupState.isPasswordVisible;
    
    if (SignupState.isPasswordVisible) {
        DOM.passwordInput.type = 'text';
        DOM.passwordToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        DOM.passwordInput.type = 'password';
        DOM.passwordToggle.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// 비밀번호 확인 표시/숨기기 토글
function toggleConfirmPasswordVisibility() {
    SignupState.isConfirmPasswordVisible = !SignupState.isConfirmPasswordVisible;
    
    if (SignupState.isConfirmPasswordVisible) {
        DOM.confirmPasswordInput.type = 'text';
        DOM.confirmPasswordToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        DOM.confirmPasswordInput.type = 'password';
        DOM.confirmPasswordToggle.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// 프로필 이미지 미리보기
function handleImagePreview(event) {
    const file = event.target.files[0];
    
    if (file) {
        // 파일 크기 검사 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
            showError(DOM.profileImageError, '파일 크기는 5MB 이하여야 합니다.');
            DOM.profileImageInput.value = '';
            return;
        }
        
        // 파일 타입 검사
        if (!file.type.startsWith('image/')) {
            showError(DOM.profileImageError, '이미지 파일만 업로드 가능합니다.');
            DOM.profileImageInput.value = '';
            return;
        }
        
        hideError(DOM.profileImageError);
        
        const reader = new FileReader();
        reader.onload = function(e) {
            DOM.previewImage.src = e.target.result;
            DOM.filePreview.style.display = 'block';
            SignupState.selectedImage = file;
        };
        reader.readAsDataURL(file);
    }
}

// 이미지 제거
function removeImage() {
    DOM.profileImageInput.value = '';
    DOM.filePreview.style.display = 'none';
    DOM.previewImage.src = '';
    SignupState.selectedImage = null;
    hideError(DOM.profileImageError);
}

// 자기소개 글자 수 카운터
function updateBioCharCount() {
    const bio = DOM.bioTextarea.value;
    DOM.bioCharCount.textContent = bio.length;
    
    if (bio.length > 300) {
        DOM.bioCharCount.style.color = 'var(--color-error)';
    } else {
        DOM.bioCharCount.style.color = 'var(--text-muted)';
    }
}

// 입력 필드 실시간 유효성 검사
function setupRealTimeValidation() {
    // 아이디 실시간 검사
    DOM.userIdInput.addEventListener('input', function() {
        const userId = this.value.trim();
        if (userId && !Validation.validateUserId(userId)) {
            showError(DOM.userIdError, '아이디는 영문, 숫자 4-20자여야 합니다.');
        } else {
            hideError(DOM.userIdError);
        }
    });
    
    // 닉네임 실시간 검사
    DOM.userNameInput.addEventListener('input', function() {
        const userName = this.value.trim();
        if (userName && !Validation.validateUserName(userName)) {
            showError(DOM.userNameError, '닉네임은 2-20자여야 합니다.');
        } else {
            hideError(DOM.userNameError);
        }
    });
    
    // 이메일 실시간 검사
    DOM.emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        if (email && !Validation.validateEmail(email)) {
            showError(DOM.emailError, '올바른 이메일 형식을 입력해주세요.');
        } else {
            hideError(DOM.emailError);
        }
    });
    
    // 비밀번호 실시간 검사
    DOM.passwordInput.addEventListener('input', function() {
        const password = this.value;
        if (password && !Validation.validatePassword(password)) {
            showError(DOM.passwordError, '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.');
        } else {
            hideError(DOM.passwordError);
        }
    });
    
    // 비밀번호 확인 실시간 검사
    DOM.confirmPasswordInput.addEventListener('input', function() {
        const confirmPassword = this.value;
        const password = DOM.passwordInput.value;
        if (confirmPassword && password !== confirmPassword) {
            showError(DOM.confirmPasswordError, '비밀번호가 일치하지 않습니다.');
        } else {
            hideError(DOM.confirmPasswordError);
        }
    });
    
    // 자기소개 실시간 검사
    DOM.bioTextarea.addEventListener('input', function() {
        const bio = this.value;
        updateBioCharCount();
        if (bio && !Validation.validateBio(bio)) {
            showError(DOM.bioError, '자기소개는 300자 이하여야 합니다.');
        } else {
            hideError(DOM.bioError);
        }
    });
}

// 키보드 이벤트 처리
function setupKeyboardEvents() {
    document.addEventListener('keydown', function(event) {
        // Enter 키로 회원가입
        if (event.key === 'Enter' && !SignupState.isSubmitting) {
            if (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA') {
                DOM.signupForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape 키로 에러 메시지 숨기기
        if (event.key === 'Escape') {
            hideAllErrors();
        }
    });
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 폼 제출
    DOM.signupForm.addEventListener('submit', handleSignup);
    
    // 비밀번호 토글
    DOM.passwordToggle.addEventListener('click', togglePasswordVisibility);
    DOM.confirmPasswordToggle.addEventListener('click', toggleConfirmPasswordVisibility);
    
    // 프로필 이미지 업로드
    DOM.profileImageInput.addEventListener('change', handleImagePreview);
    DOM.removeImage.addEventListener('click', removeImage);
    
    // 자기소개 글자 수 카운터
    DOM.bioTextarea.addEventListener('input', updateBioCharCount);
    
    // 실시간 유효성 검사
    setupRealTimeValidation();
    
    // 키보드 이벤트
    setupKeyboardEvents();
}

// 페이지 초기화
function initializeSignupPage() {
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 첫 번째 입력 필드에 포커스
    DOM.userIdInput.focus();
    
    // 초기 글자 수 카운터 설정
    updateBioCharCount();
    
    console.log('회원가입 페이지가 초기화되었습니다.');
}

// DOM이 로드되면 초기화
document.addEventListener('DOMContentLoaded', initializeSignupPage);

// 전역 네임스페이스에 추가
window.Signup = {
    handleSignup,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleImagePreview,
    removeImage,
    validateForm,
    showError,
    hideError,
    hideAllErrors
};
