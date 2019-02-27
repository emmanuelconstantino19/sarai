Template.RainfallDistribution.onCreated(() => {
  Meteor.subscribe('dss-settings')
  Meteor.subscribe('percent-mean-data')
  Meteor.subscribe('historical-daily-rain-data')

  Highcharts.setOptions({
  // This is for all plots, change Date axis to local timezone
      global : {
          useUTC : false
      }
  });
})


Template.RainfallDistribution.helpers({
  
  weatherStations2: () => {
    const stations = WeatherStations2.find({}).fetch()

    stations.sort((a, b) => {
      return a.label.charCodeAt(0) - b.label.charCodeAt(0)
    })

    return stations
  },

  currentlySelected: (curr) => {
    const label = Session.get('label')
    $('#preview-select-location').val(label)
  },

  currentlocation: () => {
    const stationID = FlowRouter.getParam('stationID')
    const label = Session.get('label')
    const current_location = WeatherStations2.findOne({id: stationID, label: label})
    return current_location
  },

  isRice: () => {
    if (Session.get('selected_crop') == "Rice"){
      return true
    } else {
      return false
    }
  }

});

Template.RainfallDistribution.events({
  'click #preview-select-crop': function(){
    const selected_crop = $('#preview-select-crop').val()

    Session.set('selected_crop', selected_crop)
  },
   'click #submit-date': function(){
    const label = $('#preview-select-location').val()
    const stationID = Session.get('PGStationID')
    Session.set('PGStationID', stationID)

    $('#rainfall-distribution-dialog-title').html(`
      <p style="font-size:20px;">GUIDE TO PLANTING DATES</p>
      Rainfall Distribution for `+label+` <span style="font-size:23px">based on historical weather data</span>`)
    $('#rainfall-distribution-dialog-desc').html(`
      <p style="padding-left: 0.7cm; padding-top:0.3cm; font-size:17px;">Planting dates are guided by rainfall distribution. Please select crop, variety, location, and date below then click view for the cumulative rainfall and expected yield based on the chosen crop, variety, location, and date.</br></br>
      <strong>NOTE:</strong> <span style="font-size:15px;">Before clicking "view", make sure that the rainfall distribution graph is <span style="color:red">completely displayed</span>. If not, please <span style="color:red">close</span> the dialog then <span style="color:red">reload</span> and <span style="color:red">try again</span>. After reloading, <span style="color:red">please wait</span> <br/>until the chart has been loaded fully.</span>
      </p>
    `)
    $('#cumulative-rainfall-dialog-title').html(`
      <p style="font-size:20px;">GUIDE TO PLANTING DATES</p>
      Cumulative Rainfall for `+label+` <span style="font-size:23px">based on historical weather data</span>`)
  },
  


});

Template.RainfallDistribution.onRendered(() => {
  console.log("rendered")
  //ONRENDERED START

  $('<div class="meteogram">').appendTo('#new_chart').highcharts(Meteor.PlantingGuideGraph.constructChart())

  //init tool tips
    $('[data-toggle="tooltip"]').tooltip();
    $('#dash_1,#dash_2').hide();
    //translate eveything that has lockey
    //localize();
    //localize_Allrevised();    
    var toolTip = d3.select('#tooltip');
    var toolTip_ = $('#tooltip');

    var detaCSV = "";

    var currenVSL = {};

    $('[name=options]').change(function () {
        console.log('options lel dongs ' + $('[name=options]:checked').val());
        if ($('[name=options]:checked').val() === 'dsh') {
            $('#dash_1,#dash_2').show();
            $(window).trigger('resize');
        } else {
            $('#dash_1,#dash_2').hide();
        }
    });

    (function (view) {
        "use strict";
        $('#tbl_save').click(function () {
            //table click save event
            var BB = view.Blob;
            saveAs(
                new BB(
                    [detaCSV]
                    , { type: "text/csv;charset=utf-8" }
                )
                , "data.csv"
            );
        });
    }(self));

    //<editor-fold defaultstate="collapsed" desc="render Tech table">

    $('#btn_logplox').click(function () {
        $('.dta_level4').show();
        $('#btn_logplox').hide();
    });

    function renderJS(vl) {
        if (vl === undefined) {
            return "";
        }

        if (typeof (vl) === 'string') {
            return vl;
        }
        else if (Array.isArray(vl)) {
            var dsctmp = "<ul>";

            $.each(vl, function (i_, vl_) {
                dsctmp += "<li>" + renderJS(vl_) + "</li>";
            });

            return dsctmp += "</ul>";
        }
        else { // Data must be an object
            var dsctmp = "<ul>";
            for (var key in vl) {
                dsctmp += "<li><strong>" + key + ":</strong> " + renderJS(vl[key]) + "</li>";
            }
            return dsctmp += "</ul>";
        }
    }

    function repositionTooltip(d3Cmp, text) {
        d3Cmp
            .on("mouseover", function (d, i) {
                toolTip_.html(text(d, i)).css("opacity", .9);
                repositionTooltip_(d3.event.pageX, d3.event.pageY);
            })
            .on("mousemove", function (d) {
                repositionTooltip_(d3.event.pageX, d3.event.pageY);
            })
            .on("mouseout", function (d) {
                toolTip_
                    .css("left", "0px")
                    .css("top", "0px");
                toolTip_.css("opacity", 0);
            });
    }

    function repositionTooltip_(eventX, eventY) {
        var gg = toolTip_.width() + 20;
        var ss = $(document).width();
        var x_ = eventX;
        if (eventX + gg > ss) {
            x_ = eventX - gg - 10;
        }

        toolTip_
            .css("left", x_ + "px")
            .css("top", (eventY - 28) + "px");
    }
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="render filter">
    function renderFilter2(d) {
        $('#slct_fltr2').show();
        var flt2 = d3.select('#slct_fltr2');
        flt2.html('');

        flt2.selectAll('option')
            .data(d)
            .enter().append('option').html(function (d) { return d; });
    }
    //</editor-fold>

    //<editor-fold defaultstate="collapsed" desc="filter data by x">
    function filterDataByX(data, categ, value) {
        for (var i = 0; i < data.length; i++) {
            data[i].values = data[i].values.filter(function (d) {
                if (categ === 'categories') {
                    return d[categ][0] === value;
                }

                return d[categ] === value;
            });
        }
        return data;
    }


    function convfNumbers(all) {
        for (var i = 1; i < all.length; i++) {
            for (var ctr = 1; ctr < all[i].length; ctr++) {
                all[i][ctr] = parseFloat(all[i][ctr]);
            }
        }
    }

    function getData(all, name) {
        for (var i = 1; i < all.length; i++) {
            if (all[i][0] === name) {
                return all[i];
            }
        }
    }

    function getDayin366(dt) {
        //var now = new Date();
        var start = new Date(dt.getFullYear(), 0, 0);
        var diff = (dt - start) + ((start.getTimezoneOffset() - dt.getTimezoneOffset()) * 60 * 1000);
        var oneDay = 1000 * 60 * 60 * 24;
        var day = Math.floor(diff / oneDay);
        console.log('Day of year: ' + day);
        return day;
    }

    function get366inDay(dt_int) {
        var dateInpt = $('#inpt_date');
        var dt = dateInpt[0].valueAsDate;
        var start = new Date(dt.getFullYear(), 0, 0);
        var oneDay = 1000 * 60 * 60 * 24;
        var diff = dt_int * oneDay;
        //console.log("get"+(dt));        
        //console.log(dt.getFullYear());
        //console.log(start);
        //start += diff;
        //var dd = new Date(start + diff);
        //console.log(start+diff);   
        return start;
    }

    d3.queue()
        .defer(d3.text, "/planting-guide/test_rainfall.csv")
        .defer(d3.text, "/planting-guide/test_min.csv")
        .defer(d3.text, "/planting-guide/test_max.csv")
        .defer(d3.xml, "/planting-guide/PH-province.svg")
        .defer(d3.csv, "/planting-guide/test_province.csv")
        .defer(d3.text, "/planting-guide/test_dailyrainfall.csv")        
        .defer(d3.text, "/planting-guide/test_crop.csv")
        .defer(d3.text, "/planting-guide/test_yld.csv")

        .await(function (error, file1, file2, file3, documentFragment, provinces, file4, file5, revData) {
            console.log("Revised Data");
            console.log(revData);

            if (error) {
                console.error('Oh dear, something went wrong: ' + error);
            } else {
                var rainfall_all = d3.csvParseRows(file1);
                convfNumbers(rainfall_all);
                var min_all = d3.csvParseRows(file2);
                convfNumbers(min_all);
                var max_all = d3.csvParseRows(file3);
                convfNumbers(max_all);

                var crop_all = d3.csvParseRows(file5).slice(1);
                
                var crop_allRev = d3.csvParseRows(revData).slice(1);

                var rainfalldaily_all = d3.csvParseRows(file4);
                convfNumbers(rainfalldaily_all);
                console.log(rainfalldaily_all);

                var dateStr = rainfall_all[0].slice(1);

                var coordsList = {
                    "Batac City, Ilocos Norte": { "lat": 18.0460318, "long": 120.59407770000007 },
    
                    "Butuan City, Agusan del Norte": { "lat": 8.9475377, "long": 125.54062339999996 },
                    "Calapan, Oriental Mindoro": { "lat": 13.3770935, "long": 121.16457059999993 },
                    "Davao City, Davao del Sur": { "lat": 7.190708, "long": 125.45534099999998 },
                    "Echague, Isabela": { "lat": 16.6701364, "long": 121.71710580000001 },
                    "Guinobatan, Albay": { "lat": 13.1541858, "long": 123.55040759999997 },
                    "Iloilo City, Iloilo": { "lat": 10.7201501, "long": 122.56210629999998 },
                    "La Granja, Negros Occidental": { "lat": 10.4088479, "long": 122.98319979999997 },
                    "Legazpi City, Albay": { "lat": 13.1390621, "long": 123.74379950000002 },
                    "Los Baños, Laguna": { "lat": 14.1699121, "long": 121.24406309999995 },
                    "Lumbia, Misamis Oriental": { "lat": 8.4125734, "long": 124.61029529999996 },
                    "Mactan, Cebu": { "lat": 10.2990463, "long": 123.96385310000005 },
                    "Malaybalay, Bukidnon": { "lat": 8.1306038, "long": 125.12765360000003 },
                    "Muñoz, Nueva Ecija": { "lat": 15.7294899, "long": 120.8728615 },
                };                


                var coordsListRev = {
                    "ILOCOS NORTE":{"BATAC":"Batac City, Ilocos Norte"},
                    "AGUSAN DEL NORTE":{"BUTUAN":"Butuan City, Agusan del Norte"},
                    "ORIENTAL MINDORO":{"CALAPAN":"Calapan, Oriental Mindoro"},
                    "DAVAO DEL SUR":{"DAVAO CITY":"Davao City, Davao del Sur"},
                    "ISABELA":{"ECHAGUE":"Echague, Isabela"},
                    "ALBAY":{
                        "GUINOBATAN":"Guinobatan, Albay",
                        "LEGAZPI":"Legazpi City, Albay"
                    },
                    "ILOILO":{"ILOILO CITY":"Iloilo City, Iloilo"},
                    "NEGROS OCCIDENTAL":{"LA CARLOTA":"La Granja, Negros Occidental"},
                    "LAGUNA":{"LOS BANOS":"Los Baños, Laguna"},
                    "MISAMIS OCCIDENTAL":{"LUMBIA":"Lumbia, Misamis Oriental"},
                    "CEBU":{"MACTAN":"Mactan, Cebu"},
                    "BUKIDNON":{"MALAYBALAY":"Malaybalay, Bukidnon"},
                    "NUEVA ECIJA":{"MUNOZ":"Muñoz, Nueva Ecija"},
                }; 

                function getLatLong(loc){
                    var mapL = 116.927573;
                    var mapR = 126.606549;
                    var mapT = 20.834769;
                    var mapB = 4.640292;
                    var cx = (coordsList[loc]["long"] - mapL) * (800 / (mapR - mapL));
                    var cy = 1260 - ((coordsList[loc]["lat"] - mapB) * (1260 / (mapT - mapB)));
                    return [cx,cy];
                }

                function getLatLong_XY(flt){
                    var mapL = 116.927573;
                    var mapR = 126.606549;
                    var mapT = 20.834769;
                    var mapB = 4.640292;
                    var cx = (flt - mapL) * (800 / (mapR - mapL));
                    var cy = 1260 - ((flt - mapB) * (1260 / (mapT - mapB)));
                    return [cx,cy];
                }

                //console.log(rainfall_all);
                var svgNode = documentFragment.getElementsByTagName("svg")[0];
                //document.getElementsByTagName("body").appendChild(svgNode);            
                $('#svg_rainmap,#svg_rainmap_1').append(svgNode);
                $('#svg_rainmap_1').find('#svgPHfullmap').attr('id','svgPHfullmap_1');

                var slct_loc = $('#slct_loc');
                for (var i = 1; i < rainfall_all.length; i++) {
                    slct_loc.append('<option>' + rainfall_all[i][0] + '</option>');
                }

                slct_loc.val('Echague, Isabela');
                slct_loc.change(function () {

                  var loc = slct_loc.val();
                    $('.spn_location_').html(loc);
                    console.log(loc);
                    var rainfall = getData(rainfall_all, loc);
                    //console.log(rainfall);

                    var prnt = d3.select('#svg_rainpain');
                    prnt.html('');

                    var width = $('#svg_rainpain').width();
                    var data = rainfall.slice(1);//data.sort(function(a,b){return d3.ascending(a.key,b.key);});
                    //console.log('sroted');
                    console.log(data);

                    var dmn = [];
                    for (var i = 0; i < 52; i++) {
                        dmn[i] = i;
                    }
                    var x_band = d3.scaleBand().rangeRound([60, width - 60]).domain(dmn);

                    var x = d3.scaleLinear().rangeRound([60, width - 60]);
                    x.domain([0, data.length]);
                    //var dmn = data.map(function(d) { return d.key; }); 
                    // x.domain(dmn);
                    var y = d3.scaleLinear().rangeRound([300, 50]);
                    y.domain([0, d3.max([80, d3.max(data)])]);

                    var valueline = d3.line()
                        .x(function (d, i) { return x_band(i) + x_band.bandwidth() / 2; })
                        .y(function (d) { return y(d); });

                    var varArea = d3.area()
                        .x(function (d, i) { return x_band(i) + x_band.bandwidth() / 2; })
                        .y0(300)
                        .y1(function (d) { return y(d); });

                    prnt.append('g').append("path")
                        //.data(data)
                        .attr("class", "area")
                        .attr("fill", "#0957eb"/*"#FDC787"*/)
                        .attr("d", varArea(data));

                    prnt.append('g').append("path")
                        .attr("class", "line")
                        .attr("d", valueline(data))
                        .attr("fill", "none")
                        .attr("stroke", "#1e3bb4"/*"#FCB45E"*/)
                        .attr("stroke-width", "3px");

                    var cirle = prnt.selectAll("circle")
                        .data(data)
                        .enter().append("circle")
                        .attr("cx", function (d, i) { return x_band(i) + x_band.bandwidth() / 2; })
                        .attr("cy", function (d) { return y(d); })
                        .attr("text-anchor", "middle")
                        .attr("fill", "#1e3bb4"/*"#FCB45E"*/)
                        .attr("r", 5);

                    repositionTooltip(cirle, function (d, i) { return dateStr[i] + "<br>Rainfall: " + d + " mm"; });

                    var min_one = getData(min_all, loc).slice(1);
                    var max_one = getData(max_all, loc).slice(1);

                    var y_temp = d3.scaleLinear().rangeRound([300, 50]);
                    y_temp.domain([
                        d3.min([20, d3.min(min_one), d3.min(max_one)])
                        , d3.max([36, d3.max(min_one), d3.max(max_one)])]);

                    var min_line = d3.line()
                        .x(function (d, i) { return x_band(i) + x_band.bandwidth() / 2; })
                        .y(function (d) { return y_temp(parseFloat(d)); });

                    prnt.append('g').append("path")
                        .attr("class", "line")
                        .attr("d", min_line(min_one))
                        .attr("fill", "none")
                        .attr("stroke", "yellow")
                        .attr("stroke-width", "3px");

                    prnt.append('g').append("path")
                        .attr("class", "line")
                        .attr("d", min_line(max_one))
                        .attr("fill", "none")
                        .attr("stroke", "orange")
                        .attr("stroke-width", "3px");

                    prnt.append("g")
                        .attr("transform", "translate(60,0)")
                        .call(d3.axisLeft(y).tickFormat(function (d, i) { return d + " mm"; }));

                    prnt.append("g")
                        .attr("transform", "translate(" + (width - 60) + ",0)")
                        .call(d3.axisRight(y_temp).tickFormat(function (d, i) { return d + " ℃"; }))
                        .selectAll("text")
                        .attr("x",35)
                        ;

                    prnt.append("g")
                        .attr("transform", "translate(" + 0 + "," + 300 + ")")
                        .call(d3.axisBottom(x_band).tickFormat(function (d, i) { return dateStr[d]; }))
                        .selectAll("text")
                        .attr("y", 0)
                        .attr("x", 9)
                        .attr("dy", ".35em")
                        .attr("transform", "rotate(90)")
                        .style("text-anchor", "start");

                    if ($('#svgPin').length == 0) {
                        var g = d3.select("#svgPHfullmap")
                            .append('circle')
                            .attr('id', 'svgPin')
                            .attr('cx', 300)
                            .attr('cy', 300)
                            .attr('stroke', 'blue')
                            .attr('stroke-width', 12)
                            .attr('r', 12)
                            .attr('fill', 'white');
                    }

                    var c = getLatLong(loc);

                    var tooltip = d3.select('#tooltip');
                    d3.select('#svgPin')
                        .attr('cx', c[0])
                        .attr('cy', c[1])
                        .on("mouseover", function () {
                            tooltip.transition()
                                .duration(200)
                                .style("opacity", .9);
                            tooltip.html(function () {
                                return "<strong>" + loc + "</strong>";
                            })
                                .style("left", (d3.event.pageX) + "px")
                                .style("top", (d3.event.pageY - 28) + "px");
                        })
                        .on("mouseout", function () {
                            tooltip.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });

                    dateInpt.change();
                })//SLCT_LOC END

                provinces.forEach(function (d) {
                    d.April = +d.April;
                    d.May = +d.May;
                    d.June = +d.June;
                    d.July = +d.July;
                    d.August = +d.August;
                });



                var color_low = "#d9e0dc";//"red";//'#ed534e';                    
                var color_mid = "#74dcfd";//"yellow"
                var color_high = "#0957eb";//"green";
                var color_max = "#1e3bb4";//"#003300";

                var dateInpt = $('#inpt_date');
                var now = new Date();
                dateInpt[0].valueAsDate = now;
                var dayInt = getDayin366(dateInpt[0].valueAsDate);

                var color = d3.scaleLinear().domain([0, 100, 200, 800])
                    .range([color_low, color_mid, color_high, color_max]).interpolate(d3.interpolateHcl);
                
                //map on lower part
                var svg_map = d3.select("#svgPHfullmap");
                var rain_fall_cirle = svg_map.selectAll("circle")
                .data(Object.keys(coordsList))
                .enter().append("circle")
                .attr("cx", function (d) { return getLatLong(d)[0]; })
                .attr("cy", function (d) { return getLatLong(d)[1]; })
                .attr('stroke', 'red')
                .attr('stroke-width', 12)
                .attr('r', 12)
                .attr('fill', 'white')
                .on("click", function (d) {
                    slct_loc.val(d);
                    slct_loc.change();
                });
                repositionTooltip(rain_fall_cirle, function (d, i) { return d; });


                function changeMonth(month) {
                    //d3.select("#svg_mainlbl").text("Philippines Rainfall MAP:"+month+" 2017");                        
                    var lands = svg_map.selectAll("path.land")
                        .data(provinces, function (d) {
                            return (d && d.Province) || d3.select(this).attr("title");
                        })
                        .transition().duration(1000)
                        .style("fill", function (d) {
                            return color(d[month]);
                        });
                    //repositionTooltip(lands, function (d) { return  "<h4>"+d.Province+"</h4>"+
                    //"Number of Municipalities: "+1+""; });
                }
                changeMonth("April");

                dateInpt.change(function () {
                  renderCropMaprev();

                  var loc = slct_loc.val();
                  dayInt = getDayin366(dateInpt[0].valueAsDate);
                  get366inDay(dayInt);

                  console.log("day in shait" + dayInt);                   

                  var prnt_dailyrain = d3.select('#svg_rainpain_gg');
                  prnt_dailyrain.html('');

                  var lowerBnd = dayInt > 30 ? 30: dayInt - 1;                    
                  var rainfall_daily_one = getData(rainfalldaily_all, loc).slice(1).slice(dayInt - lowerBnd, dayInt + 10);

                  console.log(rainfall_daily_one);
                  var dmn_dailyrain = [];
                  for (var i = 0; i < rainfall_daily_one.length; i++) {
                      dmn_dailyrain[i] = i;
                  }

                  var accumlumated = [];
                    var accum = 0;
                    for (var i = 0; i < rainfall_daily_one.length; i++) {
                        if(i>lowerBnd){
                            accum += rainfall_daily_one[i];
                        }
                        accumlumated[i] = accum;
                    }

                    if(accum > 100){
                        $('.spn_low_yld_eng').hide();
                    }else{                        
                        $('.spn_low_yld_eng').show();
                    }

                    $("#spn_rainfall_1,#spn_rainfall_2").html( Math.floor(accum));

                    var dt_selected = dateInpt[0].valueAsDate;
                    $(".spn_date,#spn_date_1,#spn_date_2").html( dt_selected.getFullYear()+'-' + (dt_selected.getMonth()+1) + '-'+dt_selected.getDate());

                    var width_gg = $('#svg_rainpain_gg').width();
                    var x_band_dailyrain = d3.scaleBand().rangeRound([60, width_gg - 60]).domain(dmn_dailyrain).padding(0.1);
                    var x_band_dailyrain_bg = d3.scaleBand().rangeRound([60, width_gg - 60]).domain(dmn_dailyrain);

                    var y_gg = d3.scaleLinear().rangeRound([300, 50]);
                    y_gg.domain([0, d3.max([30, d3.max(rainfall_daily_one),d3.max(accumlumated)])]);

                    var line_raindaily = d3.line()
                        .x(function (d, i) { return x_band_dailyrain(i) + x_band_dailyrain.bandwidth() / 2; })
                        .y(function (d) { return y_gg(d); });

                    var rect = prnt_dailyrain.append("g").selectAll(".bar")
                        .data(accumlumated)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function (d, i) { return x_band_dailyrain_bg(i); })
                        .attr("y", function (d) { return 50; })
                        .attr("fill", "#FCFFC3")
                        .attr("width", x_band_dailyrain_bg.bandwidth())
                        .attr("height", function (d,i) { return i<lowerBnd?0:250; });
                    
                    repositionTooltip(rect, function (d, i) { return "Accumulated Rainfall: " + d + " mm"; });

                    prnt_dailyrain.append("g")
                        .attr("transform", "translate(60,0)")
                        .call(d3.axisLeft(y_gg).tickFormat(function (d, i) { return d + " mm"; }));
                    
                    var rect_bg = prnt_dailyrain.append("g").selectAll(".bar")
                        .data(rainfall_daily_one)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function (d, i) { return x_band_dailyrain(i); })
                        .attr("y", function (d) { return y_gg(d); })
                        .attr("fill", "#94CCFF")
                        .attr("width", x_band_dailyrain.bandwidth())
                        .attr("height", function (d) { return 300 - y_gg(d); });
                    repositionTooltip(rect_bg, function (d, i) { return "Daily Rainfall: " + d + " mm"; });

                    prnt_dailyrain.append('g').append("path")
                        .attr("class", "line")
                        .attr("d", line_raindaily(accumlumated))
                        .attr("fill", "none")
                        .attr("stroke", "#8DDE7A")
                        .attr("stroke-width", "3px");

                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    prnt_dailyrain.append("g")
                        .attr("transform", "translate(" + 0 + "," + 300 + ")")
                        .call(d3.axisBottom(x_band_dailyrain).tickFormat(function (d, i) {
                            var dt_ml = dateInpt[0].valueAsDate.getTime() + ((i-lowerBnd) * 1000 * 60 * 60 * 24);
                            var dt = new Date(dt_ml);
                            return monthNames[dt.getMonth()]+" "+dt.getDate();
                        }))
                        .selectAll("text")
                        .attr("y", 0)
                        .attr("x", 9)
                        .attr("dy", ".35em")
                        .attr("transform", "rotate(90)")
                        .style("text-anchor", "start");
                        
                    $('#slct_brgy').change();


                })//dateInpt.change END
                dateInpt.change();

                slct_loc.change();
                $(window).on('resize', function () {
                    slct_loc.change();
                });


                console.log(crop_all);
               
                function renderVariety(){
                    var prnt = d3.select('#slct_variety');
                    var provs = d3.map(crop_all,function(d){ return d[65];}).keys();    
                    var opts = prnt.selectAll('option').data(provs);    
                    tidyUpselectDropdown(opts);
                    renderProvinces();
                }

                function renderProvinces(){
                    var prnt = d3.select('#slct_prov');
                    var provs = crop_all.filter(function(d){   
                        return d[65] == $('#slct_variety').val();    
                    });
                    provs = d3.map(provs,function(d){ return d[1];}).keys();    
                    var opts = prnt.selectAll('option').data(provs);
                    tidyUpselectDropdown(opts);
                    renderMuni();
                }
                
                function renderMuni(){
                    var prnt = d3.select('#slct_muni');    
                    var muni = crop_all.filter(function(d){   
                        return d[65] == $('#slct_variety').val() && d[1] == $('#slct_prov').val();    
                    });        
                    muni = d3.map(muni,function(d){ return d[2];}).keys();    
                    var opts = prnt.selectAll('option').data(muni);
                    tidyUpselectDropdown(opts);
                    renderBrgy();
                }
                
                function renderBrgy(){
                    var prnt = d3.select('#slct_brgy');    
                    var brgy = crop_all.filter(function(d){   
                        return d[65] == $('#slct_variety').val() && d[1] == $('#slct_prov').val() && d[2] == $('#slct_muni').val();    
                    });    
                    brgy = d3.map(brgy,function(d){ return d[3];}).keys();    
                    var opts = prnt.selectAll('option').data(brgy);
                    tidyUpselectDropdown(opts);
                    //renderData();
                }

                function tidyUpselectDropdown(opts){
                    //add if needed
                    opts.enter().append('option')
                    .text(function (d) { return d; });//initial state                
                    //remove uneeded
                    opts.exit().remove();                
                    //will update DOM objects
                    opts.text(function (d) { return d; })
                        .attr('value',function (d) { return d; });  
                }

                $('#slct_prov').change(renderMuniRev);
                $('#slct_muni').change(renderBrgyRev);

                $('#slct_brgy').change(function(){
                  renderCropMaprev();

                  var data = crop_allRev.filter(function(d){   
                      return d[2] == $('#slct_brgy').val() && d[0] == $('#slct_prov').val() && d[1] == $('#slct_muni').val();                        
                      //console.log($('#slct_brgy').val()+$('#slct_prov').val()+$('#slct_muni').val());
                  });

                  console.log("data found");
                  console.log(data);

                  var weekNo = Math.floor(dayInt / 7);
                    //console.log("week no is:"+weekNo);                    

                  var allWeeks = data[0].slice(7,7+52);    
                  var landAvg = d3.mean(allWeeks, function(d) { return d; });

                  function aveDiff(cur,ave){
                      var yieldDiff = ((cur - ave) / ave) * 100;
                      return Math.round( yieldDiff * 10) / 10;
                  }

                  console.log(allWeeks)
                  console.log(weekNo)
                  console.log(allWeeks[weekNo])

                  var yield_value = allWeeks[weekNo];

                  var yieldDiff = aveDiff(yield_value,landAvg);

                  $('.spn_yld_diff').html(Math.abs(yieldDiff));

                  $('#spn_yld_diff_eng').html(yieldDiff < 0 ? "lower" : "higher");
                  $('#spn_yld_diff_fil').html(yieldDiff < 0 ? "mababa" : "mataas");

                  $('.spn_crop').html($('#slct_dspMap').val());
                  $('.spn_var').html($('#slct_variety').val());

                  function monthData(class_nigger, lowInd, upIndex) {
                      var jan_grid = d3.selectAll(class_nigger)
                          .html('')
                          .classed('table-success', false)
                          .classed('table-danger', false)
                          .data(allWeeks.slice(lowInd,upIndex))
                          .classed('table-success', function (d) { return landAvg < d; })
                          .classed('table-danger', function (d) { return landAvg > d; })
                          
                          jan_grid.append('h4')
                          .attr('class', 'p-0 m-0')
                          .style('margin','0')
                          .html(function (d) {
                              return landAvg < d ? '<i class="fas fa-check"></i>' : '<i class="fas fa-minus"></i>';
                          });

                          jan_grid.append('small').html(function(d,i){
                              return dateStr[lowInd + i];
                          });
                      repositionTooltip(jan_grid, function (d, i) {
                          var diff = aveDiff(d, landAvg);
                          return dateStr[lowInd + i]+ "<br>Yield difference compared to average: " + diff + "% " + (
                              diff < 0 ? '<i class="fas fa-level-down-alt"></i>' : '<i class="fas fa-level-up-alt"></i>'
                          );
                      });
                  }

                  monthData(".dt_jan",0,5);
                  monthData(".dt_feb",4,9);                    
                  monthData(".dt_mar",8,13);                                   
                  monthData(".dt_apr",13,18);                                                     
                  monthData(".dt_may",17,22);                                                
                  monthData(".dt_jun",21,26);                                                                 
                  monthData(".dt_jul",26,31);                                                                                 
                  monthData(".dt_aug",30,35);                                                                               
                  monthData(".dt_sept",34,39);                                                                                                
                  monthData(".dt_oct",39,44);                                                                                            
                  monthData(".dt_nov",43,48);                                                                                            
                  monthData(".dt_dec",47,52);
                })//$('#slct_brgy').change END


                function renderProvincesRev(){
                    var prnt = d3.select('#slct_prov');
                    var provs = d3.map(crop_allRev,function(d){ return d[0];}).keys();    
                    var opts = prnt.selectAll('option').data(provs);
                    tidyUpselectDropdown(opts);
                    renderMuniRev();
                }

                function renderMuniRev(){
                    var prnt = d3.select('#slct_muni');    
                    var muni = crop_allRev.filter(function(d){   
                        return d[0] == $('#slct_prov').val();    
                    });        
                    muni = d3.map(muni,function(d){ return d[1];}).keys();    
                    var opts = prnt.selectAll('option').data(muni);
                    tidyUpselectDropdown(opts);
                    renderBrgyRev();
                }

                //actually render year types
                function renderBrgyRev(){       
                    var prnt = d3.select('#slct_brgy');    
                    var brgy = crop_allRev.filter(function(d){   
                        return d[0] == $('#slct_prov').val() && d[1] == $('#slct_muni').val();    
                    });    
                    brgy = d3.map(brgy,function(d){ return d[2];}).keys();    
                    var opts = prnt.selectAll('option').data(brgy);
                    tidyUpselectDropdown(opts);
                    //renderData();
                }

                function renderCropMaprev(){
                    var dateInpt = $('#inpt_date');
                    var dayInt = getDayin366(dateInpt[0].valueAsDate);

                    var data = crop_allRev.filter(function(d){   
                        return d[2] == $('#slct_brgy').val();    
                    });

                    console.log('day changed:'+ Math.round(dayInt/7));

                    var svg_map_1 = d3.select("#svgPHfullmap_1");
                    svg_map_1.selectAll("circle").remove();

                    var var_map_circle = svg_map_1.selectAll("circle")
                    .data(data)
                    .enter().append("circle")
                    .attr("cx", function (d) { return getLatLong(coordsListRev[d[0]][d[1]])[0]; })
                    .attr("cy", function (d) { return getLatLong(coordsListRev[d[0]][d[1]])[1]; })
                    .attr('stroke', 'black')
                    .attr('stroke-width',3)
                    .attr('r', 15)
                    .attr('fill', function(d){
                        //#c3e6cb
                        return parseInt(d[6])  < parseInt(d[7 + Math.floor(dayInt/7)]) ? '#28a745' : '#f5c6cb';
                    })
                    .on("click", function (d) {
                        //slct_loc.val(d);
                        //slct_loc.change();
                    });
                    repositionTooltip(var_map_circle, function (d, i) { return d[0]+","+d[1]+"<br>"+d[6]+" vs "+d[7 + Math.floor(dayInt/7)]; });
                }

                renderProvincesRev();
                $('#slct_brgy').change();

            }// ELSE END
        });// D3.queue END

  //ONRENDERED END

})

const displayRainfallDistributionData = (stationID, label) => {
  //remove any existing chart first
  $('div.rainfall-chart').remove()

  //Add (temporary) spinner
  $('<div class="rainfall-chart rainfall-chart-stub"><div class="mdl-spinner mdl-js-spinner is-active"></div></div>').appendTo('#rainfall-distribution-chart-container')

  const rainfallDistributionData = RainfallDistributionData.find({id: stationID}).fetch()

  const cumulativeData = WeatherData.find({id: stationID}).fetch()

  //have to reconcile missing entries
  if (rainfallDistributionData) {
    const weekly_rainfall = RainfallDistributionData.find({id: stationID},{fields:{'weekly_rainfall':1}}).fetch()
    const weekly_maxtemp = RainfallDistributionData.find({id: stationID},{fields:{'weekly_maxtemp':1}}).fetch()
    const weekly_mintemp = RainfallDistributionData.find({id: stationID},{fields:{'weekly_mintemp':1}}).fetch()

    if (cumulativeData) {
      const weekly_rainfall_16 = Meteor.RainfallDistribution.getWeeklyRainfall(cumulativeData)

    $('div.rainfall-chart').remove()
    $('<div class="rainfall-chart">').appendTo('#rainfall-distribution-chart-container').highcharts(Meteor.RainfallDistribution.constructChartOfRainfallDistribution(weekly_rainfall,weekly_maxtemp,weekly_mintemp, weekly_rainfall_16.pastWeeklyRainfall))
    }
  }
}

const displayRainData = (stationID, label, crop, variety, raw_date, digit_selected_date, date, date_subscribe) => {
  //remove any existing chart first
  $('div.rainfall-chart').remove()

  //Add (temporary) spinner
  $('<div class="rainfall-chart rainfall-chart-stub"><div class="mdl-spinner mdl-js-spinner is-active"></div></div>').appendTo('#rainfall-chart-container')

  const cumulativeData = WeatherData.find({id: stationID}).fetch()
  let date_today = new Date().setHours(0,0,0,0)

  let digit_last_forecast = new Date()
  // digit_last_forecast.setDate(digit_last_forecast.getDate() + 9)     // full date
  digit_last_forecast = digit_last_forecast.getDate() + 9               // digit only

  let date_last_forecast = new Date()
  date_last_forecast.setDate(date_last_forecast.getDate() + 9)          // full date

  let digit_current_date = new Date()
  digit_current_date = digit_current_date.getDate()

  // if (raw_date < date_today){
  //   console.log('PAST')
  // }else if (raw_date > date_today){
  //   console.log('FUTURE')
  // }else{
  //   console.log('PRESENT')
  // }

  let forecastDates = []
  let forecastIndex
  for(i=0; i<10; i++){
    forecastDates.push({ x: i, y: digit_current_date})
    digit_current_date += 1
    if (forecastDates[i].y == digit_selected_date){
      forecastIndex = forecastDates[i].x
    }
  }

  digit_current_date = new Date()
  digit_current_date = digit_current_date.getDate()

  let date_first_historical = new Date()
  date_first_historical.setDate(date_first_historical.getDate() + 9)     // full date
  
  let date_last_historical = new Date()
  date_last_historical.setDate(raw_date.getDate())                       // full date
  

  let date_for_query
  date_for_query = new Date(raw_date)
  

  let date_for_graph = new Date(raw_date)
  
  // date_for_graph.setDate(raw_date.getDate())
  date_for_graph = date_for_graph.toString().slice(4,15)
  
  // for twenty days
  let twentyDaysAgo = new Date(date_subscribe)
  twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 21)
  twentyDaysAgo = twentyDaysAgo.toISOString()

  const cumulativeDataForTwenty = WeatherData.find({id:stationID, dateUTC: { $gt: new Date(twentyDaysAgo)}}).fetch()

  // Get the dates already part of 10-day forecast or historical rainfall to avoid overlapping of dates
  let diffDays
  if(new Date() < raw_date){
    diffDays = raw_date.getDate() - new Date().getDate()
  }else{
    diffDays = 0
  }

  //have to reconcile missing entries
  if (cumulativeData) {
    // console.log('date_for_query: '+date_for_query)
    // console.log('raw_date: '+raw_date)

    const fixedData = Meteor.RainfallDistribution.fillMissingEntries(cumulativeData.reverse(), date_for_query)  // creation of array of dates with rainfall
    const fixedDataForTwenty = Meteor.RainfallDistribution.fillMissingEntriesForTwenty(cumulativeDataForTwenty.reverse(), date_for_query)  // creation of array of dates with rainfall

    const pastRainfall = Meteor.RainfallDistribution.getPastRainfall(fixedData)   // past rainfall and past accumulated rainfall
    const pastRainfallForTwenty = Meteor.RainfallDistribution.getPastRainfall(fixedDataForTwenty)   // past rainfall and past accumulated rainfall

    const apiKey = DSSSettings.findOne({name: 'wunderground-api-key-planting-guide'})

    // ************* IF PREVIOUS DATE THAN CURRENT DATE ************* //
    if (raw_date < date_today){
      //remove any existing chart first
      $('div.rainfall-chart').remove()
      const runningTotal = pastRainfall.pastAccRainfall[29].y     // 30-day rainfall
 
      $('<div class="rainfall-chart">').appendTo('#rainfall-chart-container').highcharts(Meteor.RainfallDistribution.constructChartPast(pastRainfall.pastRainfall, pastRainfall.pastAccRainfall, pastRainfallForTwenty.pastAccRainfall))

      const percentMeanData = PercentMeanData.find({id: stationID, crop: crop, variety: variety}).fetch()
      let expected, percent_english, percent_filipino, sentence_english, sentence_filipino
      for (let entry of percentMeanData){
        if(eval('entry.percentMean._'+date) != null){
          expected = eval('entry.percentMean._'+date)
          if(expected < 0){
            expected = expected * (-1)
            percent_english = 'lower'
            percent_filipino = 'mababa'
          }else{
            percent_english = 'higher'
            percent_filipino = 'mataas'
          }
        }
      }

      if(crop=="Rice"){
        crop="rainfed rice"
      }else if(crop=="Corn"){
        crop="corn"
      }
      sentence_english = 'If you plant <span style="color:blue">'+crop+' ('+variety+')</span> on '+date_for_graph+', expected yield may be <span style="color:red">'+expected+'% '+percent_english+'</span> than the average*.'
      sentence_filipino = 'Kung magtatanim sa '+date_for_graph+', ang inaasahang ani ay maaaring <span style="color:red">'+expected+' porsyento mas '+percent_filipino+'</span> kaysa pangkaraniwan*.'

      $('#rainfall-chart-text-container').html(`
      <br/><p style="font-size:17px">${sentence_english}</p>
      <p style="font-size:17px">${sentence_filipino}</p>
      <p style="font-size:15px">*simulated using ${label} historical weather data from PAGASA (assuming no extreme events like typhoon and pest incidence)</p>
      `)
    }
    // ************* IF FUTURE DATE OUTSIDE 10-DAY FORECAST ************* //
    else if (date_last_forecast < raw_date){
      const historicalDailyRainData = HistoricalDailyRainData.find({id: stationID}).fetch()
    if (apiKey) {
      $.getJSON(`http:\/\/api.wunderground.com/api/${apiKey.value}/forecast10day/q/pws:${stationID}.json`, (result) => {

        //remove any existing chart first
        $('div.rainfall-chart').remove()

        const runningTotal = pastRainfall.pastAccRainfall[29-diffDays].y     // 30-day rainfall
        const runningTotalForTwenty = pastRainfallForTwenty.pastAccRainfall[19-diffDays].y     // 20-day rainfall

        const forecast = Meteor.RainfallDistribution.getForecast(result, runningTotal, runningTotalForTwenty)  // rainfall forecast and total rainfall forecast, plotBandStart and plotBandEnd

        const runningForecastTotal = forecast.forecastAccumulated[9].y     // 30-day rainfall from last day of forecast
        const runningForecastTotalWithTwenty = forecast.forecastAccumulatedWithTwenty[9].y     // 20-day rainfall from last day of forecast

        // console.log('date_first_historical: '+date_first_historical)
        // console.log('date_last_historical: '+date_last_historical)
        const historical = Meteor.RainfallDistribution.getHistoricalRainfall(date_first_historical, date_last_historical, historicalDailyRainData, runningForecastTotal, runningForecastTotalWithTwenty)
        const completeData = Meteor.RainfallDistribution.assembleHistoricalRainfallData(pastRainfall.pastRainfall, pastRainfall.pastAccRainfall, pastRainfallForTwenty.pastAccRainfall, forecast.forecastRainfall, forecast.forecastAccumulated, forecast.forecastAccumulatedWithTwenty, historical.pastHistoricalRain, historical.pastHistoricalAccRain, historical.pastHistoricalAccRainWithTwenty)   // completeRainfall and completeAccumulatedRainfall
        // console.log('historical.plot_first_historical: '+historical.plot_first_historical+' historical.plot_last_historical: '+historical.plot_last_historical)
        $('<div class="rainfall-chart">').appendTo('#rainfall-chart-container').highcharts(Meteor.RainfallDistribution.constructHistoricalChart(completeData.completeRainfall, completeData.completeAccumulatedRainfall, completeData.completeAccumulatedRainfallWithTwenty, forecast.plotBandStart, forecast.plotBandEnd, historical.plot_first_historical, historical.plot_last_historical))

        const percentMeanData = PercentMeanData.find({id: stationID, crop: crop, variety: variety}).fetch()
        let expected, percent_english, percent_filipino, sentence_english, sentence_filipino, transition_word_english, transition_word_filipino, raw_expected, sufficiency, sentence_corn_english, sentence_corn_filipino, threshold, total_historical, sentence_corn, is_irrigation_english, is_irrigation_tagalog
        for (let entry of percentMeanData){
          if(eval('entry.percentMean._'+date) != null){
            expected = eval('entry.percentMean._'+date)
            if(expected < 0){
              expected = expected * (-1)
              percent_english = 'lower'
              percent_filipino = 'mababa'
            }else{
              percent_english = 'higher'
              percent_filipino = 'mataas'
            }
            raw_expected = eval('entry.percentMean._'+date)
          }

          if(crop=="Rice"){
            crop="rainfed rice"
            sentence_corn_english = ""
            sentence_corn_filipino = ""
            sentence_corn = "."
            threshold = 200
            num_days = '30'
            total_historical = historical.finalPastHistoricalAccRain
          }else if(crop=="Corn"){
            crop="corn"
            sentence_corn_english = "Where <span style='color:blue'>irrigation</span> is possible, planting corn is <span style='color:blue'>still advisable</span> because harvesting will come during dry months and price is favorable.</br>"
            sentence_corn_filipino = "Kung may <span style='color:blue'>patubig, maaari pa ring magtanim ng mais</span> dahil ang pag-aani ay papatak sa tuyong panahon at ang presyo ng mais ay maganda.</br>"
            sentence_corn = " for rainfed or upland environment <br/> BUT may be recommended for low-lying regions with irrigation."
            threshold = 100
            num_days = '20'
            total_historical = historical.finalPastHistoricalAccRainWithTwenty
          }
        }

        if(total_historical < threshold){
          if(raw_expected > 0){
            transition_word_english = 'However, if'
            transition_word_filipino = 'Ngunit, kung'
            is_irrigation_english = ' if irrigation/water could be provided'
            is_irrigation_tagalog = ' kung may patubig'
          }else{
            transition_word_english = 'If'
            transition_word_filipino = 'Kung'
            is_irrigation_english = ''
            is_irrigation_tagalog = ''
          }

          $('#rainfall-chart-text-container').html(`
          <p style="font-size:22px; font-weight:bold">Planting of `+crop+` (`+variety+`) is NOT recommended`+sentence_corn+`</p>
          <details style="font-size:17px">
          <summary style="font-size:18px">Read More</summary><br/>
          <p style="font-size:17px">`+sentence_corn_english
          +label+` does not have sufficient soil moisture. `+transition_word_english+` you plant <span style="color:blue">`+crop+` (`+variety+`)</span> on ` +date_for_graph+`, expected yield may be <span style="color:red">${expected}% ${percent_english}</span> than the average*`+is_irrigation_english+`.</p>
          <p style="font-size:17px">`+sentence_corn_filipino+`
          Hindi pa sapat ang tubig sa lupa sa `+label+`. `+transition_word_filipino+` magtatanim sa ` +date_for_graph+`, ang inaasahang ani ay maaaring <span style="color:red">${expected} porsyento mas ${percent_filipino}</span> kaysa pangkaraniwan*`+is_irrigation_tagalog+`.</p>
          <p style="font-size:15px">*simulated using ${label} historical weather data from PAGASA (assuming no extreme events like typhoon and pest incidence)</p>
          </details>
          `)
        }else{
          if(raw_expected < 0){
            transition_word_english = 'However, if'
            transition_word_filipino = 'Ngunit, kung'
            is_irrigation_english = ' if irrigation/water could be provided'
            is_irrigation_tagalog = ' kung may patubig'
            sufficiency = "is NOT"
            if(crop=="corn"){
              sentence_corn_english = "Where <span style='color:blue'>irrigation</span> is possible, planting corn is <span style='color:blue'>still advisable</span> because harvesting will come during dry months and price is favorable.</br>"
              sentence_corn_filipino = "Kung may <span style='color:blue'>patubig, maaari pa ring magtanim ng mais</span> dahil ang pag-aani ay papatak sa tuyong panahon at ang presyo ng mais ay maganda.</br>"
              sentence_corn = " for rainfed or upland environment <br/> BUT may be recommended for low-lying regions with irrigation."
            }else{
              sentence_corn_english = ""
              sentence_corn_filipino = ""
              sentence_corn = "."
            }
          }else{
            transition_word_english = 'If'
            transition_word_filipino = 'Kung'
            is_irrigation_english = ''
            is_irrigation_tagalog = ''
            sufficiency = "is"
            if(crop=="corn"){
              sentence_corn_english = "In <span style='color:blue'>low lying areas</span>, corn production is <span style='color:blue'>not practical</span> because of serious water logging problem.</br>"
              sentence_corn_filipino = "Kung nasa <span style='color:blue'>mababang lugar, hindi maipapayong magtanim ng mais</span> dahil maaari itong mabulok o mamatay sa sobrang tubig.</br>"
              sentence_corn = "."
            }else{
              sentence_corn_english = ""
              sentence_corn_filipino = ""
              sentence_corn = "."
            }
          }
          $('#rainfall-chart-text-container').html(`
          <p style="font-size:22px; font-weight:bold">Planting of `+crop+` (`+variety+`) `+sufficiency+` recommended`+sentence_corn+`</p>
          <details style="font-size:17px">
          <summary style="font-size:18px">Read More</summary><br/>
          <p style="font-size:17px">`+sentence_corn_english
          +label+` has sufficient soil moisture on ` +date_for_graph+`. `+transition_word_english+` you plant <span style="color:blue">`+crop+` (`+variety+`)</span> on ` +date_for_graph+`, expected yield may be <span style="color:red">${expected}% ${percent_english}</span> than the average*`+is_irrigation_english+`.</p>
          <p style="font-size:17px">`+sentence_corn_filipino+`
          Ang `+label+`ay maari nang tamnan ng sahod-ulan na palay sa ` +date_for_graph+`. `+transition_word_filipino+` magtatanim sa ` +date_for_graph+`, ang inaasahang ani ay maaaring <span style="color:red">${expected} porsyento mas ${percent_filipino}</span> kaysa pangkaraniwan*`+is_irrigation_tagalog+`.</p>
          <p style="font-size:15px">*simulated using ${label} historical weather data from PAGASA (assuming no extreme events like typhoon and pest incidence)</p>
          </details>
          `)
        }
      })
    } // end of if (apiKey)
    }
    
    // ************* IF CURRENT DATE AND FUTURE DATE WITHIN 10-DAY FORECAST ************* //
    else{
    if (apiKey) {
      $.getJSON(`http:\/\/api.wunderground.com/api/${apiKey.value}/forecast10day/q/pws:${stationID}.json`, (result) => {

        //remove any existing chart first
        $('div.rainfall-chart').remove()

        const runningTotal = pastRainfall.pastAccRainfall[29-diffDays].y     // 30-day rainfall
        const runningTotalForTwenty = pastRainfallForTwenty.pastAccRainfall[19-diffDays].y     // 20-day rainfall

        const forecast = Meteor.RainfallDistribution.getForecast(result, runningTotal, runningTotalForTwenty)  // rainfall forecast and total rainfall forecast, plotBandStart and plotBandEnd
        const futureDateRainTotal = forecast.forecastAccumulated[forecastIndex].y       // 30-day rainfall
        const futureDateRainTotalWithTwenty = forecast.forecastAccumulatedWithTwenty[forecastIndex].y       // 20-day rainfall
        const completeData = Meteor.RainfallDistribution.assembleRainfallData(pastRainfall.pastRainfall, pastRainfall.pastAccRainfall, pastRainfallForTwenty.pastAccRainfall, forecast.forecastRainfall, forecast.forecastAccumulated, forecast.forecastAccumulatedWithTwenty)   // completeRainfall and completeAccumulatedRainfall

        $('<div class="rainfall-chart">').appendTo('#rainfall-chart-container').highcharts(Meteor.RainfallDistribution.constructChart(completeData.completeRainfall, completeData.completeAccumulatedRainfall, completeData.completeAccumulatedRainfallWithTwenty, forecast.plotBandStart, forecast.plotBandEnd))
        
        const percentMeanData = PercentMeanData.find({id: stationID, crop: crop, variety: variety}).fetch()

        let expected, percent_english, percent_filipino, sentence_english, sentence_filipino, raw_expected, sufficiency, sentence_corn_english, sentence_corn_filipino, threshold, num_days, total_rainfall, total_future, sentence_corn, is_irrigation_english, is_irrigation_tagalog
        for (let entry of percentMeanData){
          if(eval('entry.percentMean._'+date) != null){
            expected = eval('entry.percentMean._'+date)
            if(expected < 0){
              expected = expected * (-1)
              percent_english = 'lower'
              percent_filipino = 'mababa'
            }else{
              percent_english = 'higher'
              percent_filipino = 'mataas'
            }
          }

          if(crop=="Rice"){
            crop="rainfed rice"
            sentence_corn_english = ""
            sentence_corn_filipino = ""
            sentence_corn = "."
            threshold = 200
            num_days = '30'
            total_rainfall = runningTotal
            total_future = futureDateRainTotal
          }else if(crop=="Corn"){
            crop="corn"
            sentence_corn_english = "Where <span style='color:blue'>irrigation</span> is possible, planting corn is <span style='color:blue'>still advisable</span> because harvesting will come during dry months and price is favorable.</br>"
            sentence_corn_filipino = "Kung may <span style='color:blue'>patubig, maaari pa ring magtanim ng mais</span> dahil ang pag-aani ay papatak sa tuyong panahon at ang presyo ng mais ay maganda.</br>"
            sentence_corn = " for rainfed or upland environment <br/> BUT may be recommended for low-lying regions with irrigation."
            threshold = 100
            num_days = '20'
            total_rainfall = runningTotalForTwenty
            total_future = futureDateRainTotalWithTwenty
          }

          sentence_english = 'If you plant <span style="color:blue">'+crop+' ('+variety+')</span> today ('+date_for_graph+'), expected yield may be <span style="color:red">' +expected+'% '+percent_english+'</span> than the average*.'
          sentence_filipino = 'Kung magtatanim ngayon ('+date_for_graph+'), ang inaasahang ani ay maaaring <span style="color:red">'+expected+' porsyento mas '+percent_filipino+'</span> kaysa pangkaraniwan*.'
          raw_expected = eval('entry.percentMean._'+date)
        }
        // if future date within 10-day forecast
        if ((digit_current_date < digit_selected_date) && (digit_selected_date <= digit_last_forecast)){
          if(total_future < threshold){
            if(raw_expected > 0){
              transition_word_english = 'However, if'
              transition_word_filipino = 'Ngunit, kung'
              is_irrigation_english = ' if irrigation/water could be provided'
              is_irrigation_tagalog = ' kung may patubig'
            }else{
              transition_word_english = 'If'
              transition_word_filipino = 'Kung'
              is_irrigation_english = ''
              is_irrigation_tagalog = ''
            }
            $('#rainfall-chart-text-container').html(`
            <p style="font-size:22px; font-weight:bold">Planting of `+crop+` (`+variety+`) is NOT recommended`+sentence_corn+`</p>
            <details style="font-size:17px">
            <summary style="font-size:18px">Read More</summary><br/>
            <p style="font-size:17px">`+sentence_corn_english
            +label+` does not have sufficient soil moisture. `+transition_word_english+` you plant <span style="color:blue">`+crop+` (`+variety+`)</span> on ` +date_for_graph+`, expected yield may be <span style="color:red">${expected}% ${percent_english}</span> than the average*`+is_irrigation_english+`.</p>
            <p style="font-size:17px">`+sentence_corn_filipino+`
            Hindi pa sapat ang tubig sa lupa sa ${label}. `+transition_word_filipino+` magtatanim sa ` +date_for_graph+`, ang inaasahang ani ay maaaring <span style="color:red">${expected} porsyento mas ${percent_filipino}</span> kaysa pangkaraniwan*`+is_irrigation_tagalog+`.</p>
            <p style="font-size:15px">*simulated using ${label} historical weather data from PAGASA (assuming no extreme events like typhoon and pest incidence)</p>
            <details>
            `)
          }else{
            if(raw_expected < 0){
              transition_word_english = 'However, if'
              transition_word_filipino = 'Ngunit, kung'
              is_irrigation_english = ' if irrigation/water could be provided'
              is_irrigation_tagalog = ' kung may patubig'
              sufficiency = "is NOT"
              if(crop=="corn"){
                sentence_corn_english = "Where <span style='color:blue'>irrigation</span> is possible, planting corn is <span style='color:blue'>still advisable</span> because harvesting will come during dry months and price is favorable.</br>"
                sentence_corn_filipino = "Kung may <span style='color:blue'>patubig, maaari pa ring magtanim ng mais</span> dahil ang pag-aani ay papatak sa tuyong panahon at ang presyo ng mais ay maganda.</br>"
                sentence_corn = " for rainfed or upland environment <br/> BUT may be recommended for low-lying regions with irrigation."
              }else{
                sentence_corn_english = ""
                sentence_corn_filipino = ""
                sentence_corn="."
              }
            }else{
              transition_word_english = 'If'
              transition_word_filipino = 'Kung'
              is_irrigation_english = ''
              is_irrigation_tagalog = ''
              sufficiency = "is"
              if(crop=="corn"){
                sentence_corn_english = "In <span style='color:blue'>low lying areas</span>, corn production is <span style='color:blue'>not practical</span> because of serious water logging problem.</br>"
                sentence_corn_filipino = "Kung nasa <span style='color:blue'>mababang lugar, hindi maipapayong magtanim ng mais</span> dahil maaari itong mabulok o mamatay sa sobrang tubig.</br>"
                sentence_corn = "."
              }else{
                sentence_corn_english = ""
                sentence_corn_filipino = ""
                sentence_corn = "."
              }
            }
            $('#rainfall-chart-text-container').html(`
            <p style="font-size:22px; font-weight:bold">Planting of `+crop+` (`+variety+`) `+sufficiency+` recommended`+sentence_corn+`</p>
            <details style="font-size:17px">
            <summary style="font-size:18px">Read More</summary><br/>
            <p style="font-size:17px">`+sentence_corn_english
            +label+` has sufficient soil moisture on ` +date_for_graph+`. `+transition_word_english+` you plant <span style="color:blue">`+crop+` (`+variety+`)</span> on ` +date_for_graph+`, expected yield may be <span style="color:red">${expected}% ${percent_english}</span> than the average*`+is_irrigation_english+`.</p>
            <p style="font-size:17px">`+sentence_corn_filipino+`
            Ang ${label} ay maari nang tamnan ng sahod-ulan na palay sa ` +date_for_graph+`. `+transition_word_filipino+` magtatanim sa ` +date_for_graph+`, ang inaasahang ani ay maaaring <span style="color:red">${expected} porsyento mas ${percent_filipino}</span> kaysa pangkaraniwan*`+is_irrigation_tagalog+`.</p>
            <p style="font-size:15px">*simulated using ${label} historical weather data from PAGASA (assuming no extreme events like typhoon and pest incidence)</p>
            </details>
            `)
          }
        // else if current date
        }else{
          if(total_rainfall < threshold){
            if(raw_expected > 0){
              transition_word_english = 'However, if'
              transition_word_filipino = 'Ngunit, kung'
              is_irrigation_english = ' if irrigation/water could be provided'
              is_irrigation_tagalog = ' kung may patubig'
            }else{
              transition_word_english = 'If'
              transition_word_filipino = 'Kung'
              is_irrigation_english = ''
              is_irrigation_tagalog = ''
            }
            $('#rainfall-chart-text-container').html(`
            <p style="font-size:22px; font-weight:bold">Planting of `+crop+` (`+variety+`) is NOT recommended`+sentence_corn+`</p>
            <details style="font-size:17px">
            <summary style="font-size:18px">Read More</summary><br/>
            <p style="font-size:17px">`+sentence_corn_english
            +label+` does not have sufficient soil moisture with <span style="color:red">${total_rainfall} mm</span> total rainfall for the past `+num_days+` days. `+transition_word_english+` you plant <span style="color:blue">`+crop+` (`+variety+`)</span> today (` +date_for_graph+`), expected yield may be <span style="color:red">${expected}% ${percent_english}</span> than the average*`+is_irrigation_english+`.</p>
            <p style="font-size:17px">`+sentence_corn_filipino+`
            Hindi pa sapat ang tubig sa lupa sa ${label} na may <span style="color:red">${total_rainfall} mm</span> kabuuang pag-ulan sa nakalipas na `+num_days+` araw. `+transition_word_filipino+` magtatanim ngayon (` +date_for_graph+`), ang inaasahang ani ay maaaring <span style="color:red">${expected} porsyento mas ${percent_filipino}</span> kaysa pangkaraniwan*`+is_irrigation_tagalog+`.</p>
            <p style="font-size:15px">*simulated using ${label} historical weather data from PAGASA (assuming no extreme events like typhoon and pest incidence)</p>
            </details>
            `)
          }else{
            if(raw_expected < 0){
              transition_word_english = 'However, if'
              transition_word_filipino = 'Ngunit, kung'
              is_irrigation_english = ' if irrigation/water could be provided'
              is_irrigation_tagalog = ' kung may patubig'
              sufficiency = "is NOT"
              if(crop=="corn"){
                sentence_corn_english = "Where <span style='color:blue'>irrigation</span> is possible, planting corn is <span style='color:blue'>still advisable</span> because harvesting will come during dry months and price is favorable.</br>"
                sentence_corn_filipino = "Kung may <span style='color:blue'>patubig, maaari pa ring magtanim ng mais</span> dahil ang pag-aani ay papatak sa tuyong panahon at ang presyo ng mais ay maganda.</br>"
                sentence_corn = " for rainfed or upland environment <br/> BUT may be recommended for low-lying regions with irrigation."
              }else{
                sentence_corn_english = ""
                sentence_corn_filipino = ""
                sentence_corn = "."
              }
            }else{
              transition_word_english = 'If'
              transition_word_filipino = 'Kung'
              is_irrigation_english = ''
              is_irrigation_tagalog = '' 
              sufficiency = "is"
              if(crop=="corn"){
                sentence_corn_english = "In <span style='color:blue'>low lying areas</span>, corn production is <span style='color:blue'>not practical</span> because of serious water logging problem.</br>"
                sentence_corn_filipino = "Kung nasa <span style='color:blue'>mababang lugar, hindi maipapayong magtanim ng mais</span> dahil maaari itong mabulok o mamatay sa sobrang tubig.</br>"
                sentence_corn = "."
              }else{
                sentence_corn_english = ""
                sentence_corn_filipino = ""
                sentence_corn = "."
              }
            }
            $('#rainfall-chart-text-container').html(`
            <p style="font-size:22px; font-weight:bold">Planting of `+crop+` (`+variety+`) `+sufficiency+` recommended`+sentence_corn+`</p>
            <details style="font-size:17px">
            <summary style="font-size:18px">Read More</summary><br/>
            <p style="font-size:17px">`+sentence_corn_english
            +label+` has sufficient soil moisture with <span style="color:red">${total_rainfall} mm</span> total rainfall for the past `+num_days+` days. `+transition_word_english+` you plant <span style="color:blue">`+crop+` (`+variety+`)</span> today (` +date_for_graph+`), expected yield may be <span style="color:red">${expected}% ${percent_english}</span> than the average*`+is_irrigation_english+`.</p>
            <p style="font-size:17px">`+sentence_corn_filipino+`
            Sapat na ang tubig sa lupa sa ${label} na may <span style="color:red">${total_rainfall} mm</span> kabuuang pag-ulan sa nakalipas na `+num_days+` araw. `+transition_word_filipino+` magtatanim ngayon (`+date_for_graph+`), ang inaasahang ani ay maaaring <span style="color:red">${expected} porsyento mas ${percent_filipino}</span> kaysa pangkaraniwan*`+is_irrigation_tagalog+`.</p>
            <p style="font-size:15px">*simulated using ${label} historical weather data from PAGASA (assuming no extreme events like typhoon and pest incidence)</p>
            </details>
             `)
          }
        }
      })
    } // end of if (apiKey)
    } // end of else
  }
}