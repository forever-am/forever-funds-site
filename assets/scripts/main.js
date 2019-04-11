// Build the allocation chart
var Allocation = (function (hc) {
    'use strict';

    return function (container, parameters) {
        var colors = [];
        parameters.forEach(function (item) {
            // Add colors from liquid for highcharts, so specific alloc keeps specific colors, regardless of it's value
            if (item.color)
                colors.push(item.color);
        });
        hc.setOptions({
            colors: colors
        });
        hc.chart(container, {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },

            title: {
                text: ''
            },

            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },

            credits: {
                enabled: false
            },

            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '{point.percentage:.1f} %',
                        distance: -45,
                        style: {
                            fontSize: 14
                        },
                        filter: {
                            property: 'percentage',
                            operator: '>',
                            value: 4
                        }
                    },
                    showInLegend: true
                }
            },

            legend: {
                symbolHeight: 14,
                symbolWidth: 14,
                symbolRadius: 0
            },

            series: [{
                name: 'Allocation',
                colorByPoint: true,
                data: parameters
            }]
        });
    };
}(Highcharts));
// Build the performance chart
var CRCPerformance = (function (hc) {
    'use strict';

    return function (container, parameters) {

        hc.stockChart(container, {

            title: {
                text: ''
            },

            yAxis: {
                minPadding: 0.,
                maxPadding: 0.,
                type: 'logarithmic',
                minorTickInterval: .01,
                opposite: false,
                minorGridLineWidth: 0,
                gridLineColor: '#ddd',
                labels: {
                    style: {
                        color: '#3d3d3d',
                        fontSize: 14
                    }
                }
            },

            xAxis: {
                type: 'datetime',
                gridLineWidth: 1,
               // min: Date.UTC(2011, 10, 31),
                dateTimeLabelFormats: {
                    day: '%Y'
                },
                labels: {
                    style: {
                        color: '#3d3d3d',
                        fontSize: 14
                    }
                }
            },

            chart: {
                backgroundColor: 'var(--color-section)'
            },

            scrollbar: {
                // enabled: false
            },

            legend: {
                enabled: true,
                align: 'bottom',
                // verticalAlign: 'top',
                layout: 'horizontal'
            },

            rangeSelector: {
                enabled: false,
                floating: true,
                y: -65,
                verticalAlign: 'bottom'
            },

            navigator: {
                yAxis: {
                    type: 'logarithmic'
                }
            },

            series: [{
                name: parameters['name'],
                data: parameters['crc'],
                color: '#223b73',
                showInNavigator: true,
                tooltip: {
                    valueDecimals: 2
                },
                lineWidth: 2
            },
            ],

            credits: {
                enabled: false
            },

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 600
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
    };
}(Highcharts));

// Menu toggling fn
var toggleMenu = function () {
    var body = document.body;
    body.className.match(/(?:^|\s)menu-open(?!\S)/) ? body.classList.remove('menu-open') : body.classList.add('menu-open');
};

// Table expand on click
var tableExpand = function () {
    var trigger = document.getElementById('expand-table');
    var switcher = false;

    if (!trigger) {
        return;
    }

    trigger.addEventListener('click', function () {
        switcher = !switcher;
        document.querySelectorAll('.mr-data tr').forEach(function (item, index) {
            (index > 3) && item.classList.toggle('to-show');
        });

        switcher ? trigger.innerHTML = 'Show Less' : trigger.innerHTML = 'Show More';
    });
};

var tableIndicators = function () {
    var tables = Array.from(document.querySelectorAll('[data-wide-table]'));
    var tableIndicators = document.querySelectorAll('table .indicator');

    tables.forEach(function (item) {

        item.addEventListener('scroll', function () {
            var currentScroll = item.scrollLeft;
            currentScroll > 60 ? item.classList.add('show') : item.classList.remove('show');

            tableIndicators.forEach(function (item) {
                item.style.left = currentScroll + 'px' || '0';
            });
        });
    });
};

function remove_children(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * @param {Object} _w - global Window object
 */
var CRCDataFn = (function (_w) {

    _w.jsonData = {};

    var undefinedMsg = 'Expected object with at least 1 property - url for json data. Possible object properties: \nurlAllocation\nurlRetSummary\nurlMonthlyReturn\nurlPerformance\nurlQuickStats';

    var throwError = function (msg) {
        throw new Error(msg);
    };

    /**
     * @param {string} jsonDataUrl - URL to json data
     * @param {Object} dataOption - Object with 5 properties (string urls):
     * dataOption.urlAllocation - {string} - URL to Allocation json data
     * dataOption.urlRetSummary - {string} - URL to Ret Summary json data
     * dataOption.urlMonthlyReturn - {string} - URL to Monthly Return json data
     * dataOption.urlPerformance - {string} - URL to Performance json data
     * dataOption.urlQuickStats - {string} - URL to Quick Stats json data
     */
    return function (dataOption) {
        if (typeof dataOption !== 'object' || dataOption === null) {
            throwError(undefinedMsg);
            return;
        }

        if (typeof dataOption.urlAllocation !== 'undefined' && dataOption.urlAllocation !== '') {

            var tableAllocation = document.getElementById('crc3-allocation-data');
            var tableAllocationBody = tableAllocation.children[1];
            // Define names of table rows
            var tableAllocationRowTitles = ['Equities', 'Fixed Income', 'Commodities & Extractors', 'Precious Metals',
                                            'Long Volatility', 'Short Volatility', 'Cash Equivalents'];

            fetch(dataOption.urlAllocation).then(function (response) {
                response.json().then(function (json) {
                    _w.jsonData.allocation = json;

                    if (!document.getElementById('allocation-chart')) {
                        throwError('Allocation chart is missing from this page.');
                        return;
                    }

                    if (!tableAllocation) {
                        throwError('Allocation table with data is missing from this page.');
                        return;
                    }

                    if (!tableAllocationBody) {
                        throwError('Allocation table is missing empty tbody node');
                        return;
                    }

                    remove_children(tableAllocationBody);


                    var exposure_color_mapping = {
                        'Equity': '#23a899', 'Fixed Income': '#243a73', 'Commodities & Extractors': '#3e3e3e',
                        'Precious Metals': '#d76143', 'Cash Equivalents': '#e6e7e9', 'Long Volatility': '#e01b84',
                        'Short Volatility': '#e01b84'
                    };

                    var alloc = Object.keys(json).map(function(key) {
                        return {
                            "name": key, "y": parseFloat(json[key]),
                            "color": exposure_color_mapping[key]
                        };
                    }).filter(function(item) {
                        return item['y'] > 0.
                    });

                    console.log(json);

                    alloc.forEach(function (item) {
                        var tableRow = document.createElement('tr');
                        tableRow.innerHTML = '<td>' + item['name'] + '</td>';
                        tableRow.innerHTML += '<td>' + (item['y'] * 100).toFixed(1) + '%' + '</td>';
                        tableAllocationBody.appendChild(tableRow);
                    });

                    new Allocation('allocation-chart', alloc.sort(function (a, b) {
                        return a.y < b.y;
                    }).map(function (item, index) {
                        if (index === 0) {
                            item.sliced = true;
                            item.selected = true;
                        }

                        return item;
                    }));
                });
            });
        }

        if (typeof dataOption.urlRetSummary !== 'undefined' && dataOption.urlRetSummary !== '') {

            fetch(dataOption.urlRetSummary).then(function (response) {
                response.json().then(function (json) {
                    _w.jsonData.index = json;

                    var format_perf = function (x) {
                        return (parseFloat(x) * 100.).toFixed(2) + '%'
                    };

                    var perfStartYearly = document.getElementById('perf-start-yearly');
                    var dataReturnSummary3 = document.getElementById('data-return-summary-3');
                    var dataReturnSummary4 = document.getElementById('data-return-summary-4');

                    perfStartYearly && (perfStartYearly.innerHTML = format_perf(json['Start (yearly)']));
                    dataReturnSummary3 && (dataReturnSummary3.innerHTML = format_perf(json['YTD']));
                    dataReturnSummary4 && (dataReturnSummary4.innerHTML = format_perf(json['Y']));
                });
            });
        }

        if (typeof dataOption.urlMonthlyReturn !== 'undefined' && dataOption.urlMonthlyReturn !== '') {

            fetch(dataOption.urlMonthlyReturn).then(function (response) {

                response.json().then(function (json) {
                    _w.jsonData.monthlyReturn = json;
                    var tableBody = document.getElementById('monthly-return-table-body');

                    if (!tableBody) {
                        return;
                    }

                    remove_children(tableBody);
                    Object.keys(json["Jan"]).sort(function (a, b) {
                        return parseInt(b) - parseInt(a);
                    }).forEach(function (key, index) {
                        var row = document.createElement('tr');
                        row.innerHTML = '<td>' + key + '<div class="indicator">' + key + '</div></td>';

                        (index > 3) && row.classList.add('to-show');

                        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Year'].forEach(function (item) {
                            var value = json[item][key] ? (parseFloat(json[item][key]) * 100).toFixed(2) : '';

                            row.innerHTML += '<td>' + value + '</td>';
                        });

                        tableBody.appendChild(row);

                        tableIndicators();
                        tableExpand();
                    });
                });
            });
        }

        if (typeof dataOption.urlPerformance !== 'undefined' && dataOption.urlPerformance !== '') {

            fetch(dataOption.urlPerformance).then(function (response) {
                response.json().then(function (json) {
                    _w.jsonData.performanceIndex = Object.entries(json).map(function (item) {
                        return [parseFloat(item[0]), item[1]];
                    }).sort(function (a, b) {
                        return (a[0] || 0) - (b[0] || 0);
                    });

                    var crcIndexDate = _w.jsonData.performanceIndex[_w.jsonData.performanceIndex.length - 1][0];
                    var crcIndexValue = _w.jsonData.performanceIndex[_w.jsonData.performanceIndex.length - 1][1];

                    var crcIndexDateElement = document.getElementById('crc-index-date');
                    var crcIndexValueElement = document.getElementById('crc-index-value');
                    var crcIndexLabelElement = document.getElementById('crc-index-label');

                    var date = new Date(crcIndexDate);
                    var date_str = date.toLocaleDateString('en-US', {
                        month: 'short', year: 'numeric', day: 'numeric', timeZone: 'UTC'
                    });
                    crcIndexDateElement && (crcIndexDateElement.innerText = date_str);

                    crcIndexValueElement && (crcIndexValueElement.innerText = parseFloat(crcIndexValue).toFixed(2));
                    crcIndexLabelElement && (crcIndexLabelElement.innerText = "NAV (" + dataOption["currency"].toUpperCase() + ") ");
                    document.querySelectorAll('.crc-date').forEach(function (item) {
                        item.innerHTML = date_str  + " | " + dataOption["currency"].toUpperCase();
                    });

                    new CRCPerformance('performance-chart', {
                        name: dataOption.chart_name,
                        crc: _w.jsonData.performanceIndex,
                    });
                });
            });
        }

        if (typeof dataOption.urlQuickStats !== 'undefined' && dataOption.urlQuickStats !== '') {

            var tableQuickStats = document.getElementById('crc3-quick-stats-data');
            var tableQuickStatsBody = tableQuickStats.children[1];

            /**
             * @var {array} tableQuickStatsRowEntities - key -> value pairs of used data
             * key -> quick stats data KEY value
             * value -> for specific KEY -> row TITLE
             * */
            var tableQuickStatsRowEntities = {
                perf: {
                    title: 'Perf. (yearly)',
                    percentage: true
                },
                vol: {
                    title: 'Volatility',
                    percentage: true
                },
                dd: {
                    title: 'Max Drawdown',
                    percentage: true
                },
                Sharpe: {
                    title: 'Sharpe',
                    percentage: false
                }
            };

            var indexCrc = "CRC3";
            var benchmarkCrc = "Bitcoin";

            fetch(dataOption.urlQuickStats).then(function (response) {
                response.json().then(function (json) {
                    _w.jsonData.performanceQuickStats = json;

                    if (!tableQuickStats) {
                        throwError('Quick stats table is missing from this page.');
                        return;
                    }

                    if (!tableQuickStatsBody) {
                        throwError('Quick stats table body is missing from this page.');
                        return;
                    }

                    remove_children(tableQuickStatsBody);
                    Object.keys(tableQuickStatsRowEntities).forEach(function (key) {
                        var tableRow = document.createElement('tr');
                        var percent = tableQuickStatsRowEntities[key]['percentage'];
                        tableRow.innerHTML = '<td>' + tableQuickStatsRowEntities[key]['title'] + '</td>';
                        tableRow.innerHTML += '<td>' + ((parseFloat(json[key][indexCrc]) || 0) * ((percent ? 100 : 1))).toFixed((percent ? 1 : 2)) + (percent ? '%' : '') + '</td>';

                        tableQuickStatsBody.appendChild(tableRow);
                    });
                });
            });
        }
    };

}(window));


var update_overview = function (perf_urls, element_id) {
    Promise.all(Object.values(perf_urls).map(function(url) { return fetch(url); })).then(
        function(responses) {
            Promise.all(responses.map(function (response) { return response.json(); })).then(
                function(json_responses) {
                    dates = Object.keys(json_responses[0]);
                    date = new Date(Number.parseInt(dates[dates.length - 1]));
                    nav_value = "NAV: ";
                    currencies = Object.keys(perf_urls);
                    for (var i = 0; i < currencies.length; ++i) {
                        json_response = Object.values(json_responses[i]);
                        nav = json_response[json_response.length - 1].toFixed(2);
                        nav_value += (i > 0 ? "|" : "") + currencies[i].toUpperCase() + " " + nav;
                    }
                    nav_value += " as of " + date.toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                        day: 'numeric'
                    });
                    document.getElementById(element_id).innerText = nav_value;
                }
            );
        }
    );
};

window.onload = function() {
    var hamburger = document.getElementsByClassName('menu-button')[0];
    var menuLinks = document.getElementsByClassName('page-link');

    hamburger.addEventListener('click', toggleMenu);

    for (var i = 0; i < menuLinks.length; ++i) {
        var menuLink = menuLinks[i];
        menuLink.addEventListener('click', toggleMenu);
    }
};
