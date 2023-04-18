<template>
  <v-app class="container">
    <v-card class="card-container">
      <!-- Toggle Button Section -->
      <v-row class="card-row">
        <v-card-actions class="togglerContainer">
          <v-btn-toggle mandatory class="toggleBtnGroup">
            <v-btn :disabled="step === 1" text @click="step--" class="toggleBtn"
              >Login</v-btn
            >
            <v-btn :disabled="step === 2" text @click="step++" class="toggleBtn"
              >Register</v-btn
            >
          </v-btn-toggle>
        </v-card-actions>
      </v-row>

      <!-- Form Section -->
      <v-row class="formContainer">
        <!-- Login Section -->
        <v-window v-model="step" class="inputContainer">
          <v-window-item :value="1">
            <v-card-title>
              <div class="waviy">
                <span style="--i: 1">W</span>
                <span style="--i: 2">e</span>
                <span style="--i: 3">l</span>
                <span style="--i: 4">c</span>
                <span style="--i: 5">o</span>
                <span style="--i: 6">m</span>
                <span style="--i: 7">e</span>
                <span style="--i: 7">!</span>
              </div>
            </v-card-title>
            <v-form ref="logform">
              <!-- Login: Email Input -->
              <v-text-field
                label="Email"
                name="logEmail"
                id="logEmail"
                v-model="logEmail"
                typeof="email"
                :rules="[emailRequired, emailValidation]"
                :error-messages="loginEmailErrors"
                @keyup="clearLoginError"
                required
              ></v-text-field>

              <!-- Login: Password Input -->
              <v-text-field
                label="Password"
                type="password"
                name="logPassword"
                id="logPassword"
                v-model="logPassword"
                :rules="loginPasswordRules"
                :error-messages="loginPasswordErrors"
                @keyup="clearLoginError"
                error-count="1"
              ></v-text-field>

              <div class="btnGroup">
                <!-- Login Button -->
                <v-btn
                  @click="loginUser()"
                  class="gradientBtn color-1"
                  :loading="loading"
                  :disabled="loading"
                  >Login</v-btn
                >

                <!-- Fogot Password Button -->
                <v-btn
                  @click="showPasswordReset = true"
                  class="gradientBtn color-2"
                  >Forgot Password</v-btn
                >
              </div>

              <!-- Fogot Password Dialog Section -->
              <v-dialog v-model="showPasswordReset" max-width="290">
                <v-card>
                  <v-form ref="resetform" class="fogotDialog">
                    <!-- Fogot Password Dialog Title -->
                    <v-card-title>Password Reset</v-card-title>

                    <!-- Fogot Password: Email Input -->
                    <v-text-field
                      v-model="email"
                      label="Email"
                      typeof="email"
                      :rules="[emailRequired, emailValidation]"
                      class="resetEmail"
                    ></v-text-field>

                    <!-- Fogot Password Reset Button -->
                    <v-btn
                      @click="sendPasswordReset()"
                      class="gradientBtn color-4 resetBtn"
                      >Reset</v-btn
                    >
                  </v-form>
                </v-card>
              </v-dialog>

              <!-- Reset Password Dialog Section -->
              <v-dialog v-model="showResetSuccess" max-width="520">
                <v-card class="resetSuccess">
                  <!-- Reset Password Dialog Title -->
                  <v-card-title
                    >Check your registered email to reset the
                    password!</v-card-title
                  >

                  <!-- Reset Password Reset Button -->
                  <v-btn @click="showSuccess()" class="successBtn" color="info"
                    >Ok</v-btn
                  >
                </v-card>
              </v-dialog>

              <v-dialog v-model="showResetFail" max-width="340">
                <v-card class="resetSuccess">
                  <!-- Fail: Reset Password Dialog Title -->
                  <v-card-title>User not Found!</v-card-title>

                  <!-- Fail: Reset Password Reset Button -->
                  <v-btn @click="closeSuccess()" class="failBtn" color="warning"
                    >Close</v-btn
                  >
                </v-card>
              </v-dialog>
            </v-form>
          </v-window-item>

          <!-- Register Section -->
          <v-window-item :value="2">
            <v-form ref="regform">
              <!-- Register: Email Input -->
              <v-card-title>
                <div class="waviy">
                  <span style="--i: 1">R</span>
                  <span style="--i: 2">e</span>
                  <span style="--i: 3">g</span>
                  <span style="--i: 4">i</span>
                  <span style="--i: 5">s</span>
                  <span style="--i: 6">t</span>
                  <span style="--i: 7">e</span>
                  <span style="--i: 7">r</span>
                </div>
              </v-card-title>
              <v-text-field
                label="Email"
                name="regEmail"
                id="regEmail"
                v-model="regEmail"
                typeof="email"
                :rules="[emailRequired, emailValidation]"
                @keyup="clearRegisterError"
                :error-messages="emailRules"
                required
              ></v-text-field>

              <!-- Register: Username Input -->
              <v-text-field
                label="Username"
                name="username"
                id="username"
                v-model="username"
                :rules="usernameRules"
                error-count="1"
                required
              ></v-text-field>

              <!-- Register: Patreon Username Input -->
              <v-text-field
                label="Patreon Username"
                name="Patreon Username"
                id="patreonUsername"
                v-model="patreonUsername"
                :rules="patreonUsernameRules"
                error-count="1"
                typeof="email"
              ></v-text-field>

              <!-- Register: Password Input -->
              <v-text-field
                label="Password"
                name="password"
                id="password"
                v-model="regPassword"
                :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="() => (value = !value)"
                :type="value ? 'password' : 'text'"
                :rules="regPasswordRules"
                error-count="5"
                required
              >
              </v-text-field>

              <!-- Register: Confirm Password Input -->
              <v-text-field
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                v-model="confirmPassword"
                :rules="[confirmRequired, matchPasswords]"
              ></v-text-field>

              <!-- Register: Checkbox -->
              <v-checkbox
                v-model="checkbox"
                :rules="[(v) => !!v || 'You must agree to continue!']"
                label="I Agree to terms and conditions"
                required
              ></v-checkbox>

              <!-- Register Button -->
              <v-btn
                class="gradientBtn color-3"
                @click="newUser"
                :loading="loading"
                :disabled="loading"
                >Register</v-btn
              >

              <!-- Successfully Registerd Dialog Section -->
              <v-dialog v-model="dialog" width="auto">
                <v-card class="registerDialog">
                  <!-- Success Dialog Title -->
                  <v-card-title> You registered successfully </v-card-title>

                  <!-- Go to Login Button -->
                  <v-card-text>
                    <v-btn
                      color="primary"
                      class="gradientBtn color-4"
                      @click="goToLogin"
                    >
                      Go to Login
                    </v-btn>
                  </v-card-text>

                  <!-- Dialog Close Button -->
                  <v-card-actions>
                    <v-btn
                      variant="tonal"
                      @click="dialog = false"
                      style="width: 90%"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-form>
          </v-window-item>
        </v-window>
      </v-row>
    </v-card>
  </v-app>
</template>

<script>
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import auth from "../fb";
// import { collection, addDoc } from 'firebase/firestore/lite'
// import { doc, setDoc } from 'firebase/firestore/lite'
import { doc, setDoc } from "firebase/firestore";
import { db as fsdb } from "../fb";
import { storeUserDataLocal } from "../store/storeUsersInfo";
// import { clearHistory } from "../store/storeUsersInfo";

export default {
  data: () => ({
    current: "login",
    regEmail: "",
    email: "",
    username: "",
    regPassword: "",
    patreonUsername: "",
    confirmPassword: "",
    logEmail: "",
    logPassword: "",
    showPasswordReset: false,
    showResetSuccess: false,
    showResetFail: false,
    step: 1,
    loginEmailErrors: [],
    loginPasswordErrors: [],
    valid: true,
    value: true,
    checkbox: false,
    dialog: false,
    loading: false,

    // Email Rules
    emailRules: "",

    // Username Rules
    usernameRules: [
      (v) => !!v || "Username is required",
      (v) => (v && v.length >= 2) || "Username must have 2+ characters",
    ],

    // Patreon Username Rules
    patreonUsernameRules: [
      (v) => !!v || "Patreon Username is required",
      (v) => (v && v.length >= 2) || "Patreon Username must have 2+ characters",
    ],

    // Register Password Rules
    regPasswordRules: [
      (v) => !!v || "Password is required",
      (v) => (v && v.length >= 5) || "Password must have 5+ characters",
      (v) =>
        /(?=.*[A-Z])/.test(v) || "Password must have a uppercase character",
      (v) => /(?=.*\d)/.test(v) || "Password must have a number",
      (v) =>
        /([!@$%^&*()])/.test(v) || "Password must have a special character",
    ],

    // Login Passwrod Rules
    loginPasswordRules: [(v) => !!v || "Password is required"],
  }),

  methods: {
    // Email Required Validation
    emailRequired: function (value) {
      if (value) {
        return true;
      } else {
        return "Email is required";
      }
    },

    // Email Fomart Validation
    emailValidation: function (value) {
      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        return true;
      } else {
        return "Email is invaild";
      }
    },

    // Clear Register error Function
    clearRegisterError() {
      this.emailRules = "";
    },

    // Clear Login error Function
    clearLoginError() {
      this.loginEmailErrors = "";
      this.loginPasswordErrors = "";
    },

    // Confirm Password Validation
    confirmRequired: function (value) {
      if (value) {
        return true;
      } else {
        return "Confirm Password is required";
      }
    },

    // Match passwords Validation
    matchPasswords: function (value) {
      if (value == this.regPassword) {
        return true;
      } else {
        return "Passwords does not match";
      }
    },

    async newUser() {
      if (
        this.regEmail !== "" &&
        this.username !== "" &&
        this.patreonUsername !== "" &&
        this.regPassword !== "" &&
        this.confirmPassword !== "" &&
        this.checkbox == true
      ) {
        // return true;
        try {
          // Create a User Function
          await createUserWithEmailAndPassword(
            auth,
            this.regEmail,
            this.regPassword
          );

          // When Register Successed, Display the dialog
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.dialog = true;
          }, 3000);

          // this can only happen if the above worked correctly
          const cUser = auth.currentUser;
          if (cUser) {
            //read and generate users info
            const userInfo = {
              userEmail: this.regEmail,
              username: this.username,
              patreonUsername: this.patreonUsername,
              staff: false,
              investor: false,
              uid: cUser.uid, // need the user's id not the whole object
            };
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
              weightLb: 0,
            };

            const blankDoc = {
              blank: true,
            };
            //make a randomly generated doc ID
            // const userInfoCollection = collection(fsdb, 'userInfo'); // first get the collection you want to add to
            // await addDoc(userInfoCollection, userInfo);  // now add a document to that collection
            //test to see if I can set the get the doc ID to be set to change correctly
            await setDoc(doc(fsdb, "userInfo", cUser.uid), userInfo);
            await setDoc(doc(fsdb, "userData", cUser.uid), userData);
            await setDoc(
              doc(fsdb, "mealPlans", cUser.uid, "userMealPlan"),
              blankDoc
            );
          } else {
            console.error("No Authenticated User");
          }
        } catch (err) {
          // Register Validation via Firebase API
          switch (err.code) {
            case "auth/operation-not-allowed":
              // Display an error message for invalid email
              console.log("Not taking new users at this time");
              this.emailErrors = [
                "Not Taking Users At This Time Please Contact Admin",
              ];
              break;
            case "auth/email-already-in-use":
              // Display an error message, if the email already exist
              this.emailRules = "Email is already Exist";
              break;
            default:
              break;
          }
        }
      } else {
        await this.$refs.regform.validate();
      }
    },

    async loginUser() {
      if (this.logEmail !== "" && this.logPassword !== "") {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, this.logEmail, this.logPassword)
          .then(async (userCredential) => {
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
            }, 2000);
            const user = userCredential.user;
            await storeUserDataLocal(user.uid);
            var redirectionPath = localStorage.getItem("redirectPath");

            localStorage.setItem("isLogin", true);

            if (redirectionPath == null) {
              redirectionPath = "/";
            }
            this.$router.push(redirectionPath);
          })
          .catch((error) => {
            switch (error.code) {
              case "auth/user-not-found":
                this.loginEmailErrors = [
                  "Couldn't find your Email. Check the spelling and try again.",
                ];
                break;
              case "auth/wrong-password":
                this.loginPasswordErrors = ["Incorrect Password"];
                break;
              default:
                break;
            }
          });
      } else {
        await this.$refs.logform.validate();
      }
    },

    // Login Panel Trigger
    loginTrig() {
      this.current = "login";
    },

    // Register Panel Trigger
    regTrig() {
      this.current = "register";
    },

    // Password Reset Function
    sendPasswordReset() {
      if (this.email !== "") {
        const auth = getAuth();
        sendPasswordResetEmail(auth, this.email)
          .then(() => {
            this.user = {
              email: "",
            };
            this.showResetSuccess = true;
          })
          .catch((error) => {
            this.showResetFail = true;
            console.log(error);
          });
      } else {
        this.$refs.resetform.validate();
      }
    },

    showSuccess() {
      (this.showResetSuccess = false),
        (this.showPasswordReset = false),
        (this.email = "");
    },

    closeSuccess() {
      this.showResetFail = false;
    },

    goToLogin() {
      (this.dialog = false), this.step--;
    },
  },
};
</script>

<style>
/* Card Container Style */

.card-container {
  min-width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 100px auto 0px;
  border-radius: 15px !important;
}

.waviy {
  position: relative;
  -webkit-box-reflect: below -20px linear-gradient(transparent, rgba(0, 0, 0, 0.2));
  font-size: 35px;
  text-align: center;
}
.waviy span {
  font-family: "Alfa Slab One", cursive;
  position: relative;
  display: inline-block;
  color: rgba(0, 0, 0, 0.788);
  text-transform: normal;
  animation: waviy 2.1s infinite;
  animation-delay: calc(0.1s * var(--i));
}
@keyframes waviy {
  0%,
  40%,
  100% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-20px);
  }
}

.gradientBtn {
  width: 200px;
  font-size: 16px;
  font-weight: 600;
  color: #fff !important;
  cursor: pointer;
  height: 55px !important;
  text-align: center;
  border: none;
  background-size: 300% 100%;
  border-radius: 50px;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
  padding: 20px !important;
  display: block;
  margin: auto;
  margin-top: 20px;
}

.resetBtn {
  padding: 10px !important;
  width: 150px;
  height: 44px !important;
  margin-top: 10px;
}

.successBtn {
  margin-bottom: 15px;
  width: 30%;
}

.failBtn {
  margin-bottom: 15px;
  width: 40%;
}

.gradientBtn:hover {
  background-position: 100% 0;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

.gradientBtn:focus {
  background: #2cee71;
}

.gradientBtn.color-1 {
  background-image: linear-gradient(
    to right,
    #25aae1,
    #40e495,
    #30dd8a,
    #2bb673
  );
  box-shadow: 0 4px 15px 0 rgba(49, 196, 190, 0.75);
}

.gradientBtn.color-2 {
  background-image: linear-gradient(
    to right,
    #f5ce62,
    #e43603,
    #fa7199,
    #e85a19
  );
  box-shadow: 0 4px 15px 0 rgba(229, 66, 10, 0.75);
}

.gradientBtn.color-3 {
  background-image: linear-gradient(
    to right,
    #0ba360,
    #3cba92,
    #30dd8a,
    #2bb673
  );
  box-shadow: 0 4px 15px 0 rgba(23, 168, 108, 0.75);
}

.gradientBtn.color-4 {
  background-image: linear-gradient(
    to right,
    #25aae1,
    #4481eb,
    #04befe,
    #3f86ed
  );
  box-shadow: 0 4px 15px 0 rgba(65, 132, 234, 0.75);
}

.gradientBtn.color-5 {
  background-image: linear-gradient(
    to right,
    #25aae1,
    #4481eb,
    #04befe,
    #3f86ed
  );
  box-shadow: 0 4px 15px 0 rgba(65, 132, 234, 0.75);
}

.btnGroup {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.registerDialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Card-Row Style */
.card-row {
  width: 100%;
  margin: 20px 0px;
}

/* Toggler Container Style */
.togglerContainer {
  width: 100%;
}

/* Toggle Button Group Style */
.toggleBtnGroup {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* Top Toggle Login & Register Button Style */
.toggleBtn {
  min-width: 150px !important;
}

/* Form Container Style */
.formContainer {
  width: 95%;
}

/* Input Container Style */
.inputContainer {
  width: 100%;
  margin-bottom: 100px;
}

/* Login Button Style */

/* Fogot Password Button Style */
.fogotBtn {
  width: 100%;
  margin-top: 15px;
}

/* Fogot Password Dialog Style */
.fogotDialog {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* v-card_text Style */
.v-card__text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* v-input Style */
.v-input {
  width: 100%;
}

/* Container Style */
.container {
  box-sizing: border-box;
}

/* v-card_title Style */
.v-card__title {
  justify-content: center;
}

/* Password Reset Button Style */
.resetEmail {
  padding: 20px;
}

/* Password Reset Button Style */
.resetBtn {
  border-radius: 7px;
  padding: 15px;
  margin-bottom: 20px;
}

/* v-form Style */
.v-form {
  padding: 16px;
}

/* Register Button Style */
.registerBtn {
  width: 100%;
  margin-top: 10%;
  background-color: coral !important;
  color: #fff !important;
  border-radius: 7px;
  padding: 16px;
}

.resetSuccess {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media only screen and (max-width: 600px) {
  .hh {
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
