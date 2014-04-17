<?php
header("Content-Type: application/json; charset=utf-8");
$keyword = setVar('keyword');

function setVar($name, $default = "0"){
	return isset($_GET[$name])?$_GET[$name]:$default;
}
if($keyword){
	require_once('dummyTokyo.json');
	// echo $keyword;
}else{
	require_once('dummyAll.json');
	// echo 'hoge';
}
?>