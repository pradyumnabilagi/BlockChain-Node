# BlockChain-Node
BlockChain without ipfs. Storing the files directly on the blockchain .

## soliduity (smart contract)
please deploy this on your blockchain network
```solidity
// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.4.18;


contract Greeting {

    
    struct file{
        mapping(uint=>bytes) chunks;
        string name;
    }
    mapping(uint=>file) Files;
    uint[] places;
    
    function adddata(uint j,uint i,bytes _buffer,string _name) public{
        var File=Files[j];
        if(bytes(File.name).length==0)
            places.push(j);
        
        File.name=_name;
        
        File.chunks[i]=_buffer;
    }
    
    
      function isSubstr(string str,string substr) pure private returns (bool){
        bytes memory Str=bytes(str);
        bytes memory SubStr=bytes(substr);
        if(SubStr.length==0 || SubStr.length>Str.length)
            return false;
       uint j=0;
       uint i=0;
       for(i=0;i<Str.length-SubStr.length+1;i++)
       {
           
           for( j=0;j<SubStr.length;j++)
           {
                if(Str[i+j]!=SubStr[j])
                    break;
           }
           if(j==SubStr.length)
                return true;
       }
        return false;
    }
    
    function getPlaces(string subname,uint max) view public returns (uint[] SelPlaces,uint Num){
        uint i=0;
        uint[] memory selPlaces=new uint[](max);
        uint num=0;
        for(i=0;i<places.length && num<max;i++)
        {
            if(isSubstr(Files[places[i]].name,subname))
            {
                selPlaces[num++]=places[i];
            }
        }
        return (selPlaces,num);
        
    }
    
    
    function getchunk(uint k,uint i) view public returns (string name,bytes res){
        return (Files[k].name,Files[k].chunks[i]);
    }

    function getoccplaces() view public returns (uint[]){
        return places;
    }
    
   
    
}

```