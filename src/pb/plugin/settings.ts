import { WritableDraft, produce } from 'immer'
import { dbg } from 'pocketbase-log'
import { stringify } from 'pocketbase-stringify'

export type SettingsCreator<T> = () => T
export type SettingsUpdater<T> = (value: WritableDraft<T>) => void

export const getSetting = <T>(
  dao: daos.Dao,
  owner: string,
  type?: string,
  key?: string,
  defaultValue?: SettingsCreator<T>
): T | null => {
  const setting =
    getSettings<T>(dao, owner, type, key)[0]?.value ??
    (defaultValue?.() || null)
  dbg(`Fetched setting ${owner}:${type}:${key}`, { setting })
  return setting
}

export const getSettings = <T>(
  dao: daos.Dao,
  owner: string,
  type?: string,
  key?: string
): { owner: string; type: string; key: string; value: T }[] => {
  const expressions = [$dbx.exp(`owner = {:owner}`, { owner })]
  if (type) {
    expressions.push($dbx.exp(`type = {:type}`, { type }))
  }
  if (key) {
    expressions.push($dbx.exp(`key = {:key}`, { key }))
  }
  const records = dao.findRecordsByExpr('pocodex', ...expressions)
  dbg(`Fetched settings ${owner}:${type}:${key}`, { records })

  return records
    .filter((r): r is models.Record => !!r)
    .map((record) => ({
      owner: record.get(`owner`),
      type: record.get(`type`),
      key: record.get(`key`),
      value: JSON.parse(record.get(`value`)) as T,
    }))
}

export const setSetting = <T>(
  dao: daos.Dao,
  owner: string,
  type: string,
  key: string,
  updater: SettingsUpdater<T>,
  creator: SettingsCreator<T>
) => {
  let finalValue = null as T
  dao.runInTransaction((txDao) => {
    try {
      dbg(`Attempting to update setting ${owner}:${type}:${key}`)
      const record = txDao.findFirstRecordByFilter(
        'pocodex',
        'owner = {:owner} && type = {:type} && key = {:key}',
        { owner, type, key }
      )
      dbg(`Found setting ${owner}:${type}:${key}`, { record })
      const newValue = produce(JSON.parse(record.get('value')) as T, updater)
      dbg(`Updating setting ${owner}:${type}:${key}`, {
        oldValue: record,
        newValue,
      })
      record.set('value', stringify(newValue))
      txDao.saveRecord(record)
      finalValue = newValue as T
      dbg(`Updated setting ${owner}:${type}:${key}`, { record })
    } catch (e) {
      if (!`${e}`.match(/no rows/)) {
        throw e
      }
      dbg(`Creating setting ${owner}:${type}:${key}`)
      try {
        const collection = txDao.findCollectionByNameOrId('pocodex')

        const newValue = produce(creator(), updater)
        const record = new Record(collection, {
          owner,
          type,
          key,
          value: stringify(newValue),
        })

        txDao.saveRecord(record)
        dbg(`Created setting ${owner}:${type}:${key}`, { record })
        finalValue = newValue
      } catch (e) {
        dbg(`Error saving setting ${owner}:${type}:${key}`, e)
      }
    }
  })
  return finalValue
}

export const deleteSettings = (
  dao: daos.Dao,
  owner: string,
  type?: string,
  key?: string
) => {
  try {
    const expressions = [$dbx.exp(`owner = {:owner}`, { owner })]
    if (type) {
      expressions.push($dbx.exp(`type = {:type}`, { type }))
    }
    if (key) {
      expressions.push($dbx.exp(`key = {:key}`, { key }))
    }
    dbg(`Deleting settings ${owner}:${type}:${key}`)
    const records = dao.findRecordsByExpr('pocodex', ...expressions)
    dao.runInTransaction((txDao) => {
      records
        .filter((r): r is models.Record => !!r)
        .forEach((record) => {
          dbg(
            `Deleting setting ${record.get('owner')}:${record.get('type')}:${record.get('key')}`
          )
          try {
            txDao.deleteRecord(record)
          } catch (e) {
            dbg(`Error deleting setting ${owner}:${type}:${key}: ${e}`)
            dbg(e)
          }
        })
    })
    dbg(`Deleted settings ${owner}:${type}:${key}`)
  } catch (e) {
    dbg(`Error deleting setting ${owner}:${type}:${key}: ${e}`)
    dbg(e)
  }
}
