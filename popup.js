// 当文件输入框的值改变时触发事件处理函数
document.getElementById('fileInput').addEventListener('change', (event) => {
    const files = event.target.files;
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    if (files.length > 0) {
        let fileNames = Array.from(files).map(file => file.name).join('\n'); // 使用换行符连接文件名
        fileNameDisplay.textContent = fileNames;
    } else {
        fileNameDisplay.textContent = '';
    }
});

// 当点击上传按钮时触发事件处理函数
document.getElementById('uploadButton').addEventListener('click', async (event) => {
    const files = document.getElementById('fileInput').files;
    if (files.length === 0) {
        document.getElementById('validationStatus').textContent = '请选择文件';
        return;
    }

    const uploadUrl = 'https://your-server-endpoint.com/upload'; // 替换为您的服务器端点

    for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log('文件上传成功:', data);

                // 添加上传记录
                const recordsContainer = document.getElementById('recordsContainer');
                const record = document.createElement('div');
                record.className = 'record';
                record.innerHTML = `
          <div class="info">${file.name}</div>
          <div class="actions">
            <span class="edit">编辑</span>
            <span class="delete">删除</span>
          </div>
        `;
                recordsContainer.appendChild(record);

                // 显示上传成功的提示
                document.getElementById('status').classList.add('success');
                document.getElementById('status').textContent = '文件上传成功';

                // 清空文件输入框
                document.getElementById('fileInput').value = '';
                document.getElementById('fileNameDisplay').textContent = '';
            } else {
                const errorData = await response.json();
                console.error('文件上传失败:', errorData);
                document.getElementById('status').textContent = '文件上传失败';
            }
        } catch (error) {
            console.error('文件上传出错:', error);
            document.getElementById('status').textContent = '文件上传出错';
        }
    }

    // 清除验证状态
    document.getElementById('validationStatus').textContent = '';
});
document.getElementById('uploadBtn').addEventListener('click', function() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('请选择要上传的Excel文件！');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

        // 假设第一行为表头，第二行开始为数据
        const headers = jsonData[0];
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            const productInfo = {};

            // 根据实际需求映射Excel列到API请求参数
            for (let j = 0; j < headers.length; j++) {
                productInfo[headers[j]] = row[j];
            }

            // 准备其他必要参数...
            const dataToSend = {
                productTypeNumber: '01',
                templeteId: 'your-template-id',  // 替换为实际值
                productName: productInfo['产品名称'],
                photos: ['base64编码字符串'],  // 实现图片转Base64的功能
                productTypelist: [{
                    type: '生产',
                    list: [
                        { name: '产品型号', info: productInfo['产品型号'] },
                        { name: '额定电压', info: productInfo['额定电压'] },
                        { name: '产品规格', info: productInfo['产品规格'] },
                        { name: '监管类别', info: productInfo['监管类别'] },
                        { name: '生产企业名称', info: productInfo['生产企业名称'] },
                        { name: '生产企业地址', info: productInfo['生产企业地址'] },
                        { name: '证书编号', info: productInfo['证书编号'] },
                        { name: '制造设备编码', info: productInfo['制造设备编码'] },
                        { name: '委托企业名称', info: productInfo['委托企业名称'] },
                        { name: '委托企业地址', info: productInfo['委托企业地址'] }
                    ]
                }]
            };

            // 构造URL和签名
            const clientId = productInfo['客户ID'];
            const timeStamp = Date.now();
            const sign = generateSign(clientId, timeStamp);  // 请根据附录2提供的规则生成签名

            const url = `http://www.iotroot.com:8080/interface/company/returnProduct/clientId=${clientId}/timeStamp=${timeStamp}/sign=${sign}`;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            })
                .then(response => response.json())
                .then(result => {
                    if (result.status === 200) {
                        document.getElementById('status').textContent += '成功！\n';
                    } else {
                        document.getElementById('status').textContent += `错误: ${result.status}\n`;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('status').textContent += '请求失败，请重试。\n';
                });
        }
    };
    reader.readAsArrayBuffer(file);
});

// 签名生成函数示例（请根据实际签名生成规则进行调整）
function generateSign(clientId, timeStamp) {
    // 示例：简单的签名生成方法
    return btoa(`${clientId}-${timeStamp}-secret-key`);
}