import { send } from "../utilities";

export async function getUserId() {
  let userId = localStorage.getItem("userId");

  if (userId == null) {
    return null;
  }

  let verified = await send("verifyUserId", userId);

  if (!verified) {
    return null;
  }

  return userId;
}