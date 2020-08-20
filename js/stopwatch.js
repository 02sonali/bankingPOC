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
            options.dataFunctions.timerCompleted();
            $('#stop-btn').hide();
            $('#reset-btn').show();
            $('#analysis-btn').removeClass('disabled');
            $('#analysis-btn').removeAttr('disabled');
        }
    }

    function  getConvertedTime(timeInSeconds) {
        var num = timeInSeconds;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        let isGreaterThanSeven = (rhours === 7 && rminutes > 0);
        return rhours>0 ? isGreaterThanSeven ? 7 + " hr " + 00 + " min" : rhours + " hr " + rminutes + " min" : rminutes + " min";
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
            let supportLeavingTime = data.customerData[i].support_leaving.toString().split('.')[0];
            let cashierQueueTime = data.customerData[i].cashier_queue_arrival.toString().split('.')[0];
            let cashierDeskTime = data.customerData[i].cashier_entry_time.toString().split('.')[0];
            let cashierLeavingTime = data.customerData[i].cashier_leaving.toString().split('.')[0];
            if(clockTime === supportQueueTime && !data.customerData[i].hasExited && !data.customerData[i].isAdded) {
                data.customerData[i].isAdded = true;
                options.dataFunctions.addToSupportQueue();
                options.dataFunctions.updateCustomers();
                options.dataFunctions.updateAvgSupportWaitTime(data.customerData[i].avg_support_wait_time);
                options.dataFunctions.updateAvgCashierWaitTime(data.customerData[i].avg_cashier_wait_time);
                
                options.chartFunctions.updateLineChart1(clockTime, data.customerData[i].avg_support_wait_time);
                options.chartFunctions.updateLineChart2(clockTime, data.customerData[i].avg_cashier_wait_time);
                options.chartFunctions.updateBarChart(clockTime, data.customerData[i].support_customers);

                options.chartFunctions.updateSupportDeskUtilization(data.customerData[i].support_utilization);
                options.chartFunctions.updateCashierDeskUtilization(data.customerData[i].cashier_utilization);
            } 
            if((clockTime === supportDeskTime) && data.customerData[i].support_entry_time > 0 && !data.customerData[i].hasExited && !data.customerData[i].isAddedToSupportDesk) {
                data.customerData[i].isAddedToSupportDesk = true;
                options.dataFunctions.addToSupportDesk();
                options.dataFunctions.removeFromSupportQueue();

                options.dataFunctions.updateCustomers();
                options.dataFunctions.updateSupportDeskCustomers();
            }
            if((clockTime === supportLeavingTime) && !data.customerData[i].hasExited) {
                options.dataFunctions.removeFromSupportDesk();
                options.dataFunctions.updateSupportDeskCustomers();
                if(data.customerData[i].cashier_queue_arrival <= 0) {
                    data.customerData[i].hasExited = true;
                    options.dataFunctions.addToExit();
                }
            }
            if(clockTime === cashierQueueTime && data.customerData[i].cashier_queue_arrival > 0 && !data.customerData[i].hasExited){
                options.dataFunctions.addToCashierQueue();
                options.dataFunctions.updateCashierQueue();
            }
            if((clockTime === cashierDeskTime) && (data.customerData[i].cashier_queue_arrival > 0) && !data.customerData[i].isAddedToCashierDesk && !data.customerData[i].hasExited) {
                data.customerData[i].isAddedToCashierDesk = true;
                options.dataFunctions.addToCashierDesk();
                options.dataFunctions.removeFromCashierQueue();

                options.dataFunctions.updateCashierQueue();
                options.dataFunctions.updateCashierDeskCustomers();
            }
            if((clockTime === cashierLeavingTime) && (data.customerData[i].cashier_entry_time > 0) && !data.customerData[i].hasExited) {
                options.dataFunctions.removeFromCashierDesk();
                options.dataFunctions.updateCashierDeskCustomers();
                
                data.customerData[i].hasExited = true;
                options.dataFunctions.addToExit();
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