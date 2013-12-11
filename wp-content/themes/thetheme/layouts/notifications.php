<?php
/* Get user info. */
global $current_user, $wp_roles;
get_currentuserinfo();

$error = array();

?>


			<article class="uk-article" <?php if ($permalink) echo 'data-permalink="'.$permalink.'"'; ?>>

<?php if (have_posts()) : ?>
    <?php while (have_posts()) : the_post(); ?>
				<div id="post-<?php the_ID(); ?>">
					<div class="entry-content entry">
						<h1 class="uk-article-title"><?php the_title(); ?></h1>
						<?php the_content(); ?>

						
						
						
					</div><!-- .entry-content -->
				</div><!-- .hentry .post -->
    <?php endwhile; ?>
<?php endif; ?>

			</article>
