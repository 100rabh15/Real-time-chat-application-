
# Real‑Time Chat Application

A real‑time chat app built with **Node.js**, **Express**, and **Socket.IO** featuring:

- ✉️ **Public room chat**
- 🔒 **Private messaging** using `@username` prefix
- 👥 **User presence** with live user list
- 👨‍👩‍👧 **Multiple chat rooms** (enter room name to create/join)

## Demo Screenshot
*(placeholder for your screenshots)*

## Folder Structure
```
realtime-chat-app/
├── public/
│   ├── index.html
│   ├── chat.html
│   ├── styles.css
│   ├── index.js
│   └── chat.js
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## Quick Start
```bash
npm install
npm start
```

Then open **http://localhost:3000** in your browser, choose a username and room, and start chatting!

## Development
```bash
npm run dev   # with nodemon
```

## Tips
- Type <code>@username message</code> to send a private message.
- Open two browser tabs to test presence and private chat.

## License
MIT
