$(document).ready(function() {
    getAnalysisData();
});

function getAnalysisData() {
    let promiseOne = new Promise(function(resolve){
        fetch(`data/analysis_data_branch_number_1.json`)
        .then(res => res.json())
        .then(data => resolve(data))
    });
    let promiseTwo = new Promise(function(resolve){
        fetch(`data/analysis_data_branch_number_2.json`)
        .then(res => res.json())
        .then(data => resolve(data))
    });
    let promiseThree = new Promise(function(resolve){
        fetch(`data/analysis_data_branch_number_3.json`)
        .then(res => res.json())
        .then(data => resolve(data))
    });
    Promise.all([promiseOne, promiseTwo, promiseThree]).then(values => {
        let dataObj = normalizeData(values);
        renderTable(dataObj);
        renderGraphs(dataObj);
    });
}

function renderGraphs(dataObj) {
    // renderAvgWaitTimeGraph(dataObj);
    // renderFeedbackGraph(dataObj);
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
        series: [
            {
                name: 'Simulated Results',
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '30%'],
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 335, name: 'Positive'},
                    {value: 679, name: 'Neutral'},
                    {value: 1548, name: 'Negative'}
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
                    show: false
                },
                data: [
                    {value: 335, name: 'Positive'},
                    {value: 310, name: 'Neutral'},
                    {value: 234, name: 'Negative'}
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
    branchOneFeedback.setOption(chartOptions);
}

function renderBranchTwoFeedback(dataObj) {
    let branchTwoFeedback = echarts.init(document.getElementById('branch-two-feedback'));
    let chartOptions = getDonutChartOptions("Branch 2");
    chartOptions.series[0].data[0].value = dataObj.positiveFeedback[1];
    chartOptions.series[0].data[1].value = dataObj.neutralFeedback[1];
    chartOptions.series[0].data[2].value = dataObj.negativeFeedback[1];
    branchTwoFeedback.setOption(chartOptions);
}

function renderBranchThreeFeedback(dataObj) {
    let branchFeedback = echarts.init(document.getElementById('branch-three-feedback'));
    let chartOptions = getDonutChartOptions("Branch 3");
    chartOptions.series[0].data[0].value = dataObj.positiveFeedback[2];
    chartOptions.series[0].data[1].value = dataObj.neutralFeedback[2];
    chartOptions.series[0].data[2].value = dataObj.negativeFeedback[2];
    branchFeedback.setOption(chartOptions);
}

function renderFeedbackGraph(dataObj) {
    let barOptions = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['Branch 1', 'Branch 2', 'Branch 3']
        },
        xAxis: {
            type: 'category',
            data: ['Positive Feedback', 'Neutral Feedback', 'Negative Feedback'],
            name: 'Feedback',
            nameLocation: "center",
            nameGap: 30,
            nameTextStyle: {
                fontWeight: 'bold'
            }
        },
        yAxis: {
            type: 'value',
            name: 'Percentage',
            nameLocation: "center",
            nameGap: 30,
            nameTextStyle: {
                fontWeight: 'bold'
            }
        },
        series: [
            {
                name: 'Branch 1',
                type: 'bar',
                barGap: 0,
                data: [dataObj.positiveFeedback[0], dataObj.positiveFeedback[1], dataObj.positiveFeedback[2]]
            },
            {
                name: 'Branch 2',
                type: 'bar',
                stack: 'Average Wait Times',
                data: [dataObj.neutralFeedback[0], dataObj.neutralFeedback[1], dataObj.neutralFeedback[2]]
            },
            {
                name: 'Branch 3',
                type: 'bar',
                barGap: 0,
                data: [dataObj.negativeFeedback[0], dataObj.negativeFeedback[1], dataObj.negativeFeedback[2]]
            }
        ]
    };
    var barChart = echarts.init(document.getElementById('feedback-graph'));
    barChart.setOption(barOptions);
}

function renderAvgWaitTimeGraph(dataObj) {
    let barOptions = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        color: ['#48C9B0', '#E74C3C'],
        legend: {
            data: ['Average Support Wait Time', 'Average Cashier Wait Time']
        },
        xAxis: {
            type: 'category',
            data: ['Branch 1', 'Branch 2', 'Branch 3'],
            name: 'Branch',
            nameLocation: "center",
            nameGap: 30,
            nameTextStyle: {
                fontWeight: 'bold'
            }
        },
        yAxis: {
            type: 'value',
            name: 'Average Wait Times (min)',
            nameLocation: "center",
            nameGap: 30,
            nameTextStyle: {
                fontWeight: 'bold'
            }
        },
        series: [
            {
                name: 'Average Support Wait Time',
                type: 'bar',
                stack: 'Average Wait Times',
                data: [dataObj.avgSupportWait[0], dataObj.avgSupportWait[1], dataObj.avgSupportWait[2]]
            },
            {
                name: 'Average Cashier Wait Time',
                type: 'bar',
                stack: 'Average Wait Times',
                data: [dataObj.avgCashierWait[0], dataObj.avgCashierWait[1], dataObj.avgCashierWait[2]]
            },
        ]
    };
    var barChart = echarts.init(document.getElementById('avg-wait-time-graph'));
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

function renderTable(dataObj) {
    $('#optimization-table').html('');

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
    <tr>
        <td scope="row">Average Support Wait Time</td>
        <td>${dataObj.avgSupportWait[0]}</td>
        <td>${dataObj.avgSupportWait[1]}</td>
        <td>${dataObj.avgSupportWait[2]}</td>
    </tr>
    <tr>
        <td scope="row">Average Cashier Wait Time</td>
        <td>${dataObj.avgCashierWait[0]}</td>
        <td>${dataObj.avgCashierWait[1]}</td>
        <td>${dataObj.avgCashierWait[2]}</td>
    </tr>
    <tr>
        <td scope="row">Support Utilization (%)</td>
        <td>${dataObj.supportUtilization[0]}</td>
        <td>${dataObj.supportUtilization[1]}</td>
        <td>${dataObj.supportUtilization[2]}</td>
    </tr>
    <tr>
        <td scope="row">Cashier Utilization (%)</td>
        <td>${dataObj.cashierUtilization[0]}</td>
        <td>${dataObj.cashierUtilization[1]}</td>
        <td>${dataObj.cashierUtilization[2]}</td>
    </tr>
    <tr>
        <td scope="row">Positive Feedback (%)</td>
        <td>${dataObj.positiveFeedback[0]}</td>
        <td>${dataObj.positiveFeedback[1]}</td>
        <td>${dataObj.positiveFeedback[2]}</td>
    </tr>
    <tr>
        <td scope="row">Neutral Feedback (%)</td>
        <td>${dataObj.neutralFeedback[0]}</td>
        <td>${dataObj.neutralFeedback[1]}</td>
        <td>${dataObj.neutralFeedback[2]}</td>
    </tr>
    <tr>
        <td scope="row">Negative Feedback (%)</td>
        <td>${dataObj.negativeFeedback[0]}</td>
        <td>${dataObj.negativeFeedback[1]}</td>
        <td>${dataObj.negativeFeedback[2]}</td>
    </tr>
    <tr>
        <td scope="row">Financial Transactions</td>
        <td>${dataObj.financialTransactions[0]}</td>
        <td>${dataObj.financialTransactions[1]}</td>
        <td>${dataObj.financialTransactions[2]}</td>
    </tr>
    <tr>
        <td scope="row">Completed Customers</td>
        <td>${dataObj.completedCustomers[0]}</td>
        <td>${dataObj.completedCustomers[1]}</td>
        <td>${dataObj.completedCustomers[2]}</td>
    </tr>
    `
    $('#optimization-table').append(rows);
}