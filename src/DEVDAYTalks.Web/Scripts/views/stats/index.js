$(function () {
    
    $.get('Stats/GetTalks', function (data) {
        var categories = _.keys(data);
        var values = _.values(data);

        loadChart(categories, values);
    });

    var loadChart = function (categories, values) {
        $('#container').highcharts({
            chart: {
                type: 'column',
                margin: [50, 50, 100, 80]
            },
            title: {
                text: 'Average votes - DevDay 2013 Talks'
            },
            xAxis: {
                categories: categories,
                labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Average'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Average: <b>{point.y:.1f}</b>',
            },
            series: [{
                name: 'Average',
                data: values,
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    x: 4,
                    y: 10,
                    style: {
                        fontSize: '12px',
                        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                        textShadow: '0 0 3px black'
                    }
                }
            }]
        });
    };
});

