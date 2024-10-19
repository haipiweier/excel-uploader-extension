/**
 * 异步获取签名
 *
 * 该函数用于生成一个加密的签名，该签名用于后续的API调用或其他安全验证过程
 * 它首先构造一个明文签名，然后使用AES加密算法进行加密
 * 如果加密过程中遇到错误，它会将错误信息输出到控制台
 */
async function getSign() {
    // 用户ID通过前端页面获取
    // 客户端ID，用于标识用户，通过当前登录的页面自动获取id
    const clientId = "ad0955cf504b443c8333df2f641f097d"; // 客户端ID，用于标识用户
    const timeStamp = Date.now(); // 当前时间戳，用于防止重放攻击
    const cleartext = clientId + timeStamp; // 明文签名，由客户端ID和时间戳拼接而成
    const seed = "your-secret-key"; // 替换为你的密钥，用于AES加密

    try {
        // 使用AES加密工具对明文签名进行加密，生成最终的签名
        const sign = await AESUtil.encrypt(seed, cleartext);
        return sign;
    } catch (e) {
        console.error(e); // 输出错误信息到控制台
    }
}
