$(function () {
    function createChart (data) {
        data = $.map(data, function (e) {
            return [[new Date(e.time).getTime(), Number(e.response_time)]];
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

    $.ajax({
        url: '/t1/',
        success: function (data) {
            createChart(data);
        }
    });

    $('#datetime1').datetimepicker();
    $('#datetime2').datetimepicker();
});
