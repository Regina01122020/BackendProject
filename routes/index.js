var express = require('express');
var router = express.Router();
var User = require('../model/user');

router.get('/', (req, res, next) => {
	return res.render('index.ejs');
});


router.post('/', (req, res, next) => {
	console.log(req.body);
	var personInfo = req.body;


	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConfirm) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConfirm) {

			User.findOne({ email: personInfo.email }, (err, data) => {
				if (!data) {
					var count;
					User.findOne({}, (err, data) => {

						if (data) {
							console.log("if");
							count = data.unique_id + 1;
						} else {
							count = 1;
						}

						var newPerson = new User({
							unique_id: count,
							email: personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConfirm: personInfo.passwordConfirm
						});

						newPerson.save((err, Person) => {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are registered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});

router.get('/login', (req, res, next) => {
	return res.render('login.ejs');
});

router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
		if (data) {

			if (data.password == req.body.password) {
				req.session.userId = data.unique_id;
				res.send({ "Success": "Success!" });

			} else {
				res.send({ "Success": "Wrong password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not registered!" });
		}
	});
});

router.get('/profile', (req, res, next) => {
	console.log("profile");
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
		console.log("data");
		console.log(data);
		if (!data) {
			res.redirect('/');
		} else {
			return res.render('data.ejs', { "name": data.username});
		}
	});
});

router.get('/logout', (req, res, next) => {
	console.log("logout")
	if (req.session) {
		// delete the session object
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

module.exports = router;
