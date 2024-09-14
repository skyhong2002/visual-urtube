// main.js
import { loadData } from './loadapi.js';

// Function to get query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// if date is not provided or after today, redirect to yesterday's date
if (!getQueryParam('date') || getQueryParam('date') > new Date().toISOString().split('T')[0]) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    window.location.href = `index.html?date=${yesterday.toISOString().split('T')[0]}`;
}

// Get the date from query parameter or use yesterday's date
let target_date = getQueryParam('date');
if (!target_date) {
    target_date = new Date();
    target_date.setDate(target_date.getDate() - 1);
    target_date = target_date.toISOString().split('T')[0];
}
console.log('Target date: ' + target_date);

if (localStorage.getItem(target_date) == null) {
    console.log('data is not in local storage');
    const data = await loadData(target_date);
    const json_data = JSON.stringify(data);
    localStorage.setItem(target_date, json_data);
} else {
    console.log('data is in local storage');
}

const daydata = localStorage.getItem(target_date);
const json_data = JSON.parse(daydata);
console.log(json_data.result);

console.log(json_data.result.video);

// create a list of video which have title, popularity, publishedTime, channelID and videoID
// change publishedAt (2024-09-13 11:15:31) to 2018-09-13T11:15:31Z (always stick to Taiwan time)
var video_list = [];
// var durationZeroCount = 0;
Object.keys(json_data.result.video).forEach(key => {
    var video = json_data.result.video[key];
    if (!video.publishedAt) { // video not available
        // console.log('video publishedAt is not available: ' + video.title);
    // } else if (video.duration == 0) {
    //     console.log('video duration is 0: https://youtu.be/' + key);
    //     durationZeroCount++;
    } else {
        video_list.push({
            title: video.title,
            videoID: key,
            popularity: parseInt(video.viewCount) + parseInt(video.likeCount) + parseInt(video.commentCount),
            publishedTime: video.publishedAt.replace(' ', 'T') + 'Z',
            channelID: video.u_id,
            duration: parseInt(video.duration)
        });
    }
});
console.log('video_list length: ' + video_list.length);

// print the first video in the list
console.log(video_list[0]);

echarts.registerTransform(ecStat.transform.clustering);

var videoData = video_list.map(function (item) {
    return [item.duration, item.popularity];
});


// Initialize the chart in the #chartContainer
var chartDom = document.getElementById('chartContainer');  // Get the container element
var myChart = echarts.init(chartDom);  // Initialize ECharts in the container // , 'dark'
var CLUSTER_COUNT = 6;
var DIENSIION_CLUSTER_INDEX = 2;
var pieces = [];
// Example option configuration for a scatter plot (you can modify it for your case)
var option = {
      dataset: [
        {
          source: videoData
        },
        {
          transform: {
            type: 'ecStat:clustering',
            print: true,
            config: {
              clusterCount: CLUSTER_COUNT,
              outputType: 'single',
              outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX
            }
          }
        }
      ],
    //   tooltip: {
    //     position: 'top'
    //   },
    //   visualMap: {
    //     type: 'piecewise',
    //     top: 'middle',
    //     min: 0,
    //     max: CLUSTER_COUNT,
    //     left: 10,
    //     splitNumber: CLUSTER_COUNT,
    //     dimension: DIENSIION_CLUSTER_INDEX,
    //     pieces: pieces
    //   },
    //   grid: {
    //     left: 120
    //   },
      xAxis: {},
      yAxis: {},
      series: {
        type: 'scatter',
        encode: { tooltip: [0, 1] },
        symbolSize: 30,
        itemStyle: {
          borderColor: '#000'
        },
        datasetIndex: 1
      }
    };

myChart.setOption(option);