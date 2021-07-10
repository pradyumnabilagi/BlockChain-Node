const myPomise = (name)=>{
    return new Promise((resolve, reject)=>{
        console.log('okman');
        resolve("k");
    })
}



// const myPomise1 = (name)=>{
//     return new Promise((resolve, reject)=>{
//         if(name === "umesh"){
//             resolve(name)
//         }else{
//             reject("invalid Name")
//         }
//     })
// }
// const myPomise2 = (name)=>{
//     return new Promise((resolve, reject)=>{
//         if(name === "pradyu"){
//             resolve(name)
//         }else{
//             reject("invalid Name")
//         }
//     })
// }









let call = async(_name)=>{
    try{
        
        let t=myPomise(_name);
        console.log(t);
        let name=await t;
        console.log(name);

    }catch(error)
    {
        console.log(error);
    }
    
}

call("pradyu")


