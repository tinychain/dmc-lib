import { U8ArrayToBytes } from "./helper";

export function StringToBytes(str: string): Bytes {
  const bytes = new Bytes(str.length)
  const buffer = String.UTF8.encode(str)

  memory.copy(changetype<usize>(bytes.buffer), changetype<usize>(buffer), buffer.byteLength);
  return bytes;
}

export function BytesToString(bytes: Bytes): string {
  return String.UTF8.decode(bytes.buffer);
}

export function StringToUsize(str: string): usize {
  return changetype<usize>(StringToBytes(str).buffer);
}

/**
 * EncodeULEB128 appends v to b using unsigned LEB128 encoding.
 */
export function EncodeULEB128(v: u64): Bytes {
  const bytes = new Array<u8>();
  while (1) {
    let c: u8 = <u8>(v & 0x7f);
    v >>= 7;
    if (v != 0) {
      c |= 0x80;
    }
    bytes.push(c);
    if ((c & 0x80) == 0) {
      break;
    }
  }
  return U8ArrayToBytes(bytes);
}

/**
 *  EncodeSLEB128 appends v to b using signed LEB128 encoding.
 */
export function EncodeSLEB128(v: i64): Bytes {
  const bytes = new Array<u8>();
  while (1) {
    let c: u8 = <u8>(v & 0x7f);
    let s: u8 = <u8>(v & 0x40);
    v >>= 7;
    if ((v != -1 || s == 0) && (v != 0 || s != 0)) {
      c |= 0x80;
    }
    bytes.push(c);
    if ((c & 0x80) == 0) {
      break;
    }
  }
  return U8ArrayToBytes(bytes);
}

/** 
 * DecodeULEB128 decodes bytes from stream with unsigned LEB128 encoding.
 */
export function DecodeULEB128(bytes: Bytes): u64 {
  const ds = new DataStream(changetype<usize>(bytes.buffer), bytes.length);
  let shift: u64 = 0;
  let out: u64 = 0;
  while (1) {
    let b: u8 = ds.read<u8>();
    out |= <u64>(b & 0x7f) << shift;
    if ((b & 0x80) == 0) {
      break;
    }
    shift += 7;
  }

  return out;
}

// DecodeSLEB128 decodes bytes from stream with signed LEB128 encoding.
export function DecodeSLEB128(bytes: Bytes): u64 {
  const ds = new DataStream(changetype<usize>(bytes.buffer), bytes.length);
  let shift: u64 = 0;
  let out: u64 = 0;
  while (1) {
    let b: u8 = ds.read<u8>();
    out |= <u64>(b & 0x7f) << shift;
    shift += 7;
    if ((b & 0x80) == 0) {
      if ((b & 0x40) != 0) {
        out |= ~0 << shift;
      }
      break;
    }
  }

  return out;
}