# 📸 Selfie PullAI

<p align="center">
  <strong>Create fun AI-generated selfies with your favorite celebrities!</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#api-setup">API Setup</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red.svg" alt="Made with Love">
  <img src="https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4.svg" alt="Powered by Gemini">
</p>

---

## ✨ Features

- 🎭 **Celebrity Templates** - Choose from various celebrity scene templates
- 📱 **Mobile-First Design** - Works seamlessly on all devices
- 📷 **Camera Capture** - Take photos directly in the app
- 🤖 **AI-Powered Generation** - Uses Google Gemini API for realistic composites
- 💾 **Local History** - Your creations are saved locally (IndexedDB)
- 🔒 **Privacy-First** - All processing happens client-side, no server storage
- ⚡ **Zero Dependencies** - Pure vanilla JavaScript (~60KB bundle)
- ♿ **Accessible** - WCAG 2.1 AA compliant

## 🎬 How It Works

1. **Select a celebrity template** - Browse the carousel of celebrity scenes
2. **Upload your photo** - Drag & drop, click to upload, or use your camera
3. **Preview side-by-side** - See your photo next to the template
4. **Generate with AI** - Click "Generate" to create your AI selfie!
5. **Download & Share** - Save your creation or share with friends

## 🚀 Quick Start

### Option 1: Use Directly (No Build Required!)

```bash
# Clone the repository
git clone https://github.com/chaitanyame/selfie-pullai.git
cd selfie-pullai

# Start a local server
npx http-server -p 3000

# Open in browser
open http://localhost:3000
```

### Option 2: Development Setup

```bash
# Clone and install
git clone https://github.com/chaitanyame/selfie-pullai.git
cd selfie-pullai
npm install

# Run tests
npm test

# Start development server
npm start
```

## 🔑 API Setup

This app uses the **Google Gemini API** for AI image generation.

### Get Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Click the 🔑 button in the app header
4. Paste your API key and save

> **Note:** Your API key is stored locally in your browser's localStorage and is never sent to any server other than Google's API.

### Supported Models

The app uses `gemini-2.0-flash-exp` which supports native image generation.

## 📁 Project Structure

```
selfie-pullai/
├── index.html              # Main HTML file
├── css/
│   └── style.css           # All styles (~15KB)
├── js/
│   ├── app.js              # Entry point
│   └── modules/
│       ├── store.js        # State management & templates
│       ├── ui.js           # DOM interactions
│       ├── canvas.js       # Canvas rendering
│       ├── processor.js    # Gemini API integration
│       └── db.js           # IndexedDB history
├── assets/
│   └── templates/          # Celebrity template images
├── tests/                  # Playwright tests (132 tests)
└── package.json
```

## 🧪 Testing

The project includes comprehensive Playwright tests:

```bash
# Run all tests (132 tests)
npm test

# Run with UI
npx playwright test --ui

# Run specific test file
npx playwright test tests/canvas.spec.ts

# Run with coverage report
npx playwright test --reporter=html
```

## 🤝 Contributing

We love contributions! Here's how you can help:

### Quick Contribution Guide

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open** a Pull Request

### Development Guidelines

- ✅ **No external dependencies** - Keep it vanilla JS
- ✅ **Mobile-first** - Test on mobile devices
- ✅ **Accessibility** - Maintain WCAG 2.1 AA compliance
- ✅ **Tests required** - All features need Playwright tests
- ✅ **Bundle size** - Keep under 150KB total

### Areas for Contribution

- 🎨 New celebrity templates
- 🌍 Internationalization (i18n)
- 🎭 New scene types
- 📱 PWA support
- 🧪 More test coverage
- 📖 Documentation improvements

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📋 Roadmap

- [ ] More celebrity templates
- [ ] Custom template upload
- [ ] Style presets (vintage, cartoon, anime, etc.)
- [ ] Social sharing integration
- [ ] PWA support for offline use
- [ ] Multi-language support
- [ ] Template editor

## 🔒 Privacy

Your privacy is important to us:

- **No server storage** - Images are never uploaded to our servers
- **Local processing** - All image handling happens in your browser
- **API key security** - Your Gemini API key stays in localStorage
- **No tracking** - No analytics or user tracking
- **No cookies** - We don't use cookies

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **AI**: Google Gemini API
- **Storage**: IndexedDB, LocalStorage
- **Testing**: Playwright
- **Build**: None required! (Zero build tooling)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - You are free to:
✅ Use commercially
✅ Modify
✅ Distribute
✅ Use privately
```

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for the image generation API
- [Playwright](https://playwright.dev/) for the excellent testing framework
- All our amazing [contributors](https://github.com/chaitanyame/selfie-pullai/graphs/contributors)

## 💬 Support

- 🐛 **Bug Reports**: [Open an issue](https://github.com/chaitanyame/selfie-pullai/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Open an issue](https://github.com/chaitanyame/selfie-pullai/issues/new?template=feature_request.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/chaitanyame/selfie-pullai/discussions)

---

<p align="center">
  Made with ❤️ by the Open Source Community
</p>

<p align="center">
  <a href="https://github.com/chaitanyame/selfie-pullai/stargazers">⭐ Star us on GitHub!</a>
</p>
