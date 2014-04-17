$(function(){

// sample as bellow
// http://lopan.jp/google-maps-api/

var init = function(){
	manageLoading.show();
	var MG = new manageGmaps();
	MG.init();
	$('#searchForm').on('submit', function(event) {
		event.preventDefault();
		MG.set();
	});
}

var manageGmaps = function(){
	// setting
	this.mapName     = '#map_canvas';
	this.image       = 'img/alert.png';
	this.forecastAPI = 'http://www16095ui.sakura.ne.jp/landslideAPI/server-side/getForecast.php';
	this.defaultLoc  = 'boston';
	this.initZoom    = 10;
	this.daySpan     = 1;

	// don't touch

	// for flat design
	this.styleOptions = [{'stylers':[{'visibility':'off'}]},{'featureType':'road','stylers':[{'visibility':'on'},{'color':'#ffffff'}]},{'featureType':'road.arterial','stylers':[{'visibility':'on'},{'color':'#fee379'}]},{'featureType':'road.highway','stylers':[{'visibility':'on'},{'color':'#fee379'}]},{'featureType':'landscape','stylers':[{'visibility':'on'},{'color':'#f3f4f4'}]},{'featureType':'water','stylers':[{'visibility':'on'},{'color':'#7fc8ed'}]},{'featureType':'road','elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'poi.park','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'color':'#83cead'}]},{'featureType':'poi.business','elementType':'geometry','stylers':[{'visibility':'on'}]},{'elementType':'labels','stylers':[{'visibility':'off'}]},{'featureType':'transit.line','elementType':'geometry.fill','stylers':[{'visibility':'on'},{'hue':'#e3b552'}]},{'featureType':'transit.line','elementType':'geometry.stroke','stylers':[{'visibility':'on'},{'weight':1.2},{'color':'#9660ac'},{'lightness':25}]},{'featureType':'landscape.man_made','elementType':'geometry','stylers':[{'weight':0.9},{'visibility':'off'}]}];
}
manageGmaps.prototype = {
	init : function(){
		var self = this;
		self.changeSpan();
		$('#prevBtn').on('click', function(event) {
			event.preventDefault();
			self.panTo(-1);
		});
		$('#nextBtn').on('click', function(event) {
			event.preventDefault();
			self.panTo(1);
		});
		self.set();
	},
	set : function(){
		// showLoading
		manageLoading.show();

		var self = this;
		this.lopanMarker = [];
		this.infowindow = [];
		this.nowCurrent = 0;
		this.currentInfoWindow = null;
		this.lopanLength = 1;
		this.map = null;

		var key = $('#mapLocation').val() ? $('#mapLocation').val() : this.defaultLoc ;
		var JSONuri = this.forecastAPI+'?timeRange='+this.daySpan+'&keyword='+key;

		console.log(JSONuri);

		$.when(
			$.ajax(JSONuri)
		// ).then(function(JSONdata){}
		).done(function(JSONdata){
			console.log('JSON load success!!');
			console.log(JSON.parse(JSONdata));
			JSONdata = JSON.parse(JSONdata);
			
			self.json = JSONdata;
			console.dir(self.json['results']);
			console.log(self.json['results'][0]);
			var firstForecastEl = self.json['results'][0];
			var lat = firstForecastEl['lat'];
			var lng = firstForecastEl['lng'];
			self.start(lat,lng);
		}).fail(function(JSONdata){
			console.log('JSON load failed!!');
		});
	},
	start : function(lat,lng){
		var self = this;
		var latlng = new google.maps.LatLng(lat,lng);
		var myOptions = {
			zoom: self.initZoom,
			center: latlng,
			mapTypeControlOptions: { mapTypeIds: ['flat', google.maps.MapTypeId.ROADMAP] },
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		self.map = new google.maps.Map(
			$(self.mapName)[0],
			myOptions
		);
		var styledMapOptions = { name: 'Flat' }
		var flatType = new google.maps.StyledMapType(self.styleOptions, styledMapOptions);
		self.map.mapTypes.set('flat', flatType);
		self.map.setMapTypeId('flat');
		self.setIcon();
	},
	setIcon : function(){
		var self = this;
		$(self.json['results']).each(function(i, el) {
			// console.log(i);
			var 
			target = $(this)[0],
			lat = target['lat'],
			lng = target['lng'],
			ttl = target['place'],
			cond = target['condition'],
			country = target['country'],
			cause = target['cause'],
			latlng = new google.maps.LatLng(lat,lng),
			content = '<div class="infoWindow">' +
				'<h1>'+ttl+'</h1>' +
				'<dl>' +
				'<dt>country</dt><dd>'+country+'</dd>' +
				'<dt>condition</dt><dd>'+cond+'</dd>' +
				'<dt>cause</dt><dd>'+cause+'</dd>' +
				'</dl>' +
				'</div>';

			self.infowindow[i] = new google.maps.InfoWindow({
				content: content
			});
			 
			self.lopanMarker[i] = new google.maps.Marker({
				position: latlng,
				map: self.map,
				icon: self.image,
				title: '[' + country + '] ' + ttl
			});
			
			google.maps.event.addListener(self.lopanMarker[i], 'click', function() {
				if (self.currentInfoWindow) {
					self.currentInfoWindow.close();
				}
				self.infowindow[i].open(self.map, self.lopanMarker[i]);
				self.currentInfoWindow = self.infowindow[i];
				self.setCurrent(i);
			});
			self.lopanLength = i;
		});
		self.infowindow[0].open(self.map, self.lopanMarker[0]);
		self.currentInfoWindow = self.infowindow[0];
		self.setCurrent(0);
		$('#maxNum').text(self.lopanLength+1);
		manageLoading.hide();
	},
	panTo : function(val){
		var self = this;
		var tmp = self.lopanLength+1;
		var adjustNum = (self.nowCurrent+val+tmp)%tmp;
		var target = self.json['results'][adjustNum];
		var latlng = new google.maps.LatLng(target['lat'],target['lng']);
		this.map.panTo(latlng);
		// console.log(self.nowCurrent);
		// console.log(tmp);
		if (self.currentInfoWindow) {
			self.currentInfoWindow.close();
		}
		self.infowindow[adjustNum].open(self.map, self.lopanMarker[adjustNum]);
		self.currentInfoWindow = self.infowindow[adjustNum];
		self.setCurrent(adjustNum);
	},
	setCurrent : function(num){
		var self = this;
		$('#nowNum').text(num+1);
		self.nowCurrent = num;
	},
	changeSpan : function(){
		var self = this;
		var target = $('.daySpan');
		$('.dropdown-menu li').on('click', 'a', function(event) {
			event.preventDefault();
			var txt = $(this).text();
			var num = $(this).attr('href');
			self.daySpan = num;
			target.text(txt);
			self.set();
			// self.set('hoge.php?day='+num);
		});
	}
}

var manageLoading = {
	show : function(){
		$('#loadingArea').show();
	},
	hide : function(){
		setTimeout(function(){
			$('#loadingArea').fadeOut();
		},500);
	}
}

init();

});