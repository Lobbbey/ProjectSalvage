//Imports
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config()

//All APIs
exports.setApp = function ( app, client )
{
    //Database and Collection declaration
    const db = client.db('SalvageFinancialDB');
    const usersCollection = db.collection('Users');

    //JWT Authenticator
    const authenticateJWT = (req, res, next) => {
        // Extract token from Bearer header
        const token = req.header("Authorization")?.split(" ")[1]; 

        //If token doesn't exist, deny access
        if (!token) {
            return res.status(401).json({ Result: "Access denied, token not given" });
        }
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded JWT:", decoded);
            console.log("Extracted Token:", token);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(403).json({ Result: error.message });
        }
    };

    //Login API
    //In: Email, Password
    //Out: Result, IfFound, token
    app.post('/api/Login', async (req, res) =>{
        let Result = "Could not find login";
        let IfFound = 0;
        try {
            //Input and Field Check
            const {Email, Password} = req.body;
            if (!Email || !Password){
                throw new Error("Invalid Input");
            }

            //DB Statement
            const user = await usersCollection.findOne(
                { Email: Email, Password: Password },   //Search criteria
                { projection: { _id: 1} }      //Returns only _id
            );

            //Configure response and send JSON response
            if (!user){     //If user does not match
                Result = "Could not match user";
                res.status(200).json({Result: Result, IfFound: IfFound});
            }
            else{   //If user does match
                Result = "Found user";
                IfFound = 1;

                // Generate JWT token
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                res.status(200).json({Result: Result, IfFound: IfFound, token});
            }       
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({Result: error.message});
        }
    });
    
    //Signup API
    //In: FName, LName, Email, Password
    //Out: Result
    app.post('/api/Signup', async (req, res) =>{
        let Result = "Could not add user";
        try {
            //Input and Field Check
            const {FName, LName, Email, Password} = req.body;
            if (!FName || !LName || !Email || !Password){
                throw new Error("Invalid Input");
            }
            const newUser = {FName: FName, LName: LName, Email: Email, Password: Password};     //Making New User Object
 
            //DB Statement
            const user = await usersCollection.findOne(
                { Email: Email },   //Search criteria
            );

            //Configure response and insert into database
            if (!user){         //If user doesnt already exist
                await usersCollection.insertOne(newUser);   //Adds new Users
                Result = "Added user";
            }
            else{           //If user already exists
                Result = "User Already Exists";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({Result: error.message});
        }
    });

    //ResetPassword API
    //In: Email, NewPassword
    //Out: Result
    app.post('/api/ResetPassword', async (req,res) => {
        let Result = "Could not reset password";
        try{
            //Input and Field Check
            const {Email, NewPassword} = req.body;
            if (!Email || !NewPassword){
                throw new Error("Invalid Input");
            }

            //DBStatement
            const user = await usersCollection.updateOne(
                {Email: Email},     //Search criteria
                {$set: {Password: NewPassword}}     //updates password
            );

            //Configure Response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to change password of";
            }
            else{          //If user was updated 
                Result = "Changed password of user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({Result: error.message});
        }
    });

    //IfEmailExists API
    //In: Email
    //Out: Result, IfFound
    app.post('/api/IfEmailExists', async(req,res) => {
        let Result = "Could not check if email exists";
        let IfFound = 0;
        try{
            //Input and Field Check
            const {Email} = req.body;
            if (!Email){
                throw new Error("Invalid Input");
            }

            //DBStatement
            const user = await usersCollection.findOne(
                {Email: Email}     //Search criteria
            );

            //Configure Response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find email in database";
            }
            else{          //If user was updated 
                Result = "Found email";
                IfFound = 1;
            }

            //Send JSON response
            res.status(200).json({Result: Result, IfFound: IfFound});
        } catch (error) {
            console.log(error)
            res.status(500).json({Result: error.message, IfFound: IfFound});
        }
    });

    //AddInitial API
    //In: token, InitialDebt, InitialAmount
    //Out: Result
    app.post('/api/AddInitial', authenticateJWT, async (req,res) => {
        let Result = "Could not add amount and debt";
        try{
            //Input and Field Check
            const {InitialDebt, InitialAmount} = req.body;
            const {_id} = req.user;
            if (!_id || !InitialDebt || !InitialAmount){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId            

            //DB 
            const user = await usersCollection.updateOne(
                { _id: objectId},    //Search criteria
                {$set: {InitialDebt: InitialDebt, InitialAmount: InitialAmount}}   //Updated info
            );

            //Configure response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to add initial debt and amount to";
            }
            else{          //If user was updated 
                Result = "Added amounts to user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({Result: error.message});
        }
    });

    //AddIncome API
    //In: token, Name, Amount, Account IfRecurring, InitialTime
    //Out: Result
    app.post('/api/AddIncome', authenticateJWT, async (req,res) => {
        let Result = "Could not add income";
        try{
            //Input and Field Check
            const {Name, Amount, Account, IfRecurring, InitialTime} = req.body;
            const {_id} = req.user;
            if (!_id || !Name || !Amount || !Account || IfRecurring == undefined || !InitialTime){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId

            //Create Objects for DB statement
            let newIncome = {Name: Name, Amount: Amount, Account: Account, IfRecurring: IfRecurring, InitialTime: {Month: InitialTime.Month, Day: InitialTime.Day, Year: InitialTime.Year}};

            //DB Statement
            const user = await usersCollection.updateOne(
                { _id: objectId},    //Search criteria
                {$push : {Income: newIncome}}   //Pushing onto Income Array new Income
            );

            //Configure response and send JSON response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to add income";
            }
            else{          //If user was updated 
                Result = "Added income to user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({Result: error.message});
        }
    });

    //AddDebt API
    //In: token, Name, Amount, APR, Monthly, LoanLength, InitialTime
    //Out: Result
    app.post('/api/AddDebt', authenticateJWT, async (req,res) => {
        let Result = "Could not add debt";
        try{
            //Input and Field Check
            const {Name, Amount, APR, Monthly, LoanLength, InitialTime} = req.body;
            const {_id} = req.user;
            if (!_id || !Name || !Amount || !APR || !Monthly ||  !LoanLength || !InitialTime){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId

            //Create Objects for DB statement
            let newDebt = {Name: Name, Amount: Amount, APR: APR, Monthly: Monthly, LoanLength: LoanLength, InitialTime: {Month: InitialTime.Month, Day: InitialTime.Day, Year: InitialTime.Year}};

            //DB Statement
            const user = await usersCollection.updateOne(
                { _id: objectId},    //Search criteria
                {$push : {Debts: newDebt}}   //Pushing onto Debts Array new Debt
            );

            //Configure response and send JSON response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to add debt";
            }
            else{          //If user was updated 
                Result = "Added debt to user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({Result: error.message});
        }
    });

    //AddSaving API
    //In: token, Name, Amount, APR, InitialTime
    //Out: Result
    app.post('/api/AddSaving', authenticateJWT, async (req,res) => {
        let Result = "Could not add saving";
        try{
            //Input and Field Check
            const {Name, Amount, APR, InitialTime} = req.body;
            const {_id} = req.user;
            if (!_id || !Name || !Amount || !APR || !InitialTime){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId

            //Create Objects for DB statement
            let newSaving = {Name: Name, Amount: Amount, APR: APR, InitialTime: {Month: InitialTime.Month, Day: InitialTime.Day, Year: InitialTime.Year}};

            //DB Statement
            const user = await usersCollection.updateOne(
                { _id: objectId},    //Search criteria
                {$push : {Savings: newSaving}}   //Pushing onto Savings Array new Saving
            );

            //Configure response and send JSON response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to add saving";
            }
            else{          //If user was updated 
                Result = "Added saving to user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({Result: error.message});
        }
    });

    //AddExpense API
    //In: token, Name, Category, Account, Amount, IfRecurring, InitialTime
    //Out: Result
    app.post('/api/AddExpense', authenticateJWT, async (req,res) => {
        let Result = "Could not add expense";
        try{
            //Input and Field Check
            const {Name, Amount, Category, Account, IfRecurring, InitialTime} = req.body;
            const {_id} = req.user;            
            if (!_id || !Name || !Amount || !Category || !Account || IfRecurring == undefined || !InitialTime){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId

            //Create Objects for DB statement
            let newExpense = {Name: Name, Amount: Amount, Category: Category, Account: Account, IfRecurring: IfRecurring, InitialTime: {Month: InitialTime.Month, Day: InitialTime.Day, Year: InitialTime.Year}};

            //DB Statement
            const user = await usersCollection.updateOne(
                { _id: objectId},    //Search criteria
                {$push : {Expenses: newExpense}}   //Pushing onto Expenses Array new Expense
            );

            //Configure response and send JSON response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to add expense";
            }
            else{          //If user was updated 
                Result = "Added expense to user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({Result: error.message});
        }
    });

    
    //EditIncome API
    //In: token, index, NewName, NewAmount, NewAccount, NewIfRecurring, NewInitialTime
    //Out: Result
    app.post('/api/EditIncome', authenticateJWT, async (req,res) => {
        let Result = "Could not edit income";
        try{
            //Input and Field Check
            const {index, NewName, NewAmount, NewIfRecurring, NewInitialTime} = req.body;
            const {_id} = req.user;
            if (!_id|| index == undefined|| !NewName || !NewAmount || NewIfRecurring == undefined || !NewInitialTime){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId
            
            //Create objects for DB Statement
            let newIncome = {Name: NewName, Amount: NewAmount, IfRecurring: NewIfRecurring, InitialTime: {Month: NewInitialTime.Month, Day: NewInitialTime.Day, Year: NewInitialTime.Year}};
            let indexSearch = `Income.${index}`;    //Concatenates the search string

            //DB
            const user = await usersCollection.updateOne(
                { _id: objectId},    //Search criteria
                {$set : {[indexSearch]: newIncome}}   //Pushing onto Income Array new Income
            );

            //Configure response and send JSON response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to edit income";
            }
            else{          //If user was updated 
                Result = "Edited income of user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error.message);
            res.status(500).json({Result: error.message});
        }
    });

    //EditDebt API
    //In: token, index, NewName, NewAmount, NewAPR, NewMonthly, NewLoanLength, NewInitialTime
    //Out: Result
    app.post('/api/EditDebt', authenticateJWT, async (req,res) => {
        let Result = "Could not edit debt";
        try{
            //Input and Field Check
            const {index, NewName, NewAmount, NewAPR, NewMonthly, NewLoanLength, NewInitialTime} = req.body;
            const {_id} = req.user;
            if (!_id|| index == undefined|| !NewName || !NewAmount  || !NewAPR || !NewMonthly || !NewLoanLength|| !NewInitialTime){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId
            
            //Create objects for DB Statement
            let newDebt = {Name: NewName, Amount: NewAmount, APR: NewAPR, Monthly: NewMonthly, LoanLength: NewLoanLength, InitialTime: {Month: NewInitialTime.Month, Day: NewInitialTime.Day, Year: NewInitialTime.Year}};
            let indexSearch = `Debts.${index}`;    //Concatenates the search string

            //DB
            const user = await usersCollection.updateOne(
                { _id: objectId},    //Search criteria
                {$set : {[indexSearch]: newDebt}}   //Pushing onto Debts Array new Debt
            );

            //Configure response and send JSON response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to edit debt";
            }
            else{          //If user was updated 
                Result = "Edited debt of user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error.message);
            res.status(500).json({Result: error.message});
        }
    });

    //EditSaving API
    //In: token, index, NewName, NewAmount, NewAPR, NewInitialTime
    //Out: Result
    app.post('/api/EditSaving', authenticateJWT, async (req,res) => {
        let Result = "Could not edit saving";
        try{
            //Input and Field Check
            const {index, NewName, NewAmount, NewAPR, NewInitialTime} = req.body;
            const {_id} = req.user;
            if (!_id|| index == undefined|| !NewName || !NewAmount || !NewAPR || !NewInitialTime){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId
            
            //Create objects for DB Statement
            let newSaving = {Name: NewName, Amount: NewAmount, APR: NewAPR, InitialTime: {Month: NewInitialTime.Month, Day: NewInitialTime.Day, Year: NewInitialTime.Year}};
            let indexSearch = `Savings.${index}`;    //Concatenates the search string

            //DB
            const user = await usersCollection.updateOne(
                { _id: objectId},    //Search criteria
                {$set : {[indexSearch]: newSaving}}   //Pushing onto Saving Array new saving
            );

            //Configure response and send JSON response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to edit savings";
            }
            else{          //If user was updated 
                Result = "Edited saving of user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error.message);
            res.status(500).json({Result: error.message});
        }
    });

    //EditExpense API
    //In: token, index, NewName, NewAmount, NewCategory, NewAccount, NewIfRecurring, NewInitialTime
    //Out: Result
    app.post('/api/EditExpense', authenticateJWT, async (req,res) => {
        let Result = "Could not edit expense";
        try{
            //Input and Field Checks
            const {index, NewName, NewAmount, NewCategory, NewIfRecurring, NewInitialTime} = req.body;
            const{_id} = req.user;
            if (!_id || index == undefined|| !NewName || !NewAmount || !NewCategory || NewIfRecurring == undefined || !NewInitialTime){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId
            
            //Create objects for DB Statement
            let newExpense = {Name: NewName, Amount: NewAmount, Category: NewCategory, IfRecurring: NewIfRecurring, InitialTime: {Month: NewInitialTime.Month, Day: NewInitialTime.Day, Year: NewInitialTime.Year}};
            let indexSearch = `Expenses.${index}`;    //Concatenates the search string
            
            //DB
            const user = await usersCollection.updateOne(
                { _id: objectId},    //Search criteria
                {$set : {[indexSearch]: newExpense}}   //Pushing onto Expenses Array new Expense
            );

            //Configure response and send JSON response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to edit expense";
            }
            else{          //If user was updated 
                Result = "Edited expense of user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({Result: error.message});
        }
    }); 

    //DeleteIncome API
    //In: token, index
    //Out: Result
    app.post('/api/DeleteIncome', authenticateJWT, async (req,res) => {
        let Result = "Could not delete income";
        try{
            //Input and Field Checks
            const {index} = req.body;
            const {_id} = req.user;            
            if (!_id|| index == undefined){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId
            const indexSearch = `Income.${index}`;

            //DB 
            let user = await usersCollection.updateOne(
                { _id: objectId },  //Search Criteria
                { $unset: { [indexSearch]: 1 } } // Unset the field at the index
            );
            user = await usersCollection.updateOne(
                { _id: objectId },  //Search Criteria
                { $pull: { Income: null } } // Remove null values after unset
            );

            //Configure response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to delete income";
            }
            else{          //If user was updated 
                Result = "Deleted income from user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error.message);
            res.status(500).json({Result: error.message});
        }
    });

    //DeleteDebt API
    //In: token, index
    //Out: Result
    app.post('/api/DeleteDebt', authenticateJWT, async (req,res) => {
        let Result = "Could not delete debt";
        try{
            //Input and Field Checks
            const {index} = req.body;
            const {_id} = req.user;            
            if (!_id|| index == undefined){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId
            const indexSearch = `Debts.${index}`;

            //DB 
            let user = await usersCollection.updateOne(
                { _id: objectId },  //Search Criteria
                { $unset: { [indexSearch]: 1 } } // Unset the field at the index
            );
            user = await usersCollection.updateOne(
                { _id: objectId },  //Search Criteria
                { $pull: { Debts: null } } // Remove null values after unset
            );

            //Configure response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to delete debt";
            }
            else{          //If user was updated 
                Result = "Deleted debt from user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error.message);
            res.status(500).json({Result: error.message});
        }
    });

    //DeleteSaving API
    //In: token, index
    //Out: Result
    app.post('/api/DeleteSaving', authenticateJWT, async (req,res) => {
        let Result = "Could not delete saving";
        try{
            //Input and Field Checks
            const {index} = req.body;
            const {_id} = req.user;            
            if (!_id|| index == undefined){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId
            const indexSearch = `Savings.${index}`;

            //DB 
            let user = await usersCollection.updateOne(
                { _id: objectId },  //Search Criteria
                { $unset: { [indexSearch]: 1 } } // Unset the field at the index
            );
            user = await usersCollection.updateOne(
                { _id: objectId },  //Search Criteria
                { $pull: { Savings: null } } // Remove null values after unset
            );

            //Configure response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to delete saving";
            }
            else{          //If user was updated 
                Result = "Deleted saving from user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error.message);
            res.status(500).json({Result: error.message});
        }
    });

    //DeleteExpense API
    //In: _token, index
    //Out: Result
    app.post('/api/DeleteExpense', authenticateJWT, async (req,res) => {
        let Result = "Could not delete expense";
        try{
            //Input
            const {index} = req.body;
            const {_id} = req.user;
            if (!_id || index == undefined){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId
            const indexSearch = `Expenses.${index}`;

            //DB 
            let user = await usersCollection.updateOne(
                { _id: objectId },  //Search Criteria
                { $unset: { [indexSearch]: 1 } } // Unset the field at the index
            );
            user = await usersCollection.updateOne(
                { _id: objectId },  //Search Criteria
                { $pull: { Expenses: null } } // Remove null values after unset
            );

            //Configure response
            if (user.matchedCount === 0) {          //If no user was updated
                Result = "Could not find user to delete expense";
            }
            else{          //If user was updated 
                Result = "Deleted expense from user";
            }

            //Send JSON response
            res.status(200).json({Result: Result});
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({Result: error.message});
        }
    });
    
    //ShowAllInfo API
    //In: token
    //Out: Result, User{FName, LName, Email, Password, InitialAmount, InitialDebt, Income[], Expenses[]}
    app.post('/api/ShowAllInfo', authenticateJWT, async (req,res) => {
        let Result = "Could not show all information";
        try{
            //Input and Field Check
            const {_id} = req.user;
            if (!_id){
                throw new Error("Invalid Input");
            }
            const objectId = new ObjectId(_id); // Convert string to ObjectId

            //DB Statement
            const user = await usersCollection.findOne(
                { _id: objectId}   //Search criteria
            );

            //Configure response and send JSON response
            if (!user) {          //If no user was found
                Result = "Could not find user to show";
            }
            else{          //If user was found
                Result = "Found user";
                res.status(200).json({Result: Result, User: user});
            }
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({Result: error.message});
        }
    });

    //DB Test API
    //Out: Whether DB connection was successful
    app.post('/api/DBTest', async (req, res) => {
        try {
            //DB Statement
            const collections = await db.listCollections().toArray();

            //Send JSON response
            res.status(200).json({Result: "✅ Connected to MongoDB!", Collections: collections.map(c => c.name) });
        } catch (error) {
            res.status(500).json({Result: "❌ Database connection failed", Error: error.message });
        }
    });

    //Test API
    app.post('/api/Test', (req, res) => {
        res.send("✅ API is working!");
    });
}