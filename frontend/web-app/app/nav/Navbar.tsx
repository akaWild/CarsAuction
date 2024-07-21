import { AiOutlineCar } from "react-icons/ai";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex justify-between p-5 items-center text-gray-800 bg-white shadow-md">
      <div className="flex items-center gap-2 text-3xl font-semibold text-red-500">
        <AiOutlineCar size={34} />
        <div>Car Auction</div>
      </div>
      <div>Search</div>
      <div>Login</div>
    </header>
  );
}

export default Navbar;
