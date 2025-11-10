# GeekFlex 로그인 가이드

---

## 로그인 페이지 접속

1. 브라우저에서 `login.html` 파일을 열거나
2. 메인 페이지(`index.html`)에서 헤더의 **로그인 버튼** 클릭

---

## 🔑 테스트 계정 (현재 사용 가능)

| 이메일               | 비밀번호      | 설명        |
| -------------------- | ------------- | ----------- |
| `admin@geekflex.com` | `password123` | 관리자 계정 |

---

- ✅ 체크: localStorage에 저장 (영구 로그인)
- ❌ 미체크: sessionStorage에 저장 (브라우저 종료 시 로그아웃)

**로그인 버튼 클릭**

- 또는 입력 필드에서 `Enter` 키 입력
- 로딩 중 표시 (약 2초)
- 성공 시 메인 페이지로 자동 이동

### 소셜 로그인 (현재 미구현)

---

## 회원가입

1. **회원가입 버튼** 클릭
2. 또는 **"계정이 없으신가요? 회원가입하기"** 링크 클릭
3. `signup.html` 페이지로 이동

---

## 로그인 정보 저장 위치

### localStorage (로그인 상태 유지 체크 시)

- 브라우저에 영구 저장
- 브라우저를 닫아도 로그인 상태 유지
- 수동으로 삭제하거나 브라우저 데이터 삭제 시까지 유지

### sessionStorage (로그인 상태 유지 미체크 시)

- 브라우저 탭 세션 동안만 유지
- 브라우저 탭을 닫으면 자동 삭제
- 24시간 후 자동 로그아웃

---

## 로그아웃

1. 헤더의 **사용자 메뉴** 클릭
2. **로그아웃** 링크 클릭
3. 로그인 정보가 삭제되고 페이지가 새로고침

---

## 참고사항

### 테스트 계정 추가 방법

`js/login.js` 파일의 `validCredentials` 객체에 계정 정보를 추가하면 됩니다:

```javascript
const validCredentials = {
  "admin@geekflex.com": "password123",
  "user@geekflex.com": "user123",
  "test@geekflex.com": "test123",
  "newuser@geekflex.com": "newpassword123", // 새 계정 추가
};
```

### 로그인 정보 확인

```javascript
// 콘솔에서 확인
console.log("localStorage:", localStorage.getItem("userData"));
console.log("sessionStorage:", sessionStorage.getItem("userData"));
```
