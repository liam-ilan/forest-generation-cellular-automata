import random
import time
import os
import sys

arguments = sys.argv

# record itteration
iteration = 0

def make_world(w, h):
  return [[0 for x in range(w)] for y in range(h)]

def evolve(world):

  # init res
  res = make_world(len(world[0]), len(world))

  # set res to world without refrencing problems.
  for y in range(len(world)):
    for x in range(len(world[y])):
      res[y][x] = world[y][x]

  # record which collum has growed here
  collumGrowed = [0] * len(world[0])

  for y in range(len(world)):
    for x in range(len(world[y])):
      # if cell is living, the collum has not grown yet, and not on edge.
      if y > 0 and y < len(world) and x > 0 and x < len(world[y]) - 1 and world[y][x] == 1 and collumGrowed[x] == 0:
        # this collum has grown
        collumGrowed[x] = 1

        # calculate chance for horizontal movement
        horzChance = float(len(world) - 1 - y) / 30
        if random.random() < horzChance:
          res[y][x + 1] = 1;

        if random.random() < horzChance:
          res[y][x - 1] = 1;

        if random.random() < ((1 - horzChance) * 0.125):
          res[y - 1][x] = 1;

  return res


def render(world):
  for y in range(len(world)):
    string = ''
    for x in range(len(world[y])):
      string = string + str(world[y][x]).replace('0', ' ').replace('1', 'x')
    if(y > len(world) - 5):
      print('\x1b[37m' + string)
    else:
      print('\x1b[32m' + string)

  print(iteration)


height, width = os.popen('stty size', 'r').read().split()
w = make_world(int(width), int(height) - 1)


if not len(sys.argv) < 2:
  n = int(sys.argv[1]) + 1
  for x in xrange(1,n):
    w[len(w) - 1][int(len(w[0]) / n) * x] = 1


  for x in xrange(0,90):
    iteration += 1
    time.sleep(0.1)
    w = evolve(w)
    render(w)
else:
  print('Error: please give a number')
