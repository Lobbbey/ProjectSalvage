const { ObjectId } = require('mongodb');

exports.setApp = function ( app, client )
{
    const db = client.db('SalvageFinancialDB');
    const usersCollection = db.collection('Users');

    //Login API
    //In: Email, Password
    //Out: Result, _id
    app.post('/api/Login', async (req, res) =>{
        let Result = "Could not find login";
        try {
            //Input
            const {Email, Password} = req.body;

            //If all input fields are not given
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
                res.status(200).json({Result: Result, _id: -1});
            }
            else{   //If user does match
                Result = "Found user";
                res.status(200).json({Result: Result, _id: user._id});
            }       
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({Result: Result});
        }
    });
    
    //Signup API
    //In: FName, LName, Email, Password
    //Out: Result
    app.post('/api/Signup', async (req, res) =>{
        let Result = "Could not add user";
        try {
            //Input
            const {FName, LName, Email, Password} = req.body;
            const newUser = {FName: FName, LName: LName, Email: Email, Password: Password};     //Making New User Object

            //If all input fields are not given
            if (!FName || !LName || !Email || !Password){
                throw new Error("Invalid Input");
            }
              
            //DB Statement
            const user = await usersCollection.findOne(
                { Email: Email },   //Search criteria
            );

            //Configure response
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
            res.status(500).json({Result: Result});
        }
    });

    //ResetPassword API
    //In: Email, NewPassword
    //Out: Result
    app.post('/api/ResetPassword', async (req,res) => {
        let Result = "Could not reset password";
        try{
            //Input
            const {Email, NewPassword} = req.body;
            
            //If all input fields are not given
            if (!Email || !NewPassword){
                throw new Error("Invalid Input");
            }

            //DBStatement
            const user = await usersCollection.updateOne(
                {Email: Email}, 
                {$set: {Password: NewPassword}}
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
            res.status(500).json({Result: Result});
        }
    });

    //AddInitial API
    //In: _id, InitialDebt, InitialAmount
    //Out: Result
    app.post('/api/AddInitial', async (req,res) => {
        let Result = "Could not add amount and debt";
        try{
            //Input
            const {_id, InitialDebt, InitialAmount} = req.body;
            const objectId = new ObjectId(_id); // Convert string to ObjectId

            //If all input fields are not given
            if (!_id || !InitialDebt || !InitialAmount){
                throw new Error("Invalid Input");
            }

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
            res.status(500).json({Result: Result});
        }
    });

    //AddIncome API
    //In: _id, Name, Amount, IfReccuring, InitialTime, TimeFrame
    //Out: Result
    app.post('/api/AddIncome', async (req,res) => {
        let Result = "Could not add income";
        try{
            //Input
            const {_id, Name, Amount, IfReccuring, InitialTime, TimeFrame} = req.body;
            const objectId = new ObjectId(_id); // Convert string to ObjectId
            let newIncome = {};

            //If all input fields are not given
            if (!_id || !Name || !Amount || !IfReccuring){
                throw new Error("Invalid Input");
            }
            else{
                if (!InitialTime || !TimeFrame){
                    newIncome = {Name: Name, Amount: Amount, IfReccuring: IfReccuring};
                }
                else{
                    newIncome = {Name: Name, Amount: Amount, IfReccuring: IfReccuring, InitialTime: InitialTime, TimeFrame: TimeFrame};
                }
            }

            //DB 
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
            res.status(500).json({Result: Result});
        }
    });

    //AddExpense API
    //In: _id, Name, Category, Amount, IfReccuring, InitialTime, TimeFrame
    //Out: Result
    app.post('/api/AddExpense', async (req,res) => {
        let Result = "Could not add expense";
        try{
            //Input
            const {_id, Name, Amount, Category, IfReccuring, InitialTime, TimeFrame} = req.body;
            const objectId = new ObjectId(_id); // Convert string to ObjectId
            let newExpense = {};

            //If all input fields are not given
            if (!_id || !Name || !Amount || !Category || !IfReccuring){
                throw new Error("Invalid Input");
            }
            else{
                if (!InitialTime || !TimeFrame){
                    newExpense = {Name: Name, Amount: Amount, Category: Category, IfReccuring: IfReccuring};
                }
                else{
                    newExpense = {Name: Name, Amount: Amount, Category: Category, IfReccuring: IfReccuring, InitialTime: InitialTime, TimeFrame: TimeFrame};
                }
            }

            //DB 
            const user = await usersCollection.updateOne(
                { _id: objectId},    //Search criteria
                {$push : {Expenses: newExpense}}   //Pushing onto Expenses Array new Expense
            );

            //Configure response
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
            res.status(500).json({Result: Result});
        }
    });

    
    //EditIncome API
    //In: _id, index, NewName, NewAmount, NewIfReccuring, NewInitialTime, NewTimeFrame
    //Out: Result
    app.post('/api/EditIncome', async (req,res) => {
        let Result = "Could not edit income";
        try{
            //Input
            const {_id, index, NewName, NewAmount, NewIfReccuring, NewInitialTime, NewTimeFrame} = req.body;
            const objectId = new ObjectId(_id); // Convert string to ObjectId
            const newIncome = {Name: NewName, Amount: NewAmount, IfReccuring: NewIfReccuring, InitialTime: NewInitialTime, TimeFrame: NewTimeFrame};

            let indexSearch = `Income.${index}`;
            console.log(indexSearch);

            //If all input fields are not given
            if (!_id || !index || !NewName || !NewAmount || !NewIfReccuring){
                throw new Error("Invalid Input");
            }

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
            console.error("❌ Error:", error);
            res.status(500).json({Result: Result});
        }
    });

    //EditExpense API
    //In: _id, index, NewName, NewAmount, NewCategory, NewIfReccuring, NewInitialTime, NewTimeFrame
    //Out: Result
    app.post('/api/EditExpense', async (req,res) => {
        let Result = "Could not edit expense";
        try{
            //Input
            const {_id, index, NewName, NewAmount, NewCategory, NewIfReccuring, NewInitialTime, NewTimeFrame} = req.body;
            const objectId = new ObjectId(_id); // Convert string to ObjectId
            const newExpense = {Name: NewName, Amount: NewAmount, Category: NewCategory, IfReccuring: NewIfReccuring, InitialTime: NewInitialTime, TimeFrame: NewTimeFrame};

            let indexSearch = 'Expenses.${index}';
            console.log(indexSearch);

            //If all input fields are not given
            if (!_id || !index || !NewName || !NewAmount || !NewCategory || !NewIfReccuring){
                throw new Error("Invalid Input");
            }

            //DB
            const user = await usersCollection.updateOne(
                { _id: objectId},    //Search criteria
                {$set : {indexSearch: newExpense}}   //Pushing onto Income Array new Income
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
            res.status(500).json({Result: Result});
        }
    }); 

    //DeleteIncome API
    //In: _id, index
    //Out: Result
    app.post('/api/DeleteIncome', async (req,res) => {
        let Result = "Could not delete income";
        try{
            //Input
            const {_id, index} = req.body;
            const objectId = new ObjectId(_id); // Convert string to ObjectId

            //If all input fields are not given
            if (!_id || !index){
                throw new Error("Invalid Input");
            }

            //DB 
            const user = await usersCollection.updateOne(
                { _id: objectId},    //Search criteria
                {$spliceArray : {Income: [index, 1]}}   //Income to delete by name
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
            console.error("❌ Error:", error);
            res.status(500).json({Result: Result});
        }
    });

    //DeleteExpense API
    //In: _id, index
    //Out: Result
    app.post('/api/DeleteExpense', async (req,res) => {
        let Result = "Could not delete expense";
        try{
            //Input
            const {_id, index} = req.body;
            const objectId = new ObjectId(_id); // Convert string to ObjectId

            //If all input fields are not given
            if (!_id || !index){
                throw new Error("Invalid Input");
            }

            //DB 
            const user = await usersCollection.updateOne(
                { _id: objectId},    //Search criteria
                {$spliceArray : {Expenses: [index, 1]}}   //Income to delete by name
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
            res.status(500).json({Result: Result});
        }
    });
    
    //ShowAllInfo API
    //In: _id
    //Out: Result, User{FName, LName, Email, Password, InitialAmount, InitialDebt, Income[], Expenses}
    app.post('/api/ShowAllInfo', async (req,res) => {
        let Result = "Could not show all information";
        try{
            //Input
            const {_id} = req.body;
            const objectId = new ObjectId(_id); // Convert string to ObjectId

            //If all input fields are not given
            if (!_id){
                throw new Error("Invalid Input");
            }

            //DB 
            const user = await usersCollection.findOne(
                { _id: objectId}   //Search criteria
            );

            //Configure response and send JSON response
            if (user.matchedCount === 0) {          //If no user was found
                Result = "Could not find user to show";
            }
            else{          //If user was found
                Result = "Found user";
                res.status(200).json({Result: Result, User: user});
            }
        } catch (error) {
            console.error("❌ Error:", error);
            res.status(500).json({Result: Result});
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