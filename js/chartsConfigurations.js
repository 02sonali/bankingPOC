var configureCharts = function() {
    let gauge1 = echarts.init(document.getElementById('gauge-1'));
    let gauge2 = echarts.init(document.getElementById('gauge-2'));
    let line1 = echarts.init(document.getElementById('line-1'));
    let line2 = echarts.init(document.getElementById('line-2'));
    var barChart = echarts.init(document.getElementById('bar-chart'));
   
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
            nameGap: 40,
            axisLabel: {
                rotate: 60,
                interval: 29
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
            nameGap: 40,
            nameTextStyle: {
                fontWeight: 'bold'
            },
            axisLabel: {
                rotate: 60,
                interval: 29
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
            data: ['1', '2', '3','4', '5', '6', '7'],
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
        let data = []
        for(let i=0; i<420; i++){
            data.push(i);
        }
        return data;
    }
    function generateLineData() {
        let data = [];
        for(let i=0; i< 420; i++) {
            data.push(0);
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
        line1Options.series[0].data[Number(clockTime) - 1] = avg;
        line1.setOption(line1Options, true);
    }

    function updateLineChart2(clockTime, avg) {
        line2Options.series[0].data[Number(clockTime) - 1] = avg;
        line2.setOption(line2Options, true);
    }

    function updateBarChart(currentTimeInMinutes, val) {
        let currentHour = Math.floor(currentTimeInMinutes/60);
        barOptions.series[0].data[currentHour - 1] = val;
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
        updateBarChart: updateBarChart,
        updateCashierDeskUtilization: updateCashierDeskUtilization,
        updateSupportDeskUtilization: updateSupportDeskUtilization,
        resetCharts: resetCharts
    }
}