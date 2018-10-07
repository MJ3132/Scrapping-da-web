
var makeDate = function() {
    var d = new Date();
    var formattedDate = "";

    formattedDate += (d.getMonth() + 1) + "-";
    formattedDate += d.getDay() + "-";
    formattedDate += d.getFullYear();

    return formattedDate;
};

module.exports = makeDate;