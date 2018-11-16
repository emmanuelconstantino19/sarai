Template.HeatMapRainfallOutlook.onCreated(() => {
  Meteor.subscribe('provinces')
  Meteor.subscribe('weather-outlook')

  //default is Region IV-A: CALABARZON, Laguna
  Session.set('province', 'Laguna')
  Session.set('municipality', 'Los Baños')
  Session.set('color_low','#d9e0dc')
  Session.set('color_mid','#74dcfd')
  Session.set('color_high','#0957eb')
  Session.set('color_max','#1e3bb4')
})

Template.HeatMapRainfallOutlook.onRendered(() => {

  const province = Session.get('province')
  $('#preview-select-province-rainfall').val(province)

  const municipality = Session.get('municipality')
  $('#preview-select-municipality-rainfall').val(municipality)

  var tooltip = d3.select("body").append("div").attr("id", "tooltip");
  d3.xml("rainfall-outlook/PH-province.svg",
    function(error,documentFragment){
      if(error) {console.log(error); return;}
      var svgNode = documentFragment.getElementsByTagName("svg")[0];
      $('#heatmap').append(svgNode);
      $('#heatmap').find("svg").css('width','300px').attr('id', 'svgMainMap');
      d3.select("#sidebar").append("svg").attr("id","svgSideBar")
      $('#svgSideBar').css('width','100%')
      $('#svgHeader').css('width','900px')
      
      var six_months = getSixConsecMonths();

      Meteor.subscribe('weather-outlook', ()=>{
          const provinces_new = WeatherOutlook.find({municipality: "All", province: {$ne:'All'}},{fields: {province: 1, data: 1, _id: 0}}).fetch()
          provinces_new.forEach(function(d){
            d.municipalities = WeatherOutlook.find({province: d.province, municipality: {$ne:'All'}},{fields: {province: 1, municipality: 1, data: 1, _id: 0}}).fetch();
          })
          heatmap_init(provinces_new)
      })

      function heatmap_init(provinces){

        var color = d3.scaleLinear().domain([0,100,250,500]).range([color_low_global,color_mid_global,color_high_global,color_max_global]).interpolate(d3.interpolateHcl);
        var svg_map = d3.select("#svgPHfullmap");

        $('#heatmap').find("svg").clone().prependTo('#heatmap2').css('width','300px').attr('id', 'svgMainMap2');
      	$('#svgMainMap2').find('#svgPHfullmap').attr('id','svgPHfullmap2')
        var svg_map2 = d3.select("#svgPHfullmap2");

        $('#heatmap').find("svg").clone().prependTo('#heatmap3').css('width','300px').attr('id', 'svgMainMap3');
      	$('#svgMainMap3').find('#svgPHfullmap').attr('id','svgPHfullmap3')
        var svg_map3 = d3.select("#svgPHfullmap3");

        $('#heatmap').find("svg").clone().prependTo('#heatmap4').css('width','300px').attr('id', 'svgMainMap4');
      	$('#svgMainMap4').find('#svgPHfullmap').attr('id','svgPHfullmap4')
        var svg_map4 = d3.select("#svgPHfullmap4");

        $('#heatmap').find("svg").clone().prependTo('#heatmap5').css('width','300px').attr('id', 'svgMainMap5');
      	$('#svgMainMap5').find('#svgPHfullmap').attr('id','svgPHfullmap5')
        var svg_map5 = d3.select("#svgPHfullmap5");

        $('#heatmap').find("svg").clone().prependTo('#heatmap6').css('width','300px').attr('id', 'svgMainMap6');
      	$('#svgMainMap6').find('#svgPHfullmap').attr('id','svgPHfullmap6')
        var svg_map6 = d3.select("#svgPHfullmap6");

        d3.select("#svgMainMap").append("text").attr("id","svg_mainlbl")
        .style("font-size","70px")
        .style("font-weight","bold")
        .style("text-anchor","start")
        .attr("transform","translate(15,80)")
        ;

        d3.select("#svgMainMap2").append("text").attr("id","svg_mainlbl2")
        .style("font-size","70px")
        .style("font-weight","bold")
        .style("text-anchor","start")
        .attr("transform","translate(15,80)")
        ;

        d3.select("#svgMainMap3").append("text").attr("id","svg_mainlbl3")
        .style("font-size","70px")
        .style("font-weight","bold")
        .style("text-anchor","start")
        .attr("transform","translate(15,80)")
        ;

        d3.select("#svgMainMap4").append("text").attr("id","svg_mainlbl4")
        .style("font-size","70px")
        .style("font-weight","bold")
        .style("text-anchor","start")
        .attr("transform","translate(15,80)")
        ;

        d3.select("#svgMainMap5").append("text").attr("id","svg_mainlbl5")
        .style("font-size","70px")
        .style("font-weight","bold")
        .style("text-anchor","start")
        .attr("transform","translate(15,80)")
        ;

        d3.select("#svgMainMap6").append("text").attr("id","svg_mainlbl6")
        .style("font-size","70px")
        .style("font-weight","bold")
        .style("text-anchor","start")
        .attr("transform","translate(15,80)")
        ;

        function changeMonth(month, svgMap_curr, label){                        
          var year = (month=="Nov" || month=="Dec") ? "2018" : "2019";
          d3.select(label).text(month+" "+year);                        
          svgMap_curr.selectAll("path.land")
          .data(provinces, function(d){                 
              return (d && d.province) || d3.select(this).attr("title");})
          .on('click',function(d){
              renderHeatMap(d.municipalities,false, d.province);
              $('#select-rainfall-tabular').val(d.province);
          })
          .on("mouseover", function(d) {    
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                  return  "<h4>"+d.province+"</h4>"+
                          "Rainfall: "+(d.data.month[month])+" mm";})  
                  .style("left", (d3.event.pageX) + "px")   
                  .style("top", (d3.event.pageY - 28) + "px");  
              })          
          .on("mouseout", function(d) {   
              tooltip.transition()    
                  .duration(500)    
                  .style("opacity", 0); 
          })
          .transition().duration(1000)
          .style("fill", function(d){
          	  var color_category;           
          	  if(d.data.month[month] <= 100){
          	  	color_category = 0;
          	  }else if(d.data.month[month] > 100 && d.data.month[month] <= 250){
          	  	color_category = 100;
          	  }else if(d.data.month[month] > 250 && d.data.month[month] <= 500){
          	  	color_category = 250;
          	  }else if(d.data.month[month] > 500){
          	  	color_category = 500;
          	  }               
              return color(color_category);}
          );                    
        }

        $('#select-rainfall-tabular').on('change', function() {
            for(var i = 0 ; i < provinces.length; i++){
              if($('#select-rainfall-tabular').val() == provinces[i].province){
                renderHeatMap(provinces[i].municipalities,false, provinces[i].province) 
              }
            }
          });              

        $("#theme").on('change', function() {
            if($('#theme').val()=='1'){
              color_low_global = '#d9e0dc'; color_mid_global = '#74dcfd'; color_high_global = '#0957eb'; color_max_global = '#1e3bb4';  
            }else if($('#theme').val()=='2'){
              color_low_global = 'red'; color_mid_global = 'yellow'; color_high_global = 'green'; color_max_global = 'blue';
            }
            color = d3.scaleLinear().domain([0,100,250,500]).range([color_low_global,color_mid_global,color_high_global,color_max_global]).interpolate(d3.interpolateHcl)
            loadMaps();
            renderHeatMap(provinces,true, '');
            $('#low').css('fill',color_low_global);
            $('#mid').css('fill',color_mid_global);
            $('#high').css('fill',color_high_global);
            $('#max').css('fill',color_max_global);
        });

        function loadMaps(){
          changeMonth(six_months[0], svg_map, "#svg_mainlbl");
          changeMonth(six_months[1], svg_map2, "#svg_mainlbl2");
          changeMonth(six_months[2], svg_map3, "#svg_mainlbl3");
          changeMonth(six_months[3], svg_map4, "#svg_mainlbl4");
          changeMonth(six_months[4], svg_map5, "#svg_mainlbl5");
          changeMonth(six_months[5], svg_map6, "#svg_mainlbl6");
        }
        loadMaps();

        $('#btn_animatedata').click(function(){
              if($('#btn_animatedata').html()==="Animate"){
                  window.timer = d3.interval(function(elapsed){
                      var index = $('#slt_mnth').prop('selectedIndex');
                      index++;
                      if(index===6){
                          index=0;
                      }                               
                      $('#slt_mnth option').eq(index).prop('selected', true);
                      $('#slt_mnth').change();
                  },1500);
                  $('#btn_animatedata').html("Stop");
              } else{
                  timer.stop();
                  $('#btn_animatedata').html("Animate");                         
              }
          });
          

          var heatMap = d3.select("#svgSideBar").append("g").attr("id","chrt_htmap").                            
              attr("transform","translate(150,0)");

          var header = d3.select("#svgHeader").append("g").attr("id","chrt_header")
          		.attr("transform","translate(150,50)");

          var gridSize = 40;

          header.append("text").attr("id","ht_main")
                  .style("font-size","12pt")
                  .style("font-weight","bold")
                  .attr("y",-30)
                  .attr("x",0);
          header.selectAll("text.mnth")
                      .data(six_months)
                      .enter()
                      .append("text")
                      .attr("class","mnth")
                      .attr("x",function(d,i){return (i*gridSize*3)+45})
                      .attr("y",-5)
                      .text(function(d){return d;});

          function renderHeatMap(data,isProvince, province){
              $('#svgSideBar').css('height',((data.length*40)+100)+'px')
              $("#tabular_title").text(isProvince===true?"Provincial Average Rainfall Data":"Municipal Rainfall Data: " + province)                        
              heatMap.selectAll("g.hmap").remove();
              
              var row = heatMap.selectAll("g.hmap")
                      .data(data)
                      .enter()
                      .append("g")
                      .attr("class","hmap")
                      .attr("transform",function(d,i){
                          return "translate(0,"+i*gridSize+")"
              }).on('click',function(d){
              	  if(isProvince){
                    $('#select-rainfall-tabular').val(d.province);
              	  	renderHeatMap(d.municipalities,false, d.province);
              	  }
              });                        
                                      
              row.append("text")
                 .attr("x",-5)
                 .attr("y",gridSize-10)
                 .style("text-anchor","end")
                 .text(function(d){return isProvince===true?d.province:d.municipality})
                 .on("mouseover", function(d) {   
                     svg_map.selectAll("path.land[title='"+d.province+"']")
                          .transition().duration(500).style("opacity",".5");
                 })         
                 .on("mouseout", function(d) {    
                     svg_map.selectAll("path.land[title='"+d.province+"']")
                          .transition().duration(500).style("opacity","1");
                 })

              ;  
            row.append("rect")
             .attr("width", gridSize * 3)
             .attr("height", gridSize)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                return  "Rainfall: "+(d.data.month[six_months[0]])+" mm";

              }) 
                  .style("left", (d3.event.pageX) + "px")   
                  .style("top", (d3.event.pageY - 28) + "px");  
              })          
              .on("mouseout", function(d) {   
                  tooltip.transition()    
                      .duration(500)    
                      .style("opacity", 0); 
              })
             .transition().duration(1000)
             .style("fill",function(d){

              var color_category;           
          	  if(d.data.month[six_months[0]] <= 100){
          	  	color_category = 0;
          	  }else if(d.data.month[six_months[0]] > 100 && d.data.month[six_months[0]] <= 250){
          	  	color_category = 100;
          	  }else if(d.data.month[six_months[0]] > 250 && d.data.month[six_months[0]] <= 500){
          	  	color_category = 250;
          	  }else if(d.data.month[six_months[0]] > 500){
          	  	color_category = 500;
          	  }               
              return color(color_category);
             })
            .style("stroke","white")
            .style("stroke-width","1px");

             row.append("text")
                 .attr("x",35)
                 .attr("y",25)
                 .text(function(d){return d.data.month[six_months[0]];})
                 .style('fill',function(d){
                    if(d.data.month[six_months[0]] > 250){
                      return 'white';
                    }   
                    return 'black';
                 });

             row.append("rect")
             .attr("width", gridSize * 3)
             .attr("height", gridSize)
             .attr("x",gridSize * 3)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                return  "Rainfall: "+(d.data.month[six_months[1]])+" mm";

              }) 
                  .style("left", (d3.event.pageX) + "px")   
                  .style("top", (d3.event.pageY - 28) + "px");  
              })          
              .on("mouseout", function(d) {   
                  tooltip.transition()    
                      .duration(500)    
                      .style("opacity", 0); 
              })
             .transition().duration(1000)
             .style("fill",function(d){
              var color_category;           
          	  if(d.data.month[six_months[1]] <= 100){
          	  	color_category = 0;
          	  }else if(d.data.month[six_months[1]] > 100 && d.data.month[six_months[1]] <= 250){
          	  	color_category = 100;
          	  }else if(d.data.month[six_months[1]] > 250 && d.data.month[six_months[1]] <= 500){
          	  	color_category = 250;
          	  }else if(d.data.month[six_months[1]] > 500){
          	  	color_category = 500;
          	  }               
              return color(color_category);
             })
            .style("stroke","white")
            .style("stroke-width","1px");

             row.append("text")
                 .attr("x",(gridSize * 3) + 35)
                 .attr("y",25)
                 .text(function(d){return d.data.month[six_months[1]];})
                 .style('fill',function(d){
                    if(d.data.month[six_months[1]] > 250){
                      return 'white';
                    }   
                    return 'black';
                 });

             row.append("rect")
             .attr("width", gridSize * 3)
             .attr("height", gridSize)
             .attr("x",gridSize*6)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                return  "Rainfall: "+(d.data.month[six_months[2]])+" mm";

              }) 
                  .style("left", (d3.event.pageX) + "px")   
                  .style("top", (d3.event.pageY - 28) + "px");  
              })          
              .on("mouseout", function(d) {   
                  tooltip.transition()    
                      .duration(500)    
                      .style("opacity", 0); 
              })
             .transition().duration(1000)
             .style("fill",function(d){

              var color_category;           
          	  if(d.data.month[six_months[2]] <= 100){
          	  	color_category = 0;
          	  }else if(d.data.month[six_months[2]] > 100 && d.data.month[six_months[2]] <= 250){
          	  	color_category = 100;
          	  }else if(d.data.month[six_months[2]] > 250 && d.data.month[six_months[2]] <= 500){
          	  	color_category = 250;
          	  }else if(d.data.month[six_months[2]] > 500){
          	  	color_category = 500;
          	  }               
              return color(color_category);
             })
            .style("stroke","white")
            .style("stroke-width","1px");

             row.append("text")
                 .attr("x",(gridSize * 6) + 35)
                 .attr("y",25)
                 .text(function(d){return d.data.month[six_months[2]];})
                 .style('fill',function(d){
                    if(d.data.month[six_months[2]] > 250){
                      return 'white';
                    }   
                    return 'black';
                 });

             row.append("rect")
             .attr("width", gridSize * 3)
             .attr("height", gridSize)
             .attr("x",gridSize * 9)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                return  "Rainfall: "+(d.data.month[six_months[3]])+" mm";

              }) 
                  .style("left", (d3.event.pageX) + "px")   
                  .style("top", (d3.event.pageY - 28) + "px");  
              })          
              .on("mouseout", function(d) {   
                  tooltip.transition()    
                      .duration(500)    
                      .style("opacity", 0); 
              })
             .transition().duration(1000)
             .style("fill",function(d){

              var color_category;           
          	  if(d.data.month[six_months[3]] <= 100){
          	  	color_category = 0;
          	  }else if(d.data.month[six_months[3]] > 100 && d.data.month[six_months[3]] <= 250){
          	  	color_category = 100;
          	  }else if(d.data.month[six_months[3]] > 250 && d.data.month[six_months[3]] <= 500){
          	  	color_category = 250;
          	  }else if(d.data.month[six_months[3]] > 500){
          	  	color_category = 500;
          	  }               
              return color(color_category);
             })
            .style("stroke","white")
            .style("stroke-width","1px");

             row.append("text")
                 .attr("x",(gridSize * 9) + 35)
                 .attr("y",25)
                 .text(function(d){return d.data.month[six_months[3]];})
                 .style('fill',function(d){
                    if(d.data.month[six_months[3]] > 250){
                      return 'white';
                    }   
                    return 'black';
                 });

             row.append("rect")
             .attr("width", gridSize * 3)
             .attr("height", gridSize)
             .attr("x",gridSize * 12)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                return  "Rainfall: "+(d.data.month[six_months[4]])+" mm";

              }) 
                  .style("left", (d3.event.pageX) + "px")   
                  .style("top", (d3.event.pageY - 28) + "px");  
              })          
              .on("mouseout", function(d) {   
                  tooltip.transition()    
                      .duration(500)    
                      .style("opacity", 0); 
              })
             .transition().duration(1000)
             .style("fill",function(d){

             	var color_category;           
          	  if(d.data.month[six_months[4]] <= 100){
          	  	color_category = 0;
          	  }else if(d.data.month[six_months[4]] > 100 && d.data.month[six_months[4]] <= 250){
          	  	color_category = 100;
          	  }else if(d.data.month[six_months[4]] > 250 && d.data.month[six_months[4]] <= 500){
          	  	color_category = 250;
          	  }else if(d.data.month[six_months[4]] > 500){
          	  	color_category = 500;
          	  }               
              return color(color_category);
             })
            .style("stroke","white")
            .style("stroke-width","1px");

             row.append("text")
                 .attr("x",(gridSize * 12) + 35)
                 .attr("y",25)
                 .text(function(d){return d.data.month[six_months[4]];})
                 .style('fill',function(d){
                    if(d.data.month[six_months[4]] > 250){
                      return 'white';
                    }   
                    return 'black';
                 });

             row.append("rect")
             .attr("width", gridSize * 3)
             .attr("height", gridSize)
             .attr("x",gridSize * 15)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                return  "Rainfall: "+(d.data.month[six_months[5]])+" mm";

              }) 
                  .style("left", (d3.event.pageX) + "px")   
                  .style("top", (d3.event.pageY - 28) + "px");  
              })          
              .on("mouseout", function(d) {   
                  tooltip.transition()    
                      .duration(500)    
                      .style("opacity", 0); 
              })
             .transition().duration(1000)
             .style("fill",function(d){
              var color_category;           
          	  if(d.data.month[six_months[5]] <= 100){
          	  	color_category = 0;
          	  }else if(d.data.month[six_months[5]] > 100 && d.data.month[six_months[5]] <= 250){
          	  	color_category = 100;
          	  }else if(d.data.month[six_months[5]] > 250 && d.data.month[six_months[5]] <= 500){
          	  	color_category = 250;
          	  }else if(d.data.month[six_months[5]] > 500){
          	  	color_category = 500;
          	  }               
              return color(color_category);

             })
            .style("stroke","white")
            .style("stroke-width","1px");

             row.append("text")
                 .attr("x",(gridSize * 15) + 35)
                 .attr("y",25)
                 .text(function(d){return d.data.month[six_months[5]];})
                 .style('fill',function(d){
                    if(d.data.month[six_months[5]] > 250){
                      return 'white';
                    }   
                    return 'black';
                 });  
              
            
              row.exit().remove();
          }

          $('#btn_ldrgdata').click(function(){renderHeatMap(provinces,true, '');});                    
          renderHeatMap(provinces,true, '');

          var width = 500;
          var height = 350;

          var margin = {
              top: 30,
              left: 30,
              right: 30,
              bottom: 30
          };

          var barGraph = d3.select("#barGraph")
          .append("svg")
          .attr('width', width)
          .attr('height', height)
          .append("g")
          .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

          width = width - margin.left - margin.right;
          height = height - margin.top - margin.bottom;

          var yscale = d3.scaleLinear()
              .range([height, 0])
              .domain([0, 800]);

          var xscale = d3.scaleBand()
              .range([0, width])
              .padding(0.1);

          var duration = 1000;

          var xaxis = d3.axisBottom(xscale);

          var yaxis = d3.axisLeft(yscale);

          barGraph.append('g')
              .attr('transform', 'translate(0, ' + (height) + ')')
              .attr('class', 'x axis');

          barGraph.append('g')
              .attr('class', 'y axis');

          $("#preview-select-province-rainfall").on('change', function() {
              setDataBarGraph($(this).val(),'All',true);
          });

          $("#preview-select-municipality-rainfall").on('change', function() {
              setDataBarGraph($("#preview-select-province-rainfall").val(),$(this).val(),false);
          });

          function setDataBarGraph(province,municipality,isProvince){
            var weatherOutlook = WeatherOutlook.findOne({province: province, municipality: municipality})
            var six_months = getSixConsecMonths();
            var values = [];
            var val;
            if(weatherOutlook){
              for(var i = 0 ; i < 6; i++){
                  val = (weatherOutlook.data.month[six_months[i]]==null) ? "--" : Math.round(weatherOutlook.data.month[six_months[i]])
                  values.push(val);
              }
              if(isProvince){
                renderBarGraph(values,province,true);
              }
              else{
                renderBarGraph(values,municipality,false);
              }
            }
          }

          setDataBarGraph('Laguna','Los Baños',true);

          function renderBarGraph(values, place, isProvince){
            $("#bg_label").text(isProvince===true?"Provincial Average Rainfall Data: "+place: "Municipal Rainfall Data: "+place);

            //update all rects
            xscale.domain(six_months);

            yscale.domain([0, 800]);

            var bars = barGraph.selectAll(".bar")
            .data(values);

            bars
              .enter()
              .append('rect')
              .attr('class', 'bar')
              .attr("fill", "#1e3bb4")
              .attr('width', xscale.bandwidth())
              .attr('height', 0)
              .attr('y', height)
              .merge(bars)
              .transition()
              .duration(duration)
              .attr("height", function(d, i) {
                  return height - yscale(d);
              })
              .attr("y", function(d, i) {
                  return yscale(d);
              })
              .attr("width", xscale.bandwidth())
              .attr("x", function(d, i) {
                  return xscale(six_months[i]);
              })

              bars
                .exit()
                .transition()
                .duration(duration)
                .attr('height', 0)
                .attr('y', height)
                .remove();


               var labels = barGraph.selectAll('.label')
                    .data(values);

                var new_labels = labels
                    .enter()
                    .append('text')
                    .attr('class', 'label')
                    .attr('opacity', 0)
                    .attr('y', height)
                    .attr('fill', 'white')
                    .attr('text-anchor', 'middle')

                new_labels.merge(labels)
                    .transition()
                    .duration(duration)
                    .attr('opacity', 1)
                    .attr('x', function(d, i) {
                        return xscale(six_months[i]) + xscale.bandwidth() / 2;
                    })
                    .attr('y', function(d) {
                        return yscale(d) + 20;
                    })
                    .text(function(d) {
                        return d;
                    });

                labels
                    .exit()
                    .transition()
                    .duration(duration)
                    .attr('y', height)
                    .attr('opacity', 0)
                    .remove();

                barGraph.select('.x.axis')
                    .transition()
                    .duration(duration)
                    .call(xaxis)
                    .selectAll("text")
                    .attr("x",10);

                barGraph.select('.y.axis')
                    .transition()
                    .duration(duration)
                    .call(yaxis);
              
          }

      }/** Function end of Heatmap Init **/
  });/** Function end of d3.xml **/
})/** function end of onrendered **/

Template.HeatMapRainfallOutlook.events({
  'change #preview-select-province-rainfall': (e) => {
    const province = e.currentTarget.value
    Session.set('province', province)

    // sets municipality to first municipality in the chosen province 
    Session.set('municipality',Provinces.findOne({province:province}).municipality[0])
  },

  'change #preview-select-municipality-rainfall': (e) => {
    const municipality = e.currentTarget.value
    Session.set('municipality', municipality)
  },

  'change #theme': (e) => {
    Session.set('color_low',color_low_global);
    Session.set('color_mid',color_mid_global);
    Session.set('color_high',color_high_global);
    Session.set('color_max',color_max_global);
  }
})


Template.HeatMapRainfallOutlook.helpers({
  months: () => {
      return getSixConsecMonths();
  },
  monthlyRainfall: () => {
    const province = Session.get('province')
      const municipality = Session.get('municipality')
      const color_1 = Session.get('color_low')
      const color_2 = Session.get('color_mid')
      const color_3 = Session.get('color_high')
      const color_4 = Session.get('color_max')
      const weatherOutlook = WeatherOutlook.findOne({province: province, municipality: municipality})
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
      var d = new Date()
      var current_month = 7; 
      var val;
      var six_months = getSixConsecMonths();
      var color;

      if (weatherOutlook){
        let outlook = []

        for(var i = 0 ; i < 6; i++){
          val = (weatherOutlook.data.month[six_months[i]]==null) ? "--" : Math.round(weatherOutlook.data.month[six_months[i]])
          if(val <= 100){
            color = color_1;
          }else if(val > 100 && val <= 250){
            color = color_2;
          }else if(val > 250 && val <= 500){
            color = color_3;
          }else if(val > 500){
            color = color_4;
          }
          outlook.push({
            head: six_months[i],
            value: val,
            color: color
          })
        }
        return outlook
      }
  },

  provinces: () => {
    const provinces = Provinces.find({province: {$ne:'All'}}, {sort: {id: 1}}).fetch()

    return provinces
  },

  currentlySelectedProvince: (curr) => {
    const province = Session.get('province')
    $('#preview-select-province-rainfall').val(province)
  },

  municipalities: () => {
    const province = Session.get('province')
    const municipalities = Provinces.findOne({province:province})

    return municipalities && municipalities.municipality
  },

  currentlySelectedMunicipality: (curr) => {
    const municipality = Session.get('municipality')
    $('#preview-select-municipality-rainfall').val(municipality)
  },
})

var color_low_global = '#d9e0dc';
var color_mid_global = '#74dcfd';
var color_high_global = '#0957eb';
var color_max_global = '#1e3bb4';

function getSixConsecMonths(){
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    var d = new Date()
    var current_month = 10;
    var six_months = [];
    for(var i = 0 ; i < 6 ; i++){
      six_months[i] = months[(i + current_month)%months.length];
    }
    return six_months;
}