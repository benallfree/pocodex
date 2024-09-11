import { WritableDraft, produce } from 'immer'
import { dbg } from 'pocketbase-log'
import { stringify } from 'pocketbase-stringify'
import { PartialDeep as Untrusted } from 'type-fest'

export type UntrustedSettingsUpdater<T> = (
  value: WritableDraft<Untrusted<T>>
) => void
export type TrustedSettingsUpdater<T> = (value: WritableDraft<T>) => void

export const getSetting = <T>(
  dao: daos.Dao,
  owner: string,
  type?: string,
  key?: string
): Untrusted<T> | null => {
  return getSettings<T>(dao, owner, type, key)[0]?.value ?? null
}

export const getSettings = <T>(
  dao: daos.Dao,
  owner: string,
  type?: string,
  key?: string
): { owner: string; type: string; key: string; value: Untrusted<T> }[] => {
  const expressions = [$dbx.exp(`owner = {:owner}`, { owner })]
  if (type) {
    expressions.push($dbx.exp(`type = {:type}`, { type }))
  }
  if (key) {
    expressions.push($dbx.exp(`key = {:key}`, { key }))
  }
  const records = dao.findRecordsByExpr('pocodex', ...expressions)
  dbg(`Fetched setting ${owner}:${type}:${key}`, { records })

  return records
    .filter((r): r is models.Record => !!r)
    .map((record) => ({
      owner: record.get(`owner`),
      type: record.get(`type`),
      key: record.get(`key`),
      value: record.get(`value`),
    }))
}

export const setSetting = <T>(
  dao: daos.Dao,
  owner: string,
  type: string,
  key: string,
  updater: UntrustedSettingsUpdater<T>
) => {
  let finalValue = null as Untrusted<T>
  dao.runInTransaction(() => {
    try {
      dbg(`Attempting to update setting ${type}:${key}`)
      const record = dao.findFirstRecordByFilter(
        'pocodex',
        'owner = {:owner} && type = {:type} && key = {:key}',
        { owner, type, key }
      )
      record.set('value', produce(record.get('value'), updater))
      dao.saveRecord(record)
      finalValue = record.get('value') as Untrusted<T>
      dbg(`Updated setting ${type}:${key}`, { record })
    } catch (e) {
      // Record does not exist, create it
      dbg(`Setting failed to update ${type}:${key}`, e)
      dbg(`Setting not found ${type}:${key}, creating it`)
      try {
        const collection = $app.dao().findCollectionByNameOrId('pocodex')

        const record = new Record(collection, {
          owner,
          type,
          key,
          value: stringify(produce({}, updater)),
        })

        dao.saveRecord(record)
        dbg(`Created setting ${owner}:${type}:${key}`, { record })
        finalValue = record.get('value') as Untrusted<T>
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
    dao.runInTransaction(() => {
      records
        .filter((r): r is models.Record => !!r)
        .forEach((record) => {
          dbg(
            `Deleting setting ${record.get('owner')}:${record.get('type')}:${record.get('key')}`
          )
          try {
            dao.deleteRecord(record)
          } catch (e) {
            dbg(`Error deleting setting ${owner}:${type}:${key}: ${e}`)
            dbg(e)
          }
        })
    })
  } catch (e) {
    dbg(`Error deleting setting ${owner}:${type}:${key}: ${e}`)
    dbg(e)
  }
}
