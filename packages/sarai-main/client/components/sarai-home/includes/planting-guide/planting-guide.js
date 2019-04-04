Template.PlantingGuideView.onRendered(() => {
  $('<div class="meteogram">').appendTo('#accumulated_graph').highcharts(Meteor.PlantingGuideGraph.constructChart('Rice'))
  $('#graph-advisory').show()
  $('#text-advisory-cacao').hide()
  $('#text-advisory-banana').hide()
})


Template.PlantingGuideView.events({
  'change #crop-list': () => {
    const crop = $('#crop-list').val()
    if(crop == "Corn"){
    	$('#accumulated_graph .meteogram').remove()
    	$('#advisories-list li').remove()
    	$('#crop-pg').text('CORN')
      $('#location-pg').text('IN ECHAGUE, ISABELA')
    	$('#advisory').html('<b>Water is sufficient to plant corn from May 18 to June 3.</b> But since rainfall is expected to be above the threshold during the expected harvest window (September 15 to October 1), <b>planting can start as early as May 3</b> (expected harvest date is on August 31). Land preparation can be carried out around April even when soil is not yet wet.<br><br>Watch out for infestation of weeds during the first 30 days from sowing.')
    	$('#advisories-list').append("<li style='margin-bottom:20px'>Water is sufficient to plant corn from May 18 to June 3. But since rainfall is expected to be above the threshold during the expected harvest window (September 15 to October 1), planting can start as early as May 3 (expected harvest date is on August 31). Besides, land preparation can be carried out around April even when soil is not yet wet.</li>");
    	$('#advisories-list').append("<li style='margin-bottom:20px'>Watch out for infestation of weeds during the first 30 days from sowing.</li>");
    	$('<div class="meteogram">').appendTo('#accumulated_graph').highcharts(Meteor.PlantingGuideGraph.constructChart('Corn'))
  		$('#text-advisory-cacao').hide()
  		$('#text-advisory-banana').hide()
  		$('#graph-advisory').show() 	
      $('#first-pg').text("PLANTING")
      $('#date-pg').text("BASED ON THE RAINFALL OUTLOOK FROM APRIL TO SEPTEMBER 2019 AS OF MARCH 2019")
      $("#project-pg").html("Source: <a href='/about-us/1.1' target='_blank' style='color:black'>Project 1.1</a>")
    }else if(crop == "Rice"){
    	$('#accumulated_graph .meteogram').remove()
    	$('#advisories-list li').remove()
    	$('#crop-pg').text('RICE')
      $('#location-pg').text('IN ECHAGUE, ISABELA')
    	$('#advisory').html('It is <b>not recommended to plant rainfed rice</b> on the supposed onset of rainy season (May to June) because rainfall is not sufficient during these months. Probable planting is on September 22.<br><br>Alternative crops to plant during the usual planting windows (i.e., May/June to July/August) are legumes such as mungbean.<br><br>Heads up for possible planting if there will be improvement in the next rainfall outlook.<br><br>Prepare seeds for chances of isolated rainfall. Planting by direct seeding may be pushed through if isolated rainfall lasts for at least a week but watch out for infestation of weeds. On the other hand, planting by transplanting may be challenging because more rainfall is required especially during land preparation a week before transplanting.');
    	$('<div class="meteogram">').appendTo('#accumulated_graph').highcharts(Meteor.PlantingGuideGraph.constructChart('Rice'))
    	$('#text-advisory-cacao').hide()
  		$('#text-advisory-banana').hide()
  		$('#graph-advisory').show()
      $('#first-pg').text("PLANTING")
      $('#date-pg').text("BASED ON THE RAINFALL OUTLOOK FROM APRIL TO SEPTEMBER 2019 AS OF MARCH 2019")
      $("#project-pg").html("Source: <a href='/about-us/1.1' target='_blank' style='color:black'>Project 1.1</a>")
    }else if(crop=="Cacao"){
    	$('#crop-pg').text('CACAO')
      $('#location-pg').text('IN ISABELA')
    	$('#text-advisory-cacao').show()
  		$('#text-advisory-banana').hide()
  		$('#graph-advisory').hide()
      $('#first-pg').text("CROP")
      $('#date-pg').text("BASED ON THE RAINFALL OUTLOOK FROM FEBRUARY TO JULY 2019 AS OF MARCH 2019")
      $("#project-pg").html("Source: <a href='/about-us/1.3' target='_blank' style='color:black'>Project 1.3</a>")
    }else if(crop=="Banana"){
    	$('#crop-pg').text('BANANA')
      $('#location-pg').text('')
    	$('#text-advisory-cacao').hide()
  		$('#text-advisory-banana').show()
  		$('#graph-advisory').hide()
      $('#first-pg').text("CROP")
      $('#date-pg').text("")
      $("#project-pg").html("Source: <a href='/about-us/1.4' target='_blank' style='color:black'>Project 1.4</a>")
    }
  }
})