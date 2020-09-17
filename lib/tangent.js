function  calculateTangents(vs, tc, ind){
        var i;
        var tangents = [];
        for(i=0;i<vs.length/3; i++){
            tangents[i]=[0, 0, 0];
        }

        // Calculate tangents
        var a = [0, 0, 0], b = [0, 0, 0];
        var triTangent = [0, 0, 0];
        for(i = 0; i < ind.length; i+=3) {
            var i0 = ind[i+0];
            var i1 = ind[i+1];
            var i2 = ind[i+2];
            
            var pos0 = [ vs[i0 * 3], vs[i0 * 3 + 1], vs[i0 * 3 + 2] ];
            var pos1 = [ vs[i1 * 3], vs[i1 * 3 + 1], vs[i1 * 3 + 2] ];
            var pos2 = [ vs[i2 * 3], vs[i2 * 3 + 1], vs[i2 * 3 + 2] ];

            var tex0 = [ tc[i0 * 2], tc[i0 * 2 + 1] ];
            var tex1 = [ tc[i1 * 2], tc[i1 * 2 + 1] ];
            var tex2 = [ tc[i2 * 2], tc[i2 * 2 + 1] ];

            vec3.subtract(pos1, pos0, a);
            vec3.subtract(pos2, pos0, b);

            var c2c1t = tex1[0] - tex0[0];
            var c2c1b = tex1[1] - tex0[1];
            var c3c1t = tex2[0] - tex0[0];
            var c3c1b = tex2[0] - tex0[1];

            triTangent = [c3c1b * a[0] - c2c1b * b[0], c3c1b * a[1] - c2c1b * b[1], c3c1b * a[2] - c2c1b * b[2]];

            vec3.add(tangents[i0], triTangent);
            vec3.add(tangents[i1], triTangent);
            vec3.add(tangents[i2], triTangent);
        }

        // Normalize tangents
        var ts = [];
        for(i=0;i<tangents.length; i++){
            var tan = tangents[i];
            vec3.normalize(tan);
            ts.push(tan[0]);
            ts.push(tan[1]);
            ts.push(tan[2]);
        }
        
        return ts;
    }
// JavaScript Document