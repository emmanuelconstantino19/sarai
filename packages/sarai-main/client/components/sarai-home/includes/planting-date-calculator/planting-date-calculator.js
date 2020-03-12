Template.PlantingDateCalculator.onCreated(() => {
  Meteor.subscribe('provinces')
  Meteor.subscribe('weather-outlook')

  //default is Region IV-A: CALABARZON, Laguna
  Session.set('province', 'Laguna')
//  Session.set('municipality', 'Los Baños')
})

Template.PlantingDateCalculator.onRendered(() => {
  $.get('https://saraicropestimate.firebaseio.com/items.json', function(jsondata, status){
    console.log(jsondata)
  })
  $('#insurance-datatable').DataTable( {
    "autoWidth": false,
    data: [
      ['Planting of rice:','<button>More information</button>','<button>More information</button>'],
      ['Average yield (tons ha<sup>-1</sup>)',' ',' '],
    ],
    columns: [
        { title: "" },
        { title: "Traditional (Source: PSA)" },
        { title: "SARAI-generated planting window based on SARAI-CL-SEAMS' SCF" }
    ],
  });
})/** function end of onrendered **/

Template.GeographicInsurance.events({
  'change #preview-select-province-drought': (e) => {
    const province = e.currentTarget.value
    Session.set('province', province)
  }
})


Template.PlantingDateCalculator.helpers({
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