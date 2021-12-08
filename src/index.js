import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  //setting real time listener with snapshot
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  //firebase 9 queries
  query, where,
  orderBy,serverTimestamp,
  getDoc, updateDoc
} from "firebase/firestore";
import{
  getAuth,
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged

} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAW2FMsehsF04gtpY0tirX_KGCAWYYmqaE",
  authDomain: "fir-final-fcc9e.firebaseapp.com",
  projectId: "fir-final-fcc9e",
  storageBucket: "fir-final-fcc9e.appspot.com",
  messagingSenderId: "200369162294",
  appId: "1:200369162294:web:421205dff94d140755b097",
};

//intiliaze firebase app
initializeApp(firebaseConfig);

//init services
const db = getFirestore();
const auth = getAuth();
//collection references
const colRef = collection(db, "books");

//queries
//where function does inquire what is to be queried
const q = query(
  colRef,
  orderBy('createdAt')
);

// real time get collection data
// getDocs(colRef)
//   .then((snapshot) => {
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

//real time data collection
const unsubCol =onSnapshot(q, (snapshot) => {
  let books = [];
  
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });

  console.log(books);
});

// adding docs
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt:serverTimestamp()
  })
  .then(() => {
    addBookForm.reset();
  });
});
//   addDoc(colRef, {
//     title: addBookForm.title.value,
//     author: addBookForm.author.value,
//   })
//   .then(() => {
//     addBookForm.reset()
//   })
// })

// deleting docs
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get ref to deoc to delete
  const docRef = doc(db, "books", deleteBookForm.id.value);

  //call the delete function
  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

//getting a single doc
const docRef = doc(db, 'books', '6Dtdi4ekbgAIn1UszuWC' )

 const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
  })

  //updating a doc
  const updateForm = document.querySelector(".update");
  updateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const docRef = doc(db, 'books', updateForm.id.value)

    updateDoc(docRef, {
      title: 'updated title'
    })
    .then(() => {
      updateForm.reset();
    })


  })

  //signing up users

  const signupForm = document.querySelector('.signup')
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        //console.log('user created:', cred.user)
        signupForm.reset()
      })

      //when there is an error
      .catch((err) => {
        console.log(err.message)
    
  })
})

//logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {

  //signing user out
  signOut(auth)
    .then(() => {
      //console.log('user signed out')
    })
    .catch((err) => 
    console.log(err.message))

})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  //signing the user in

  signInWithEmailAndPassword(auth, email, password )
     .then((cred) => {
      // console.log('user logged in:', cred.user)
     })
     .catch((err) => {
       console.log(err.message)
     } 

     )
    })

    //subscribibg to auth chnge
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      console.log('user status changed:',user)

    })

    //unsubscribing from changes (auth and db)
    const unsubButton = document.querySelector('.unsub')
    unsubButton.addEventListener('click', () => {
    console.log('unsubscribing')
    unsubAuth()
    unsubCol()
    unsubDoc()
    })