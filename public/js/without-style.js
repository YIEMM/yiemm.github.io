document.addEventListener('DOMContentLoaded', function() {
    // 获取body元素
    const bodyElement = document.body;
    
    // 检查body是否已经有id属性，且值不是'write'
    if (!bodyElement.id || bodyElement.id !== 'write') {
        // 为body设置id='write'
        bodyElement.id = 'write';
    } else {
        return;
    }
});