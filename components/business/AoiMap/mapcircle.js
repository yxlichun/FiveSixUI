/**
 * @file widget/settings/mapcircle.js
 * @author yangluguang@baidu.com
 */
/* globals module */
/* globals BMap */
/* globals BMapLib */
'use strict';
var geocoder = new BMap.Geocoder();
var maptool = new BMap.MercatorProjection();

function MapCircle(id) {
    var me = this;
    me.id = id;
    me.dispose();
    me.init();
}

var getLonlat = function (obj) {
    var lonlat = maptool.pointToLngLat(
        new BMap.Pixel(obj.x, obj.y)
    );
    lonlat = {
        longitude: lonlat.lng,
        latitude: lonlat.lat
    }
    return lonlat;
}
var getMercator = function (obj) {
    var mercatorObj = maptool.lngLatToPoint(
        new BMap.Point(obj.longitude, obj.latitude)
    );
    return mercatorObj;
}

function BackToShopControl(){
  this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
  this.defaultOffset = new BMap.Size(70, 10);
}

BackToShopControl.prototype = new BMap.Control();

BackToShopControl.prototype.initialize = function(map){
    var me = this;
    var div = document.createElement("Button");
    div.appendChild(document.createTextNode("返回商户"));
    // 设置样式
    div.style.cursor = "pointer";
    div.style.border = "1px solid gray";
    div.style.backgroundColor = "white";
    div.onclick = function(e){
        me.delegate.backToShop();
    }
    map.getContainer().appendChild(div);
    return div;
}

BackToShopControl.prototype.setDelegate = function(delegate){
    var me = this;
    me.delegate = delegate;
}

function ShowDistanceControl(){
  this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
  this.defaultOffset = new BMap.Size(150, 10);
}

ShowDistanceControl.prototype = new BMap.Control();

ShowDistanceControl.prototype.initialize = function(map){
    var me = this;

    var div = document.createElement("Button");
    // 设置样式
    div.style.cursor = "pointer";
    div.style.border = "1px solid gray";
    div.style.backgroundColor = "white";

    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = "show-distance";
    checkbox.onchange = function(e){
        me.delegate.showDistance(e.target.checked)
        me.delegate.distanceOn = e.target.checked
    }

    var label = document.createElement('label')
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode('显示距离'));
    div.appendChild(label);
    // div.appendChild(document.createTextNode("返回商户"));
    // 设置样式
    div.style.cursor = "pointer";
    div.style.border = "1px solid gray";
    div.style.backgroundColor = "white";
    map.getContainer().appendChild(div);
    return div;
}

ShowDistanceControl.prototype.setDelegate = function(delegate){
    var me = this;
    me.delegate = delegate;
}

MapCircle.prototype = {
    constructor: MapCircle,
    level: 11,
    init: function () {
        var me = this;
        me.map = me.map || new BMap.Map(me.id, {
                enableMapClick: false
            });
        me.map.enableScrollWheelZoom();
        me.map.disableDoubleClickZoom();
        /* global BMAP_ANCHOR_BOTTOM_RIGHT */
        me.map.addControl(new BMap.MapTypeControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));
        me.map.addControl(new BMap.ScaleControl());
        me.map.addControl(new BMap.NavigationControl());

        me.initDrawing();

        me.map.addEventListener('zoomend', function () {
            if ($.isArray(me.labelInstance) && me.labelInstance.length > 0) {
                me.labelInstance.forEach(function (overlay) {
                    me.map.removeOverlay(overlay);
                });
            }
            me.map.getZoom() >= 11 && me.drawLabel();
        });

        // var backToShopControl = new BackToShopControl();
        // me.map.addControl(backToShopControl);
        // backToShopControl.setDelegate(me);
        //
        // var showDistanceControl = new ShowDistanceControl();
        // me.map.addControl(showDistanceControl);
        // showDistanceControl.setDelegate(me);
    },
    backToShop:function(){
        var me = this;
        me.map.centerAndZoom(me.shopPosition, 14);
    },
    showDistance:function(show){
        var me = this;
        if(this.distanceLabel){
            for (var i in this.distanceLabel) {
                if (this.distanceLabel.hasOwnProperty(i)) {
                    me.map.removeOverlay(me.distanceLabel[i]);
                }
            }
        }
        if (show) {
            me.distanceLabel =[];
            var points = [];
            if (this.polygons.length) {
                for (var i in this.polygons) {
                    if (this.polygons.hasOwnProperty(i)) {
                        var ps = this.polygons[i].getPath();
                        points = points.concat(ps);
                    }
                }
            }
            for (var i in points) {
                if (points.hasOwnProperty(i)) {
                    var point = points[i];
                    // me.shopPosition
                    var distance = (me.map.getDistance(point,new BMap.Point(me.shopPosition.lng,me.shopPosition.lat))/1000).toFixed(1) + '公里';
                    var label = new BMap.Label(distance,{position : point,offset:new BMap.Size(5,-10)});
                    label.setStyle({
                         fontSize : "12px",
                         maxWidth:"none"
                     });
                    me.distanceLabel.push(label);
                    me.map.addOverlay(label);              // 将标注添加到地图中
                }
            }
        }else{

        }
    },
    setCenter: function (opt) {
        var me = this;
        var cname = opt.cityName || '北京市';
        me.cityName = cname;
        if (me.lastCname === cname) {
        }
        else {
            me.lastCname = cname;
            me.map.reset();
            me.map.setCenter(cname);

            geocoder.getPoint(cname, function (data) {
                me.map.centerAndZoom(new BMap.Point(data.lng || 116.404, data.lat || 39.915), me.level);
            });
        }
    },
    initDrawing: function () {
        var me = this;
        /* global BMAP_DRAWING_POLYGON: false */
        me.drawingManager = me.drawingManager || new BMapLib.DrawingManager(me.map, {
                isOpen: false,
                drawingMode: BMAP_DRAWING_POLYGON,
                drawingToolOptions: {
                    // strokeColor: '#0B71F5',
                    // fillColor: '#0B71F5',
                    // strokeWeight: 2,
                    // strokeOpacity: 1,
                    // fillOpacity: 0.3,
                    // enableClicking: true
                }
            });
        me.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
        me.drawingManager.addEventListener('polygoncomplete', function (e, ploygon) {
            if (ploygon.getPath().length < 3) {
                me.map.removeOverlay(ploygon);
                // toastr.error('不是多边形');
                console.log('不是多边形');
                return;
            };
            // ploygon.setFillColor('#D9B6EA');
            ploygon.addEventListener("lineupdate",function(){
                me.refreshDistancce();
            })
            me.polygons.push(ploygon);
            ploygon.enableEditing();
            if (me.distanceOn) {
                me.showDistance(true)
            };
        });
    },
    refreshDistancce:function(){
        var me = this;
        if(me.distanceOn){
            me.showDistance(false)
            me.showDistance(true)
        }
    },
    addPloygon: function (polygon) {
        this.polygons.push(polygon);
        return this;
    },
    setPolygons: function (polygons) {
        this.polygons = polygons;
        return this;
    },
    drawPolygons: function (arr, enableEditing){
        var me = this;
        var regions = [];
        if (arr && arr.length) {
            for (var j = 0; j < arr.length; j++) {
                var bdPoints = [];
                var points = arr[j];

                for (var i = 0; i < points.length; i++) {
                    var point = points[i];
                    if (point.x && point.y) {
                        point = getLonlat(point);
                    }
                    var lat = point.lat || point.latitude ;
                    var lng = point.lng || point.longitude;
                    if (lat && lng) {
                        var bdPoint = new BMap.Point(lng,lat);
                        bdPoints.push(bdPoint);
                    };
                };
                if (!$.isArray(arr[j]) && arr[j].label) {

                }
                var polygon = new BMap.Polygon(bdPoints,
                {
                    strokeColor: '#0B71F5',
                    fillColor: '#0B71F5',
                    strokeWeight: 2,
                    strokeOpacity: 1,
                    fillOpacity: 0.3,
                    enableClicking: true,
                    // enableEditing:true
                });
                // polygon.enableEditing();
                me.map.addOverlay(polygon);
                regions.push(polygon);
            };
        };
        me.polygons = regions;
        me.resetViewport();
        if (enableEditing) {
            me.edit(true);
        }
        return me;
    },
    drawBackPolygons: function (arr){
        var me = this;
        me.labels = [];
        var regions = [];
        if (arr && arr.length) {
            for (var j = 0; j < arr.length; j++) {
                var bdPoints = [];
                var points = arr[j];

                if ($.isArray(arr[j])) {
                    points = arr[j];
                } else {
                    points = arr[j].points;
                }
                for (var i = 0; i < points.length; i++) {
                    var point = points[i];
                    if (point.x && point.y) {
                        point = getLonlat(point);
                    }
                    var lat = point.lat || point.latitude ;
                    var lng = point.lng || point.longitude;
                    if (lat && lng) {
                        var bdPoint = new BMap.Point(lng,lat);
                        bdPoints.push(bdPoint);
                    };
                };

                var polygon = new BMap.Polygon(bdPoints,
                {
                    strokeColor: '#0B71F5',
                    fillColor: '#000000',
                    strokeWeight: 1,
                    strokeOpacity: 1,
                    fillOpacity: 0.2,
                    enableClicking: false,
                    // enableEditing:true
                });
                if (!$.isArray(arr[j]) && arr[j].label) {
                    let label = {
                        label: arr[j].label,
                        point: me.getLabelPosition(bdPoints)
                    };

                    me.labels.push(label)
                }
                // polygon.enableEditing();
                me.map.addOverlay(polygon);
                
                regions.push(polygon);
            };
        };
        me.drawLabel();
        me.backPolygons = regions;
        return me;
    },
    getLabelPosition: function (points) {
        let max = {
            lng: -1,
            lat: -1
        };
        let min = {
            lng: 9999,
            lat: 9999
        };
        for (let i = 0, len = points.length; i < len; i++) {
            let lat = points[i].lat;
            let lng = points[i].lng;

            if (lng > max.lng) {
                max.lng = lng;
            }

            if (lng < min.lng) {
                min.lng = lng;
            }

            if (lat > max.lat) {
                max.lat = lat;
            }

            if (lat < min.lat) {
                min.lat = lat;
            }            
        }
        return new BMap.Point((max.lng + min.lng) / 2, (max.lat + min.lat) / 2);
    },
    setAOIPolygons: function (polygons) {
        this.aoiPolygons = polygons;
        return this;
    },
    setAllDeliveryRegions: function (arr) {
        var me = this;

        me.allDeliveryRegions = [];
        var takeout_deliver_regions = [];
        for (var i = 0; i < arr.length; i++) {
            takeout_deliver_regions = takeout_deliver_regions.concat(arr[i].takeout_deliver_regions);
        };
        if (takeout_deliver_regions && takeout_deliver_regions.length) {
            for (var j = 0; j < takeout_deliver_regions.length; j++) {
                var bdPoints = [];
                var points = takeout_deliver_regions[j];
                for (var i = 0; i < points.length; i++) {
                    var point = points[i];
                    var lat = point.lat || point.latitude;
                    var lng = point.lng || point.longitude;
                    if (lat && lng) {
                        var bdPoint = new BMap.Point(lng,lat);
                        bdPoints.push(bdPoint);
                    };
                };
                var polygon = new BMap.Polygon(bdPoints,
                {
                    strokeColor: '#0B71F5',
                    fillColor: '#000',
                    strokeWeight: 2,
                    strokeOpacity: 1,
                    fillOpacity: 0.3,
                    enableClicking: true
                });
                me.allDeliveryRegions.push(polygon);
            };
        };

        return me;
    },
    drawAllDeliveryRegions:function(){
        var me = this;
        for (var i in me.allDeliveryRegions) {
            if (this.allDeliveryRegions.hasOwnProperty(i)) {
                this.map.addOverlay(this.allDeliveryRegions[i]);
            }
        }
    },
    clearDeliveryRegions:function(){
        var me = this;
        for (var i in this.allDeliveryRegions) {
            if (this.allDeliveryRegions.hasOwnProperty(i)) {
                me.map.removeOverlay(me.allDeliveryRegions[i]);
            }
        }
        this.allDeliveryRegions = [];
    },
    setLabels: function (labels) {
        this.labels = labels;
        return this;
    },
    setAOILabels: function (labels) {
        this.aoiLabels = labels;
        return this;
    },
    paintBackPolygons: function (polygons, pointMap) {
        var i;
        for (i in this.backPolygons) {
            if (this.backPolygons.hasOwnProperty(i)) {
                this.map.removeOverlay(this.backPolygons[i]);
            }
        }
        this.backPolygons = polygons;
        this.pointMap = pointMap;
        for (i in this.backPolygons) {
            if (this.backPolygons.hasOwnProperty(i)) {
                this.map.addOverlay(this.backPolygons[i]);
            }
        }
        return this;
    },
    drawAOI:function(){
        var me = this;
        for (var i in this.aoiPolygons) {
            if (this.aoiPolygons.hasOwnProperty(i)) {
                me.map.addOverlay(me.aoiPolygons[i]);
            }
        }

        if ($.isArray(this.aoiLabels) && this.aoiLabels.length > 0) {

            this.aoiLabels.forEach(function (ele) {
                var label = new BMap.Label(ele.label, {
                    position: ele.point,
                    offset: new BMap.Size(-30, -10)    // 设置文本偏移量
                });
                label.setStyle({
                    color: 'red',
                    fontSize: '14px',
                    fontFamily: '微软雅黑',
                    border: 'none',
                    fontWeight: 'bolder',
                    padding: 0
                });
                me.map.addOverlay(label);
            });
        }
    },
    clearAOI:function(){
        var me = this;
        for (var i in this.aoiPolygons) {
            if (this.aoiPolygons.hasOwnProperty(i)) {
                me.map.removeOverlay(me.aoiPolygons[i]);
            }
        }
        this.aoiPolygons = [];
    },
    draw: function () {
        var me = this;
        for (var i in this.polygons) {
            if (this.polygons.hasOwnProperty(i)) {
                me.map.addOverlay(me.polygons[i]);
            }
        }

        return me;
    },
    drawLabel: function () {
        var me = this;
        if ($.isArray(this.labels) && this.labels.length > 0) {

            me.labelInstance = [];

            this.labels.forEach(function (ele) {
                var label = new BMap.Label(ele.label, {
                    position: ele.point,
                    offset: new BMap.Size(-30, -10)    // 设置文本偏移量
                });
                label.setStyle({
                    color: '#ffea00',
                    fontSize: '12px',
                    fontFamily: '微软雅黑',
                    fontWeight: 'bolder',
                    border: 'none',
                    padding: 0
                });
                me.map.addOverlay(label);
                me.labelInstance.push(label);
            });
        }
    },
    open: function () {
        this.drawingManager.open();
        return this;
    },
    close: function () {
        this.drawingManager.close();
        return this;
    },
    edit: function (on) {
        for (var i in this.polygons) {
            if (on) {
                this.polygons[i].enableEditing();
            }
            else {
                this.polygons[i].disableEditing();
            }
        }
        return this;
    },
    dispose: function () {
        for (var i in this.polygons) {
            if (this.polygons.hasOwnProperty(i)) {
                this.map.removeOverlay(this.polygons[i]);
            }
        }
        this.polygons = [];

       
        for (var j in this.labels) {
            if (this.labels.hasOwnProperty(j)) {
                this.map.removeOverlay(this.labels[j]);
            }
        }
        this.labels = [];

        if(this.distanceLabel){
            for (var i in this.distanceLabel) {
                if (this.distanceLabel.hasOwnProperty(i)) {
                    this.map.removeOverlay(this.distanceLabel[i]);
                }
            }
        }
        this.distanceLabel = [];
        return this;
    },
    getPolygons: function () {
        return this.polygons;
    },
    resetViewport: function () {
        var views = [];
        if (this.polygons.length) {
            for (var i in this.polygons) {
                if (this.polygons.hasOwnProperty(i)) {
                    var ps = this.polygons[i].getPath();
                    views = views.concat(ps);
                }
            }
            var b = new BMap.Bounds(views[0], views[1]);
            for (var j = 2, len = views.length; j < len; j++) {
                b.extend(views[j]);
            }
            this.map.setCenter(b.getCenter());
            this.map.setViewport(views);
        }
        else {
            this.map.reset();
            this.map.setCenter(this.cityName);
        }

        return this;
    },

    getPointMap: function () {
        return this.pointMap;
    },
    drawPolygonByPoints:function(points){
        var me = this;
        var bdPoints = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            var lat = point.lat || point.latitude;
            var lng = point.lng || point.longitude;
            if (lat && lng) {
                var bdPoint = new BMap.Point(lng,lat);
                bdPoints.push(bdPoint);
            };
        };
        var polygon = new BMap.Polygon();
        polygon.setFillColor('#D9B6EA');
        polygon.setPath(bdPoints);
        polygon.addEventListener("lineupdate",function(){
            me.refreshDistancce();
        });
        this.addPloygon(polygon);
        this.draw();
        polygon.enableEditing();
        me.resetViewport();
    }
};
export default MapCircle
