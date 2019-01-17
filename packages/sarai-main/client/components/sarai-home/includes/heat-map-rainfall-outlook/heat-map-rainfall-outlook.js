Template.HeatMapRainfallOutlook.onCreated(() => {
  Meteor.subscribe('provinces')
  Meteor.subscribe('weather-outlook')

  //default is Region IV-A: CALABARZON, Laguna
  Session.set('province', 'Laguna')
  Session.set('municipality', 'Los Baños')
})

Template.HeatMapRainfallOutlook.onRendered(() => {
  const province = Session.get('province')
  $('#preview-select-province-rainfall').val(province)

  const municipality = Session.get('municipality')
  $('#preview-select-municipality-rainfall').val(municipality)

  Meteor.subscribe('weather-outlook', ()=>{
  	const province = Session.get('province')
  	const municipality = Session.get('municipality')
  	const rainfall_values = WeatherOutlook.findOne({province: province, municipality: municipality})

  	const provinces_new = WeatherOutlook.find({municipality: "All", province: {$ne:'All'}},{fields: {province: 1, data: 1, _id: 0}}).fetch()
	  provinces_new.forEach(function(d){
	    d.municipalities = WeatherOutlook.find({province: d.province, municipality: {$ne:'All'}},{fields: {province: 1, municipality: 1, data: 1, _id: 0}}).fetch();
	  })

  	displayRainfallGraph(rainfall_values);
  	createRainfallTable(provinces_new)
  })
})/** function end of onrendered **/

Template.HeatMapRainfallOutlook.events({
  'change #preview-select-province-rainfall': (e) => {
    const province = e.currentTarget.value
    Session.set('province', province)

    // sets municipality to first municipality in the chosen province 
    Session.set('municipality',Provinces.findOne({province:province}).municipality[0])
    const rainfall_values_change = WeatherOutlook.findOne({province: province, municipality: 'All'})
    displayRainfallGraph(rainfall_values_change)
  },

  'change #preview-select-municipality-rainfall': (e) => {
    const municipality = e.currentTarget.value
    Session.set('municipality', municipality)

    const province = Session.get('province')

    const rainfall_values_change = WeatherOutlook.findOne({province: province, municipality: municipality})
  	displayRainfallGraph(rainfall_values_change)
  }
})


Template.HeatMapRainfallOutlook.helpers({
  months: () => {
      return getSixConsecMonths();
  },
  monthlyRainfall: () => {
    const province = Session.get('province')
      const municipality = Session.get('municipality')
      const color_1 = '#e1e1e1'
      const color_2 = '#bee8ff'
      const color_3 = '#00c5ff'
      const color_4 = '#0070ff'
      const color_5 = '#004da8'
      const color_6 = '#002673'
      const color_7 = '#000000'

      const weatherOutlook = WeatherOutlook.findOne({province: province, municipality: municipality})
      var d = new Date()
      var current_month = 7; 
      var val;
      var six_months = getSixConsecMonths();
      var color, fontcolor;
      var monthHeader = '2019';

      if (weatherOutlook){
        let outlook = []

        for(var i = 0 ; i < 6; i++){
          val = (weatherOutlook.data.month[six_months[i]]==null) ? "--" : Math.round(weatherOutlook.data.month[six_months[i]])
          if(val <= 50){
            color = color_1;
            fontcolor = 'black';
          }else if(val > 50 && val <= 100){
            color = color_2;
            fontcolor = 'black';
          }else if(val > 100 && val <= 200){
            color = color_3;
            fontcolor = 'black';
          }else if(val > 200 && val <= 300){
            color = color_4;
            fontcolor = 'white';
          }
          else if(val > 300 && val <= 400){
            color = color_5;
            fontcolor = 'white';
          }
          else if(val > 400 && val <= 500){
            color = color_6;
            fontcolor = 'white';
          }
          else if(val > 500){
            color = color_7;
            fontcolor = 'white';
          }
          
          monthHeader = '2019';

          outlook.push({
            head: six_months[i] + ' ' + monthHeader,
            value: val,
            color: color,
            fontcolor: fontcolor
          })
        }
        return outlook
      }
  },

  provinces: () => {
    const provinces = Provinces.find({province: {$ne:'All'}}, {sort: {province: 1}}).fetch()

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

function createRainfallTable(rain){
	var dataset = [];
	var monthDataSet1 = [];
	var monthDataSet2 = [];
	var monthDataSet3 = [];
	var monthDataSet4 = [];
	var monthDataSet5 = [];
	var monthDataSet6 = [];
	var entry;
	var months = getSixConsecMonths();
	console.log('create rainfall table');
	
  for(var i = 0 ; i < rain.length; i++){
    
    if(rain[i].province == "Oriental Mindoro"){
      rain[i].province = "Mindoro Oriental"
    }
    if(rain[i].province == "Occidental Mindoro"){
      rain[i].province = "Mindoro Occidental"
    }
    if(rain[i].province == "Tawi-tawi"){
      rain[i].province = "Tawi-Tawi"
    }

		entry = [
		rain[i].province, 
		'All', 
		rain[i].data.month[months[0]], 
		rain[i].data.month[months[1]],
		rain[i].data.month[months[2]],
		rain[i].data.month[months[3]],
		rain[i].data.month[months[4]],
		rain[i].data.month[months[5]]
		]
		monthDataSet1.push([rain[i].province,rain[i].data.month[months[0]]])
		monthDataSet2.push([rain[i].province,rain[i].data.month[months[1]]])
		monthDataSet3.push([rain[i].province,rain[i].data.month[months[2]]])
		monthDataSet4.push([rain[i].province,rain[i].data.month[months[3]]])
		monthDataSet5.push([rain[i].province,rain[i].data.month[months[4]]])
		monthDataSet6.push([rain[i].province,rain[i].data.month[months[5]]])
		dataset.push(entry);
		for(var j = 0 ; j < rain[i].municipalities.length; j++){
			entry = [
			rain[i].municipalities[j].province,
			rain[i].municipalities[j].municipality,
			rain[i].municipalities[j].data.month[months[0]],
			rain[i].municipalities[j].data.month[months[1]],
			rain[i].municipalities[j].data.month[months[2]],
			rain[i].municipalities[j].data.month[months[3]],
			rain[i].municipalities[j].data.month[months[4]],
			rain[i].municipalities[j].data.month[months[5]]
			]
			dataset.push(entry);
		}
	}
		console.log(monthDataSet1);
        $('#rainfall-datatable').DataTable( {
          data: dataset,
          columns: [
              { title: "Province" },
              { title: "Municipality" },
              { title: "February" },
              { title: "March" },
              { title: "April" },
              { title: "May" },
              { title: "June" },
              { title: "July" }
          ],
          lengthChange: true,
          lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, 'All'] ]
        });

        $('<div class="meteogram">').appendTo('#rainfall-map1').highcharts('Map', Meteor.RainfallMapChart.constructChart(monthDataSet1, months[0] + ' 2019'));
        $('<div class="meteogram">').appendTo('#rainfall-map2').highcharts('Map', Meteor.RainfallMapChart.constructChart(monthDataSet2, months[1] + ' 2019'));
        $('<div class="meteogram">').appendTo('#rainfall-map3').highcharts('Map', Meteor.RainfallMapChart.constructChart(monthDataSet3, months[2] + ' 2019'));
        $('<div class="meteogram">').appendTo('#rainfall-map4').highcharts('Map', Meteor.RainfallMapChart.constructChart(monthDataSet4, months[3] + ' 2019'));
        $('<div class="meteogram">').appendTo('#rainfall-map5').highcharts('Map', Meteor.RainfallMapChart.constructChart(monthDataSet5, months[4] + ' 2019'));
        $('<div class="meteogram">').appendTo('#rainfall-map6').highcharts('Map', Meteor.RainfallMapChart.constructChart(monthDataSet6, months[5] + ' 2019'));
}

function displayRainfallGraph(values){
	var six_months = getSixConsecMonths();
	var place;
	let outlook = []

	console.log(values);

    for(var i = 0 ; i < 6; i++){
      	val = (values.data.month[six_months[i]]==null) ? "--" : Math.round(values.data.month[six_months[i]])
 	 	outlook.push(val)
 	}

	console.log('displayRainfallGraph');
	$('#rainfall_graph .meteogram').remove()
	if(values.municipality == 'All'){
		place = values.province;
	}
	else{
		place = values.municipality + ', ' + values.province;
	}
	$('<div class="meteogram">').appendTo('#rainfall_graph').highcharts(Meteor.RainfallGraph.constructChart(place, outlook))
}

function getSixConsecMonths(){
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    var d = new Date()
    var current_month = 1;
    var six_months = [];
    for(var i = 0 ; i < 6 ; i++){
      six_months[i] = months[(i + current_month)%months.length];
    }
    return six_months;
}