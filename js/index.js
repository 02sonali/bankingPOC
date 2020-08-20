var stopWatch;
let chartConfiguration;

$(document).ready(function() {
  
  $('#simulation-container').hide();
  $(document).on('change','select#branch-list',function(){
    let selectedVal = $(this).children("option:selected").val();
    $('#stopwatch').html("");
    if(selectedVal) {
      $('#start-btn').removeAttr('disabled').removeClass('disabled');
      fetch(`data/data_branch_number_${selectedVal}.json`).then(res => res.json())
      .then(data => setData(data))
    } else {
      $('#support-agent-count').html("0");
      $('#cashier-agent-count').html("0");
      $('#start-btn').attr('disabled', 'disabled');
      $('#start-btn').addClass('disabled');
    }
  });
});

function setData(data) {
  $('#support-agent-count').html(data.totalSupportAgents);
  $('#cashier-agent-count').html(data.totalCashierAgents);
  createStopWatch(data);
}

function refreshWindow(){
  location.reload()
}

function createStopWatch(branchData) {
  let dataFunctions = new generateNormalizedData(branchData.totalSupportAgents, branchData.totalCashierAgents);
  let stopwatchElement = $('#stopwatch');

  $('#graph-section').show();
  
  /** chart configurations */
  chartConfiguration = new configureCharts();
  
  stopwatch =  new Stopwatch(stopwatchElement[0], {data: branchData, dataFunctions: dataFunctions, chartFunctions: chartConfiguration});
  resetSimulation();
}

function configureAllCharts() {
  chartConfiguration.resetCharts();
  chartConfiguration.configureGauge1();
  chartConfiguration.configureGauge2();
  chartConfiguration.configureLineChart1();
  chartConfiguration.configureLineChart2();
  chartConfiguration.configureBarChart();
}

function startSimulation() {
  /***** DOM manipulations *******/
  $('#placeholder-image').hide();
  $('#simulation-container').show();
  $('#analysis-btn-container').show();
  $('#analysis-btn').addClass('disabled');
  $('#analysis-btn').attr('disabled', 'disabled');
  $('#branch-list').addClass('disabled');
  $('#branch-list').attr('disabled', 'disabled');
  $('#timer').show();
  /*******************************/
  startWatch();
}

function stopSimulation() {
  stopWatch();
  $('#analysis-btn').removeClass('disabled');
  $('#analysis-btn').removeAttr('disabled');
  $('#branch-list').removeClass('disabled');
  $('#branch-list').removeAttr('disabled');
}

function resetSimulation() {
  configureAllCharts();
  stopwatch.resetWatch();
  $('#reset-btn').hide();
  $('#start-btn').show();
  $('#branch-list').removeClass('disabled');
  $('#branch-list').removeAttr('disabled');
  $('#analysis-btn').removeClass('disabled');
  $('#analysis-btn').removeAttr('disabled');
}

function startWatch() {
  $('#start-btn').hide();
  $('#stop-btn').show();
  stopwatch.startWatch();
}

function stopWatch() {
  stopwatch.stopWatch();
  $('#start-btn').show();
  $('#stop-btn').hide();
}
