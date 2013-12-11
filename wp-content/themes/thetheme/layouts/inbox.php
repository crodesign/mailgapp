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
						<?php if ( !is_user_logged_in() ) : ?>
								<p class="warning">
									<?php _e('You must be logged in to view this content.', 'inbox'); ?>
								</p><!-- .warning -->
						<?php else : ?>
							<?php if ( count($error) > 0 ) echo '<p class="error">' . implode("<br />", $error) . '</p>'; ?>

<!--vertical Tabs-->
<div class="uk-margin-bottom uk-clearfix">
<div id="12-10-2013" class="verticalTabs verttabs">
    <ul class="resp-tabs-list">
		<li class="inbox-date">12-10-2013</li>
        <li><div class="inbox-thumb"><img src="../wp-content/uploads/20131202_123231-50x50.jpg" /></div>
			<span class="inbox-sender read">From: Some sender's name 1</span><br />
			<span class="inboxnotes">Held until: 12-30-13</span>
		</li>
        <li><div class="inbox-thumb"><img src="../wp-content/uploads/20131202_123231-50x50.jpg" /></div>
			<span class="inbox-sender">From: Some sender's name 2</span><br />
			<span class="inboxnotes"></span>
		</li>
        <li><div class="inbox-thumb"><img src="../wp-content/uploads/20131202_123231-50x50.jpg" /></div>
			<span class="inbox-sender read">From: Some sender's name 3</span><br />
			<span class="inboxnotes">Will be destroyed</span>
		</li>
        <li><div class="inbox-thumb"><img src="../wp-content/uploads/20131202_123231-50x50.jpg" /></div>
			<span class="inbox-sender">From: Some sender's name 4</span><br />
			<span class="inboxnotes"></span>
		</li>
    </ul>
    <div class="resp-tabs-container">
        <div>
            Select a file from the list to be displayed here.
        </div>
        <div>
			<nav class="uk-navbar">
				<ul class="uk-navbar-nav lft">
					<li><button class="uk-button uk-button-success">Open & Scan</button></li>
					<li>
						<div class="uk-button-dropdown" data-uk-dropdown>
							<button class="uk-button" type="submit">Forward <i class="uk-icon-caret-down"></i></button>
							<div class="uk-dropdown uk-dropdown-small">
							<ul class="uk-nav uk-nav-dropdown">
								<li><a href="">Regular</a></li>
								<li><a href="">Express</a></li>
								<li><a href="">FedEx</a></li>
								<li><a href="">UPS</a></li>
							</ul>
							</div>
						</div>
					</li>
					<li>
						<div class="uk-button-group">
							<button class="uk-button">Hold<input type="text" placeholder="Until" class="holddate"></button>
						</fiv>
					</li>
				</ul>
				<div class="uk-navbar-flip">
				<ul class="uk-navbar-nav">
					<li class="uk-navbar-flip"><button class="uk-button uk-button-danger">Destroy</button></li>
					</li>
				</ul>
				</ul>
			</nav>
			<div class="contentnotes">From: Some Sender 1</div>
			<div class="inbox-image"><a href="../wp-content/uploads/20131202_123231.jpg" target="_blank"><img src="../wp-content/uploads/20131202_123231-1024x802.jpg" /></a></div>
		</div>
        <div>
			<nav class="uk-navbar">
				<ul class="uk-navbar-nav lft">
					<li><button class="uk-button uk-button-success">Open & Scan</button></li>
					<li>
						<div class="uk-button-dropdown" data-uk-dropdown>
							<button class="uk-button" type="submit">Forward <i class="uk-icon-caret-down"></i></button>
							<div class="uk-dropdown uk-dropdown-small">
							<ul class="uk-nav uk-nav-dropdown">
								<li><a href="">Regular</a></li>
								<li><a href="">Express</a></li>
								<li><a href="">FedEx</a></li>
								<li><a href="">UPS</a></li>
							</ul>
							</div>
						</div>
					</li>
					<li>
						<div class="uk-button-group">
							<button class="uk-button">Hold<input type="text" placeholder="Until" class="holddate"></button>
						</fiv>
					</li>
				</ul>
				<div class="uk-navbar-flip">
				<ul class="uk-navbar-nav">
					<li class="uk-navbar-flip"><button class="uk-button uk-button-danger">Destroy</button></li>
					</li>
				</ul>
				</ul>
			</nav>
			<div class="contentnotes">From: Some Sender 2</div>
			<div class="inbox-image"><a href="../wp-content/uploads/20131202_123231.jpg" target="_blank"><img src="../wp-content/uploads/20131202_123231-1024x802.jpg" /></a></div>
		</div>
		<div>
			<nav class="uk-navbar">
				<ul class="uk-navbar-nav lft">
					<li><button class="uk-button uk-button-success">Open & Scan</button></li>
					<li>
						<div class="uk-button-dropdown" data-uk-dropdown>
							<button class="uk-button" type="submit">Forward <i class="uk-icon-caret-down"></i></button>
							<div class="uk-dropdown uk-dropdown-small">
							<ul class="uk-nav uk-nav-dropdown">
								<li><a href="">Regular</a></li>
								<li><a href="">Express</a></li>
								<li><a href="">FedEx</a></li>
								<li><a href="">UPS</a></li>
							</ul>
							</div>
						</div>
					</li>
					<li>
						<div class="uk-button-group">
							<button class="uk-button">Hold<input type="text" placeholder="Until" class="holddate"></button>
						</fiv>
					</li>
				</ul>
				<div class="uk-navbar-flip">
				<ul class="uk-navbar-nav">
					<li class="uk-navbar-flip"><button class="uk-button uk-button-danger">Destroy</button></li>
					</li>
				</ul>
				</ul>
			</nav>
			<div class="contentnotes">From: Some Sender 3</div>
			<div class="inbox-image"><a href="../wp-content/uploads/20131202_123231.jpg" target="_blank"><img src="../wp-content/uploads/20131202_123231-1024x802.jpg" /></a></div>
		</div>
		<div>
			<nav class="uk-navbar">
				<ul class="uk-navbar-nav lft">
					<li><button class="uk-button uk-button-success">Open & Scan</button></li>
					<li>
						<div class="uk-button-dropdown" data-uk-dropdown>
							<button class="uk-button" type="submit">Forward <i class="uk-icon-caret-down"></i></button>
							<div class="uk-dropdown uk-dropdown-small">
							<ul class="uk-nav uk-nav-dropdown">
								<li><a href="">Regular</a></li>
								<li><a href="">Express</a></li>
								<li><a href="">FedEx</a></li>
								<li><a href="">UPS</a></li>
							</ul>
							</div>
						</div>
					</li>
					<li>
						<div class="uk-button-group">
							<button class="uk-button">Hold<input type="text" placeholder="Until" class="holddate"></button>
						</fiv>
					</li>
				</ul>
				<div class="uk-navbar-flip">
				<ul class="uk-navbar-nav">
					<li class="uk-navbar-flip"><button class="uk-button uk-button-danger">Destroy</button></li>
					</li>
				</ul>
				</ul>
			</nav>
			<div class="contentnotes">From: Some Sender 4</div>
			<div class="inbox-image"><a href="../wp-content/uploads/20131202_123231.jpg" target="_blank"><img src="../wp-content/uploads/20131202_123231-1024x802.jpg" /></a></div>
		</div>
    </div>
</div>
</div>

<div class="uk-clearfix"></div>

<!--vertical Tabs-->
<div class="uk-margin-bottom">
<div id="12-3-2013" class="verticalTabs verttabs">
    <ul class="resp-tabs-list">
		<li class="inbox-date">12-3-2013</li>
        <li><div class="inbox-thumb"><img src="../wp-content/uploads/20131202_123231-50x50.jpg" /></div>
			<span class="inbox-sender read">From: Some sender's name 1-2</span><br />
			<span class="inboxnotes">Held until: 12-30-13</span>
		</li>
        <li><div class="inbox-thumb"><img src="../wp-content/uploads/20131202_123231-50x50.jpg" /></div>
			<span class="inbox-sender">From: Some sender's name 2-2</span><br />
			<span class="inboxnotes"></span>
		</li>
        <li><div class="inbox-thumb"><img src="../wp-content/uploads/20131202_123231-50x50.jpg" /></div>
			<span class="inbox-sender read">From: Some sender's name 3-2</span><br />
			<span class="inboxnotes">Forwarded via: FedEx</span>
		</li>
        <li><div class="inbox-thumb"><img src="../wp-content/uploads/20131202_123231-50x50.jpg" /></div>
			<span class="inbox-sender">From: Some sender's name 4-2</span><br />
			<span class="inboxnotes"></span>
		</li>
    </ul>
    <div class="resp-tabs-container">
        <div>
            Select a file from the list to be displayed here.
        </div>
        <div>
			<nav class="uk-navbar">
				<ul class="uk-navbar-nav lft">
					<li><button class="uk-button uk-button-success">Open & Scan</button></li>
					<li>
						<div class="uk-button-dropdown" data-uk-dropdown>
							<button class="uk-button" type="submit">Forward <i class="uk-icon-caret-down"></i></button>
							<div class="uk-dropdown uk-dropdown-small">
							<ul class="uk-nav uk-nav-dropdown">
								<li><a href="">Regular</a></li>
								<li><a href="">Express</a></li>
								<li><a href="">FedEx</a></li>
								<li><a href="">UPS</a></li>
							</ul>
							</div>
						</div>
					</li>
					<li>
						<div class="uk-button-group">
							<button class="uk-button">Hold<input type="text" placeholder="Until" class="holddate"></button>
						</fiv>
					</li>
				</ul>
				<div class="uk-navbar-flip">
				<ul class="uk-navbar-nav">
					<li class="uk-navbar-flip"><button class="uk-button uk-button-danger">Destroy</button></li>
					</li>
				</ul>
				</ul>
			</nav>
			<div class="contentnotes">From: Some Sender 1-2</div>
			<div class="inbox-image"><a href="../wp-content/uploads/20131202_123231.jpg" target="_blank"><img src="../wp-content/uploads/20131202_123231-1024x802.jpg" /></a></div>
		</div>
        <div>
			<nav class="uk-navbar">
				<ul class="uk-navbar-nav lft">
					<li><button class="uk-button uk-button-success">Open & Scan</button></li>
					<li>
						<div class="uk-button-dropdown" data-uk-dropdown>
							<button class="uk-button" type="submit">Forward <i class="uk-icon-caret-down"></i></button>
							<div class="uk-dropdown uk-dropdown-small">
							<ul class="uk-nav uk-nav-dropdown">
								<li><a href="">Regular</a></li>
								<li><a href="">Express</a></li>
								<li><a href="">FedEx</a></li>
								<li><a href="">UPS</a></li>
							</ul>
							</div>
						</div>
					</li>
					<li>
						<div class="uk-button-group">
							<button class="uk-button">Hold<input type="text" placeholder="Until" class="holddate"></button>
						</fiv>
					</li>
				</ul>
				<div class="uk-navbar-flip">
				<ul class="uk-navbar-nav">
					<li class="uk-navbar-flip"><button class="uk-button uk-button-danger">Destroy</button></li>
					</li>
				</ul>
				</ul>
			</nav>
			<div class="contentnotes">From: Some Sender 2-2</div>
			<div class="inbox-image"><a href="../wp-content/uploads/20131202_123231.jpg" target="_blank"><img src="../wp-content/uploads/20131202_123231-1024x802.jpg" /></a></div>
		</div>
		<div>
			<nav class="uk-navbar">
				<ul class="uk-navbar-nav lft">
					<li><button class="uk-button uk-button-success">Open & Scan</button></li>
					<li>
						<div class="uk-button-dropdown" data-uk-dropdown>
							<button class="uk-button" type="submit">Forward <i class="uk-icon-caret-down"></i></button>
							<div class="uk-dropdown uk-dropdown-small">
							<ul class="uk-nav uk-nav-dropdown">
								<li><a href="">Regular</a></li>
								<li><a href="">Express</a></li>
								<li><a href="">FedEx</a></li>
								<li><a href="">UPS</a></li>
							</ul>
							</div>
						</div>
					</li>
					<li>
						<div class="uk-button-group">
							<button class="uk-button">Hold<input type="text" placeholder="Until" class="holddate"></button>
						</fiv>
					</li>
				</ul>
				<div class="uk-navbar-flip">
				<ul class="uk-navbar-nav">
					<li class="uk-navbar-flip"><button class="uk-button uk-button-danger">Destroy</button></li>
					</li>
				</ul>
				</ul>
			</nav>
			<div class="contentnotes">From: Some Sender 3-2</div>
			<div class="inbox-image"><a href="../wp-content/uploads/20131202_123231.jpg" target="_blank"><img src="../wp-content/uploads/20131202_123231-1024x802.jpg" /></a></div>
		</div>
		<div>
			<nav class="uk-navbar">
				<ul class="uk-navbar-nav lft">
					<li><button class="uk-button uk-button-success">Open & Scan</button></li>
					<li>
						<div class="uk-button-dropdown" data-uk-dropdown>
							<button class="uk-button" type="submit">Forward <i class="uk-icon-caret-down"></i></button>
							<div class="uk-dropdown uk-dropdown-small">
							<ul class="uk-nav uk-nav-dropdown">
								<li><a href="">Regular</a></li>
								<li><a href="">Express</a></li>
								<li><a href="">FedEx</a></li>
								<li><a href="">UPS</a></li>
							</ul>
							</div>
						</div>
					</li>
					<li>
						<div class="uk-button-group">
							<button class="uk-button">Hold<input type="text" placeholder="Until" class="holddate"></button>
						</fiv>
					</li>
				</ul>
				<div class="uk-navbar-flip">
				<ul class="uk-navbar-nav">
					<li class="uk-navbar-flip"><button class="uk-button uk-button-danger">Destroy</button></li>
					</li>
				</ul>
				</ul>
			</nav>
			<div class="contentnotes">From: Some Sender 4-2</div>
			<div class="inbox-image"><a href="../wp-content/uploads/20131202_123231.jpg" target="_blank"><img src="../wp-content/uploads/20131202_123231-1024x802.jpg" /></a></div>
		</div>
    </div>
</div>
</div>

<div class="uk-clearfix"></div>

						<?php endif; ?>
					</div><!-- .entry-content -->
				</div><!-- .hentry .post -->
    <?php endwhile; ?>
<?php endif; ?>

			</article>

<script>

</script>
