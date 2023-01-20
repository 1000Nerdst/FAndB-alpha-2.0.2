// import * as firebase from 'firebase'

// mutations:{
//     setUser (state, payload){
//         state.user = payload
//     }
// }
// actions:{
//     signUserUp({commit}, payload){
//         firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
//             .then(
//                 user => {
//                     const newUser = {
//                         id: user.uid,
//                         patreonUsername: ''
//                     }
//                     commit('setUser', newUser)
//                 }
//             )
//             .catch(
//                 error =>{
//                     console.log(error)
//                 }
//                 )
//     }
// }
