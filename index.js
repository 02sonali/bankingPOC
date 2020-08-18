var stopWatch;

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
  stopwatch =  new Stopwatch(stopwatchElement[0], {data: branchData, dataFunctions: dataFunctions});
  resetSimulation();
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
  // createCustomers();
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
  stopwatch.resetWatch();
  $('#reset-btn').hide();
  $('#start-btn').show();
  $('#branch-list').removeClass('disabled');
  $('#branch-list').removeAttr('disabled');
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

// function createCustomers() {
//   for (var i = 0; i < 10; i++) {
//     $('#support-agent').append('<img src="./images/man.png" alt="man" class="element">');
//   }
//   $('.element').each(function( index ) {
//     $(this).css({
//       left : Math.random() * ($('#support-agent').width() - $(this).width()),
//       top : Math.random() * ($('#support-agent').height() - $(this).height())
//     });
//   });

//   var elements = document.getElementsByClassName('element');
//   var target = document.getElementById('support-desk-target');

//   // store the x,y coordinates of the target
//   var xT = target.offsetLeft;
//   var yT = target.offsetTop;

//   for(var i = 0; i < elements.length; i++) {
//     var xE = elements[i].offsetLeft;
//     var yE = elements[i].offsetTop;

//     // set the elements position to their position for a smooth animation
//     elements[i].style.left = xE + 'px';
//     elements[i].style.top = yE + 'px';
//     elements[i].style.left = xT + 'px';
//     elements[i].style.top = yT + 'px';
//   }
// }
