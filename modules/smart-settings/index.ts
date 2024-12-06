// TODO: Can we drop this?
export default (expo?.modules?.SmartSettings ?? {
  set() {},
  reloadAllTimelines() {},
  storeData() {},
}) satisfies {
  set(key: string, value: string | number, suite?: string): void;
  reloadAllTimelines(): void;
  storeData(
    key: string,
    value: Array<Record<string, string | number>>,
    suite?: string
  ): void;
};
