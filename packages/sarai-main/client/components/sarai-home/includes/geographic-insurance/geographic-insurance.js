Template.GeographicInsurance.onCreated(() => {
  Meteor.subscribe('provinces')
  Meteor.subscribe('weather-outlook')

  //default is Region IV-A: CALABARZON, Laguna
  Session.set('province', 'Laguna')
//  Session.set('municipality', 'Los Baños')
})

Template.GeographicInsurance.onRendered(() => {
  //const province = Session.get('province')
  //$('#preview-select-province-drought').val(province)
  //createDroughtTable();

  // Meteor.subscribe('weather-outlook', ()=>{
  // 	const province = Session.get('province')

  // 	const provinces_new = WeatherOutlook.find({municipality: "All", province: province},{fields: {province: 1, data: 1, _id: 0}}).fetch()
	//   provinces_new.forEach(function(d){
	//     d.municipalities = WeatherOutlook.find({province: d.province, municipality: {$ne:'All'}},{fields: {province: 1, municipality: 1, data: 1, _id: 0}}).fetch();
  //   })

  //   //displayRainfallGraph(rainfall_values);
  //   console.log("Start of creating table")
  // 	createInsuranceTable(provinces_new[0])
  // })
  console.log("START OF RENDER")

  $('#insurance-datatable').DataTable( {
    data: [
      ['Carles','Rainfed Rice',7],
['Balasan','Rainfed Rice',7],
['Estancia','Rainfed Rice',7],
['Batad','Rainfed Rice',7],
['San Dionisio','Rainfed Rice',7],
['Sara','Rainfed Rice',7],
['Lemery','Rainfed Rice',7],
['Concepcion','Rainfed Rice',7],
['Bingawan','Rainfed Rice',7],
['Passi City','Rainfed Rice',7],
['San Rafael','Rainfed Rice',7],
['Calinog','Rainfed Rice',7],
['Ajuy','Rainfed Rice',7],
['Lambunao','Rainfed Rice',7],
['San Enrique','Rainfed Rice',7],
['Barotac Viejo','Rainfed Rice',7],
['Duenas','Rainfed Rice',7],
['Banate','Rainfed Rice',7],
['Dingle','Rainfed Rice',7],
['Anilao','Rainfed Rice',7],
['Janiuay','Rainfed Rice',7],
['Badiangan','Rainfed Rice',7],
['Pototan','Rainfed Rice',7],
['Mina','Rainfed Rice',7],
['Maasin','Rainfed Rice',7],
['Barotac Nuevo','Rainfed Rice',7],
['Cabatuan','Rainfed Rice',7],
['New Lucena','Rainfed Rice',6],
['Alimodian','Rainfed Rice',5],
['Dumangas','Rainfed Rice',7],
['Zarraga','Rainfed Rice',6],
['Leon','Rainfed Rice',5],
['Santa Barbara','Rainfed Rice',6],
['Tubungan','Rainfed Rice',2],
['Leganes','Rainfed Rice',6],
['San Miguel','Rainfed Rice',6],
['Pavia','Rainfed Rice',5],
['Igbaras','Rainfed Rice',2],
['Oton','Rainfed Rice',3],
['Iloilo City','Rainfed Rice',5],
['Tigbauan','Rainfed Rice',4],
['Guimbal','Rainfed Rice',1],
['Miagao','Rainfed Rice',2],
['San Joaquin','Rainfed Rice',2]
    ],
    columns: [
        { title: "Municipality" },
        { title: "Crop" },
        { title: "Index" }
    ],
  });

  $.get('/geojsons/Iloilo.geojson', function(jsondata, status){
    if(status==='success'){
       // Run highcharts
       var geojson = $.parseJSON(jsondata);
      //  $('<div class="meteogram">').appendTo('#insurance-map2').highcharts('Map', 
      //   {
      //     series: [{
      //         mapData: jsondata
      //     }]
      //   }
      //  );
      $('#insurance-map2').slideDown().highcharts('Map', {
        title: {
          text: 'GIU Map for Iloilo'
        },
        colorAxis: {
          dataClasses: [{
                  name:'1 - Guimbal',
                  from: 1,
                  to: 1,
                  color: '#FFFF71'
              },{
                  name:'2 - Igbaras, Miagao, San Joaquine, Tubungan',
                  from: 2,
                  to: 2,
                  color:'#FFCF57'
              },{
                  name:'3 - Oton',
                  from: 3,
                  to: 3,
                  color:'#FF9B64'
              },{
                  name:'4 - Tigbauan',
                  from: 4,
                  to: 4,
                  color:'#FF6B85'
              },{
                  name:'5 - Alimodian, Iloilo City, Lean, Pavia',
                  from: 5,
                  to: 5,
                  color:'#F84EAB'
              },{
                  name:'6 - Leganes, New Lucena, San Miguel, Santa Barbara, Zarraga',
                  from: 6,
                  to: 6,
                  color:'#AF4FCB'
              },{
                  name:'7 - District 3, District 4, District 5',
                  from: 7,
                  to: 7,
                  color:'#0059D7'
              }
              ]
        },
        series: [{
            mapData: geojson,
            data:[
              ['Carles',7],
              ['Balasan',7],
              ['Estancia',7],
              ['Batad',7],
              ['San Dionisio',7],
              ['Sara',7],
              ['Lemery',7],
              ['Concepcion',7],
              ['Bingawan',7],
              ['Passi City',7],
              ['San Rafael',7],
              ['Calinog',7],
              ['Ajuy',7],
              ['Lambunao',7],
              ['San Enrique',7],
              ['Barotac Viejo',7],
              ['Duenas',7],
              ['Banate',7],
              ['Dingle',7],
              ['Anilao',7],
              ['Janiuay',7],
              ['Badiangan',7],
              ['Pototan',7],
              ['Mina',7],
              ['Maasin',7],
              ['Barotac Nuevo',7],
              ['Cabatuan',7],
              ['New Lucena',6],
              ['Alimodian',5],
              ['Dumangas',7],
              ['Zarraga',6],
              ['Leon',5],
              ['Santa Barbara',6],
              ['Tubungan',2],
              ['Leganes',6],
              ['San Miguel',6],
              ['Pavia',5],
              ['Igbaras',2],
              ['Oton',3],
              ['Iloilo City',5],
              ['Tigbauan',4],
              ['Guimbal',1],
              ['Miagao',2],
              ['San Joaquin',2]
            ],
            keys: ['name', 'value'],
            joinBy: 'name',
            name: 'GIU code',
            cursor: 'pointer',
            allowPointSelect: false,
            states: {
              hover: {
                  color: '#FFFFFF'
              },
              select: {
                      color: '#ff7777',
                      borderColor: 'black',
                      dashStyle: 'shortdot'
             }
            },
            dataLabels: {
              enabled: true,
              format: '{point.name}'
            }
        }]
      });
    }else{
      //if(dataLog) console.log("Unable to get municipality geojson of "+municipality_name);
      console.log("ERROR")
    }

});




})/** function end of onrendered **/

Template.GeographicInsurance.events({
  'change #preview-select-province-drought': (e) => {
    const province = e.currentTarget.value
    Session.set('province', province)
  }
})


Template.GeographicInsurance.helpers({
  provinces: () => {
    const provinces = Provinces.find({province: {$ne:'All'}}, {sort: {province: 1}}).fetch()

    return provinces
  },

  currentlySelectedProvince: (curr) => {
    const province = Session.get('province')
    $('#preview-select-province-drought').val(province)
  }
})

function createInsuranceTable(index_data){
  var insurance_set = [];
  var monthDataSet1 = [];

  for(var i = 0 ; i < index_data.municipalities.length; i++){
    monthDataSet1.push([index_data.province,Math.round(index_data.data.month['Jan']) ])
    insurance_set.push([
      index_data.province, 
      index_data.municipalities[i].municipality,
      Math.round(index_data.municipalities[i].data.month['Jan'])
    ])
  }

  $('#insurance-datatable').DataTable( {
    data: insurance_set,
    columns: [
        { title: "Province" },
        { title: "Municipality" },
        { title: "Index" }
    ],
    lengthChange: true,
    lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, 'All'] ]
  });

  $('<div class="meteogram">').appendTo('#insurance-map').highcharts('Map', Meteor.RainfallMapChart.constructChart(monthDataSet1 , 'Insurance Index Map'));
}