import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills || [],
    file: null,
  });

  // ✅ Handle input changes
  const changeEventHandler = (e) => {
    const { name, value } = e.target;

    if (name === "skills") {
      setInput({
        ...input,
        skills: value.split(","),
      });
    } else {
      setInput({
        ...input,
        [name]: value,
      });
    }
  };

  // ✅ Handle file upload
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  // ✅ Submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills.join(",")); // ✅ FIXED

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await axios.post(
        `${USER_API_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        // window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4">

            {/* FULL NAME */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Name</Label>
              <Input
                name="fullname"   // ✅ FIXED
                value={input.fullname}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            {/* EMAIL */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Email</Label>
              <Input
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            {/* PHONE */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Number</Label>
              <Input
                name="phoneNumber"   // ✅ FIXED
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            {/* BIO */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Bio</Label>
              <Input
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            {/* SKILLS */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Skills</Label>
              <Input
                name="skills"
                value={input.skills.join(",")}   // ✅ FIXED
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="React, Node, Java"
              />
            </div>

            {/* FILE */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Resume</Label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={fileChangeHandler}
                className="col-span-3"
              />
            </div>

          </div>

          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Update
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;