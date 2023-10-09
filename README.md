#### Created by Leonov
#### Encode text
```typescript
encode(text: string, codes: Map<string, string>): Array<string>
```

#### Decode text
```typescript
decode(text: Array<string>, codes: Map<string, string>):string
```

#### Get symbols codes from text
```typescript
(text: string): Map<string, string>
```

#### Get symbols frequency
```typescript
getFrequency(text: string): Array<any>
```

#### Get Huffman Tree from frequency array
```typescript
getTree(arr: Array<any>)
```

#### Get relative frequency array
```typescript
getRelativeFrequency(arr: Array<any>): Array<any>
```

#### Get text entropy
```typescript
getEntropyOfText(text: string): number
```

