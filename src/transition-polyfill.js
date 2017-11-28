// https://github.com/d3/d3-transition/blob/master/src/selection/index.js
import { selection } from 'd3-selection';
import { transition, interrupt } from 'd3-transition';

selection.prototype.transition = selection.prototype.transition || transition;
selection.prototype.interrupt = selection.prototype.interrupt || interrupt;
