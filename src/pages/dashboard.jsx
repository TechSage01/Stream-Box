import { useState } from "react";
import { auth } from "../firebase";
import logoutmodal from "../components/logoutmodal";

const dashboard = () => {
    const user = auth.currentUser;
    console.log(user);
    

  return (
    <div>
        {user?.username}
    </div>
  )
}

export default dashboard