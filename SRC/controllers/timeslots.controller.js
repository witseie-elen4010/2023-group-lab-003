const createTimeslot = (req, res, next) => {

    const userId = req.session.userId; //get user id from session

    User.findOne({ $or: [{ userId: userId }] })
        .then(user => {
            if (user) {

                let timeslot = new Timeslot({

                    availabilityTime: req.body.availabilityTime,
                    numberOfStudents: req.body.numberOfStudents,
                    date: req.body.date,
                    userId: userId

                })
                timeslot.save()
                    .then(timeslot => { //associated logged in user with the appointment they schedule

                        return User.findByIdAndUpdate(userId, { $push: { timeslots: timeslot } }, { new: true });

                    }).then(user => {
                        res.redirect('/timeslots');
                        console.log('New timeslot added');

                    })
                    .catch(error => {

                        console.log(error)
                    })
            }

        })
}

module.exports = {
    createTimeslot,
}