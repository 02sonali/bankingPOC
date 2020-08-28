$(document).ready(function() {
    getAnalysisData();
});
let dataObj = {};
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
        dataObj = normalizeData(values);
        showLessDetails();
        renderGraphs(dataObj);
    });
}

function renderGraphs(dataObj) {
    renderAvgWaitTimeGraph(dataObj);
    renderUtilizationGraph(dataObj);
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
        color: ['#79d70f', '#99A3A4', '#cd0a0a'],
        series: [
            {
                name: branch,
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    color: '#000',
                    fontSize: '20',
                    position: 'center',
                    formatter: () => {
                      return branch; 
                    },
                },    
                labelLine: {
                    show: false
                },
                data: [
                    {value: 10, name: 'Positive'},
                    {value: 20, name: 'Neutral'},
                    {value: 30, name: 'Negative'}
                ]
            }
        ]
    };
    if(branch === "Branch 1") {
        options.legend = {
            orient: 'vertical',
            top: 20,
            left: 10,
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

function renderUtilizationGraph(dataObj) {
    let barOptions = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        barWidth: 40,
        color: ['#0f4c75', '#00b7c2'],
        legend: {
            data: ['Average Support Desk Utilization', 'Average Cashier Desk Utilization']
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
            name: 'Percentage',
            nameLocation: "center",
            nameGap: 30,
            nameTextStyle: {
                fontWeight: 'bold'
            }
        },
        series: [
            {
                name: 'Average Support Desk Utilization',
                type: 'bar',
                barGap: 0,
                data: [dataObj.supportUtilization[0], dataObj.supportUtilization[1], dataObj.supportUtilization[2]]
            },
            {
                name: 'Average Cashier Desk Utilization',
                type: 'bar',
                data: [dataObj.cashierUtilization[0], dataObj.cashierUtilization[1], dataObj.cashierUtilization[2]]
            }
        ]
    };
    var barChart = echarts.init(document.getElementById('utilization-graph'));
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
        barWidth: 40,
        color: ['#1b6ca8', '#12cad6'],
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
                barGap: 0,
                data: [dataObj.avgSupportWait[0], dataObj.avgSupportWait[1], dataObj.avgSupportWait[2]]
            },
            {
                name: 'Average Cashier Wait Time',
                type: 'bar',
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

function showLessDetails() {
    $('#moreDetails').show();
    $('#lessDetails').hide();
    $('#simulation-table').html('');
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
    $('#simulation-table').append(rows);
}

function showCompleteDetails() {
    $('#moreDetails').hide();
    $('#lessDetails').show();
    $('#simulation-table').html('');

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
    `
    $('#simulation-table').append(rows);

     // <tr>
    //     <td scope="row">Financial Transactions</td>
    //     <td>${dataObj.financialTransactions[0]}</td>
    //     <td>${dataObj.financialTransactions[1]}</td>
    //     <td>${dataObj.financialTransactions[2]}</td>
    // </tr>
    // <tr>
    //     <td scope="row">Completed Customers</td>
    //     <td>${dataObj.completedCustomers[0]}</td>
    //     <td>${dataObj.completedCustomers[1]}</td>
    //     <td>${dataObj.completedCustomers[2]}</td>
    // </tr>
}
  