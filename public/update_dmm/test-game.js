
// 暗黑模式切换功能
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;

// 检查本地存储中的主题偏好
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// 切换主题
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // 保存主题偏好到本地存储
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // 更新按钮图标
    if (isDarkMode) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});

// 侧边目录切换功能
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarIcon = sidebarToggle.querySelector('i');

// 初始化侧边栏图标
if (sidebar.classList.contains('hidden')) {
    sidebarIcon.classList.remove('fa-times');
    sidebarIcon.classList.add('fa-bars');
} else {
    sidebarIcon.classList.remove('fa-bars');
    sidebarIcon.classList.add('fa-times');
}

// 切换侧边栏显示/隐藏
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    
    // 更新按钮图标
    if (sidebar.classList.contains('hidden')) {
        sidebarIcon.classList.remove('fa-times');
        sidebarIcon.classList.add('fa-bars');
    } else {
        sidebarIcon.classList.remove('fa-bars');
        sidebarIcon.classList.add('fa-times');
    }
});

// 平滑滚动功能
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // 在移动设备上隐藏侧边栏
            if (window.innerWidth <= 768 && !sidebar.classList.contains('hidden')) {
                sidebar.classList.add('hidden');
                sidebarIcon.classList.remove('fa-times');
                sidebarIcon.classList.add('fa-bars');
            }
            
            // 平滑滚动到目标元素
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 移动端适配 - 点击外部区域关闭侧边栏
document.addEventListener('click', (e) => {
    // 检查是否在移动设备上
    if (window.innerWidth <= 768) {
        // 如果点击的不是侧边栏、切换按钮或其子元素，且侧边栏是打开的
        if (!sidebar.contains(e.target) && 
            !sidebarToggle.contains(e.target) && 
            !sidebar.classList.contains('hidden')) {
            sidebar.classList.add('hidden');
            sidebarIcon.classList.remove('fa-times');
            sidebarIcon.classList.add('fa-bars');
        }
    }
});

// 窗口大小改变时调整侧边栏状态
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        // 在大屏幕上，如果侧边栏本来不是默认隐藏的，显示它
        if (!sidebar.classList.contains('hidden')) {
            sidebar.classList.remove('hidden');
            sidebarIcon.classList.remove('fa-bars');
            sidebarIcon.classList.add('fa-times');
        }
    }
});

// 为触摸设备添加双击缩放限制 - 修复版
let lastTouchX = 0;
let lastTouchY = 0;
document.addEventListener('touchmove', function(e) {
    // 只在多点触摸且有缩放意图时阻止默认行为
    if (e.touches.length > 1) {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = Math.abs(currentX - lastTouchX);
        const deltaY = Math.abs(currentY - lastTouchY);
        
        // 判断是否主要是缩放操作而不是滚动操作
        if (e.scale !== 1 && deltaX < deltaY * 2) {
            e.preventDefault();
        }
        
        lastTouchX = currentX;
        lastTouchY = currentY;
    }
}, { passive: false });

// 防止页面在移动端被拖动
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);
    