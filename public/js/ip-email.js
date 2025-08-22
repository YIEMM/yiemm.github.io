// 优化的IP检测API列表（支持访问者真实IP）
const ipApiList = [
    {
        url: 'https://v6.ident.me/json',
        name: 'ident.me (IPv6优先)',
        type: 'IPv6/IPv4'
    },
    {
        url: 'https://api.ipify.org?format=json',
        name: 'ipify API',
        type: 'IPv4/IPv6'
    },
    {
        url: 'https://ipapi.co/json',
        name: 'ipapi.co (详细信息)',
        type: '详细信息'
    },
    {
        url: 'https://httpbin.org/ip',
        name: 'httpbin.org',
        type: '基础IP'
    },
    {
        url: 'https://api.myip.com',
        name: 'myip.com',
        type: '国家信息'
    }
];

async function detectVisitorIPAndSendEmail() {
    for (let i = 0; i < ipApiList.length; i++) {
        const api = ipApiList[i];
        try {
            const response = await fetch(api.url, { 
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) continue;
            
            const data = await response.json();
            const ip = data.ip || data.origin || data.address || '';
            const timestamp = new Date().toLocaleString('zh-CN');
            const browserInfo = navigator.userAgent;
            const rawJson = JSON.stringify(data, null, 2);

            // 发送邮件
            try {
                const response = await fetch('/api/send-email', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ip: ip,
                        timestamp: timestamp,
                        browser: browserInfo,
                        rawJson: rawJson
                    })
                });
                const result = await response.json();
                if (response.ok) {
                    console.log('mail成功:', result);
                } else {
                    console.error('mail失败:', result);
                }
            } catch (emailError) {
                console.error('失败:', emailError);
            }
            
            return;
            
        } catch (error) {
            console.warn(`${api.name} 失败:`, error.message);
            continue;
        }
    }
    console.error('errrrrror');
}

// 页面加载时执行
document.addEventListener('DOMContentLoaded', detectVisitorIPAndSendEmail);