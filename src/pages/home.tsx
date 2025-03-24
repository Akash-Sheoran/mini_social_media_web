import Card from "../shared/card/Card.tsx";
//import Button from "../shared/button/Button.tsx";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { useEffect } from "react";
//modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog.tsx";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import { toast } from "sonner";

import axios from "axios";
axios.defaults.withCredentials = true;

//import { useState } from 'react';

function Home() {
  const navigate = useNavigate();

  const prod_api = "https://mini-social-media-backend.onrender.com/api";
  //const dev_api = "http://localhost:9999/api";

  const [posts, setPost] = useState([]);
  const [logged_in, setLogged_in] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);

  const closeDialog = () => setIsOpen(false);
  const closeDialogLogin = () => setIsOpenLogin(false);

  function route_to_profile() {
    //console.log("working ??");
    navigate("/profile");
  }

  async function sign_up(formData) {
    //console.log(formData);
    const username = formData.get("username");
    const password = formData.get("password");
    // console.log(username, "-----", password);

    if (!username || !password) {
      toast.warning("All Fields are required");
      return;
    }

    try {
      const res = await axios.post(`${prod_api}/auth/signup`, {
        username,
        password,
      });

      toast.success(res?.data?.message);
      closeDialog();
    } catch (error) {
     
      toast.error(error?.response?.data?.message);
    }
  }

  async function login(formData) {
    const username = formData.get("username");
    const password = formData.get("password");
    // console.log(username, "-----", password);

    if (!username || !password) {
      toast.warning("All Fields are required");
      return;
    }

    try {
      const res = await axios.post(`${prod_api}/auth/login`, {
        username,
        password,
      });

      toast.success(res?.data?.message);
      closeDialogLogin();
      route_to_profile();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    
    }
  }

  async function fetch_data() {
    try {
      const res = await axios.get(`${prod_api}/post`);
      setPost(res?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function auth_check() {
    try {
      const res = await axios.get(`${prod_api}/auth-check`);
      setLogged_in(res?.data?.logged_in);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetch_data();
    auth_check();
  }, []);

  // fetch_data();

  return (
    <>
      <div className="container mx-auto px-10 py-10">
        <div>
          <p className="text-center text-white py-10 text-2xl font-semibold">
            DAILY POST
          </p>

          {/* <Button name="Log In" action={random} /> */}

          {logged_in ? (
            <Button
              onClick={route_to_profile}
              className="cursor-pointer"
              variant="destructive"
            >
              My Profile
            </Button>
          ) : (
            <div className="flex align-center gap-5">
              <div>
                <Dialog open={isOpenLogin} onOpenChange={setIsOpenLogin}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="cursor-pointer">Log In</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Log In</DialogTitle>
                    </DialogHeader>
                    <form action={login}>
                      <div className="py-1">
                        <Input
                          type="text"
                          placeholder="Enter Username...."
                          name="username"
                          required
                        ></Input>
                      </div>
                      <div className="py-1">
                        <Input
                          type="text"
                          placeholder="Enter Password...."
                          name="password"
                          className="mt-2"
                          required
                        ></Input>
                      </div>
                      <Button
                        type="submit"
                        className="w-full mt-3 cursor-pointer"
                        variant="destructive"
                      >
                        Log In
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="cursor-pointer">Sign Up</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Sign up</DialogTitle>
                    </DialogHeader>
                    <form action={sign_up}>
                      <div className="py-1">
                        <Input
                          type="text"
                          placeholder="Enter Username...."
                          name="username"
                          required
                        ></Input>
                      </div>
                      <div className="py-1">
                        <Input
                          type="text"
                          placeholder="Enter Password...."
                          name="password"
                          className="mt-2"
                          required
                        ></Input>
                      </div>
                      <Button
                        type="submit"
                        className="w-full mt-3 cursor-pointer"
                        variant="destructive"
                      >
                        Sign up
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}

          <div className="grid gap-10  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-5">
            {posts && posts.length > 0 ? (
              posts.map((item) => (
                <Card
                  key={item._id}
                  image={item.image?.url}
                  title={item.title}
                  description={item.content}
                  show_action={false}
                  on_delete={null}
                  on_edit={null}
                />
              ))
            ) : (
              <p className="text-center text-white py-10 text-2xl font-semibold">
                NO POST FOUND
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
