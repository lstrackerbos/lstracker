<?php 

// ソートしてパラメータに距離を付与して返す
function getSortedBydist($queryLat, $queryLng, $forecastData)
{
	$results = array();
	foreach ($forecastData as $forecastData_key => $forecast) {
		$distObj = location_distance($queryLat, $queryLng, $forecast->lat, $forecast->lng);
		$dist = $distObj['distance'];
		$forecast->distance = $dist;
		$results[] = $forecast;
	}
	
	usort($results, function($a, $b) {
	return $a->distance > $b->distance;
	});
	
	return $results;
}

//GPSなどの緯度経度の２点間の直線距離を求める（世界測地系）

//$lat1, $lon1 --- A地点の緯度経度
//$lat2, $lon2 --- B地点の緯度経度
function location_distance($lat1, $lon1, $lat2, $lon2){
	$lat_average = deg2rad( $lat1 + (($lat2 - $lat1) / 2) );//２点の緯度の平均
	$lat_difference = deg2rad( $lat1 - $lat2 );//２点の緯度差
	$lon_difference = deg2rad( $lon1 - $lon2 );//２点の経度差
	$curvature_radius_tmp = 1 - 0.00669438 * pow(sin($lat_average), 2);
	$meridian_curvature_radius = 6335439.327 / sqrt(pow($curvature_radius_tmp, 3));//子午線曲率半径
	$prime_vertical_circle_curvature_radius = 6378137 / sqrt($curvature_radius_tmp);//卯酉線曲率半径
	
	//２点間の距離
	$distance = pow($meridian_curvature_radius * $lat_difference, 2) + pow($prime_vertical_circle_curvature_radius * cos($lat_average) * $lon_difference, 2);
	$distance = sqrt($distance);
	
	$distance_unit = round($distance);
	if($distance_unit < 1000){//1000m以下ならメートル表記
		$distance_unit = $distance_unit."m";
	}else{//1000m以上ならkm表記
		$distance_unit = round($distance_unit / 100);
		$distance_unit = ($distance_unit / 10)."km";
	}
	
	//$hoge['distance']で小数点付きの直線距離を返す（メートル）
	//$hoge['distance_unit']で整形された直線距離を返す（1000m以下ならメートルで記述 例：836m ｜ 1000m以下は小数点第一位以上の数をkmで記述 例：2.8km）
	return array("distance" => $distance, "distance_unit" => $distance_unit);
}	
