# Firstbank

개인 프로젝트 **Firstbank**의 프론트엔드 저장소입니다.

React 기반으로 개발되었으며, GitHub Pages를 통해 웹 서비스를 배포합니다.

## 🌐 Demo

- **Website:** https://viu310.github.io/firstbank/
- **Repository:** https://github.com/viu310/firstbank

## 🛠 Tech Stack

- React
- JavaScript (JSX)
- HTML5 / CSS3
- Material UI
- GitHub Pages
- GitHub Actions

## 📁 Project Structure

```text
firstbank/
├── .github/
│   └── workflows/
│       └── deploy.yml
│
└── front-end/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── ...
    ├── package.json
    └── package-lock.json
```

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/viu310/firstbank.git
```

### 2. Move to Front-end Directory

```bash
cd firstbank/front-end
```

### 3. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 4. Run Development Server

```bash
npm start
```

브라우저에서 아래 주소로 접속합니다.

http://localhost:3000

## 📦 Build

프로덕션 배포용 파일을 생성하려면 다음 명령어를 실행합니다.

```bash
npm run build
```

빌드 결과물은 `front-end/build` 디렉터리에 생성됩니다.

## 🚢 Deployment

GitHub Actions를 사용하여 GitHub Pages에 자동 배포합니다.

1. `main` 브랜치에 변경 사항 Push
2. GitHub Actions 자동 실행
3. React 프로젝트 빌드
4. 빌드 결과물을 GitHub Pages에 배포

### Deployment Workflow

- Workflow: `.github/workflows/deploy.yml`
- Build Directory: `front-end/build`
- Deployment Branch: `main`
- Hosting: GitHub Pages

## 🔗 Links

- [Live Website](https://viu310.github.io/firstbank/)
- [GitHub Repository](https://github.com/viu310/firstbank/)

---

© 2026 Firstbank. All rights reserved.