import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// SUOLALA - Meme Wall (PRODUCTION)
"use strict";

console.log('🚀 Loading SUOLALA Meme Wall (Real Firestore Mode)');

document.addEventListener('DOMContentLoaded', function () {
    // Dynamic Viewport Height Fix (for mobile browsers)
    // Calculates real 1vh value avoiding address bar issues
    function setViewportHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);

    // Navigation Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile Menu Functions
    // Mobile Menu Functions
    // Mobile Menu Functions
    const menuBtn = document.getElementById("mobileMenuBtn");
    const menuOverlay = document.getElementById("mobileMenuOverlay");
    const menuClose = document.getElementById("mobileMenuClose");

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

    // Smooth scrolling
    function setupSmoothScrolling() {
        const allLinks = [...navLinks, ...mobileNavLinks];

        allLinks.forEach(link => {
            link.addEventListener('click', function (e) {
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

    setupSmoothScrolling();

    // Translation System - from memes2.js
    const translations = {
        en: {
            'nav.title': 'SUOLALA',
            'nav.home': 'Home',
            'nav.token': 'Token',
            'nav.news': 'News',
            'nav.nfts': 'NFTs',
            'nav.roadmap': 'Roadmap',
            'nav.memes': 'Meme Wall',
            'hero.community': 'COMMUNITY',
            'hero.title': 'SUOLALA Meme Wall',
            'hero.subtitle': 'Community-created memes about the SUOLALA project',
            'hero.upload': 'Upload Meme',
            'hero.refresh': 'Refresh',
            'stats.total': 'Total Memes',
            'stats.today': 'Today',
            'stats.pending': 'Pending Review',
            'rules.title': 'Community Guidelines',
            'rules.1': 'No political, Adult, or offensive content',
            'rules.2': 'Keep it fun and relevant to SUOLALA',
            'rules.3': 'Respect other community members',
            'rules.4': 'All memes require admin approval before appearing publicly',
            'rules.5': 'Upload JPG, PNG, or WebP images (max 5MB)',
            'rules.note': 'Memes are manually reviewed within 24 hours.',
            'loading': 'Loading community memes...',
            'empty.title': 'No memes yet',
            'empty.subtitle': 'Be the first to upload a meme!',
            'modal.title': 'Upload Meme',
            'modal.subtitle': 'Share your creativity with the SUOLALA community',
            'modal.caption': 'Caption (optional)',
            'modal.name': '@username(X/Twitter) (optional)',
            'modal.cancel': 'Cancel',
            'modal.submit': 'Submit for Review',
            'upload.drop': 'Drop your meme here',
            'upload.or': 'or',
            'upload.browse': 'Browse Files',
            'upload.hint': 'JPG, PNG, WebP up to 5MB',
            'success.title': 'Thanks for Sharing!',
            'success.message': 'Your meme will appear after admin approval (usually within 24 hours).',
            'success.close': 'Got it!',
            'footer.disclaimer1': 'This meme wall is for entertainment only. All submissions are reviewed by moderators. SUOLALA reserves the right to remove any content.',
            'footer.disclaimer2': 'Built on Solana with ❤️',
            'leaderboard.title': 'TOP UPLOADERS',
            'leaderboard.mainTitle': 'Top Meme Uploaders',
            'leaderboard.subtitle': 'Community Weekly Leaderboard',
            'leaderboard.memes': 'memes',
            'leaderboard.update': 'Updated in real-time • Compete daily'
        },
        zh: {
            'nav.title': '索拉拉',
            'nav.home': '首页',
            'nav.token': '代币',
            'nav.news': '新闻',
            'nav.nfts': 'NFTs',
            'nav.roadmap': '路线图',
            'nav.memes': '表情包墙',
            'hero.community': '社区',
            'hero.title': '索拉拉表情包墙',
            'hero.subtitle': '社区创建的索拉拉项目表情包',
            'hero.upload': '上传表情包',
            'hero.refresh': '刷新',
            'stats.total': '总表情包',
            'stats.today': '今日',
            'stats.pending': '待审核',
            'rules.title': '社区准则',
            'rules.1': '禁止政治、成人（18+）或冒犯性内容',
            'rules.2': '保持有趣并与索拉拉相关',
            'rules.3': '尊重其他社区成员',
            'rules.4': '所有表情包需要管理员审核后才能公开显示',
            'rules.5': '上传JPG、PNG或WebP图片（最大5MB）',
            'rules.note': '表情包将在24小时内手动审核。',
            'loading': '加载社区表情包...',
            'empty.title': '还没有表情包',
            'empty.subtitle': '成为第一个上传表情包的人！',
            'modal.title': '上传表情包',
            'modal.subtitle': '与索拉拉社区分享你的创意',
            'modal.caption': '标题（可选）',
            'modal.name': '你的名字（可选）',
            'modal.cancel': '取消',
            'modal.submit': '提交审核',
            'upload.drop': '将表情包拖放到这里',
            'upload.or': '或',
            'upload.browse': '浏览文件',
            'upload.hint': 'JPG、PNG、WebP 最大5MB',
            'success.title': '感谢分享！',
            'success.message': '你的表情包将在管理员审核后显示（通常在24小时内）。',
            'success.close': '知道了！',
            'footer.disclaimer1': '此表情包墙仅供娱乐。所有提交内容均由版主审核。索拉拉保留删除任何内容的权利。',
            'footer.disclaimer2': '基于Solana构建 ❤️',
            'leaderboard.title': '最佳上传者',
            'leaderboard.mainTitle': '表情包上传排行榜',
            'leaderboard.subtitle': '社区每周排行榜',
            'leaderboard.memes': '个表情包',
            'leaderboard.update': '实时更新 • 每日竞争'
        }
    };

    let currentLanguage = 'en';

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

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        if (lang === 'en') {
            document.getElementById('langEn')?.classList.add('active');
        } else {
            document.getElementById('langZh')?.classList.add('active');
        }

        localStorage.setItem('suolala-language', lang);
        document.documentElement.lang = lang;
    }

    const langEnBtn = document.getElementById('langEn');
    const langZhBtn = document.getElementById('langZh');

    const savedLang = localStorage.getItem('suolala-language') || 'en';
    translatePage(savedLang);

    if (langEnBtn) langEnBtn.addEventListener('click', () => translatePage('en'));
    if (langZhBtn) langZhBtn.addEventListener('click', () => translatePage('zh'));



    // Meme Wall State - REAL DATA ONLY
    const state = {
        approvedMemes: [],
        totalMemes: 0,
        todayMemes: 0,
        pendingCount: 0
    };

    // Elements
    const elements = {
        memesGrid: document.getElementById('memesGrid'),
        loadingState: document.getElementById('loadingState'),
        emptyState: document.getElementById('emptyState'),
        totalMemes: document.getElementById('totalMemes'),
        todayMemes: document.getElementById('todayMemes'),
        pendingMemes: document.getElementById('pendingMemes'),
        uploadMemeBtn: document.getElementById('uploadMemeBtn'),
        refreshMemesBtn: document.getElementById('refreshMemesBtn'),
        uploadModal: document.getElementById('uploadModal'),
        successModal: document.getElementById('successModal'),
        closeModalBtn: document.getElementById('closeModalBtn'),
        cancelBtn: document.getElementById('cancelBtn'),
        successCloseBtn: document.getElementById('successCloseBtn'),
        fileSelectBtn: document.getElementById('fileSelectBtn'),
        memeFile: document.getElementById('memeFile'),
        uploadArea: document.getElementById('uploadArea'),
        previewContainer: document.getElementById('previewContainer'),
        imagePreview: document.getElementById('imagePreview'),
        removeImageBtn: document.getElementById('removeImageBtn'),
        memeCaption: document.getElementById('memeCaption'),
        uploaderName: document.getElementById('uploaderName'),
        submitBtn: document.getElementById('submitBtn'),
        memeUploadForm: document.getElementById('memeUploadForm'),
        charCount: document.getElementById('charCount')
    };

    // Initialize meme wall
    async function init() {
        setupEventListeners();
        createParticles();
        await loadMemesFromFirestore();
        await fetchStats();
        await fetchTopUploaders();
    }

    // Create background particles
    function createParticles() {
        const particlesContainer = document.querySelector('.particles-container');
        if (!particlesContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (10 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Load REAL memes from Firestore
    async function loadMemesFromFirestore() {
        try {
            if (elements.loadingState) elements.loadingState.style.display = 'block';
            if (elements.emptyState) elements.emptyState.style.display = 'none';

            // Query: status == 'approved' ordered by createdAt desc
            // This requires a composite index in Firestore
            const memesRef = collection(db, "memes");
            const q = query(
                memesRef,
                where("status", "==", "approved"),
                orderBy("createdAt", "desc")
            );


            const querySnapshot = await getDocs(q);
            state.approvedMemes = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                state.approvedMemes.push({
                    id: doc.id,
                    imageUrl: data.imageUrl || '',
                    caption: data.caption || '',
                    author: data.author || 'Anonymous',
                    createdAt: data.createdAt
                });
            });

            state.totalMemes = state.approvedMemes.length;
            renderMemes();

        } catch (error) {
            console.error('Error loading memes from Firestore:', error);

            // Check for index requirement error
            if (error.code === 'failed-precondition') {
                console.warn('⚠️ Firestore Index Required! Check console for the link to create it.');
            }

            if (elements.loadingState) elements.loadingState.style.display = 'none';
            // Even on error, if we have local cache, it might show something, else empty
            if (state.approvedMemes.length === 0 && elements.emptyState) {
                elements.emptyState.style.display = 'block';
            }
        }
    }

    // Fetch REAL stats from Firestore
    async function fetchStats() {
        try {
            // Total approved memes
            const approvedQuery = query(
                collection(db, "memes"),
                where("status", "==", "approved")
            );
            const approvedSnapshot = await getDocs(approvedQuery);
            state.totalMemes = approvedSnapshot.size;

            // Today's memes
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayTimestamp = Timestamp.fromDate(today);

            const todayQuery = query(
                collection(db, "memes"),
                where("status", "==", "approved"),
                where("createdAt", ">=", todayTimestamp)
            );
            const todaySnapshot = await getDocs(todayQuery);
            state.todayMemes = todaySnapshot.size;

            // Pending memes
            const pendingQuery = query(
                collection(db, "memes"),
                where("status", "==", "pending")
            );
            const pendingSnapshot = await getDocs(pendingQuery);
            state.pendingCount = pendingSnapshot.size;

            updateStatsUI();

        } catch (error) {
            console.error('Error fetching stats:', error);
            // Keep existing/0 stats on error
            updateStatsUI();
        }
    }

    // Update statistics UI
    function updateStatsUI() {
        if (elements.totalMemes) elements.totalMemes.textContent = state.totalMemes;
        if (elements.todayMemes) elements.todayMemes.textContent = state.todayMemes;
        if (elements.pendingMemes) elements.pendingMemes.textContent = state.pendingCount;
    }

    // Render memes grid
    function renderMemes() {
        if (elements.loadingState) elements.loadingState.style.display = 'none';

        if (state.approvedMemes.length === 0) {
            if (elements.emptyState) elements.emptyState.style.display = 'block';
            if (elements.memesGrid) elements.memesGrid.innerHTML = '';
            return;
        }

        if (elements.emptyState) elements.emptyState.style.display = 'none';
        if (elements.memesGrid) elements.memesGrid.innerHTML = '';

        state.approvedMemes.forEach(meme => {
            const memeCard = createMemeCard(meme);
            if (elements.memesGrid) elements.memesGrid.appendChild(memeCard);
        });
    }

    // Format date for display
    function formatDate(timestamp) {
        if (!timestamp) return 'Recently';

        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString();
    }

    // Create meme card HTML
    function createMemeCard(meme) {
        const card = document.createElement('div');
        card.className = 'meme-card';
        card.dataset.id = meme.id;

        const caption = meme.caption || 'SUOLALA meme';
        const author = meme.author || 'Anonymous';
        const date = formatDate(meme.createdAt);

        card.innerHTML = `
            <div class="meme-image-container">
                <img src="${meme.imageUrl}" alt="${escapeHtml(caption)}" class="meme-image" loading="lazy">
            </div>
            <div class="meme-info">
                <p class="meme-caption">${escapeHtml(caption)}</p>
                <div class="meme-meta">
                    <div class="meme-author">
                        <div class="author-avatar">${author.charAt(0).toUpperCase()}</div>
                        <span>${escapeHtml(author)}</span>
                    </div>
                    <button class="download-btn" title="Download PNG" data-url="${meme.imageUrl}">
                        <i class="fas fa-download"></i>
                    </button>
                    <div class="meme-date">${date}</div>
                </div>
            </div>
        `;

        // Add Download Event
        const downloadBtn = card.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                downloadMemeAsPng(meme.imageUrl);
            });
        }

        return card;
    }

    // Download meme as PNG using Canvas
    async function downloadMemeAsPng(imageUrl) {
        try {
            const img = new Image();
            img.crossOrigin = "Anonymous";

            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                try {
                    const pngUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    const timestamp = new Date().getTime();
                    link.download = `suolala-meme-${timestamp}.png`;
                    link.href = pngUrl;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (err) {
                    console.error('Canvas toDataURL failed:', err);
                    showToast('Download failed', 'error');
                }
            };

            img.onerror = function () {
                console.error('Image failed to load for download');
                showToast('Download failed', 'error');
            };

            img.src = imageUrl;
        } catch (error) {
            console.error('Error in download process:', error);
            showToast('Download failed', 'error');
        }
    }

    // Show toast notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        // Force reflow
        toast.offsetHeight;

        toast.classList.add('active');

        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 3000);
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Open upload modal
    function openUploadModal() {
        resetUploadForm();
        if (elements.uploadModal) elements.uploadModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close upload modal
    function closeUploadModal() {
        if (elements.uploadModal) elements.uploadModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Open success modal
    function openSuccessModal() {
        closeUploadModal();
        if (elements.successModal) elements.successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close success modal
    function closeSuccessModal() {
        if (elements.successModal) elements.successModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Reset upload form
    function resetUploadForm() {
        if (elements.memeFile) elements.memeFile.value = '';
        if (elements.previewContainer) elements.previewContainer.style.display = 'none';
        if (elements.imagePreview) elements.imagePreview.src = '';
        if (elements.memeCaption) elements.memeCaption.value = '';
        if (elements.uploaderName) elements.uploaderName.value = '';
        if (elements.submitBtn) elements.submitBtn.disabled = true;
        updateCharCount();
        if (elements.uploadArea) elements.uploadArea.classList.remove('dragover');
    }

    // Update character count
    function updateCharCount() {
        if (!elements.memeCaption || !elements.charCount) return;

        const count = elements.memeCaption.value.length;
        elements.charCount.textContent = count;

        if (count > 200) {
            elements.charCount.style.color = 'var(--warning)';
        } else {
            elements.charCount.style.color = 'var(--text-secondary)';
        }
    }

    // Handle file selection
    function handleFileSelect(file) {
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPG, PNG, or WebP)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            if (elements.imagePreview) elements.imagePreview.src = e.target.result;
            if (elements.previewContainer) elements.previewContainer.style.display = 'block';
            if (elements.submitBtn) elements.submitBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    // Submit meme to REAL Firestore
    async function submitMeme() {
        const caption = elements.memeCaption?.value.trim() || '';
        const author = elements.uploaderName?.value.trim() || 'Anonymous';
        const imageUrl = elements.imagePreview?.src || '';

        if (!imageUrl) {
            alert('Please select an image');
            return;
        }



        try {
            if (elements.submitBtn) {
                elements.submitBtn.disabled = true;
                elements.submitBtn.textContent = 'Submitting...';
            }

            await addDoc(collection(db, "memes"), {
                imageUrl: imageUrl,
                caption: caption || 'SUOLALA meme',
                author: author,
                status: "pending",
                createdAt: serverTimestamp()
            });


            // Refresh stats
            await fetchStats();

            // Show success modal
            openSuccessModal();

        } catch (error) {
            console.error('Error submitting meme:', error);
            alert('Failed to submit meme. Please try again.');
        } finally {
            if (elements.submitBtn) {
                elements.submitBtn.disabled = false;
                elements.submitBtn.textContent = 'Submit for Review';
            }
        }
    }

    // Fetch REAL leaderboard from Firestore
    async function fetchTopUploaders() {
        try {
            const cards = document.querySelectorAll('.leaderboard-card');
            cards.forEach(card => card.classList.add('loading'));

            // Get all approved memes for accurate count
            const approvedQuery = query(
                collection(db, "memes"),
                where("status", "==", "approved")
            );
            const snapshot = await getDocs(approvedQuery);

            // Count memes per author
            const authorCounts = {};
            snapshot.forEach((doc) => {
                const author = doc.data().author || 'Anonymous';
                authorCounts[author] = (authorCounts[author] || 0) + 1;
            });

            // Sort by count and get top 3
            const sorted = Object.entries(authorCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

            updateLeaderboardUI(sorted);

            cards.forEach(card => card.classList.remove('loading'));

        } catch (error) {
            console.error('Error fetching leaderboard:', error);

            const emptyData = [
                { name: 'No data yet', count: 0 },
                { name: 'No data yet', count: 0 },
                { name: 'No data yet', count: 0 }
            ];
            updateLeaderboardUI(emptyData);
        }
    }

    function updateLeaderboardUI(topThree) {
        const paddedData = [...topThree];
        while (paddedData.length < 3) {
            paddedData.push({ name: 'No one yet', count: 0 });
        }

        const rank1Initial = document.getElementById('rank1Initial');
        const rank1Name = document.getElementById('rank1Name');
        const rank1Count = document.getElementById('rank1Count');
        const rank2Initial = document.getElementById('rank2Initial');
        const rank2Name = document.getElementById('rank2Name');
        const rank2Count = document.getElementById('rank2Count');
        const rank3Initial = document.getElementById('rank3Initial');
        const rank3Name = document.getElementById('rank3Name');
        const rank3Count = document.getElementById('rank3Count');

        if (rank1Initial) rank1Initial.textContent = paddedData[0].name.charAt(0) ? paddedData[0].name.charAt(0).toUpperCase() : '?';
        if (rank1Name) rank1Name.textContent = paddedData[0].name;
        if (rank1Count) rank1Count.textContent = paddedData[0].count;

        if (rank2Initial) rank2Initial.textContent = paddedData[1].name.charAt(0) ? paddedData[1].name.charAt(0).toUpperCase() : '?';
        if (rank2Name) rank2Name.textContent = paddedData[1].name;
        if (rank2Count) rank2Count.textContent = paddedData[1].count;

        if (rank3Initial) rank3Initial.textContent = paddedData[2].name.charAt(0) ? paddedData[2].name.charAt(0).toUpperCase() : '?';
        if (rank3Name) rank3Name.textContent = paddedData[2].name;
        if (rank3Count) rank3Count.textContent = paddedData[2].count;
    }

    // Setup event listeners
    function setupEventListeners() {
        if (elements.uploadMemeBtn) {
            elements.uploadMemeBtn.addEventListener('click', openUploadModal);
        }

        if (elements.refreshMemesBtn) {
            elements.refreshMemesBtn.addEventListener('click', async () => {
                if (elements.loadingState) elements.loadingState.style.display = 'block';
                if (elements.emptyState) elements.emptyState.style.display = 'none';
                await loadMemesFromFirestore();
                await fetchStats();
                await fetchTopUploaders();
            });
        }

        if (elements.closeModalBtn) {
            elements.closeModalBtn.addEventListener('click', closeUploadModal);
        }

        if (elements.cancelBtn) {
            elements.cancelBtn.addEventListener('click', closeUploadModal);
        }

        if (elements.successCloseBtn) {
            elements.successCloseBtn.addEventListener('click', closeSuccessModal);
        }

        if (elements.uploadModal) {
            elements.uploadModal.addEventListener('click', (e) => {
                if (e.target === elements.uploadModal) {
                    closeUploadModal();
                }
            });
        }

        if (elements.successModal) {
            elements.successModal.addEventListener('click', (e) => {
                if (e.target === elements.successModal) {
                    closeSuccessModal();
                }
            });
        }

        if (elements.fileSelectBtn) {
            elements.fileSelectBtn.addEventListener('click', () => {
                if (elements.memeFile) elements.memeFile.click();
            });
        }

        if (elements.memeFile) {
            elements.memeFile.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                }
            });
        }

        if (elements.removeImageBtn) {
            elements.removeImageBtn.addEventListener('click', () => {
                if (elements.previewContainer) elements.previewContainer.style.display = 'none';
                if (elements.memeFile) elements.memeFile.value = '';
                if (elements.submitBtn) elements.submitBtn.disabled = true;
            });
        }

        if (elements.uploadArea) {
            elements.uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                elements.uploadArea.classList.add('dragover');
            });

            elements.uploadArea.addEventListener('dragleave', () => {
                elements.uploadArea.classList.remove('dragover');
            });

            elements.uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                elements.uploadArea.classList.remove('dragover');

                if (e.dataTransfer.files.length > 0) {
                    handleFileSelect(e.dataTransfer.files[0]);
                }
            });
        }

        if (elements.memeCaption) {
            elements.memeCaption.addEventListener('input', updateCharCount);
        }

        if (elements.memeUploadForm) {
            elements.memeUploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                submitMeme();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (elements.uploadModal?.classList.contains('active')) {
                    closeUploadModal();
                }
                if (elements.successModal?.classList.contains('active')) {
                    closeSuccessModal();
                }
            }
        });
    }

    // Initialize the app
    init();
});
