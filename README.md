# Battleship
A battleship game web app written using vanilla JavaScript with Jest as a testing library. The project uses drag'n'drop events for placing ships on the gameboard, with [DragDropTouch](https://github.com/Bernardo-Castilho/dragdroptouch) as a polyfill for enabling HTML5 drag drop support on mobile (touch) devices.


# Available Scripts
## dev
run `npm run dev` in the main directory to build the project into `/dist` using parcel and serve it on `localhost:1234`
## test
run `npm run test` in the main directory to run test suites in `/src/modules/tests` using Jest.
## build
run `npm run build` in the main directory to bundle the project into `/dist` with parcel for deploying.