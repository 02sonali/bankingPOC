$(document).ready(function() {
  
  $('#simulation-container').hide();

  $(document).on('change','select#branch-list',function(){
    let selectedVal = $(this).children("option:selected").val();
    if(selectedVal) {
      $('#start-btn').removeAttr('disabled').removeClass('disabled');
      fetch(`data/data_branch_number_${selectedVal}.json`).then(res => res.json()).then(data => console.log(data))
    } else {
      $('#start-btn').attr('disabled', 'disabled');
      $('#start-btn').addClass('disabled');
    }
  });
  createStopWatch();
});

function refreshWindow(){
  location.reload()
}

var stopWatch;
function createStopWatch() {
  let stopwatchElement = $('#stopwatch');
  stopwatch =  new Stopwatch(stopwatchElement[0]);
}

function startSimulation() {
  /***** order matters here *******/
  $('#placeholder-image').hide();
  $('#simulation-container').show();
  /*******************************/
  // createCustomers();
  startWatch();
}

function stopSimulation() {
  stopWatch();
}

function resetSimulation() {
  stopwatch.resetWatch();
  $('#reset-btn').hide();
  $('#start-btn').show();
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

function createCustomers() {
  for (var i = 0; i < 10; i++) {
    $('#support-agent').append('<img src="./images/man.png" alt="man" class="element">');
  }
  $('.element').each(function( index ) {
    $(this).css({
      left : Math.random() * ($('#support-agent').width() - $(this).width()),
      top : Math.random() * ($('#support-agent').height() - $(this).height())
    });
  });

  var elements = document.getElementsByClassName('element');
  var target = document.getElementsByClassName('target')[0];

  // store the x,y coordinates of the target
  var xT = target.offsetLeft;
  var yT = target.offsetTop;

  for(var i = 0; i < elements.length; i++) {
    var xE = elements[i].offsetLeft;
    var yE = elements[i].offsetTop;

    // set the elements position to their position for a smooth animation
    elements[i].style.left = xE + 'px';
    elements[i].style.top = yE + 'px';
    elements[i].style.left = xT + 'px';
    elements[i].style.top = yT + 'px';
  }
}
