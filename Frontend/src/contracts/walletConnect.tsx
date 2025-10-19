import { ethers } from 'ethers';

export async function metamaskConnect():Promise<string|null>{
    console.log('Yes sir')
    if(!window.ethereum){
        alert("Install metamask first");
        return null;
    }
    
    const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(address[0]);
    const Provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await Provider.getSigner();
    return address[0];

}
