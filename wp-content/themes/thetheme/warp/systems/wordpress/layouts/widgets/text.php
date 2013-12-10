<?php
/**
* @package   Warp Theme Framework
* @author    CroDesign http://www.yootheme.com
* @copyright Copyright (C) CroDesign GmbH
* @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
*/

$content = trim($widget->content);

if (preg_match('/^<div class="textwidget">/i', $content)) {
    $content = substr($content, 24, -6);
}

echo $content;
