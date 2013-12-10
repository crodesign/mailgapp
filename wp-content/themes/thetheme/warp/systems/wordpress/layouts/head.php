<meta charset="<?php bloginfo('charset'); ?>">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<?php if($this['config']->get('responsive', true)): ?>
<meta name="HandheldFriendly" content="True">
<meta name="MobileOptimized" content="320">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<?php endif; ?>
<?php if (isset($error)): ?>
<title><?php echo $error; ?> - <?php echo $title; ?></title>
<?php else: ?>
<title><?php bloginfo('name'); ?> <?php wp_title(); ?></title>
<?php endif; ?>
<link rel="shortcut icon" href="<?php echo $this['path']->url('theme:favicon.ico');?>">
<link rel="apple-touch-icon-precomposed" href="<?php echo $this['path']->url('theme:mailgapp-icon-57.png'); ?>">
<link rel="apple-touch-icon-precomposed" href="<?php echo $this['path']->url('theme:mailgapp-icon-72.png'); ?>">
<link rel="apple-touch-icon-precomposed" href="<?php echo $this['path']->url('theme:mailgapp-icon-114.png'); ?>">
<?php

wp_enqueue_script('jquery');
wp_head();

// set body classes
$this['config']->set('body_classes', implode(' ', get_body_class($this['config']->get('body_classes'))));

// get styles and scripts
$styles  = $this['asset']->get('css');
$scripts = $this['asset']->get('js');

// customizer mode
if ($this['config']['customizer']) {
    foreach ($this['config']['less']['files'] as $file => $less) {
        foreach ($styles as $style) {
            if ($url = $style->getUrl() and substr($url, -strlen($file)) == $file) {
                $style['data-file'] = $file;
                break;
            }
        }
    }
}
// developer mode
else if ($this['config']['dev_mode']) {

    // less files
    $files = array();
	foreach ($styles as $style) {

        if (!$style instanceof Warp\Asset\FileAsset) continue;

		$file = sprintf('less:%s.less', basename($style->getPath(), '.css'));

		if ($this['path']->path($file)) {
            $filter  = $this['assetfilter']->create(array('CssImportResolver', 'CssRewriteUrl'));
            $files[] = array('target' => basename($style->getPath()), 'source' => $this['asset']->createString($this['asset']->createFile($file)->getContent($filter).PHP_EOL.$this['asset']->createFile(sprintf('theme:styles/%s/style.less', $this['config']['style']))->getContent(), array_merge($style->getOptions(), array('type' => 'text/less')))->getContent());
            $styles->replace($style, $this['asset']->createString('', array_merge($style->getOptions(), array('data-file' => basename($style->getPath())))));
        }
    }

    $this['asset']->addString('js', 'var less = { env: "development" }, files = '.json_encode($files).';');
    $this['asset']->addFile('js', 'warp:vendor/jquery/jquery-less.js');
    $this['asset']->addFile('js', 'warp:vendor/jquery/jquery-rtl.js');
    $this['asset']->addFile('js', 'warp:vendor/less/less.js');
    $this['asset']->addFile('js', 'warp:js/developer.js');
}
// compress styles and scripts
else if ($compression = $this['config']['compression'] or $this['config']['direction'] == 'rtl') {

    $options = array();
    $filters = array('CssImportResolver', 'CssRewriteUrl');

    // set options
    if ($compression == 3) {
        $options['Gzip'] = true;
    }

    // set filter
    if ($this['config']['direction'] == 'rtl') {
        $filters[] = 'CssRtl';
    }

    if ($compression >= 2 && ($this['useragent']->browser() != 'msie' || version_compare($this['useragent']->version(), '8.0', '>='))) {
        $filters[] = 'CssImageBase64';
    }

    if ($styles) {
        // cache styles and check for remote styles
        $styles = array($this['asset']->cache('theme.css', $styles, array_merge($filters, array('CssCompressor')), $options));
        foreach ($styles[0] as $style) {
            if ($style->getType() == 'File' && !$style->getPath()) {
                $styles[] = $style;
            }
        }
    }

    if ($scripts) {
        // cache scripts and check for remote scripts
        $scripts = array($this['asset']->cache('theme.js', $scripts, array('JsCompressor'), $options));
        foreach ($scripts[0] as $script) {
            if ($script->getType() == 'File' && !$script->getPath()) {
                $scripts[] = $script;
            }
        }
    }

}

// add styles
if ($styles) {
    foreach ($styles as $style) {
        if ($url = $style->getUrl()) {
            printf("<link %srel=\"stylesheet\" href=\"%s\">\n", isset($style['data-file']) ? 'data-file="'.$style['data-file'].'" ' : '', $url);
        } else {
            printf("<style %s>%s</style>\n", $this['field']->attributes($style->getOptions(), array('base_path', 'base_url')), $style->getContent());
        }
    }
}

// add scripts
if ($scripts) {
    foreach ($scripts as $script) {
        if ($url = $script->getUrl()) {
            printf("<script src=\"%s\"></script>\n", $url);
        } else {
            printf("<script>%s</script>\n", $script->getContent());
        }
    }
}

// add feed link
if (strlen($this['config']->get('rss_url',''))) {
    printf("<link href=\"%s\" rel=\"alternate\" type=\"application/rss+xml\" title=\"RSS 2.0\">\n", $this['config']->get('rss_url'));
}

$this->output('head');

?>

<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular-sanitize.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular-resource.min.js"></script> 
<script src="<?= home_url() ?>/wp-content/themes/thetheme/js/angular/fieldmask.js"></script>
<script src="<?= home_url() ?>/wp-content/themes/thetheme/js/angular/cookie.js"></script>
<script src="<?= home_url() ?>/wp-content/themes/thetheme/js/angular/angular_init.js"></script>
<!--  <script src="<?= home_url() ?>/wp-content/themes/thetheme/js/angular/filters.js"></script>
<script src="<?= home_url() ?>/wp-content/themes/thetheme/js/angular/services.js"></script>
<script src="<?= home_url() ?>/wp-content/themes/thetheme/js/angular/routes.js"></script> 
<script src="<?= home_url() ?>/wp-content/themes/thetheme/js/angular/directives.js"></script> -->
<script src="<?= home_url() ?>/wp-content/themes/thetheme/js/angular/controllers/AppCtrl.js"></script>
<script src="<?= home_url() ?>/wp-content/themes/thetheme/js/angular/controllers/PostDatesCtrl.js"></script>
