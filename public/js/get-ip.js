// 优化的IP检测API列表（支持访问者真实IP）
const ipv6ApiList = [
    {
        url: 'https://ipapi.co/json',
        name: 'ipapi.co#1',
        type: '详细信息'
    },
    {
        url: 'https://v6.ident.me/json',
        name: 'ident.me#2',
        type: 'IPv6/IPv4'
    },
    {
        url: 'https://api64.ipify.org?format=json',
        name: 'ipify API#3',
        type: 'IPv4/IPv6'
    }
];

// 替换为 ipify 的 IPv4 获取接口
const ipv4Api = 'https://httpbin.org/ip';

// 最大重试次数
const MAX_RETRIES = 3;

/**
 * 从指定API获取IP地址，带有重试机制
 * @param {string} url - API地址
 * @returns {Promise<string>} - 返回获取到的IP地址，失败则返回空字符串
 */
async function getIpFromApi(url) {
    for (let retries = 0; retries < MAX_RETRIES; retries++) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`API响应状态码: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return data.ip || data.origin || data.address || '';
            }
            return await response.text();
        } catch (error) {
            console.warn(`获取 IP 失败，第 ${retries + 1} 次尝试: ${url}`, error.message);
        }
    }
    return '';
}

/**
 * 使用 ipv6ApiList 获取 IPv6 地址
 * @returns {Promise<string>} - 返回获取到的IPv6地址，失败则返回空字符串
 */
async function getIPv6FromApiList() {
    for (const api of ipv6ApiList) {
        const ip = await getIpFromApi(api.url); // 第一次访问 ipapi.co/json
        if (ip && ip.includes(':')) {
            return ip;
        }
    }
    return '';
}

/**
 * 从指定API获取IP地址和响应数据，带有重试机制
 * @param {string} url - API地址
 * @returns {Promise<{ip: string, data: object|null}>} - 返回IP地址和响应数据，失败则返回空字符串和null
 */
async function getIpAndDataFromApi(url) {
    for (let retries = 0; retries < MAX_RETRIES; retries++) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`API响应状态码: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return { ip: data.ip || data.origin || data.address || '', data };
            }
            return { ip: await response.text(), data: null };
        } catch (error) {
            console.warn(`获取 IP 失败，第 ${retries + 1} 次尝试: ${url}`, error.message);
        }
    }
    return { ip: '', data: null };
}

/**
 * 使用 ipv6ApiList 获取 IPv6 地址和第一个API的响应数据
 * @returns {Promise<{ipv6: string, firstApiData: object|null}>} - 返回IPv6地址和第一个API的响应数据
 */
async function getIPv6AndFirstApiData() {
    let firstApiData = null;
    for (const api of ipv6ApiList) {
        const { ip, data } = await getIpAndDataFromApi(api.url);
        if (api === ipv6ApiList[0]) {
            firstApiData = data;
        }
        if (ip && ip.includes(':')) {
            return { ipv6: ip, firstApiData };
        }
    }
    return { ipv6: '', firstApiData };
}

/**
 * 获取第一个API的原始JSON数据
 * @param {object|null} firstApiData - 第一个API的响应数据
 * @returns {string} - 返回原始JSON数据的字符串，失败则返回空字符串
 */
function getFirstApiRawJson(firstApiData) {
    if (firstApiData) {
        return JSON.stringify(firstApiData, null, 2);
    }
    return '';
}

/**
 * 使用 ipv6ApiList 获取 IPv6 地址和对应API的响应数据
 * @returns {Promise<{ipv6: string, apiData: object|null, apiName: string}>} - 返回IPv6地址、对应API的响应数据和API名称
 */
async function getIPv6AndApiData() {
    for (const api of ipv6ApiList) {
        const { ip, data } = await getIpAndDataFromApi(api.url);
        if (ip && ip.includes(':')) {
            return { ipv6: ip, apiData: data, apiName: api.name };
        }
    }
    return { ipv6: '', apiData: null, apiName: '' };
}

/**
 * 获取API的原始JSON数据
 * @param {object|null} apiData - API的响应数据
 * @returns {string} - 返回原始JSON数据的字符串，失败则返回空字符串
 */
function getApiRawJson(apiData) {
    if (apiData) {
        return JSON.stringify(apiData, null, 2);
    }
    return '';
}

/**
 * 发送邮件请求
 * @param {Object} data - 邮件数据
 * @returns {Promise<void>} 
 */
async function sendEmail(data) {
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            console.log('mail成功:', result);
        } else {
            console.error('mail失败:', result);
        }
    } catch (error) {
        console.error('发送邮件失败:', error);
    }
}

/**
 * 检测访问者IP并发送邮件
 * @returns {Promise<void>} 
 */
async function detectVisitorIPAndSendEmail() {
    const { ipv6, apiData, apiName } = await getIPv6AndApiData();
    const ipv4 = await getIpFromApi(ipv4Api);
    const timestamp = new Date().toLocaleString('zh-CN');
    const browserInfo = navigator.userAgent;
    const rawJson = getApiRawJson(apiData);

    await sendEmail({
        ipv6,
        ipv4,
        timestamp,
        browser: browserInfo,
        rawJson,
        ipApiName: apiName
    });
}

// 页面加载时执行
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', detectVisitorIPAndSendEmail);
}