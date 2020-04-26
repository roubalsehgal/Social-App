const User = require('../models/userModels');

module.exports = {
	firstUpper: username => {
		const name = username.toLowerCase();
		return name.charAt(0).toUpperCase() + name.slice(1);
	},

	lowerCase: str => {
		return str.toLowerCase();
	},

	updateChatList: async (req, message) => {
		await User.update(
			{
				// For sender
				_id: req.user._id
			},
			{
				$pull: {
					chatList: {
						receiverId: req.params.receiver_Id
					}
				}
			}
		);

		await User.update(
			{
				// For receiver
				_id: req.params.receiver_Id
			},
			{
				$pull: {
					chatList: {
						receiverId: req.user._id
					}
				}
			}
		);

		//User 1
		await User.update(
			{
				_id: req.user._id
			},
			{
				$push: {
					chatList: {
						$each: [
							{
								receiverId: req.params.receiver_Id,
								msgId: message._id
							}
						],
						position: 0
					}
				}
			}
		);

		//User 2
		await User.update(
			{
				_id: req.params.receiver_Id
			},
			{
				$push: {
					chatList: {
						$each: [
							{
								receiverId: req.user._id,
								msgId: message._id
							}
						],
						position: 0
					}
				}
			}
		);
	}
};
