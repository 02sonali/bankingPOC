var configureCharts = function(barData) {
    let gauge1 = echarts.init(document.getElementById('gauge-1'));
    let gauge2 = echarts.init(document.getElementById('gauge-2'));
    let line1 = echarts.init(document.getElementById('line-1'));
    let line2 = echarts.init(document.getElementById('line-2'));
    let barChart = echarts.init(document.getElementById('bar-chart'));
   let filledLine1Options = [];
   let filledLine2Options = [];
    let gaugeOptions = {
        series: [
            {
                name: '',
                type: 'gauge',
                detail: {
                    formatter: '{value}%',
                    fontSize: 15,
                    offsetCenter:[0, 50]
                },
                data: [{value: 0, name: ''}],
                axisLine: {
                    lineStyle: {
                      width: 20,
                      color: [[0.7, '#63869e'], [0.9, '#91c7ae'], [1, '#c23531']]
                    }
                },
                axisLabel: {
                    distance: 1,
                    fontSize: 10
                }
            }
        ]
    };
    let line1Options = option = {
        xAxis: {
            name: 'Time (min)',
            type: 'category',
            data: generateLineAxis(),
            nameLocation: "center",
            nameTextStyle: {
                fontWeight: 'bold'
            },
            nameGap: 50,
            axisLabel: {
                rotate: 60,
                interval: 29,
                fontSize: 10
            },
        },
        yAxis: {
            type: 'value',
            name: 'Average Support Wait Time (min)',
            nameTextStyle: {
                fontWeight: 'bold'
            },
            nameLocation: "center",
            nameGap: 30
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [{
            data: generateLineData(),
            type: 'line',
            lineStyle: {
                color: '#17a2b8'
            }
        }]
    };

    let line2Options = option = {
        xAxis: {
            name: 'Time (min)',
            type: 'category',
            data: generateLineAxis(),
            nameLocation: "center",
            nameGap: 50,
            nameTextStyle: {
                fontWeight: 'bold'
            },
            axisLabel: {
                rotate: 60,
                interval: 29,
                fontSize: 10
            },
        },
        yAxis: {
            type: 'value',
            name: 'Average Cashier Wait Time (min)',
            nameLocation: "center",
            nameTextStyle: {
                fontWeight: 'bold'
            },
            nameGap: 30
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [{
            data: generateLineData(),
            type: 'line',
            lineStyle: {
                color: '#17a2b8'
            }
        }]
    };

    let barOptions = {
        tooltip: {
            trigger: 'axis'
        },
        barWidth: 40,
        xAxis: {
            type: 'category',
            data: ['8am - 9am', '9am - 10am', '10am - 11am','11am - 12pm', '12pm - 1pm', '1pm - 2pm', '2pm - 3pm'],
            name: 'Time (Hrs)',
            nameLocation: "center",
            nameGap: 30,
            nameTextStyle: {
                fontWeight: 'bold'
            }
        },
        yAxis: {
            type: 'value',
            name: 'Customer Arrival Count',
            nameLocation: "center",
            nameGap: 30,
            nameTextStyle: {
                fontWeight: 'bold'
            }
        },
        series: [{
            data: [0, 0, 0, 0, 0, 0, 0],
            type: 'bar'
        }]
    };


    function generateLineAxis() {
        var x = 1; //minutes interval
        var times = []; // time array
        var tt = 480; // start time
        var ap = [' am', ' pm']; // AM-PM
        
        //loop to increment the time and push results in array
        for (var i=0;tt<=15*60; i++) {
          var hh = Math.floor(tt/60); // getting hours of day in 0-24 format
          var mm = (tt%60); // getting minutes of the hour in 0-55 format
          times[i] = ("" + ((hh==12)?12:hh%12)).slice(-2) + ':' + ("0" + mm).slice(-2) + ap[Math.floor(hh/12)];
          tt = tt + x;
        }
        
        return times
       
    }
    function generateLineData() {
        let data = [];
        for(let i=0; i< 421; i++) {
            data.push(0);
            filledLine1Options.push(false);
            filledLine2Options.push(false);
        }
        return data;
    }
    function configureBarChart() {
        barChart.setOption(barOptions);
    }

    function configureGauge1() {
        gauge1.setOption(gaugeOptions);
    }

    function configureGauge2() {
        gauge2.setOption(gaugeOptions);
    }

    function configureLineChart1() {
        line1.setOption(line1Options);
    }

    function configureLineChart2() {
        line2.setOption(line2Options);
    }

    function updateSupportDeskUtilization(val) {
        let newObject = $.extend(true, {}, gaugeOptions);
        newObject.series[0].data[0].value = val;
        gauge1.setOption(newObject, true);
    }

    function updateCashierDeskUtilization(val) {
        let newObject = $.extend(true, {}, gaugeOptions);
        newObject.series[0].data[0].value = val;
        gauge2.setOption(newObject, true);
    }

    function updateLineChart1(clockTime, avg) {
        let clock = Number(clockTime);
        line1Options.series[0].data[clock - 1] = avg;
        filledLine1Options[clock - 1] = true;
        for(let i=clock-2; i>=0; i--) {
            if(filledLine1Options[i]) {
                break;
            }
            line1Options.series[0].data[i] = avg;
        }
        line1.setOption(line1Options, true);
    }

    function updateLineChart2(clockTime, avg) {
        let clock = Number(clockTime);
        line2Options.series[0].data[clock - 1] = avg;
        filledLine2Options[clock - 1] = true;
        for(let i=clock-2; i>=0; i--) {
            if(filledLine2Options[i]) {
                break;
            }
            line2Options.series[0].data[i] = avg;
        }
        line2.setOption(line2Options, true);
    }

    function getLastLineChartValues() {
        for(let i=0; i<filledLine2Options.length; i++) {
            if(filledLine2Options[i] === false) {
                line2Options.series[0].data[i] = line2Options.series[0].data[i - 1];
                filledLine2Options[i] = true;
            }
        }
        for(let i=0; i<filledLine1Options.length; i++) {
            if(filledLine1Options[i] === false) {
                line1Options.series[0].data[i] = line1Options.series[0].data[i - 1];
                filledLine1Options[i] = true;
            }
        }
        line1.setOption(line1Options, true);
        line2.setOption(line2Options, true);
    }

    function updateBarChart(currentTimeInMinutes) {
        let currentHour = Math.floor(Number(currentTimeInMinutes)/60);
        barOptions.series[0].data[currentHour - 1] = barOptions.series[0].data[currentHour - 1] + 1;
        barChart.setOption(barOptions, true);
    }

    function getBarValuesFromJson(currentTimeInMinutes) {
        let currentHour = Math.floor(Number(currentTimeInMinutes)/60);
        if(currentHour === 0) {
            barOptions.series[0].data[0] = barData[0].Completed_count;
        } else {
            for(let i=0; i< barData.length; i++) {
                if(Number(currentTimeInMinutes) >= barData[i].Time) {
                    for(let j=0; j<currentHour; j++) {
                        barOptions.series[0].data[j] = barData[j].Completed_count;
                    }
                    
                }
            }
        }
        barChart.setOption(barOptions, true);
    }

    function resetCharts() {
        line1Options.series[0].data = generateLineData();
        line1.setOption(line1Options, true);

        line2Options.series[0].data = generateLineData();
        line2.setOption(line2Options, true);

        barOptions.series[0].data = [0, 0, 0, 0, 0, 0, 0];
        barChart.setOption(barOptions, true);

        gaugeOptions.series[0].data[0].value = 0;
        gauge1.setOption(gaugeOptions, true);
        gauge2.setOption(gaugeOptions, true);
    }

    return {
        configureBarChart: configureBarChart,
        configureGauge1: configureGauge1,
        configureGauge2: configureGauge2,
        configureLineChart1: configureLineChart1,
        configureLineChart2: configureLineChart2,
        updateLineChart1: updateLineChart1,
        updateLineChart2: updateLineChart2,
        getLastLineChartValues: getLastLineChartValues,
        updateBarChart: updateBarChart,
        getBarValuesFromJson: getBarValuesFromJson,
        updateCashierDeskUtilization: updateCashierDeskUtilization,
        updateSupportDeskUtilization: updateSupportDeskUtilization,
        resetCharts: resetCharts
    }
}