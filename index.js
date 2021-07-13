const {blockchainRpcUrl, contractAddress} = require("./config")
var fs=require("fs");
const { resolve } = require("path");
var Web3=require("web3")
var {performance}=require("perf_hooks")
var web3=new Web3(blockchainRpcUrl);
const path = require('path');

var contractins=new web3.eth.Contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "j",
				"type": "uint256"
			},
			{
				"name": "i",
				"type": "uint256"
			},
			{
				"name": "_buffer",
				"type": "bytes"
			},
			{
				"name": "_name",
				"type": "string"
			}
		],
		"name": "adddata",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "k",
				"type": "uint256"
			},
			{
				"name": "i",
				"type": "uint256"
			}
		],
		"name": "getchunk",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "res",
				"type": "bytes"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getoccplaces",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "subname",
				"type": "string"
			},
			{
				"name": "max",
				"type": "uint256"
			}
		],
		"name": "getPlaces",
		"outputs": [
			{
				"name": "SelPlaces",
				"type": "uint256[]"
			},
			{
				"name": "Num",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
],contractAddress)


let chunks=[];

function fileadder(i,j,name,coinbase)
{
	return new Promise(  async (resolve,reject)=>{
		console.log("starting "+j+"th transaction");
		let res;
		let count=10;
		while(count>0)
		{
			try{
				
				res=await contractins.methods.adddata(i,j,chunks[j],name).send({from: coinbase,gas:899840316171878 }).then(function(res){
					return res;
				});
				
				console.log("finished "+j+"th tracsaction in "+i+"th place");
				break;
			}catch(error)
			{
				console.log(error);
				console.log("reatempting "+j+"th transaction in "+i+"th place");
				count--;
			}
		}
		if(count==0)
			reject("error cannot complete"+j+"th transaction in"+i+"th place");
		else
			resolve(res);
	} );
    
}



async function test(fileplace,len,name,directory)
{
    const readstream=fs.createReadStream(directory+name);
  
    let buffer=[];
    for await (chunk of readstream)
    {
       buffer.push(chunk);
    }
    console.log(buffer[0].length);
    buffer= Buffer.concat(buffer);
    console.log(buffer.length);

    let index=0;
    while(true)
    {
        if(index+len<=buffer.length)
        {
            chunks.push(buffer.slice(index,index+len));
            index+=len;
        }
        else
        {
            chunks.push(buffer.slice(index,buffer.length));
            break;
        }
    }

    const coinbase=await web3.eth.getCoinbase().then(res=>res);
	let promisearry=[];
	
	for(let i=0;i<chunks.length;i++)
	{
		promisearry.push(fileadder(fileplace,i,name,coinbase));
		if(promisearry.length==20)
		{
			res=await Promise.all(promisearry);
			promisearry=[];
		}
	}
	res=await Promise.all(promisearry);

	


	console.log("every thing is finished");

    chunks=[];
}


async function getfiles(subname,max,directory){
	
    const coinbase=await web3.eth.getCoinbase().then(res=>res);
    const {SelPlaces,Num}=await contractins.methods.getPlaces(subname,max).call({"from":coinbase},function(err,res){
        return res;
    });

	let res;
	console.log(Num);
	let buff=[];
	
	let j=0;
	let resu;
	for(let i=0;i<Num;i++)
	{
		chunks=[];
		j=0;
		while(true)
		{
			resu=await contractins.methods.getchunk(SelPlaces[i],j).call({"from":coinbase},function(err,res){
				return res;
			});
			res=resu.res;

			if(res==null)
				break;
			buff=[];
			for(let i=0;i<(res.length-2)/2;i++)
			{
				buff.push(parseInt("0x"+res[2*i+2]+res[2*i+3]));
			}
			buff=Buffer(buff);
			chunks.push(buff);
			j++;
		}
		chunks=Buffer.concat(chunks);
		fs.writeFileSync(directory+resu.name,chunks);
	}
}

async function upload(directory)
{
	let names=fs.readdirSync('./upfiles/');
	for(let i=0;i<names.length;i++)
	{
		await test(i,30768,names[i],directory);
	}
}
module.exports={upload, getfiles}

