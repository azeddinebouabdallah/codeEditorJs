'use strict';

module.exports = (value) => {
    const data = {
        value
    };
    
    return function(value) {
        if (!arguments.length)
            return data.value;
         
        data.value = value;
         
        return value;
    };
};

