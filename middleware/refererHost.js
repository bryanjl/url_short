//function to determine which host and return a string of host name
const refererHost = (address) => {
    let refererList = 
        {
            'https://t.co/': 'Twitter',
            'https://l.facebook.com/': 'Facebook'
        }
    

    if(refererList[address]){
        return refererList[address];
    } else {
        return 'Other'
    }    
}

module.exports = refererHost;