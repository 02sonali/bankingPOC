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
        $('#support-agent-count').html(support_agent_count);
    }

    function addToSupportDesk() {
        support_desk_count++;
        $('#support-desk-count').html(support_desk_count);
    }

    function addToCashierQueue() {
        cashier_agent_count++;
        $('#cashier-agent-count').html(cashier_agent_count);
    }

    function addToCashierDesk() {
        cashier_desk_count++;
        $('#cashier-desk-count').html(cashier_desk_count);
    }
    
    function removeFromSupportQueue() {
        if(support_agent_count > 0) {
            support_agent_count--;
        }
        $('#support-agent-count').html(support_agent_count);
    }

    function removeFromSupportDesk() {
        if(support_desk_count > 0) {
            support_desk_count--;
        }
        $('#support-desk-count').html(support_agent_count);
    }

    function removeFromCashierQueue() {
        if(cashier_agent_count > 0) {
            cashier_agent_count--;
        }
        $('#cashier-agent-count').html(cashier_agent_count);
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
        $('#support-agent-count').html(support_agent_count);
        $('#support-desk-count').html(support_desk_count);
        $('#cashier-agent-count').html(cashier_agent_count);
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
        resetData: resetData
    }
}