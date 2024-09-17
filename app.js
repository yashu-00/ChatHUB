var express = require('express');
var path = require('path');
const http = require('http');
var flash = require('connect-flash');
const socketIo = require('socket.io');
var session = require('express-session')
const passport = require('passport');

const localStrategy = require('./middlewares/local.strategy');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const requestRouter = require('./routes/request')
const searchRouter = require('./routes/search')
const friendRouter = require('./routes/friend')

var app = express();
const server = http.createServer(app);
const io = socketIo(server); // Integrate Socket.io with your server

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const sessionMiddleware = session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
})
app.use(sessionMiddleware);

app.use(flash());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);
app.use('/auth', indexRouter);

const isAuthenticated = require('./middlewares/isauthenticated');
app.use(isAuthenticated);
app.use('/users', usersRouter);
app.use('/request', requestRouter);
app.use('/search', searchRouter);
app.use('/friends', friendRouter)

const users = {};
const messages = {}; // In-memory storage for messages
const { Message } = require('./models/message');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('join', (username) => {
        users[username] = socket.id;
        console.log('User joined:', username, 'with socket ID:', socket.id);

        // Send previous messages to the user when they join
        if (messages[username]) {
            socket.emit('loadMessages', messages[username]);
        }
    });

    socket.on('sendMessage', async (data) => {
        await Message.create({
            sender: data.from,
            recipient: data.to,
            content: data.message,
        });
        const recipientSocketId = users[data.to];

        // Store the message in-memory for both sender and recipient
        if (!messages[data.from]) messages[data.from] = [];
        if (!messages[data.to]) messages[data.to] = [];
        messages[data.from].push({ sender: data.from, content: data.message });
        messages[data.to].push({ sender: data.from, content: data.message });

        console.log('Sending message from', data.from, 'to', data.to);
        console.log('Recipient Socket ID:', recipientSocketId);

        // Send the message to the recipient
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('receiveMessage', data);
        } else {
            console.log('Recipient not connected.');
        }

        // Show the message on the sender's own screen
        socket.emit('receiveMessage', data);
    });
    socket.on('join', async (username, friendUserName) => {
        users[username] = socket.id;

        // Retrieve previous messages from the database
        const chatHistory = await Message.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { sender: username, recipient: friendUserName },
                            { recipient: username, sender: friendUserName }
                        ]
                    },
                    {
                        [Op.or]: [
                            { user_delete: { [Op.ne]: username } }, // user_delete != 'karangupta'
                            { user_delete: { [Op.is]: null } }          // OR user_delete IS NULL
                        ]
                    }
                ]
            },
            order: [['timestamp', 'ASC']]
        });

        // Send previous messages to the user
        socket.emit('loadMessages', chatHistory);
    });


    socket.on('disconnect', () => {
        for (let username in users) {
            if (users[username] === socket.id) {
                delete users[username];
                console.log('User disconnected:', username);
                break;
            }
        }
    });
});

server.listen(8000, () => console.log("Server Started"));