<template>
    <v-app class="container">
        <!-- make a box in the middle of the screen -->
        <v-card  class="hh">
            <v-row style="width:100%; margin: 20px 0px">
                <!-- toggle buttons with the login in or register buttons
                exclusives toggle -->
                <v-card-actions style="width:100%">
                    <v-btn-toggle
                    mandatory
                    style="width:100%; display: flex; justify-content: center;">
                        <v-btn
                        :disabled="step === 1"
                        text
                        @click="step--"
                        style="min-width:150px">Login</v-btn>
                        <v-btn
                        :disabled="step === 2"
                        text
                        @click="step++"
                        style="min-width:150px">Register</v-btn>    
                    </v-btn-toggle>
                </v-card-actions>
            </v-row>
            <v-row style="width: 95%; ">
                <v-window
                v-model="step" style="width: 100%;margin-bottom: 100px;">
                    <!-- make the login in options  -->
                    <!-- make sure the to put the staff options in the bottom corner -->
                    <v-window-item
                    :value="1">
                        <v-card-text>
                            <v-text-field
                            label="Email"
                            name="logEmail"
                            id="logEmail"
                            v-model="logEmail"
                            typeof="email"
                            :error-messages="loginEmailErrors"
                            required
                            ></v-text-field>
                            <v-text-field
                            label="Password"
                            type="password"
                            name="logPassword"
                            id="logPassword"
                            v-model="logPassword"
                            :error-messages="loginPasswordErrors"
                            ></v-text-field>
                            <v-btn @click="loginUser()" style="width: 100%; margin-top: 20px; background-color: coral; color: #fff; border-radius: 7px; padding: 15px 0px;">Login</v-btn>
                            <v-btn class="text-button" @click="showPasswordReset = true">Forgot Password</v-btn>
                            <v-dialog v-model="showPasswordReset" max-width="290">
                                <v-card>
                                    <!-- Button to close the pop-up card -->
                                    <v-card-title>Password Reset</v-card-title>
                                    <v-text-field v-model="email" label="Email" type="email"></v-text-field>
                                    <v-btn @click="sendPasswordReset()">Reset</v-btn>
                                </v-card>
                            </v-dialog>
                        </v-card-text>
                    </v-window-item>
                    <!-- make the register options -->
                    <v-window-item
                    :value="2">
                        <v-card-text>
                            <v-text-field
                            label="Email"
                            name="regEmail"
                            id="regEmail"
                            v-model="regEmail"
                            typeof="email"
                            :error-messages="emailErrors"
                            required
                            ></v-text-field>
                            <v-text-field
                            label="Username"
                            name="username"
                            id="username"
                            v-model="username"
                            required
                            ></v-text-field>
                            <v-text-field
                            label="Patreon Username"
                            name="Patreon Username"
                            id="patreonUsername"
                            v-model="patreonUsername"
                            typeof="email"
                            ></v-text-field>
                            <v-text-field
                            label="Password"
                            type="password"
                            name="password"
                            id="password"
                            v-model="regPassword"
                            :error-messages="passwordErrors"
                            required
                            ></v-text-field>
                            <v-text-field
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            v-model="confirmPassword"
                            :rules="[comparePasswords]"
                            ></v-text-field>
                            <!-- <v-checkbox
                            v-model="checkbox"
                            required
                            >I Agree to terms and conditions</v-checkbox> -->
                            <v-btn
                            @click="newUser()" style="width: 100%; margin-top: 20px; background-color: coral; color: #fff; border-radius: 7px; padding: 15px 0px;">Register</v-btn>
                        </v-card-text>
                    </v-window-item>
                </v-window>
            </v-row>
        </v-card>
    </v-app>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth"
import auth from '../fb'
// import { collection, addDoc } from 'firebase/firestore/lite'
// import { doc, setDoc } from 'firebase/firestore/lite'
import { doc, setDoc } from 'firebase/firestore'
import { db as fsdb } from '../fb'
import { storeUserDataLocal } from '../store/storeUsersInfo'
import { clearHistory } from '../store/storeUsersInfo'

export default {

    data: () => ({
        current: "login",
        regEmail: "",
        username: "",
        regPassword:"",
        patreonUsername:"",
        confirmPassword:"",
        logEmail:"",
        logPassword: "",
        showPasswordReset: false,
        step: 1,
        emailErrors: [],
        passwordErrors: [],
        loginEmailErrors: [],
        loginPasswordErrors: [],

    }),
    computed:{
        comparePasswords(){
            console.log("comparing passwords")
            console.log(this.regPassword)
            console.log("to")
            console.log(this.confirmPassword)
            return this.regPassword !== this.confirmPassword ? 'Password do not match' : ''
        }
    },
    methods:{
        async newUser(){  // added async here as we need to add some await's below
            console.log({email: this.regEmail, password: this.regPassword, confirmPassword: this.confirmPassword, username: this.username, patreonUsername: this.patreonUsername})
            try{
                await createUserWithEmailAndPassword(auth, this.regEmail, this.regPassword); // need to add await here as this is an async function and we can't proceed until this is done

                // this can only happen if the above worked correctly
                const cUser = auth.currentUser
                if (cUser) {
                    //read and generate users info
                    const userInfo = {
                        userEmail: this.regEmail,
                        username: this.username,
                        patreonUsername: this.patreonUsername,
                        staff: false,
                        investor: false,
                        uid: cUser.uid // need the user's id not the whole object
                    }
                    //generate starting information
                    const userData = {
                        activeDaysPerWeek: 0,
                        age: 25,
                        calorieTarget: 0,
                        carbsGrams: 0,
                        carbsRatio: 45,
                        fatGrams: 0,
                        fatRatio: 25,
                        goal: "Maintence",
                        heightF: 0,
                        maintenceTarget: 0,
                        protienGrams: 0,
                        proteinRatio: 30,
                        sex: "Male",
                        weightLb: 0
                    }

                    const blankDoc = {
                        blank: true
                    }
                    //make a randomly generated doc ID
                    // const userInfoCollection = collection(fsdb, 'userInfo'); // first get the collection you want to add to
                    // await addDoc(userInfoCollection, userInfo);  // now add a document to that collection
                    //test to see if I can set the get the doc ID to be set to change correctly
                    await setDoc(doc(fsdb, 'userInfo', cUser.uid), userInfo);
                    await setDoc(doc(fsdb, 'userData', cUser.uid), userData);
                    await setDoc(doc(fsdb, 'mealPlans', cUser.uid, 'userMealPlan'), blankDoc);
                } else {
                  console.error('no authenticated user');
                }
            }catch(err){
                console.log(err);
                switch (err.code) {
                    case 'auth/invalid-email':
                        // Display an error message for invalid email
                        this.emailErrors = ['Invalid Email'];
                        console.log('invalid email');
                        break;
                    case 'auth/internal-error':
                        // Display an error message for invalid email
                        console.log('not all the parameters are filled out');
                        this.passwordErrors = ['Password Required'];
                        break;
                    case 'auth/missing-email':
                        // Display an error message for invalid email
                        console.log('There is no email');
                        this.emailErrors = ['Email Required'];
                        break;
                    case 'auth/weak-password':
                        // Display an error message for invalid email
                        console.log('The password is not strong enough');
                        this.passwordErrors = ['Weak Is Password'];
                        break;
                    case 'auth/operation-not-allowed':
                        // Display an error message for invalid email
                        console.log('not taking new users at this time');
                        this.emailErrors = ['Not Taking Users At This Time Please Contact Admin'];
                        break;
                    case 'auth/email-already-in-use':
                        // Display an error message for invalid email
                        console.log('email already is in use');
                        this.emailErrors = ['Email Currently In User'];
                        break;
                    default:
                        console.log('This is a different error');
                        this.emailErrors = ['Unknown Error: Please Contact Admin'];
                        break;
                }
            }
        },
        async loginUser(){
            console.log({email: this.logEmail, password: this.logPassword})
            const auth = getAuth();
            signInWithEmailAndPassword(auth, this.logEmail, this.logPassword)
            .then((userCredential) => {
                // Signed in 
                //clear the previous history
                console.log('trying to clear history');
                clearHistory();
                const user = userCredential.user;
                console.log({uid: user.uid});
                storeUserDataLocal(user.uid);
                console.log('after new stored data');
                console.log(console.log(sessionStorage.getItem('activeDaysPerWeek')));
                //set the user name as well as any other information that needs to be moved
                // ...
                // let redirect_url = this.$router.query.redirect || '/'
                var redirectionPath =sessionStorage.getItem('redirectPath');
                console.log('redirection path')
                console.log(redirectionPath)
                if (redirectionPath == null) {
                    redirectionPath = '/'
                }
                this.$router.push(redirectionPath);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                switch (error.code) {
                    case 'auth/invalid-email':
                        this.loginEmailErrors = ['Incorrect Email']
                        break;
                    case 'auth/wrong-password':
                        this.loginPasswordErrors = ['Incorrect Password']
                        break;
                    default:
                        break;
                }
            });
        },
        onSignup (){
            console.log({email: this.email, password: this.password, confirmPassword: this, username: this.username, patreonUsername: this.patreonUsername})
        },
        loginTrig() {
            this.current = "login"
        },
        regTrig(){
            this.current = "register"
        },
        sendPasswordReset () {
            const auth = getAuth();
            sendPasswordResetEmail(auth, this.email)
                .then(() => {
                // Password reset email sent successfully
                })
                .catch((error) => {
                // Error occurred
                console.log(error)
                })
        }
    }

}
</script>

<style>
.container{
    box-sizing: border-box;
}
.hh{
    /* background: black; */
    /* box-sizing: border-box; */

   min-width: 500px;
    
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   margin: 30px auto 0px;

   
}

@media only screen and (max-width: 600px) {
 .hh{
    /* background: black; */
    /* box-sizing: border-box; */

   min-width: 90%;
    
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
   margin: 30px auto 0px;

   
}
}
</style>