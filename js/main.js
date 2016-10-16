var meta = {};

meta.map = {};

meta.obstacles_list = {
  'TOGGLE': {'icon': 'default.png', 'desc': 'Toggle Obstacles'},
  'AG EQUIP': {'icon': 'tractor.png', 'desc': 'Agricultural Equipment'},
  'ARCH': {'icon': 'arch.png', 'desc': 'Arch'},
  'BALLOON': {'icon': 'balloon.png', 'desc': 'Baloon - Tethered; weather; other reconnaissance'},
  'BLDG': {'icon': 'building.png', 'desc': 'Building'},
  'BLDG-TWR': {'icon': 'building-twr.png', 'desc': 'Building Tower - Latticework greater than 20 feet on building'},
  'BRIDGE': {'icon': 'bridge.png', 'desc': 'Bridge'},
  'CATENARY': {'icon': 'catenary.png', 'desc': 'Catenary - Transmission line span/wire/cable'},
  'COOL TWR': {'icon': 'cooling-twr.png', 'desc': 'Nuclear Cooling Tower'},
  'CRANE': {'icon': 'crane.png', 'desc': 'Crane, Permanent'},
  'CRANE T': {'icon': 'crane-temp.png', 'desc': 'Crane, Temporary'},
  'CTRL TWR': {'icon': 'air-twr.png', 'desc': 'Airport Control Tower'},
  'DAM': {'icon': 'dam.png', 'desc': 'Dam'},
  'DOME': {'icon': 'dome.png', 'desc': 'Dome'},
  'ELEC SYS': {'icon': 'electrical.png', 'desc': 'Electrical System'},
  'ELEVATOR': {'icon': 'grain.png', 'desc': 'Elevator - Silo; grain elevator'},
  'FENCE': {'icon': 'fence.png', 'desc': 'Fence'},
  'GEN UTIL': {'icon': 'utility.png', 'desc': 'General Utility'},
  'LIGHTHOUSE': {'icon': 'lighthouse.png', 'desc': 'Lighthouse'},
  'MONUMENT': {'icon': 'monument.png', 'desc': 'Monument'},
  'NAVAID': {'icon': 'navaid.png', 'desc': 'Airport Navigational Aid'},
  'PLANT': {'icon': 'plant.png', 'desc': 'Plant - Multiple close structures used for industrial purposes'},
  'POLE': {'icon': 'pole.png', 'desc': 'Pole - Flag pole; light pole'},
  'REFINERY': {'icon': 'refinery.png', 'desc': 'Refinery - Multiple close structures used for purifying crude materials'},
  'RIG': {'icon': 'rig.png', 'desc': 'Oil Rig'},
  'SIGN': {'icon': 'sign.png', 'desc': 'Sign'},
  'SPIRE': {'icon': 'spire.png', 'desc': 'Steeple'},
  'STACK': {'icon': 'stack.png', 'desc': 'Stack - Smoke/industrial'},
  'STADIUM': {'icon': 'stadium.png', 'desc': 'Stadium'},
  'T-L TWR': {'icon': 'transmission-line.png', 'desc': 'T-L Tower - Transmission line tower; telephone pole'},
  'TANK': {'icon': 'tank.png', 'desc': 'Tank - Water; fuel'},
  'TOWER': {'icon': 'tower.png', 'desc': 'Tower'},
  'TRAMWAY': {'icon': 'tramway.png', 'desc': 'Tramway'},
  'TREE': {'icon': 'tree.png', 'desc': 'Tree'},
  'VEGETATION': {'icon': 'vegetation.png', 'desc': 'Vegetation'},
  'WINDMILL': {'icon': 'windmill.png', 'desc': 'Wind Turbine'}
};

meta.obstacles_icon_path = 'icons/markers/';

meta.obstacles_lighting_list = {
  "R": "Red",
  "D": "Medium Intensity White Strobe & Red",
  "H": "High Intensity White Strobe & Red",
  "M": "Medium Intensity White Strobe",
  "S": "High Intensity White Strobe",
  "F": "Flood",
  "C": "Dual Medium Catenary",
  "W": "Synchronized Red Lighting",
  "L": "Lighted (Type Unknown)",
  "N": "None",
  "U": "Unknown"
};

meta.obstacles_marking_list = {
  "P": "Orange or Orange and White Paint",                 
  "W": "White Paint Only",
  "M": "Marked",
  "F": "Flag Marker",
  "S": "Spherical Marker",
  "N": "None",
  "U": "Unknown"
};

// Initiatilize Map
function initMap(geoip){

  meta.map = L.map('map');

  meta.map.attributionControl.setPosition('bottomleft');

  var layer = L.esri.basemapLayer('Gray').addTo(meta.map);

  createMarkerLayers();

}

function createMarkerLayers(){
  
  meta.marker_types = {};
  
  $.each(_.keys(meta.obstacles_list), function(idx,type){
    meta.marker_types[type] = [];
  });
  
}

// Initialize Obstacle Markers
function initMarkers(){

  var geoip;

  $.getJSON('https://freegeoip.net/json/')
    .done(function(data){
      var geoip = {
        'lat': data['latitude'],
        'lng': data['longitude']
      };
      meta.map.setView([geoip['lat'], geoip['lng']], 13);
      addAllObstacleMarkers();
    })
    .fail(function() {
      // Initialize map to Skyward IO address
      meta.map.setView([45.5204027, -122.6714065], 13);
      addAllObstacleMarkers()
    })  
}

function addAllObstacleMarkers(){
  
  meta.layer_types = {};

  $.each(obstacles, function(idx, obstacle){
    var marker = addObstacleMarker(obstacle);
    meta.marker_types[obstacle['type']].push(marker)
  })

  $.each(_.keys(meta.obstacles_list), function(idx,type){
    meta.layer_types[type] = L.layerGroup(meta.marker_types[type]);
    meta.map.addLayer(meta.layer_types[type]);
  })

  //var layer_obstacles = L.layerGroup(markers);
  //map.addLayer(layer_obstacles);

}

// Add Obstacle Marker
function addObstacleMarker(obstacle){

  type_icon = meta.obstacles_list[obstacle['type'].toUpperCase()]['icon'];

  if(type_icon === undefined){
    var iconUrl = meta.obstacles_icon_path + 'default.png';
  }else{
    var iconUrl = meta.obstacles_icon_path + type_icon;
  }

  var obstacleIcon = L.icon({
    iconUrl:      iconUrl,
    iconSize:     [32, 32],
    iconAnchor:   [0, 0],
    popupAnchor:  [16, 0]
  });

  // OE DATA
  // If OE Data is empty, set to 'Unavailable'...

  var str_unavailable = 'Unavailable';

  if('id' in obstacle['oe_case']){
    oe_case_id = obstacle['oe_case']['id'];
    oe_case_url = 'https://oeaaa.faa.gov/oeaaa/external/searchAction.jsp?action=displayOECase&oeCaseID=' + oe_case_id;
    oe_case_anchor = '<a href="' + oe_case_url + '" target="_blank">' + oe_case_id + '</a>';
    oe_date_completed = obstacle['oe_case']['dateCompleted'];
    oe_structure_type = obstacle['oe_case']['structureType'];
  }else{
    oe_case_url = '#';
    oe_case_id = str_unavailable;
    oe_case_anchor = oe_case_id;
    oe_date_completed = str_unavailable;
    oe_structure_type = str_unavailable;
  }

  faa_no = obstacle['faa_no']
  faa_no_formatted = obstacle['faa_no_formatted']
  if(obstacle['faa_no'] == ''){
    faa_no = str_unavailable;
    faa_no_formatted = str_unavailable;
  }

  agl_ht = parseInt(obstacle['agl_ht'],10)
  
  popup_html = '<div class="tooltip">' +
    '<b>FAA Obstacle</b><br/>' +

    '<ul>' +
    '<li>Type: ' + obstacle['type'] + '</li>' +
    '<li>Height AGL: ' + agl_ht + ' ft' +
    '<li>Lat/Lng: ' + parseFloat(obstacle['latitude']).toFixed(4) + ', ' + parseFloat(obstacle['longitude']).toFixed(4) + '</li>' +
    '<li>Marking: ' + meta.obstacles_marking_list[obstacle['marking']] + '</li>' +
    '<li>Lighting: ' + meta.obstacles_lighting_list[obstacle['lighting']] + '</li>' +
    '</br>' +
    '<li>Obstacle Number: ' + obstacle['obstacle_no'] + '</li>' +
    '<li>FAA Number: ' + faa_no + '</li>' +
    '<li>FAA Number (Formatted): </br>' + faa_no_formatted + '</li>' +
    '<li>OE Case ID (Link): ' + oe_case_anchor + '</li>' + 
    '<li>OE Date Completed: </br>' + oe_date_completed + '</li>' + 
    '<li>OE Structure Type: ' + oe_structure_type + '</li>' + 
    
    '</ul>' +
    '</div>'


  var marker = L.marker(
    [Number(obstacle['latitude']), Number(obstacle['longitude'])], 
    {icon: obstacleIcon}
  ).bindPopup(popup_html);

  return marker;

}

function createLegend(){
  $legend = $('.legend-content');
  $.each(_.keys(meta.obstacles_list), function(idx,key){
    legend_icon = '<li><img title="' + meta.obstacles_list[key]['desc'] + '" name="' + key + '" src="' + meta.obstacles_icon_path + meta.obstacles_list[key]['icon'] + '" class="icon-highlight"></li>';
    $legend.append(legend_icon);
  })
}

function openModal(){
  $('#basic-modal-content').modal();
}

function initControls(){

  $("#slide-sidebar").click(function (event) {
    $i = $('label>.fa');
    if($i.hasClass('fa-chevron-left')){
      $i.removeClass('fa-chevron-left').addClass('fa-chevron-right');
    }else if($i.hasClass('fa-chevron-right')){                     
      $i.removeClass('fa-chevron-right').addClass('fa-chevron-left');  
    }
  })

  $(".legend-content>li>img").on('click',function (event) {

    $(this).toggleClass('icon-unselected');

    var type = $(this).attr('name');
    console.log(type)

    if(type != 'TOGGLE'){

      var layer = meta.layer_types[type];

      if(meta.map.hasLayer(layer)){
        meta.map.removeLayer(layer);
      }else{
        meta.map.addLayer(layer);
      }

    }else{

      var isSelected = !$(this).hasClass('icon-unselected');
      console.log(isSelected)

      if(isSelected){

        $('.legend-content>li:nth-child(n+2)>img').removeClass('icon-unselected'); 

        $.each(_.keys(meta.obstacles_list), function(idx, obstacle_type){
          if(obstacle_type != 'TOGGLE'){
            var layer = meta.layer_types[obstacle_type];
            if(!meta.map.hasLayer(layer)){
              meta.map.addLayer(layer);
            }
          }
        })
      }else{

        $('.legend-content>li:nth-child(n+2)>img').addClass('icon-unselected'); 

        $.each(_.keys(meta.obstacles_list), function(idx, obstacle_type){
          if(obstacle_type != 'TOGGLE'){
            var layer = meta.layer_types[obstacle_type];
            if(meta.map.hasLayer(layer)){
              meta.map.removeLayer(layer);
            }
          }
        })
      }

    }

  })

}
