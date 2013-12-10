<?php
/**
* @package   Warp Theme Framework
* @author    CroDesign http://www.yootheme.com
* @copyright Copyright (C) CroDesign GmbH
* @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
*/

if ($table = $this['dom']->create($widget->content)->first('table:first')) {

    foreach ($table->attr() as $name => $value) {
        $table->removeAttr($name);
    }

    echo $table->attr('class', 'calendar')->html();

} else {
    echo $widget->content;
}
