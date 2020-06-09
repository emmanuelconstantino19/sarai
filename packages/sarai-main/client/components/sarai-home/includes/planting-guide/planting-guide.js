Template.PlantingGuideView.onRendered(() => {
  var crop_data = Meteor.Batac.rice.data;
  $('<div class="meteogram">').appendTo('#accumulated_graph').highcharts(Meteor.PlantingGuideGraph.constructChart('rice',crop_data,'Batac, Ilocos Norte'))
  $('#text-advisory-cacao').hide()
  $('#text-advisory-banana').hide()
  $('#text-advisory-rice-corn').hide()
  $('#advisory-text').html(Meteor.Batac.rice.text.english)
})


Template.PlantingGuideView.events({
  'change #sites-list': ()=>{
    updateLocation()
    
  },
  'change #crop-list': () => {
    $("#sites-list").empty()
    $('#crop-pg').text($('#crop-list').val())
    
    if($('#crop-list').val() == "RICE" || $('#crop-list').val() == "CORN"){
      if($('#crop-list').val() == "CORN"){
        $("#sites-list").append($('<option></option>').attr("value", "Barili").text("Barili, Cebu (Climate Type III)"));
      }
      $("#sites-list").append($('<option></option>').attr("value", "Batac").text("Batac, Ilocos Norte (Climate Type I)"));
      $("#sites-list").append($('<option></option>').attr("value", "Butuan").text("Butuan, Agusan del Norte (Climate Type IV)"));
      $("#sites-list").append($('<option></option>').attr("value", "CagayanDeOro").text("Cagayan de Oro, Misamis Oriental (Climate Type III)"));
      $("#sites-list").append($('<option></option>').attr("value", "Calapan").text("Calapan, Oriental Mindoro (Climate Type III)"));
      $("#sites-list").append($('<option></option>').attr("value", "Echague").text("Echague, Isabela (Climate Type III)"));
      $("#sites-list").append($('<option></option>').attr("value", "Guinobatan").text("Guinobatan, Albay (Climate Type IV)"));
      $("#sites-list").append($('<option></option>').attr("value", "Iloilo").text("Iloilo City, Iloilo (Climate Type I)"));
      $("#sites-list").append($('<option></option>').attr("value", "LaCarlota").text("La Carlota, Negros Occidental (Climate Type III)"));
      $("#sites-list").append($('<option></option>').attr("value", "Lambunao").text("Lambunao, Iloilo (Climate Type III)"));
      $("#sites-list").append($('<option></option>').attr("value", "Legazpi").text("Legazpi City, Albay (Climate Type II)"));
      $("#sites-list").append($('<option></option>').attr("value", "Ligao").text("Ligao City, Albay (Climate Type III)"));
      $("#sites-list").append($('<option></option>').attr("value", "LosBanos").text("Los Baños, Laguna (Climate Type III)"));
      $("#sites-list").append($('<option></option>').attr("value", "Malaybalay").text("Malaybalay, Bukidnon (Climate Type IV)"));
      $("#sites-list").append($('<option></option>').attr("value", "Maramag").text("Maramag, Bukidnon (Climate Type IV)"));
      $("#sites-list").append($('<option></option>').attr("value", "Munoz").text("Muñoz, Nueva Ecija (Climate Type I)"));

      updateLocation()
      $('#graph-advisory').show()
      $('#text-advisory-cacao').hide()
      $('#text-advisory-banana').hide()
      $('#text-advisory-rice-corn').hide()
      $('#date-pg').text("BASED ON THE RAINFALL OUTLOOK FROM NOVEMBER 2019 TO MARCH 2020 AS OF NOVEMBER 2019")
      $("#project-pg").html("Source: <a href='/about-us/1.1' target='_blank' style='color:black'>Project 1.1</a>")
    }
    else if($('#crop-list').val() == "CACAO"){
      $("#sites-list").append($('<option></option>').attr("value", "Isabela").text("Isabela"));
      $('#location-pg').text('ISABELA')
      $('#graph-advisory').hide()
      $('#text-advisory-cacao').show()
      $('#text-advisory-banana').hide()
      $('#text-advisory-rice-corn').hide()
      $('#date-pg').text("BASED ON THE RAINFALL OUTLOOK FROM FEBRUARY TO JULY 2019 AS OF MAY 2019")
      $("#project-pg").html("Source: <a href='/about-us/1.3' target='_blank' style='color:black'>Project 1.3</a>")
    }else if($('#crop-list').val() == "BANANA"){
      $("#sites-list").append($('<option></option>').attr("value", "All").text("All"));
      $('#location-pg').text('THE PHILIPPINES')
      $('#graph-advisory').hide()
      $('#text-advisory-cacao').hide()
      $('#text-advisory-banana').show()
      $('#text-advisory-rice-corn').hide()
      $('#date-pg').text("")
      $("#project-pg").html("Source: <a href='/about-us/1.4' target='_blank' style='color:black'>Project 1.4</a>")
    }
  }
})

function updateLocation(){
  var places = {
    "Barili":"Barili, Cebu",
    "Batac":"Batac, Ilocos Norte",
    "Butuan": "Butuan, Agusan del Norte",
    "Calapan":"Calapan, Oriental Mindoro",
    "Echague":"Echague, Isabela",
    "Guinobatan":"Guinobatan, Albay",
    "Iloilo":"Iloilo City, Iloilo",
    "LaCarlota":"La Carlota, Negros Occidental",
    "Lambunao":"Lambunao, Iloilo",
    "Legazpi":"Legazpi City, Albay",
    "Ligao": "Ligao City, Albay",
    "LosBanos":"Los Baños, Laguna",
    "CagayanDeOro": "Cagayan de Oro, Misamis Oriental",
    "Malaybalay": "Malaybalay, Bukidnon",
    "Maramag": "Maramag,Bukidnon",
    "Munoz":"Muñoz, Nueva Ecija",
  }
  $('#location-pg').text(places[$('#sites-list').val()].toUpperCase())
  changeAdvisory(places)
}

function changeAdvisory(places){
    const crop = $('#crop-list').val().toLowerCase();
    const location = $('#sites-list').val();

    var crop_data;
    crop_data = Meteor[location][crop].data
    $('#advisory-text').html(Meteor[location][crop].text.english)

    $('#accumulated_graph .meteogram').remove()
    $('<div class="meteogram">').appendTo('#accumulated_graph').highcharts(Meteor.PlantingGuideGraph.constructChart(crop,crop_data,places[location]))
}