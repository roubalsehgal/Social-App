const Joi = require('joi');
const HttpStatus = require('http-status-codes');
const cloudinary = require('cloudinary');

cloudinary.config({
	cloud_name: 'anheart',
	api_key: '114766588795221',
	api_secret: 'w7X8FpkRxsHVcuKjpihzgDtEz3M'
});

const Post = require('../models/postModels');
const User = require('../models/userModels');

module.exports = {
	AddPost(req, res) {
		const schema = Joi.object().keys({
			post: Joi.string().required()
		});
		const body = {
			post: req.body.post
		};
		const { error } = Joi.validate(body, schema);
		if (error && error.details) {
			return res.status(HttpStatus.BAD_REQUEST).json({ msg: error.details });
		}

		if (req.body.post && !req.body.image && !req.body.video) {
			const body = {
				user: req.user._id,
				username: req.user.username,
				post: req.body.post,
				created: new Date()
			};
			Post.create(body)
				.then(async post => {
					await User.update(
						{
							_id: req.user._id
						},
						{
							$push: {
								posts: {
									postId: post._id,
									post: req.body.post,
									created: new Date()
								}
							}
						}
					);
					res.status(HttpStatus.OK).json({ message: 'Post created', post });
				})
				.catch(err => {
					res
						.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.json({ message: 'Error creating Post' });
				});
		}

		if (req.body.post && req.body.image) {
			cloudinary.uploader.upload(req.body.image, async result => {
				const reqBody = {
					user: req.user._id,
					username: req.user.username,
					post: req.body.post,
					imgId: result.public_id,
					imgVersion: result.version,
					created: new Date()
				};
				Post.create(reqBody)
					.then(async post => {
						await User.update(
							{
								_id: req.user._id
							},
							{
								$push: {
									posts: {
										postId: post._id,
										post: req.body.post,
										created: new Date()
									}
								}
							}
						);
						res
							.status(HttpStatus.OK)
							.json({ message: 'Post created with image', post });
					})
					.catch(err => {
						res
							.status(HttpStatus.INTERNAL_SERVER_ERROR)
							.json({ message: 'Error creating post with Image' });
					});
			});
		}

		if (req.body.post && req.body.video) {
			cloudinary.v2.uploader.upload(
				req.body.video,
				{ resource_type: 'video' },
				async (error, result) => {
					//console.log(result, error);
					const reqBody = {
						user: req.user._id,
						username: req.user.username,
						post: req.body.post,
						vidId: result.public_id,
						vidVersion: result.version,
						created: new Date()
					};
					Post.create(reqBody)
						.then(async post => {
							await User.update(
								{
									_id: req.user._id
								},
								{
									$push: {
										posts: {
											postId: post._id,
											post: req.body.post,
											created: new Date()
										}
									}
								}
							);
							res
								.status(HttpStatus.OK)
								.json({ message: 'Post created with video', post });
						})
						.catch(err => {
							res
								.status(HttpStatus.INTERNAL_SERVER_ERROR)
								.json({ message: 'Error creating post with video' });
						});
				}
			);
		}
	},

	async GetAllPosts(req, res) {
		try {
			const posts = await Post.find({})
				.populate('user')
				.sort({ created: -1 });

			const top = await Post.find({ totalLikes: { $gte: 2 } })
				.populate('user')
				.sort({ created: -1 });

			return res
				.status(HttpStatus.OK)
				.json({ message: 'All posts', posts, top });
		} catch (err) {
			return res
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.json({ message: 'Error getting Posts' });
		}
	},

	async AddLike(req, res) {
		const postId = req.body._id;
		await Post.update(
			{
				_id: postId,
				'likes.username': { $ne: req.user.username }
			},
			{
				$push: {
					likes: {
						username: req.user.username
					}
				},
				$inc: {
					totalLikes: 1
				}
			}
		)
			.then(() => {
				res.status(HttpStatus.OK).json({ message: 'You liked the post' });
			})
			.catch(err =>
				res
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json({ message: 'Error liking the post' })
			);
	},

	async AddComment(req, res) {
		const postId = req.body.postId;
		await Post.update(
			{
				_id: postId
			},
			{
				$push: {
					comments: {
						userId: req.user._id,
						username: req.user.username,
						comment: req.body.comment,
						createdAt: new Date()
					}
				}
			}
		)
			.then(() => {
				res.status(HttpStatus.OK).json({ message: 'Comment added' });
			})
			.catch(err =>
				res
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.json({ message: 'Error adding comment' })
			);
	},

	async GetPost(req, res) {
		await Post.findOne({ _id: req.params.id })
			.populate('user')
			.populate('comments.userId')
			.then(post => {
				res.status(HttpStatus.OK).json({ message: 'Post found', post });
			})
			.catch(err =>
				res.status(HttpStatus.NOT_FOUND).json({ message: 'Post not found' })
			);
	}
};
