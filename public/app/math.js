define(["./line.js"], function (line) {
  var twoPi = Math.PI * 2;
  var rd = Math.PI / 180;
  var dr = 180 / Math.PI;

  function randomSeed() {
    return (Math.random() * 2 - 1) + (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
  }

  var math = {
    // Returns the distance between the point at (x1,y1) to the point at (x2,y2)
    distance: function (x1, y1, x2, y2) {
      return Math.sqrt(math.distanceSquared(x1, y1, x2, y2));
    },
    // Returns the squared distance between the point at (x1,y1) to the point at (x2,y2)
    distanceSquared: function (x1, y1, x2, y2) {
      return Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
    },

    withinDistance: function (x1, y1, x2, y2, distance) {
      return Math.pow(distance, 2) > (Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    },
    randomInRange: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    randomIntInRange: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    radToDeg: function (rad) {
      return rad * dr;
    },
    degToRad: function (deg) {
      return deg * rd;
    },
    randomBm: function () {  //this is from here: http://www.protonfish.com/jslib/boxmuller.shtml
      var x = 0, y = 0, rds, c;

      // Get two random numbers from -1 to 1.
      // If the radius is zero or greater than 1, throw them out and pick two new ones
      // Rejection sampling throws away about 20% of the pairs.
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        rds = x * x + y * y;
      }
      while (rds === 0 || rds > 1);

      // This magic is the Box-Muller Transform
      c = Math.sqrt(-2 * Math.log(rds) / rds);

      // It always creates a pair of numbers. I'll return them in an array. 
      // This function is quite efficient so don't be afraid to throw one away if you don't need both.
      return [x * c, y * c];
    },
    randomNormal: function (mean, stdev) {
      return Math.round(randomSeed() * stdev + mean);
    },
    randomNormalInRange: function (stdev, min, max) {
      var result = math.randomNormal((max + min) / 2, stdev);
      return Math.min(Math.max(result, min), max);
    },

    //Increases the value by delta modulo mod
    incMod: function (value, delta, mod) {
      return (value + delta) % mod;
    },

    //Increases the value by delta but it cannot be less than min
    incMin: function (value, delta, min) {
      return Math.max(value + delta, min);
    },

    //Increases the value by delta but it cannot be more than max
    incMax: function (value, delta, max) {
      return Math.min(value + delta, max);
    },

    //Returns the points where the line l intersects the circle (x-p)^2+(y-q)^2=r^2
    //The returned format is {x1,y1,x2,y2} if one or two points exist, and {} if there is no intersection;
    //If only one point exists then x1 == x2 and y1 == y2
    lineCircleIntersection: function (l, p, q, r) {
      var tx, ty, result = {};

      if (l.m === Infinity) {
        result = this.lineCircleIntersection(0, l.c, -q, p, r); //Flip everything 90 degrees CCW
        if (result.x1) {
          tx = result.x1;
          ty = result.y1;
          result.y1 = -tx;
          result.x1 = ty;

          tx = result.x2;
          ty = result.y2;
          result.y2 = -tx;
          result.x2 = ty;
        }
        return result;
      }
      //Calculation the quadratic equation Ax^2+Bx+C = 0
      var A = l.m * l.m + 1;
      var B = 2 * (l.m * l.c - l.m * q - p);
      var C = q * q - r * r + p * p - 2 * l.c * q + l.c * l.c;
      var discriminant = B * B - 4 * A * C;
      if (discriminant < 0) {
        return result;
      }
      if (A === 0) {
        return result;
      }
      result.x1 = (-B + Math.sqrt(discriminant)) / (2 * A);
      result.y1 = l.m * result.x1 + l.c;

      result.x2 = (-B - Math.sqrt(discriminant)) / (2 * A);
      result.y2 = l.m * result.x2 + l.c;

      return result;
    },

    //Returns a line tangent to the circle (x-p)^2+(y-q)^2=r^2 at the point (x0,y0)
    //The function assumes that x,y are on the circle perimeter (this is not checked to avoid numeric errors)
    circleTangent: function (x0, y0, p, q, r) {
      var perpendicular = line.getLineByPoints(x0, y0, p, q);
      return line.getPerpendicularLine(perpendicular, x0, y0);
    }
  }

  math.twoPI = twoPi;
  math.line = line;
  return math;
});