import Link from "next/link";

const Nav = () => {
  return (
    <nav>
      <div className="nav-logo">
        <Link href="/">Silhouette</Link>
      </div>
      <div className="nav-links">
        <Link href="/">Index</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  );
};

export default Nav;
