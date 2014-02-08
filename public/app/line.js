define({
  //Returns a line between the points (x1,y1) and (x2,y2)
  //The result is {m:<slope of the line>, c:<y value where x == 0>}
  // if x1 == x2 then the result is {m:Infinity, c:<the x value of the line>}
  getLineByPoints: function (x1, y1, x2, y2) {
    if (x1 === x2) {
      return { m: Infinity, c: x1 };
    }
    var m = (y2 - y1) / (x2 - x1);
    var c = y1 - m * x1;
    return { m: m, c: c };
  },

  // Returns a line with slope m that passes through the point (x,y)
  // Slope can be Infinity
  getLineBySlope: function(m, x,y){
    if (m === Infinity){
      return {m:m,c:x};
    }

    return {m:m,c: y - m * x};
  },

  //Returns a line perpendicular to the given line through the point (x,y)
  getPerpendicularLine: function (line, x, y) {
    if (line.m === Infinity) {
      return { m: 0, c: y };
    }

    if (line.m === 0) {
      return { m: Infinity, c: x };
    }

    var m = -1 / line.m;
    var c = y - m * x;
    return { m: m, c: c }
  },

  //Returns a line parallel to the given line through the point (x,y)
  getParallelLine: function (line, x, y) {
    if (line.m === Infinity) {
      return { m: Infinity, c: x };
    }

    var m = line.m;
    var c = y - m * x;
    return { m: m, c: c };
  },

  //Return the angle t between the two lines such that 0 <= t <= pi/2
  angleBetweenLines: function (line1, line2) {
    if (line1.m === Infinity && line2.m === Infinity) {
      return 0;
    }

    if (line1.m === Infinity) {
      return Math.atan(Math.abs(1 / line2.m));
    }

    if (line2.m === Infinity) {
      return Math.atan(Math.abs(1 / line1.m));
    }

    return Math.atan(Math.abs((line1.m - line2.m) / (1 + line1.m * line2.m)));

  },

  //returns the slope corresponding to the given angle, 0 <= angle <= 2*pi
  angleToSlope: function (angle) {
    
    while (angle < 0) {
      angle += Math.PI * 2;
    }

    if (angle >= Math.PI)
      angle -= Math.PI;
    
    if (angle === Math.PI / 2) {
      return Infinity;
    }

    return Math.tan(angle);
  }


});