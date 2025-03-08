import Image from "next/image";

const Navbar = () => {
  return (
    // white for now
    <nav className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-lg shadow-md px-6 py-3 flex items-center">
      <div></div>
      <div>
        <Image src="/logo_big.png" alt="Logo" width={120} height={40} />
      </div>
    </nav>
  );
};

export default Navbar;