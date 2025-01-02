## Basics of the project

This project was bootstrapped using [Create React App](https://github.com/facebook/create-react-app).

The engine have two modes: the backend mode, and the frontend mode. Simplifying, that determine were the resources of your game are.

The frontend mode is used for general prupose game development

The backend mode is intended for specific visual novel development (include some development tools)(requires use of a backend server).

## Why this project exists

This project aims to provide a base engine for it's use in visual novel video games, but not limited to that.

Since it's written in javascript, you can see the results of changes in your game script in real time.

## Aspect to improve

The engine code is not very well documented (or commented, whatever). 

Sometimes a very rare bug appears. Basically, if you tab out of the engine window and, after a long time, tab back into the window (without clicking inside it), the engine seems to call the draw function twice. This is fixed by simply clicking inside the window, but that's not a decent fix.
