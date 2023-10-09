import {
    getCharCodesFromSource,
    getCharsFrequency,
    getTree,
    encode,
    decode,
} from 'huffman-javascript';
import React from 'react';
import {useState} from 'react';
import {deserialize, serialize} from '../src/serialize';
import {decodeString} from 'huffman-javascript/src';
export const App = (): JSX.Element => {
    const [encodeFileName, setEncodeFileName] = useState('');
    const [encodingInput, setEncoding] = useState<string>('');
    const [decodeFileName, setDecodeFileName] = useState('');
    const [decodingInput, setDecoding] = useState<string>('');
    const onUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setNameFunc: (name: string) => void,
        setContent: (content: string) => void,
    ) => {
        if (!window.FileReader) return;
        const file = e.target.files![0];
        setNameFunc(file.name);
        const reader = new FileReader();
        reader.onload = (evt) => {
            if (evt.target?.readyState != 2) return;
            if (evt.target.error) {
                alert('Error while reading file');
                return;
            }
            const fileContent = evt.target.result as string;
            setContent(fileContent);
        };
        reader.readAsText(file);
    };

    const download = (fileName: string, data: string) => {
        const a = document.createElement('a');
        a.href = 'data:application/octet-stream,' + encodeURIComponent(data);
        a.download = fileName;
        a.click();
    };

    const downloadEncoded = () => {
        const codes = getCharCodesFromSource(encodingInput);
        const encoded = encode(encodingInput, codes);
        const padding = (8 - (encoded.join('').length % 8)) % 8;
        const binaryString =
            encoded.join('') +
            Array(padding)
                .map(() => '0')
                .join('');

        let encodedData = '';
        console.log(encoded, codes);
        for (let i = 0; i < binaryString.length; ) {
            let cur = 0;
            for (let j = 0; j < 8; j++, i++) {
                cur *= 2;
                cur += (binaryString[i] as unknown as number) - ('0' as unknown as number);
            }
            encodedData += String.fromCharCode(cur);
        }
        console.log(encodedData);
        const fileString = serialize(codes, padding, encodedData);
        console.log(fileString);
        console.log(binaryString);
        const fileExtension = encodeFileName.substring(encodeFileName.lastIndexOf('.'));
        download(
            encodeFileName.substring(0, encodeFileName.lastIndexOf('.')) + '_mini' + fileExtension,
            fileString,
        );
    };

    const decodeFile = () => {
        if (!decodingInput) return;
        const {codes, encoded, padding} = deserialize(decodingInput);
        let decodedBinaryString = '';
        for (let i = 0; i < encoded.length; i++) {
            const currNum = encoded.charCodeAt(i);
            let currBinary = '';
            for (let j = 7; j >= 0; j--) {
                const foo = currNum >> j;
                currBinary += foo & 1;
            }
            decodedBinaryString += currBinary;
        }
        if (padding !== 0) decodedBinaryString = decodedBinaryString.slice(0, -padding);
        return decodeString(decodedBinaryString, codes);
    };

    const downloadDecoded = () => {
        const fileExtension = decodeFileName.substring(decodeFileName.lastIndexOf('.'));
        download(
            decodeFileName.substring(0, decodeFileName.lastIndexOf('.')) +
                'decoded' +
                fileExtension,
            decodeFile()!,
        );
    };
    // const [text, setText] = React.useState('');
    // const [uploadFile, setUploadFile] = React.useState('');
    // console.time('1');
    // const codes = getCharCodesFromSource(text);
    // const onUpload = (e: React.ChangeEvent<HTMLInputElement>) =>{
    //     if(!window.FileReader) return;
    //     const reader = new FileReader();
    //     reader.onload = (evt) => {
    //         if(evt.target?.readyState !== 2) return;
    //         if(evt.target.error){
    //             alert('Error file not reading')
    //             return;
    //         }
    //         const fileContent = evt.target.result;
    //         console.log(fileContent);
    //         if(typeof fileContent !== "string"){
    //             alert('file not string')
    //             return;
    //         }
    //     setText(fileContent);
    //     }
    //     reader.readAsText(e.target.files![0])

    // }
    // const freq = getCharsFrequency(text);
    // const tree = getTree(freq);
    // const downloadFile = () => {
    //     if(!encoded) return;
    //     const encodedString = encoded?.join('')
    // }
    // console.log(tree);
    // console.log(codes);

    // const encoded = encode(text, codes);
    // const decoded = decode(encoded, codes);

    // console.log(`encoded`, encoded);
    // console.log(`decoded`, decoded);

    // console.timeEnd('1');

    return (
        <div>
            {/* <pre>{JSON.stringify(tree, null, 2)}</pre> */}
            <br />
            <h1>Encode</h1>
            <input type="file" onChange={(e) => onUpload(e, setEncodeFileName, setEncoding)} />
            <button onClick={downloadEncoded}>GO!</button>
            <h1>Decode</h1>
            <input type="file" onChange={(e) => onUpload(e, setDecodeFileName, setDecoding)} />
            <button onClick={downloadDecoded}>Ne Go</button>
        </div>
    );
};
