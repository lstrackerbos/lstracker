<?php
//================================================
// 住所 → 緯度/経度変換
//================================================
function strAddrToLatLng($strAddr)
{
	$url = 
         'http://maps.googleapis.com/maps/api/geocode/json'
        . '?address=' . ( $strAddr)
        . '&sensor=false';
    $strRes = file_get_contents($url
    );
    $aryGeo = json_decode( $strRes, TRUE );
    if ( !isset( $aryGeo['results'][0] ) )
        return '';


    $strLat = (string)$aryGeo['results'][0]['geometry']['location']['lat'];
    $strLng = (string)$aryGeo['results'][0]['geometry']['location']['lng'];
	$res = array();
	$res['lat'] = $strLat;
	$res['lng'] = $strLng;
	
	return $res;
}

