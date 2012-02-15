$(function () {
    function createChart (name, data) {
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
            yAxis: {
                title: {
                    text: 'Response Time'
                }
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: [0,0,0,300],
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, 'rgba(2,0,0,0)']
                        ]
                    },
                    animation: false, 
                    lineWidth: 1,
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: true,
                                radius: 5
                            }
                        }
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    }
                },
            },
            series: [{
                type: 'area',
                name: name,
                data: data
            }]
        });
    }

    var update_delay_timer = null;
    function onUpdate() {
        if (update_delay_timer) {
            clearTimeout(update_delay_timer);
        }
        update_delay_timer = setTimeout(function() { 
            update_delay_timer = null;
            update(); 
        }, 400);
        
    }

    function update() {
        var action = $('#action').val();
        var datetime1 = $('#datetime1').val();
        var datetime2 = $('#datetime2').val();
        if (datetime1 && datetime2) {
            var date1 = new Date(datetime1);
            var date2 = new Date(datetime2);
            if (date1 < date2) {
                $.ajax({
                    url: '/api/data',
                    data: {
                        action: action,
                        from: date1.getTime(),
                        to: date2.getTime()
                    },
                    success: function (data) {
                        createChart(action, data);
                    }
                });
            }
        }
    }

    $('.datetimepicker').datetimepicker().change(function (e) {
        onUpdate();
    });

    $('#action').blur(function() {
        onUpdate();
    });

    $.ajax({
        url: '/api/list/actions',
        success: function (data) {
            $('#action').typeahead({source: data});
        }
    });

    $('#datetime1').val('02/01/2012 00:00');
    $('#datetime2').val('02/01/2012 01:00');
    $('#action').val('index');
    update();
});
