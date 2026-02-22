// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const navLinks = document.querySelectorAll('.nav-link');
const livePriceElement = document.getElementById('livePrice');
const priceChangeElement = document.getElementById('priceChange');
const particlesContainer = document.querySelector('.particles-container');
const floatingShapes = document.querySelector('.floating-shapes');

// Contract Address: CY1P83KnKwFYostvjQcoR2HJLyEJWRBRaVQmYyyD3cR8
const CONTRACT_ADDRESS = 'CY1P83KnKwFYostvjQcoR2HJLyEJWRBRaVQmYyyD3cR8';

// Translation System - UPDATED WITH MEME WALL
const translations = {
    en: {
        // Navigation
        'nav.title': 'SUOLALA',
        'nav.home': 'Home',
        'nav.token': 'Token',
        'nav.news': 'News',
        'nav.nfts': 'NFTs',
        'nav.roadmap': 'Roadmap',
        'nav.memes': 'Meme Wall',
        
        // Hero Section
        'hero.solana': 'SOLANA',
        'hero.title2': 'We Build, We Rise',
        'hero.subtitle': 'The premier Chinese ticker on Solana, inspired by Lily Liu\'s tweet and born as an original IP that captures the resilient spirit of Solana builders.',
        'hero.buy': 'Buy $SUOLALA',
        'hero.chart': 'View Chart',
        
        // Token Section
        'token.title': '$SUOLALA Token',
        'token.subtitle': 'The future of meme utility on Solana',
        'token.contract': 'Contract Address (Solana)',
        'token.copy': 'Copy',
        'token.livePrice': 'Live Price',
        'token.perToken': 'Per $SUOLALA',
        'token.marketCap': 'Market Cap',
        'token.fdv': 'Fully Diluted',
        'token.liquidity': 'Liquidity',
        'token.totalUSD': 'Total USD',
        'token.volume24h': '24h Volume',
        'token.tradingVolume': 'Trading Volume',
        'token.transactions24h': '24h Transactions',
        'token.buysSells': 'Buys + Sells',
        'token.holders': 'Holders',
        'token.uniqueWallets': 'Unique Wallets',
        
        // Features Section
        'features.title': 'Why $SUOLALA?',
        'features.subtitle': 'Built different on Solana',
        'features.fast.title': 'Fast Solana Transactions',
        'features.fast.desc': 'Lightning-fast transactions with near-zero fees on the Solana blockchain.',
        'features.community.title': 'Community Powered',
        'features.community.desc': '100% community-driven with transparent development and decision making.',
        'features.secure.title': 'Transparent & Secure',
        'features.secure.desc': 'Fully audited smart contracts with locked liquidity for maximum security.',
        'features.utility.title': 'Meme + Utility Vision',
        'features.utility.desc': 'Combining meme culture with real utility for sustainable growth.',
        
        // Music Player
        'music.title': 'SUOLALA Theme',
        
        // NFTs Section
        'nfts.title': 'SUOLALA NFTs',
        'nfts.subtitle': 'Exclusive digital collectibles',
        'nfts.buy': 'Buy NFT',
        'nfts.fullCollection': 'Full Collection',
        'nfts.discover': 'Discover all exclusive NFTs',
        'nfts.seeMore': 'See More',
        
        // Roadmap Section
        'roadmap.title': 'Roadmap',
        'roadmap.subtitle': 'Journey to the moon',
        'roadmap.phase1.title': 'Phase 1 - Completed',
        'roadmap.phase1.item1': 'Token launch & liquidity pool',
        'roadmap.phase1.item2': 'Community building',
        'roadmap.phase1.item3': 'First 1,000 holders',
        'roadmap.phase1.item4': 'Website & socials launch',
        'roadmap.phase2.title': 'Phase 2 - Current',
        'roadmap.phase2.item1': 'CEX listings',
        'roadmap.phase2.item2': 'NFT collection launch',
        'roadmap.phase2.item3': 'Marketing campaigns',
        'roadmap.phase2.item4': 'Partnership announcements',
        'roadmap.phase3.title': 'Phase 3 - Upcoming',
        'roadmap.phase3.item1': 'Utility platform development',
        'roadmap.phase3.item2': 'Major exchange listing',
        'roadmap.phase3.item3': 'Ecosystem expansion',
        'roadmap.phase3.item4': 'Global meme takeover',
        
        // Community Section
        'community.title': 'Join Our Community',
        'community.subtitle': 'Be part of the SUOLALA revolution',
        'community.x': 'X (Twitter)',
        'community.telegram': 'Telegram',
        'community.trends': 'trends.fun',
        
        // Footer
        'footer.disclaimer1': '© 2026 SUOLALA. All rights reserved. This is a meme token with no intrinsic value or expectation of financial return. Cryptocurrency investments are highly volatile and risky. Only invest what you can afford to lose.',
        'footer.disclaimer2': 'Built on Solana'
    },
    zh: {
        // Navigation
        'nav.title': '索拉拉',
        'nav.home': '首页',
        'nav.token': '代币',
        'nav.news': '新闻',
        'nav.nfts': 'NFTs',
        'nav.roadmap': '路线图',
        'nav.memes': '表情包墙',
        
        // Hero Section
        'hero.solana': '索拉纳',
        'hero.title2': '我们建设，我们崛起',
        'hero.subtitle': 'Solana上首屈一指的中文代币，受Lily Liu推文启发，作为原创IP诞生，捕捉了Solana建设者的坚韧精神。',
        'hero.buy': '购买 $SUOLALA',
        'hero.chart': '查看图表',
        
        // Token Section
        'token.title': '$SUOLALA 代币',
        'token.subtitle': 'Solana上迷因效用的未来',
        'token.contract': '合约地址 (Solana)',
        'token.copy': '复制',
        'token.livePrice': '实时价格',
        'token.perToken': '每 $SUOLALA',
        'token.marketCap': '市值',
        'token.fdv': '完全稀释',
        'token.liquidity': '流动性',
        'token.totalUSD': '总美元',
        'token.volume24h': '24小时交易量',
        'token.tradingVolume': '交易量',
        'token.transactions24h': '24小时交易',
        'token.buysSells': '买入 + 卖出',
        'token.holders': '持有者',
        'token.uniqueWallets': '唯一钱包',
        
        // Features Section
        'features.title': '为什么选择 $SUOLALA?',
        'features.subtitle': '在Solana上与众不同',
        'features.fast.title': '快速的Solana交易',
        'features.fast.desc': 'Solana区块链上近乎零费用的闪电般快速交易。',
        'features.community.title': '社区驱动',
        'features.community.desc': '100%社区驱动，具有透明的开发和决策过程。',
        'features.secure.title': '透明且安全',
        'features.secure.desc': '完全审计的智能合约，锁定流动性以确保最大安全。',
        'features.utility.title': '迷因 + 实用愿景',
        'features.utility.desc': '将迷因文化与真实效用相结合，实现可持续增长。',
        
        // Music Player
        'music.title': '索拉拉主题曲',
        
        // NFTs Section
        'nfts.title': '索拉拉 NFTs',
        'nfts.subtitle': '独家数字收藏品',
        'nfts.buy': '购买 NFT',
        'nfts.fullCollection': '完整收藏',
        'nfts.discover': '发现所有独家NFTs',
        'nfts.seeMore': '查看更多',
        
        // Roadmap Section
        'roadmap.title': '路线图',
        'roadmap.subtitle': '月球之旅',
        'roadmap.phase1.title': '阶段 1 - 已完成',
        'roadmap.phase1.item1': '代币上线和流动性池',
        'roadmap.phase1.item2': '社区建设',
        'roadmap.phase1.item3': '首批1000名持有者',
        'roadmap.phase1.item4': '网站和社交媒体上线',
        'roadmap.phase2.title': '阶段 2 - 当前',
        'roadmap.phase2.item1': '中心化交易所上线',
        'roadmap.phase2.item2': 'NFT系列发布',
        'roadmap.phase2.item3': '营销活动',
        'roadmap.phase2.item4': '合作伙伴公告',
        'roadmap.phase3.title': '阶段 3 - 即将到来',
        'roadmap.phase3.item1': '实用平台开发',
        'roadmap.phase3.item2': '主要交易所上市',
        'roadmap.phase3.item3': '生态系统扩展',
        'roadmap.phase3.item4': '全球迷因接管',
        
        // Community Section
        'community.title': '加入我们的社区',
        'community.subtitle': '成为索拉拉革命的一部分',
        'community.x': 'X (推特)',
        'community.telegram': 'Telegram',
        'community.trends': '趋势追踪',
        
        // Footer
        'footer.disclaimer1': '© 2026 SUOLALA。保留所有权利。这是一个迷因代币，没有内在价值或财务回报预期。加密货币投资具有高度波动性和风险性。仅投资您能承受损失的金额。',
        'footer.disclaimer2': '基于Solana构建'
    }
};

let currentLanguage = 'en';

// Dynamic Viewport Height Fix (for mobile browsers)
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Translation function
function translatePage(lang) {
    currentLanguage = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (lang === 'en') {
        document.getElementById('langEn').classList.add('active');
    } else {
        document.getElementById('langZh').classList.add('active');
    }
    
    // Save to localStorage
    localStorage.setItem('suolala-language', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// Language toggle setup
function setupLanguageToggle() {
    const langEnBtn = document.getElementById('langEn');
    const langZhBtn = document.getElementById('langZh');
    
    // Load saved language or default to English
    const savedLang = localStorage.getItem('suolala-language') || 'en';
    translatePage(savedLang);
    
    // Event listeners
    langEnBtn.addEventListener('click', () => {
        translatePage('en');
    });
    
    langZhBtn.addEventListener('click', () => {
        translatePage('zh');
    });
}

// Copy Contract Address Function
function copyContract() {
    const contractText = document.getElementById('contractAddress').textContent;
    navigator.clipboard.writeText(contractText).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = contractText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
}

// Make copyContract available globally
window.copyContract = copyContract;

// Music Player Elements
const suolalaAudio = document.getElementById('suolalaAudio');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const musicPlayer = document.querySelector('.music-player');
const songTitle = document.querySelector('.song-title');

// Music Player State
let isPlaying = false;
let audioInitialized = false;

// ================================================
// MOBILE MENU FUNCTIONS - FROM MEMES.JS
// ================================================

// Mobile Menu Functions - RESPONSIVE FROM MEMES
const menuBtn = document.getElementById("mobileMenuBtn");
const menuOverlay = document.getElementById("mobileMenuOverlay");
const menuClose = document.getElementById("mobileMenuClose");

// Setup mobile menu
function setupMobileMenu() {
    menuBtn?.addEventListener("click", () => {
        menuOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    menuClose?.addEventListener("click", () => {
        menuOverlay.classList.remove("active");
        document.body.style.overflow = "";
    });

    menuOverlay?.addEventListener("click", (e) => {
        if (e.target === menuOverlay) {
            menuOverlay.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay?.classList.remove("active");
            document.body.style.overflow = "";
        });
    });
}

// Smooth scrolling
function setupSmoothScrolling() {
    const allLinks = [...navLinks, ...mobileNavLinks];
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#') && !href.includes('.html')) {
                e.preventDefault();
                
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Token Data Fetching - Using DexScreener pair address
const PAIR_ADDRESS = '79Qaq5b1JfC8bFuXkAvXTR67fRPmMjMVNkEA3bb8bLzi';
const marketCapElement = document.getElementById('marketCap');
const holdersElement = document.getElementById('holders');
const priceChangeContainer = document.getElementById('priceChangeContainer');
const priceChangeIcon = document.getElementById('priceChangeIcon');

async function fetchTokenData() {
    try {
        console.log("Fetching real-time data from DexScreener...");
        const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${PAIR_ADDRESS}`);
        const data = await response.json();
        
        if (data.pair) {
            const pair = data.pair;
            
            // Update Price
            const price = parseFloat(pair.priceUsd);
            if (livePriceElement) {
                if (price < 0.000001) {
                    livePriceElement.textContent = `$${price.toFixed(10)}`;
                } else if (price < 0.0001) {
                    livePriceElement.textContent = `$${price.toFixed(8)}`;
                } else if (price < 0.01) {
                    livePriceElement.textContent = `$${price.toFixed(6)}`;
                } else {
                    livePriceElement.textContent = `$${price.toFixed(4)}`;
                }
            }
            
            // Update Price Change (24h)
            if (pair.priceChange && pair.priceChange.h24 !== undefined) {
                const change = parseFloat(pair.priceChange.h24);
                const isPositive = change >= 0;
                if (priceChangeElement) {
                    priceChangeElement.textContent = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
                }
                if (priceChangeContainer) {
                    priceChangeContainer.className = `price-change ${isPositive ? 'positive' : 'negative'}`;
                }
                if (priceChangeIcon) {
                    priceChangeIcon.className = `fas fa-arrow-${isPositive ? 'up' : 'down'}`;
                }
            }
            
            // Update Market Cap (FDV)
            const mcap = pair.fdv || pair.marketCap;
            if (marketCapElement) {
                marketCapElement.textContent = formatCurrency(mcap);
            }
            
            // Update Holders count if available
            if (holdersElement && pair.info && pair.info.holders) {
                holdersElement.textContent = formatNumber(pair.info.holders);
            }
            
            // Update 24h Volume
            const volume24hElement = document.getElementById('volume24h');
            if (volume24hElement && pair.volume && pair.volume.h24) {
                volume24hElement.textContent = formatCurrency(pair.volume.h24);
            }
            
            // Update Liquidity
            const liquidityElement = document.getElementById('liquidity');
            if (liquidityElement && pair.liquidity && pair.liquidity.usd) {
                liquidityElement.textContent = formatCurrency(pair.liquidity.usd);
            }
            
            // Update 24h Transactions
            const txns24hElement = document.getElementById('txns24h');
            if (txns24hElement && pair.txns && pair.txns.h24) {
                const totalTxns = (pair.txns.h24.buys || 0) + (pair.txns.h24.sells || 0);
                txns24hElement.textContent = formatNumber(totalTxns);
            }
        }
    } catch (error) {
        console.error('Error fetching token data:', error);
    }
}

function formatCurrency(value) {
    if (!value) return '$0';
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${parseFloat(value).toFixed(2)}`;
}

function formatNumber(value) {
    if (!value) return '0';
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
}

// Initial fetch and interval (refresh every 15 seconds)
fetchTokenData();
setInterval(fetchTokenData, 15000);

// Enhanced Background Animations
function createParticles() {
    if (!particlesContainer) return;
    
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const moveX = (Math.random() - 0.5) * 100;
        
        // Apply styles
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${Math.random() > 0.5 ? 'rgba(153, 69, 255, 0.3)' : 'rgba(20, 241, 149, 0.3)'};
            border-radius: 50%;
            left: ${posX}%;
            bottom: -10px;
            animation: particleMove ${duration}s linear ${delay}s infinite;
            --move-x: ${moveX}px;
            filter: blur(${Math.random() * 2}px);
        `;
        
        particlesContainer.appendChild(particle);
    }
}

function createFloatingShapes() {
    if (!floatingShapes) return;
    
    // Create additional floating shapes
    for (let i = 0; i < 6; i++) {
        const shape = document.createElement('div');
        shape.className = `shape-${i + 1}`;
        
        const size = Math.random() * 100 + 50;
        const posX = Math.random() * 90 + 5;
        const posY = Math.random() * 90 + 5;
        const duration = Math.random() * 30 + 20;
        const delay = Math.random() * 20;
        
        const colors = [
            'rgba(153, 69, 255, 0.05)',
            'rgba(20, 241, 149, 0.04)',
            'rgba(0, 209, 255, 0.03)',
            'rgba(255, 107, 157, 0.02)'
        ];
        
        shape.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            top: ${posY}%;
            left: ${posX}%;
            background: radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}, transparent 70%);
            animation: float ${duration}s infinite linear ${delay}s;
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
        `;
        
        floatingShapes.appendChild(shape);
    }
}

// Theme Management (Light/Dark)
function setupThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'themeToggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('suolala-theme') || 'dark';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('suolala-theme', newTheme);
    });
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    const themeToggle = document.getElementById('themeToggle');
    
    if (theme === 'light') {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        document.documentElement.style.setProperty('--dark-bg', '#F5F5FA');
        document.documentElement.style.setProperty('--darker-bg', '#FFFFFF');
        document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.9)');
        document.documentElement.style.setProperty('--text-primary', '#0A0A0F');
        document.documentElement.style.setProperty('--text-secondary', '#555566');
        document.documentElement.style.setProperty('--glass-border', 'rgba(153, 69, 255, 0.15)');
        document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.8)');
        document.documentElement.style.setProperty('--build-rise-color', '#FF6B9D');
        document.documentElement.style.setProperty('--build-rise-gradient', 'linear-gradient(135deg, #FF6B9D 0%, #FFD166 50%, #00D1FF 100%)');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        document.documentElement.style.setProperty('--dark-bg', '#0A0A0F');
        document.documentElement.style.setProperty('--darker-bg', '#050508');
        document.documentElement.style.setProperty('--card-bg', 'rgba(25, 25, 35, 0.7)');
        document.documentElement.style.setProperty('--text-primary', '#FFFFFF');
        document.documentElement.style.setProperty('--text-secondary', '#B0B0C0');
        document.documentElement.style.setProperty('--glass-border', 'rgba(153, 69, 255, 0.2)');
        document.documentElement.style.setProperty('--glass-bg', 'rgba(15, 15, 25, 0.8)');
        document.documentElement.style.setProperty('--build-rise-color', '#FF6B9D');
        document.documentElement.style.setProperty('--build-rise-gradient', 'linear-gradient(135deg, #FF6B9D 0%, #FFD166 50%, #00D1FF 100%)');
    }
}

// Animate elements on scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    const elementsToAnimate = document.querySelectorAll('.feature-card, .nft-card, .token-stat-card, .roadmap-phase');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Music Player Functionality - FIXED VERSION
function initializeMusicPlayer() {
    // Check if audio element exists
    if (!suolalaAudio) {
        console.error("Audio element not found");
        return;
    }
    
    // Set initial volume
    if (volumeSlider) {
        suolalaAudio.volume = volumeSlider.value / 100;
    }
    
    // Load song metadata
    suolalaAudio.addEventListener('loadedmetadata', function() {
        if (suolalaAudio.duration && !isNaN(suolalaAudio.duration)) {
            const duration = suolalaAudio.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            if (songTitle) {
                songTitle.textContent = `SUOLALA Theme (${minutes}:${seconds.toString().padStart(2, '0')})`;
            }
        }
    });
    
    // Update progress bar
    suolalaAudio.addEventListener('timeupdate', function() {
        if (suolalaAudio.duration && !isNaN(suolalaAudio.duration) && progressBar) {
            const progress = (suolalaAudio.currentTime / suolalaAudio.duration) * 100;
            progressBar.style.width = `${progress}%`;
        }
    });
    
    // Handle song end (restart for loop)
    suolalaAudio.addEventListener('ended', function() {
        if (suolalaAudio.loop) {
            suolalaAudio.currentTime = 0;
            suolalaAudio.play().catch(e => console.log("Auto-restart failed:", e));
        } else {
            isPlaying = false;
            updateMusicButton();
        }
    });
    
    // Handle audio errors
    suolalaAudio.addEventListener('error', function(e) {
        console.error("Audio error:", e);
        if (songTitle) {
            songTitle.textContent = "Add suolalasong.mp3";
            songTitle.style.color = "var(--warning)";
        }
        if (musicToggle) {
            musicToggle.disabled = true;
            musicToggle.style.opacity = "0.5";
        }
    });
    
    // Update button when audio starts playing
    suolalaAudio.addEventListener('play', function() {
        isPlaying = true;
        updateMusicButton();
    });
    
    // Update button when audio pauses
    suolalaAudio.addEventListener('pause', function() {
        isPlaying = false;
        updateMusicButton();
    });
    
    // Initial button state
    updateMusicButton();
}

// Toggle play/pause - FIXED VERSION
function toggleMusic() {
    if (!suolalaAudio) return;
    
    console.log("Toggle music called, current state:", isPlaying);
    
    if (isPlaying) {
        console.log("Pausing audio...");
        suolalaAudio.pause();
        // The 'pause' event will update isPlaying and the button
    } else {
        console.log("Playing audio...");
        suolalaAudio.play().then(() => {
            console.log("Audio play successful");
            // The 'play' event will update isPlaying and the button
        }).catch(e => {
            console.log("Audio play failed:", e);
            // Show user they need to interact first on some browsers
            if (musicToggle) {
                musicToggle.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    musicToggle.style.animation = '';
                }, 500);
            }
            
            // For browsers that require user interaction
            const playOnInteraction = () => {
                suolalaAudio.play().then(() => {
                    console.log("Audio play successful after interaction");
                }).catch(err => console.log("Still failed after interaction:", err));
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
            };
            
            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('touchstart', playOnInteraction, { once: true });
        });
    }
}

// Update music button - FIXED VERSION
function updateMusicButton() {
    console.log("Updating music button, isPlaying:", isPlaying);
    
    if (!musicIcon || !musicPlayer) return;
    
    // Update icon
    musicIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    
    // Update player class for animation
    if (isPlaying) {
        musicPlayer.classList.add('playing');
    } else {
        musicPlayer.classList.remove('playing');
    }
    
    console.log("Button icon set to:", musicIcon.className);
}

// Initialize audio on first user interaction
function initAudioOnInteraction() {
    if (!audioInitialized && suolalaAudio) {
        console.log("Audio context initialized");
        audioInitialized = true;
        
        // On mobile, we'll load the audio but not autoplay
        suolalaAudio.load();
        
        // Show a subtle hint to user on mobile
        if (window.innerWidth <= 768 && songTitle) {
            const originalText = songTitle.textContent;
            songTitle.textContent = "Tap to play music";
            setTimeout(() => {
                songTitle.textContent = originalText;
            }, 2000);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set viewport height
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    
    // Setup mobile menu
    setupMobileMenu();
    setupSmoothScrolling();
    setupThemeToggle();
    setupScrollAnimations();
    setupLanguageToggle();
    
    // Create enhanced background animations
    createParticles();
    createFloatingShapes();
    
    // Initialize music player
    if (suolalaAudio && musicToggle && volumeSlider) {
        console.log("Initializing music player...");
        initializeMusicPlayer();
        
        // Set up event listeners for music player
        musicToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Music toggle clicked");
            toggleMusic();
        });
        
        // Volume control
        volumeSlider.addEventListener('input', function() {
            if (suolalaAudio) {
                suolalaAudio.volume = this.value / 100;
            }
        });
        
        // Click on music player to toggle (except volume slider)
        if (musicPlayer) {
            musicPlayer.addEventListener('click', function(e) {
                if (e.target !== volumeSlider && !volumeSlider.contains(e.target) && e.target !== musicToggle) {
                    e.preventDefault();
                    console.log("Music player clicked");
                    toggleMusic();
                }
            });
            
            // Touch events for mobile - prevent scrolling when interacting with player
            musicPlayer.addEventListener('touchstart', function(e) {
                e.stopPropagation();
            }, { passive: true });
            
            // Prevent context menu on long press for mobile
            musicPlayer.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
        }
        
        // Initialize audio on first user interaction
        document.addEventListener('click', initAudioOnInteraction, { once: true });
        document.addEventListener('touchstart', initAudioOnInteraction, { once: true });
        
        // Also initialize if user interacts with any button
        document.querySelectorAll('button, a').forEach(element => {
            element.addEventListener('click', initAudioOnInteraction, { once: true });
        });
    } else {
        console.error("Music player elements not found:", {
            audio: !!suolalaAudio,
            toggle: !!musicToggle,
            slider: !!volumeSlider
        });
    }
    
    // Add animation classes
    document.body.classList.add('loaded');
    
    // Check if audio file exists
    if (suolalaAudio) {
        suolalaAudio.addEventListener('canplaythrough', () => {
            console.log("SUOLALA song is ready to play");
        });
        
        // Set a timeout to check if audio loaded
        setTimeout(() => {
            if (suolalaAudio.readyState < 2 && songTitle) { // 2 = HAVE_CURRENT_DATA
                console.log("Audio file may be missing or inaccessible");
                songTitle.textContent = "Add suolalasong.mp3";
                songTitle.style.color = "var(--warning)";
            }
        }, 3000);
    }
});

// Add CSS for theme toggle and particles
const themeToggleCSS = `
.theme-toggle {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--gradient-primary);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    z-index: 1001;
    box-shadow: 0 5px 20px rgba(153, 69, 255, 0.4);
    transition: all 0.3s ease;
}

.theme-toggle:hover {
    transform: scale(1.1) rotate(30deg);
    box-shadow: 0 8px 25px rgba(153, 69, 255, 0.6);
}

@media (max-width: 768px) {
    .theme-toggle {
        bottom: 80px;
        right: 15px;
        width: 40px;
        height: 40px;
        font-size: 1rem;
    }
}

/* Animation classes */
.animate-in {
    animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Particle animations */
@keyframes particleMove {
    0% {
        transform: translateY(0) translateX(0);
        opacity: 0;
    }
    10% {
        opacity: 1;
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) translateX(var(--move-x, 0));
        opacity: 0;
    }
}

/* Negative price change */
.price-change.negative {
    color: var(--warning);
}

/* Shake animation for audio errors */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// Inject theme toggle CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = themeToggleCSS;
document.head.appendChild(styleSheet);