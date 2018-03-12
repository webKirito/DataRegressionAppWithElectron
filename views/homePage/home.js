const {remote, BrowserWindow } = require("electron");
const main = remote.require("./index.js");
const $ = require("jquery");
let stat = require("./Statistic");
let Statistic = stat.Statistic;
const fs = require("fs");

const {dialog} = require('electron').remote;
 
function openFile() {
    dialog.showOpenDialog((fileNames) => {
        // fileNames is an array that contains all the selected
        if(fileNames === undefined){
            console.log("No file selected");
            return;
        }
    
        fs.readFile(fileNames.toString(),'utf-8', (err, data) => {
            if(err){
                alert("An error ocurred reading the file :" + err.message);
                return;
            }

            let arr1 = [];
            let arr2 = [];
            data = data.split("\n");
            for (let i = 0; i < data.length; i++) {
                let [a, b] = data[i].split("     ");
                arr1.push(+a);
                arr2.push(+b);
            }
            drawScatter(arr1, arr2);
            analiseScatter(arr1 , arr2);
        });
    });
}

analiseScatter();
drawScatter();

function drawScatter(fArr = [1,2,3,4,5,3,2,12,3,2], sArr = [3,1,3,3,7,8,2,10,1,2]) {
    
    let s = new Statistic(fArr,sArr);
    let lineRegressionKoefStat = s.getLineRegressionKoef(0.05);
    let a0 = lineRegressionKoefStat[0];
    let a1 = lineRegressionKoefStat[1];
    
    let lowKoef = lineRegressionKoefStat[5];
    let a0Low = lowKoef[0];
    let a1Low = lowKoef[1];

    let highKoef = lineRegressionKoefStat[4];
    let a0High = highKoef[0];
    let a1High = highKoef[1];

    function borderXYArr (fArr , a0 , a1 , choose) {
        
        function regressionFunc(x , a0 , a1) {
            return a0 + a1 * x;
        }
    
        
        fArr = fArr.sort((a, b) => a - b); 

        let xFirst = fArr[0];
        let xLast = fArr[fArr.length - 1];
    
        let [yFirst , yLast] = [regressionFunc(xFirst , a0, a1), regressionFunc(xLast , a0 ,a1)];
        if (choose === "x") {
            return [xFirst , xLast];
        }
        if (choose === "y") {
            return [yFirst , yLast];
        }
    } 
    

    let trace = {
        x: fArr,
        y: sArr,
        mode: 'markers',
        type: 'scatter',
        name :"Data"
    };
    
    let ourFunction = {
        x : borderXYArr(fArr , a0 , a1 , "x"),
        y : borderXYArr(fArr , a0 , a1 , "y"),
        mode: "line" , 
        type : "scatter",
        name : "Reg Func"
    }

    let ourLowFunction = {
        x : borderXYArr(fArr , a0Low , a1Low , "x"),
        y : borderXYArr(fArr , a0Low , a1Low , "y"),
        mode: "line" , 
        type : "scatter" , 
        name : "Low Reg Func"
    }

    let ourHighFunction = {
        x : borderXYArr(fArr , a0High , a1High , "x"),
        y : borderXYArr(fArr , a0High , a1High , "y"),
        mode: "line" , 
        type : "scatter",
        name : "High Reg Func"
    }

    Plotly.newPlot('plot', [trace, ourFunction, ourLowFunction , ourHighFunction]);
}

function analiseScatter(fArr = [1,2,3,4,5,3,2,12,3,2], sArr = [3,1,3,3,7,8,2,10,1,2]) {
    let s = new Statistic(fArr,sArr);
let text = 
`Pirson Koef : ${s.getPirsonKoef()}
Pirson Statistic : ${s.getPirsonTStat(0.05)[1]}
Quantile : ${s.getPirsonTStat(0.05)[2]}
Conclusion : ${s.getPirsonTStat(0.05)[3]}
Сonfidential interval : [${s.getPirsonTStat(0.05)[5]}, ${s.getPirsonTStat(0.05)[4]}]`;
$("#text").text(text);
}

$("#openFileBtn").click(openFile);