// 监听来自background script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // 检查消息动作是否为 userinfo
    if (request.action === "userinfo") {
        // 将用户信息数据暴露给页面
        window.postMessage({ type: 'USER_INFO', data: request.data }, '*');
    }
});
