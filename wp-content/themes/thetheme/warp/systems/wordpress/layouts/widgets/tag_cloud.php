<?php
/**
* @package   Warp Theme Framework
* @author    CroDesign http://www.yootheme.com
* @copyright Copyright (C) CroDesign GmbH
* @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
*/
/**
* @package   Warp Theme Framework
* @author    CroDesign http://www.yootheme.com
* @copyright Copyright (C) CroDesign GmbH
* @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
*/

// sort tags
if (!function_exists('_count_sort')) {

    function _count_sort(&$tags)
    {
            $tags = array_merge($tags);
            $sorted_tags = array();
            $prefix = 1;
            for ($i = 0; $i < count($tags); $i++) {
                $sorted_tags[(int) ((count($tags) + ($prefix * $i)) / 2)] = $tags[$i];
                $prefix *= -1;
            }
            ksort($sorted_tags);
            $tags = $sorted_tags;
    }

}

$taxonomy = (!empty($widget->params['taxonomy']) && taxonomy_exists($widget->params['taxonomy'])) ? $widget->params['taxonomy'] : 'post_tag';

$defaults = array(
        'smallest' => 8, 'largest' => 22, 'unit' => 'pt', 'number' => 45,
        'format' => 'flat', 'separator' => "\n", 'orderby' => 'name', 'order' => 'ASC',
        'exclude' => '', 'include' => '', 'link' => 'view', 'taxonomy' => 'post_tag', 'echo' => true
);

$tags = get_terms($taxonomy, array_merge($defaults, array('orderby' => 'count', 'order' => 'DESC')));

if (empty($tags)) return;

foreach ($tags as $key => $tag) {

    $link = get_term_link( intval($tag->term_id), $taxonomy );

    if (is_wp_error($link)) return;

    $tags[ $key ]->link = $link;
    $tags[ $key ]->id = $tag->term_id;
}

_count_sort($tags);

$counts = array();
$real_counts = array(); // For the alt tag

foreach ((array) $tags as $key => $tag) {
    $real_counts[ $key ] = $tag->count;
    $counts[ $key ] = round(log10($tag->count + 1) * 100);
}

$min_count = min( $counts );
$max_count = max( $counts );

$font_span = ($max_count - $min_count) / 100;
$font_class_span = (10 - 1) / 100;

echo '<p>';
foreach ($tags as $key => $tag) {

    $count = $counts[ $key ];
    $tag_link = '#' != $tag->link ? esc_url( $tag->link ) : '#';
    $tag_name = $tags[ $key ]->name;
    $weight = $font_span ? round(1 + (($count - $min_count) / $font_span) * $font_class_span) : 1;

    echo '<a href="'.$tag_link.'">'.$tag_name.'</a> ';
}
echo '</p>';
