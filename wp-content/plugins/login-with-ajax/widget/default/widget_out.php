<?php
/*
 * This is the page users will see logged out.
 * You can edit this, but for upgrade safety you should copy and modify this file into your template folder.
 * The location from within your template folder is plugins/login-with-ajax/ (create these directories if they don't exist)
*/
?>
	<div class="lwa lwa-default"><?php //class must be here, and if this is a template, class name should be that of template directory ?>
        <form class="lwa-form uk-form" action="<?php echo esc_attr(LoginWithAjax::$url_login); ?>" method="post">
        	<span class="lwa-status"></span>
            <table>
                <tr class="lwa-username">
                    <td class="lwa-username-label">
                        <label><?php esc_html_e( 'Username','login-with-ajax' ) ?></label>
                    </td>
                    <td class="lwa-username-input">
                        <input type="text" name="log" />
                    </td>
                </tr>
                <tr class="lwa-password">
                    <td class="lwa-password-label">
                        <label><?php esc_html_e( 'Password','login-with-ajax' ) ?></label>
                    </td>
                    <td class="lwa-password-input">
                        <input type="password" name="pwd" />
                    </td>
                </tr>
                <tr><td colspan="2"><?php do_action('login_form'); ?></td></tr>
                <tr class="lwa-submit">
                    <td class="lwa-submit-button">
                        <input type="submit" class="uk-button" name="wp-submit" id="lwa_wp-submit" value="<?php esc_attr_e('Log In', 'login-with-ajax'); ?>" tabindex="100" />
                        <input type="hidden" name="lwa_profile_link" value="<?php echo esc_attr($lwa_data['profile_link']); ?>" />
                        <input type="hidden" name="login-with-ajax" value="login" />
                    </td>
                    <td class="lwa-submit-links">
                        <input name="rememberme" type="checkbox" class="lwa-rememberme" value="forever" /> <label><?php esc_html_e( 'Remember Me','login-with-ajax' ) ?></label>
						<br/><a href="#" class="forgotlink">Lost Password?</a>
					</td>
                </tr>
            </table>
        </form>
		<?php if( !empty($lwa_data['remember']) ): ?>
		<div class="forgotform">
		<form method="post" action="<?php echo site_url('wp-login.php?action=lostpassword', 'login_post') ?>" class="wp-user-form">
			<div class="username">
				<label for="user_login">Enter your username or Email</label>
				<input type="text" class="forgotreg" name="user_login" value="" id="user_login" />
			</div>
			<div class="login_fields">
				<?php do_action('login_form', 'resetpass'); ?>
				<input type="submit" class="uk-button" name="user-submit" value="<?php _e('Reset my password'); ?>" class="user-submit" />
				<?php $reset = $_GET['reset']; if($reset == true) { echo '<p>A message will be sent to your email address.</p>'; } ?>
				<input type="hidden" name="redirect_to" value="<?php echo $_SERVER['REQUEST_URI']; ?>?reset=true" />
				<input type="hidden" name="user-cookie" value="1" />
			</div>
		</form>
		</div>
		<?php endif; ?>
        <?php if( !empty($lwa_data['remember']) ): ?>
        <form class="lwa-remember" action="<?php echo esc_attr(LoginWithAjax::$url_remember) ?>" method="post" style="display:none;">
        	<span class="lwa-status"></span>
            <table>
                <tr>
                    <td>
                        <strong><?php esc_html_e("Forgotten Password", 'login-with-ajax'); ?></strong>
                    </td>
                </tr>
                <tr>
                    <td class="lwa-remember-email">
                        <?php $msg = __("Enter username or email", 'login-with-ajax'); ?>
                        <input type="text" name="user_login" class="lwa-user-remember" value="<?php echo esc_attr($msg); ?>" onfocus="if(this.value == '<?php echo esc_attr($msg); ?>'){this.value = '';}" onblur="if(this.value == ''){this.value = '<?php echo esc_attr($msg); ?>'}" />
                        <?php do_action('lostpassword_form'); ?>
                    </td>
                </tr>
                <tr>
                    <td class="lwa-remember-buttons">
                        <input type="submit" value="<?php esc_attr_e("Get New Password", 'login-with-ajax'); ?>" class="lwa-button-remember" />
                        <a href="#" class="lwa-links-remember-cancel"><?php esc_html_e("Cancel", 'login-with-ajax'); ?></a>
                        <input type="hidden" name="login-with-ajax" value="remember" />
                    </td>
                </tr>
            </table>
        </form>
        <?php endif; ?>
	</div>