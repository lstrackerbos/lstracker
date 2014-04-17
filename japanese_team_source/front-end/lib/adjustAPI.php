<?php
require_once 'simple_html_dom.php';
$html = file_get_html('http://trmm.gsfc.nasa.gov/trmm_rain/Events/latest_1_day_landslide.html');
$ret = $html->find('pre')[0]->plaintext;

// print_r($ret);
echo $ret;

