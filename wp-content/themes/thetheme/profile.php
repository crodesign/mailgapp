<?php
/*
Template Name: Profile
*/
// get warp
$warp = require(__DIR__.'/warp.php');

// load main template file
echo $warp['template']->render('theme');