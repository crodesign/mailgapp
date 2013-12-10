<?php
/*
Template Name: Members
*/
// get warp
$warp = require(__DIR__.'/warp.php');

// load main template file
echo $warp['template']->render('theme');
?>

<div ng-controller="PostDatesCtrl" ng-cloak>
	<div ng-form="members-form">
		<input name="postal-date" type="text" ng-model="post_date.date"/>
		<input type="submit" />
	</div>
</div>