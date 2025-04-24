

const formatDate = async (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`; 
};


export default {formatDate};
