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
      $('#heatmap').find("svg").css('height','768px').css('width','650px').attr('id', 'svgMainMap');
      d3.select("#sidebar").append("svg").attr("id","svgSideBar")
      $('#svgSideBar').css('width','100%')

      var color_low = "red";
      var color_mid = "yellow"
      var color_high = "green";
      var color_max = "#003300";
      var y_start;
      var x_start;
      var k_last = 1;
      var five_months = getFiveConsecMonths();
      console.log(five_months);

      var drag1 = d3.drag()
      .on("start",function (d) {                
          d3.event.sourceEvent.stopPropagation();
          x_start=d3.mouse(this)[0];
          y_start=d3.mouse(this)[1];
      })                        
      .on("drag",function (d) {
          d3.select(this).attr("transform", "translate("+((d3.event.x-(x_start*k_last)))+","+((d3.event.y-(y_start*k_last)))+")scale("+k_last+")");               
      });

      var zoom = d3.zoom()
      .scaleExtent([1, 10])
      .on("zoom", function(){     
          k_last = d3.event.transform.k;
          d3.select(this).attr("transform",d3.event.transform);
      });

      Meteor.subscribe('weather-outlook', ()=>{
          const provinces_new = WeatherOutlook.find({municipality: "All", province: {$ne:'All'}},{fields: {province: 1, data: 1, _id: 0}}).fetch()
          provinces_new.forEach(function(d){
            d.municipalities = WeatherOutlook.find({province: d.province, municipality: {$ne:'All'}},{fields: {province: 1, municipality: 1, data: 1, _id: 0}}).fetch();
          })
          heatmap_init(provinces_new)
      })

      function heatmap_init(provinces){
        console.log("heatmap init---");

        var color = d3.scaleLinear().domain([0,100,200,800]).range([color_low,color_mid,color_high,color_max]).interpolate(d3.interpolateHcl);
        var svg_map = d3.select("#svgPHfullmap");

        d3.select("#svgMainMap").append("text").attr("id","svg_mainlbl")
        .style("font-size","35")
        .style("text-anchor","start")
        .attr("transform","translate(120,-30)")
        ;

        function changeMonth(month){                        
          d3.select("#svg_mainlbl").text("Philippines Rainfall MAP: "+month+" 2018");                        
          svg_map.selectAll("path.land")
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
                          "Number of Municipalities: "+(d.municipalities.length)+"";})  
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
              return color(d.data.month[month]);}
          );                    
        }


        $('#slt_mnth').change(function(){
            changeMonth($('#slt_mnth').val());                  
        });                
        changeMonth(five_months[0]);


        var gradient = d3.select("#svgMainMap").append("defs")
            .append("linearGradient")
              .attr("id", "gradient")
              .attr("x1", "0%")
              .attr("y1", "0%")
              .attr("x2", "100%")
              .attr("y2", "0%")
              .attr("spreadMethod", "pad");
          gradient.append("stop")
              .attr("offset", "0%")
              .attr("stop-color",color_low)
              .attr("stop-opacity", 1);
          gradient.append("stop")
              .attr("offset", "14%")
              .attr("stop-color",color_mid);
          gradient.append("stop")
              .attr("offset", "28%")
              .attr("stop-color",color_high);     
          gradient.append("stop")
              .attr("offset", "100%")
              .attr("stop-color",color_max);  

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


          var legend = d3.select("#svgMainMap").append("g")                      
              .attr("transform","translate("+250+","+1250+")");                
          legend.append("rect")
            .attr("width", 300)
            .attr("height", 30)
            .style("fill","url(#gradient)")
            .style("stroke","#FFFFFF")
            .style("stroke-width","1px");
          legend.append("text")
                  .attr("x",0)
                  .attr("y",50)
                  .text("0 mm");
          legend.append("text")
                  .attr("x",300)
                  .attr("y",50)
                  .text("700 mm");                    
          legend.append("text")
                  .attr("x",150)
                  .attr("y",-5)
                  .text("Legend: Rainfall intensity");

          var drag = d3.drag()
            .on("start",function (d) {
                console.log(d3.mouse(this));
                y_start=d3.mouse(this)[1];
            })                        
            .on("drag",function (d) {
                d3.select(this).attr("transform", "translate(1024,"+(d3.event.y-y_start)+")");               
            });

          var heatMap = d3.select("#svgSideBar").append("g").attr("id","chrt_htmap").                            
              attr("transform","translate(150,50)");
          var gridSize = 40;

          heatMap.append("text").attr("id","ht_main")
                  .style("font-size","12pt")
                  .attr("y",-30)
                  .attr("x",0);
          heatMap.selectAll("text.mnth")
                      .data(five_months)
                      .enter()
                      .append("text")
                      .attr("class","mnth")
                      .attr("x",function(d,i){return (i*gridSize)+5})
                      .attr("y",-5)
                      .text(function(d){return d;});

          function renderHeatMap(data,isProvince){
              $('#svgSideBar').css('height',((data.length*40)+100)+'px')
              d3.select("#ht_main").text(isProvince===true?"Provincial Average Rainfall Data":"Municipal Rainfall Data")
              .attr("x", isProvince===true? -20:20);                        
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
                  renderLineGraph(d,isProvince);
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
             .attr("width", gridSize)
             .attr("height", gridSize)
             .attr("rx",8)
             .attr("ry",8)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                //console.log(five_months[i]);
                return  "Rainfall: "+(d.data.month[five_months[0]])+" mm";

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
             .style("fill",function(d){return color(d.data.month[five_months[0]]);});

             row.append("rect")
             .attr("width", gridSize)
             .attr("height", gridSize)
             .attr("rx",8)
             .attr("ry",8)
             .attr("x",gridSize*1)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                //console.log(five_months[i]);
                return  "Rainfall: "+(d.data.month[five_months[1]])+" mm";

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
             .style("fill",function(d){return color(d.data.month[five_months[1]]);});

             row.append("rect")
             .attr("width", gridSize)
             .attr("height", gridSize)
             .attr("rx",8)
             .attr("ry",8)
             .attr("x",gridSize*2)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                //console.log(five_months[i]);
                return  "Rainfall: "+(d.data.month[five_months[2]])+" mm";

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
             .style("fill",function(d){return color(d.data.month[five_months[2]]);});

             row.append("rect")
             .attr("width", gridSize)
             .attr("height", gridSize)
             .attr("rx",8)
             .attr("ry",8)
             .attr("x",gridSize*3)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                //console.log(five_months[i]);
                return  "Rainfall: "+(d.data.month[five_months[3]])+" mm";

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
             .style("fill",function(d){return color(d.data.month[five_months[3]]);});

             row.append("rect")
             .attr("width", gridSize)
             .attr("height", gridSize)
             .attr("rx",8)
             .attr("ry",8)
             .attr("x",gridSize*4)                        
             .on("mouseover", function(d) {   
              tooltip.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              tooltip.html(function(){
                //console.log(five_months[i]);
                return  "Rainfall: "+(d.data.month[five_months[4]])+" mm";

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
             .style("fill",function(d){return color(d.data.month[five_months[4]]);});  
              
            
              row.exit().remove();
          }

          $('#btn_ldrgdata').click(function(){renderHeatMap(provinces,true);});                    
          renderHeatMap(provinces,true);


          var lineGraph = d3.select("#svgMainMap").append("g").attr("id","lngrph").attr("transform","translate(60,400)").style("opacity",0).style("display","none");
          lineGraph.append("rect").attr("width","700").attr("height","500").style("fill","#FFFFFF").style("stroke","#000000").style("opacity",0.8);                    


          var x = d3.scaleLinear().domain([0,5]).range([0,700-160]);
          var y = d3.scaleLinear().domain([0,800]).range([500-160, 0]);


          //Y axis display
          lineGraph.append("g")
              .style("fill","url(#gradient2)")
              .attr("transform","translate(80,80)")
              .call(d3.axisLeft(y))
            .append("text")
              .attr("fill", "#000")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "1em")
              .style("text-anchor", "end")                        
              .text("Rainfall (mm)");

          //X axis display
          lineGraph.selectAll(".mnth")
                      .data(five_months)
                      .enter()
                      .append("text")
                      .attr("class","mnth")
                      .attr("x",function(d,i){return 80 + i*((700-160)/4); })
                      .attr("y",500-80)
                      .attr("dy","18pt")
                      .text(function(d){return d;});

          lineGraph.append("text").attr("id","ln_main")
          .style("font-size","16pt")
          .style("text-anchor","start")  
              .attr("y",30)
              .attr("x",10);

          lineGraph.append("text").text('[close]')
              .style("text-anchor","end")                
              .style("cursor","pointer")
              .attr("transform","translate(690,27)")
              .on('click',function(d){
                  console.log("closing");
                  lineGraph.transition().duration(1000).style("opacity",0)
                  .transition().duration(0).style("display","none");                                
          });


          function renderLineGraph(data,isProvince){
    
              d3.select("#ln_main").text(isProvince===true?"Provincial Average Rainfall Data:"+data.province:"Municipal Rainfall Data:"+data.municipality);
              
              var ln_data = [data.data.month[five_months[0]],
                            data.data.month[five_months[1]],
                            data.data.month[five_months[2]],
                            data.data.month[five_months[3]],
                            data.data.month[five_months[4]]];

              var x = d3.scaleLinear().domain([0,4]).range([0,700-160]);
              var y = d3.scaleLinear().domain([0,800]).range([500-160, 0]);
              
              var line = d3.line()
                  .x(function(d,i){return x(i);})
                  .y(function(d){ return y(d);});
              
              if(d3.select('#lngrph_ln').size()===0){                        
                  lineGraph
                      .append("path")
                      .attr("id","lngrph_ln")
                      .attr("d",line(ln_data))      
                      .attr("fill", "none")
                      .attr("stroke", "black")
                      .attr("stroke-linejoin", "round")
                      .attr("stroke-linecap", "round")
                      .attr("stroke-width", 5)
                      .attr("transform","translate(80,80)")
              ;
              }else{                                
                  lineGraph.select('#lngrph_ln')
                      .transition().duration(1000)    
                      .attr("d",line(ln_data))
              ;
              }
              lineGraph.transition().duration(1000)
                      .style("opacity",1)
                      .style("display","inline");                   
              
          }
      }/** Function end of Heatmap Init **/
  });/** Function end of d3.xml **/

  var modal = document.getElementById('help-modal');

  // Get the button that opens the modal
  var btn = document.getElementById("btn_help");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  btn.onclick = function() {
      modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
})/** function end of onrendered **/


Template.HeatMapRainfallOutlook.helpers({
  months: () => {
      return getFiveConsecMonths();
  }
})

function getFiveConsecMonths(){
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    var d = new Date()
    var current_month = d.getMonth();
    var five_months = [];
    for(var i = 0 ; i < 5 ; i++){
      five_months[i] = months[(i + current_month)%months.length];
    }
    return five_months;
}