// 侧边目录切换功能
// 声明为全局变量以便其他脚本访问
window.sidebar = document.querySelector('.sidebar');
window.sidebarToggle = document.querySelector('.sidebar-toggle');
window.sidebarIcon = sidebarToggle.querySelector('i');

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