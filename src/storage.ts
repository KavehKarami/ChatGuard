type IStorage = {
  key: string;
  enable: boolean;
};

const defaultStorage: IStorage = {
  key: "",
  enable: true,
};

export const storage = {
  get: (): Promise<IStorage> =>
    chrome.storage.sync.get(defaultStorage) as Promise<IStorage>,
  set: (value: IStorage): Promise<void> => chrome.storage.sync.set(value),
};
