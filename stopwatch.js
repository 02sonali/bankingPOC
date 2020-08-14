var Stopwatch = function(elem, options) {

    var timer = createTimer(),
        offset,
        clock,
        interval;
    
    // default options
    options = options || {};
    options.delay = options.delay || 10;
  
    // append elements     
    elem.appendChild(timer);
    
    // initialize
    reset();
    
    // private functions
    function createTimer() {
      return document.createElement("span");
    }
    
    function start() {
      if (!interval) {
        offset   = Date.now();
        interval = setInterval(update, options.delay);
      }
    }
    
    function stop() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }
    
    function reset() {
      clock = 0;
      render(0);
    }
    
    function update() {
        //run timer for 7hr only else stop
        if(clock <= 42000) {
            clock += delta();
            render();
        } else {
            stop();
            $('#stop-btn').hide();
            $('#reset-btn').show();
        }
    }

    function  getConvertedTime(timeInSeconds) {
        var num = timeInSeconds;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return rhours>0 ? rhours + " hr " + rminutes + " min" : rminutes + " min";
    }
    
    function render() {
      timer.innerHTML =  getConvertedTime(clock/100); 
    }
    
    function delta() {
      var now = Date.now(),
          d   = now - offset;
      
      offset = now;
      return d;
    }
    
    // public API
    return {
        startWatch: start,
        stopWatch: stop,
        resetWatch: reset
    }
};