type NativeModule = {
  setInt(key: string, value: string | number, suite?: string): void;
  remove(key: string, suite?: string): void;
  reloadWidget(name?: string): void;
  setObject(
    key: string,
    value: Record<string, string | number>,
    suite?: string
  ): boolean;
  setArray(
    key: string,
    value: Record<string, string | number>[],
    suite?: string
  ): boolean;
};

const nativeModule = (expo?.modules?.SmartSettings ?? {
  setInt() {},
  reloadWidget() {},
  setObject() {},
  remove() {},
  setArray() {},
}) satisfies NativeModule;

const originalSetObject = nativeModule.setObject;

// Sweet API doesn't support doing this natively.
nativeModule.setObject = (
  key: string,
  value: Record<string, string | number>,
  suite?: string
) => {
  if (Array.isArray(value)) {
    return nativeModule.setArray(key, value, suite);
  }
  return originalSetObject(key, value, suite);
};

export class AppGroupStorage {
  constructor(private readonly suite: string) {}

  set(
    key: string,
    value?:
      | string
      | number
      | Record<string, string | number>
      | Array<Record<string, string | number>>
  ) {
    if (typeof value === "string" || typeof value === "number") {
      nativeModule.setInt(key, value, this.suite);
    } else if (Array.isArray(value)) {
      nativeModule.setArray(key, value, this.suite);
    } else if (value == null) {
      nativeModule.remove(key, this.suite);
    } else {
      nativeModule.setObject(key, value, this.suite);
    }
  }
}

export default nativeModule;
