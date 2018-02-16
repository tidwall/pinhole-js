Pinhole = (function(){
	function Pinhole(){
		this.lines = [];
		this.stack = [];
	}
	Pinhole.prototype.begin = function(){
		this.stack.push(this.lines.length);
	}
	Pinhole.prototype.end = function(){
		this.stack.pop();
	}
	Pinhole.prototype.rotate = function(x, y, z){
		var i = 0;
		if (this.stack.length > 0) {
			i = this.stack[this.stack.length-1];
		}
		for (; i < this.lines.length; i++) {
			if (x != 0) {
				this.lines[i].p1 = rotate(this.lines[i].p1, x, 0);
				this.lines[i].p2 = rotate(this.lines[i].p2, x, 0);
			}
			if (y != 0) {
				this.lines[i].p1 = rotate(this.lines[i].p1, y, 1);
				this.lines[i].p2 = rotate(this.lines[i].p2, y, 1);
			}
			if (z != 0) {
				this.lines[i].p1 = rotate(this.lines[i].p1, z, 2);
				this.lines[i].p2 = rotate(this.lines[i].p2, z, 2);
			}
		}
	}
	Pinhole.prototype.translate = function(x, y, z){
		var i = 0;
		if (this.stack.length > 0) {
			i = this.stack[this.stack.length-1];
		}
		for (; i < this.lines.length; i++) {
			this.lines[i].p1.x += x;
			this.lines[i].p1.y += y;
			this.lines[i].p1.z += z;
			this.lines[i].p2.x += x;
			this.lines[i].p2.y += y;
			this.lines[i].p2.z += z;
		}
	}
	Pinhole.prototype.scale = function(x, y, z){
		var i = 0;
		if (this.stack.length > 0) {
			i = this.stack[this.stack.length-1];
		}
		for (; i < this.lines.length; i++) {
			this.lines[i].p1.x *= x;
			this.lines[i].p1.y *= y;
			this.lines[i].p1.z *= z;
			this.lines[i].p2.x *= x;
			this.lines[i].p2.y *= y;
			this.lines[i].p2.z *= z;
		}
	}
	Pinhole.prototype.colorize = function(color){
		var i = 0;
		if (this.stack.length > 0) {
			i = this.stack[this.stack.length-1];
		}
		for (; i < this.lines.length; i++) {
			this.lines[i].color = color;
		}
	}
	Pinhole.prototype.center = function(){
		var i = 0;
		if (this.stack.length > 0) {
			i = this.stack[this.stack.length-1];
		}
		var minx = Number.POSITIVE_INFINITY;
		var miny = Number.POSITIVE_INFINITY;
		var minz = Number.POSITIVE_INFINITY;
		var maxx = Number.NEGATIVE_INFINITY;
		var maxy = Number.NEGATIVE_INFINITY;
		var maxz = Number.NEGATIVE_INFINITY;
		for (; i < this.lines.length; i++) {
			if (this.lines[i].p1.x < minx) {
				minx = this.lines[i].p1.x;
			}
			if (this.lines[i].p1.x > maxx) {
				maxx = this.lines[i].p1.x;
			}
			if (this.lines[i].p1.y < miny) {
				miny = this.lines[i].p1.y;
			}
			if (this.lines[i].p1.y > maxy) {
				maxy = this.lines[i].p1.y;
			}
			if (this.lines[i].p1.z < minz) {
				minz = this.lines[i].p1.z;
			}
			if (this.lines[i].p1.z > maxz) {
				maxz = this.lines[i].p1.z;
			}
			if (this.lines[i].p2.x < minx) {
				minx = this.lines[i].p2.x;
			}
			if (this.lines[i].p2.x > maxx) {
				maxx = this.lines[i].p2.x;
			}
			if (this.lines[i].p2.y < miny) {
				miny = this.lines[i].p2.y;
			}
			if (this.lines[i].p2.y > maxy) {
				maxy = this.lines[i].p2.y;
			}
			if (this.lines[i].p2.z < minz) {
				minz = this.lines[i].p2.z;
			}
			if (this.lines[i].p2.z > maxz) {
				maxz = this.lines[i].p2.z;
			}
		}
		var x = (maxx + minx) / 2;
		var y = (maxy + miny) / 2;
		var z = (maxz + minz) / 2;
		this.translate(-x, -y, -z);
	}
	Pinhole.prototype.drawCube = function(minx, miny, minz, maxx, maxy, maxz) {
		this.drawLine(minx, maxy, minz, maxx, maxy, minz)
		this.drawLine(maxx, maxy, minz, maxx, miny, minz)
		this.drawLine(maxx, miny, minz, minx, miny, minz)
		this.drawLine(minx, miny, minz, minx, maxy, minz)
		this.drawLine(minx, maxy, maxz, maxx, maxy, maxz)
		this.drawLine(maxx, maxy, maxz, maxx, miny, maxz)
		this.drawLine(maxx, miny, maxz, minx, miny, maxz)
		this.drawLine(minx, miny, maxz, minx, maxy, maxz)
		this.drawLine(minx, maxy, minz, minx, maxy, maxz)
		this.drawLine(maxx, maxy, minz, maxx, maxy, maxz)
		this.drawLine(maxx, miny, minz, maxx, miny, maxz)
		this.drawLine(minx, miny, minz, minx, miny, maxz)
	}
	Pinhole.prototype.drawDot = function(x, y, z, radius){
		this.drawLine(x, y, z, x, y, z)
		this.lines[this.lines.length-1].scale = 10 / 0.1 * radius;
	}
	Pinhole.prototype.drawLine = function(x1, y1, z1, x2, y2, z2) {
		this.lines.push({
			p1:{x:x1,y:y1,z:z1},
			p2:{x:x2,y:y2,z:z2},
			color:'black',
			scale:1
		})
	}
	Pinhole.prototype.drawCircle = function(x, y, z, radius) {
		var f, l;
		var first, prev;
		var circleSteps = this.circleSteps||45;
		// we go one beyond the steps because we need to join at the end
		for (var i = 0; i <= circleSteps; i++) {
			var d = destination(x, y, (Math.PI*2)/circleSteps*i, radius);
			d.z = z
			if (i > 0) {
				if (i == circleSteps) {
					this.drawLine(l.x, l.y, l.z, f.x, f.y, f.z);
				} else {
					this.drawLine(l.x, l.y, l.z, d.x, d.y, d.z);
				}
				var line = this.lines[this.lines.length-1]
				line.nocaps = false;
				//line.circle = true;
				if (!first) {
					first = line;
				}
				line.cfirst = first;
				line.cprev = prev;
				if (prev) {
					prev.cnext = line;
				}
				prev = line;
	
			} else {
				f = d;
			}
			l = d;
		}
	}
	function capsInsert(caps, x, y, z){
		var key = x+":"+y+":"+z;
		if (!caps[key]){
			caps[key] = true;
			return true;
		}
		return false;
	}
	function compareLines(a, b){
		var az = Math.min(a.p1.z, a.p2.z);
		var bz = Math.min(b.p1.z, b.p2.z);
		if (az > bz){
			return -1;
		} else if (az < bz) {
			return +1;
		}
		var ay = Math.min(a.p1.y, a.p2.y);
		var by = Math.min(b.p1.z, b.p2.y);
		if (ay < by){
			return -1;
		} else if (ay > by) {
			return +1;
		}
		var ax = Math.min(a.p1.x, a.p2.x);
		var bx = Math.min(b.p1.x, b.p2.x);
		if (ax < bx){
			return -1;
		} else if (ax > bx) {
			return +1;
		}
		return 0;
	}
	Pinhole.prototype.render = function(canvas,opts){
		var optsScale = (opts?opts.scale:null)||1;
		var optsLineWidth = (opts?opts.lineWidth:null)||1;
		var optsBGColor = (opts?opts.bgColor:null)||'white';
		var width = canvas.width;
		var height = canvas.height;
		var c = canvas.getContext("2d")
		this.lines.sort(compareLines);
		for (var i=0;i<this.lines.length;i++){
			this.lines[i].drawcoords = null;
		}
		if (optsBGColor) {
			c.fillStyle = optsBGColor;
			c.fillRect(0, 0, width, height);
		}
		var capsMap = {};
		var caps;
		var ccolor;
		var focal = Math.min(width, height) / 2;
		function maybeDraw(line) {
			var p1 = projectPoint(line.p1.x, line.p1.y, line.p1.z, width, height, focal, optsScale)
			var p2 = projectPoint(line.p2.x, line.p2.y, line.p2.z, width, height, focal, optsScale)
			var t1 = lineWidthAtZ(line.p1.z, focal) * optsLineWidth * line.scale;
			var t2 = lineWidthAtZ(line.p2.z, focal) * optsLineWidth * line.scale;
			var cap1, cap2;
			if (!line.nocaps) {
				cap1 = capsInsert(caps, p1.x, p1.y, p1.z);
				cap2 = capsInsert(caps, p2.x, p2.y, p2.z);
			}
			return drawUnbalancedLineSegment(c,
				p1.x, p1.y, p2.x, p2.y,
				t1, t2,
				cap1, cap2,
				line.circle
			)
		}
		for (var i=0;i<this.lines.length;i++){
			var line = this.lines[i];
			if (line.color != ccolor) {
				ccolor = line.color;
				caps = capsMap[ccolor];
				if (!caps){
					caps = {};
					capsMap[ccolor] = caps;
				}
				c.fillStyle = ccolor;
			}
			if (line.circle) {
				if (!line.drawcoords){
					// need to process the coords for all segments belonging to
					// the current circle segment.
					// first get the basic estimates
					var coords = [];
					var seg = line.cfirst;
					while (seg){
						seg.drawcoords = maybeDraw(seg);
						if (!seg.drawcoords) {
							throw("nil!");
						}
						coords.push(seg.drawcoords);
						seg = seg.cnext;

					}
					// next reprocess to join the midpoints
					for (var j = 0; j < coords.length;j++){
						var line1, line2;
						if (j == 0) {
							line1 = coords[coords.length-1];
						} else {
							line1 = coords[j-1];
						}
						line2 = coords[j];
						var midx1 = (line2.x1 + line1.x4) / 2;
						var midy1 = (line2.y1 + line1.y4) / 2;
						var midx2 = (line2.x2 + line1.x3) / 2;
						var midy2 = (line2.y2 + line1.y3) / 2;
						line2.x1 = midx1;
						line2.y1 = midy1;
						line1.x4 = midx1;
						line1.y4 = midy1;
						line2.x2 = midx2;
						line2.y2 = midy2;
						line1.x3 = midx2;
						line1.y3 = midy2;
					}
				}
				// draw the cached coords
				c.beginPath();
				c.moveTo(line.drawcoords.x1-Number.MIN_VALUE, line.drawcoords.y1-Number.MIN_VALUE)
				c.lineTo(line.drawcoords.x2-Number.MIN_VALUE, line.drawcoords.y2-Number.MIN_VALUE)
				c.lineTo(line.drawcoords.x3+Number.MIN_VALUE, line.drawcoords.y3+Number.MIN_VALUE)
				c.lineTo(line.drawcoords.x4+Number.MIN_VALUE, line.drawcoords.y4+Number.MIN_VALUE)
				c.lineTo(line.drawcoords.x1-Number.MIN_VALUE, line.drawcoords.y1-Number.MIN_VALUE)
				c.closePath();
				c.fill();
			} else {
				maybeDraw(line);
			}
		}
	}
	function drawUnbalancedLineSegment(c, x1, y1, x2, y2, t1, t2, cap1, cap2, circleSegment) {
		if (x1 == x2 && y1 == y2) {
			c.beginPath();
			c.arc(x1, y1, t1/2, 0, 2 * Math.PI, false);
			c.closePath();
			c.fill();
			return null;
		}
		var a = lineAngle(x1, y1, x2, y2);
		var d1 = destination(x1, y1, a-Math.PI/2, t1/2);
		var d2 = destination(x1, y1, a+Math.PI/2, t1/2);
		var d3 = destination(x2, y2, a+Math.PI/2, t2/2);
		var d4 = destination(x2, y2, a-Math.PI/2, t2/2);
		if (circleSegment) {
			return {x1:d1.x, y1:d1.y, x2:d2.x, y2:d2.y, x3:d3.x, y3:d3.y, x4:d4.x, y4:d4.y};
		}
		var cubicCorner = 1.0 / 3 * 2; //0.552284749831
		if (cap1 && t1 < 2) {
			cap1 = false;
		}
		if (cap2 && t2 < 2) {
			cap2 = false;
		}
		c.beginPath();
		c.moveTo(d1.x, d1.y);
		if (cap1) {
			var a1 = destination(d1.x, d1.y, a-Math.PI*2, t1*cubicCorner);
			var a2 = destination(d2.x, d2.y, a-Math.PI*2, t1*cubicCorner);
			c.bezierCurveTo(a1.x, a1.y, a2.x, a2.y, d2.x, d2.y);
		} else {
			c.lineTo(d2.x, d2.y);
		}
		c.lineTo(d3.x, d3.y);
		if (cap2) {
			var a1 = destination(d3.x, d3.y, a-Math.PI*2, -t2*cubicCorner);
			var a2 = destination(d4.x, d4.y, a-Math.PI*2, -t2*cubicCorner);
			c.bezierCurveTo(a1.x, a1.y, a2.x, a2.y, d4.x, d4.y);
		} else {
			c.lineTo(d4.x, d4.y);
		}
		c.lineTo(d1.x, d1.y);
		c.closePath();
		c.fill();
		return null;
	}
	// projectPoint projects a 3d point cartesian point to 2d screen coords.
	//     Origin is the center
	//     X is left/right
	//     Y is down/up
	//     Z is near/far, the 0 position is focal distance away from lens.
	function projectPoint(
		x, y, z, // 3d point to project
		w, h, f, // width, height, focal
		scale // scale
	) { // projected point
		x = x*scale*f;
		y = y*scale*f;
		z = z*scale*f;
		var zz = z + f;
		if (zz == 0) {
			zz = Math.MIN_VALUE;
		}
		var p = {};
		p.x = x*(f/zz) + w/2;
		p.y = y*(f/zz) - h/2;
		p.y *= -1;
		return p;
	}
	
	function lineWidthAtZ(z, f) {
		return ((z*-1 + 1) / 2) * f * 0.04;
	}
	
	function lineAngle(x1, y1, x2, y2){
		return Math.atan2(y1-y2, x1-x2)
	}
	
	function destination(x, y, angle, distance){
		return {
			x: x + Math.cos(angle)*distance,
			y: y + Math.sin(angle)*distance,
		}
	}
	// https://www.siggraph.org/education/materials/HyperGraph/modeling/mod_tran/3drota.htm
	function rotate(p, q, which) {
		var dx, dy, dz;
		switch (which) {
		case (0): // x
			dy = p.y*Math.cos(q) - p.z*Math.sin(q);
			dz = p.y*Math.sin(q) + p.z*Math.cos(q);
			dx = p.x;
			break;
		case (1): // y
			dz = p.z*Math.cos(q) - p.x*Math.sin(q);
			dx = p.z*Math.sin(q) + p.x*Math.cos(q);
			dy = p.y;
			break;
		case (2): // z
			dx = p.x*Math.cos(q) - p.y*Math.sin(q);
			dy = p.x*Math.sin(q) + p.y*Math.cos(q);
			dz = p.z;
			break;
		}
		return {x:dx,y:dy,z:dz}
	}
	return Pinhole
}())
