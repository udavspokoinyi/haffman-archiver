export interface TreeNode {
    char: string;
    weight: number;
    left: TreeNode | null;
    right: TreeNode | null;
}

/** Закодируем текст */
export function encode(text: string, codes: Map<string, string>): Array<string> {
    const result: Array<string> = [];
    for (const char of text) {
        result.push(codes.get(char)!);
    }

    return result;
}

export function decodeString(encodedText: string, codes: Map<string, string>): string {
    const reversedCodes = reverseMap(codes);
    let result = '';
    let currentBinary = '';
    for (const item of encodedText) {
        currentBinary += item;
        if (reversedCodes.has(currentBinary)) {
            const decodedChar = reversedCodes.get(currentBinary);
            result += decodedChar;
            currentBinary = '';
        }
    }
    return result;
}

function reverseMap<K, V>(map: Map<K, V>) {
    const result = new Map<V, K>();
    map.forEach((v, k) => {
        result.set(v, k);
    });
    return result;
}

/** Декодируем текст */
export function decode(encodedText: Array<string>, codes: Map<string, string>): string {
    let result = '';

    const reversedCodes: Record<string, string> = {};
    Array.from(codes.entries()).forEach(([key, value]) => {
        reversedCodes[value] = key;
    });

    for (const code of encodedText) {
        result += reversedCodes[code];
    }

    return result;
}

/** Функция получения энтропии */
export function getEntropyOfText(text: string): number {
    const relFreq: Array<any> = getRelativeFrequency(getCharsFrequency(text));
    let entropy = 0;

    for (let i = 0; i < relFreq.length; i++) {
        entropy += relFreq[i][1] * Math.log2(relFreq[i][1]);
    }
    return -entropy;
}

/** Получаем каждый символ из карты массива */
export function getCharCodesFromSource(text: string): Map<string, string> {
    const freqArr = getCharsFrequency(text);
    const tree = getTree(freqArr);

    const codes: Map<string, string> = new Map(); // Array with symbols and codes

    getCodes(tree, (char, code) => {
        codes.set(char, code);
    });
    return codes;
}

const getCodes = (
    tree: TreeNode | null,
    cb: (char: string, code: string) => void,
    code = '',
): void => {
    if (!tree) {
        return;
    }

    if (!tree.left && !tree.right) {
        cb(tree.char, code);
        return;
    }

    getCodes(tree.left, cb, code + '0');
    getCodes(tree.right, cb, code + '1');
};

/** Относительная частота */
export function getRelativeFrequency(arr: Array<any>): Array<any> {
    let length = 0;
    const resArr: Array<any> = [];
    for (let i = 0; i < arr.length; i++) {
        length += arr[i][1];
    }
    for (let i = 0; i < arr.length; i++) {
        const relFreq = arr[i][1] / length;
        resArr.push([arr[i][0], relFreq]);
    }

    return resArr;
}

/** Рассчитываем частоту построения графиков */
export function getCharsFrequency(text: string): [string, number][] {
    const freq: Map<string, number> = new Map();

    for (const char of text) {
        const count = freq.get(char);
        freq.set(char, count ? count + 1 : 1);
    }

    return Array.from(freq).sort((a, b) => b[1] - a[1]); // descending
}

/** Сделаем дерево хаффмана */
export function getTree(freq: [string, number][]): TreeNode {
    const nodes: TreeNode[] = [];

    for (const [char, weight] of freq) {
        nodes.push({char, weight, left: null, right: null});
    }

    while (nodes.length > 1) {
        nodes.sort((a, b) => a.weight - b.weight);

        const left = nodes.shift()!;
        const right = nodes.shift()!;

        const parent: TreeNode = {char: '', weight: left?.weight + right?.weight, left, right};

        nodes.push(parent);
    }

    return nodes[0];
}
