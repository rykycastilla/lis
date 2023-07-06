const dbRequest = indexedDB.open( 'LIS' ),
  storage = 'storage'

interface CustomEvent<T> {
  target: { result:T }
}

type IDBEvent = CustomEvent<IDBDatabase>

const db: Promise<IDBDatabase> = new Promise( resolve => {
  
  // Loading database
  dbRequest.onsuccess = ( event:Event ) => {
    const databaseEvent = event as unknown as IDBEvent
    const { result } = databaseEvent.target
    resolve( result )
  }

  // Creating database store
  dbRequest.onupgradeneeded = ( event:Event ) => {
    const databaseEvent = event as unknown as IDBEvent
    const { result: db } = databaseEvent.target
    db.createObjectStore( storage, { keyPath: 'key' } )
  }
} )

// Write "key-value" data
async function write( key:string, value:any ) {
  const database = await db
  // Requesting to save data
  const transaction = database.transaction( storage, 'readwrite' ),
    store = transaction.objectStore( storage ),
    task = store.put( { key: key, value: value } )  // Saving data
  // Waiting for "data save successfully"
  const saveData = new Promise( resolve => {
    task.onsuccess = () => resolve( null )
  } )
  await saveData
}

interface DatabaseModel {
  key: string
  value: unknown | undefined
}

type ReadEvent = CustomEvent<DatabaseModel>

// Read a single item (only admits one key)
async function readItem( key:string ): Promise<unknown> {
  const database = await db
  // Requesting to read data
  const transaction = database.transaction( storage, 'readwrite' ),
    store = transaction.objectStore( storage ),
    task = store.get( key )  // Getting data from database
  // Waiting for request
  const readData: Promise<unknown> = new Promise( resolve => {
    task.onsuccess = ( event:Event ) => {
      const resultEvent = event as unknown as ReadEvent
      const { result } = resultEvent.target
      // Returning null if data is not exist
      const value = ( result === undefined )
        ? null
        : result.value
      resolve( value )
    }
  } )
  return await readData
}

// Can read multiple items
async function read<T>( ...keys:string[] ): Promise<T[]> {
  const values: unknown[] = []
  // Reading all values
  for( const key of keys ) {
    const value: unknown = await readItem( key )  // Reading
    values.push( value )
  }
  return values as T[]
}

// probar como funciona con los que no existen

// Erase "key" element from the database
async function erase( key:string ) {
  const database = await db
  // Requesting to erase data
  const transaction = database.transaction( storage, 'readwrite' ),
    store = transaction.objectStore( storage ),
    task = store.delete( key )  // Erasing data
  // Waiting for "data erase successfully"
  const eraseData = new Promise( resolve => {
    task.onsuccess = () => resolve( null )
  } )
  await eraseData
}

export { write, read, erase }