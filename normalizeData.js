let support_agent_count = 0;
let support_desk_count = 0; 
let cashier_agent_count = 0;
let cashier_desk_count = 0; 
let exit_queue_count = 0;
let avg_support_wait_time = 0;
let avg_cashier_wait_time = 0;
let completed_customers = 0;
let positive_feedback = "0%";
let negative_feedback = "0%";
let neutral_feedback = "0%";
let avg_support_desk_utilization = "0";
let avg_cashier_desk_utilization = "0";

var generateNormalizedData = function() {
    function addToSupportQueue() {
        support_agent_count++;
        $('#support-queue-count').html(support_agent_count);
    }

    function addToSupportDesk() {
        support_desk_count++;
        $('#support-desk-count').html(support_desk_count);
    }

    function addToCashierQueue() {
        cashier_agent_count++;
        $('#cashier-queue-count').html(cashier_agent_count);
    }

    function addToCashierDesk() {
        cashier_desk_count++;
        $('#cashier-desk-count').html(cashier_desk_count);
    }
    
    function removeFromSupportQueue() {
        if(support_agent_count > 0) {
            support_agent_count--;
        } else {
            $('#support-agent').html("");
        }
        $('#support-queue-count').html(support_agent_count);
    }

    function removeFromSupportDesk() {
        if(support_desk_count > 0) {
            support_desk_count--;
        } else {
            $('#support-desk-block').html("");
        }
        $('#support-desk-count').html(support_agent_count);
    }

    function removeFromCashierQueue() {
        if(cashier_agent_count > 0) {
            cashier_agent_count--;
        }
        $('#cashier-queue-count').html(cashier_agent_count);
    }

    function removeFromCashierDesk() {
        if(cashier_desk_count > 0) {
            cashier_desk_count--;
        }
        $('#cashier-desk-count').html(cashier_desk_count);
    }

    function addToExit() {
        exit_queue_count++;
        $('#exit-count').html(exit_queue_count);
        showExitAnimation();
    }

    function updateCustomers() {
        $('#support-agent').html("");
        for (var i = 0; i < support_agent_count; i++) {
            $('#support-agent').append('<img src="./images/man.png" alt="man" class="element">');
        }
        $('.element').each(function() {
            $(this).css({
                left : Math.random() * ($('#support-agent').width() - $(this).width()) + 20,
                top : Math.random() * ($('#support-agent').height() - $(this).height()) + 10
            });
        });
    }
    function updateSupportDeskCustomers() {
        $('#support-desk-block').html("");
       
        for(var i = 0; i < support_desk_count; i++) {
            $('#support-desk-block').append(`<img src="./images/man.png" alt="man" class="desk-element">`);
        }
    
        $('.desk-element').each(function() {
            $(this).css({
                left : Math.random() * ($('#support-desk-block').width() - $(this).width()) + 10,
                top : Math.random() * ($('#support-desk-block').height() - $(this).height()) + 60,
            });
        });
    }
    function updateCashierQueue() {
        $('#cashier-agent-block').html("");
        if(cashier_agent_count <= 30) {
            for(var i = 0; i < cashier_agent_count; i++) {
                $('#cashier-agent-block').append(`<img src="./images/man.png" alt="man" class="cashier-queue-element">`);
            }
        } else {
            for(var i = 0; i < 30; i++) {
                $('#cashier-agent-block').append(`<img src="./images/man.png" alt="man" class="cashier-queue-element">`);
            }
        }
        $('.cashier-queue-element').each(function() {
            $(this).css({
                left : Math.random() * ($('#cashier-agent-block').width() - $(this).width()) + 10,
                top : Math.random() * ($('#cashier-agent-block').height() - $(this).height()) + 60
            });
        });
    }

    function updateCashierDeskCustomers() {
        $('#cashier-desk-block').html("");
        for(var i = 0; i < cashier_desk_count; i++) {
            $('#cashier-desk-block').append(`<img src="./images/man.png" alt="man" class="cashier-desk-element">`);
        }
        $('.cashier-desk-element').each(function() {
            $(this).css({
                left : Math.random() * ($('#cashier-desk-block').width() - $(this).width()) + 10,
                top : Math.random() * ($('#cashier-desk-block').height() - ($(this).height())) + 60,
            });
        });
    }

    function showExitAnimation() {
        $('#exit-block').html("");
        var target = document.getElementById('exit-block');
        for (var i = 0; i < exit_queue_count; i++) {
            $('#exit-block').append(`<img src="./images/man.png" alt="man" class="exit-element">`);
        }
        $('.exit-element').each(function() {
            var xE = target.offsetLeft;
            $(this).css({
                left : "95%",
                top: "76px"
            });
        });
    }

    function resetData() {
        support_agent_count = 0;
        support_desk_count = 0; 
        cashier_agent_count = 0;
        cashier_desk_count = 0; 
        exit_queue_count = 0;
        avg_support_wait_time = 0;
        avg_cashier_wait_time = 0;
        completed_customers = 0;
        positive_feedback = "0%";
        negative_feedback = "0%";
        neutral_feedback = "0%";
        avg_support_desk_utilization = "0";
        avg_cashier_desk_utilization = "0";
        $('#support-queue-count').html(support_agent_count);
        $('#support-desk-count').html(support_desk_count);
        $('#cashier-queue-count').html(cashier_agent_count);
        $('#cashier-desk-count').html(cashier_desk_count);
        $('#exit-count').html(exit_queue_count);
    }

    return {
        addToSupportQueue : addToSupportQueue,
        addToSupportDesk: addToSupportDesk,
        removeFromSupportQueue: removeFromSupportQueue,
        removeFromSupportDesk: removeFromSupportDesk,
        addToCashierQueue: addToCashierQueue,
        addToCashierDesk: addToCashierDesk,
        removeFromCashierQueue: removeFromCashierQueue,
        removeFromCashierDesk: removeFromCashierDesk,
        addToExit: addToExit,
        resetData: resetData,

        /***movement functions */
        updateCustomers: updateCustomers,
        updateSupportDeskCustomers: updateSupportDeskCustomers,
        updateCashierQueue: updateCashierQueue,
        updateCashierDeskCustomers: updateCashierDeskCustomers
    }
}