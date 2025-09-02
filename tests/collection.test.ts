import Browser from 'webextension-polyfill';
import Collection from '../src/common/storage/collection';
import Collections from '../src/common/storage/collections';
import { ICollection } from '../src/common/interface';
import log from 'loglevel';
import CollectionItem from '../src/common/storage/collectionItem';

// Mock global document for tests running in Node.js
(global as any).document = {};

// Mock Date
Date.now = jest.fn(() => new Date('2025-09-01T00:00:00.000Z').getTime());

jest.mock('webextension-polyfill');

const mockCollections: ICollection[] = [
  {
    id: '1',
    name: 'A',
    items: [
      {
        id: 'item1',
        content: 'content1',
        type: 'text',
        source: '',
        createTime: new Date().toISOString(),
        modifyTime: new Date().toISOString(),
      },
      {
        id: 'item2',
        content: 'content2',
        type: 'text',
        source: '',
        deleted: new Date().toISOString(),
        createTime: new Date().toISOString(),
        modifyTime: new Date().toISOString(),
      },
    ],
    deleted: '2025-07-01T00:00:00.000Z',
    createTime: new Date().toISOString(),
    modifyTime: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'B',
    items: [
      {
        id: '2-1',
        content: 'B - content1',
        type: 'text',
        source: '',
        createTime: new Date().toISOString(),
        modifyTime: new Date().toISOString(),
      },
      {
        id: '2-2',
        content: 'B - content2',
        type: 'text',
        source: '',
        deleted: new Date().toISOString(),
        createTime: new Date().toISOString(),
        modifyTime: new Date().toISOString(),
      },
    ],
    createTime: new Date().toISOString(),
    modifyTime: new Date().toISOString(),
  },
];

let currentCollections: ICollection[] = [];

log.setLevel(log.levels.TRACE);

beforeAll(() => {
  (Browser.storage.local.get as jest.Mock).mockImplementation(() =>
    Promise.resolve({ collections: currentCollections })
  );
  (Browser.storage.local.set as jest.Mock).mockImplementation(
    ({ collections }) => {
      currentCollections = collections;
      return Promise.resolve(true);
    }
  );

  // (Collections.fetch as jest.Mock).mockResolvedValue([...mockCollections]);
  // (Collections.update as jest.Mock).mockResolvedValue(true);
});

beforeEach(() => {
  currentCollections = structuredClone(mockCollections); // Deep clone to avoid mutation issues
});

describe('Collection', () => {
  it('should fetch a collection includeing deleted items', async () => {
    const collection = await Collection.fetch('1', true);

    expect(collection).not.toBeUndefined();
    expect(collection).not.toBeNull();

    expect(collection.id).toBe('1');
    expect(collection.name).toBe('A');
    expect(collection.items.length).toBe(2); // Include deleted items
  });

  it('should fetch a collection', async () => {
    const collection = await Collection.fetch('1', false);

    expect(collection).not.toBeUndefined();
    expect(collection).not.toBeNull();

    expect(collection.id).toBe('1');
    expect(collection.name).toBe('A');
    expect(collection.items.length).toBe(1);
  });

  it('should create a new collection', async () => {
    const name = 'Test Collection';
    const id = await Collection.create(name);
    expect(typeof id).toBe('string');
    expect(id).not.toBe('');

    // Verify the new collection is in the fetched collections
    const collections = await Collections.fetch();
    const newCollection = collections.find((c) => c.id === id);
    expect(newCollection).not.toBeNull();
    expect(newCollection).not.toBeUndefined();

    expect(newCollection!.name).toBe(name);
  });

  it('should add an item to a collection', async () => {
    const content = 'test content';
    const type = 'bookmark';
    const source = 'http://example.com';

    const result = await CollectionItem.create('1', content, type, source);
    expect(result).toBe(true);

    // Verify the new collection is in the fetched collections
    const collection = await Collection.fetch('1');
    expect(collection).not.toBeNull();
    expect(collection).not.toBeUndefined();

    const newItem = collection!.items.find((i) => i.content === content);
    expect(newItem).not.toBeNull();
    expect(newItem).not.toBeUndefined();

    expect(newItem!.content).toBe(content);
    expect(newItem!.type).toBe(type);
    expect(newItem!.source).toBe(source);
  });

  it('should update collection name', async () => {
    const name = 'Updated Name';

    const result = await Collection.updateName('1', name);
    expect(result).toBe(true);

    // Verify the new collection is in the fetched collections
    const collections = await Collection.fetch('1');
    expect(collections).not.toBeNull();
    expect(collections).not.toBeUndefined();

    expect(collections!.name).toBe(name);
  });

  it('should update collection color', async () => {
    const color = 2;

    const result = await Collection.updateColor('1', color);
    expect(result).toBe(true);

    // Verify the new collection is in the fetched collections
    const collection = await Collection.fetch('1');
    expect(collection).not.toBeNull();
    expect(collection).not.toBeUndefined();

    expect(collection!.color).toBe(color);
  });

  it('should delete a collection', async () => {
    const result = await Collection.delete('1');
    expect(result).toBe(true);

    // Verify the new collection is in the fetched collections
    const collection = await Collection.fetch('1', true);
    expect(collection).not.toBeNull();
    expect(collection).not.toBeUndefined();

    expect(collection!.deleted).toBeDefined();
    expect(typeof collection!.deleted).toBe('string');
  });

  it('should delete all items in a collection', async () => {
    const result = await Collection.deleteAllItems('1');
    expect(result).toBe(true);

    // Verify the new collection is in the fetched collections
    const collection = await Collection.fetch('1', true); // Include deleted items
    expect(collection).not.toBeNull();
    expect(collection).not.toBeUndefined();
    expect(collection!.items.length).toBe(2);
    expect(collection!.items.every((item) => item.deleted)).toBeDefined();
  });

  it('should create and add an item', async () => {
    const name = 'New Collection';
    const content = 'Content';
    const type = 'bookmark';

    const result = await Collection.createAndAdd(name, content, type);
    expect(result).toBe(true);

    // Verify the new collection is in the fetched collections
    const collections = await Collections.fetch();
    expect(collections).not.toBeNull();
    expect(collections).not.toBeUndefined();

    const collection = collections!.find((i) => i.name === name);
    expect(collection).not.toBeNull();
    expect(collection).not.toBeUndefined();

    expect(collection!.items.length).toBe(1);
    const newItem = collection!.items[0];

    expect(newItem.content).toBe(content);
    expect(newItem.type).toBe(type);
  });
});

describe('Collections', () => {
  it('should returns all collections', async () => {
    const collections = await Collections.fetch();
    expect(collections.length).toBe(2);
    expect(collections[0].id).toBe('1');
  });

  it('should restore undeletes items and collections', async () => {
    const collections = await Collections.fetch();
    expect(collections.length).toBe(2);
    expect(collections[0].id).toBe('1');
    expect(collections[0].deleted).toBeDefined();

    const result = await Collections.restore();
    expect(result).toBe(true);

    // Verify the new collection is in the fetched collections
    let collection = await Collection.fetch('1');
    expect(collection.deleted).not.toBeDefined();
    expect(collection.deleted).not.toBeNull();
  });

  it('should removeDeleted removes items older than 30 days', async () => {
    const collections = await Collections.fetch();
    expect(collections.length).toBe(2);
    expect(collections[0].id).toBe('1');
    expect(collections[0].deleted).toBeDefined();

    const result = await Collections.removeDeleted();
    expect(result).toBe(true);

    // Verify the new collection is in the fetched collections
    let newCollections = await Collections.fetch();
    expect(newCollections.length).toBe(1);
  });

  it('should import merges collections', async () => {
    const importCollections = [
      {
        id: '2',
        name: 'Imported Collection',
        items: [],
        createTime: '2025-08-01T00:00:00.000Z',
        modifyTime: '2025-08-02T00:00:00.000Z',
      },
      {
        id: '10',
        name: 'Imported Collection',
        items: [],
        createTime: '2025-08-01T00:00:00.000Z',
        modifyTime: '2025-08-01T00:00:00.000Z',
      },
    ];
    const result = await Collections.import(importCollections);
    expect(result).toBe(true);

    // Verify the new collection is in the fetched collections
    const collections = await Collections.fetch();
    expect(collections.length).toBe(3);
  });
});
