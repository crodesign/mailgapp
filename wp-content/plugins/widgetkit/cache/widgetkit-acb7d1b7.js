jQuery(function(a){a('select[name="settings[style]"]').bind("change",function(){a("#form").trigger("submit")});a("button.action.add").bind("click",function(){a.post(widgetkitajax+"&task=item_map",{id:a('input[name="id"]').val()},function(b){a(b).appendTo("#items");a("#order").trigger("update")})});0==a('input[name="id"]').val()&&a("button.action.add").trigger("click");a("#items").delegate(".box","delete",function(){a(this).fadeOut(300,function(){a(this).remove();a("#order").trigger("update")})});a("#items").delegate("input.title","update",function(){var b=a(this).closest(".item"),c=a(this).val()?a(this).val():"untitled",e=b.find("h3.title");b.is(".item:first-child")?e.html(c+'<span class="info">center</span>'):e.html(c);a('#order li[rel="'+b.attr("id")+'"]').html(c)});a("#order").sortable({axis:"y",start:function(b,c){a("#"+c.item.attr("rel")).addClass("sortactive")},stop:function(b,c){setTimeout(function(){a("#"+c.item.attr("rel")).removeClass("sortactive")},800)},update:function(b,c){var e=a("#"+c.item.attr("rel")),d=c.item.next(),f=c.item.prev();e.find(".html-editor").trigger("editor-action-start");d.length?e.insertBefore(a("#"+d.attr("rel"))):e.insertAfter(a("#"+f.attr("rel")));e.find(".html-editor").trigger("editor-action-stop");a("#order").trigger("update")}}).bind("update",function(){var b=a(this);a("li",this).each(function(){a("#"+a(this).attr("rel")).length||a(this).remove()});a("#items > .item").each(function(){var c=a(this).attr("id");b.find("[rel='"+c+"']").length||b.append('<li rel="'+
c+'"></li>');a("input.title",this).trigger("update")})}).trigger("update");var h=a("#addresslocator"),k=h.find("input.address"),d=h.find("input.lat"),f=h.find("input.lng"),g=h.find("div.map"),j=new google.maps.Map(g.get(0),{zoom:4,streetViewControl:!1,center:new google.maps.LatLng(-34.397,150.644),mapTypeId:google.maps.MapTypeId.ROADMAP});""!=d.val()&&""!=f.val()?g=new google.maps.LatLng(d.val(),f.val()):(g=new google.maps.LatLng(51.151786,10.415039),d.val(51.151786),f.val(10.415039));j.setCenter(g);var i=new google.maps.Marker({position:g,draggable:!0,map:j});google.maps.event.addListener(i,"dragend",function(){d.val(i.position.lat());f.val(i.position.lng())});a("#items").delegate(".loc-data","click",function(){var b=a(this),c=b.find("span:first"),e=b.find('input[name$="[lat]"]'),g=b.find('input[name$="[lng]"]');k.autocomplete({delay:500,minLength:3,source:function(b,c){a.getJSON(widgetkitajax+"&task=locate_map",{address:k.val()},function(b){c(a.map(b.results,function(a){return{label:a.formatted_address,value:a.formatted_address,lat:a.geometry.location.lat,lng:a.geometry.location.lng}}))})},select:function(a,b){d.val(b.item.lat);f.val(b.item.lng);var c=new google.maps.LatLng(d.val(),f.val());i.setPosition(c);j.setCenter(c)}});k.val("");d.val(e.val());f.val(g.val());b=new google.maps.LatLng(e.val(),g.val());i.setPosition(b);j.setCenter(b);h.find("button").unbind("click").bind("click",function(){e.val(d.val());g.val(f.val());c.html("(Lat: "+d.val()+", Lng: "+f.val()+")");a.modalwin.close()});a.modalwin(h)})});
(function(f){function b(a,d,c){this.extend(b,google.maps.OverlayView);this.map_=a;this.markers_=[];this.clusters_=[];this.sizes=[53,56,66,78,90];this.styles_=[];this.ready_=!1;c=c||{};this.gridSize_=c.gridSize||60;this.minClusterSize_=c.minimumClusterSize||2;this.maxZoom_=c.maxZoom||null;this.styles_=c.styles||[];this.imagePath_=c.imagePath||this.MARKER_CLUSTER_IMAGE_PATH_;this.imageExtension_=c.imageExtension||this.MARKER_CLUSTER_IMAGE_EXTENSION_;this.zoomOnClick_=!0;void 0!=c.zoomOnClick&&(this.zoomOnClick_=c.zoomOnClick);this.averageCenter_=!1;void 0!=c.averageCenter&&(this.averageCenter_=c.averageCenter);this.setupStyles_();this.setMap(a);this.prevZoom_=this.map_.getZoom();var j=this;google.maps.event.addListener(this.map_,"zoom_changed",function(){var a=j.map_.getZoom();if(j.prevZoom_!=a){j.prevZoom_=a;j.resetViewport()}});google.maps.event.addListener(this.map_,"idle",function(){j.redraw()});d&&d.length&&this.addMarkers(d,!1)}function h(a){this.markerClusterer_=a;this.map_=a.getMap();this.gridSize_=a.getGridSize();this.minClusterSize_=a.getMinClusterSize();this.averageCenter_=a.isAverageCenter();this.center_=null;this.markers_=[];this.bounds_=null;this.clusterIcon_=new e(this,a.getStyles(),a.getGridSize())}function e(a,d,c){a.getMarkerClusterer().extend(e,google.maps.OverlayView);this.styles_=d;this.padding_=c||0;this.cluster_=a;this.center_=null;this.map_=a.getMap();this.sums_=this.div_=null;this.visible_=!1;this.setMap(this.map_)}var i=function(){},l=!1,m=!1,k=[];window.google&&google.maps&&(m=l=!0);f.extend(i.prototype,{name:"googlemaps",options:{lat:53.553407,lng:9.992196,marker:!0,popup:!1,text:"",zoom:13,mapCtrl:1,zoomWhl:!0,mapTypeId:"roadmap",typeCtrl:!0,directions:!0,directionsDestUpdate:!0,mainIcon:"red-dot",otherIcon:"blue-dot",iconUrl:"http://maps.google.com/mapfiles/ms/micons/",clusterMarker:!1},markers:[],initialize:function(a,d){this.options.msgFromAddress=$widgetkit.trans.get("FROM_ADDRESS");this.options.msgGetDirections=$widgetkit.trans.get("GET_DIRECTIONS");this.options.msgEmpty=$widgetkit.trans.get("FILL_IN_ADDRESS");this.options.msgNotFound=$widgetkit.trans.get("ADDRESS_NOT_FOUND");this.options.msgAddressNotFound=$widgetkit.trans.get("LOCATION_NOT_FOUND");this.options=f.extend({},this.options,d);this.container=a;m?this.setupMap():k.push(this)},setupMap:function(){var a=this.options;this.map=new google.maps.Map(this.container.get(0),{mapTypeId:a.mapTypeId,center:new google.maps.LatLng(a.lat,a.lng),streetViewControl:a.mapCtrl?true:false,navigationControl:a.mapCtrl,scrollwheel:a.zoomWhl?true:false,mapTypeControl:a.typeCtrl?true:false,zoomControl:a.mapCtrl?true:false,zoomControlOptions:{style:a.mapCtrl==1?google.maps.ZoomControlStyle.DEFAULT:google.maps.ZoomControlStyle.SMALL}});this.infowindow=new google.maps.InfoWindow;if(a.marker)if(a.popup==0){this.map.setCenter(new google.maps.LatLng(a.lat,a.lng));this.map.setZoom(a.zoom)}else this.addMarkerLatLng(a.lat,a.lng,a.text,true);if(a.mapTypeId=="roadmap"){this.map.mapTypeIds=["custom"];this.map.mapTypes.set("custom",new google.maps.StyledMapType([{featureType:"all",elementType:"all",stylers:[{invert_lightness:a.styler_invert_lightness},{hue:a.styler_hue},{saturation:a.styler_saturation},{lightness:a.styler_lightness},{gamma:a.styler_gamma}]}],{name:"CustomStyle"}));this.map.setMapTypeId("custom")}if(a.adresses&&a.adresses.length)for(var d=0;d<a.adresses.length;d++){var c=a.adresses[d];c.lat&&c.lng&&this.addMarkerLatLng(c.lat,c.lng,c.popup,c.center,c.icon)}a.directions&&this.setupDirections();if(a.clusterMarker)this.marker_cluster=new b(this.map,this.markers)},createMarker:function(a,d,c){var b=this,g=this.map,e=this.infowindow,h=new google.maps.MarkerImage(this.options.iconUrl+c+".png",new google.maps.Size(32,32),new google.maps.Point(0,0),new google.maps.Point(16,32)),c=c.match("pushpin")?this.options.iconUrl+"pushpin_shadow.png":this.options.iconUrl+"msmarker.shadow.png",c=new google.maps.MarkerImage(c,new google.maps.Size(56,32),new google.maps.Point(0,0),new google.maps.Point(16,32)),f=new google.maps.Marker({position:a,icon:h,shadow:c,map:this.map});google.maps.event.addListener(f,"click",function(){if(d.length){e.setContent(d);e.open(g,f)}if(b.options.directionsDestUpdate){b.options.lat=f.getPosition().lat();b.options.lng=f.getPosition().lng()}});this.markers.push(f);return f},centerMap:function(a,d){this.map.setCenter(new google.maps.LatLng(a,d));this.map.setZoom(this.options.zoom)},addMarkerLatLng:function(a,d,c,b,g){g=g||this.options.otherIcon;if(b)g=this.options.mainIcon;a=new google.maps.LatLng(a,d);g=this.createMarker(a,c,g);if(b){this.map.setCenter(a);this.map.setZoom(this.options.zoom)}if(b&&c&&c.length&&this.options.popup==2){this.infowindow.setContent(c);this.infowindow.open(this.map,g)}},setupDirections:function(){var a=this;this.directionsService=new google.maps.DirectionsService;this.directionsDisplay=new google.maps.DirectionsRenderer;this.directionsDisplay.setMap(this.map);this.directionsDisplay.setPanel(f("<div>").addClass("directions").css("position","relative").insertAfter(this.container).get(0));var d=f("<p>").append('<label for="from-address">'+
this.options.msgFromAddress+"</label>").append('<input type="text" name="address" style="margin:0 5px;" />').append('<button type="submit">'+this.options.msgGetDirections+"</button>");f('<form method="get" action="#"></form>').append(d).insertAfter(this.container).bind("submit",function(c){c.preventDefault();c.stopPropagation();a.setDirections(f(this))})},setDirections:function(a){var d=this;this.container.parent().find("div.alert").remove();a=a.find('input[name="address"]').val();if(a==="")this.showAlert(this.options.msgEmpty);else{a={origin:a,destination:new google.maps.LatLng(this.options.lat,this.options.lng),travelMode:google.maps.DirectionsTravelMode.DRIVING};"unitSystem"in this.options&&(a.unitSystem=this.options.unitSystem);this.directionsService.route(a,function(a,b){b==google.maps.DirectionsStatus.OK?d.directionsDisplay.setDirections(a):d.showAlert(d.options.msgNotFound)})}},showAlert:function(a){f("<div>").addClass("alert").append(f("<strong>").text(a)).insertAfter(this.container)},cmd:function(){var a=arguments,d=a[0]?a[0]:null;this.map[d]&&this.map[d].apply(this.map,Array.prototype.slice.call(a,1))}});f.fn[i.prototype.name]=function(){var a=arguments,d=a[0]?a[0]:null;return this.each(function(){if(!l){var c=document.createElement("script");c.type="text/javascript";c.async=1;c.src=location.protocol+"//maps.google.com/maps/api/js?sensor=false&callback=jQuery.fn.googlemaps.ready";document.body.appendChild(c);l=true}c=f(this);if(i.prototype[d]&&c.data(i.prototype.name)&&d!="initialize")c.data(i.prototype.name)[d].apply(c.data(i.prototype.name),Array.prototype.slice.call(a,1));else if(!d||f.isPlainObject(d)){var b=new i;i.prototype.initialize&&b.initialize.apply(b,f.merge([c],a));c.data(i.prototype.name,b)}else f.error("Method "+d+" does not exist on jQuery."+i.name)})};f.fn[i.prototype.name].ready=function(){for(var a=0;a<k.length;a++)k[a].setupMap&&k[a].setupMap();m=true};b.prototype.MARKER_CLUSTER_IMAGE_PATH_="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m";b.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_="png";b.prototype.extend=function(a,d){return function(a){for(var d in a.prototype)this.prototype[d]=a.prototype[d];return this}.apply(a,[d])};b.prototype.onAdd=function(){this.setReady_(true)};b.prototype.draw=function(){};b.prototype.setupStyles_=function(){if(!this.styles_.length)for(var a=0,d;d=this.sizes[a];a++)this.styles_.push({url:this.imagePath_+(a+1)+"."+this.imageExtension_,height:d,width:d})};b.prototype.fitMapToMarkers=function(){for(var a=this.getMarkers(),d=new google.maps.LatLngBounds,c=0,b;b=a[c];c++)d.extend(b.getPosition());this.map_.fitBounds(d)};b.prototype.setStyles=function(a){this.styles_=a};b.prototype.getStyles=function(){return this.styles_};b.prototype.isZoomOnClick=function(){return this.zoomOnClick_};b.prototype.isAverageCenter=function(){return this.averageCenter_};b.prototype.getMarkers=function(){return this.markers_};b.prototype.getTotalMarkers=function(){return this.markers_.length};b.prototype.setMaxZoom=function(a){this.maxZoom_=a};b.prototype.getMaxZoom=function(){return this.maxZoom_};b.prototype.calculator_=function(a,d){for(var c=0,b=a.length,g=b;g!==0;){g=parseInt(g/10,10);c++}c=Math.min(c,d);return{text:b,index:c}};b.prototype.setCalculator=function(a){this.calculator_=a};b.prototype.getCalculator=function(){return this.calculator_};b.prototype.addMarkers=function(a,d){for(var c=0,b;b=a[c];c++)this.pushMarkerTo_(b);d||this.redraw()};b.prototype.pushMarkerTo_=function(a){a.isAdded=false;if(a.draggable){var d=this;google.maps.event.addListener(a,"dragend",function(){a.isAdded=false;d.repaint()})}this.markers_.push(a)};b.prototype.addMarker=function(a,d){this.pushMarkerTo_(a);d||this.redraw()};b.prototype.removeMarker_=function(a){var d=-1;if(this.markers_.indexOf)d=this.markers_.indexOf(a);else for(var c=0,b;b=this.markers_[c];c++)if(b==a){d=c;break}if(d==-1)return false;a.setMap(null);this.markers_.splice(d,1);return true};b.prototype.removeMarker=function(a,d){var c=this.removeMarker_(a);if(!d&&c){this.resetViewport();this.redraw();return true}return false};b.prototype.removeMarkers=function(a,d){for(var c=false,b=0,g;g=a[b];b++){g=this.removeMarker_(g);c=c||g}if(!d&&c){this.resetViewport();this.redraw();return true}};b.prototype.setReady_=function(a){if(!this.ready_){this.ready_=a;this.createClusters_()}};b.prototype.getTotalClusters=function(){return this.clusters_.length};b.prototype.getMap=function(){return this.map_};b.prototype.setMap=function(a){this.map_=a};b.prototype.getGridSize=function(){return this.gridSize_};b.prototype.setGridSize=function(a){this.gridSize_=a};b.prototype.getMinClusterSize=function(){return this.minClusterSize_};b.prototype.setMinClusterSize=function(a){this.minClusterSize_=a};b.prototype.getExtendedBounds=function(a){var d=this.getProjection(),b=new google.maps.LatLng(a.getNorthEast().lat(),a.getNorthEast().lng()),e=new google.maps.LatLng(a.getSouthWest().lat(),a.getSouthWest().lng()),b=d.fromLatLngToDivPixel(b);b.x=b.x+this.gridSize_;b.y=b.y-this.gridSize_;e=d.fromLatLngToDivPixel(e);e.x=e.x-this.gridSize_;e.y=e.y+this.gridSize_;b=d.fromDivPixelToLatLng(b);d=d.fromDivPixelToLatLng(e);a.extend(b);a.extend(d);return a};b.prototype.isMarkerInBounds_=function(a,b){return b.contains(a.getPosition())};b.prototype.clearMarkers=function(){this.resetViewport(true);this.markers_=[]};b.prototype.resetViewport=function(a){for(var b=0,c;c=this.clusters_[b];b++)c.remove();for(b=0;c=this.markers_[b];b++){c.isAdded=false;a&&c.setMap(null)}this.clusters_=[]};b.prototype.repaint=function(){var a=this.clusters_.slice();this.clusters_.length=0;this.resetViewport();this.redraw();window.setTimeout(function(){for(var b=0,c;c=a[b];b++)c.remove()},0)};b.prototype.redraw=function(){this.createClusters_()};b.prototype.distanceBetweenPoints_=function(a,b){if(!a||!b)return 0;var c=(b.lat()-a.lat())*Math.PI/180,e=(b.lng()-a.lng())*Math.PI/180,c=Math.sin(c/2)*Math.sin(c/2)+Math.cos(a.lat()*Math.PI/180)*Math.cos(b.lat()*Math.PI/180)*Math.sin(e/2)*Math.sin(e/2);return 6371*2*Math.atan2(Math.sqrt(c),Math.sqrt(1-c))};b.prototype.addToClosestCluster_=function(a){var b=4E4,c=null;a.getPosition();for(var e=0,g;g=this.clusters_[e];e++){var f=g.getCenter();if(f){f=this.distanceBetweenPoints_(f,a.getPosition());if(f<b){b=f;c=g}}}if(c&&c.isMarkerInClusterBounds(a))c.addMarker(a);else{g=new h(this);g.addMarker(a);this.clusters_.push(g)}};b.prototype.createClusters_=function(){if(this.ready_)for(var a=this.getExtendedBounds(new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(),this.map_.getBounds().getNorthEast())),b=0,c;c=this.markers_[b];b++)!c.isAdded&&this.isMarkerInBounds_(c,a)&&this.addToClosestCluster_(c)};h.prototype.isMarkerAlreadyAdded=function(a){if(this.markers_.indexOf)return this.markers_.indexOf(a)!=-1;for(var b=0,c;c=this.markers_[b];b++)if(c==a)return true;return false};h.prototype.addMarker=function(a){if(this.isMarkerAlreadyAdded(a))return false;if(this.center_){if(this.averageCenter_){var b=this.markers_.length+1,c=(this.center_.lat()*(b-1)+a.getPosition().lat())/b,b=(this.center_.lng()*(b-1)+a.getPosition().lng())/b;this.center_=new google.maps.LatLng(c,b);this.calculateBounds_()}}else{this.center_=a.getPosition();this.calculateBounds_()}a.isAdded=true;this.markers_.push(a);c=this.markers_.length;c<this.minClusterSize_&&a.getMap()!=this.map_&&a.setMap(this.map_);if(c==this.minClusterSize_)for(b=0;b<c;b++)this.markers_[b].setMap(null);c>=this.minClusterSize_&&a.setMap(null);this.updateIcon();return true};h.prototype.getMarkerClusterer=function(){return this.markerClusterer_};h.prototype.getBounds=function(){for(var a=new google.maps.LatLngBounds(this.center_,this.center_),b=this.getMarkers(),c=0,e;e=b[c];c++)a.extend(e.getPosition());return a};h.prototype.remove=function(){this.clusterIcon_.remove();this.markers_.length=0;delete this.markers_};h.prototype.getSize=function(){return this.markers_.length};h.prototype.getMarkers=function(){return this.markers_};h.prototype.getCenter=function(){return this.center_};h.prototype.calculateBounds_=function(){this.bounds_=this.markerClusterer_.getExtendedBounds(new google.maps.LatLngBounds(this.center_,this.center_))};h.prototype.isMarkerInClusterBounds=function(a){return this.bounds_.contains(a.getPosition())};h.prototype.getMap=function(){return this.map_};h.prototype.updateIcon=function(){var a=this.map_.getZoom(),b=this.markerClusterer_.getMaxZoom();if(b&&a>b)for(a=0;b=this.markers_[a];a++)b.setMap(this.map_);else if(this.markers_.length<this.minClusterSize_)this.clusterIcon_.hide();else{a=this.markerClusterer_.getStyles().length;a=this.markerClusterer_.getCalculator()(this.markers_,a);this.clusterIcon_.setCenter(this.center_);this.clusterIcon_.setSums(a);this.clusterIcon_.show()}};e.prototype.triggerClusterClick=function(){var a=this.cluster_.getMarkerClusterer();google.maps.event.trigger(a,"clusterclick",this.cluster_);a.isZoomOnClick()&&this.map_.fitBounds(this.cluster_.getBounds())};e.prototype.onAdd=function(){this.div_=document.createElement("DIV");if(this.visible_){this.div_.style.cssText=this.createCss(this.getPosFromLatLng_(this.center_));this.div_.innerHTML=this.sums_.text}this.getPanes().overlayMouseTarget.appendChild(this.div_);var a=this;google.maps.event.addDomListener(this.div_,"click",function(){a.triggerClusterClick()})};e.prototype.getPosFromLatLng_=function(a){a=this.getProjection().fromLatLngToDivPixel(a);a.x=a.x-parseInt(this.width_/2,10);a.y=a.y-parseInt(this.height_/2,10);return a};e.prototype.draw=function(){if(this.visible_){var a=this.getPosFromLatLng_(this.center_);this.div_.style.top=a.y+"px";this.div_.style.left=a.x+"px"}};e.prototype.hide=function(){if(this.div_)this.div_.style.display="none";this.visible_=false};e.prototype.show=function(){if(this.div_){this.div_.style.cssText=this.createCss(this.getPosFromLatLng_(this.center_));this.div_.style.display=""}this.visible_=true};e.prototype.remove=function(){this.setMap(null)};e.prototype.onRemove=function(){if(this.div_&&this.div_.parentNode){this.hide();this.div_.parentNode.removeChild(this.div_);this.div_=null}};e.prototype.setSums=function(a){this.sums_=a;this.text_=a.text;this.index_=a.index;if(this.div_)this.div_.innerHTML=a.text;this.useStyle()};e.prototype.useStyle=function(){var a=Math.max(0,this.sums_.index-1),a=Math.min(this.styles_.length-1,a),a=this.styles_[a];this.url_=a.url;this.height_=a.height;this.width_=a.width;this.textColor_=a.textColor;this.anchor_=a.anchor;this.textSize_=a.textSize;this.backgroundPosition_=a.backgroundPosition};e.prototype.setCenter=function(a){this.center_=a};e.prototype.createCss=function(a){var b=[];b.push("background-image:url("+this.url_+");");b.push("background-position:"+(this.backgroundPosition_?this.backgroundPosition_:"0 0")+";");if(typeof this.anchor_==="object"){typeof this.anchor_[0]==="number"&&this.anchor_[0]>0&&this.anchor_[0]<this.height_?b.push("height:"+(this.height_-this.anchor_[0])+"px; padding-top:"+this.anchor_[0]+"px;"):b.push("height:"+this.height_+"px; line-height:"+this.height_+"px;");typeof this.anchor_[1]==="number"&&this.anchor_[1]>0&&this.anchor_[1]<this.width_?b.push("width:"+(this.width_-this.anchor_[1])+"px; padding-left:"+this.anchor_[1]+"px;"):b.push("width:"+this.width_+"px; text-align:center;")}else b.push("height:"+
this.height_+"px; line-height:"+this.height_+"px; width:"+this.width_+"px; text-align:center;");b.push("cursor:pointer; top:"+a.y+"px; left:"+a.x+"px; color:"+(this.textColor_?this.textColor_:"black")+"; position:absolute; font-size:"+(this.textSize_?this.textSize_:11)+"px; font-family:Arial,sans-serif; font-weight:bold");return b.join("")};window.MarkerClusterer=b;b.prototype.addMarker=b.prototype.addMarker;b.prototype.addMarkers=b.prototype.addMarkers;b.prototype.clearMarkers=b.prototype.clearMarkers;b.prototype.fitMapToMarkers=b.prototype.fitMapToMarkers;b.prototype.getCalculator=b.prototype.getCalculator;b.prototype.getGridSize=b.prototype.getGridSize;b.prototype.getExtendedBounds=b.prototype.getExtendedBounds;b.prototype.getMap=b.prototype.getMap;b.prototype.getMarkers=b.prototype.getMarkers;b.prototype.getMaxZoom=b.prototype.getMaxZoom;b.prototype.getStyles=b.prototype.getStyles;b.prototype.getTotalClusters=b.prototype.getTotalClusters;b.prototype.getTotalMarkers=b.prototype.getTotalMarkers;b.prototype.redraw=b.prototype.redraw;b.prototype.removeMarker=b.prototype.removeMarker;b.prototype.removeMarkers=b.prototype.removeMarkers;b.prototype.resetViewport=b.prototype.resetViewport;b.prototype.repaint=b.prototype.repaint;b.prototype.setCalculator=b.prototype.setCalculator;b.prototype.setGridSize=b.prototype.setGridSize;b.prototype.setMaxZoom=b.prototype.setMaxZoom;b.prototype.onAdd=b.prototype.onAdd;b.prototype.draw=b.prototype.draw;h.prototype.getCenter=h.prototype.getCenter;h.prototype.getSize=h.prototype.getSize;h.prototype.getMarkers=h.prototype.getMarkers;e.prototype.onAdd=e.prototype.onAdd;e.prototype.draw=e.prototype.draw;e.prototype.onRemove=e.prototype.onRemove})(jQuery);

(function(f,e){var a={},d=f(window);e.$widgetkit={version:"1.4.6",lazyloaders:{},load:function(b){a[b]||(a[b]=f.ajax({dataType:"script",cache:!0,url:b+"?wkv="+this.version}));return a[b]},lazyload:function(a){a=a||document;f("[data-widgetkit]",a).each(function(){var a=f(this),b=a.data("widgetkit"),d=a.data("options")||{};!a.data("wk-loaded")&&$widgetkit.lazyloaders[b]&&($widgetkit.lazyloaders[b](a,d),a.data("wk-loaded",!0))})}};f(function(){$widgetkit.lazyload()});d.on("load",function(){d.resize()});for(var b=document.createElement("div"),c=b.style,b=!1,g=["-webkit-","-moz-","-o-","-ms-","-khtml-"],j=["Webkit","Moz","O","ms","Khtml"],h="",k=0;k<j.length;k++)if(""===c[j[k]+"Transition"]){b=j[k]+"Transition";h=g[k];break}$widgetkit.prefix=h;c=$widgetkit;b=(g=b)&&"WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix&&!navigator.userAgent.match(/Chrome/i);j=document.createElement("canvas");j=!(!j.getContext||!j.getContext("2d"));c.support={transition:g,css3d:b,canvas:j};$widgetkit.css3=function(a){a=a||{};a.transition&&(a[h+"transition"]=a.transition);a.transform&&(a[h+"transform"]=a.transform);a["transform-origin"]&&(a[h+"transform-origin"]=a["transform-origin"]);return a};if(!(b=f.browser))c=navigator.userAgent,c=c.toLowerCase(),b={},c=/(chrome)[ \/]([\w.]+)/.exec(c)||/(webkit)[ \/]([\w.]+)/.exec(c)||/(opera)(?:.*version)?[ \/]([\w.]+)/.exec(c)||/(msie) ([\w.]+)/.exec(c)||0>c.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+))?/.exec(c)||[],b[c[1]]=!0,b.version=c[2]||"0";f.browser=b;b=null})(jQuery,window);(function(f){var e;a:{try{e=parseInt(navigator.appVersion.match(/MSIE (\d\.\d)/)[1],10);break a}catch(a){}e=!1}e&&9>e&&(f(document).ready(function(){f("body").addClass("wk-ie wk-ie"+e)}),f.each("abbr article aside audio canvas details figcaption figure footer header hgroup mark meter nav output progress section summary time video".split(" "),function(){document.createElement(this)}))})(jQuery);(function(f,e){e.$widgetkit.trans={__data:{},addDic:function(a){f.extend(this.__data,a)},add:function(a,d){this.__data[a]=d},get:function(a){if(!this.__data[a])return a;var d=1==arguments.length?[]:Array.prototype.slice.call(arguments,1);return this.printf(String(this.__data[a]),d)},printf:function(a,d){if(!d)return a;var b="",c=a.split("%s");if(1==c.length)return a;for(var g=0;g<d.length;g++)c[g].lastIndexOf("%")==c[g].length-1&&g!=d.length-1&&(c[g]+="s"+c.splice(g+1,1)[0]),b+=c[g]+d[g];return b+
c[c.length-1]}}})(jQuery,window);(function(f){f.easing.jswing=f.easing.swing;f.extend(f.easing,{def:"easeOutQuad",swing:function(e,a,d,b,c){return f.easing[f.easing.def](e,a,d,b,c)},easeInQuad:function(e,a,d,b,c){return b*(a/=c)*a+d},easeOutQuad:function(e,a,d,b,c){return-b*(a/=c)*(a-2)+d},easeInOutQuad:function(e,a,d,b,c){return 1>(a/=c/2)?b/2*a*a+d:-b/2*(--a*(a-2)-1)+d},easeInCubic:function(e,a,d,b,c){return b*(a/=c)*a*a+d},easeOutCubic:function(e,a,d,b,c){return b*((a=a/c-1)*a*a+1)+d},easeInOutCubic:function(e,a,d,b,c){return 1>(a/=c/2)?b/2*a*a*a+d:b/2*((a-=2)*a*a+2)+d},easeInQuart:function(e,a,d,b,c){return b*(a/=c)*a*a*a+d},easeOutQuart:function(e,a,d,b,c){return-b*((a=a/c-1)*a*a*a-1)+d},easeInOutQuart:function(e,a,d,b,c){return 1>(a/=c/2)?b/2*a*a*a*a+d:-b/2*((a-=2)*a*a*a-2)+d},easeInQuint:function(e,a,d,b,c){return b*(a/=c)*a*a*a*a+d},easeOutQuint:function(e,a,d,b,c){return b*((a=a/c-1)*a*a*a*a+1)+d},easeInOutQuint:function(e,a,d,b,c){return 1>(a/=c/2)?b/2*a*a*a*a*a+d:b/2*((a-=2)*a*a*a*a+2)+d},easeInSine:function(e,a,d,b,c){return-b*Math.cos(a/c*(Math.PI/2))+b+d},easeOutSine:function(e,a,d,b,c){return b*Math.sin(a/c*(Math.PI/2))+d},easeInOutSine:function(e,a,d,b,c){return-b/2*(Math.cos(Math.PI*a/c)-1)+d},easeInExpo:function(e,a,d,b,c){return 0==a?d:b*Math.pow(2,10*(a/c-1))+d},easeOutExpo:function(e,a,d,b,c){return a==c?d+b:b*(-Math.pow(2,-10*a/c)+1)+d},easeInOutExpo:function(e,a,d,b,c){return 0==a?d:a==c?d+b:1>(a/=c/2)?b/2*Math.pow(2,10*(a-1))+d:b/2*(-Math.pow(2,-10*--a)+2)+d},easeInCirc:function(e,a,d,b,c){return-b*(Math.sqrt(1-(a/=c)*a)-1)+d},easeOutCirc:function(e,a,d,b,c){return b*Math.sqrt(1-(a=a/c-1)*a)+d},easeInOutCirc:function(e,a,d,b,c){return 1>(a/=c/2)?-b/2*(Math.sqrt(1-a*a)-1)+d:b/2*(Math.sqrt(1-(a-=2)*a)+1)+d},easeInElastic:function(e,a,d,b,c){e=1.70158;var g=0,f=b;if(0==a)return d;if(1==(a/=c))return d+b;g||(g=0.3*c);f<Math.abs(b)?(f=b,e=g/4):e=g/(2*Math.PI)*Math.asin(b/f);return-(f*Math.pow(2,10*(a-=1))*Math.sin((a*c-e)*2*Math.PI/g))+d},easeOutElastic:function(e,a,d,b,c){e=1.70158;var g=0,f=b;if(0==a)return d;if(1==(a/=c))return d+b;g||(g=0.3*c);f<Math.abs(b)?(f=b,e=g/4):e=g/(2*Math.PI)*Math.asin(b/f);return f*Math.pow(2,-10*a)*Math.sin((a*c-e)*2*Math.PI/g)+b+d},easeInOutElastic:function(e,a,d,b,c){e=1.70158;var g=0,f=b;if(0==a)return d;if(2==(a/=c/2))return d+b;g||(g=c*0.3*1.5);f<Math.abs(b)?(f=b,e=g/4):e=g/(2*Math.PI)*Math.asin(b/f);return 1>a?-0.5*f*Math.pow(2,10*(a-=1))*Math.sin((a*c-e)*2*Math.PI/g)+d:0.5*f*Math.pow(2,-10*(a-=1))*Math.sin((a*c-e)*2*Math.PI/g)+b+d},easeInBack:function(e,a,d,b,c,g){void 0==g&&(g=1.70158);return b*(a/=c)*a*((g+1)*a-g)+d},easeOutBack:function(e,a,d,b,c,g){void 0==g&&(g=1.70158);return b*((a=a/c-1)*a*((g+1)*a+g)+1)+d},easeInOutBack:function(e,a,d,b,c,g){void 0==g&&(g=1.70158);return 1>(a/=c/2)?b/2*a*a*(((g*=1.525)+1)*a-g)+d:b/2*((a-=2)*a*(((g*=1.525)+1)*a+g)+2)+d},easeInBounce:function(e,a,d,b,c){return b-f.easing.easeOutBounce(e,c-a,0,b,c)+d},easeOutBounce:function(e,a,d,b,c){return(a/=c)<1/2.75?b*7.5625*a*a+d:a<2/2.75?b*(7.5625*(a-=1.5/2.75)*a+0.75)+
d:a<2.5/2.75?b*(7.5625*(a-=2.25/2.75)*a+0.9375)+d:b*(7.5625*(a-=2.625/2.75)*a+0.984375)+d},easeInOutBounce:function(e,a,d,b,c){return a<c/2?0.5*f.easing.easeInBounce(e,2*a,0,b,c)+d:0.5*f.easing.easeOutBounce(e,2*a-c,0,b,c)+0.5*b+d}})})(jQuery);(function(f){function e(a){var b=a||window.event,c=[].slice.call(arguments,1),g=0,e=0,h=0;a=f.event.fix(b);a.type="mousewheel";a.wheelDelta&&(g=a.wheelDelta/120);a.detail&&(g=-a.detail/3);h=g;void 0!==b.axis&&b.axis===b.HORIZONTAL_AXIS&&(h=0,e=-1*g);void 0!==b.wheelDeltaY&&(h=b.wheelDeltaY/120);void 0!==b.wheelDeltaX&&(e=-1*b.wheelDeltaX/120);c.unshift(a,g,e,h);return f.event.handle.apply(this,c)}var a=["DOMMouseScroll","mousewheel"];f.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var d=a.length;d;)this.addEventListener(a[--d],e,!1);else this.onmousewheel=e},teardown:function(){if(this.removeEventListener)for(var d=a.length;d;)this.removeEventListener(a[--d],e,!1);else this.onmousewheel=null}};f.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery);(function(f){var e=f.support;var a=document.createElement("INPUT");a.type="file";if(a="files"in a)a=new XMLHttpRequest,a=!(!a||!("upload"in a&&"onprogress"in a.upload))&&!!window.FormData;e.ajaxupload=a;f.support.ajaxupload&&f.event.props.push("dataTransfer");f.fn.uploadOnDrag=function(a){return!f.support.ajaxupload?this:this.each(function(){var b=f(this),c=f.extend({action:"",single:!1,method:"POST",params:{},loadstart:function(){},load:function(){},loadend:function(){},progress:function(){},complete:function(){},allcomplete:function(){},readystatechange:function(){}},a);b.on("drop",function(a){function b(a,c){for(var d=new FormData,e=new XMLHttpRequest,g=0,h;h=a[g];g++)d.append("files[]",h);for(var m in c.params)d.append(m,c.params[m]);e.upload.addEventListener("progress",function(a){c.progress(100*(a.loaded/a.total),a)},!1);e.addEventListener("loadstart",function(a){c.loadstart(a)},!1);e.addEventListener("load",function(a){c.load(a)},!1);e.addEventListener("loadend",function(a){c.loadend(a)},!1);e.addEventListener("error",function(a){c.error(a)},!1);e.addEventListener("abort",function(a){c.abort(a)},!1);e.open(c.method,c.action,!0);e.onreadystatechange=function(){c.readystatechange(e);if(4==e.readyState){var a=e.responseText;if("json"==c.type)try{a=f.parseJSON(a)}catch(b){a=!1}c.complete(a,e)}};e.send(d)}a.stopPropagation();a.preventDefault();var d=a.dataTransfer.files;if(c.single){var e=a.dataTransfer.files.length,g=0,j=c.complete;c.complete=function(a,f){g+=1;j(a,f);g<e?b([d[g]],c):c.allcomplete()};b([d[0]],c)}else b(d,c)}).on("dragover",function(a){a.stopPropagation();a.preventDefault()})})};f.fn.ajaxform=function(a){return!f.support.ajaxupload?this:this.each(function(){var b=f(this),c=f.extend({action:b.attr("action"),method:b.attr("method"),loadstart:function(){},load:function(){},loadend:function(){},progress:function(){},complete:function(){},readystatechange:function(){}},a);b.on("submit",function(a){a.preventDefault();a=new FormData(this);var b=new XMLHttpRequest;a.append("formdata","1");b.upload.addEventListener("progress",function(a){c.progress(100*(a.loaded/a.total),a)},!1);b.addEventListener("loadstart",function(a){c.loadstart(a)},!1);b.addEventListener("load",function(a){c.load(a)},!1);b.addEventListener("loadend",function(a){c.loadend(a)},!1);b.addEventListener("error",function(a){c.error(a)},!1);b.addEventListener("abort",function(a){c.abort(a)},!1);b.open(c.method,c.action,!0);b.onreadystatechange=function(){c.readystatechange(b);if(4==b.readyState){var a=b.responseText;if("json"==c.type)try{a=f.parseJSON(a)}catch(d){a=!1}c.complete(a,b)}};b.send(a)})})};if(!f.event.special.debouncedresize){var d=f.event,b,c;b=d.special.debouncedresize={setup:function(){f(this).on("resize",b.handler)},teardown:function(){f(this).off("resize",b.handler)},handler:function(a,e){var f=this,k=arguments,l=function(){a.type="debouncedresize";d.dispatch.apply(f,k)};c&&clearTimeout(c);e?l():c=setTimeout(l,b.threshold)},threshold:150}}})(jQuery);
(function(b,f,g){function d(h){e.innerHTML='&shy;<style media="'+h+'"> #mq-test-1 { width: 42px; }</style>';a.insertBefore(j,m);l=42==e.offsetWidth;a.removeChild(j);return l}function k(h){var a=d(h.media);if(h._listeners&&h.matches!=a){h.matches=a;for(var a=0,c=h._listeners.length;a<c;a++)h._listeners[a](h)}}function c(a,c,d){var b;return function(){var f=this,g=arguments,e=d&&!b;clearTimeout(b);b=setTimeout(function(){b=null;d||a.apply(f,g)},c);e&&a.apply(f,g)}}if(!f.matchMedia||b.userAgent.match(/(iPhone|iPod|iPad)/i)){var l,a=g.documentElement,m=a.firstElementChild||a.firstChild,j=g.createElement("body"),e=g.createElement("div");e.id="mq-test-1";e.style.cssText="position:absolute;top:-100em";j.style.background="none";j.appendChild(e);f.matchMedia=function(a){var b,e=[];b={matches:d(a),media:a,_listeners:e,addListener:function(a){"function"===typeof a&&e.push(a)},removeListener:function(a){for(var b=0,c=e.length;b<c;b++)e[b]===a&&delete e[b]}};f.addEventListener&&f.addEventListener("resize",c(function(){k(b)},150),!1);g.addEventListener&&g.addEventListener("orientationchange",function(){k(b)},!1);return b}}})(navigator,window,document);(function(b,f,g){if(!b.onMediaQuery){var d={},k=f.matchMedia&&f.matchMedia("only all").matches;b(g).ready(function(){for(var c in d)b(d[c]).trigger("init"),d[c].matches&&b(d[c]).trigger("valid")});b(f).bind("load",function(){for(var c in d)d[c].matches&&b(d[c]).trigger("valid")});b.onMediaQuery=function(c,g){var a=c&&d[c];a||(a=d[c]=f.matchMedia(c),a.supported=k,a.addListener(function(){b(a).trigger(a.matches?"valid":"invalid")}));b(a).bind(g);return a}}})(jQuery,window,document);
jQuery(function(a){a("#tabs").tabs().prev().append('<li class="version">'+a("#tabs").data("wkversion")+"</li>");a("#widgetkit").delegate(".box .deletable","click",function(){a(this).parent().trigger("delete",[a(this)])});a("input:text").placeholder()});jQuery("body").bind("afterPreWpautop",function(a,b){b.data=b.unfiltered.replace(/caption\]\[caption/g,"caption] [caption").replace(/<object[\s\S]+?<\/object>/g,function(a){return a.replace(/[\r\n]+/g," ")})}).bind("afterWpautop",function(a,b){b.data=b.unfiltered});(function(a){var b={get:function(a){return window.sessionStorage?sessionStorage.getItem(a):null},set:function(a,b){window.sessionStorage&&sessionStorage.setItem(a,b)}};a.fn.tabs=function(){return this.each(function(){var g=a(this).addClass("content").wrap('<div class="tabs-box" />').before('<ul class="nav" />'),e=a(this).prev("ul.nav");g.children("li").each(function(){e.append("<li><a>"+a(this).hide().attr("data-name")+"</a></li>")});e.children("li").bind("click",function(c){c.preventDefault();var c=a("li",e).removeClass("active").index(a(this).addClass("active").get(0)),h=g.children("li").hide();a(h[c]).show();b.set("widgetkit-tab",c)});var f=parseInt(b.get("widgetkit-tab"));a(!isNaN(f)?e.children("li").get(f):e.children("li:first")).trigger("click")})}})(jQuery);(function(a){var b=function(){};a.extend(b.prototype,{name:"finder",initialize:function(b,e){function f(h){h.preventDefault();var d=a(this).closest("li",b);d.length||(d=b);d.hasClass(c.options.open)?d.removeClass(c.options.open).children("ul").slideUp():(d.addClass(c.options.loading),a.post(c.options.url,{path:d.data("path")},function(b){d.removeClass(c.options.loading).addClass(c.options.open);b.length&&(d.children().remove("ul"),d.append("<ul>").children("ul").hide(),a.each(b,function(b,c){d.children("ul").append(a('<li><a href="#">'+
c.name+"</a></li>").addClass(c.type).data("path",c.path))}),d.find("ul a").bind("click",f),d.children("ul").slideDown())},"json"))}var c=this;this.options=a.extend({url:"",path:"",open:"open",loading:"loading"},e);b.data("path",this.options.path).bind("retrieve:finder",f).trigger("retrieve:finder")}});a.fn[b.prototype.name]=function(){var g=arguments,e=g[0]?g[0]:null;return this.each(function(){var f=a(this);if(b.prototype[e]&&f.data(b.prototype.name)&&"initialize"!=e)f.data(b.prototype.name)[e].apply(f.data(b.prototype.name),Array.prototype.slice.call(g,1));else if(!e||a.isPlainObject(e)){var c=new b;b.prototype.initialize&&c.initialize.apply(c,a.merge([f],g));f.data(b.prototype.name,c)}else a.error("Method "+e+" does not exist on jQuery."+b.name)})}})(jQuery);(function(a){function b(b){var d={},c=/^jQuery\d+$/;a.each(b.attributes,function(a,b){b.specified&&!c.test(b.name)&&(d[b.name]=b.value)});return d}function g(){var b=a(this);b.val()===b.attr("placeholder")&&b.hasClass("placeholder")&&(b.data("placeholder-password")?b.hide().next().show().focus():b.val("").removeClass("placeholder"))}function e(){var c,d=a(this);if(""===d.val()||d.val()===d.attr("placeholder")){if(d.is(":password")){if(!d.data("placeholder-textinput")){try{c=d.clone().attr({type:"text"})}catch(e){c=a("<input>").attr(a.extend(b(d[0]),{type:"text"}))}c.removeAttr("name").data("placeholder-password",!0).bind("focus.placeholder",g);d.data("placeholder-textinput",c).before(c)}d=d.hide().prev().show()}d.addClass("placeholder").val(d.attr("placeholder"))}else d.removeClass("placeholder")}var f="placeholder"in document.createElement("input"),c="placeholder"in document.createElement("textarea");a.fn.placeholder=f&&c?function(){return this}:function(){return this.filter((f?"textarea":":input")+"[placeholder]").bind("focus.placeholder",g).bind("blur.placeholder",e).trigger("blur.placeholder").end()};a(function(){a("form").bind("submit.placeholder",function(){var b=a(".placeholder",this).each(g);setTimeout(function(){b.each(e)},10)})});a(window).bind("unload.placeholder",function(){a(".placeholder").val("")})})(jQuery);(function(a){var b=a(window),g=a(document),e=!1,f=!1,c=null,h=null;a.modalwin=function(d){e&&a.modalwin.close();"object"===typeof d?(d=a(d),d.parent().length&&(this.persist=d,this.persist.data("modal-persist-parent",d.parent()))):d="string"===typeof d||"number"===typeof d?a("<div></div>").html(d):a("<div></div>").html("Modalwin Error: Unsupported data type: "+typeof d);c=a('<div class="modalwin"><div class="inner"></div><div class="btnclose"></div>');c.find(".inner:first").append(d);c.css({position:"fixed","z-index":101}).find(".btnclose").click(a.modalwin.close);h=a('<div class="modal-overlay"></div>').css({position:"absolute",left:0,top:0,width:g.width(),height:g.height(),"z-index":100}).bind("click",a.modalwin.close);a("body").append(h).append(c.hide());c.show().css({left:b.width()/2-c.width()/2,top:b.height()/2-c.height()/2}).fadeIn();e=!0};a.modalwin.close=function(){e&&(f&&(f.appendTo(this.persist.data("modal-persist-parent")),f=!1),c.remove(),h.remove(),h=c=null,e=!1)};b.bind("resize",function(){e&&(c.css({left:b.width()/2-c.width()/2,top:b.height()/2-c.height()/2}),h.css({width:g.width(),height:g.height()}))})})(jQuery);
var widgetkitajax="http://localhost/mailgapp/wp-admin/admin-ajax.php?action=widgetkit&ajax=1";