// common.js
// global value
    var DUMMY_SWAGGER_URL_DOMAIN = "http://localhost/landslideAPI/server-side/";


    var _nowLoading = false;
    var _RequestParams = getParam();


//////////////////////////////// auto loader

        function AutoLoader(){
            this.init.apply(this, arguments);
        }
        AutoLoader.prototype = {
            threshold: 1,
            auto: true,
            page: 1,
            maxContentHeight: 1000000,
            loading: false,
            init: function(selector){
                this.window = $(window);
                this.target = $(selector);
                while (this.check()){
                    this.load();
                }
                this.autoLoad();
            },
            check: function(){
                if (!this.auto){
                    return;
                }
                var content = this.target.offset().top + this.target.height();
                var display = this.window.scrollTop() + this.window.height();
                // cl(content);
                // cl(display);
                if (content > this.maxContentHeight){
                    this.auto = false;
                }
                if (content - display < this.threshold && !_nowLoading ){// need to set global _nowLoading
                    return true;
                } else {
                    return false;
                }
            },
            load: function(){
                // 更新処理
                autoLoadAction();
            },
            autoLoad: function(){
                var self = this;
                self.window.scroll(function(){
                    if (self.check()){
                        if (this.loading){
                            return;
                        }
                        this.loading = true;
                        self.load();
                        // 仮に setTimeout で代用。AJAXなどでロードに時間がかかったときは onComplete などで処理します
                        setTimeout(function(){
                            this.loading = false;
                        }, 100);
                    }
                });
            }
        };

////////////////////////////////
var httpRequestJSONDefer =
{
	get: function(url, dataType, dataObj)
	{
                var defer = $.Deferred();
                $.ajax({
                    url: url,
                    data: dataObj,
                    dataType: dataType,
                    success: defer.resolve,
                    error: defer.reject
                });
                return defer.promise();
	},
	post: function(url, dataObj)
	{
                var defer = $.Deferred();
                $.ajax({
                    url: url,
                    data: dataObj,
                    type: "POST",
                    success: defer.resolve,
                    error: defer.reject
                });
                return defer.promise();
	}
}


////////////////////////////////
var httpRequest =
{
	get: function(url, dataType, dataObj, successCallback, failureCallback)
	{
		if(typeof successCallback === 'undefined') successCallback = defaultSuccessCallback;
		if(typeof failureCallback === 'undefined') failureCallback = defaultFailureCallback;
    	    $.ajax({
                  type: "GET",
                  scriptCharset: 'utf-8',
	      url: url,
	      dataType: dataType,
	      data: dataObj,
	      success: function(resData)
	      {
	      	successCallback(resData);
	      },
	      error: function(resData){
	      	failureCallback(resData);
	      }
	   });
	}
}

function defaultSuccessCallback(data)
{
	cl("success - httpRequest");
	cl(data);
}
function defaultFailureCallback(data)
{
	cl("failure - httpRequest");
	cl(data);
}
//////////////////////////////////////////////////////////////////////////////////////////////// - Utils
// page resource

function getParam() {
    if (1 < document.location.search.length) {
        // 最初の1文字 (?記号) を除いた文字列を取得する
                var query = document.location.search.substring(1);
 
                // クエリの区切り記号 (&) で文字列を配列に分割する
        var parameters = query.split('&');
 
                var result = new Object();
                for (var i = 0; i < parameters.length; i++) {
                    // パラメータ名とパラメータ値に分割する
            var element = parameters[i].split('=');
 
                    var paramName = decodeURIComponent(element[0]);
                    var paramValue = decodeURIComponent(element[1]);
 
                    // パラメータ名をキーとして連想配列に追加する
            result[paramName] = decodeURIComponent(paramValue);
        }
        return result;
    }
    return null;
}

//////////////////////////////////////////////////////////////////////////////////////////////// - Utils

function cl(obj)
{
	console.log(obj);
}

function dump(dumped)
{
	$.each(dumped, function(key, value){ cl(key);cl(value);});
}

//////////////////////////////////////////////////////////////////////////////////////////////// - Utils
// other method
    function getYoutubeMovieTag(url)
    {
    	if(!url)return;
    	var textArr = url.split("/");
    	var tag = textArr[textArr.length - 1];
    	tag = tag.replace("watch?v=","");
    	return tag;
    }
    
    function getYoutubeThumbnail(url, num)
    {
    	var tag = getYoutubeMovieTag(url);
    	return "http://i.ytimg.com/vi/"+tag+"/"+num+".jpg";
    }
    function getYoutubeThumbnails(url)
    {
    	var tag = getYoutubeMovieTag(url);
    	var thumbnails = [getYoutubeThumbnail(url,0),getYoutubeThumbnail(url,1),getYoutubeThumbnail(url,2)]
    	return thumbnails;
    }
    
//////////////////////////
///// animation method

function setFadeImage(selecterName)
{
	$('.'+selecterName).unbind();
	$('.'+selecterName+' img:gt(0)').hide();
	setInterval(function() {
		$('.'+selecterName+' :first-child').fadeOut().next('img').fadeIn().end().appendTo('.'+selecterName);
	},getRandFromRange(1500,2000));
}

//////////////////////////
//// math medthod
function getRandFromRange(lower, upper)
{
	var range = upper - lower;
	return Math.floor( Math.random() * range );
}
