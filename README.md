# Basic App

This is an extremely basic CRUD webapp. Most of it is boilerplate. It was built on the following stack:

#### Client

-   TypeScript
-   React
-   Axios
-   Webpack

#### Server

-   Node.js
-   TypeScript
-   Express
-   Sequelize
-   PostgreSQL (containerized)

Because this is meant to serve as a sharable demo application, the git repo does contain auth credentials. Don't use this in production or for anything important.

## How to Use

1. Start the Postgres server (database layer, listens on port 5432):
    - Navigate to the `server` directory
    - Run `docker compose up -d`
2. Start the Express server (API layer, listens on port 3001):
    - Run `npm run build` to compile the TypeScript
    - Run `npm start`
    - Keep this terminal open, the process will log API activity in realtime
3. Start the React app dev server (client layer, will open browser to http://localhost:3000/)
    - Navigate to the `client` directory
    - Run `npm start`
    - TypeScript will auto-compile and hot reload as the source is modified

## Other Commands

### Reset the database

This Docker configuration saves the PostgreSQL database locally within `./server/data/db/`. Therefore any data contained inside it will persist even after deleting and rebuilding the container. Run `rm -rf ./server/data/db/*` from the project root to erase it and start over.
