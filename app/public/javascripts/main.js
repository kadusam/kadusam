var dummy = [
    {
        "time": "2012-02-11T11:59:09.000Z",
        "response_time": 1159.9063873291
    },
    {
        "time": "2012-02-11T11:59:23.000Z",
        "response_time": 1235.00823974609
    },
    {
        "time": "2012-02-11T11:59:24.000Z",
        "response_time": 1028.06091308594
    },
    {
        "time": "2012-02-11T11:59:42.000Z",
        "response_time": 927.925109863281
    }
];

$(function () {
    function createChart (data) {
        data = $.map(data, function (e) {
            return [[new Date(e.time).getTime(), e.response_time]];
        });
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'column'
            },
            xAxis: {
                type: 'datetime'
            },
            series: [{
                data: data
            }]
        });
    }

    createChart(dummy);
});
