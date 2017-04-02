var long_curr = -97.13;
var lat_curr = 32.75;
var long_b_b,long_b_f,lat_b_b,lat_b_f,ylat,ylng,map,myLatlng1;
var labels = ["1","2","3","4","5","6","7","8","9","10"];
var labelIndex,marker;
var gmarkers = [];


function initialize () {
	
}

function initMap() {
  var myLatLng = {lat: lat_curr, lng:  long_curr};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: myLatLng
  });

var marker = new google.maps.Marker({
    position: myLatLng,
	map: map,
    title:"Hello World!"
}); 
gmarkers.push(marker);

 google.maps.event.addListener(map, "bounds_changed", function() {
   // send the new bounds back to your server
  long_b_b = map.getBounds().b.b;
  long_b_f = map.getBounds().b.f;
  lat_f_b = map.getBounds().f.b;
  lat_f_f = map.getBounds().f.f;
});
}

function marker( ylat, ylng)
{
	var myLatLng = {lat: ylat, lng:  ylng};
	var marker = new google.maps.Marker({
    position: myLatLng,
	label: labels[labelIndex++ % labels.length],
    map: map
  });
  gmarkers.push(marker);

}

function removeMarkers(){
    for(i=0; i<gmarkers.length; i++){
        gmarkers[i].setMap(null);
    }
}

function sendRequest () {
   var count,x,y;
   var xhr = new XMLHttpRequest();
   labelIndex = 0;
   removeMarkers();
   var query = encodeURI(document.getElementById("search").value);
   xhr.open("GET", "proxy.php?term="+ query +"&bounds="+ lat_f_b + "," + long_b_b + "|" + lat_f_f + "," + long_b_f + "&limit=10");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          var len = json.businesses.length;
		  document.getElementById("output").innerHTML="";
          var output = document.getElementById("output").innerHTML;
		  
		  for(count = 0 ; count < len ; count ++)
		  {
			  
			  var text = JSON.stringify(json.businesses[count].snippet_text);
		      var image = JSON.stringify(json.businesses[count].image_url);
		      var str1 = " <img src= "+image+"  height='60px' width='60px'>";
		      var image1 = JSON.stringify(json.businesses[count].rating_img_url);
		      var str2 = " <img src= "+image1+"  height='16px' width='80px'>";
			  var Restaurant = json.businesses[count].name;
			  var lnk1 = JSON.stringify(json.businesses[count].url);;
              console.log(lnk1);
			  

			  x = json.businesses[count].location.coordinate.latitude;
			  y = json.businesses[count].location.coordinate.longitude;
			  marker(x,y);
			  
			  //document.getElementById("output").innerHTML = "<pre>" + str + "</pre>";
			  var rname = " <li><a href="+ lnk1 +">" + Restaurant + "</a></li>" ;
			  document.getElementById("output").innerHTML = output + "<br>" + str1 + str2 + "<br>" +  rname + "<br>" + text + "<br><br>";
			  output = document.getElementById("output").innerHTML;
			  
		  }
          console.log(json);
          
       }
   };
   xhr.send(null);
}
