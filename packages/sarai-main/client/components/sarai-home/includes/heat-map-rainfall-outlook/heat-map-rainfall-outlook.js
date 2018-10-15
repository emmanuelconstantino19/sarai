Template.HeatMapRainfallOutlook.onCreated(() => {
  Meteor.subscribe('regions')
  Meteor.subscribe('provinces')
  Meteor.subscribe('weather-outlook')

  //default is Region IV-A: CALABARZON, Laguna
  Session.set('region', 'Region IV-A: CALABARZON')
  Session.set('province', 'Laguna')
})

Template.HeatMapRainfallOutlook.onRendered(() => {

  var tooltip = d3.select("body").append("div").attr("id", "tooltip");
  d3.xml("rainfall-outlook/PH-province.svg",
    function(error,documentFragment){
      if(error) {console.log(error); return;}
      var svgNode = documentFragment.getElementsByTagName("svg")[0];
      $('#heatmap').append(svgNode);
      $('#heatmap').find("svg").css('width','400px').attr('id', 'svgMainMap');
      d3.select("#sidebar").append("svg").attr("id","svgSideBar")
      $('#svgSideBar').css('width','100%')
      $('#svgHeader').css('width','900px')

      var color_low = "red";
      var color_mid = "yellow"
      var color_high = "green";
      var color_max = "#256d7b";
      var y_start;
      var x_start;
      var k_last = 1;
      var six_months = getSixConsecMonths();
      console.log(six_months);

      Meteor.subscribe('weather-outlook', ()=>{
          const provinces_new = WeatherOutlook.find({municipality: "All", province: {$ne:'All'}},{fields: {province: 1, data: 1, _id: 0}}).fetch()
          provinces_new.forEach(function(d){
            d.municipalities = WeatherOutlook.find({province: d.province, municipality: {$ne:'All'}},{fields: {province: 1, municipality: 1, data: 1, _id: 0}}).fetch();
          })
          heatmap_init(provinces_new)
      })

      function heatmap_init(provinces){
        console.log("heatmap init---");

        var color = d3.scaleLinear().domain([0,100,250,500]).range([color_low,color_mid,color_high,color_max]).interpolate(d3.interpolateHcl);
        var svg_map = d3.select("#svgPHfullmap");

        $('#heatmap').find("svg").clone().prependTo('#heatmap2').css('width','400px').attr('id', 'svgMainMap2');
      	$('#svgMainMap2').find('#svgPHfullmap').attr('id','svgPHfullmap2')
        var svg_map2 = d3.select("#svgPHfullmap2");

        $('#heatmap').find("svg").clone().prependTo('#heatmap3').css('width','400px').attr('id', 'svgMainMap3');
      	$('#svgMainMap3').find('#svgPHfullmap').attr('id','svgPHfullmap3')
        var svg_map3 = d3.select("#svgPHfullmap3");

        $('#heatmap').find("svg").clone().prependTo('#heatmap4').css('width','400px').attr('id', 'svgMainMap4');
      	$('#svgMainMap4').find('#svgPHfullmap').attr('id','svgPHfullmap4')
        var svg_map4 = d3.select("#svgPHfullmap4");

        $('#heatmap').find("svg").clone().prependTo('#heatmap5').css('width','400px').attr('id', 'svgMainMap5');
      	$('#svgMainMap5').find('#svgPHfullmap').attr('id','svgPHfullmap5')
        var svg_map5 = d3.select("#svgPHfullmap5");

        $('#heatmap').find("svg").clone().prependTo('#heatmap6').css('width','400px').attr('id', 'svgMainMap6');
      	$('#svgMainMap6').find('#svgPHfullmap').attr('id','svgPHfullmap6')
        var svg_map6 = d3.select("#svgPHfullmap6");

        d3.select("#svgMainMap").append("text").attr("id","svg_mainlbl")
        .style("font-size","50")
        .style("font-weight","bold")
        .style("text-anchor","start")
        .attr("transform","translate(0,50)")
        ;

        d3.select("#svgMainMap2").append("text").attr("id","svg_mainlbl2")
        .style("font-size","50")
        .style("font-weight","bold")
        .style("text-anchor","start")
        .attr("transform","translate(0,50)")
        ;

        d3.select("#svgMainMap3").append("text").attr("id","svg_mainlbl3")
        .style("font-size","50")
        .style("font-weight","bold")
        .style("text-anchor","start")
        .attr("transform","translate(0,50)")
        ;

        d3.select("#svgMainMap4").append("text").attr("id","svg_mainlbl4")
        .style("font-size","50")
        .style("font-weight","bold")
        .style("text-anchor","start")
        .attr("transform","translate(0,50)")
        ;

        d3.select("#svgMainMap5").append("text").attr("id","svg_mainlbl5")
        .style("font-size","50")
        .style("font-weight","bold")
        .style("text-anchor","start")
        .attr("transform","translate(0,50)")
        ;

        d3.select("#svgMainMap6").append("text").attr("id","svg_mainlbl6")
        .style("font-size","50")
        .style("font-weight","bold")
        .style("text-anchor","start")
        .attr("transform","translate(0,50)")
        ;

        function changeMonth(month, svgMap_curr, label){                        
          var year = (month=="Jan") ? "2019" : "2018";
          d3.select(label).text(month+" "+year);                        
          svgMap_curr.selectAll("path.land")
          .data(provinces, function(d){ 
              console.log((d && d.province) || d3.select(this).attr("title"));                
              return (d && d.province) || d3.select(this).attr("title");})
          .on('click',function(d){
              console.log('render heat map');
              renderHeatMap(d.municipalities,false);
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


        $('#slt_mnth').change(function(){
            changeMonth($('#slt_mnth').val());                  
        });                
        changeMonth(six_months[0], svg_map, "#svg_mainlbl");
        changeMonth(six_months[1], svg_map2, "#svg_mainlbl2");
        changeMonth(six_months[2], svg_map3, "#svg_mainlbl3");
        changeMonth(six_months[3], svg_map4, "#svg_mainlbl4");
        changeMonth(six_months[4], svg_map5, "#svg_mainlbl5");
        changeMonth(six_months[5], svg_map6, "#svg_mainlbl6");

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


        var gradient = d3.select("#svgMainMap").append("defs")
            .append("linearGradient")
              .attr("id", "gradient")
              .attr("x1", "0%")
              .attr("y1", "0%")
              .attr("x2", "100%")
              .attr("y2", "0%");
          gradient.append("stop")
              .attr("class", "left") //useful later when we want to update the offset
    		  .attr("offset", "0%")
    		  .attr("stop-color", color_low);
          gradient.append("stop")
              .attr("class", "left") //useful later when we want to update the offset
    		  .attr("offset", "14%")
    		  .attr("stop-color", color_mid);
          gradient.append("stop")
              .attr("class", "left") //useful later when we want to update the offset
    		  .attr("offset", "28%")
    		  .attr("stop-color", color_high);     
          gradient.append("stop")
              .attr("class", "left") //useful later when we want to update the offset
    		  .attr("offset", "50%")
    		  .attr("stop-color", color_max);


        var gradient2 = d3.select("#svgMainMap").append("defs")
            .append("linearGradient")
              .attr("id", "gradient2")
              .attr("x1", "0%")
              .attr("y1", "100%")
              .attr("x2", "0%")
              .attr("y2", "0%")
              .attr("spreadMethod", "pad");                                   
          gradient2.append("stop")
              .attr("offset", "0%")
              .attr("stop-color",color_low)
              .attr("stop-opacity", 1);                  
          gradient2.append("stop")
              .attr("offset", "14%")
              .attr("stop-color",color_mid);                  
          gradient2.append("stop")
              .attr("offset", "28%")
              .attr("stop-color",color_high);                    
          gradient2.append("stop")        
              .attr("offset", "100%")
              .attr("stop-color",color_max);


          var legend = d3.select("#legend_red").append("g")                      
              .attr("transform","translate("+50+","+0+")");                
          legend.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .style("fill","red")
            .style("stroke","#FFFFFF")
            .style("stroke-width","1px");
          legend.append("text")
                  .attr("x",25)
                  .attr("y",15)
                  .text("< 100 mm");

          legend = d3.select("#legend_yellow").append("g")                      
              .attr("transform","translate("+50+","+0+")");                
          legend.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .style("fill","yellow")
            .style("stroke","#FFFFFF")
            .style("stroke-width","1px");
          legend.append("text")
                  .attr("x",25)
                  .attr("y",15)
                  .text("100 - 250 mm");

          legend = d3.select("#legend_green").append("g")                      
              .attr("transform","translate("+50+","+0+")");                
          legend.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .style("fill","green")
            .style("stroke","#FFFFFF")
            .style("stroke-width","1px");
          legend.append("text")
                  .attr("x",25)
                  .attr("y",15)
                  .text("250 - 500 mm");

          legend = d3.select("#legend_blue").append("g")                      
              .attr("transform","translate("+50+","+0+")");                
          legend.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .style("fill","#256d7b")
            .style("stroke","#FFFFFF")
            .style("stroke-width","1px");
          legend.append("text")
                  .attr("x",25)
                  .attr("y",15)
                  .text("> 500 mm");

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

          function renderHeatMap(data,isProvince){
              $('#svgSideBar').css('height',((data.length*40)+100)+'px')
              d3.select("#ht_main").text(isProvince===true?"Provincial Average Rainfall Data":"Municipal Rainfall Data")
              .attr("x", isProvince===true? 180:220);                        
              heatMap.selectAll("g.hmap").remove();
              
              var row = heatMap.selectAll("g.hmap")
                      //.exit()
                      //.remove()
                      .data(data)
                      .enter()
                      .append("g")
                      .attr("class","hmap")
                      .attr("transform",function(d,i){
                          //console.log(d);
                          return "translate(0,"+i*gridSize+")"
              }).on('click',function(d){
              	  if(isProvince){
              	  	renderHeatMap(d.municipalities,false);
              	  }
              });                        
              
              //console.log(data);                        
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
                //console.log(six_months[i]);
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
                 .text(function(d){return d.data.month[six_months[0]];});

             row.append("rect")
             .attr("width", gridSize * 3)
             .attr("height", gridSize)
             .attr("x",gridSize * 3)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                //console.log(six_months[i]);
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
                 .text(function(d){return d.data.month[six_months[1]];});

             row.append("rect")
             .attr("width", gridSize * 3)
             .attr("height", gridSize)
             .attr("x",gridSize*6)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                //console.log(six_months[i]);
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
                 .text(function(d){return d.data.month[six_months[2]];});

             row.append("rect")
             .attr("width", gridSize * 3)
             .attr("height", gridSize)
             .attr("x",gridSize * 9)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                //console.log(six_months[i]);
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
                 .text(function(d){return d.data.month[six_months[3]];});

             row.append("rect")
             .attr("width", gridSize * 3)
             .attr("height", gridSize)
             .attr("x",gridSize * 12)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                //console.log(six_months[i]);
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
                 .text(function(d){return d.data.month[six_months[4]];});

             row.append("rect")
             .attr("width", gridSize * 3)
             .attr("height", gridSize)
             .attr("x",gridSize * 15)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                //console.log(six_months[i]);
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
                 .text(function(d){return d.data.month[six_months[5]];});  
              
            
              row.exit().remove();
          }

          $('#btn_ldrgdata').click(function(){renderHeatMap(provinces,true);});                    
          renderHeatMap(provinces,true);
      
      }/** Function end of Heatmap Init **/
  });/** Function end of d3.xml **/
})/** function end of onrendered **/


Template.HeatMapRainfallOutlook.helpers({
  months: () => {
      return getSixConsecMonths();
  }
})

function getSixConsecMonths(){
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    var d = new Date()
    var current_month = 7;
    var six_months = [];
    for(var i = 0 ; i < 6 ; i++){
      six_months[i] = months[(i + current_month)%months.length];
    }
    return six_months;
}