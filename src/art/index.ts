import circleArtGenerator from "../functions/circles";
import circlesGen2 from "../functions/circles2";

export const circles = circleArtGenerator({
    colorRange: {
        r: [[0, 100], [200, 255]],
        g: [100,255],
        b: [[0,0], [100, 150]],
        a: [0.5,0.8]
    },
    radius: [[2,5], [2,5], [3,7], [8,20]]
});

export const circles2 = circlesGen2();