export enum ShapeType {
    point = "point",
    line = "line",
    arc = "arc"
}

export interface RGBA {
    r: Value
    g: Value
    b: Value
    a: Value
}

export type Color = string | RGBA;

export interface ShapeStyles {
    fill?: Color
    stroke?: Color
}

export interface OrderStyle {
    zIndex?: number
    stateIndex?: number
}


export interface DecoratedShape extends ShapeStyles {
    type: ShapeType
    zIndex: number
    stateIndex?: number
}

export interface Point {
    x: Value
    y: Value
}

export interface PointStyles extends ShapeStyles {
    radius?: Value
}

export interface DecoratedPoint extends Point, PointStyles, DecoratedShape, LineStyles {
    type: ShapeType.point
}

export interface Line {
    points: Point[]
}

export interface LineStyles extends ShapeStyles {
    lineWidth?: Value
}

export interface DecoratedLine extends Line, LineStyles, DecoratedShape {
    type: ShapeType.line
    range: Range<number | string>
}

export interface Arc {
    x: Value
    y: Value
    start: Value
    end: Value
    radius: Value
}

export interface ArcStyles extends ShapeStyles {}

export interface DecoratedArc extends Arc, ArcStyles, DecoratedShape, LineStyles {
    type: ShapeType.arc
    direction: "clockwise" | "counter-clockwise"
}


interface PointConstructor extends Point, PointStyles, OrderStyle, LineStyles {};
interface LineConstructor extends Line, LineStyles, OrderStyle { 
    range?: Range<number | string>
}
interface ArcConstructor extends Arc, ArcStyles, OrderStyle, LineStyles {
    direction?: "clockwise" | "counter-clockwise"
};

export const Shape = {
    point: (point: PointConstructor): DecoratedPoint => {
        return {
            ...point,
            type: ShapeType.point,
            zIndex: point.zIndex || 0,
            ...(point.stateIndex && { stateIndex: point.stateIndex })
        }
    },
    line: (line: LineConstructor): DecoratedLine => {
        return {
            ...line,
            range: line.range || ["0%", "100%"],
            type: ShapeType.line,
            zIndex: line.zIndex || 0,
            ...(line.stateIndex && { stateIndex: line.stateIndex })
        }
    },
    arc: (arc: ArcConstructor): DecoratedArc => {
        return {
            ...arc,
            type: ShapeType.arc,
            zIndex: arc.zIndex || 0,
            ...(arc.stateIndex && { stateIndex: arc.stateIndex }),
            direction: arc.direction || "clockwise"
        }
    }
}

export type Lambda = (x: number) => { shapes: DecoratedShape[], dx: number };

export type Range<T> = [T, T];
export type MultiRange<T> = Range<T> | Array<Range<T>>;

export function updateShapes<T>(shapes: T[], callback: (shape: T, index: number) => any) {
    shapes.forEach((shape, i) => {
        let obj = callback(shape, i);
        for (const key in obj) {
            (shape as any)[key] = obj[key];
        }
    });
}

export function generate<T>(count: number, callback: (index: number) => T) {
    return [...Array(count)].map((_, i) => callback(i));
}



export type Value = number | MultiRange<number>;

export const color = (r: Value, g: Value, b: Value, a: Value): Color => {
    return {
        r, g, b, a
    }
}




export const unwrap = (num: Value): number => {
    if (typeof(num) === "number") return num;
    if (typeof(num[0]) !== "number") {
        const newRange = num as Array<Range<number>>
        let rI = Math.floor(Math.random() * num.length);
        return Math.random() * (newRange[rI][1] - newRange[rI][0]) + newRange[rI][0];
    }
    const newRange = num as Range<number>;
    return Math.random() * (newRange[1] - newRange[0]) + newRange[0];
}

const operate = (operator: string) => (v1: number, v2: number): number => {
    switch (operator) {
        case "+":
            return v1 + v2;
        case "-":
            return v1 - v2;
        case "*":
            return v1 * v2;
        case "/":
            return v1 / v2;
        default:
            throw new Error(`Bad operator: ${v1} ${operator} ${v2}`);
    }
}

export const simplify = (strings: TemplateStringsArray, ...keys: Value[]) => {
    let operators = strings.join("").trim().split(" ");
    if (operators.length !== keys.length - 1) {
        throw new Error(`Bad expression when simplifying: ${String.raw(strings, keys)}`)
    }
    
    return keys.reduce((accum: number, key, i) => {
        if (i === 0) return unwrap(key);
        try {
            return operate(operators[i-1]) (accum, unwrap(key));
        }
        catch (err) {
            throw new Error(`Error on operation when simplifying: ${String.raw(strings, keys)}`);
        }
    }, 0);
}

export const unwrapColor = (color: Color) => {
    if (typeof(color) === "string") return color;
    return `rgba(${unwrap(color.r)}, ${unwrap(color.g)}, ${unwrap(color.b)}, ${unwrap(color.a)})`;
}