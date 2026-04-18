import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTabel from "./AppliedJobTabel";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  console.log("PROFILE DATA:", user?.profile);

  if (!user) return null; // ✅ prevent early render

  return (
    <div>
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
        
        {/* HEADER */}
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
                alt="profile"
              />
            </Avatar>

            <div>
              <h1 className="font-medium text-xl">{user.fullname}</h1>
              <p>{user?.profile?.bio || "No bio added"}</p>
            </div>
          </div>

          <Button
            onClick={() => setOpen(true)}
            variant="outline"
          >
            <Pen />
          </Button>
        </div>

        {/* CONTACT */}
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>{user.phoneNumber}</span>
          </div>
        </div>

        {/* SKILLS */}
        <div className="my-5">
          <h1>Skills</h1>
          <div className="flex items-center gap-1 flex-wrap">
            {user?.profile?.skills?.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <Badge key={index}>{item}</Badge>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>

        {/* RESUME */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-md font-bold">Resume</Label>

          {user?.profile?.resume ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={user.profile.resume}
              className="text-blue-500 hover:underline"
            >
              {user.profile.resumeOriginalName || "View Resume"}
            </a>
          ) : (
            <span>NA</span>
          )}
        </div>
      </div>

      {/* APPLIED JOBS */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl">
        <h1 className="font-bold text-lg my-5">Applied Job</h1>
        <AppliedJobTabel />
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;