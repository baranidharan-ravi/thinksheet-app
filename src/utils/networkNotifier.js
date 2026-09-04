/**
 * networkNotifier.js
 *
 * Lightweight, DOM-injected retry notification banner.
 * No React required — mounts a single <div> into document.body
 * so it works from any service / utility module.
 */

const TOAST_ID = 'thinksheet-network-toast';
const TOAST_Z = 99999;

function getOrCreateToast() {
	let el = document.getElementById(TOAST_ID);
	if (!el) {
		el = document.createElement('div');
		el.id = TOAST_ID;
		Object.assign(el.style, {
			position: 'fixed',
			bottom: '24px',
			left: '50%',
			transform: 'translateX(-50%)',
			zIndex: String(TOAST_Z),
			display: 'none',
			maxWidth: '480px',
			width: '90vw',
			padding: '14px 20px',
			borderRadius: '16px',
			fontFamily:
				'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
			fontSize: '14px',
			fontWeight: '600',
			lineHeight: '1.4',
			boxShadow: '0 12px 36px rgba(0,0,0,0.45)',
			transition: 'opacity 0.25s ease, transform 0.25s ease',
			opacity: '0',
			pointerEvents: 'auto',
			cursor: 'default',
		});
		document.body.appendChild(el);
	}
	return el;
}

let hideTimer = null;

/**
 * Show a network retry notification.
 * @param {string} message  - User-facing message
 * @param {'warning'|'error'|'success'} type
 * @param {number} [autoDismissMs]  - ms before auto-hide (0 = stay until dismissed)
 */
export function showNetworkNotification(
	message,
	type = 'warning',
	autoDismissMs = 0,
) {
	if (typeof window === 'undefined' || typeof document === 'undefined') return;

	const el = getOrCreateToast();

	const themes = {
		warning: {
			bg: 'linear-gradient(135deg, #78350f, #b45309)',
			border: '#f59e0b',
			icon: '📡',
		},
		error: {
			bg: 'linear-gradient(135deg, #7f1d1d, #b91c1c)',
			border: '#f87171',
			icon: '⚠️',
		},
		success: {
			bg: 'linear-gradient(135deg, #064e3b, #059669)',
			border: '#34d399',
			icon: '✅',
		},
	};

	const { bg, border, icon } = themes[type] || themes.warning;

	el.style.background = bg;
	el.style.border = `2px solid ${border}`;
	el.style.color = '#ffffff';
	el.innerHTML = `
		<div style="display:flex;align-items:center;gap:10px;width:100%;">
			<span style="font-size:18px;line-height:1;flex-shrink:0;">${icon}</span>
			<span style="flex:1;">${message}</span>
			<button id="thinksheet-toast-close" style="background:transparent;border:none;color:#ffffff;font-size:18px;cursor:pointer;opacity:0.8;margin-left:4px;" aria-label="Dismiss">&times;</button>
		</div>
	`;

	const closeBtn = el.querySelector('#thinksheet-toast-close');
	if (closeBtn) {
		closeBtn.onclick = () => hideNetworkNotification();
	}

	el.style.display = 'flex';
	requestAnimationFrame(() => {
		el.style.opacity = '1';
		el.style.transform = 'translateX(-50%) translateY(0)';
	});

	if (hideTimer) clearTimeout(hideTimer);
	if (autoDismissMs > 0) {
		hideTimer = setTimeout(() => hideNetworkNotification(), autoDismissMs);
	}
}

export function hideNetworkNotification() {
	if (typeof document === 'undefined') return;
	const el = document.getElementById(TOAST_ID);
	if (!el) return;
	el.style.opacity = '0';
	el.style.transform = 'translateX(-50%) translateY(10px)';
	setTimeout(() => {
		el.style.display = 'none';
	}, 250);
}

// Global browser connectivity listeners
if (typeof window !== 'undefined') {
	window.addEventListener('offline', () => {
		showNetworkNotification(
			'A network drop happened. Waiting for connection to restore...',
			'warning',
		);
	});

	window.addEventListener('online', () => {
		showNetworkNotification(
			'Network connection restored! Back online.',
			'success',
			4000,
		);
	});
}
