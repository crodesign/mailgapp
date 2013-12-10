<?php
/**
* @package   Warp Theme Framework
* @author    CroDesign http://www.yootheme.com
* @copyright Copyright (C) CroDesign GmbH
* @license   http://www.gnu.org/licenses/gpl.html GNU/GPL
*/

namespace Warp\Asset\Filter;

/**
 * Asset filter interface.
 */
interface FilterInterface
{
    public function filterLoad($asset);

    public function filterContent($asset);
}
