import { dbg } from 'pocketbase-log'

export const initPluginMeta = (dao, name) => {
  const collection = dao.findCollectionByNameOrId('pocodex')
  const record = new Record(collection, {
    key: name,
    value: { migrations: {} },
  })
  dao.saveRecord(record)
}

export const updatePluginMeta = (txDao, pluginName, update) => {
  dbg(`***updatePluginMeta`, { pluginName })
  const record = txDao.findFirstRecordByData('pocodex', 'key', pluginName)
  update(record)
  txDao.saveRecord(record)
}
