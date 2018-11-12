# Forest Generation Cellular Automata

This program uses cellular automata to grow two dimensional, semi-random, tree like structures. The demo shows how it can be used for landscape generation in an interactive scenario.

The node.js interactive demo runs in your terminal. The tree generation algorithm is provided in both node.js and python.


## Installation & Demo

Clone and run.

```bash
git clone https://bitbucket.org/liamilan/forest-generation-cellular-automata.git

npm start
```
This will run an interactive demo where you drive your car in a savanna of cellular automata generated trees.


## Algorithm
The cellular automata's cells have one of two states, living, or dead. Each cell can grow up, left, and right in each turn according to the following probabilities.

1. The probability to grow left is h / 30 out of 1, with h being the height of the cell starting at 0. 
2. The probability to grow right is also h / 30 out of 1.
> A cell is more likely to grow outward the higher it is in the tree. In real trees, this helps outgrow other trees, helping them catch sunlight.
3. The probability to grow up is (1 - (h / 30)) * 0.125 out of 1.
4. A cell will not grow if there is a cell alive somewhere above it (or if it is not alive).
> In real trees, leaves have to be catch sun to grow.


## Tree generation

To run the tree generation node.js version of the automata:
```bash
node automata/automata.js [number of cells to start with]
```
To run the tree generation python version of the automata:
```bash
python automata/automata.py [number of cells to start with]
```

## Author
I am Liam Ilan, a 12 year old software developer who is never working, but always playing around.

## License
[MIT](https://choosealicense.com/licenses/mit/)

