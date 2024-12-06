// TODO: Can we drop this?
export default (expo?.modules?.SmartSettings ?? {
  set() {},
  reloadAllTimelines() {},
}) satisfies {
  set(key: string, value: string | number, suite?: string): void;
  reloadAllTimelines(): void;
};
