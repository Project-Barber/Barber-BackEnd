

const formatDate = async (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`; 
};

const generate_cookie = async (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 12 * 1000, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });
    return res;
}

export default {formatDate, generate_cookie};
