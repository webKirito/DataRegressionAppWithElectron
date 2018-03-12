class Statistic {
    constructor(arr1, arr2) {
        this.arr2 = arr2;
        this.arr1 = arr1;
    }

    getAverage(arr) {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum / arr.length;
        // return arr.reduce((sum, current) => {
        //     return sum + current;
        // }, 0) / arr.length;
    }

    getDualAverage(arr1 , arr2) {
        let sum = 0;
        for (let i = 0; i < arr1.length ; i++) {
            sum+=arr1[i]*arr2[i];
        }
        return sum / arr1.length;
    }

    getDispersion(arr) {
        return Math.sqrt( arr.reduce((sum, current) => {
            return sum + Math.pow(current - this.getAverage(arr), 2);
        }, 0) / arr.length );
    }

    getPirsonKoef() {
        return (this.getDualAverage(this.arr1, this.arr2) - this.getAverage(this.arr1) * this.getAverage(this.arr2))
        / (this.getDispersion(this.arr1)* this.getDispersion(this.arr2));
    }

    getQuantile(a) {
        let tmp = this.arr1.length - 1;

        function normal(a) {

            const c0 = 2.512517 , c1 = 0.802853 , c2 = 0.010328,
                  d1 = 1.432788 , d2 = 0.1892659 , d3 = 0.001308;

            
            if (a <= 0.5) {
                let t = Math.sqrt(-2*Math.log(a));
                let q = t - (c0 + c1 * t + c2 * t * t)/(1 + d1 * t + d2 * t * t + d3 * t * t * t);
                return -q;
            } else {
                let t = Math.sqrt(-2*Math.log(1-a));
                let q = t - (c0 + c1 * t + c2 * t * t)/(1 + d1 * t + d2 * t * t + d3 * t * t * t);
                return q;
            }
        }
        function student(a, b) {
            let v = b;
            let up = normal(a);
            function g1(up) {
                return 1/4 * (up*up*up + up);
            }
            function g2(up) {
                return 1/96 * (5 * Math.pow(up, 5) + 16 * Math.pow(up, 3) + 3 * up);
            }
            function g3(up) {
                return 1/384 * (3 * Math.pow(up, 7) + 19 * Math.pow(up, 5) + 17 * Math.pow(up, 3) - 15 * up);

            }
            function g4(up) {
                return 1/92160 * (79 * Math.pow(up, 9) + 779*Math.pow(up, 7) + 1482 * Math.pow(up, 5) - 1920* Math.pow(up, 3) - 945 * up);
            }

            return up + 1 / Math.pow(v, 1) * g1(up) + 1 / Math.pow(v, 2) *g2(up) + 1 / Math.pow(v, 3) * g3(up) + 1 / Math.pow(v, 4) * g4(up);

        }

        if (this.arr1.length > 60) {
            return normal(a);
        } else {
            return student(a,tmp);
        }


    }

    getStudentQuantile(a) {
        function normal(a) {

            a = 1 - a/2;

            const c0 = 2.512517 , c1 = 0.802853 , c2 = 0.010328,
                  d1 = 1.432788 , d2 = 0.1892659 , d3 = 0.001308;

            
            if (a <= 0.5) {
                let t = Math.sqrt(-2*Math.log(a));
                let q = t - (c0 + c1 * t + c2 * t * t)/(1 + d1 * t + d2 * t * t + d3 * t * t * t);
                return -q;
            } else {
                let t = Math.sqrt(-2*Math.log(1-a));
                let q = t - (c0 + c1 * t + c2 * t * t)/(1 + d1 * t + d2 * t * t + d3 * t * t * t);
                return q;
            }
        }
        function student(a, b) {
            let v = b;
            let up = normal(a);
            function g1(up) {
                return 1/4 * (up*up*up + up);
            }
            function g2(up) {
                return 1/96 * (5 * Math.pow(up, 5) + 16 * Math.pow(up, 3) + 3 * up);
            }
            function g3(up) {
                return 1/384 * (3 * Math.pow(up, 7) + 19 * Math.pow(up, 5) + 17 * Math.pow(up, 3) - 15 * up);

            }
            function g4(up) {
                return 1/92160 * (79 * Math.pow(up, 9) + 779*Math.pow(up, 7) + 1482 * Math.pow(up, 5) - 1920* Math.pow(up, 3) - 945 * up);
            }

            return up + 1 / Math.pow(v, 1) * g1(up) + 1 / Math.pow(v, 2) *g2(up) + 1 / Math.pow(v, 3) * g3(up) + 1 / Math.pow(v, 4) * g4(up);

        }
        return student(a , this.arr1.length - 2);
    }

    getNormalQuantile(a) {

        a = 1 - a/2;

        const c0 = 2.512517 , c1 = 0.802853 , c2 = 0.010328,
              d1 = 1.432788 , d2 = 0.1892659 , d3 = 0.001308;

        
        if (a <= 0.5) {
            let t = Math.sqrt(-2*Math.log(a));
            let q = t - (c0 + c1 * t + c2 * t * t)/(1 + d1 * t + d2 * t * t + d3 * t * t * t);
            return -q;
        } else {
            let t = Math.sqrt(-2*Math.log(1 - a));
            let q = t - (c0 + c1 * t + c2 * t * t)/(1 + d1 * t + d2 * t * t + d3 * t * t * t);
            return q;
        }
    }

    getPirsonTStat(a) {
        let n = this.arr1.length;
        let r = this.getPirsonKoef();

        let quantile = this.getStudentQuantile(a);

        let t = Math.abs(this.getPirsonKoef() * Math.sqrt(this.arr1.length - 2) /
                Math.sqrt(1 - this.getPirsonKoef()));
        let conclusion = (t <= quantile) ? 'The correlation is significant.' :
        `The correlation is not significant.`;

        let rightBorder = r + r * (1 - r) / (2 * n) + this.getNormalQuantile(a) * (1 - r) / Math.sqrt(n - 1);
        let leftBorder = r + r * (1 - r) / (2 * n) - this.getNormalQuantile(a) * (1 - r) / Math.sqrt(n - 1);

        return [r, t, quantile , conclusion , rightBorder , leftBorder];

    }

    getBiasedDispersion(arr) {
        let sum = 0;
        let _x = this.getAverage(arr)
        for (let i = 0; i < arr.length; i++) {
            sum += Math.pow(arr[i] - _x, 2);
        }
        return sum/this.arr1.length;
    }

    getLineRegressionKoef(p) {

        let a1 = this.getPirsonKoef() * this.getBiasedDispersion(this.arr2) / this.getBiasedDispersion(this.arr1);
        let a0 = this.getAverage(this.arr2) - a1 * this.getAverage(this.arr1);

        let func = (x, a0 ,a1) => { return a0 + x * a1 };

        let sum = 0;

        for (let i = 0; i < this.arr2.length; i++) {
            sum += Math.pow(this.arr2[i] - func(this.arr1[i], a0 , a1), 2);
        }

        let s = sum / (this.arr1.length - 3);

        let a0Disp = s * (1/this.arr1.length + Math.pow( this.getAverage(this.arr1) , 2)/(this.arr1.length * this.getBiasedDispersion(this.arr1)));
        let a1Disp = s / (this.arr1.length * this.getBiasedDispersion(this.arr1));

        let a0Low = a0 - this.getStudentQuantile(p) * Math.sqrt(a0Disp);
        let a0High = a0 + this.getStudentQuantile(p) * Math.sqrt(a0Disp);

        let a1Low = a1 - this.getStudentQuantile(p) * Math.sqrt(a1Disp);
        let a1High = a1 + this.getStudentQuantile(p) * Math.sqrt(a1Disp);

        let t0 = a0 / Math.sqrt(a0Disp);
        let t1 = a1 / Math.sqrt(a1Disp);

        let conclusion = (t0 <= this.getStudentQuantile(p)) ? "Reggession line touches the beginning of coordinetes." :
                                                              "Reggession line doesn`t touch the beginning of coordinetes."+ "\n" +
                         (t1 <= this.getStudentQuantile(p)) ? "Regression is major." : "Regression is not major.";

        

        
        return [a0, a1 , a0Disp , a1Disp , [a0Low, a1Low] , [a0High , a1High], conclusion];
    }
}

module.exports = {  
    Statistic: Statistic
}