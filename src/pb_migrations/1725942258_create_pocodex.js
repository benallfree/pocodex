/// <reference path="../jsvm.d.ts" />
migrate(
  (db) => {
    const collection = new Collection({
      id: 'kxhogh0nu8cyokn',
      name: 'pocodex',
      type: 'base',
      system: false,
      schema: [
        {
          system: false,
          id: 'adbqji6s',
          name: 'type',
          type: 'text',
          required: true,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
        {
          system: false,
          id: 'ebc7jrha',
          name: 'key',
          type: 'text',
          required: true,
          presentable: false,
          unique: false,
          options: {
            min: null,
            max: null,
            pattern: '',
          },
        },
        {
          system: false,
          id: 'w8tqpoan',
          name: 'value',
          type: 'json',
          required: true,
          presentable: false,
          unique: false,
          options: {
            maxSize: 2000000,
          },
        },
      ],
      indexes: [
        'CREATE UNIQUE INDEX `idx_ZXzaX03` ON `pocodex` (`key`)',
        'CREATE INDEX `idx_3GHTqQ4` ON `pocodex` (`type`)',
        'CREATE INDEX `idx_qdpyrxk` ON `pocodex` (\n  `type`,\n  `key`\n)',
      ],
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      options: {},
    })

    return Dao(db).saveCollection(collection)
  },
  (db) => {
    const dao = new Dao(db)
    const collection = dao.findCollectionByNameOrId('kxhogh0nu8cyokn')

    return dao.deleteCollection(collection)
  }
)
