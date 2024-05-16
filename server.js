const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Signup = require('./models/User');
const Wallet = require('./models/Wallet');
const Transaction = require('./models/Transaction');
const cors = require('cors')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const MongoStore = require('connect-mongo');


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shreyasguptateetrade@gmail.com',
        pass: 'nbbd ersw zjcr uutd' // Your password
    }
});
const secretKey = crypto.randomBytes(32).toString('hex');

app.use(cors({ origin : '*'}))

app.use(cookieParser());

app.use(session({
    secret: secretKey, // Change this to a secret key for session encryption
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://ak8628041311:Ankymohi@cluster0.039rfki.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0' }),
    cookie: { secure: false } // Change to true if using HTTPS
}));

app.set('trust proxy', 1);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect('mongodb+srv://ak8628041311:Ankymohi@cluster0.039rfki.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});


// Set EJS as the view engine
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));


// Serve static files from the 'public' directory
app.use(express.static('public'));



// Define a route to render the index.ejs file
app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await Signup.findOne({ email: email });

        console.log(user);

        if (!user || user.password !== password) {
            res.status(200).send({ code: '401' });
        } else {

            req.session.user = user;
            res.status(200).send('Login successful');
        }
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/signup', (req, res) => {
    res.render('signup');
});


app.get('/forget', (req, res) => {
    res.render('forget');
});


app.get('/dashboard', async(req, res) => {

    console.log(req.session);

    var wallet = await Wallet.find({ userId: req.session.user._id });

    console.log(wallet.length);

    var wallet1 = []


   

    var bal = 0
    Wallet.aggregate([
        {
          $match: {
            userId: req.session.user._id // Replace 'your-category' with the desired category
          }
        },
        {
          $group: {
            _id: null,
            balance: { $sum: '$balance' }
          }
        }
      ]).then((result) => {
       // console.log('Total sum of amounts for category:', result.length ? result[0].balance : 0);
       // bal = result[0].balance;

       if(result[0]){
        if (req.session.user) {
            if(req.session.user.kyc == true){


    if(wallet.length == 0){
      //  res.render('dashboard',{ user: req.session.user , balance : result[0].balance , wallet : wallet1  });

        res.render('dashboard', { user: req.session.user , balance : result[0].balance , wallet: wallet.length > 0 ? wallet : null });

        
    }else{
        res.render('dashboard',{ user: req.session.user , balance : result[0].balance , wallet : wallet });
    }
    
               
    
            }else{
    
                res.render('profile2',{ user: req.session.user });
            }
            
        } else {
            res.status(401).send('You need to login first');
        }
       }else{
        if (req.session.user) {
            if(req.session.user.kyc == true){
    
                res.render('dashboard',{ user: req.session.user , balance : 0 });
    
            }else{
    
                res.render('profile2',{ user: req.session.user });
            }
            
        } else {
            res.status(401).send('You need to login first');
        }
       }
     
      }).catch((err) => {
        console.error('Error:', err);
      });

 
 
});


app.get('/wallet', (req, res) => {

    console.log(req.session.user);

    if (req.session.user) {
        if(req.session.user.kyc == true){

            res.render('profile1',{ user: req.session.user });

        }else{

            res.render('/');
        }
        
    } else {
        res.status(401).send('You need to login first');
    }
 
});
app.get('/trade', (req, res) => {
    res.render('webtrader',{user:req.session.user});
});


app.get('/tradingsignals', (req, res) => {
    res.render('signals',{user:req.session.user});
});

app.get('/investments', (req, res) => {
    res.render('investments',{user:req.session.user});
});

app.get('/owners', (req, res) => {
    res.render('owners',{user:req.session.user});
});

app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('login');
        }
    });
});



app.post('/register', async (req, res) => {

  

    console.log(req.body);


    try {

     
      // Extract form data from request body
      const { accountType, title, firstname, lastname,username, email, dob, country, phone } = req.body;

      var pass = generateRandomPassword(12);


      const user = await Signup.findOne({ email: email });

      console.log(user);

      if (!user) {
         
        let mailOptions = {
            from: 'shreyasguptateetrade@gmail.com', // Sender address
            to: email, // List of recipients
            subject: 'Signup Successfull', // Subject line
            text: 'Signup Successfull Password is '+pass // Plain text body
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        
      
          // Create a new signup document
          const newSignup = new Signup({
            accountType,
            title,
            firstname,
            lastname,
            username,
            email,
            dob,
            country,
            phone,
            password:pass,
            kyc : false
          });
      
          // Save the signup data to the database
          await newSignup.save();
      
          // Send a response
          res.status(200).json({ message: 'Signup successful! and password is '+pass });
      } else {

        //   req.session.user = user;
          res.status(200).send('User Already Exists');


      }



   
    } catch (error) {
      console.error('Error processing signup:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  function generateRandomPassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}


  app.post('/addwallet', async (req, res) => {

    console.log(req.body);
    try {
      // Extract form data from request body
      const { walletname  } = req.body;
  
      // Create a new signup document
      const newSignup = new Wallet({
        walletname,
        balance:10000,
        leverage : "1:0",
        account : 'MT4-demo',
        userId:req.session.user._id
      });
  
      // Save the signup data to the database
      await newSignup.save();
  
      // Send a response
      res.status(200).json({ message: 'Wallet successful!' });
    } catch (error) {
      console.error('Error processing signup:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });




  app.post('/addtransaction', async (req, res) => {

    console.log(req.body);
    try {
      // Extract form data from request body
      const { from , two , amount ,message   } = req.body;


      var date = new Date();

      var identifier = (Math.random() + 1).toString(36).substring(7);
  //let r = (Math.random() + 1).toString(36).substring(7);
      // Create a new signup document
      const newSignup = new Transaction({
        identifier,
        from,
        two,
        amount,
        date,
        processed:date,
        paymentmethod : "Wallet",
        message,
        userId:req.session.user._id
      });
  
      // Save the signup data to the database
      await newSignup.save();
  
      // Send a response
      res.status(200).json({ message: 'Transaction successful!' });
    } catch (error) {
      console.error('Error processing signup:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/kyc', async (req, res) => {

    const updateUserByEmail = async (email, newData) => {
        try {
            // Find the user by email and update their details
            const updatedUser = await Signup.findOneAndUpdate(
                { email: email }, // Query: find user by email
                newData,         // Update: new data to set
                { new: true }    // Options: return the modified document
            );
            
            if (updatedUser) {
                console.log('User updated successfully:', updatedUser);
            } else {
                console.log('User not found with email:', email);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };


    updateUserByEmail(req.query.email, { kyc: true });

    res.render('wallet',{user:req.session.user});




   
  });


  


  //login




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
