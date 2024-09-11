import { WritableDraft, produce } from 'immer'
import { dbg } from 'pocketbase-log'
import { PartialDeep as Untrusted } from 'type-fest'

export const getSetting = <T>(
  dao: daos.Dao,
  type: string,
  key: string
): Untrusted<T> | null => {
  try {
    const record = dao.findFirstRecordByFilter(
      'pocodex',
      'type = {:type} && key = {:key}',
      { type, key }
    )
    dbg(`Fetched setting ${type}:${key}`, { record })

    return record.get(`value`) as Untrusted<T>
  } catch (e) {
    dbg(`Setting not found ${type}:${key}`)
    return null
  }
}

export const getSettings = <T>(
  dao: daos.Dao,
  type: string
): { key: string; value: Untrusted<T> }[] => {
  const records = dao.findRecordsByExpr(
    'pocodex',
    $dbx.exp(`type = {:type}`, { type })
  )
  dbg(`Fetched setting ${type}}`, { records })

  return records
    .filter((r): r is models.Record => !!r)
    .map((record) => ({
      key: record.get(`key`),
      value: record.get(`value`),
    }))
}

export type UntrustedSettingsUpdater<T> = (
  value: WritableDraft<Untrusted<T>>
) => void
export type TrustedSettingsUpdater<T> = (value: WritableDraft<T>) => void

export const setSetting = <T>(
  dao: daos.Dao,
  type: string,
  key: string,
  updater: UntrustedSettingsUpdater<T>
) => {
  let finalValue = null as Untrusted<T>
  dao.runInTransaction(() => {
    try {
      const record = dao.findFirstRecordByFilter(
        'pocodex',
        'type = {:type} && key = {:key}',
        { type, key }
      )
      record.set('value', produce(record.get('value'), updater))
      dao.saveRecord(record)
      finalValue = record.get('value') as Untrusted<T>
    } catch (e) {
      // Record does not exist, create it
      try {
        const collection = $app.dao().findCollectionByNameOrId('pocodex')

        const record = new Record(collection, {
          type,
          key,
          value: produce({}, updater),
        })

        dao.saveRecord(record)
        finalValue = record.get('value') as Untrusted<T>
      } catch (e) {
        dbg(`Error saving setting ${type}:${key}: ${e}`)
        if (e instanceof Error) {
          dbg(e.stack)
        }
      }
    }
  })
  return finalValue
}

export const deleteSetting = (dao: daos.Dao, type: string, key: string) => {
  dao.runInTransaction(() => {
    try {
      const record = dao.findFirstRecordByFilter(
        'pocodex',
        'type = {:type} && key = {:key}',
        { type, key }
      )
      dao.deleteRecord(record)
    } catch (e) {
      dbg(`Error deleting setting ${type}:${key}: ${e}`)
    }
  })
}
