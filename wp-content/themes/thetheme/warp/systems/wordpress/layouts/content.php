<?php
/**
* @package   Warp Theme Framework
* @author    CroDesign http://www.yootheme.com
* @copyright Copyright (C) CroDesign GmbH
* @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
*/

global $wp_query;

$queried_object = $wp_query->get_queried_object();

// output content from header/footer mode
if ($this->has('content')) {
    return $this->output('content');
}

$content = '';

if (is_home()) {
    $content = 'index';
} elseif (is_page()) {
    if (is_page_template('profile.php')){
        $content = 'profile';
    } else if (is_page_template('companies.php')){
        $content = 'companies';
    } else if (is_page_template('inbox.php')){
        $content = 'inbox';
    } else if (is_page_template('members.php')){
        $content = 'members';
    } else if (is_page_template('notifications.php')){
        $content = 'notifications';
    } else if (is_page_template('register.php')){
        $content = 'register';
    } else {
        $content = 'page';
    }
} elseif (is_attachment()) {
    $content = 'attachment';
} elseif (is_single()) {

    $content = 'single';

    if ($this["path"]->path("layouts:{$queried_object->post_type}.php")) {
        $content = $queried_object->post_type;
    }

} elseif (is_search()) {
    $content = 'search';
} elseif (is_archive() && is_author()) {
    $content = 'author';
} elseif (is_archive()) {

    $content = 'archive';

    if ($this["path"]->path("layouts:{$queried_object->taxonomy}.php")) {
        $content = $queried_object->taxonomy;
    }

} elseif (is_404()) {
    $content = '404';
}

echo $this->render(apply_filters('warp_content', $content));



