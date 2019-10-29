Template.SeamsImages.onCreated(() => {
})

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
  
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  let images_data = [];

  function getImagesData(token){
    var token;
    $.getJSON("https://firestore.googleapis.com/v1beta1/projects/seams-image-caputring/databases/(default)/documents/post?pageToken=" + token, (results) => {
      for(let i = 0 ; i < results.documents.length; i++){
          let formatDate = new Date(results.documents[i].createTime);
          var day = formatDate.getDate();
          var monthIndex = formatDate.getMonth();
          var year = formatDate.getFullYear();
          images_data.push({
            imageUrl: results.documents[i].fields.imageUrl.stringValue, 
            coords: '[' + results.documents[i].fields.coords.arrayValue.values[0].doubleValue + ',' + results.documents[i].fields.coords.arrayValue.values[1].doubleValue + ']',
            purpose: results.documents[i].fields.purpose.stringValue,
            crop: results.documents[i].fields.crop.stringValue,
            stage: results.documents[i].fields.stage.stringValue,
            desc: results.documents[i].fields.description.stringValue,
            date: day + ' ' + monthNames[monthIndex] + ' ' + year,
            lat: results.documents[i].fields.coords.arrayValue.values[0].doubleValue,
            long: results.documents[i].fields.coords.arrayValue.values[1].doubleValue,
          })
        }
      token = results.nextPageToken;
    }).done(function(){
      if(token){
        getImagesData(token)
      }else{
        Session.set('size', '4');
        Session.set('seams_images', images_data)
        Session.set('all_seams_images', images_data)

        var markers = [];

        for(let a = 0 ;a < images_data.length; a++){
          var marker = new L.marker([images_data[a].lat, images_data[a].long], {purpose: images_data[a].purpose, crop: images_data[a].crop, stage: images_data[a].stage})
                .bindPopup(`<div style="max-width:150px"><span>${images_data[a].desc}</span><br/><img src="data:image/jpeg;base64,${images_data[a].imageUrl}" title="${images_data[a].desc}" style="width:100%"/></div>`);
          markers.push(marker)
          marker.addTo(weatherMap);
        }
        globalMarker = markers;
        dialog.close();
      }
    });
  }

  getImagesData('');

})/** function end of onrendered **/

Template.SeamsImages.events({
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
    updateView(purpose, $('#cropSelect').val(), $('#stageSelect').val())
  },
  'change #cropSelect': (e) => {
    const crop = e.currentTarget.value
    updateView($('#purposeSelect').val(),crop, $('#stageSelect').val())
  },
  'change #stageSelect': (e) => {
    const stage = e.currentTarget.value
    updateView($('#purposeSelect').val(),$('#cropSelect').val(), stage)
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
   globalMarker.forEach(function(element){
    var purposeFilterPass = false;
    for(p in purpose){
      if(element.options.purpose == purpose[p]){
        purposeFilterPass = true;
        break;
      }
    }
    var cropFilterPass = false;
    for(c in crop){
      if(element.options.crop == crop[c]){
        cropFilterPass = true;
        break;
      }
    }
    var stageFilterPass = false;
    for(s in stage){
      if(element.options.stage == stage[s]){
        stageFilterPass = true;
        break;
      }
    }
    
    if(purposeFilterPass && cropFilterPass && stageFilterPass){
      element.addTo(weatherMap);
    }else{
      element.remove();
    }
   });
  },
})

Template.SeamsImages.helpers({
  seamsImages: () => {
    const seams_images = Session.get('seams_images')
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


function updateView(purpose,crop,stage){
  const seams_images = Session.get('all_seams_images');
  const sorted = seams_images.reduce(function(result, doc) {
    if ( (doc.purpose == purpose || purpose == 'All') &&  (doc.crop == crop || crop == 'All') && (doc.stage == stage || stage == 'All'))  {
      result.push(doc);
    }
    return result;
  }, []);
  Session.set('seams_images', sorted);
}