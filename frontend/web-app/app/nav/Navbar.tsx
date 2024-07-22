import Search from "./Search";
import Logo from "./Logo";
import LoginButton from "./LoginButton";
import { getCurrentUser } from "../actions/authActions";
import UserActions from "./UserActions";

async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 flex justify-between p-5 items-center text-gray-800 bg-white shadow-md">
      <Logo />
      <Search />
      {user ? <UserActions user={user} /> : <LoginButton />}
    </header>
  );
}

export default Navbar;
