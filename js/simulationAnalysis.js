$(document).ready(function() {
    getAnalysisData();
});

function getAnalysisData() {
    let promiseOne = new Promise(function(resolve, reject){
        fetch(`data/analysis_data_branch_number_1.json`)
        .then(res => res.json())
        .then(data => resolve(data))
    });
    let promiseTwo = new Promise(function(resolve, reject){
        fetch(`data/analysis_data_branch_number_2.json`)
        .then(res => res.json())
        .then(data => resolve(data))
    });
    let promiseThree = new Promise(function(resolve, reject){
        fetch(`data/analysis_data_branch_number_3.json`)
        .then(res => res.json())
        .then(data => resolve(data))
    });
    Promise.all([promiseOne, promiseTwo, promiseThree]).then(values => console.log(values));
}
  