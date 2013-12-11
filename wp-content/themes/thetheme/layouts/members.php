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
						<style>
						input[type="submit"]{display:block;margin:10px 0px}
						label{display: block;margin:10px 0px}
						.parcel-add-form{margin: 10px;display: block;padding: 5px 15px;border: 1px solid gray; border-radius: 5px;width:500px}
						.parcel-add-form h2{display: block;font-size: 20px;margin:5px 0px}
						.parcel-add-form h2 span:first-child{margin-left:20px}
						.parcel-add-form h2 span{font-size: 15px;color:gray}
						</style>

						<div ng-controller="PostDatesCtrl" ng-cloak style="background:white;color:black">
							<div ng-form="post-date-add-form">
								<label for="post-date">Select a Date
								<input name="post-date" type="text" ng-model="postDate.date" placeholder="MM/DD/YYYY"/>
								</label>
								<div ng-if="postDateValid()">
								<span>{{postDate.parcels.length}} Parcel(s)</span>
								<a href="javascript:;" ng-click="addParcel()">Add a Parcel</a>
								</div>
						    <div ng-repeat="parcel in postDate.parcels">
								<div ng-form="parcel-add-form" class="parcel-add-form subform" ng-if="postDate.date">
									  <h2>Parcel #{{$index + 1}}</h2>
										<label for="post-company" style="display:inline-block">Company
										<select name="parcel-company" ng-required="true" ng-model="parcel.company" ng-options="company as company.name for company in companies">
								        <option value="">-- Choose Company --</option>
								    </select></label>
									<label for="parcel-member-id" style="display:inline-block" ng-if="parcel.company">Member
									<select name="parcel-member-idr" ng-required="true" ng-model="parcel.memberId" ng-options="member.id as member.name for member in parcel.company.members">
							        <option value="">Select Member</option>
							    </select>
							   </label>
									<label for="parcel-file">File
									<input name="parcel-file" type="file" ng-model="parcel.file"/>
								</label>
									<label for="parcel-notify-member">Notify Member?
									<input name="parcel-notify-member" type="checkbox" ng-model="parcel.notifyMember" />
									</label>
								<label for="parcel-was-read">Was read?
									<input name="parcel-file" type="checkbox" ng-model="parcel.wasRead"/>
									</label>
									<label for="parcel-was-read">Hold Until
									<input name="parcel-file" type="text" ng-model="parcel.holdDate" placeholder="MM/DD/YYYY"/>
									</label>
									<label for="parcel-forward-address">Forward Address
									<input name="parcel-forward-address" type="text" ng-model="parcel.forwardAddress" placeholder="name@email.com"/>
									</label>


								</div>
								</div>
								<input type="submit" value="Save Post Date"/>
							</div>
						</div>
						<?php if ( !is_user_logged_in() ) : ?>
								<p class="warning">
									<?php _e('You must be logged in to view this content.', 'members'); ?>
								</p><!-- .warning -->
						<?php else : ?>
							<?php if ( count($error) > 0 ) echo '<p class="error">' . implode("<br />", $error) . '</p>'; ?>

						<?php endif; ?>
					</div><!-- .entry-content -->
				</div><!-- .hentry .post -->
    <?php endwhile; ?>
<?php endif; ?>

			</article>
