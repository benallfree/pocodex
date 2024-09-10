import { dbg } from 'pocketbase-log'
import { PluginConfigured, PluginMeta } from '../types'

export const initPluginMeta = (dao: daos.Dao, name: string) => {
  const collection = dao.findCollectionByNameOrId('pocodex')
  const meta: PluginMeta = { migrations: {} }
  const record = new Record(collection, {
    key: name,
    value: meta,
  })
  dao.saveRecord(record)
}

export const updatePluginMeta = (
  txDao: daos.Dao,
  plugin: PluginConfigured,
  update: (meta: PluginMeta) => PluginMeta,
) => {
  const { name } = plugin
  dbg(`***updatePluginMeta`, { name })
  const record = txDao.findFirstRecordByData('pocodex', 'key', name)
  if (!record) {
    throw new Error(`Plugin meta not found for ${name}`)
  }
  record.set(`value`, update(record.get(`value`)))
  txDao.saveRecord(record)
}
