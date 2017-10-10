var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'harrypotter';

module.exports = function(router) {
  router.post('/users', function(req,res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if(req.body.username == "" || req.body.username == null || req.body.email == "" || req.body.email == null || req.body.password == "" || req.body.password == null) {
      res.json({ success : false, message : 'fill everything..'});
    } else {
    user.save(function (err) {
      if (err) {
        res.json({ success : false, message : 'try with unique data..'});
      } else {
        res.json({ success : true, message : 'ok...carrtOn'});
      }
    });
    }
  });

  router.post('/authen', function(req,res) {
    User.findOne({ username : req.body.username}).select('email username password').exec(function(err,user) {
      if(err) throw err;
      if(!user) {
        res.json({success:false, message:'no auth..'});
      } else if(user) {
        if(req.body.password) {
          var validPass = user.compPass(req.body.password);
        } else {
          res.json({success:false, message:'no Pass..'});
        }
        if(!validPass) {
          res.json({success:false, message:'not valid Pass'});
        } else {
          var token = jwt.sign({ username: user.username, email: user.email}, secret, { expiresIn: '24h'});
          res.json({success:true, message:'ok valid..', token: token});
        }
      }
    });
  });

  router.use(function(req,res,next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    if(token) {
      // verify token.....
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.json({ success: false, message: 'token invalid..'});
        } else {
          // sign the token to local variable & send it to /me
          req.decoded = decoded;
          next();
        }

      });
    } else {
      res.json({ success: false, messsage:'no token provided...'});
    }
  });

  router.post('/me', function(req,res) {
    res.send(req.decoded);
  });

  return router;
}
