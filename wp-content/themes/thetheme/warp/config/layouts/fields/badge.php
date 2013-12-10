<?php
/**
* @package   Warp Theme Framework
* @author    CroDesign http://www.yootheme.com
* @copyright Copyright (C) CroDesign GmbH
* @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
*/

$selectname = $name."[type]";
$textname   = $name."[text]";

printf('<select %s>', $control->attributes(array("name"=>$selectname)));

$type = isset($value['type']) ? $value['type'] : null;
$text = isset($value['text']) ? $value['text'] : null;

foreach ($node->children('option') as $option) {

    // set attributes
    $attributes = array('value' => $option->attr('value'));

    // is checked ?
    if ($option->attr('value') == $type) {
        $attributes = array_merge($attributes, array('selected' => 'selected'));
    }

    printf('<option %s>%s</option>', $control->attributes($attributes), $option->text());
}

printf('</select>');

printf(' <input class="uk-form-width-mini" %s>', $control->attributes(array_merge($node->attr(), array('type' => 'text', 'name' => $textname, 'value' => $text)), array('label', 'description', 'default')));	