export function Hex(b: Bytes): string {
  let hex = "";
  for (let i = 0; i < b.length; i++) {
    hex += b[i].toString(16)
  }
  return "0x" + hex.split('').reverse().join('');
}

export function HexToBytes(hex: string): Bytes {
  if (hex.substr(0, 2) == "0x") {
    hex = hex.substr(2);
  }

  let len = hex.length % 2 == 0 ? hex.length / 2 : hex.length / 2 + 1
  let bytes = new Bytes(len);
  let i = 0;
  hex = hex.split('').reverse().join('')
  while (hex.length) {
    let shex = hex.substr(0, 2);
    bytes[i++] = parseInt(shex, 16);
    hex = hex.substr(2);
  }

  return bytes
}

// export function SwapEndian(bytes: Bytes): Bytes {
//   let clone = CloneBytes(bytes);
//   return clone.reverse()
// }

export function U8ArrayToBytes(arr: Array<u8>): Bytes {
  let bytes = new Bytes(arr.length);
  for (let i = 0; i < arr.length; i++) {
    bytes[i] = arr[i]
  }
  return bytes;
}

export function CloneBytes(bytes: Bytes): Bytes {
  let clone = new Bytes(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    clone[i] = bytes[i]
  }
  return clone;
}

export function WriteBytesToU8Array(bytes: Bytes, buffer: Array<u8>): void {
  bytes.forEach(function (item: u8): void {
    buffer.push(item)
  })
}

// Concat two different bytes and returns a new bytes.
export function ConcatBytes(b1: Bytes, b2: Bytes): Bytes {
  const newBytes = new Array<u8>();
  for (let i = 0; i < b1.length; i++) {
    newBytes.push(b1[i])
  }
  for (let i = 0; i < b2.length; i++) {
    newBytes.push(b2[i])
  }
  return U8ArrayToBytes(newBytes);
}