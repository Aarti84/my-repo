import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import ENV from '../config.js';
import otpGenerator from 'otp-generator';


/** middleware for verify user */
export async function verifyUser(req, res, next) {
    try {
        let username;

        // Check if the request method is GET and extract username from query, else from body
        if (req.method === "GET") {
            username = req.query.username;
          //  console.log("username",username);
        } else {
            username = req.body.username;
            //console.log("username",username);
        }

        // Check if username is provided
        if (!username) {
            return res.status(400).send({ error: "Username is missing in the request." });
        }

        // Check the user existence
        const user = await UserModel.findOne({ username });
     //   console.log("user",user);
        if (!user) {
            return res.status(404).send({ error: "User not found." });
        }

        // User exists, continue to the next middleware or route handler
        next();
    } catch (error) {
    //  console.error('Error in verifyUser:', error);
        return res.status(500).send({ error: "Internal Server Error." });
    }
}


/** the request body and link for register API-
 *  POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
**/
// export async function register(req,res){
//     try {
//         const { username, password, profile, email } = req.body;


//         const existUsername = new Promise((resolve, reject) => {
//             UserModel.findOne({ username }).then((err,user) => {
//                 if(err) reject(new Error(err))
//                 if(user) reject({ error: "Please use unique username"});

//                 resolve();
//             }).catch(err => reject({error: "Exist username findone error"}));
//         });



//         const existEmail = new Promise((resolve, reject) => {
//             UserModel.findOne({ email }).then((err,email) => {
//                 if(err) reject(new Error(err))
//                 if(email) reject({ error: "Please use unique email"});

//                 resolve();
//             }).catch(err => reject({error: "exist username findone error"}));
//         });


//         Promise.all([existUsername, existEmail])
//             .then(() => {
//                 if(password){
//                     bcrypt.hash(password,10)
//                     .then( hashedPassword => {

//                         const user = new UserModel({
//                             username,
//                             password: hashedPassword,
//                             profile: profile || '',
//                             email
                        
//                         });

//                         //return save result as a response 
//                         user.save()
//                         .then(result => res.status(201).send({msg: "User Registered Succesfully"}))
//                         .catch(error => res.status(500).send({ error: "User already exists" }))

//                     }).catch(error => {
//                         return res.status(500).send({
//                             error : "Enable to hashed password"
//                         })
//                     })
//                 }
//             }).catch(error => {
//                 return res.status(500).send({ error })
//             })

//     } catch (error) {
//         return res.status(500).send(error);
//     }

// }

// export async function register(req, res) {
//     try {
//         const { username, password, profile, email } = req.body;

//         // Check if the username already exists
//         const existingUsername = await UserModel.findOne({ username });
//         if (existingUsername) {
//             return res.status(400).json({ error: "Please use a unique username" });
//         }

//         // Check if the email already exists
//         const existingEmail = await UserModel.findOne({ email });
//         if (existingEmail) {
//             return res.status(400).json({ error: "Please use a unique email" });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const user = new UserModel({
//             username,
//             password: hashedPassword,
//             profile: profile || '',
//             email,
//         });

//         // Save the user to the database
//         const result = await user.save();

//         res.status(201).json({ msg: "User Registered Successfully", result });
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }


export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body;

        // Check if username already exists
        const existingUsername = await UserModel.findOne({ username });
        if (existingUsername) {
            return res.status(409).send({ error: "Please use a unique username" });
        }

        // Check if email already exists
        const existingEmail = await UserModel.findOne({ email });
        if (existingEmail) {
            return res.status(409).send({ error: "Please use an unique email" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document
        const newUser = new UserModel({
            username,
            password: hashedPassword,
            profile: profile || '',
            email
        });

        // Save the user to the database
        await newUser.save();
        
        // Send success response
        return res.status(201).send({ msg: "User Registered Successfully" });
    } catch (error) {
       // console.error("Error in registration:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}



/** the request body and link for login API-
 * POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req,res){



    const { username, password } = req.body;

    try {
        
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) return res.status(400).send({ error: "Wrong Password"});

                        // create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        username : user.username
                                    }, ENV.JWT_SECRET , { expiresIn : "24h"});

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            username: user.username,
                            token
                        });                                    

                    })
                    .catch(error =>{
                        return res.status(400).send({ error: "Password does not Match"})
                    })
            })
            .catch( error => {
                return res.status(404).send({ error : "Username not Found"});
            })

    } catch (error) {
        return res.status(500).send({ error});
    }
}




/** GET : http://localhost:8080/api/user/example123 */
export async function getUser(req,res){
    const { username } = req.params;

    try {
        if (!username) {
            return res.status(400).send({ error: "Invalid Username" });
        }
        
        UserModel.findOne({ username })
            .then((user) => {
                if (!user) {
                    return res.status(404).send({ error: "User Not Found" });
                }

                /** Remove password from the user */
                // mongoose return unnecessary data with object so convert it into json
                const { password, ...rest } = Object.assign({}, user.toJSON());

                return res.status(200).send(rest);
            })
            .catch((err) => {
                // console.error("Error finding user:", err);
                return res.status(500).send({ error: "Internal Server Error" });
            });
            
            
    }catch (error) {
        return res.status(500).send({ error});
    }
}



/** the request body and link for updateUser API- 
 * PUT: http://localhost:8080/api/updateuser 
 * @param: {
"id" : "<userid>"
}
body: {
  firstName: '',
  address : '',
  profile : ''
}
*/
export async function updateUser(req,res){
    try {
        console.log(req)
        console.log(res)
        // const id = req.query.id;
        const { userId } = req.user;

        if(userId){
            const body = req.body;

            // update the data
            UserModel.updateOne({ _id: userId }, body)
            .then(result => {
                if (result.nModified === 0) {
                    // Handle the case where no document was modified
                    return res.status(404).send({ error: "User Not Found" });
                }
        
                // Handle success
                return res.status(201).send({ msg: "Record Updated...!" });
            })
            .catch(err => {
                // Handle errors
                //  console.error("Error updating user:", err);
                return res.status(500).send({ error: "Error updating user:" });
            });
        
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
     req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars:false })
     res.status(201).send({ code: req.app.locals.OTP })
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verified Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}

//redirect user when OTP is invalid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){

    if(req.app.locals.resetSession){
    req.app.locals.resetSession = false;
    return res.status(201).send({flag: req.app.locals.resetSession});
   }
   return res.status(440).send({error : "Session expired!"})
}




//update the password whenever the user has a valid session(OTP)
/** PUT: http://localhost:8080/api/resetPassword */
export const resetPassword = async (req, res) => {
    try {
     
        const { username, password } = req.body;

        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: "Username not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.updateOne({ username: user.username }, { password: hashedPassword });

        req.app.locals.resetSession = false; // Reset session
        return res.status(201).send({ msg: "Record updated successfully" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ error: "Internal server error" });
    }
};