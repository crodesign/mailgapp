<?php
/*
Template Name: Members
*/
// get warp
$warp = require(__DIR__.'/warp.php');

// load main template file
echo $warp['template']->render('theme');
?>