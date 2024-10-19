/**
 * AESUtil类提供了AES加密和解密的方法
 */
class AESUtil {
    /**
     * 加密给定的明文
     * @param {string} seed - 用于生成加密密钥的种子
     * @param {string} cleartext - 需要加密的明文
     * @returns {Promise<string>} - 返回加密后的密文（以十六进制字符串形式）
     */
    static async encrypt(seed, cleartext) {
        // 生成原始密钥
        const rawKey = await this.getRawKey(seed);
        // 将明文编码为Uint8Array
        const encodedText = new TextEncoder().encode(cleartext);
        // 使用AES-CBC算法和随机IV进行加密
        const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-CBC", iv: this.getIV() },
            rawKey,
            encodedText
        );
        // 将加密结果转换为十六进制字符串并返回
        return this.toHex(new Uint8Array(encrypted));
    }

    /**
     * 解密给定的密文
     * @param {string} seed - 用于生成解密密钥的种子
     * @param {string} encryptedHex - 需要解密的密文（以十六进制字符串形式）
     * @returns {Promise<string|null>} - 返回解密后的明文，如果输入无效则返回null
     */
    static async decrypt(seed, encryptedHex) {
        if (!seed || !encryptedHex) {
            return null;
        }
        // 生成原始密钥
        const rawKey = await this.getRawKey(seed);
        // 将密文从十六进制字符串转换为Uint8Array
        const encryptedBytes = this.toByte(encryptedHex);
        // 使用AES-CBC算法和随机IV进行解密
        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-CBC", iv: this.getIV() },
            rawKey,
            encryptedBytes
        );
        // 将解密结果解码为字符串并返回
        return new TextDecoder().decode(decrypted);
    }

    /**
     * 生成AES加密/解密用的原始密钥
     * @param {string} seed - 用于生成密钥的种子
     * @returns {Promise<SubtleCryptoCryptoKey>} - 返回生成的密钥
     */
    static async getRawKey(seed) {
        // 对种子进行SHA-256哈希以生成密钥材料
        const hash = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
        // 将哈希结果导入为AES-CBC算法的密钥
        const key = await window.crypto.subtle.importKey(
            "raw",
            hash,
            { name: "AES-CBC" },
            false,
            ["encrypt", "decrypt"]
        );
        return key;
    }

    /**
     * 生成AES-CBC算法所需的初始化向量（IV）
     * @returns {Uint8Array} - 返回16字节的随机IV
     */
    static getIV() {
        return window.crypto.getRandomValues(new Uint8Array(16)); // AES-CBC requires a 16-byte IV
    }

    /**
     * 将二进制缓冲区转换为十六进制字符串
     * @param {ArrayBuffer} buffer - 需要转换的二进制缓冲区
     * @returns {string} - 返回转换后的十六进制字符串
     */
    static toHex(buffer) {
        return Array.from(buffer)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    /**
     * 将十六进制字符串转换为二进制缓冲区
     * @param {string} hexString - 需要转换的十六进制字符串
     * @returns {Uint8Array} - 返回转换后的二进制缓冲区
     */
    static toByte(hexString) {
        const result = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < result.length; i++) {
            result[i] = parseInt(hexString.substr(i * 2, 2), 16);
        }
        return result;
    }
}
