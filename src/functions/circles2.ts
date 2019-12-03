import { Lambda, Shape } from "../types";

const circlesGen2 = () => {
    const lambda: Lambda = (x: number) => {
        const stroke = () => {
            if (Math.round(x * 10) / 10 % 1 === 0) {
                return [Shape.point({
                    x: Math.random() * 50 - 10,
                    y: Math.random() * 50 - 10,
                    radius: x * 10,
                    fill: `rgba(${x * 5}, 200, ${255 - x * 5}, 0.04)`
                })]
            }
            return [];
        }
        if (x * 10 - 512 < 0) return {
            shapes: [
                Shape.point({
                    x: x * 10 - 512,
                    y: Math.sin(x * Math.random() * 10 + 45) * 512,
                    radius: Math.random() * 40 + 30,
                    fill: `rgba(${255 - x * 5}, 200, ${x * 5}, ${0.2 - x * 0.003})`,
                    zIndex: 1
                }),
                Shape.point({
                    x: x * 15 - 512,
                    y: Math.sin(x * Math.random() * 10 + 35) * 512,
                    radius: Math.random() * 20 + 30,
                    fill: `rgba(${255 - x * 5}, 200, ${x * 5}, ${0.08 - x * 0.01})`,
                }),
                Shape.point({
                    x: 512 - x * 10,
                    y: Math.sin(x * Math.random() * 10 + 45) * 512,
                    radius: Math.random() * 40 + 30,
                    fill: `rgba(${255 - x * 5}, 200, ${x * 5}, ${0.2 - x * 0.003})`,
                    zIndex: 1
                }),
                Shape.point({
                    x: 512 - x * 15,
                    y: Math.sin(x * Math.random() * 10 + 35) * 512,
                    radius: Math.random() * 40 + 30,
                    fill: `rgba(${255 - x * 5}, 200, ${x * 5}, ${0.08 - x * 0.01})`,
                }),
                ...stroke()
            ],
            dx: 0.1
        }
        return {
            shapes: [],
            dx: 1
        }
    }

    return lambda;
}

export default circlesGen2;