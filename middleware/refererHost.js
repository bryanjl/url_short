//function to determine which host and return a string of host name
const refererHost = (address) => {
    let refererList = 
        {
            'https://t.co/': 'Twitter',
            'https://l.facebook.com/': 'Facebook'
        }
    

    // const urlObj = new URL(address);
    // console.log(urlObj);

    if(refererList[address]){
        return refererList[address];
    } else {
        return 'Other'
    }    
}

module.exports = refererHost;