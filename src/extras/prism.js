export const prism = function(...args) {
    let aux = args[0];
    let res = aux;

    for(let i = 1; i < args.length; i++) {
        res = [];
        const arr = args[i];

        for(let j = 0; j < aux.length; j++)
            for(let k = 0; k < arr.length; k++)
                res.push(aux[j].concat(arr[k]))
        
        if(i !== args.length)
            aux = [...res];
    }

    return res;
}
globalThis.prism = prism;

export const tegum = function(...args) {
    const res = [];
    let totalLen = 0, init = 0;

    for(let i = 0; i < args.length; i++)
        totalLen += args[i][0].length;
    
    for(let i = 0; i < args.length; i++) {
        let len;

        for(let j = 0; j < args[i].length; j++) {
            const arr = args[i][j];
            const coord = Array.from({length: totalLen}).fill(0);
            len = arr.length;

            for(let k = 0; k < len; k++)
                coord[init + k] = arr[k];

            res.push(coord);
        }

        init += len;
    }

    return res;
}
globalThis.tegum = tegum;