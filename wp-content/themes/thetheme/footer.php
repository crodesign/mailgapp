<?php
/**
* @package   theTheme
* @author    CroDesign http://www.yootheme.com
* @copyright Copyright (C) CroDesign GmbH
* @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
*/

// get warp
$warp = require(__DIR__.'/warp.php');

// get content from output buffer and set a slot for the template renderer
$warp['template']->set('content', ob_get_clean());

// load main theme file, located in /layouts/theme.php
echo $warp['template']->render('theme');
