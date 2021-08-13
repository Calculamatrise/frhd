import frhd, { Client, Track } from "./src/bootstrap.js";

const client = new Client();

client.on("ready", async function() {
    const track = new Track();

    track.import("-18 1i 18 1i 18 34 -18 1i,18 1i 18 34,18 34 -18 1i,-n -39 -1b -1u -3t -14 -7g -14 -8a -1b -7t -7 -8c 1m -8e 30 -81 3r -7j 49 -6v 4c -66 43,-1b -1u -3t -14,-3t -14 -7g -14,-7g -14 -8a -1b,-8a -1b -7t -7,-7t -7 -8c 1m,-8c 1m -8e 30,-8e 30 -81 3r,-81 3r -7j 49,-7j 49 -6v 4c,-6v 4c -66 43##V -25 -41 1 a,V -4k -22 1 a,V -5o 1c 1 a,V -3t 39 1 a,V -v -6s 2 a,V -6j -52 2 a,V -2o g 2 a,V 3f -3t 3 a,V 5k 13 3 a,V 43 34 3 a,V 6t 2o 4 a,V 4r 3e 4 a,V 5k -3i 5 a,V 3m -6g 5 a,T -22 -4a,T 2b -5k,T 6c -4p,T 8l -3g,B 1f -4m -2p,B -3d -4f 6t,B -34 -1s 3q,G 21 -3e -2m,G -2p -2j 5v,G -3a d 47,S 2o -2t,S -2p -h,S -2g 2g,S 22 3p,O a -37,O -4b h,O -2c 3v,O 2u 4m,C u -3s,C -44 6,C -2f 36,C 2t 36,C 57 11,A 2u -2m,A -2c -1d,A -2p 3n,A 3v 4m,W 3h -11 -61 -2e,");

    console.log(track.code)
});

client.login("TOKEN");