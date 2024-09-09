/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tp9dc9p46qqy65w")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_1kct3t9` ON `codex` (`key`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("tp9dc9p46qqy65w")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_yfXVzvG` ON `codex` (`key`)"
  ]

  return dao.saveCollection(collection)
})
