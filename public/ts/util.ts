export function getRandomInt(min : number, max : number) : number{
    return min + Math.floor(Math.random() * (max-min));
}

export  function get2dArray<T>(size: number, value: T) : T[][]{
    return new Array(size).fill(value)
        .map(() =>
            new Array(size).fill(value)
        );
}