<?php
/**
* @package   theTheme
* @author    CroDesign http://www.yootheme.com
* @copyright Copyright (C) CroDesign GmbH
* @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
*/

return array(

    'path' => array(
        'theme'   => array(__DIR__),
        'js'      => array(__DIR__.'/js', __DIR__.'/custom/js'),
        'css'     => array(__DIR__.'/css', __DIR__.'/custom/css'),
        'less'    => array(__DIR__.'/less', __DIR__.'/custom/less'),
        'layouts' => array(__DIR__.'/layouts', __DIR__.'/custom/layouts')
    ),

    'less' => array(

        'vars' => array(
            'less:theme.less'
        ),

        'files' => array(
            '/css/theme.css' => 'less:theme.less'
        )

    ),

    'cookie' => $cookie = md5(__DIR__),

    'customizer' => isset($_COOKIE[$cookie])

);
