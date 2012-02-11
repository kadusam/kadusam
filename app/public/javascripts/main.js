$(function () {
    function createChart (data) {
        data = $.map(data, function (e) {
            return [[new Date(e.time).getTime(), Number(e.response_time)]];
        });
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container'
            },
            xAxis: {
                type: 'datetime'
            },
            series: [{
                data: data
            }]
        });
    }

    $('.datetimepicker').datetimepicker().change(function (e) {
        var datetime1 = $('#datetime1').val();
        var datetime2 = $('#datetime2').val();
        if (datetime1 && datetime2) {
            var date1 = new Date(datetime1);
            var date2 = new Date(datetime2);
            if (date1 < date2) {
                $.ajax({
                    url: '/t1/',
                    data: {
                        min: date1.getTime(),
                        max: date2.getTime()
                    },
                    success: function (data) {
                        createChart(data);
                    }
                });
            }
        }
    });
});
