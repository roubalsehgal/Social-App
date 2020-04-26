module.exports = function(io, User, _) {
	const userData = new User();

	io.on('connection', socket => {
		//console.log('User connected');
		socket.on('refresh', data => {
			io.emit('refreshPage', {});
		});

		socket.on('online', data => {
			socket.join(data.room);
			userData.EnterRoom(socket.id, data.user, data.room);
			const list = userData.GetList(data.room);
			io.emit('usersOnline', _.uniq(list));
		});

		socket.on('disconnect', () => {
			const user = userData.RemoveUser(socket.id);
			//console.log(user);
			if (user) {
				const userArray = userData.GetList(user.room);
				const arr = _.uniq(userArray);
				//console.log(arr);
				_.remove(arr, n => n === user.name);
				io.emit('usersOnline', arr);
			}
		});
	});
};
