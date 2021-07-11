const Database = require('../db/config');

module.exports = {
    async create(req, res){
        const db = await Database();
        const pass = req.body.password;
        let roomId = '';
        let isRoom = true;

        while(isRoom){

            // Generate a random 6 digits number for te room
            for (let index = 0; index < 6; index++) {
                roomId += Math.floor(Math.random() * 10).toString();
            }

            // Veryify if the room already exists
            const roomExistIds = await db.all(`SELECT id FROM rooms`);
            isRoom = roomExistIds.some(roomExistId => roomExistId === roomId);
            if(!isRoom){
                // Add the room into the database
               await db.run(`INSERT INTO rooms (id, pass) VALUES (${parseInt(roomId)}, ${pass})`);
           }

        }

        await db.close()

        res.redirect(`/room/${roomId}`);
    },

    async open(req, res){
        const db = await Database();
        const roomId = req.params.room
        const questions = await db.all(`SELECT * FROM questions WHERE room = ${roomId} AND read = 0`);
        const questionsRead = await db.all(`SELECT * FROM questions WHERE room = ${roomId} AND  read = 1`);
        

        res.render('room', {roomId: roomId, questions: questions, questionsRead: questionsRead});
    },

    async enter(req, res){
        const roomId = req.body.roomId;
        res.redirect(`/room/${roomId}`);
    }
}