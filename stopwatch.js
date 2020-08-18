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
        options.dataFunctions.resetData();
        for(let i=0; i< options.data.customerData.length; i++){
            options.data.customerData[i].hasExited = false;
            options.data.customerData[i].isAdded = false;
            options.data.customerData[i].isAddedToCashierDesk = false;
            options.data.customerData[i].isAddedToSupportDesk = false;
        }
        $('#support-agent').html("");
        $('#support-desk-block').html("");
        $('#cashier-agent-block').html("");
        $('#cashier-desk-block').html("");
        $('#exit-block').html("");
    }
    
    function update() {
        //run timer for 7hr only else stop
        if(clock <= 42000) {
            clock += delta();
            getDeskCounts(clock/100, options.data);
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

    function getDeskCounts(currentTime, data) {
        for(let i=0; i<data.customerData.length; i++){
            let clockTime = currentTime.toString().split('.')[0];
            let supportQueueTime = data.customerData[i].support_queue_arrival.toString().split('.')[0];
            let supportDeskTime = data.customerData[i].support_entry_time.toString().split('.')[0];
            let cashierQueueTime = data.customerData[i].cashier_queue_arrival.toString().split('.')[0];
            let cashierDeskTime = data.customerData[i].cashier_entry_time.toString().split('.')[0];
            let exitTime = data.customerData[i].completed_time.toString().split('.')[0];
            if(clockTime === supportQueueTime && !data.customerData[i].hasExited && !data.customerData[i].isAdded) {
                data.customerData[i].isAdded = true;
                options.dataFunctions.addToSupportQueue();
                options.dataFunctions.updateCustomers();
            } 
            if((clockTime === supportDeskTime) && data.customerData[i].support_entry_time > 0 && !data.customerData[i].hasExited && !data.customerData[i].isAddedToSupportDesk) {
                data.customerData[i].isAddedToSupportDesk = true;
                options.dataFunctions.addToSupportDesk();
                options.dataFunctions.removeFromSupportQueue();

                options.dataFunctions.updateCustomers();
                options.dataFunctions.updateSupportDeskCustomers();
            }
            if(clockTime === cashierQueueTime && data.customerData[i].cashier_queue_arrival > 0 && !data.customerData[i].hasExited){
                options.dataFunctions.addToCashierQueue();
                options.dataFunctions.updateCashierQueue();
                options.dataFunctions.updateSupportDeskCustomers();
            }
            if((clockTime === cashierDeskTime) && (data.customerData[i].cashier_entry_time > 0) && (data.customerData[i].cashier_queue_arrival > 0) && !data.customerData[i].isAddedToCashierDesk && !data.customerData[i].hasExited) {
                data.customerData[i].isAddedToCashierDesk = true;
                options.dataFunctions.addToCashierDesk();
                options.dataFunctions.removeFromCashierQueue();

                options.dataFunctions.updateCashierQueue();
                options.dataFunctions.updateCashierDeskCustomers();
            }
            if(clockTime === exitTime && clockTime!=="0") {
                if(data.customerData[i].cashier_entry_time > 0) {
                    options.dataFunctions.removeFromCashierDesk();
                    
                } if(data.customerData[i].support_entry_time > 0) {
                    options.dataFunctions.removeFromSupportDesk();
                    
                }
                if(!data.customerData[i].hasExited) {
                    data.customerData[i].hasExited = true;
                    options.dataFunctions.addToExit();
                }
                options.dataFunctions.updateSupportDeskCustomers();
                options.dataFunctions.updateCashierDeskCustomers();
            }
        }
    }
    
    // public API
    return {
        startWatch: start,
        stopWatch: stop,
        resetWatch: reset
    }
};