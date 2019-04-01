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
    	$('#advisory').html('<b>Water is sufficient to plant corn from May 18 to June 3.</b> But since rainfall is expected to be above the threshold during the expected harvest window (September 15 to October 1), <b>planting can start as early as May 3</b> (expected harvest date is on August 31). Besides, land preparation can be carried out around April even when soil is not yet wet.')
    	$('#advisories-list').append("<li style='margin-bottom:20px'>Water is sufficient to plant corn from May 18 to June 3. But since rainfall is expected to be above the threshold during the expected harvest window (September 15 to October 1), planting can start as early as May 3 (expected harvest date is on August 31). Besides, land preparation can be carried out around April even when soil is not yet wet.</li>");
    	$('#advisories-list').append("<li style='margin-bottom:20px'>Watch out for infestation of weeds during the first 30 days from sowing.</li>");
    	$('<div class="meteogram">').appendTo('#accumulated_graph').highcharts(Meteor.PlantingGuideGraph.constructChart('Corn'))
  		$('#text-advisory-cacao').hide()
  		$('#text-advisory-banana').hide()
  		$('#graph-advisory').show() 	
    }else if(crop == "Rice"){
    	$('#accumulated_graph .meteogram').remove()
    	$('#advisories-list li').remove()
    	$('#crop-pg').text('RICE')
      $('#location-pg').text('IN ECHAGUE, ISABELA')
    	$('#advisory').html('It is <b>not recommended to plant rainfed rice</b> on the supposed onset of rainy season (May to June) because rainfall is not sufficient during these months. Probable planting is on September 22.');
    	$('#advisories-list').append("<li style='margin-bottom:20px'>It is not recommended to plant rainfed rice on the supposed onset of rainy season (May to June) because rainfall is not sufficient during these months. Probable planting is on September 22.</li>");
    	$('#advisories-list').append("<li style='margin-bottom:20px'>Alternative crops to plant during the usual planting windows (i.e., May/June to July/August) are legumes such as mungbean.</li>");
    	$('#advisories-list').append("<li style='margin-bottom:20px'>Heads up for possible planting if there will be improvement in the next rainfall outlook.</li>");
    	$('#advisories-list').append("<li style='margin-bottom:20px'>Prepare seeds for chances of isolated rainfall. Planting by direct seeding may be pushed through if isolated rainfall lasts for at least a week but watch out for infestation of weeds. On the other hand, planting by transplanting may be challenging because more rainfall is required especially during land preparation a week before transplanting.</li>");
    	$('<div class="meteogram">').appendTo('#accumulated_graph').highcharts(Meteor.PlantingGuideGraph.constructChart('Rice'))
    	$('#text-advisory-cacao').hide()
  		$('#text-advisory-banana').hide()
  		$('#graph-advisory').show()
    }else if(crop=="Cacao"){
    	$('#crop-pg').text('CACAO')
      $('#location-pg').text('IN ISABELA')
    	$('#text-advisory-cacao').show()
  		$('#text-advisory-banana').hide()
  		$('#graph-advisory').hide()
    }else if(crop=="Banana"){
    	$('#crop-pg').text('BANANA')
      $('#location-pg').text('')
    	$('#text-advisory-cacao').hide()
  		$('#text-advisory-banana').show()
  		$('#graph-advisory').hide()
    }
  }
})