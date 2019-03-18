Meteor.PlantingGuideGraph = {

  constructChart: () => {
    console.log('Construct Rainfall Graph chart');
    var new_data = [

[1548806400000,54.535],
[1548892800000,52.417],
[1548979200000,50.951],
[1549065600000,49.688],
[1549152000000,48.977],
[1549238400000,48.32],
[1549324800000,47.455],
[1549411200000,46.476],
[1549497600000,45.407],
[1549584000000,45.149],
[1549670400000,43.379],
[1549756800000,42.308],
[1549843200000,42.613],
[1549929600000,41.797],
[1550016000000,41.05],
[1550102400000,40.593],
[1550188800000,40.007],
[1550275200000,40.775],
[1550361600000,40.319],
[1550448000000,40.096],
[1550534400000,40.597],
[1550620800000,40.588],
[1550707200000,41.453],
[1550793600000,41.047],
[1550880000000,40.981],
[1550966400000,41.58],
[1551052800000,43.64],
[1551139200000,43.722],
[1551225600000,45.628],
[1551312000000,46.458],
[1551398400000,47.332],
[1551484800000,47.793],
[1551571200000,48.034],
[1551657600000,49.077],
[1551744000000,49.936],
[1551830400000,50.909],
[1551916800000,51.758],
[1552003200000,53.472],
[1552089600000,54.626],
[1552176000000,55.872],
[1552262400000,57.467],
[1552348800000,58.417],
[1552435200000,59.322],
[1552521600000,59.547],
[1552608000000,59.75],
[1552694400000,59.85],
[1552780800000,59.988],
[1552867200000,59.454],
[1552953600000,59.521],
[1553040000000,59.954],
[1553126400000,60.316],
[1553212800000,61.312],
[1553299200000,61.147],
[1553385600000,62.506],
[1553472000000,62.696],
[1553558400000,62.082],
[1553644800000,60.636],
[1553731200000,61.05],
[1553817600000,59.122],
[1553904000000,58.121],
[1553990400000,57.097],
[1554076800000,57.324],
[1554163200000,57.791],
[1554249600000,56.848],
[1554336000000,56.959],
[1554422400000,57.137],
[1554508800000,56.875],
[1554595200000,55.946],
[1554681600000,55.109],
[1554768000000,53.953],
[1554854400000,53.856],
[1554940800000,53.774],
[1555027200000,54.408],
[1555113600000,54.823],
[1555200000000,54.41],
[1555286400000,54.301],
[1555372800000,54.228],
[1555459200000,55.242],
[1555545600000,56.03],
[1555632000000,57.117],
[1555718400000,58.328],
[1555804800000,59.855],
[1555891200000,61.31],
[1555977600000,62.063],
[1556064000000,63.732],
[1556150400000,66.259],
[1556236800000,68.24],
[1556323200000,69.043],
[1556409600000,71.258],
[1556496000000,73.324],
[1556582400000,75.892],
[1556668800000,78.574],
[1556755200000,80.667],
[1556841600000,83.74],
[1556928000000,85.333],
[1557014400000,88.581],
[1557100800000,91.732],
[1557187200000,96.625],
[1557273600000,100.664],
[1557360000000,105.049],
[1557446400000,107.424],
[1557532800000,110.397],
[1557619200000,111.789],
[1557705600000,113.901],
[1557792000000,118.451],
[1557878400000,122.665],
[1557964800000,126.882],
[1558051200000,131.798],
[1558137600000,135.528],
[1558224000000,139.205],
[1558310400000,141.699],
[1558396800000,144.668],
[1558483200000,145.789],
[1558569600000,149.431],
[1558656000000,153.891],
[1558742400000,155.653],
[1558828800000,157.432],
[1558915200000,160.692],
[1559001600000,162.355],
[1559088000000,163.353],
[1559174400000,163.828],
[1559260800000,163.565],
[1559347200000,163.567],
[1559433600000,164.622],
[1559520000000,165.467],
[1559606400000,163.016],
[1559692800000,162.155],
[1559779200000,158.768],
[1559865600000,157.947],
[1559952000000,155.005],
[1560038400000,155.11],
[1560124800000,153.336],
[1560211200000,151.095],
[1560297600000,150.419],
[1560384000000,147.567],
[1560470400000,144.646],
[1560556800000,143.15],
[1560643200000,140.064],
[1560729600000,138.31],
[1560816000000,135.593],
[1560902400000,132.718],
[1560988800000,129.68],
[1561075200000,127.997],
[1561161600000,124.266],
[1561248000000,121.092],
[1561334400000,119.548],
[1561420800000,117.666],
[1561507200000,117.095],
[1561593600000,117.256],
[1561680000000,116.875],
[1561766400000,116.361],
[1561852800000,118.058],
[1561939200000,119.103],
[1562025600000,117.976],
[1562112000000,117.903],
[1562198400000,120.922],
[1562284800000,122.286],
[1562371200000,125.801],
[1562457600000,127.395],
[1562544000000,128.396],
[1562630400000,129.461],
[1562716800000,132.512],
[1562803200000,135.411],
[1562889600000,136.676],
[1562976000000,137.285],
[1563062400000,139.832],
[1563148800000,141.059],
[1563235200000,142.826],
[1563321600000,146.045],
[1563408000000,148.847],
[1563494400000,154.371],
[1563580800000,156.414],
[1563667200000,161.515],
[1563753600000,164.129],
[1563840000000,165.848],
[1563926400000,167.708],
[1564012800000,170.71],
[1564099200000,174.187],
[1564185600000,177.056],
[1564272000000,178.005],
[1564358400000,181.273],
[1564444800000,181.329],
[1564531200000,182.982],
[1564617600000,184.461],
[1564704000000,186.278],
[1564790400000,186.298],
[1564876800000,188.613],
[1564963200000,186.352],
[1565049600000,184.73],
[1565136000000,184.756],
[1565222400000,187.019],
[1565308800000,187.164],
[1565395200000,189.122],
[1565481600000,191.059],
[1565568000000,194.603],
[1565654400000,193.005],
[1565740800000,193.511],
[1565827200000,191.435],
[1565913600000,190.553],
[1566000000000,187.94],
[1566086400000,187.732],
[1566172800000,186.586],
[1566259200000,184.998],
[1566345600000,184.567],
[1566432000000,186.39],
[1566518400000,186.75],
[1566604800000,185.834],
[1566691200000,183.775],
[1566777600000,183.733],
[1566864000000,185.726],
[1566950400000,186.768],
[1567036800000,189.413],
[1567123200000,187.453],
[1567209600000,188.655],
[1567296000000,190.022],
[1567382400000,192.711],
[1567468800000,191.549],
[1567555200000,193.738],
[1567641600000,197.215],
[1567728000000,198.591],
[1567814400000,196.136],
[1567900800000,193.716],
[1567987200000,193.958],
[1568073600000,197.461],
[1568160000000,196.761],
[1568246400000,200.439],
[1568332800000,201.406],
[1568419200000,205.885],
[1568505600000,208.86],
[1568592000000,211.234],
[1568678400000,210.054],
[1568764800000,212.944],
[1568851200000,215.942],
[1568937600000,217.562],
[1569024000000,219.928],
[1569110400000,219.345],
[1569196800000,219.637],
[1569283200000,217.585],
[1569369600000,215.746],
[1569456000000,216.036],
[1569542400000,215.04],
[1569628800000,212.012],
[1569715200000,212.845],
[1569801600000,213.022],
[1569888000000,212.584],
[1569974400000,210.687],
[1570060800000,213.772],
[1570147200000,218.267],
[1570233600000,219.763],
[1570320000000,222.391],
[1570406400000,226.06],
[1570492800000,233.887],
[1570579200000,234.567],
[1570665600000,234.669],
[1570752000000,236.38],
[1570838400000,237.125],
[1570924800000,240.136],
[1571011200000,242.208],
[1571097600000,241.826],
[1571184000000,243.503],
[1571270400000,245.84],
[1571356800000,246.699],
[1571443200000,243.082],
[1571529600000,243.747],
[1571616000000,243.374],
[1571702400000,245.746],
[1571788800000,249.292],
[1571875200000,252.237],
[1571961600000,255.443],
[1572048000000,257.804],
[1572134400000,258.442],
[1572220800000,260.754],
[1572307200000,265.771],
[1572393600000,269.043],
[1572480000000,271.243],
[1572566400000,274.523],
[1572652800000,274.779],
[1572739200000,272.011],
[1572825600000,272.153],
[1572912000000,272.616],
[1572998400000,276.525],
[1573084800000,277.276],
[1573171200000,281.898],
[1573257600000,284.563],
[1573344000000,289.134],
[1573430400000,291.475],
[1573516800000,294.315],
[1573603200000,294.601],
[1573689600000,298.185],
[1573776000000,300.979],
[1573862400000,301.945],
[1573948800000,299.814],
[1574035200000,304.557],
[1574121600000,307.259],
[1574208000000,306.768],
[1574294400000,308.644],
[1574380800000,306.404],
[1574467200000,308.005],
[1574553600000,308.647],
[1574640000000,308.562],
[1574726400000,310.659],
[1574812800000,312.454],
[1574899200000,310.697],
[1574985600000,310.209],
[1575072000000,306.469],
[1575158400000,302.172],
[1575244800000,298.531],
[1575331200000,296.707],
[1575417600000,295.259],
[1575504000000,296.765],
[1575590400000,292.959],
[1575676800000,288.622],
[1575763200000,284.144],
[1575849600000,278.689],
[1575936000000,273.579],
[1576022400000,271.008],
[1576108800000,266.567],
[1576195200000,261.129],
[1576281600000,255.979],
[1576368000000,251.823],
[1576454400000,247.43],
[1576540800000,247.042],
[1576627200000,241.553],
[1576713600000,236.084],
[1576800000000,232.285],
[1576886400000,228.748],
[1576972800000,226.338],
[1577059200000,222.584],
[1577145600000,216.611],
[1577232000000,213.491],
[1577318400000,209.52],
[1577404800000,205.053],
[1577491200000,199.663],
[1577577600000,194.759],
[1577664000000,192.718],
[1577750400000,193.228],
[1577836800000,189.793],
[1577923200000,185.901],
[1578009600000,179.771],
[1578096000000,171.449],
[1578182400000,163.599],
[1578268800000,157.577],
[1578355200000,151.499],
[1578441600000,146.631],
[1578528000000,141.122],
[1578614400000,135.603],
[1578700800000,129.843],
[1578787200000,125.768],
[1578873600000,120.674],
[1578960000000,116.399],
[1579046400000,112.696],
[1579132800000,108.279],
[1579219200000,104.488],
[1579305600000,100.998],
[1579392000000,96.921],
[1579478400000,91.588],
[1579564800000,88.597],
[1579651200000,84.323],
[1579737600000,82.232],
[1579824000000,77.169],
[1579910400000,72.653],
[1579996800000,68.389],
[1580083200000,66.09],
[1580169600000,61.868],
[1580256000000,59.325],
[1580342400000,54.535],
[1580428800000,52.417],
[1580515200000,50.951],
[1580601600000,49.688],
[1580688000000,48.977],
[1580774400000,48.32],
[1580860800000,47.455],
[1580947200000,46.476],
[1581033600000,45.407],
[1581120000000,45.149],
[1581206400000,43.379],
[1581292800000,42.308],
[1581379200000,42.613],
[1581465600000,41.797],
[1581552000000,41.05],
[1581638400000,40.593],
[1581724800000,40.007],
[1581811200000,40.775],
[1581897600000,40.319],
[1581984000000,40.096],
[1582070400000,40.597],
[1582156800000,40.588],
[1582243200000,41.453],
[1582329600000,41.047],
[1582416000000,40.981],
[1582502400000,41.58],
[1582588800000,43.64],
[1582675200000,43.722],
[1582761600000,45.628],
[1582848000000,46.458],
[1582934400000,47.332],
[1583020800000,47.793],
[1583107200000,48.034],
[1583193600000,49.077],
[1583280000000,49.936],
[1583366400000,50.909],
[1583452800000,51.758],
[1583539200000,53.472],
[1583625600000,54.626],
[1583712000000,55.872],
[1583798400000,57.467],
[1583884800000,58.417],
[1583971200000,59.322],
[1584057600000,59.547],
[1584144000000,59.75],
[1584230400000,59.85],
[1584316800000,59.988],
[1584403200000,59.454],
[1584489600000,59.521],
[1584576000000,59.954],
[1584662400000,60.316],
[1584748800000,61.312],
[1584835200000,61.147],
[1584921600000,62.506],
[1585008000000,62.696],
[1585094400000,62.082],
[1585180800000,60.636],
[1585267200000,61.05],
[1585353600000,59.122],
[1585440000000,58.121],
[1585526400000,57.097],
[1585612800000,57.324]
];


    return {
            chart: {
                zoomType: 'x'
            },
            title: {
                text: '2019 RICE PLANTING ADVISORIES FOR ECHAGUE, ISABELA'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                text: 'Month',
                type: 'datetime'
            },
            yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: {
            text: 'Rainfall(mm)'
        },
        maxPadding: 0.2,
        plotLines: [{
            color: 'green',
            width: 2,
            value: 200,
            label: {
                align: 'right',
                style: {
                    fontStyle: 'italic'
                },
                text: 'Threshold',
                x: -10
            },
            zIndex: 4
        }]
    },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [
            {
                name: 'Daily Cumulative Rainfall',
                data: new_data
            },{
              name: 'Monthly Rainfall',
              type: 'area',
              data: [
                [Date.UTC(2019, 0, 1), 55.504],
                [Date.UTC(2019, 1, 1), 44.991],
                [Date.UTC(2019, 2, 1), 59.434],
                [Date.UTC(2019, 3, 1), 75.892],
                [Date.UTC(2019, 4, 1), 167.904],
                [Date.UTC(2019, 5, 1), 118.058],
                [Date.UTC(2019, 6, 1), 188.182],
                [Date.UTC(2019, 7, 1), 194.472],
                [Date.UTC(2019, 8, 1), 213.022],
                [Date.UTC(2019, 9, 1), 278.869],
                [Date.UTC(2019, 10, 1), 306.469],
                [Date.UTC(2019, 11, 1), 198.971],
                [Date.UTC(2020, 0, 1), 55.504],
                [Date.UTC(2020, 1, 1), 44.991],
                [Date.UTC(2020, 2, 1), 59.434]
              ]
            },
            {
        name: 'Generated wet season planting period by means of direct dry seeding based on historical records',
        type: 'polygon',
        data: [[Date.UTC(2019, 5, 15), 50], [Date.UTC(2019, 6, 15), 75], [Date.UTC(2019, 9, 15), 75], [Date.UTC(2019, 8, 15), 50]],
        color: '#86b300',
        lineWidth: 1,
        lineColor:'#263300'
    },
    {
        name: 'Generated wet season planting period by means of direct wet seeding based on historical records',
        type: 'polygon',
        data: [[Date.UTC(2019, 6, 15), 25], [Date.UTC(2019, 7, 15), 50], [Date.UTC(2019, 10, 15), 50], [Date.UTC(2019, 9, 15), 25]],
        color: '#336600',
        lineWidth: 1,
        lineColor:'#263300'
    },
    {
        name: 'Generated dry season planting period by means of direct dry seeding based on historical records',
        type: 'polygon',
        data: [[Date.UTC(2019, 10, 1), 50], [Date.UTC(2019, 10, 30), 75], [Date.UTC(2020, 1, 28), 75], [Date.UTC(2020, 1, 1), 50]],
        color: '#e6ffcc',
        lineWidth: 1,
        lineColor:'#263300'
    },
    {
        name: 'Generated dry season planting period by means of direct wet seeding based on historical records',
        type: 'polygon',
        data: [[Date.UTC(2019, 10, 15), 25], [Date.UTC(2019, 11, 15), 50], [Date.UTC(2020, 2, 15), 50], [Date.UTC(2020, 1, 15), 25]],
        color: '#b3ff66',
        lineWidth: 1,
        lineColor:'#263300'
    }]
        }
}

}