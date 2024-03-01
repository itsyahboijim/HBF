# Hospital Bed Finder

Hospital Bed Finder (HBF, for short) is a commissioned project.
This project mainly serves as a proof of concept into a hospital
bed monitoring project in a larger scale. The project generally
follows the MVC architecture. For the frontend, the project uses
plain HTML/CSS/JavaScript. For the backend it uses Express.js (Node.js)
with EJS as its templating engine.

By the date of writing of this README, the development of this
project has completely stopped, but I might return to this project
to add improvements or to utilize an existing project for learning
new languages or frameworks.

## Who uses Hospital Bed Finder

As this project has ultimately served its purpose of being a proof of
concept, it is no longer being hosted (previously on an AWS EC2 instance)
and has no active users.

## How to get started with the project

1. Clone the repository and install all its dependencies via npm (execute `npm install` from home directory)
2. Deploy the database (MongoDB) that the project uses via `docker compose up -d`
3. Run the server via the command `npm run dev`

## Roadmap / Improvements

I am currently learning React so, in this repository's `backend` branch
it will be repurposed as a backend server for the React frontend.
Such is to be accomplished:

- [ ] Throw errors on routes beginning with `/interface`
- [ ] Disable browser cookie interactions
- [ ] Modify redirects to throw an error instead

In addition, this project was one of the first few projects I had, and as
I have grown as a developer, certain implementations that I have applied here
are becoming unscratchable itches that I must resolve. As such, the following
improvements are to be accomplshed:

- [ ] Change database connection implementation to be more flexible
- [ ] Apply a hashing algorithm for passwords

[^1]:
    This repository's commit history is funky because it was rewritten for
    security purposes, functionality is uncertain past commit [`3263ae7`](https://github.com/itsyahboijim/HBF/commit/3263ae7a2f320975197d52c4a6efee5428993e21)

[^2]: CRITICISM IS WELCOME!!! Please let me know via `Issues` if there are any.
