<?php
/*
Plugin Name: Registration Form Widget
Plugin URI:  http://www.wpmania.it/registration-widget/
Description: Add a registration form to your sidebar
Author: Stefano Garuti
Version: 1.0
Author URI: http://www.wpmania.it/
*/

/**
 * Display Registration widget.
 *
 * Displays Registration Form.
 *
 * @param array $args Widget arguments.
 */
function registration_widget($args) {
	global $pagenow;

	if ($_GET['action'] != 'register'){ // we don't want to display this form in the Registration Page
	//mydebug($args);
	extract($args);
	$options = get_option('widget_registration');
	$title = empty($options['title']) ? __('registration') : apply_filters('widget_title', $options['title']);
?>
		<?php echo $before_widget; ?>
			<?php echo $before_title . $title . $after_title; ?>

		<?php the_registration_form($args);	?>
		<?php echo $after_widget; ?>
<?php
}
}
function the_registration_form($args=null) {
	$register_button=__('Register');
	if(isset($args['register_button'])) $register_button = $args['register_button'];
		?>
		<form class="registerform uk-form" name="registerform" id="registerform" action="<?php echo site_url('wp-login.php?action=register', 'login_post') ?>" method="post">

	<p>
			<label><?php _e('Username') ?>:</label><br />
			<input tabindex="1" type="text" name="user_login" id="user_login" class="input" value="<?php echo attribute_escape(stripslashes($user_login)); ?>" size="20" tabindex="10" />
			<br />

			<label for="user_email" id="user_email"><?php _e('E-mail') ?>:</label><br />
			<input tabindex="2" type="text" name="user_email" id="user_email" class="input" value="<?php echo attribute_escape(stripslashes($user_email)); ?>" size="25" tabindex="20" />
			<br />
		</p>

			<?php do_action('register_form'); ?>
		<p id="reg_passmail">
			<?php _e('A password will be emailed to you.') ?>
		</p>
		<p class="submit"><input class="uk-button uk-button-large" tabindex="4" type="submit" name="wp-submit" id="wp-submit" value="<?php echo($register_button) ?>" tabindex="100" /></p>
		<input type="hidden" name="redirect_to" value="/thank-you-for-registering"/></form>
	<?php
}
/**
 * Display and process registration widget options form.
 *
 */
function registration_widget_control() {
	$options = $newoptions = get_option('widget_registration');
	if ( isset($_POST["registration-submit"]) ) {
		$newoptions['title'] = strip_tags(stripslashes($_POST["registration-title"]));
	}
	if ( $options != $newoptions ) {
		$options = $newoptions;
		update_option('widget_registration', $options);
	}
	$title = attribute_escape($options['title']);
?>
			<p><label for="registration-title"><?php _e('Title:'); ?> <input class="widefat" id="registration-title" name="registration-title" type="text" value="<?php echo $title; ?>" /></label></p>
			<input type="hidden" id="registration-submit" name="registration-submit" value="1" />
<?php
}

function registration_widget_init(){
	register_sidebar_widget("Registration Form", "registration_widget");
	register_widget_control("Registration Form","registration_widget_control");
}

add_action("plugins_loaded", "registration_widget_init");
?>