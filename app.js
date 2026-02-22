// SUOLALA - Crypto News Speaker
"use strict";

document.addEventListener('DOMContentLoaded', function() {
    // Navigation Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile Menu Functions
    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    mobileMenuClose?.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    mobileMenuOverlay?.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuOverlay?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Smooth scrolling for anchor links
    function setupSmoothScrolling() {
        const allLinks = [...navLinks, ...mobileNavLinks];
        
        allLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip external links and links to other pages
                if (href.startsWith('#') && !href.includes('.html')) {
                    e.preventDefault();
                    
                    const targetSection = document.querySelector(href);
                    
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
                // All other links (index.html, external URLs) will work normally
            });
        });
    }

    setupSmoothScrolling();

    // Language toggle setup (visual only for now)
    const langEnBtn = document.getElementById('langEn');
    const langZhBtn = document.getElementById('langZh');
    
    if (langEnBtn && langZhBtn) {
        langEnBtn.addEventListener('click', () => {
            langEnBtn.classList.add('active');
            langZhBtn.classList.remove('active');
            // Language switching functionality can be added here
        });
        
        langZhBtn.addEventListener('click', () => {
            langZhBtn.classList.add('active');
            langEnBtn.classList.remove('active');
            // Language switching functionality can be added here
        });
    }

    // News Speaker App State
    const state = {
        newsItems: [],
        filteredNews: [],
        currentNews: null,
        voices: [],
        englishVoice: null,
        chineseVoice: null,
        isSpeaking: false,
        isRecording: false,
        currentFilter: 'today',
        lastSpokenLang: 'en',
        speechRate: 0.9,
        speechPitch: 1.2,
        speechVolume: 1
    };

    let isArticleLoading = false;
    let pendingSpeakLang = null;

    const elements = {
        newsGrid: document.getElementById('newsGrid'),
        currentNewsTitle: document.getElementById('currentNewsTitle'),
        subtitle: document.getElementById('subtitle'),
        speakEnglishBtn: document.getElementById('speakEnglishBtn'),
        speakChineseBtn: document.getElementById('speakChineseBtn'),
        stopBtn: document.getElementById('stopBtn'),
        refreshNewsBtn: document.getElementById('refreshNewsBtn'),
        voiceStatus: document.getElementById('voiceStatus'),
        suolalaVideo: document.getElementById('suolalaVideo'),
        shareModal: document.getElementById('shareModal'),
        shareLink: document.getElementById('shareLink'),
        copyLinkBtn: document.getElementById('copyLinkBtn'),
        closeModalBtn: document.getElementById('closeModalBtn'),
        downloadModal: document.getElementById('downloadModal'),
        downloadStatus: document.getElementById('downloadStatus'),
        progressFill: document.getElementById('progressFill'),
        cancelDownloadBtn: document.getElementById('cancelDownloadBtn'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        particles: document.getElementById('particles')
    };

    const PROXY_URL = 'https://api.allorigins.win/raw?url=';
    const RSS_SOURCES = [
        { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss' },
        { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
        { name: 'Solana', url: 'https://solana.com/news/rss.xml' }
    ];

    function init() {
        createParticles();
        loadVoices();
        setupEventListeners();
        loadNewsFromAllSources();
        setInterval(loadNewsFromAllSources, 600000);
    }

    function createParticles() {
        if (!elements.particles) return;
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            elements.particles.appendChild(particle);
        }
    }

    function loadVoices() {
        function populateVoices() {
            state.voices = speechSynthesis.getVoices();
            const femaleKw = ['female','woman','zira','samantha','victoria','karen','tessa','fiona','susan','hazel','heather','emily','salli','joanna','kendra','ivy','amy','emma','huihui','yaoyao','xiaoxiao','xiaoyi','zhiyu','lili','tingting','yafang'];
            const maleKw = ['male','man','david','mark','james','daniel','george','richard','alex','guy','matthew','kangkang','yunyang'];
            
            const enVoices = state.voices.filter(v => v.lang.startsWith('en'));
            state.englishVoice = enVoices.find(v => {
                const n = v.name.toLowerCase();
                return femaleKw.some(k => n.includes(k)) && !maleKw.some(k => n.includes(k));
            }) || enVoices.find(v => !maleKw.some(k => v.name.toLowerCase().includes(k))) || enVoices[0];

            const zhVoices = state.voices.filter(v => v.lang.startsWith('zh') || v.lang.includes('CN'));
            state.chineseVoice = zhVoices.find(v => {
                const n = v.name.toLowerCase();
                return femaleKw.some(k => n.includes(k)) && !maleKw.some(k => n.includes(k));
            }) || zhVoices.find(v => !maleKw.some(k => v.name.toLowerCase().includes(k))) || zhVoices[0];

            updateVoiceStatus();
        }
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoices;
        }
        setTimeout(populateVoices, 100);
        setTimeout(populateVoices, 500);
        setTimeout(populateVoices, 1000);
    }

    function updateVoiceStatus(speaking, recording) {
        const dot = elements.voiceStatus.querySelector('.status-dot');
        const span = elements.voiceStatus.querySelector('span:last-child');
        if (recording) {
            dot.className = 'status-dot recording';
            span.textContent = 'Recording video...';
        } else if (speaking) {
            dot.className = 'status-dot speaking';
            span.textContent = 'Speaking...';
        } else {
            dot.className = 'status-dot';
            const hasEn = !!state.englishVoice;
            const hasZh = !!state.chineseVoice;
            span.textContent = hasEn && hasZh ? 'Female Voice EN / CN Ready' : hasEn ? 'Female Voice EN Ready' : hasZh ? 'Female Voice CN Ready' : 'Loading voices...';
        }
    }

    async function loadNewsFromAllSources() {
        showLoadingState();
        let allNews = [];
        // Helper: fetch with timeout
        async function fetchWithTimeout(url, ms = 6000) {
            return Promise.race([
                fetch(url),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
            ]);
        }
        // Helper: fetch RSS with retry and timeout
        async function fetchRSSWithRetry(src, retries = 1) {
            for (let i = 0; i <= retries; i++) {
                try {
                    const res = await fetchWithTimeout(PROXY_URL + encodeURIComponent(src.url));
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const xml = await res.text();
                    const news = parseRSS(xml, src.name);
                    if (news && news.length > 0) return news;
                } catch (e) {
                    if (i === retries) console.warn(`Failed ${src.name}:`, e.message);
                }
            }
            return [];
        }
        // Fetch all sources in parallel with retry and timeout
        const promises = RSS_SOURCES.map(src => fetchRSSWithRetry(src, 1));
        const results = await Promise.all(promises);
        results.forEach(n => { allNews = [...allNews, ...n]; });
        const unique = removeDuplicates(allNews);
        unique.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
        if (unique.length > 0) {
            state.newsItems = unique;
            applyFilter(state.currentFilter);
            checkUrlForNewsId();
        } else {
            showErrorState();
        }
    }

    async function fetchRSSFeed(url, sourceName) {
        const res = await fetch(PROXY_URL + encodeURIComponent(url));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const xml = await res.text();
        return parseRSS(xml, sourceName);
    }

    function parseRSS(xml, sourceName) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'text/xml');
        if (doc.querySelector('parsererror')) return [];
        const items = doc.querySelectorAll('item');
        const news = [];
        items.forEach((item, i) => {
            const title = item.querySelector('title')?.textContent?.trim();
            if (!title) return;
            const desc = item.querySelector('description')?.textContent?.trim() || '';
            const link = item.querySelector('link')?.textContent?.trim() || '#';
            const pubStr = item.querySelector('pubDate')?.textContent || '';
            let pubDate;
            try { pubDate = pubStr ? new Date(pubStr) : new Date(); } catch { pubDate = new Date(); }
            const cleanDesc = stripHtml(desc).substring(0, 200);
            news.push({
                id: `${sourceName.toLowerCase().replace(/\s/g,'')}-${pubDate.getTime()}-${i}`,
                title: stripHtml(title),
                description: cleanDesc + (cleanDesc.length >= 200 ? '...' : ''),
                link, source: sourceName,
                date: formatRelativeDate(pubDate),
                rawDate: pubDate
            });
        });
        return news;
    }

    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || '';
    }

    function removeDuplicates(arr) {
        const seen = new Set();
        return arr.filter(item => {
            const key = item.title.toLowerCase().trim();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    function formatRelativeDate(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function applyFilter(filter) {
        state.currentFilter = filter;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
        state.filteredNews = state.newsItems.filter(item => {
            const d = new Date(item.rawDate);
            const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            if (filter === 'today') return day >= today;
            if (filter === 'yesterday') return day >= yesterday && day < today;
            return true;
        });
        if (state.filteredNews.length === 0) state.filteredNews = state.newsItems.slice(0, 20);
        renderNewsGrid();
        elements.filterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
    }

    function showLoadingState() {
        elements.newsGrid.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><p>Loading latest crypto news...</p></div>';
    }

    function showErrorState() {
        elements.newsGrid.innerHTML = '<div class="error-state"><p>Unable to load news. Please try refreshing.</p></div>';
    }

    function renderNewsGrid() {
        if (state.filteredNews.length === 0) { showErrorState(); return; }
        elements.newsGrid.innerHTML = '';
        state.filteredNews.forEach(item => {
            const card = document.createElement('article');
            card.className = 'news-card' + (state.currentNews && state.currentNews.id === item.id ? ' selected' : '');
            card.dataset.id = item.id;
            card.innerHTML = `
                <div class="news-header">
                    <h3 class="news-title">${escapeHtml(item.title)}</h3>
                    <span class="news-source">${escapeHtml(item.source)}</span>
                </div>
                <p class="news-description">${escapeHtml(item.description)}</p>
                <div class="news-footer">
                    <div class="news-time"><span>⏱</span><span>${item.date}</span></div>
                    <button class="news-share-btn" data-id="${item.id}">Share</button>
                </div>`;
            card.addEventListener('click', e => { if (!e.target.classList.contains('news-share-btn')) selectNewsItem(item); });
            card.querySelector('.news-share-btn').addEventListener('click', e => { e.stopPropagation(); selectNewsItem(item); openShareModal(); });
            elements.newsGrid.appendChild(card);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function fetchFullArticle(item) {
        if (!item.link || item.link === '#') return null;
        try {
            const res = await Promise.race([
                fetch(PROXY_URL + encodeURIComponent(item.link)),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 8000))
            ]);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const html = await res.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Try multiple selectors to extract article text
            let articleText = '';
            const selectors = [
                'article p',
                'main p',
                'div[itemprop="articleBody"] p',
                '.article-body p',
                '.post-content p',
                '.entry-content p',
                'div.content p',
                'div.article p'
            ];
            
            for (let selector of selectors) {
                const paragraphs = doc.querySelectorAll(selector);
                if (paragraphs.length > 0) {
                    articleText = Array.from(paragraphs)
                        .map(p => p.textContent.trim())
                        .filter(text => text.length > 0)
                        .join(' ');
                    if (articleText.length > 100) break;
                }
            }
            
            return articleText && articleText.length > 50 ? articleText : null;
        } catch (err) {
            console.warn('Failed to fetch full article:', err.message);
            return null;
        }
    }

    function setButtonLoading(btn, loading) {
        if (!btn) return;
        let icon = btn.querySelector('.btn-icon');
        let spinner = btn.querySelector('.loading-spinner');
        if (!spinner) {
            spinner = document.createElement('span');
            spinner.className = 'loading-spinner';
            spinner.style.display = 'none';
            spinner.innerHTML = '<span class="loading-spinner"></span>';
            btn.insertBefore(spinner, btn.firstChild);
        }
        if (loading) {
            if (icon) icon.style.display = 'none';
            spinner.style.display = 'inline-block';
            btn.disabled = true;
        } else {
            if (icon) icon.style.display = '';
            spinner.style.display = 'none';
            btn.disabled = false;
        }
    }

    function updateSpeakButtonsLoading(loading) {
        setButtonLoading(elements.speakEnglishBtn, loading);
        setButtonLoading(elements.speakChineseBtn, loading);
    }

    function selectNewsItem(item) {
        state.currentNews = item;
        elements.currentNewsTitle.textContent = item.title;
        elements.subtitle.textContent = 'Loading full article...';
        document.querySelectorAll('.news-card').forEach(c => c.classList.toggle('selected', c.dataset.id === item.id));
        if (window.innerWidth < 768) window.scrollTo({ top: 0, behavior: 'smooth' });
        const newUrl = `${window.location.pathname}?id=${item.id}`;
        window.history.pushState({ newsId: item.id }, '', newUrl);

        // Fetch full article asynchronously
        if (!item.fullText) {
            isArticleLoading = true;
            updateSpeakButtonsLoading(true);
            fetchFullArticle(item).then(fullText => {
                isArticleLoading = false;
                updateSpeakButtonsLoading(false);
                if (fullText) {
                    item.fullText = fullText;
                    const displayText = fullText.substring(0, 1000);
                    elements.subtitle.textContent = displayText + (fullText.length > 1000 ? '...' : '');
                } else {
                    elements.subtitle.textContent = `"${item.title}"`;
                }
                if (pendingSpeakLang) {
                    speakNews(pendingSpeakLang);
                    pendingSpeakLang = null;
                }
            });
        } else {
            const displayText = item.fullText.substring(0, 1000);
            elements.subtitle.textContent = displayText + (item.fullText.length > 1000 ? '...' : '');
        }
    }

    function speakNews(lang) {
        if (isArticleLoading) {
            pendingSpeakLang = lang;
            return;
        }
        if (!state.currentNews) { alert('Please select a news item first.'); return; }
        if (state.isSpeaking) { stopSpeaking(); setTimeout(() => speakNews(lang), 200); return; }
        const voice = lang === 'en' ? state.englishVoice : state.chineseVoice;
        if (!voice) { alert(`${lang === 'en' ? 'English' : 'Chinese'} voice not available.`); return; }
        state.lastSpokenLang = lang;
        const newsContent = state.currentNews.fullText || state.currentNews.title;
        const text = lang === 'en' 
            ? `Hi, I'm Suolala. Here is the latest crypto news. ${newsContent}`
            : `大家好，我是 Suolala。这是最新的加密货币新闻。${newsContent}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.lang = lang === 'en' ? 'en-US' : 'zh-CN';
        utterance.rate = state.speechRate;
        utterance.pitch = state.speechPitch;
        utterance.volume = state.speechVolume;
        utterance.onstart = () => {
            state.isSpeaking = true;
            updateVoiceStatus(true, false);
            elements.subtitle.textContent = text;
            if (elements.suolalaVideo) {
                setTimeout(() => {
                    if (state.isSpeaking) {
                        elements.suolalaVideo.currentTime = 0;
                        elements.suolalaVideo.play().catch(() => {});
                    }
                }, 220);
            }
        };
        utterance.onend = () => {
            state.isSpeaking = false;
            if (elements.suolalaVideo) { elements.suolalaVideo.pause(); elements.suolalaVideo.currentTime = 0; }
            updateVoiceStatus(false, false);
        };
        utterance.onerror = () => {
            state.isSpeaking = false;
            if (elements.suolalaVideo) { elements.suolalaVideo.pause(); elements.suolalaVideo.currentTime = 0; }
            updateVoiceStatus(false, false);
        };
        speechSynthesis.speak(utterance);
    }

    function stopSpeaking() {
        if (state.isSpeaking) {
            speechSynthesis.cancel();
            state.isSpeaking = false;
            if (elements.suolalaVideo) { elements.suolalaVideo.pause(); elements.suolalaVideo.currentTime = 0; }
            updateVoiceStatus(false, false);
        }
    }

    async function downloadVideo() {
        if (!state.currentNews) { alert('Please select a news item first.'); return; }
        if (state.isRecording) return;
        const lang = state.lastSpokenLang;
        const voice = lang === 'en' ? state.englishVoice : state.chineseVoice;
        if (!voice) { alert('Voice not available.'); return; }
        state.isRecording = true;
        elements.downloadModal.classList.add('active');
        elements.progressFill.style.width = '0%';
        elements.downloadStatus.textContent = 'Preparing video...';
        updateVoiceStatus(false, true);
        try {
            // Use full article text if available, fallback to title
            const newsContent = state.currentNews.fullText || state.currentNews.title;
            
            const text = lang === 'en'
                ? `Hi, I'm Suolala. Here is the latest crypto news. ${newsContent}`
                : `大家好，我是 Suolala。这是最新的加密货币新闻。${newsContent}`;
            elements.progressFill.style.width = '10%';
            elements.downloadStatus.textContent = 'Generating speech...';
            const audioDuration = await getSpokenDuration(text, voice, lang);
            elements.progressFill.style.width = '30%';
            elements.downloadStatus.textContent = 'Recording video...';
            const canvas = document.createElement('canvas');
            canvas.width = 720;
            canvas.height = 720;
            const ctx = canvas.getContext('2d');
            const video = elements.suolalaVideo;
            video.currentTime = 0;
            video.muted = true;
            await video.play();
            const canvasStream = canvas.captureStream(30);
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const dest = audioCtx.createMediaStreamDestination();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voice;
            utterance.lang = lang === 'en' ? 'en-US' : 'zh-CN';
            utterance.rate = state.speechRate;
            utterance.pitch = state.speechPitch;
            utterance.volume = state.speechVolume;
            const combinedStream = new MediaStream([
                ...canvasStream.getVideoTracks(),
                ...dest.stream.getAudioTracks()
            ]);
            // Use the most widely supported WebM format for MediaRecorder
            let mimeType = 'video/webm;codecs=vp8';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'video/webm';
            }
            const recorder = new MediaRecorder(combinedStream, { mimeType });
            const chunks = [];
            recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
            let recordingDone = false;
            recorder.onstop = () => { recordingDone = true; };
            recorder.start();
            speechSynthesis.speak(utterance);
            const recordDuration = Math.max(audioDuration, 3000) + 500;
            const startTime = Date.now();
            const drawFrame = () => {
                if (!state.isRecording) return;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const gradient = ctx.createLinearGradient(canvas.width - 150, canvas.height - 30, canvas.width - 10, canvas.height - 30);
                gradient.addColorStop(0, 'rgba(139, 92, 246, 0.9)');
                gradient.addColorStop(1, 'rgba(52, 245, 197, 0.9)');
                ctx.font = 'bold 18px Space Grotesk, sans-serif';
                ctx.fillStyle = gradient;
                ctx.textAlign = 'right';
                ctx.fillText('SUOLALA', canvas.width - 20, canvas.height - 20);
                const elapsed = Date.now() - startTime;
                const progress = Math.min(30 + (elapsed / recordDuration) * 60, 90);
                elements.progressFill.style.width = progress + '%';
                if (elapsed < recordDuration) {
                    requestAnimationFrame(drawFrame);
                } else {
                    recorder.stop();
                    speechSynthesis.cancel();
                    video.pause();
                    video.currentTime = 0;
                }
            };
            drawFrame();
            await new Promise(resolve => {
                const checkDone = setInterval(() => {
                    if (recordingDone) { clearInterval(checkDone); resolve(); }
                }, 100);
            });
            elements.progressFill.style.width = '95%';
            elements.downloadStatus.textContent = 'Finalizing...';
            const blob = new Blob(chunks, { type: mimeType });
            const url = URL.createObjectURL(blob);
            // Set the video element's src to the recorded video for playback
            if (elements.suolalaVideo) {
                elements.suolalaVideo.src = url;
                elements.suolalaVideo.type = mimeType;
                elements.suolalaVideo.load();
            }
            // Download the video
            const a = document.createElement('a');
            a.href = url;
            a.download = `suolala-news-${lang}.webm`;
            a.click();
            // Show a message about MP4 conversion for universal compatibility
            elements.downloadStatus.innerHTML = 'Download complete!<br><small>If you need MP4 format, use <a href="https://cloudconvert.com/webm-to-mp4" target="_blank">this free converter</a>.</small>';
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            elements.progressFill.style.width = '100%';
            elements.downloadStatus.textContent = 'Download complete!';
            setTimeout(() => { elements.downloadModal.classList.remove('active'); }, 1500);
        } catch (err) {
            console.error('Download error:', err);
            elements.downloadStatus.textContent = 'Error: ' + err.message;
            setTimeout(() => { elements.downloadModal.classList.remove('active'); }, 2000);
        } finally {
            state.isRecording = false;
            updateVoiceStatus(false, false);
        }
    }

    function getSpokenDuration(text, voice, lang) {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voice;
            utterance.lang = lang === 'en' ? 'en-US' : 'zh-CN';
            utterance.rate = state.speechRate;
            utterance.pitch = state.speechPitch;
            utterance.volume = 0.01;
            const start = Date.now();
            utterance.onend = () => resolve(Date.now() - start);
            utterance.onerror = () => resolve(5000);
            speechSynthesis.speak(utterance);
        });
    }

    function openShareModal() {
        if (!state.currentNews) { alert('Please select a news item to share.'); return; }
        const url = `${window.location.origin}${window.location.pathname}?id=${state.currentNews.id}`;
        elements.shareLink.value = url;
        elements.shareModal.classList.add('active');
    }

    function closeShareModal() { elements.shareModal.classList.remove('active'); }

    function copyShareLink() {
        elements.shareLink.select();
        try {
            navigator.clipboard.writeText(elements.shareLink.value);
            elements.copyLinkBtn.textContent = 'Copied!';
        } catch {
            document.execCommand('copy');
            elements.copyLinkBtn.textContent = 'Copied!';
        }
        setTimeout(() => { elements.copyLinkBtn.textContent = 'Copy'; }, 2000);
    }

    function setupEventListeners() {
        elements.speakEnglishBtn.addEventListener('click', () => speakNews('en'));
        elements.speakChineseBtn.addEventListener('click', () => speakNews('zh'));
        elements.stopBtn.addEventListener('click', stopSpeaking);
        elements.refreshNewsBtn.addEventListener('click', loadNewsFromAllSources);
        elements.filterBtns.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));
        elements.copyLinkBtn.addEventListener('click', copyShareLink);
        elements.closeModalBtn.addEventListener('click', closeShareModal);
        elements.shareModal.addEventListener('click', e => { if (e.target === elements.shareModal) closeShareModal(); });
        elements.cancelDownloadBtn.addEventListener('click', () => {
            state.isRecording = false;
            speechSynthesis.cancel();
            elements.downloadModal.classList.remove('active');
            updateVoiceStatus(false, false);
        });
        elements.downloadModal.addEventListener('click', e => { if (e.target === elements.downloadModal) { state.isRecording = false; elements.downloadModal.classList.remove('active'); } });
        document.addEventListener('visibilitychange', () => { if (document.hidden && state.isSpeaking) stopSpeaking(); });
        window.addEventListener('popstate', () => checkUrlForNewsId());
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                if (elements.shareModal.classList.contains('active')) closeShareModal();
                if (state.isSpeaking) stopSpeaking();
            }
        });
    }

    function checkUrlForNewsId() {
        const params = new URLSearchParams(window.location.search);
        const newsId = params.get('id');
        if (newsId && state.newsItems.length > 0) {
            const item = state.newsItems.find(n => n.id === newsId);
            if (item) {
                selectNewsItem(item);
            }
        }
    }

    init();
});