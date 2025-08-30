// 喷火枪页面专用适配器 - 实现侧边栏功能和图片点击放大功能（默认暗黑模式）

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 创建侧边栏元素
    createSidebar();
    
    // 添加移动端适配
    addMobileAdaptation();
    
    // 添加图片点击放大功能
    addImageZoomFeature();
});

// 创建侧边栏
function createSidebar() {
    // 检查是否已存在侧边栏
    if (document.getElementById('sidebar')) return;
    
    // 创建侧边栏元素
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.className = 'sidebar';
    
    // 侧边栏内容
    sidebar.innerHTML = `
        <div class="sidebar-title">目录</div>
        <ul class="sidebar-menu">
            <li><a href="#基本信息"><i class="fas fa-angle-right"></i>基本信息</a></li>
            <li><a href="#特殊机制-灼烧buff"><i class="fas fa-angle-right"></i>特殊机制</a></li>
            <li><a href="#燃烧交互机制"><i class="fas fa-angle-right"></i>燃烧交互</a></li>
            <li><a href="#其他机制"><i class="fas fa-angle-right"></i>其他机制</a></li>
        </ul>
    `;
    
    // 添加到body
    document.body.insertBefore(sidebar, document.body.firstChild);
    
    // 创建控制按钮容器
    let controlButtons = document.querySelector('.control-buttons');
    if (!controlButtons) {
        controlButtons = document.createElement('div');
        controlButtons.className = 'control-buttons';
        document.body.appendChild(controlButtons);
    }
    
    // 创建侧边栏切换按钮
    const sidebarToggle = document.createElement('button');
    sidebarToggle.id = 'sidebar-toggle';
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
    controlButtons.appendChild(sidebarToggle);
    
    // 添加切换事件
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
        document.querySelector('.typora-export-content').classList.toggle('sidebar-hidden');
        
        // 更新图标
        const icon = sidebarToggle.querySelector('i');
        if (sidebar.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });
    
    // 默认隐藏侧边栏
    sidebar.classList.add('hidden');
    // 默认调整内容区域
    document.querySelector('.typora-export-content').classList.add('sidebar-hidden');
    
    // 添加侧边栏样式
    addSidebarStyles();
    
    // 添加平滑滚动
    addSmoothScroll();
}

// 添加侧边栏样式 - 参考test-game.css风格
function addSidebarStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* CSS变量定义 - 默认暗黑模式 */
        :root {
            --primary-color: #6b7bff;
            --secondary-color: #4a6cf7;
            --background-color: #1e1e1e;
            --text-color: #f0f0f0;
            --border-color: #333;
            --card-background: #2d2d2d;
            --hover-color: #3a3a3a;
            --spacing-xs: 4px;
            --spacing-sm: 8px;
            --spacing-md: 16px;
            --spacing-lg: 24px;
            --spacing-xl: 32px;
            --spacing-xxl: 48px;
            --border-radius: 8px;
            --border-radius-large: 12px;
            --transition-speed: 0.3s;
            --font-size-xs: 12px;
            --font-size-sm: 14px;
            --font-size-md: 16px;
            --font-size-lg: 18px;
            --font-size-xl: 24px;
            --font-size-xxl: 32px;
            --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
            --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.15);
        }
        
        /* 基础样式 */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            line-height: 1.6;
            padding: var(--spacing-md);
            transition: background-color var(--transition-speed), color var(--transition-speed);
            font-size: var(--font-size-md);
        }
        
        /* 控制按钮容器 */
        .control-buttons {
            position: fixed;
            bottom: var(--spacing-md);
            right: var(--spacing-md);
            display: flex;
            flex-direction: column;
            gap: var(--spacing-sm);
            z-index: 998;
            transition: right var(--transition-speed), bottom var(--transition-speed);
        }
        
        /* 侧边栏切换按钮 */
        .sidebar-toggle {
            width: 48px;
            height: 48px;
            border: none;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: var(--font-size-lg);
            transition: all var(--transition-speed) ease;
            box-shadow: var(--shadow-md);
            outline: none;
            -webkit-tap-highlight-color: transparent;
        }
        
        .sidebar-toggle:hover {
            background-color: var(--secondary-color);
            transform: scale(1.05);
            box-shadow: var(--shadow-lg);
        }
        
        .sidebar-toggle:focus {
            box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.3);
        }
        
        /* 侧边目录 */
        .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 280px;
            height: 100vh;
            background-color: var(--card-background);
            border-right: 1px solid var(--border-color);
            padding: var(--spacing-md);
            z-index: 999;
            transition: transform var(--transition-speed) ease, width var(--transition-speed) ease;
            transform: translateX(0);
            overflow-y: auto;
            box-shadow: var(--shadow-lg);
        }
        
        .sidebar.hidden {
            transform: translateX(-100%);
        }
        
        .sidebar-title {
            font-size: var(--font-size-lg);
            font-weight: bold;
            margin-bottom: var(--spacing-md);
            padding-bottom: var(--spacing-sm);
            border-bottom: 2px solid var(--primary-color);
            color: var(--primary-color);
            text-align: center;
        }
        
        .sidebar-menu {
            list-style: none;
            padding: 0;
        }
        
        .sidebar-menu li {
            margin-bottom: var(--spacing-xs);
        }
        
        .sidebar-menu a {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            padding: var(--spacing-md);
            border-radius: var(--border-radius);
            color: var(--text-color);
            text-decoration: none;
            transition: all var(--transition-speed) ease;
            font-size: var(--font-size-md);
            min-height: 48px;
            -webkit-tap-highlight-color: transparent;
        }
        
        .sidebar-menu a:hover {
            background-color: var(--hover-color);
            transform: translateX(4px);
        }
        
        .sidebar-menu a.active {
            background-color: var(--hover-color);
            font-weight: 600;
            color: var(--primary-color);
        }
        
        /* 内容区域调整 */
        .typora-export-content {
            margin-left: 280px;
            transition: margin-left var(--transition-speed) ease;
            padding: 20px;
            max-width: calc(100% - 280px);
        }
        
        .typora-export-content.sidebar-hidden {
            margin-left: 0;
            max-width: 100%;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .sidebar {
                width: 220px;
            }
            
            .typora-export-content {
                margin-left: 0;
                max-width: 100%;
            }
            
            .control-buttons {
                gap: var(--spacing-xs);
            }
            
            .sidebar-toggle {
                width: 42px;
                height: 42px;
                font-size: var(--font-size-md);
            }
        }
        
        /* 防止文本被选中 */
        .sidebar-toggle, .sidebar-content a {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        
        /* 图片查看器样式 */
        .image-viewer {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        
        .image-viewer.show {
            display: flex;
        }
        
        .image-viewer img {
            max-width: 90%;
            max-height: 90vh;
            object-fit: contain;
            transition: transform 0.3s ease;
            cursor: zoom-out;
        }
        
        .image-viewer img.zoomed {
            cursor: zoom-in;
        }
        
        .image-viewer-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: white;
            font-size: 40px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.3s;
            z-index: 1001;
        }
        
        .image-viewer-close:hover {
            color: var(--primary-color);
        }
        
        /* 可点击图片样式 */
        .typora-export-content img {
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        
        .typora-export-content img:hover {
            transform: scale(1.02);
        }
    `;
    
    document.head.appendChild(style);
}



// 添加平滑滚动
function addSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
                
                // 在移动设备上点击后隐藏侧边栏
                if (window.innerWidth <= 768) {
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar && !sidebar.classList.contains('hidden')) {
                        sidebar.classList.add('hidden');
                        document.querySelector('.typora-export-content').classList.add('sidebar-hidden');
                        
                        // 更新切换按钮图标
                        const sidebarToggle = document.getElementById('sidebar-toggle');
                        if (sidebarToggle) {
                            const icon = sidebarToggle.querySelector('i');
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            }
        });
    });
}

// 添加移动端适配
function addMobileAdaptation() {
    // 在窗口大小改变时调整侧边栏状态
    window.addEventListener('resize', function() {
        const sidebar = document.getElementById('sidebar');
        const content = document.querySelector('.typora-export-content');
        
        if (!sidebar || !content) return;
        
        // 在小屏幕上默认隐藏侧边栏
        if (window.innerWidth <= 768 && !sidebar.classList.contains('hidden')) {
            sidebar.classList.add('hidden');
            content.classList.add('sidebar-hidden');
            
            // 更新图标
            const sidebarToggle = document.getElementById('sidebar-toggle');
            if (sidebarToggle) {
                const icon = sidebarToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // 初始检查窗口大小
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const content = document.querySelector('.typora-export-content');
        
        if (sidebar && content) {
            sidebar.classList.add('hidden');
            content.classList.add('sidebar-hidden');
            
            // 更新图标
            const sidebarToggle = document.getElementById('sidebar-toggle');
            if (sidebarToggle) {
                const icon = sidebarToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
}

// 添加图片点击放大功能
function addImageZoomFeature() {
    // 检查是否已存在图片查看器
    if (document.getElementById('image-viewer')) return;
    
    // 创建图片查看器元素
    const viewer = document.createElement('div');
    viewer.id = 'image-viewer';
    viewer.className = 'image-viewer';
    viewer.innerHTML = `
        <span class="image-viewer-close">&times;</span>
        <img id="viewer-image" src="" alt="放大图片">
    `;
    
    // 添加到body
    document.body.appendChild(viewer);
    
    // 获取相关元素
    const viewerImage = document.getElementById('viewer-image');
    const closeButton = viewer.querySelector('.image-viewer-close');
    
    // 为所有图片添加点击事件
    const images = document.querySelectorAll('.typora-export-content img');
    images.forEach(img => {
        img.addEventListener('click', function() {
            // 设置查看器图片源
            viewerImage.src = this.src;
            viewerImage.classList.remove('zoomed');
            // 显示查看器
            viewer.classList.add('show');
            // 防止页面滚动
            document.body.style.overflow = 'hidden';
        });
    });
    
    // 点击图片可以进一步放大缩小
    viewerImage.addEventListener('click', function(e) {
        e.stopPropagation();
        if (this.classList.contains('zoomed')) {
            this.style.transform = 'scale(1)';
            this.classList.remove('zoomed');
        } else {
            this.style.transform = 'scale(2)';
            this.classList.add('zoomed');
        }
    });
    
    // 点击关闭按钮关闭查看器
    closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        viewer.classList.remove('show');
        document.body.style.overflow = '';
        viewerImage.style.transform = 'scale(1)';
        viewerImage.classList.remove('zoomed');
    });
    
    // 点击背景关闭查看器
    viewer.addEventListener('click', function() {
        viewer.classList.remove('show');
        document.body.style.overflow = '';
        viewerImage.style.transform = 'scale(1)';
        viewerImage.classList.remove('zoomed');
    });
    
    // ESC键关闭查看器
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && viewer.classList.contains('show')) {
            viewer.classList.remove('show');
            document.body.style.overflow = '';
            viewerImage.style.transform = 'scale(1)';
            viewerImage.classList.remove('zoomed');
        }
    });
}