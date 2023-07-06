# lis
**LIS** (Local Interface for Storage), is a "key-value" frontend database build on *indexedDB* and with typescript support<sup>[1]<sup>.

## API
The library offers three functions (**write**, **read** and **erase**)

### write
`write( key:string, value:any ): Promise<void>`<sup>[2]</sup> Can save persistent data with "key-value" structure, similar to `localStorage` API.
``` typescript
import { write } from 'lis'

write( 'hello', 'Hello World!' ).then( () => {
  console.log( 'Data Saved' )
} )
```

### read
`read<T>( ...keys:string[] ): Promise<T[]>`<sup>[2]</sup> is used to read data from the database. It takes as many *keys* as you want and its promise is resolved with an `array` of the saved values. You can set the array elements *type* with the **generic type** *T*<sup>[3]</sup>
``` typescript
import { read } from 'lis'

read<string>( 'hello' ).then( values:string[] => {
  const [ hello ] = values  // Using Desestucturing (recommended)
  console.log( hello ) // 'Hello World!'
} )
```
Also you can use **as** operator with a *tupla* to get values with a different *type*
``` typescript
import { read, write } from 'lis'

write( 'num', 7 ).then( () => {
  // Waiting for save data to read it
  read( 'num', 'hello' ).then( values => {
    type tupla = [ number, string ]
    const [ num, hello ] = values as tupla
    console.log( typeof num, typeof hello )  // 'number', 'string'
  } )
} )
```
**Warning:** Undeclared values will be `null`
``` typescript
import { read } from 'lis'

// "x" was not written
read( 'x' ).then( values => {
  const [ x ] = values
  console.log( x )  // null
} )
```

### erase
`erase( key:string ): Promise<void>`<sup>[2]</sup> is used to erase data from the database
``` typescript
import { erase, read } from 'lis'

read<string>( 'hello' ).then( values => {
  const [ hello ] = values
  console.log( hello )  // 'Hello World!'
  erase( 'hello' ).then( () => {
    // Waiting for erase data to read it
    read<string>( 'hello' ).then( values => {
      const [ hello ] = values
      console.log( hello )  // null
    } )
  } )
} )
```

> 1. If do you use this library with javascript, types features will be incompatible.
> 2. This async function will resolve its promise when finish its task.
> 3. If you don't use it, the promise will be resolved with `unknown[]` type