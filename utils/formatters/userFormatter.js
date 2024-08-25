exports.findOneFormatter = (user) => {
    
    return{
       id: user.id,
    
       name: user.name,
    
       email: user.email,
    
       numberOfLogins: user.number_of_logins,
    
       lastLogin: user.last_login,
    
       verified: user.verified,

       createdAt: user.createdAt
    }
}
exports.findAllFormatter = (user) => {
    
    return{
       id: user.id,
    
       name: user.name,
    
       email: user.email,
    
       verified: user.verified,

       lastLogin: user.last_login,

       createdAt: user.createdAt
    }
}