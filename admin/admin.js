import { db } from "./firebase.js";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Fixed Firebase Admin Logic - Corrected Field Names & Query
class MemeAdminPanel {
    constructor() {
        this.db = window.firebase.db;
        this.storage = window.firebase.storage;
        this.memes = [];
        this.filteredMemes = [];
        this.currentFilter = 'all';
        this.currentMemeId = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadMemes();
        this.setupRealTimeUpdates();
    }

    bindEvents() {
        document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });

        document.getElementById('refresh-btn').addEventListener('click', () => this.loadMemes());
        document.getElementById('bulk-approve-btn').addEventListener('click', () => this.bulkApprove());

        // Navigation Button - Logout behavior
        const navBtn = document.getElementById('goToMemesBtn');
        if (navBtn) {
            navBtn.addEventListener('click', () => {
                sessionStorage.removeItem('isAdmin');
                window.location.replace('../memes.html');
            });
        }


        document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('modal-approve').addEventListener('click', () => this.approveMeme(this.currentMemeId));
        document.getElementById('modal-reject').addEventListener('click', () => this.rejectMeme(this.currentMemeId));

        document.getElementById('image-modal').addEventListener('click', (e) => {
            if (e.target.id === 'image-modal') this.closeModal();
        });
    }

    async loadMemes() {
        const memeGrid = document.getElementById('meme-grid');
        memeGrid.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading memes...</p>
            </div>
        `;

        try {
            // FIX #1: Changed to 'createdAt' field
            // FIX #2: Requires Firestore composite index for createdAt descending
            const memesRef = window.firebase.collection(this.db, 'memes');
            const q = window.firebase.query(memesRef, window.firebase.orderBy('createdAt', 'desc'));
            const snapshot = await window.firebase.getDocs(q);

            // FIX #1: Properly handle createdAt field from serverTimestamp
            this.memes = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Handle Firestore Timestamp conversion
                    createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
                };
            });

            this.updateStats();
            this.renderMemes();
        } catch (error) {
            console.error('Error loading memes:', error);

            // FIX #2: Handle missing Firestore index gracefully
            if (error.code === 'failed-precondition' || error.message.includes('index')) {
                memeGrid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">🔧</div>
                        <h3>Firestore Index Required</h3>
                        <p>Create this composite index in Firebase Console:</p>
                        <div style="font-family: 'Space Grotesk', monospace; background: rgba(153, 69, 255, 0.1); padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid var(--border-color);">
                            Collection: <strong>memes</strong><br>
                            Fields: <strong>createdAt</strong> (Descending)<br>
                            Status: <span style="color: var(--accent-cyan);">Click "Create Index"</span>
                        </div>
                        <button class="btn btn-view" onclick="adminPanel.loadMemes()">Retry After Creating Index</button>
                    </div>
                `;
            } else {
                memeGrid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">⚠️</div>
                        <h3>Error Loading Memes</h3>
                        <p style="font-family: monospace; font-size: 0.875rem; color: var(--text-secondary);">${error.message}</p>
                        <button class="btn btn-view" onclick="adminPanel.loadMemes()">Retry</button>
                    </div>
                `;
            }
        }
    }

    setupRealTimeUpdates() {
        // FIX #5: Real-time updates with correct field name
        try {
            const memesRef = window.firebase.collection(this.db, 'memes');
            const q = window.firebase.query(memesRef, window.firebase.orderBy('createdAt', 'desc'));

            window.firebase.onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added' || change.type === 'modified' || change.type === 'removed') {
                        // Debounce reload to prevent multiple rapid updates
                        clearTimeout(this.reloadTimeout);
                        this.reloadTimeout = setTimeout(() => {
                            this.loadMemes();
                        }, 300);
                    }
                });
            }, (error) => {
                console.error('Real-time update error:', error);
            });
        } catch (error) {
            console.error('Failed to setup real-time updates:', error);
        }
    }

    updateStats() {
        const pending = this.memes.filter(m => m.status === 'pending').length;
        const approved = this.memes.filter(m => m.status === 'approved').length;
        const rejected = this.memes.filter(m => m.status === 'rejected').length;

        document.getElementById('pending-count').textContent = pending;
        document.getElementById('approved-count').textContent = approved;
        document.getElementById('rejected-count').textContent = rejected;

        document.getElementById('all-count').textContent = this.memes.length;
        document.getElementById('sidebar-pending-count').textContent = pending;
        document.getElementById('sidebar-approved-count').textContent = approved;
        document.getElementById('sidebar-rejected-count').textContent = rejected;
    }

    setFilter(filter) {
        this.currentFilter = filter;

        document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        if (filter === 'all') {
            this.filteredMemes = this.memes;
        } else {
            this.filteredMemes = this.memes.filter(meme => meme.status === filter);
        }

        this.renderMemes();
    }

    renderMemes() {
        const memeGrid = document.getElementById('meme-grid');

        if (this.filteredMemes.length === 0) {
            let message = '';
            switch (this.currentFilter) {
                case 'pending':
                    message = 'No pending memes to review. Great job! 🎉';
                    break;
                case 'approved':
                    message = 'No approved memes yet.';
                    break;
                case 'rejected':
                    message = 'No rejected memes.';
                    break;
                default:
                    message = 'No memes found.';
            }

            memeGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>${message}</h3>
                    <p style="color: var(--text-secondary); margin-top: 0.5rem;">
                        ${this.currentFilter === 'all' ? 'Memes will appear here once uploaded.' : ''}
                    </p>
                </div>
            `;
            return;
        }

        memeGrid.innerHTML = this.filteredMemes.map(meme => this.createMemeCard(meme)).join('');

        this.filteredMemes.forEach(meme => {
            const approveBtn = document.getElementById(`approve-${meme.id}`);
            const rejectBtn = document.getElementById(`reject-${meme.id}`);
            const viewBtn = document.getElementById(`view-${meme.id}`);

            if (approveBtn) {
                approveBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.approveMeme(meme.id);
                });
            }

            if (rejectBtn) {
                rejectBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.rejectMeme(meme.id);
                });
            }

            if (viewBtn) {
                viewBtn.addEventListener('click', () => this.openModal(meme));
            }
        });
    }

    createMemeCard(meme) {
        // FIX #1: Use createdAt field for date display
        const date = meme.createdAt;
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let statusClass = '';
        let statusText = '';

        switch (meme.status) {
            case 'pending':
                statusClass = 'status-pending';
                statusText = 'Pending';
                break;
            case 'approved':
                statusClass = 'status-approved';
                statusText = 'Approved';
                break;
            case 'rejected':
                statusClass = 'status-rejected';
                statusText = 'Rejected';
                break;
        }

        // FIX #3: Handle base64 images safely
        let imageSrc = meme.imageUrl || '';
        // Detect base64 and prepend data URL prefix if missing
        if (imageSrc) {
            if (imageSrc.startsWith('/9j/') || imageSrc.startsWith('/')) {
                // Likely JPEG base64
                imageSrc = `data:image/jpeg;base64,${imageSrc}`;
            } else if (imageSrc.startsWith('iVBOR')) {
                // PNG base64
                imageSrc = `data:image/png;base64,${imageSrc}`;
            } else if (imageSrc.startsWith('PHN2') || imageSrc.startsWith('PD94')) {
                // SVG base64
                imageSrc = `data:image/svg+xml;base64,${imageSrc}`;
            }
            // If it already has data: or http://, leave as-is
        }

        // Fallback image in case of error
        const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiMxNDE1MjIiLz48cGF0aCBkPSJNMTUwIDE1MEgyNTBWMjUwSDE1MFYxNTBaIiBmaWxsPSIjOTk0NUZGIi8+PHBhdGggZD0iTTEwMCAxMDBIMzAwVjMwMEgxMDBWMTAwWiIgc3Ryb2tlPSIjMDBEMUZGIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIyMDAiIHk9IjM1MCIgZm9udC1mYW1pbHk9IkludGVyIiBmb250LXNpemU9IjEyIiBmaWxsPSIjQTBBMEMwIiB0ZXh0LWFuY2hvcj9taWRkbGUiPk1lbWUgSW1hZ2U8L3RleHQ+PC9zdmc+';

        return `
            <div class="meme-card glass-card" data-meme-id="${meme.id}">
                <div class="meme-image-container" onclick="adminPanel.openModal(${JSON.stringify(meme).replace(/"/g, '&quot;')})">
                    <img src="${imageSrc || fallbackImage}" 
                         alt="Meme ${meme.id}" 
                         class="meme-image" 
                         loading="lazy"
                         onerror="this.src='${fallbackImage}'; this.onerror=null;">
                </div>
                
                <div class="meme-meta">
                    <div>
                        <div class="meme-id">ID: ${meme.id.substring(0, 8)}...</div>
                        <div class="meme-date">${formattedDate}</div>
                    </div>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                
                <div class="action-buttons">
                    ${meme.status === 'pending' ? `
                        <button class="btn btn-approve" id="approve-${meme.id}">Approve</button>
                        <button class="btn btn-reject" id="reject-${meme.id}">Reject</button>
                    ` : ''}
                    <button class="btn btn-view" id="view-${meme.id}">View</button>
                </div>
            </div>
        `;
    }

    openModal(meme) {
        this.currentMemeId = meme.id;
        const modal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');

        // FIX #3: Handle images in modal with same logic
        let imageSrc = meme.imageUrl || '';
        if (imageSrc) {
            if (imageSrc.startsWith('/9j/') || imageSrc.startsWith('/')) {
                imageSrc = `data:image/jpeg;base64,${imageSrc}`;
            } else if (imageSrc.startsWith('iVBOR')) {
                imageSrc = `data:image/png;base64,${imageSrc}`;
            } else if (imageSrc.startsWith('PHN2') || imageSrc.startsWith('PD94')) {
                imageSrc = `data:image/svg+xml;base64,${imageSrc}`;
            }
        }

        const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiMxNDE1MjIiLz48cGF0aCBkPSJNMjI1IDIyNUgzNzVWMzc1SDIyNVYyMjVaIiBmaWxsPSIjOTk0NUZGIi8+PHBhdGggZD0iTTE1MCAxNTBINDUwVjQ1MEgxNTBWMTUwWiIgc3Ryb2tlPSIjMDBEMUZGIiBzdHJva2Utd2lkdGg9IjMiLz48dGV4dCB4PSIzMDAiIHk9IjU0MCIgZm9udC1mYW1pbHk9IkludGVyIiBmb250LXNpemU9IjE2IiBmaWxsPSIjQTBBMEMwIiB0ZXh0LWFuY2hvcj9taWRkbGUiPlByZXZpZXcgSW1hZ2U8L3RleHQ+PC9zdmc+';

        modalImage.src = imageSrc || fallbackImage;
        modalImage.alt = `Meme ${meme.id}`;
        modalImage.onerror = function () {
            this.src = fallbackImage;
            this.onerror = null;
        };

        const approveBtn = document.getElementById('modal-approve');
        const rejectBtn = document.getElementById('modal-reject');

        if (meme.status === 'pending') {
            approveBtn.style.display = 'block';
            rejectBtn.style.display = 'block';
        } else {
            approveBtn.style.display = 'none';
            rejectBtn.style.display = 'none';
        }

        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('image-modal').classList.remove('active');
        this.currentMemeId = null;
    }

    async approveMeme(memeId) {
        if (!memeId) return;

        try {
            const memeRef = window.firebase.doc(this.db, 'memes', memeId);
            await window.firebase.updateDoc(memeRef, {
                status: 'approved',
                reviewedAt: new Date(),
                reviewedBy: 'admin'
            });

            // FIX #4: Immediate sync with public page
            this.showNotification('✅ Meme approved! Public wall updated.', 'success');
            this.closeModal();

            // Update local state immediately
            const memeIndex = this.memes.findIndex(m => m.id === memeId);
            if (memeIndex !== -1) {
                this.memes[memeIndex].status = 'approved';
                this.updateStats();
                if (this.currentFilter !== 'all') {
                    this.setFilter(this.currentFilter);
                }
            }

        } catch (error) {
            console.error('Error approving meme:', error);
            this.showNotification('❌ Failed to approve meme', 'error');
        }
    }

    async rejectMeme(memeId) {
        if (!memeId) return;

        try {
            const memeRef = window.firebase.doc(this.db, 'memes', memeId);
            await window.firebase.updateDoc(memeRef, {
                status: 'rejected',
                reviewedAt: new Date(),
                reviewedBy: 'admin'
            });

            this.showNotification('✅ Meme rejected successfully!', 'success');
            this.closeModal();

            // Update local state immediately
            const memeIndex = this.memes.findIndex(m => m.id === memeId);
            if (memeIndex !== -1) {
                this.memes[memeIndex].status = 'rejected';
                this.updateStats();
                if (this.currentFilter !== 'all') {
                    this.setFilter(this.currentFilter);
                }
            }

        } catch (error) {
            console.error('Error rejecting meme:', error);
            this.showNotification('❌ Failed to reject meme', 'error');
        }
    }

    async bulkApprove() {
        const pendingMemes = this.memes.filter(m => m.status === 'pending');

        if (pendingMemes.length === 0) {
            this.showNotification('ℹ️ No pending memes to approve', 'info');
            return;
        }

        if (!confirm(`Approve all ${pendingMemes.length} pending memes?`)) {
            return;
        }

        try {
            const batchPromises = pendingMemes.map(meme => {
                const memeRef = window.firebase.doc(this.db, 'memes', meme.id);
                return window.firebase.updateDoc(memeRef, {
                    status: 'approved',
                    reviewedAt: new Date(),
                    reviewedBy: 'admin'
                });
            });

            await Promise.all(batchPromises);

            // FIX #4: Update all memes at once for immediate sync
            this.memes.forEach(meme => {
                if (meme.status === 'pending') {
                    meme.status = 'approved';
                }
            });

            this.showNotification(`✅ Approved ${pendingMemes.length} memes! Public wall updated.`, 'success');
            this.updateStats();
            if (this.currentFilter !== 'all') {
                this.setFilter(this.currentFilter);
            }

        } catch (error) {
            console.error('Error in bulk approval:', error);
            this.showNotification('❌ Failed to approve all memes', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `glass-card`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            border-left: 4px solid ${type === 'success' ? 'var(--accent-green)' : type === 'error' ? '#ef4444' : 'var(--accent-cyan)'};
            max-width: 400px;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                <div style="font-size: 1.25rem; flex-shrink: 0;">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                </div>
                <div style="flex-grow: 1;">
                    <div style="font-size: 0.875rem; color: var(--text-primary);">${message}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);

        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new MemeAdminPanel();
});