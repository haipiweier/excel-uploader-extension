// 定义百度网站的源地址
const GOOGLE_ORIGIN = 'https://www.baidu.com';

// 设置侧边栏行为，当动作被点击时打开侧边栏
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

// 添加一个监听器，用于监听标签页更新事件
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    // 如果标签页的URL未定义，则忽略
    if (!tab.url) return;
    // 解析标签页的URL
    const url = new URL(tab.url);
    // 在百度网站上启用侧边栏
    if (url.origin === GOOGLE_ORIGIN) {
        await chrome.sidePanel.setOptions({
            tabId,
            path: 'sidepanel.html',
            enabled: true
        });
    } else {
        // 在其他所有网站上禁用侧边栏
        await chrome.sidePanel.setOptions({
            tabId,
            enabled: false
        });
    }
});

// 监听所有的网络请求
chrome.webRequest.onCompleted.addListener(
    function(details) {
        if (details.url.includes("/api/userinfo")) {
            fetch(details.url)
                .then(response => response.json())
                .then(data => {
                    // 发送消息给content script
                    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: "userinfo", data: data });
                    });
                });
        }
    },
    { urls: ["<all_urls>"] }
);