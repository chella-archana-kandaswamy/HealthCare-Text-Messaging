var symptomData = ["None", "Headache", "Dizziness", "Nausea", "Fatigue", "Sadness"];


var severityData = [
    {
        severNo: "0",
        severText: "None"
        }, {
        severNo: "1",
        severText: "Mild"
        }, {
        severNo: "2",
        severText: "Mild"
        }, {
        severNo: "3",
        severText: "Moderate"
        }, {
        severNo: "4",
        severText: "Severe"
        }
];


var symptoms = function getSymptom() {
    return symptomData;
}

var severity = function getSeverity() {
    return severityData;
}

var severitytext = function getseverityText(number) {
    
    var sever = severityData.filter(function (e) {
        return e.severNo == number;
    });
    console.log("sever ",sever);
    
    return sever;
}

module.exports.symptoms = symptoms;
module.exports.severity = severity;
module.exports.severitytext = severitytext;