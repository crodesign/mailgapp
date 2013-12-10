<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'mailgapp');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '<{bA=5;,[ZZPil-kkM.twkE2*i}ooP]+f,Q#azh:&kY3H^`j?( EN^Y_ ;`]>nSX');
define('SECURE_AUTH_KEY',  ';a[6D|rGdlDpK}|qpv5G&8S4I`UGEWD_md3h7-AYrW(Q[52{*gf+fhMWQ|~W5`O-');
define('LOGGED_IN_KEY',    'u{YGA%XZ%tyZ4Yw*~7OhLABYx*Dx1+}x@KweN :)z2m/LVB*IhCxU#M@C)]Ic/DY');
define('NONCE_KEY',        '4>(#;3Txl:Q3KJ4e:^3!kTHQl%wT&s#)&)Z2|IWndJhW_XD_VPMFBS5RG)7@u1|@');
define('AUTH_SALT',        '-UDp7,N[qJ5@josB<kDI`%j:BLfi85l>?=-|pOE+y!TC,GL{3a?x~KpYIM2RMrBe');
define('SECURE_AUTH_SALT', 'DE}!AJKi+~&An-`yw`G95<yGX0T%jD<b XD71Tt1%oH.d/}qr%m{:?J`2JP)}243');
define('LOGGED_IN_SALT',   'D|:}~@PGF&70 Z$C^FloFO6.lmaNpHy6FZ/[J3?^i)^V%Kp^yi$ *OhaG*~$SwF=');
define('NONCE_SALT',       'HQ^%6ZLtU(XT}$~Iqx#Jyl({K}1tisThfPV<m+VP0Y={v2hg#FwUTz* LB;w_bFj');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');