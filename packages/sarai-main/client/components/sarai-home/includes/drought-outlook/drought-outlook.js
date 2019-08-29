Template.DroughtOutlook.onCreated(() => {
  Meteor.subscribe('provinces')
  Meteor.subscribe('weather-outlook')

  //default is Region IV-A: CALABARZON, Laguna
  Session.set('province', 'Laguna')
  Session.set('municipality', 'Los Baños')
})

Template.DroughtOutlook.onRendered(() => {
  const province = Session.get('province')
  $('#preview-select-province-drought').val(province)
  createDroughtTable();
})/** function end of onrendered **/

Template.DroughtOutlook.events({
  'change #preview-select-province-drought': (e) => {
    const province = e.currentTarget.value
    Session.set('province', province)
  }
})


Template.DroughtOutlook.helpers({
  months: () => {
      return getSixConsecMonths();
  },
  monthlyDrought: () => {

      const droughtOutlook = getDroughtData();

      const province = Session.get('province')
      const color_1 = '#FAFAFA'
      const color_2 = 'yellow'
      const color_3 = 'orange'
      const color_4 = 'red'

      var current_data;
      if(province == "Occidental Mindoro"){
        current_data = {name: province, data: droughtOutlook[56].data}
      }else if(province == "Oriental Mindoro"){
        current_data = {name: province, data: droughtOutlook[57].data}
      }else if(province == "Tawi-tawi"){
        current_data = {name: province, data: droughtOutlook[77].data}
      }else{
        for(var i = 0 ; i < droughtOutlook.length; i++){
          if(droughtOutlook[i].name == province){
            current_data = {name: droughtOutlook[i].name, data: droughtOutlook[i].data}
            break;
          }
        }
      }

      var current_month = 7; 
      var val;
      var text;
      var six_months = getSixConsecMonths();
      var color, fontcolor;
      var monthHeader = '2019';

      let outlook = []

      for(var i = 0 ; i < 6; i++){
        val = current_data.data[i].toFixed(2)
        if(val > -0.5){
          color = color_1;
          fontcolor = 'black';
          text = 'Normal';
        }else if(val <= -0.51 && val >= -1.00 ){
          color = color_2;
          fontcolor = 'black';
          text = 'Mild';
        }else if(val <= -1.01 && val >= -2.00){
          color = color_3;
          fontcolor = 'black';
          text = 'Moderate';
        }else if(val <= -2.01){
          color = color_4;
          fontcolor = 'white';
          text = 'Severe';
        }
        monthHeader = '2019';
        outlook.push({
          head: six_months[i] + ' ' + monthHeader,
          value: text,
          color: color,
          fontcolor: fontcolor,
          rawValue: val
        })
      }
      return outlook
      
  },

  provinces: () => {
    const provinces = Provinces.find({province: {$ne:'All'}}, {sort: {province: 1}}).fetch()

    return provinces
  },

  currentlySelectedProvince: (curr) => {
    const province = Session.get('province')
    $('#preview-select-province-drought').val(province)
  }
})

function createDroughtTable(){
  const droughtOutlook = getDroughtData();

	var dataset = [];
	var monthDataSet1 = [];
	var monthDataSet2 = [];
	var monthDataSet3 = [];
	var monthDataSet4 = [];
	var monthDataSet5 = [];
	var monthDataSet6 = [];
	var entry;
	var months = getSixConsecMonths();
	
  for(var i = 0 ; i < droughtOutlook.length; i++){

    monthDataSet1.push([droughtOutlook[i].name,droughtOutlook[i].data[0].toFixed(2)
  ]);
    monthDataSet2.push([droughtOutlook[i].name,droughtOutlook[i].data[1].toFixed(2)
  ]);
    monthDataSet3.push([droughtOutlook[i].name,droughtOutlook[i].data[2].toFixed(2)
  ]);
    monthDataSet4.push([droughtOutlook[i].name,droughtOutlook[i].data[3].toFixed(2)
  ]);
    monthDataSet5.push([droughtOutlook[i].name,droughtOutlook[i].data[4].toFixed(2)
  ]);
    monthDataSet6.push([droughtOutlook[i].name,droughtOutlook[i].data[5].toFixed(2)
  ]);
    
    if(droughtOutlook[i].name == "Oriental Mindoro"){
      droughtOutlook[i].name = "Mindoro Oriental"
    }
    else if(droughtOutlook[i].name == "Occidental Mindoro"){
      droughtOutlook[i].name = "Mindoro Occidental"
    }
    else if(droughtOutlook[i].name == "Tawi-tawi"){
      droughtOutlook[i].name = "Tawi-Tawi"
    }
    for(var j = 0; j < droughtOutlook[i].data.length; j++){
      if(droughtOutlook[i].data[j] >= -0.5){
          droughtOutlook[i].data[j] = '1-Normal';
        }else if(droughtOutlook[i].data[j] <= -0.51 && droughtOutlook[i].data[j] >= -1.00 ){
          droughtOutlook[i].data[j] = '2-Mild';
        }else if(droughtOutlook[i].data[j] <= -1.01 && droughtOutlook[i].data[j] >= -2.00){
          droughtOutlook[i].data[j] = '3-Moderate';
        }else if(droughtOutlook[i].data[j] <= -2.01){
          droughtOutlook[i].data[j] = '4-Severe';
        }
    }

    dataset.push([
      droughtOutlook[i].name,
      droughtOutlook[i].data[0],
      droughtOutlook[i].data[1],
      droughtOutlook[i].data[2],
      droughtOutlook[i].data[3],
      droughtOutlook[i].data[4],
      droughtOutlook[i].data[5]
    ])
	}
        $('#drought-datatable').DataTable( {
          data: dataset,
          columns: [
              { title: "Province" },
              { title: "June" },
              { title: "July" },
              { title: "August" },
              { title: "September" },
              { title: "October" },
              { title: "November" }
          ],
          lengthChange: true,
          lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, 'All'] ],
          rowCallback: function(row, data, index){
            for(var i = 1 ; i <= 6; i++){
              if(data[i] == "1-Normal"){
                $(row).find('td:eq('+i.toString()+')').css('background-color', '#FAFAFA');
                $(row).find('td:eq('+i.toString()+')').css('color', 'black');  
              }
              else if(data[i] == "2-Mild"){
                $(row).find('td:eq('+i.toString()+')').css('background-color', 'yellow');  
                $(row).find('td:eq('+i.toString()+')').css('color', 'black');
              }
              else if(data[i] == "3-Moderate"){
                $(row).find('td:eq('+i.toString()+')').css('background-color', 'orange');  
                $(row).find('td:eq('+i.toString()+')').css('color', 'black');
              }
              else if(data[i] == "4-Severe"){
                $(row).find('td:eq('+i.toString()+')').css('background-color', 'red');  
                $(row).find('td:eq('+i.toString()+')').css('color', 'white');
              }
            }
          }
        });

        $('<div class="meteogram">').appendTo('#drought-map1').highcharts('Map', Meteor.DroughtMapChart.constructChart(monthDataSet1, months[0] + ' 2019'));
        $('<div class="meteogram">').appendTo('#drought-map2').highcharts('Map', Meteor.DroughtMapChart.constructChart(monthDataSet2, months[1] + ' 2019'));
        $('<div class="meteogram">').appendTo('#drought-map3').highcharts('Map', Meteor.DroughtMapChart.constructChart(monthDataSet3, months[2] + ' 2019'));
        $('<div class="meteogram">').appendTo('#drought-map4').highcharts('Map', Meteor.DroughtMapChart.constructChart(monthDataSet4, months[3] + ' 2019'));
        $('<div class="meteogram">').appendTo('#drought-map5').highcharts('Map', Meteor.DroughtMapChart.constructChart(monthDataSet5, months[4] + ' 2019'));
        $('<div class="meteogram">').appendTo('#drought-map6').highcharts('Map', Meteor.DroughtMapChart.constructChart(monthDataSet6, months[5] + ' 2019'));
}

function getSixConsecMonths(){
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    var d = new Date()
    var current_month = 5;
    var six_months = [];
    for(var i = 0 ; i < 6 ; i++){
      six_months[i] = months[(i + current_month)%months.length];
    }
    return six_months;
}

function getDroughtData(){

return [
{name: 'Abra',data:[-1.401558789404717,0.189071742344534,0.592657880307510,-0.039226002940984,-0.455422276993700,-0.045902624854132]},
{name: 'Agusan del Norte',data:[-0.342158075695545,0.025335654413038,0.718039449539378,0.942279832907783,0.879692963273415,1.374590910703445]},
{name: 'Agusan del Sur',data:[0.567022455095012,0.241972468144324,0.998624081534782,1.316073393548915,0.875076411368316,1.017393024489092]},
{name: 'Aklan',data:[-0.379295237241691,-0.013722422658204,0.951439751703101,-0.011421526186306,-1.321048460350646,-0.112692499221433]},
{name: 'Albay',data:[0.257526674717338,0.071425845608659,1.310385147978887,0.758428466073353,-0.117674067338749,0.106730417207886]},
{name: 'Antique',data:[-2.038001335069329,-3.148608621303720,-1.721232622962483,-0.192920193466651,-0.096702018670430,0.276269948631279]},
{name: 'Apayao',data:[-1.701355549944684,-0.625592166790115,-0.139958019583261,-1.030653166313350,-1.131517479807821,-1.274409843268613]},
{name: 'Aurora',data:[0.100499468626596,-0.572651623812899,0.631191285685832,0.640742129557033,-0.529052579817428,-0.266409478982440]},
{name: 'Basilan',data:[-0.030177815831067,-1.054299423147253,-0.847272156591331,-0.143710179887284,0.777142486807589,-0.236530757627215]},
{name: 'Bataan',data:[-1.073273448971999,-0.113077639331874,-0.175318494315273,-1.579159045891185,-1.997117941173889,0.012047174450292]},
{name: 'Batanes',data:[0.417006645508316,0.845864365350269,0.425910764107870,0.007188894565808,0.167294853852128,0.022570663801231]},
{name: 'Batangas',data:[-1.423202545748001,-1.873106248613262,-0.933256932069701,-0.959124879544692,-2.172991764039506,-2.319904053176844]},
{name: 'Benguet',data:[-0.205460298004379,0.147390280996957,0.962889014568982,0.152393557829295,-1.590830913329454,-0.847716964722548]},
{name: 'Biliran',data:[-0.576352757302201,-0.240116025858208,-0.400444694304449,-0.326074222502056,0.611609517055537,1.646732803926381]},
{name: 'Bohol',data:[0.231020844604125,-0.355813704686274,-0.061934123614342,-0.398192021765808,-0.212621102022938,-0.065259866955819]},
{name: 'Bukidnon',data:[-0.961065837563273,-0.116283340322775,-0.154175441119469,-1.398487653996922,-1.447280705686893,-1.076102640279235]},
{name: 'Bulacan',data:[-1.082664657853696,2.115106246285421,1.451925525261336,0.584930226405375,-2.571487775123615,-0.019799452121242]},
{name: 'Cagayan',data:[-1.002586184658430,0.800459288599097,1.180048460393087,-0.954507769497356,-2.048606973163680,-1.873626264145769]},
{name: 'Camarines Norte',data:[0.871557679577508,0.575742508230540,0.953547264912633,0.480024663465866,-0.629472838777103,-0.252956595074493]},
{name: 'Camarines Sur',data:[-0.546695600747379,-1.053080421945618,-0.375294205554514,-0.015711536351580,-0.713179674088790,0.479800467927529]},
{name: 'Camiguin',data:[0.012574659363478,0.723361790654309,0.023068007187868,0.884410068108883,0.748474845866403,0.917154351449356]},
{name: 'Capiz',data:[-0.938454560877056,-0.822447977933483,-0.253917420481926,-0.102996164523381,-3.353134052387043,-1.440667545657065]},
{name: 'Catanduanes',data:[-0.075516642340357,-0.500474526586644,-0.236519927806859,-0.212399759985026,-1.163426651972077,-0.211450949974586]},
{name: 'Cavite',data:[-1.659997281567977,0.199875431108651,0.764541654616514,0.969731935084045,-1.021390092436589,-1.383682797673304]},
{name: 'Cebu',data:[-0.247018768363063,-1.105624374819035,-1.347723537275860,-0.561632587386423,-1.195200255154705,-1.055842404682777]},
{name: 'Compostela Valley',data:[-0.868785455874084,-0.472071185648811,-0.139705967050944,0.755728001163337,0.288367866455972,-0.129013986083245]},
{name: 'Davao del Norte',data:[-0.558147333159537,-0.413949688423279,-0.574876938217811,0.394965478540005,0.081414132001589,-0.221516347847491]},
{name: 'Davao del Sur',data:[-0.942954686901914,0.010659601365128,-0.353572855201170,0.333011120811158,-1.137357441796698,-0.096559486104986]},
{name: 'Davao Oriental',data:[0.177743930201482,0.148513162896605,0.772707624482034,1.276892250788714,0.990894822122463,0.010072849955808]},
{name: 'Dinagat Islands',data:[-0.370153946577994,-0.325412594937767,0.342952389419957,0.852462162809319,0.708815221021311,0.593357764686799]},
{name: 'Eastern Samar',data:[-0.348102441234052,-0.365650101403402,0.899857619761682,0.787221218405939,0.427559099115503,0.635090748481466]},
{name: 'Guimaras',data:[-1.102155429275385,-2.568216413403710,-1.282490082497455,-0.213256376808810,-0.700610440777724,-0.245740451017235]},
{name: 'Ifugao',data:[-0.639494998273678,0.653749011506239,0.219170663232378,-0.309479126420132,-0.617047442086575,-0.101841993700802]},
{name: 'Ilocos Norte',data:[-1.502346427512427,-0.043166060478145,0.437883683206719,0.111405679204916,-0.308378638317990,0.089961538560526]},
{name: 'Ilocos Sur',data:[-1.218231155849292,0.058325898335181,-0.391256751723709,-0.996704796071698,-0.920992822705298,-0.377174750419952]},
{name: 'Iloilo',data:[-1.256345855577023,-1.825649549595003,-1.244426505005372,-0.378524020205569,-1.532567625890745,-1.508196942326105]},
{name: 'Isabela',data:[-1.335275986122329,0.403113190425291,0.496708314088544,0.534414379661796,-1.165213222840239,-0.836221538232246]},
{name: 'Kalinga',data:[-1.289270224632106,0.226624462639060,0.166584805148991,-0.609933995970155,-0.536528606910274,-0.584476207586105]},
{name: 'La Union',data:[-1.642139798246669,0.136547896305350,-0.915605793729363,-2.414394881048621,-1.477743296970452,-0.257297751017545]},
{name: 'Laguna',data:[-0.041661237847551,0.575533165320800,0.739717567839782,0.854562583730866,0.332490445982709,0.643956412829007]},
{name: 'Lanao del Norte',data:[-0.071031589127280,1.607341005064546,1.391951801858411,0.740878351596898,0.593099677384762,1.618612507272318]},
{name: 'Lanao del Sur',data:[-0.603744853913202,-0.686260387917381,-0.149075822702869,-0.615703470835575,-0.841356367907744,-0.608403074809286]},
{name: 'Leyte',data:[-0.341134807987186,-0.189884358681399,-0.085414277956773,-0.096715618151285,0.425626210813413,0.773697140353217]},
{name: 'Maguindanao',data:[-0.186030692514870,-0.155598046110235,-0.702516544529796,-1.422956505480197,-2.184162301854248,-2.360969864013722]},
{name: 'Marinduque',data:[-1.618718618949130,-0.011247078962602,-0.401715459929789,0.166576525673231,-1.387670941535622,-2.077840853907815]},
{name: 'Masbate',data:[-0.538489311363952,-0.788156824951040,-1.131444107240667,-0.760167276371305,-4.368588638282076,-2.825190690481775]},
{name: 'Metropolitan Manila',data:[-0.179283215383349,-0.062666016480414,-0.175962975939235,0.280274610553417,-0.487255062899525,-0.399046683707421]},
{name: 'Misamis Occidental',data:[-0.396374994694108,0.276048569483395,0.596342351771904,0.869963345106018,1.032200175875855,0.499307977012371]},
{name: 'Misamis Oriental',data:[-0.509485475939954,-0.339879481632462,0.184966124413664,-0.452897834684149,-1.188616555233501,-1.677033265769379]},
{name: 'Mountain Province',data:[-1.519725515853348,-0.076674084350952,-0.209695159110716,-0.393721233096765,-1.203933786409729,-1.182189796013887]},
{name: 'Negros Occidental',data:[-1.645088489748570,-3.133813042463197,-2.645923418430599,-1.200256340200812,-2.032958074445703,-1.070212935438669]},
{name: 'Negros Oriental',data:[-0.511993388927386,-0.648904537335358,0.016483498433384,-0.074304675680380,-0.479943673046319,-0.694591579764366]},
{name: 'North Cotabato',data:[-0.992668916023748,-0.703880417089597,-0.636629010693703,-1.366209872699548,-2.733083788296904,-1.496690234117864]},
{name: 'Northern Samar',data:[-0.624274238737404,0.002948109706744,-0.056639377485697,0.185332260408800,-0.257070094873287,0.038058662976180]},
{name: 'Nueva Ecija',data:[-1.970718211302282,2.682016813422049,1.294003307231087,0.028905341886628,-2.245501606248063,-0.408373084661963]},
{name: 'Nueva Vizcaya',data:[-0.213076417249232,-0.056656863989512,0.620796054038484,0.146984198178420,-1.356724828471797,-0.810284665332361]},
{name: 'Occidental Mindoro',data:[-2.510125000526834,-1.537971162484345,-2.044645420281382,-2.654160519115424,-2.903187049570770,-0.201255728003220]},
{name: 'Oriental Mindoro',data:[0.214833534628346,-0.654736027521866,-1.189284208881658,-2.077188076224122,-2.910590980360547,-2.093585902041251]},
{name: 'Palawan',data:[-1.956872051594928,-2.484871628756632,-2.419676580346922,-1.417059918805872,-3.284685907632568,-3.829837674691342]},
{name: 'Pampanga',data:[-0.899099842847645,1.151332313603933,-0.155223745066290,-1.097097566300192,-1.180819881356746,0.871652172220150]},
{name: 'Pangasinan',data:[-1.025425783721120,0.505053961962245,-0.986179898000832,-2.434344709367919,-1.045998286243218,0.242339210604482]},
{name: 'Quezon',data:[-0.241175198457354,-0.102037009697437,0.869888252625053,0.123606837997117,-0.720394025579221,0.030243243926994]},
{name: 'Quirino',data:[-0.149652664593131,0.286599723790603,0.540691501735520,0.573074450640277,-0.341976257563107,-0.028028113042203]},
{name: 'Rizal',data:[0.159819060184180,1.034283074400239,1.136197986415317,2.015718186324003,-0.531615034068909,-1.070458750887307]},
{name: 'Romblon',data:[-0.039816479409136,0.473036978600196,0.951233752661147,0.593846506040531,-1.182972812135155,-0.769517760865988]},
{name: 'Samar',data:[0.300238432177683,0.387544383562360,1.098841794866217,1.133228184744424,0.115910574129930,0.224744171331572]},
{name: 'Sarangani',data:[-0.093350079524228,0.051063041241162,-0.564144194923613,-0.484042911759288,-1.677621826113418,-1.386555200974495]},
{name: 'Shariff Kabunsuan',data:[-0.698260771310365,-1.551529555099259,-0.587284188192990,-1.240231818112753,-1.461041377357257,-1.813009585703541]},
{name: 'Siquijor',data:[-0.584408156017940,-1.514522935515672,-0.395785011889894,0.341761468279047,-0.090644447113999,-0.203050131902705]},
{name: 'Sorsogon',data:[-0.001513792900579,-0.314123663791633,-0.457046668984454,0.473954840160301,-0.564857579581132,-0.969964896834148]},
{name: 'South Cotabato',data:[-1.019876606437708,-1.231011726547929,-0.934719110919372,-0.735807541474778,-1.572332337537193,-2.195959297072647]},
{name: 'Southern Leyte',data:[0.444532292275766,0.636729189396352,2.130249166020378,1.816067091472550,2.676344860503953,3.407952039180840]},
{name: 'Sultan Kudarat',data:[-0.474898755428571,-1.006443354828950,-0.711255691712108,0.468421073979655,-0.186207493727940,-0.430985169670436]},
{name: 'Sulu',data:[0.212489420749218,-0.242431929424303,0.641392298575567,0.746312575070883,0.658696254922521,0.311616948658942]},
{name: 'Surigao del Norte',data:[-0.627029266942898,-0.118193244750731,0.730267966932629,1.010983925434731,0.510587593822721,-0.092101962275186]},
{name: 'Surigao del Sur',data:[0.427160416504219,0.353976665888786,0.883277233135381,0.984470749861446,0.227249977071111,0.172088938540943]},
{name: 'Tarlac',data:[-0.648866246826041,1.052547933120867,-0.622943316119143,-2.510404977591296,-2.117381336434794,0.006804500707626]},
{name: 'Tawi-Tawi',data:[-1.234837346699615,-0.334682276265813,-0.433502045814124,-0.058066608088132,-1.571713826247376,-0.977326279359130]},
{name: 'Zambales',data:[-0.809524037049361,0.051332059706234,-0.124015366912901,-0.155694216975999,-0.703325199452234,-0.179721428204061]},
{name: 'Zamboanga del Norte',data:[-1.279475535205789,-1.343748288222864,-0.085025539879649,-0.226466257469598,-0.915088408330005,-1.424486729721988]},
{name: 'Zamboanga del Sur',data:[0.019302532071130,0.317227904637241,0.386345081234265,0.118937122952803,-0.652794875295189,-0.900046620563839]},
{name: 'Zamboanga Sibugay',data:[0.834240658711659,0.886422673649105,0.398455327245266,0.480008333988078,0.687325724272078,0.735933634167373]}
]
}