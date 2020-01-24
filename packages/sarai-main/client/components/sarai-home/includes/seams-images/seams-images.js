// Template.SeamsImages.onCreated(() => {
// })

Template.SeamsImages.onRendered(() => {
  var dialog = document.querySelector('dialog');
  dialog.showModal();

  const northEast = L.latLng(21.924058, 115.342984);
  const southWest = L.latLng(4.566972, 128.614468);
  const bounds = L.latLngBounds(southWest, northEast);
  
  weatherMap = L.map('seams-map', {
    maxBounds: bounds,
    center: [10.825, 122.671],
    zoom: 13,
    minZoom: 1
  });

  weatherMap.zoomControl.setPosition('bottomright');

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }).addTo(weatherMap);

  Session.set('size', '4');
  
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  let images_data = [];
  let current_data = [];
  markers = [];

  function getImagesData(token){
    current_data = [];
    var token;
    $.getJSON("https://firestore.googleapis.com/v1beta1/projects/seams-image-caputring/databases/(default)/documents/post?pageSize=6&pageToken=" + token, (results) => {
      for(let i = 0 ; i < results.documents.length; i++){
          let formatDate = new Date(results.documents[i].createTime);
          var day = formatDate.getDate();
          var monthIndex = formatDate.getMonth();
          var year = formatDate.getFullYear();
          var data = {
            imageUrl: results.documents[i].fields.imageUrl.stringValue, 
            coords: '[' + results.documents[i].fields.coords.arrayValue.values[0].doubleValue + ',' + results.documents[i].fields.coords.arrayValue.values[1].doubleValue + ']',
            purpose: results.documents[i].fields.purpose.stringValue,
            crop: results.documents[i].fields.crop.stringValue,
            stage: results.documents[i].fields.stage.stringValue,
            desc: results.documents[i].fields.description.stringValue,
            date: day + ' ' + monthNames[monthIndex] + ' ' + year,
            rawDate: formatDate,
            lat: results.documents[i].fields.coords.arrayValue.values[0].doubleValue,
            long: results.documents[i].fields.coords.arrayValue.values[1].doubleValue,
          };

          images_data.push(data);
          current_data.push(data);
        }
        images_data.sort(function(a,b){
          return new Date(a.rawDate) - new Date(b.rawDate);
        });
      if('nextPageToken' in results){
        token = results.nextPageToken;
      }else{
        token = null;
      }
    }).done(function(){
        Session.set('all_seams_images', images_data)
        updateData($('#purposeSelect').val(), $('#cropSelect').val(), $('#stageSelect').val(), '.active', (parseInt($('li.active a').text()) * 6 - 6), "MainUpdate")

        if(dialog.open){
          dialog.close();
        }

        for(let a = 0 ;a < current_data.length; a++){
          var marker = new L.marker([current_data[a].lat, current_data[a].long], {purpose: current_data[a].purpose, crop: current_data[a].crop, stage: current_data[a].stage})
                .bindPopup(`<div style="max-width:150px"><span>${current_data[a].desc}</span><br/><img src="data:image/jpeg;base64,${current_data[a].imageUrl}" title="${current_data[a].desc}" style="width:100%"/></div>`);
          markers.push(marker)
          marker.addTo(weatherMap);
        }

        if(token){
          getImagesData(token);
        }
    }).fail(function() {
      console.log( "error in retrieving data" );
    });
  }
  //function call
  getImagesData('');
})/** function end of onrendered **/

Template.SeamsImages.events({
  'click .page': (e) => {
    var startIndex = parseInt($(e.target).text()) * 6 - 6;
    updateData($('#purposeSelect').val(), $('#cropSelect').val(), $('#stageSelect').val(), e.currentTarget, startIndex, "PaginationUpdate")
  },
  'click #download': (e) => {
    $('#form-seams').removeClass('has-error');
    $('#invalid_alert').hide()
    $('#input_password').val('')
    var pdialog = document.querySelector('#passwordDialog');
    pdialog.showModal()
  },
  'click #cancel_password': (e) => {
    var pdialog = document.querySelector('#passwordDialog');
    pdialog.close()
  },
  'click #submit_password': (e) => {
    var pdialog = document.querySelector('#passwordDialog');
    if($('#input_password').val() == "seams2019"){
      window.location.href = 'seams-data.zip';
      pdialog.close()
    }else{
      $('#form-seams').addClass('has-error');
      $('#invalid_alert').show()
    }
    
  },
  'click #hide': (e) => {
    $( "#filter-body" ).toggle( "fold" );
  },
  'click .seams-card': (event) => {
    $("#myModal").modal();
    $("#body-image").attr("src",'data:image/jpeg;base64,' + Blaze.getData(event.target).imageUrl);
    $("#body-image").attr("title", Blaze.getData(event.target).desc);
    $('#desc').html('<b>' + Blaze.getData(event.target).desc + '</b>');
    $('#coords').html('<b>Coordinates:</b><div>' + Blaze.getData(event.target).coords) + '</div>';
    $('#purpose').html('<b>Purpose:</b><div>' + Blaze.getData(event.target).purpose) + '</div>';
    $('#crop').html('<b>Crop:</b><div>' + Blaze.getData(event.target).crop) + '</div>';
    $('#stage').html('<b>Growth Stage:</b><div>' + Blaze.getData(event.target).stage) + '</div>';
  },
  'change #purposeSelect': (e) => {
    const purpose = e.currentTarget.value
    updateData(purpose, $('#cropSelect').val(), $('#stageSelect').val(), '.pagination li:first', 0, "FilterUpdate")
  },
  'change #cropSelect': (e) => {
    const crop = e.currentTarget.value
    updateData($('#purposeSelect').val(),crop, $('#stageSelect').val(), '.pagination li:first', 0, "FilterUpdate")
  },
  'change #stageSelect': (e) => {
    const stage = e.currentTarget.value
    updateData($('#purposeSelect').val(),$('#cropSelect').val(), stage, '.pagination li:first', 0, "FilterUpdate")
  },
  'click #twoview': (event) => {
    Session.set('listView', false);
    Session.set('size', '6');
  },
  'click #threeview': (event) => {
    Session.set('listView', false);
    Session.set('size', '4');
  },
  'click #fourview': (event) => {
    Session.set('listView', false);
    Session.set('size', '3');
  },
  'click #listview': (event) => {
    Session.set('listView', true);
  },
  'change .filter-form': (event) => {
    const purpose = [];
    $.each($("input[name='Purpose']:checked"), function(){            
      purpose.push($(this).val());
    });
   const crop = [];
    $.each($("input[name='Crop']:checked"), function(){            
      crop.push($(this).val());
    });
   const stage = [];
    $.each($("input[name='Stage']:checked"), function(){            
      stage.push($(this).val());
    });
   markers.forEach(function(element){
    var purposeFilterPass = sortByFilter(purpose,element.options.purpose, 'purpose');
    var cropFilterPass = sortByFilter(crop, element.options.crop, 'crop');
    var stageFilterPass = sortByFilter(stage, element.options.stage, 'stage');
    
    if(purposeFilterPass && cropFilterPass && stageFilterPass){  
      element.addTo(weatherMap);
    }else{
      element.remove();
    }
   });
  },
})

Template.SeamsImages.helpers({
  noOfPages: ()=> {
    const seams_images = Session.get('seams_images')
    var numbers = [];
    for(var i = 2 ; i <= Math.ceil(seams_images.length/6); i++){
      numbers.push(i)
    }
    return numbers;
  },
  seamsImages: () => {
    const seams_images = Session.get('page_seams_images')
    return seams_images
  },
  size: ()=> {
    return Session.get('size')
  },
  listView: ()=> {
    if(Session.get('listView'))
      return true;
    return false;
  },
})

function sortByFilter(arr, obj, type){
  for(var i = 0 ; i < arr.length; i++){
    if(obj == arr[i]){
      return true;
    }
  }

  if(arr.includes("Others") && !checkFilterExists(obj, type)){
    return true;
  }
  return false;
}

function checkFilterExists(obj, type){
  var type_array;
  if(type=='crop'){
    type_array = ['Rice','Corn']
  }else if(type=="stage"){
    type_array = ['Land Preparation','Vegetative','Reproductive','Mature','Idle land/grass','Harvested']
  }
  if(type_array.includes(obj)){
    return true;
  }
  return false;
}

function updateData(purpose,crop,stage,element,startIndex, type){
  //update the pagination
  if(type=="FilterUpdate" || type=="PaginationUpdate"){
    $('.page').removeClass("active");
    $(element).addClass("active");
  }

  if(type=="FilterUpdate" || type=="MainUpdate"){
    
    const all_seams_images = Session.get('all_seams_images');
    const sorted = all_seams_images.reduce(function(result, doc) {
      if ( (doc.purpose == purpose || purpose == 'All') && (doc.crop == crop || crop == 'All' || (crop == 'Others' && !checkFilterExists(doc.crop,'crop')) ) && (doc.stage == stage || stage == 'All' || (stage == 'Others' && !checkFilterExists(doc.stage,'stage')) ))  {
        result.push(doc);
      }
      return result;
    }, []);
    Session.set('seams_images', sorted);
    Session.set('page_seams_images', sorted.slice(startIndex,startIndex + 6))
    
    
  }else if(type=="PaginationUpdate"){
    const seams_images = Session.get('seams_images')
    Session.set('page_seams_images', seams_images.slice(startIndex,startIndex + 6))
  }
}