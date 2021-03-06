import { Assert } from "../src/system";

export class HashMap<K, V> extends Map<K, V> implements Serializable {
  readVal<T>(ds: DataStream): T {
    if (isInteger<T>()) {
      return ds.read<T>();
    } else if (isString<T>()) {
      return ds.readString();
    } else if (isReference<T>()) {
      let rst = {} as T;
      rst.deserialize(ds);
      return rst;
    } else {
      Assert(false, "value type is not support when reading");
    }
  }

  writeVal<T>(v: T, ds: DataStream): void {
    if (isInteger<T>(v)) {
      ds.write<T>(v);
    } else if (isString<T>(v)) {
      ds.writeString(v);
    } else if (isReference<T>(v)) {
      v.serialize(ds);
    } else {
      Assert(false, "value type is not support when writing");
    }
  }

  key(): string {
    return ""
  }

  serialize(ds: DataStream): void {
    const keys = this.keys();
    ds.writeVarint32(keys.length);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const v = this.get(k);
      this.writeVal<K>(k, ds);
      this.writeVal<V>(v, ds);
    }
  }

  deserialize(ds: DataStream): void {
    let keysLen = ds.readVarint32();
    while (keysLen > 0) {
      const k = this.readVal<K>(ds);
      const v = this.readVal<V>(ds);
      this.set(k, v);
      keysLen--;
    }
  }
}