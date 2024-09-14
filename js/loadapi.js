// loadapi.js

export async function loadData(date) {
    // if date is not provided, use today's date
    const url = `https://urtubeapi.analysis.tw/api/api_topic.php?date=${date}&condition=all`;
    const date_today = new Date().toISOString().split('T')[0];
    console.log('date to retrive: ' + date);
    // Check if data is in localStorage and not today's date
    if (localStorage.getItem(date) && date !== date_today) {
        return JSON.parse(localStorage.getItem(date));
    }

    try {
        console.log('loading data from url: ' + url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Store data in localStorage
        localStorage.setItem(date, JSON.stringify(data));
        
        return data;
    } catch (error) {
        console.error("Error loading data: ", error);
        return null;
    }
}

