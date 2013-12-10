<?php
/**
* @package   Warp Theme Framework
* @author    CroDesign http://www.yootheme.com
* @copyright Copyright (C) CroDesign GmbH
* @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
*/

global $comments, $comment;

// init vars
$number   = (int) max(isset($widget->params['number']) ? $widget->params['number'] : 5, 1);
$comments = get_comments(array('number' => $number, 'status' => 'approve'));

if ($comments) : ?>
<ul class="uk-list uk-list-line">

    <?php foreach ((array) $comments as $comment) : ?>
    <li>

        <div class="uk-thumbnail uk-align-left">
            <?php echo get_avatar($comment, $size = '35', get_bloginfo('template_url').'/images/comments_avatar.png'); ?>
        </div>

        <h4 class="uk-h5 uk-margin-remove">
            <?php echo get_comment_author_link(); ?>
        </h4>

        <p class="uk-article-meta uk-margin-remove">
            <time datetime="<?php echo get_comment_date('Y-m-d'); ?>" pubdate><?php comment_date(); ?></time>
            | <a class="permalink" href="<?php echo htmlspecialchars(get_comment_link($comment->comment_ID)) ?>">#</a>
        </p>

        <div class="uk-margin">
            <?php comment_text(); ?>
        </div>

    </li>
    <?php endforeach; ?>

</ul>
<?php endif;
