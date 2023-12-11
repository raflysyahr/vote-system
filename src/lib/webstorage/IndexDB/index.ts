// const storage = indexedDB.open('aux-002003010',1)

// const create = (name:string)=> storage.result.createObjectStore(name,{autoIncrement:true})
// const trx = (name:string)=> storage.result.transaction(name,'readwrite')
// const transaction = trx('aux-002003010')
// const obj = transaction.objectStore('aux-object')
// const add = (value:any,key?:IDBValidKey):IDBRequest<IDBValidKey>=> obj.add(value,key)

function Dexia(){
    
    return {
        open:(name:string,version:number)=>{
            const storex = indexedDB.open(name,version)
            return {
                mode:(mode?:IDBTransactionMode)=>{
                    const trx = storex.result.transaction(name,mode)
                    return {
                        object:(objname:string)=>{
        
                            const object = trx.objectStore(objname)
                            return {
                                add:(value:any,key?:IDBValidKey):IDBRequest<IDBValidKey>=>{
                                    return object.add(value,key)
                                }
                            }
                        }
                    }
                }

            }
        }
    }
}



// const data = JSON.stringify({ name:'ok',status:'success'})

// Dexia('aux-002003010',1).mode('readwrite').object('aux-object').add(data,'_id')

export { Dexia }