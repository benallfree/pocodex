/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "tp9dc9p46qqy65w",
    "created": "2024-09-05 10:42:45.188Z",
    "updated": "2024-09-05 10:42:45.188Z",
    "name": "codex",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "0vfwncxz",
        "name": "key",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "xfyqxa4z",
        "name": "value",
        "type": "json",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_yfXVzvG` ON `codex` (`key`)"
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("tp9dc9p46qqy65w");

  return dao.deleteCollection(collection);
})
