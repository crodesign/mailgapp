<?php
/**
* @package   Warp Theme Framework
* @author    CroDesign http://www.yootheme.com
* @copyright Copyright (C) CroDesign GmbH
* @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
*/
printf('<select %s>', $this['field']->attributes(compact('name')));

$selected_value = $this['field']->attributes(compact('value'));

foreach ($this['path']->files("layouts:modules/layouts") as $filename) {

    $option = rtrim($filename, ".php");
    $readable = ucfirst($option);

    $selected = "";
    if ($option == $value) {
        $selected = "selected=\"true\"";
    }

    printf("<option value=\"%s\" %s>%s</option>", $option, $selected, $readable); 

}

printf('</select>');