/**
 * Module Dependencies
 */
const jwt = require('jsonwebtoken');
const users = require('./users');

// jwt secret keys
const accessTokenSecret = process.env.accessTokenSecret
const refreshTokenSecret = process.env.refreshTokenSecret

// Refresh Token
const refreshTokens = [];

class authRoutes {
    static login (req, res) {
        // Read username and password from request body
        const { username, password } = req.body;
    
        // Filter user from the users array by username and password
        const user = users.find(u => { return u.username === username && u.password === password});
        
        if(user){
            // Generate an access token
            const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m'});
            const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret );
    
            refreshTokens.push(refreshToken);
    
            res.status(201).json({
                accessToken,
                refreshTokens
            });
        } else {
            res.send('Username or Passowrd incorrect')
        }
    }

    static token  (req, res) {
        const { token } = req.body;
    
        if(!token){
            return res.sendStatus(401);
        }
    
        if(!refreshTokens.includes(token)){
            return res.sendStatus(403);
        }
    
        jwt.verify(token, refreshTokenSecret, (err, user) => {
            if(err){
                return res.sendStatus(403);
            }
    
            const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m'})
    
            res.json({
                accessToken
            })
        })
    }

    static logout  (req, res)  {
        const { token } = req.body;
        refreshTokens = refreshTokens.filter(token => t !== token);
    
        res.send("Logout Successful")
    }
}

module.exports = authRoutes;