const cloudinary = require('cloudinary');
const HttpStatus = require('http-status-codes');

const User = require('../models/userModels');

cloudinary.config({
	cloud_name: 'anheart',
	api_key: '114766588795221',
	api_secret: 'w7X8FpkRxsHVcuKjpihzgDtEz3M'
});

module.exports = {
	UploadImage(req, res) {
		cloudinary.uploader.upload(req.body.image, async result => {
			console.log(result);

			await User.update(
				{
					_id: req.user._id
				},
				{
					$push: {
						images: {
							imgId: result.public_id,
							imgVersion: result.version
						}
					}
				}
			)
				.then(() => {
					res
						.status(HttpStatus.OK)
						.json({ message: 'Image uploaded successfully' });
				})
				.catch(err => {
					res
						.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.json({ message: 'Image upload failed' });
				});
		});
	},

	async SetDefaultImage(req, res) {
		const { imgId, imgVersion } = req.params;

		await User.update(
			{
				_id: req.user._id
			},
			{
				picId: imgId,
				picVersion: imgVersion
			}
		)
			.then(() => {
				res.status(HttpStatus.OK).json({ message: 'Default Image set' });
			})
			.catch(err => {
				res
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json({ message: 'Default Image set failed' });
			});
	}
};
