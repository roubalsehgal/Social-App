const HttpStatus = require('http-status-codes');

const User = require('../models/userModels');

module.exports = {
	FollowUser(req, res) {
		const followUser = async () => {
			await User.update(
				{
					_id: req.user._id,
					'following.userFollowed': { $ne: req.body.userFollowed }
				},
				{
					$push: {
						following: {
							userFollowed: req.body.userFollowed
						}
					}
				}
			);

			await User.update(
				{
					_id: req.body.userFollowed,
					'following.follower': { $ne: req.user._id }
				},
				{
					$push: {
						followers: {
							follower: req.user._id
						},
						notifications: {
							senderId: req.user._id,
							message: `${req.user.username} is now following you.`,
							created: new Date()
						}
					}
				}
			);
		};

		followUser()
			.then(() => {
				res.status(HttpStatus.OK).json({ message: 'Following user now' });
			})
			.catch(err => {
				res
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json({ message: 'Error Following user' });
			});
	},

	UnFollowUser(req, res) {
		const unFollowUser = async () => {
			await User.update(
				{
					_id: req.user._id
				},
				{
					$pull: {
						following: {
							userFollowed: req.body.userFollowed
						}
					}
				}
			);

			await User.update(
				{
					_id: req.body.userFollowed
				},
				{
					$pull: {
						followers: {
							follower: req.user._id
						}
					}
				}
			);
		};

		unFollowUser()
			.then(() => {
				res.status(HttpStatus.OK).json({ message: 'Unfollowing user now' });
			})
			.catch(err => {
				res
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json({ message: 'Error UnFollowing user' });
			});
	},

	async MarkNotification(req, res) {
		if (!req.body.deleteValue) {
			await User.updateOne(
				{
					_id: req.user._id,
					'notifications._id': req.params.id
				},
				{
					$set: {
						'notifications.$.read': true
					}
				}
			)
				.then(() => {
					res.status(HttpStatus.OK).json({ message: 'Marked as read' });
				})
				.catch(err => {
					res
						.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.json({ message: 'error marking as read' });
				});
		} else {
			await User.update(
				{
					_id: req.user._id,
					'notifications._id': req.params.id
				},
				{
					$pull: {
						notifications: {
							_id: req.params.id
						}
					}
				}
			)
				.then(() => {
					res
						.status(HttpStatus.OK)
						.json({ message: 'Notification deleted successfully' });
				})
				.catch(err => {
					res
						.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.json({ message: 'Error Deleting Notification' });
				});
		}
	},

	async MarkAllNotifications(req, res) {
		await User.update(
			{
				_id: req.user._id
			},
			{
				$set: {
					'notifications.$[elem].read': true
				}
			},
			{
				arrayFilters: [{ 'elem.read': false }], //MongoDB functions
				multi: true
			}
		)
			.then(() => {
				res
					.status(HttpStatus.OK)
					.json({ message: 'Marked All Notifications successfully' });
			})
			.catch(err => {
				res
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json({ message: 'Error Marking All Notifications' });
			});
	}
};
