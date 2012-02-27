Livestats Server
================

To install dependencies, run this command in the terminal:

    npm install

To run the server, type:

    node server.js

Or:

    npm start

Visit:

  http://localhost:8000

Track a hit by opening another browser window and visiting:

    http://localhost:8000/stat?ip=24.18.218.182&title=Bacon

An icon will appear on the original map with the title "Bacon" located near Seattle, USA.

Development
-----------

Install the node-dev package:

    npm install -g node-dev

Run the server with it. It will restart when you edit files:

    node-dev server.js

