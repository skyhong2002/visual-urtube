// main.js
import { loadData } from './loadapi.js';

document.addEventListener('DOMContentLoaded', async function () {
    const outputDiv = document.getElementById('output');

    const date_today = new Date().toISOString().split('T')[0];
    var getUrlString = location.href;
    var url = new URL(getUrlString);
    var date = url.searchParams.get('date');
    if (!date) {
        date = date_today;
    }
    const data = await loadData(date);

    if (data) {
        outputDiv.innerText = "成功讀取";

        // 為了避免頁面過長，我們也可以在控制台輸出完整的 JSON
        console.log('完整的 API 資料:', data);
        const topicjson = data.result.topic;
        const topic = JSON.stringify(topicjson);
        // 將 topic 顯示在 html
        outputDiv.innerText = topic;

    } else {
        outputDiv.innerText = "資料讀取失敗";
    }
});
