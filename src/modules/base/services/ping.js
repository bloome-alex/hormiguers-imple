export default async function(){
    return new Promise((resolve) => {
        setTimeout(()=>{
            resolve('pong')
        }, 1000)
    })
}