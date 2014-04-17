<?php
require 'haneda_method.php';
require 'latlngFromKeyword.php';
require 'trmmCrawler.php';
header("Access-Control-Allow-Origin: *");

$query = array();
if(isset($_GET['timeRange'])){$query['timeRange'] = $_GET['timeRange'];}else{
	$query['timeRange'] = 1;
}
if(isset($_GET['keyword']))$query['keyword'] = $_GET['keyword'];
if(isset($_GET['lat']))$query['lat'] = $_GET['lat'];
if(isset($_GET['lng']))$query['lng'] = $_GET['lng'];

$res = new stdClass();
$testResponseTxt = 
'{"results":[
{"country":"Japan",
"place":"Tokyo",
"cause":"rain",
"condition":"likely",
"lat": 35.681382,
"lng": 139.766084
},
{"country":"Brazil",
"place":"PORTO NACIONAL",
"cause":"rain",
"condition":"likely",
"lat": -10.12,
"lng": -48.62
},
{"country":"China",
"place":"MEI XIAN",
"cause":"rain",
"condition":"likely",
"lat": 24.12,
"lng": 116.62
},
{"country":"United States",
"place":"SPIRIT OF ST LOUIS",
"cause":"rain",
"condition":"likely",
"lat": 38.62,
"lng": -90.62
}
],
"returnCount":3,
"queryKeyword":"tokyo"
}';

$forecastData = getForecastData($query['timeRange']);

if(isset($query['lat']))
{
	$forecastData = getSortedBydist($query['lat'], $query['lng'], $forecastData);

}else if(isset($query['keyword']))
{
	$geoRes = strAddrToLatLng($query['keyword']);
	$forecastData = getSortedBydist($geoRes['lat'], $geoRes['lng'], $forecastData);
}

//$res->results = $forecastData;//json_decode($testResponseTxt);
$ditinctResult = array();
foreach ($forecastData as $forecastData_key => $place) 
{
	$hasThisPlace = false;
	foreach ($ditinctResult as $ditinctResult_key => $ditinctResult_place) 
	{
		if($ditinctResult_place->lat == $place->lat && $ditinctResult_place->lng == $place->lng)
		{
			$hasThisPlace = true;
			break;
		}
	}
	
	if(!$hasThisPlace)
	{
		array_push($ditinctResult, $place);		
	}
}
$res->results = $ditinctResult;//json_decode($testResponseTxt);
$res->returnCount = count($res->results);
$res->queryKeyword = $query['keyword'];


echo json_encode($res);