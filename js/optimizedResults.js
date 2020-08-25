$(document).ready(function() {
    getAnalysisData();
});
let dataObj = {};
function getAnalysisData() {
    Promise.all([
        fetch('data/analysis_data_branch_number_1.json'),
        fetch('data/analysis_data_branch_number_2.json'),
        fetch('data/analysis_data_branch_number_3.json'),
        fetch('data/bank_1_optimized.json'),
        fetch('data/bank_2_optimized.json'),
        fetch('data/bank_3_optimized.json'),
    ]).then(function (responses) {
        return Promise.all(responses.map(function (response) {
            return response.json();
        }));
    }).then(values => {
        dataObj = normalizeData(values);
        showLessDetails();
        renderGraphs(dataObj);
    });
}

function renderGraphs(dataObj) {
    renderAvgWaitTimeGraph(1, dataObj);
    renderAvgWaitTimeGraph(2, dataObj);
    renderAvgWaitTimeGraph(3, dataObj);
    renderUtilizationGraph(1, dataObj);
    renderUtilizationGraph(2, dataObj);
    renderUtilizationGraph(3, dataObj);
    renderBranchOneFeedback(dataObj);
    renderBranchTwoFeedback(dataObj);
    renderBranchThreeFeedback(dataObj);
}

function getDonutChartOptions(branch) {
    let options = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        color: ['#48C9B0', '#99A3A4', '#E74C3C'],
        series: [
            {
                name: 'Simulated Results',
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '30%'],
                label: {
                    position: 'inside',
                    formatter: '{c}%'
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 0, name: 'Positive'},
                    {value: 0, name: 'Neutral'},
                    {value: 0, name: 'Negative'}
                ]
            },
            {
                name: 'Optimized Results',
                type: 'pie',
                radius: ['40%', '55%'],
                labelLine: {
                    show: false
                },
                label: {
                    position: 'inside',
                    formatter: '{c}%'
                },
                data: [
                    {value: 0, name: 'Positive'},
                    {value: 0, name: 'Neutral'},
                    {value: 0, name: 'Negative'}
                ]
            }
        ]
    };
    if(branch === "Branch 2") {
        options.legend = {
            orient: 'horizontal',
            top: 4,
            left: 60,
            data: ['Positive', 'Neutral', 'Negative']
        }
    }
    return options;
}

function renderBranchOneFeedback(dataObj) {
    let branchOneFeedback = echarts.init(document.getElementById('branch-one-feedback'));
    let chartOptions = getDonutChartOptions("Branch 1");
    chartOptions.series[0].data[0].value = dataObj.positiveFeedback[0];
    chartOptions.series[0].data[1].value = dataObj.neutralFeedback[0];
    chartOptions.series[0].data[2].value = dataObj.negativeFeedback[0];
    chartOptions.series[1].data[0].value = dataObj.positiveFeedback[3];
    chartOptions.series[1].data[1].value = dataObj.neutralFeedback[3];
    chartOptions.series[1].data[2].value = dataObj.negativeFeedback[3];
    
    branchOneFeedback.setOption(chartOptions);
}

function renderBranchTwoFeedback(dataObj) {
    let branchTwoFeedback = echarts.init(document.getElementById('branch-two-feedback'));
    let chartOptions = getDonutChartOptions("Branch 2");
    chartOptions.series[0].data[0].value = dataObj.positiveFeedback[1];
    chartOptions.series[0].data[1].value = dataObj.neutralFeedback[1];
    chartOptions.series[0].data[2].value = dataObj.negativeFeedback[1];
    chartOptions.series[1].data[0].value = dataObj.positiveFeedback[4];
    chartOptions.series[1].data[1].value = dataObj.neutralFeedback[4];
    chartOptions.series[1].data[2].value = dataObj.negativeFeedback[4];
    branchTwoFeedback.setOption(chartOptions);
}

function renderBranchThreeFeedback(dataObj) {
    let branchFeedback = echarts.init(document.getElementById('branch-three-feedback'));
    let chartOptions = getDonutChartOptions("Branch 3");
    chartOptions.series[0].data[0].value = dataObj.positiveFeedback[2];
    chartOptions.series[0].data[1].value = dataObj.neutralFeedback[2];
    chartOptions.series[0].data[2].value = dataObj.negativeFeedback[2];
    chartOptions.series[1].data[0].value = dataObj.positiveFeedback[5];
    chartOptions.series[1].data[1].value = dataObj.neutralFeedback[5];
    chartOptions.series[1].data[2].value = dataObj.negativeFeedback[5];
    branchFeedback.setOption(chartOptions);
}

function renderUtilizationGraph(branchNumber, dataObj) {
    let barOptions = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        barWidth: 30,
        color: ['#0f4c75', '#00b7c2'],
        xAxis: {
            type: 'category',
            data: ['Support Utilization', 'Cashier Utilization'],
            name: `Branch ${branchNumber}`,
            nameLocation: "center",
            nameGap: 30,
            nameTextStyle: {
                fontWeight: 'bold'
            },
            axisLabel: {
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            name: 'Percentage',
            nameLocation: "center",
            nameGap: 25,
            nameTextStyle: {
                fontWeight: 'bold'
            }
        },
        series: [
            {
                name: 'Simulated Results',
                type: 'bar',
                barGap: 0,
                data: [dataObj.supportUtilization[branchNumber- 1], dataObj.supportUtilization[branchNumber + 2]]
            },
            {
                name: 'Optimized Results',
                type: 'bar',
                data: [dataObj.cashierUtilization[branchNumber - 1], dataObj.cashierUtilization[branchNumber + 2]]
            }
        ]
    };
    if(branchNumber === 1) {
        barOptions.legend = {
            data: ['Simulated Results', 'Optimized Results'],
            orient: 'vertical',
            top: 0,
            left: 10,
        }
    }
    var barChart = echarts.init(document.getElementById(`utilization-graph-${branchNumber}`));
    barChart.setOption(barOptions);
}

function renderAvgWaitTimeGraph(branchNumber, dataObj) {
    let barOptions = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            position: [10, 10]
        },
        barWidth: 40,
        color: ['#1b6ca8', '#12cad6'],
        xAxis: {
            type: 'category',
            data: ['Simulated Results', 'Optimized Results'],
            name: `Branch ${branchNumber}`,
            nameLocation: "center",
            nameGap: 30,
            nameTextStyle: {
                fontWeight: 'bold'
            },
            axisLabel: {
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            name: 'Average Wait Times (min)',
            nameLocation: "center",
            nameGap: 25,
            nameTextStyle: {
                fontWeight: 'bold'
            }
        },
        series: [
            {
                name: 'Average Support Wait Time',
                type: 'bar',
                barGap: 0,
                data: [dataObj.avgSupportWait[branchNumber - 1], dataObj.avgSupportWait[branchNumber + 2]]
            },
            {
                name: 'Average Cashier Wait Time',
                type: 'bar',
                data: [dataObj.avgCashierWait[branchNumber - 1], dataObj.avgCashierWait[branchNumber + 2]]
            },
        ]
    };
    if(branchNumber === 1) {
        barOptions.legend = {
            data: ['Average Support Wait Time', 'Average Cashier Wait Time'],
            orient: 'vertical',
            top: 0,
            left: 10,
        }
    }
    var barChart = echarts.init(document.getElementById(`avg-wait-time-graph-${branchNumber}`));
    barChart.setOption(barOptions);
}

function normalizeData(data) {
    let dataObj = {
        branch: [],
        supportAgents: [],
        cashierAgents: [],
        avgSupportWait: [],
        avgCashierWait: [],
        supportUtilization: [],
        cashierUtilization: [],
        positiveFeedback: [],
        neutralFeedback: [],
        negativeFeedback: [],
        financialTransactions: [],
        completedCustomers: []
    };
    for(let i=0; i< data.length; i++) {
        dataObj.branch.push(data[i].Branch_Number);
        dataObj.supportAgents.push(data[i].totalSupportAgents);
        dataObj.cashierAgents.push(data[i].totalCashierAgents);
        dataObj.avgSupportWait.push(data[i].customerData[0].Average_Support_Wait_Time);
        dataObj.avgCashierWait.push(data[i].customerData[0].Average_Cashier_Wait_Time);
        dataObj.supportUtilization.push(data[i].customerData[0].Support_Utilization);
        dataObj.cashierUtilization.push(data[i].customerData[0].Cashier_Utilization);
        dataObj.positiveFeedback.push(data[i].customerData[0].Positive_Feedback);
        dataObj.neutralFeedback.push(data[i].customerData[0].Neutral_Feedback);
        dataObj.negativeFeedback.push(data[i].customerData[0].Negative_Feedback);
        dataObj.financialTransactions.push(data[i].customerData[0].financial_transactions);
        dataObj.completedCustomers.push(data[i].customerData[0].Completed_Customers);
    }
    return dataObj;
}

function getComparisonSymbol(simulationVal, optimizedVal) {
    let val;
    if(simulationVal > optimizedVal) {
        val = '<i class="fa fa-caret-down text-danger font-18 mr-2" aria-hidden="true"></i>'
    } else if(simulationVal < optimizedVal){
        val = '<i class="fa fa-caret-up text-success font-18 mr-2" aria-hidden="true"></i>'
    }
    return val;
}

function showLessDetails() {
    $('#moreDetails').show();
    $('#lessDetails').hide();
    $('#optimized-table').html('');
    let rows = `
    <tr>
        <td scope="row">Support Agents</td>
        <td>${dataObj.supportAgents[0]}</td>
        <td>${dataObj.supportAgents[1]}</td>
        <td>${dataObj.supportAgents[2]}</td>
    </tr>
    <tr>
        <td scope="row">Cashier Agents</td>
        <td>${dataObj.cashierAgents[0]}</td>
        <td>${dataObj.cashierAgents[1]}</td>
        <td>${dataObj.cashierAgents[2]}</td>
    </tr>
    `
    $('#optimized-table').append(rows);
}

function showCompleteDetails() {
    $('#moreDetails').hide();
    $('#lessDetails').show();
    $('#optimized-table').html('');

    let rows = `
    <tr>
        <td scope="row">Support Agents</td>
        <td>${dataObj.supportAgents[3]}</td>
        <td>${dataObj.supportAgents[4]}</td>
        <td>${dataObj.supportAgents[5]}</td>
    </tr>
    <tr>
        <td scope="row">Cashier Agents</td>
        <td>${dataObj.cashierAgents[3]}</td>
        <td>${dataObj.cashierAgents[4]}</td>
        <td>${dataObj.cashierAgents[5]}</td>
    </tr>
    <tr>
        <td scope="row">Average Support Wait Time</td>
        <td>${getComparisonSymbol(dataObj.avgSupportWait[0], dataObj.avgSupportWait[3])}${dataObj.avgSupportWait[3]}</td>
        <td>${getComparisonSymbol(dataObj.avgSupportWait[1], dataObj.avgSupportWait[4])}${dataObj.avgSupportWait[4]}</td>
        <td>${getComparisonSymbol(dataObj.avgSupportWait[2], dataObj.avgSupportWait[5])}${dataObj.avgSupportWait[5]}</td>
    </tr>
    <tr>
        <td scope="row">Average Cashier Wait Time</td>
        <td>${getComparisonSymbol(dataObj.avgCashierWait[0], dataObj.avgCashierWait[3])}${dataObj.avgCashierWait[3]}</td>
        <td>${getComparisonSymbol(dataObj.avgCashierWait[1], dataObj.avgCashierWait[4])}${dataObj.avgCashierWait[4]}</td>
        <td>${getComparisonSymbol(dataObj.avgCashierWait[2], dataObj.avgCashierWait[5])}${dataObj.avgCashierWait[5]}</td>
    </tr>
    <tr>
        <td scope="row">Support Utilization (%)</td>
        <td>${getComparisonSymbol(dataObj.supportUtilization[0], dataObj.supportUtilization[3])}${dataObj.supportUtilization[3]}</td>
        <td>${getComparisonSymbol(dataObj.supportUtilization[1], dataObj.supportUtilization[4])}${dataObj.supportUtilization[4]}</td>
        <td>${getComparisonSymbol(dataObj.supportUtilization[2], dataObj.supportUtilization[5])}${dataObj.supportUtilization[5]}</td>
    </tr>
    <tr>
        <td scope="row">Cashier Utilization (%)</td>
        <td>${getComparisonSymbol(dataObj.cashierUtilization[0], dataObj.cashierUtilization[3])}${dataObj.cashierUtilization[3]}</td>
        <td>${getComparisonSymbol(dataObj.cashierUtilization[1], dataObj.cashierUtilization[4])}${dataObj.cashierUtilization[4]}</td>
        <td>${getComparisonSymbol(dataObj.cashierUtilization[2], dataObj.cashierUtilization[5])}${dataObj.cashierUtilization[5]}</td>
    </tr>
    <tr>
        <td scope="row">Positive Feedback (%)</td>
        <td>${getComparisonSymbol(dataObj.positiveFeedback[0], dataObj.positiveFeedback[3])}${dataObj.positiveFeedback[3]}</td>
        <td>${getComparisonSymbol(dataObj.positiveFeedback[1], dataObj.positiveFeedback[4])}${dataObj.positiveFeedback[4]}</td>
        <td>${getComparisonSymbol(dataObj.positiveFeedback[2], dataObj.positiveFeedback[5])}${dataObj.positiveFeedback[5]}</td>
    </tr>
    <tr>
        <td scope="row">Neutral Feedback (%)</td>
        <td>${getComparisonSymbol(dataObj.neutralFeedback[0], dataObj.neutralFeedback[3])}${dataObj.neutralFeedback[3]}</td>
        <td>${getComparisonSymbol(dataObj.neutralFeedback[1], dataObj.neutralFeedback[4])}${dataObj.neutralFeedback[4]}</td>
        <td>${getComparisonSymbol(dataObj.neutralFeedback[2], dataObj.neutralFeedback[5])}${dataObj.neutralFeedback[5]}</td>
    </tr>
    <tr>
        <td scope="row">Negative Feedback (%)</td>
        <td>${getComparisonSymbol(dataObj.negativeFeedback[0], dataObj.negativeFeedback[3])}${dataObj.negativeFeedback[3]}</td>
        <td>${getComparisonSymbol(dataObj.negativeFeedback[1], dataObj.negativeFeedback[4])}${dataObj.negativeFeedback[4]}</td>
        <td>${getComparisonSymbol(dataObj.negativeFeedback[2], dataObj.negativeFeedback[5])}${dataObj.negativeFeedback[5]}</td>
    </tr>
    <tr>
        <td scope="row">Financial Transactions</td>
        <td>${dataObj.financialTransactions[3]}</td>
        <td>${dataObj.financialTransactions[4]}</td>
        <td>${dataObj.financialTransactions[5]}</td>
    </tr>
    <tr>
        <td scope="row">Completed Customers</td>
        <td>${dataObj.completedCustomers[3]}</td>
        <td>${dataObj.completedCustomers[4]}</td>
        <td>${dataObj.completedCustomers[5]}</td>
    </tr>
    `
    $('#optimized-table').append(rows);
}