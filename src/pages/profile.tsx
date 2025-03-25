import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Card from "../shared/card/Card.tsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog.tsx";
import { toast } from "sonner";

//import { ThreeDots } from "react-loader-spinner";
import { useLoadingBar } from "react-top-loading-bar";

import axios from "axios";
axios.defaults.withCredentials = true;

function Profile() {
  const prod_api = "https://mini-social-media-backend.onrender.com/api";
  //const dev_api = "http://localhost:9999/api";

  const { start, complete } = useLoadingBar({
    color: "white",
    height: 4,
  });

  const navigate = useNavigate();
  const [posts, setPost] = useState([]);
  const [image, setImage] = useState(null);
  const [edit_data, setEditData] = useState(null);
  const [show_loading, setLoading] = useState(false);
  const [user_data, setUser] = useState({
    username: null,
  });

  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => {
    setImage(null);
    setIsOpen(true);
  };
  const closeDialog = () => setIsOpen(false);

  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const openDialogEdit = (data) => {
    setEditData(data);
    setImage(data?.image);
    setIsOpenEdit(true);
  };
  const closeDialogEdit = () => {
    setIsOpenEdit(false);
    setImage(null);
  };

  function navigate_to_home() {
    navigate("/");
  }

  async function fetch_data() {
    try {
      start();
      const res = await axios.get(`${prod_api}/post/by-user`);
      setPost(res?.data?.data);
      complete();
    } catch (error) {
      complete();
      if (error?.response?.status == 401) {
        toast.error(error?.response?.data?.message);
        navigate_to_home();
        complete();
      }
    }
  }

  async function auth_check() {
    try {
      const res = await axios.get(`${prod_api}/auth-check`);
      setUser(res?.data?.user_data);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetch_data();
    auth_check();
  }, []);

  async function update(formData) {
    try {
      start();
      const title = formData.get("title");
      const content = formData.get("content");

      const res = await axios.put(`${prod_api}/post?_id=${edit_data?._id}`, {
        title: title,
        content: content,
        image: image,
      });
      toast.success(res?.data?.message);
      closeDialogEdit();
      fetch_data();
      setImage(null);
      complete();
    } catch (error) {
      closeDialogEdit();
      complete();
      toast.error(error?.response?.data?.message);
    }
  }

  async function remove(id: string) {
    try {
      start();
      const res = await axios.delete(`${prod_api}/post`, {
        params: {
          _id: id,
        },
      });
      complete();
      toast.success(res?.data?.message);
      fetch_data();
    } catch (error) {
      complete();
      toast.error(error?.response?.data?.message);
    }
  }

  async function create_post(formData) {
    try {
      start();
      const title = formData.get("title");
      const content = formData.get("content");

      const res = await axios.post(`${prod_api}/post`, {
        title: title,
        content: content,
        image: image,
      });
      toast.success(res?.data?.message);
      complete();
      fetch_data();
      closeDialog();
      setImage(null);
    } catch (error) {
      complete();
      closeDialog();
      //console.log(error);
      toast.error(error?.response?.data?.message);
      setImage(null);
      closeDialog();
    }
  }

  async function file_upload(event) {
    try {
      start();
      setLoading(true);
      const file = event.target.files[0];
      setImage(file);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${prod_api}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImage(res?.data?.result);
      setEditData((prev) => ({
        ...prev,
        image: res?.data?.result,
      }));
      setLoading(false);
      complete();
      toast.success("file uploaded successfully");
    } catch (error) {
       complete();
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  }

  function on_delete(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        remove(id);
      }
    });
  }

  function on_logout() {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Log out!",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  }

  async function logout() {
    try {
      start();
      const res = await axios.get(`${prod_api}/auth/logout`);
      toast.success(res?.data?.message);
      navigate_to_home();
      complete();
    } catch (error) {
      complete();
      console.log(error);
    }
  }

  return (
    <>
      <div className="container mx-auto px-10 py-10">
        <p className="text-white text-center text-2xl py-10 font-semibold">
          USER POST
        </p>

        <div className="flex justify-between">
          <div className="flex gap-5">
            <div>
              <Button
                variant="destructive"
                onClick={openDialog}
                className="cursor-pointer"
              >
                Add Post
              </Button>
            </div>

            <Button
              onClick={navigate_to_home}
              className="cursor-pointer"
              variant="outline"
            >
              Home
            </Button>
          </div>
          <div className="flex gap-3 items-center">
            <p className="text-white px-2">Username : {user_data?.username}</p>
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={on_logout}
            >
              Log Out
            </Button>
          </div>
        </div>

        <div className="grid gap-10  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-5">
          {posts && posts.length > 0 ? (
            posts.map((item) => (
              <Card
                key={item._id}
                image={item.image?.url}
                title={item.title}
                description={item.content}
                show_action={true}
                on_delete={() => on_delete(item._id)}
                on_edit={() => openDialogEdit(item)}
              />
            ))
          ) : (
            <p className="text-center text-white py-10 text-2xl font-semibold">
              No USER POST FOUND
            </p>
          )}
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Post</DialogTitle>
            </DialogHeader>
            <form action={create_post}>
              <div className="py-1">
                <Input
                  type="file"
                  name="file"
                  onChange={file_upload}
                  className="mt-2"
                  required
                />
              </div>
              <div className="py-1">
                <Input
                  type="text"
                  placeholder="Enter Title...."
                  name="title"
                  required
                ></Input>
              </div>
              <div className="py-1">
                <Input
                  type="text"
                  placeholder="Enter Content...."
                  name="content"
                  className="mt-2"
                  required
                ></Input>
              </div>
              <Button
                type="submit"
                className="w-full mt-3 cursor-pointer"
                variant="destructive"
                disabled={show_loading}
              >
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isOpenEdit} onOpenChange={setIsOpenEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>
            <form action={update}>
              <div className="h-30 w-full overflow-hidden rounded-md">
                <img
                  src={edit_data?.image?.url}
                  className="w-full h-full object-cover"
                ></img>
              </div>

              <div className="py-1">
                <Input
                  type="file"
                  name="file"
                  onChange={file_upload}
                  className="mt-2"
                />
              </div>
              <div className="py-1">
                <Input
                  type="text"
                  placeholder="Enter Title...."
                  name="title"
                  defaultValue={edit_data?.title}
                  required
                ></Input>
              </div>
              <div className="py-1">
                <Input
                  type="text"
                  placeholder="Enter Content...."
                  name="content"
                  className="mt-2"
                  defaultValue={edit_data?.content}
                  required
                ></Input>
              </div>
              <Button
                type="submit"
                className="w-full mt-3 cursor-pointer"
                variant="destructive"
                disabled={show_loading}
              >
                Edit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default Profile;
