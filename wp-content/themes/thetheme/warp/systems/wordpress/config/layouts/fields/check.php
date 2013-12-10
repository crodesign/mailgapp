<?php
/**
* @package   Warp Theme Framework
* @author    CroDesign http://www.yootheme.com
* @copyright Copyright (C) CroDesign GmbH
* @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
*/

// check common
$this['check']->checkCommon();

// check writable
foreach (array($this['path']->path('cache:'), $this['path']->path('theme:')) as $directory) {
    $this['check']->checkWritable($directory);
}

// output
$critical = $this['check']->getIssues('critical');
$notice   = $this['check']->getIssues('notice');

if ($critical || $notice) {

    $label = array();

    if ($critical) {
        $label[] = count($critical).' critical';
    }

    if ($notice) {
        $label[] = count($notice).' potential';
    }

    echo '<a href="#" class="systemcheck-link '.($critical ? 'critical' : '').'">'.implode(' and ', $label).' issue(s) detected.</a>';
    echo '<ul class="systemcheck">';
    echo implode('', array_map(function($message) { return "<li class=\"critical\">{$message}</li>"; }, $critical));
    echo implode('', array_map(function($message) { return "<li>{$message}</li>"; }, $notice));
    echo '</ul>';

} else {
    echo "Warp engine operational and ready for take off.";
}
