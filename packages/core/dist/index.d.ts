export interface TreeNode {
    char: string;
    weight: number;
    left: TreeNode | null;
    right: TreeNode | null;
}
/** Закодируем текст */
export declare function encode(text: string, codes: Map<string, string>): Array<string>;
export declare function decodeString(encodedText: string, codes: Map<string, string>): string;
/** Декодируем текст */
export declare function decode(encodedText: Array<string>, codes: Map<string, string>): string;
/** Функция получения энтропии */
export declare function getEntropyOfText(text: string): number;
/** Получаем каждый символ из карты массива */
export declare function getCharCodesFromSource(text: string): Map<string, string>;
/** Относительная частота */
export declare function getRelativeFrequency(arr: Array<any>): Array<any>;
/** Рассчитываем частоту построения графиков */
export declare function getCharsFrequency(text: string): [string, number][];
/** Сделаем дерево хаффмана */
export declare function getTree(freq: [string, number][]): TreeNode;
