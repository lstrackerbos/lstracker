<?php
require_once 'simple_html_dom.php';

// データ取得

function getForecastData($forecastType)
{
	
$html = file_get_html('http://trmm.gsfc.nasa.gov/trmm_rain/Events/latest_'.$forecastType.'_day_landslide.html');
$contryHtml = file_get_contents('http://www6.kaiho.mlit.go.jp/isewan/image/flags/_flags.htm');

$preStr = $html->find('pre');
$ret = $preStr[0]->plaintext;
// 半角スペースで区切り
$pices = explode(" ", $ret);
// 空配列の削除
$pices = array_filter($pices);
// 配列の再添字
$pices = array_values($pices);

//データをJSON化
$wordNum = count($pices);
/*
for($i = 0 ; $i < $wordNum; $i += 16){
    $landslidePlaceArray[] = array(
        'country' => $pices[$i + 13],
        'place' => $pices[$i + 11]." ".$pices[$i + 12],
        'cause' => $pices[$i + 2],
        'condition' => $pices[$i + 4],
        'lat' => $pices[$i + 14],
        'lng' => $pices[$i + 15]
    );
}

$json = json_encode($landslidePlaceArray);
*/

// $getContryName = file_get_contents("http://www6.kaiho.mlit.go.jp/isewan/image/flags/_flags.htm",true);

$rowCount = 0;
$numericCount = 0;
$forecastRows = array();
foreach ($pices as $key => $word) {
	if(!isset($forecastRows[$rowCount]))$forecastRows[$rowCount] = array();
	array_push($forecastRows[$rowCount], $word);
	
	if(is_numeric($word))
	{
		$numericCount++;
		if($numericCount % 5 == 0)$rowCount++;
	}
}

//var_dump($forecastRows);
$results = array();

foreach ($forecastRows as $forecastRows_key => $forecast) 
{	
	$wordNum = count($forecast);
	$endWordKey = $wordNum - 2;
	$startWordKey = $wordNum - 5;
	$countryNameFirstKey = 0;
	$countryName = "";
	
	// 国名がどこから始まっているか取得
	for($i = 0; $i < 3; $i++)
	{
		$searchWord = "";
		for($j = $startWordKey + $i; $j <  $endWordKey; $j++)
		{
			$searchWord .= $forecast[$j];
			$searchRes = strstr($contryHtml, $searchWord);
			if($searchRes)
			{
				$countryNameFirstKey = $startWordKey + $i;
				$countryName = $searchWord;
			}
		}
	}
	
	// 国名からさかのぼって地名取得
	$placeName = "";
	$checkFlag = false;
	foreach ($forecast as $forecast_key => $word) 
	{
		if($forecast_key == $countryNameFirstKey)break;
		if($checkFlag)
		{
			$placeName .= $word;
		}
		if($word == "from")
		{
			$checkFlag = true;
		}
	}
	
	$condition = "";
	foreach ($forecast as $forecast_key => $word) 
	{
		if("VERY")
		{
			$condition = "very likely";
		}
		if("LIKELY")
		{
			$condition = "likely";			
		}
	}
	
	
	$res = new stdClass();
	$res->country = $countryName;
	$res->place = $placeName;
	$res->cause = $forecast[2];
	$res->condition = $condition;
	$res->lat = $forecast[count($forecast) - 2];
	$res->lng = $forecast[count($forecast) - 1];
	
	$results[] = $res;	
}

//var_dump($results);
return $results;
}