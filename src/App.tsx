import React, { useState } from "react";
import AccountData from "./components/AccountSection/AccountData";
import Footer from "./components/Footer";
import Menu from "./components/Menu/Menu";
import TasksSection from "./components/TasksSection/TasksSection";
import ModalCreateTask from "./components/Utilities/ModalTask";
import { Task } from "./interfaces";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { modalActions } from "./store/Modal.store";
import { tasksActions } from "./store/Tasks.store";
import { initializeApp, getApp, FirebaseError } from "firebase/app";
import { config } from "./config/config";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { ToastContainer } from "react-toastify"




const app =initializeApp(config.firebaseConfig);
const db = getFirestore(app)


interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

const App: React.FC = () => {
  const modal = useAppSelector((state) => state.modal);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSigningUp, setIsSigningUp] = useState(false);

  const dispatch = useAppDispatch();

  const closeModalCreateTask = () => {
    dispatch(modalActions.closeModalCreateTask());
  };

  const logout = () => {
    signOut(getAuth())
      .then(() => {
        setIsLoggedIn(false);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createNewTaskHandler = (task: Task) => {
    dispatch(tasksActions.addNewTask(task));
  };

  const auth = getAuth();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);

  const signInWithGoogle = async () => {
    setAuthing(true);

    signInWithPopup(auth, new GoogleAuthProvider())
      .then((response) => {
        console.log(response.user.uid);
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.log(error);
        setAuthing(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(form).some((field) => field === "")) {
      toast("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast("Your passwords do not match");
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      console.log("Sign Up Successful");
      setIsLoggedIn(true);

      // const docRef = doc(db, "users", user.uid);

      // const userDoc = await getDoc(docRef);

      // if (!userDoc.exists()) {
      //   await setDoc(docRef, {
      //     userId: user.uid,
      //     email: form.email,
      //     userImg: "",
      //     bio: "",
      //   });
      //   // Navigate("/");
      // }
    } catch (error) {
      console.log((error as Error).message);
      setAuthing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form["email"] === "" || form["password"] === "") {
      toast("Input email and password");
    }

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      // navigate("/homepage");
      console.log("User has been logged in");
      // toast("User has been logged in");
      setIsLoggedIn(true);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.log(error.message);
        setAuthing(false);
      }
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        {
          isSigningUp ? (
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              
              <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}> 
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={handleChange}
                    />
                  </div>
                </div>
          
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={handleChange}
                    />
                  </div>
                </div>
    
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Confirm Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={handleChange}
                    />
                  </div>
                </div>
    
                <div> 
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign up
                  </button>
                </div>
              </form>
    
              <p className="mt-10 text-center text-sm/6 text-gray-500">
                Already a member?
                <button
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                  onClick={() => setIsSigningUp(false)}
                >
                  Login
                </button>
                <ToastContainer />
              </p>
            </div>) :(
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                
              <form className="space-y-6" action="#" method="POST" onSubmit={handleLogin}> 
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={handleChange}
                    />
                  </div>
                </div>
          
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      onChange={handleChange}
                    />
                  </div>
                </div>
    
                <div> 
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Login
                  </button>
                </div>
              </form>
    
              <p className="mt-10 text-center text-sm/6 text-gray-500">
                Not a member?
                <button
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                  onClick={() => setIsSigningUp(true)}
                >
                  Sign up
                </button>
                <ToastContainer />
              </p>
            </div>
            )
        }
        <div className="px-6 sm:px-0 max-w-sm">
          <button
            type="button"
            className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2"
            onClick={() => signInWithGoogle()}
            disabled={authing}
          >
            <svg
              className="mr-2 -ml-1 w-4 h-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Sign in with Google<div></div>
          </button>
        </div>
      </div>
    );
  } else
    return (
      <div className="bg-slate-200 min-h-screen text-slate-600 dark:bg-slate-900 dark:text-slate-400 xl:text-base sm:text-sm text-xs">
        {modal.modalCreateTaskOpen && (
          <ModalCreateTask
            onClose={closeModalCreateTask}
            nameForm="Add a task"
            onConfirm={createNewTaskHandler}
          />
        )}
        <Menu />
        <button onClick={() => signOut(auth)}>Sign out of Firebase</button>
        <TasksSection />
        <Footer />
        <AccountData logout={logout} />
      </div>
    );
};

export default App;
