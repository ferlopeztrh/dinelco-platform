import { DesktopHeader } from "./desktop-header";
import { MobileHeader } from "./mobile-header";

export const Header = () => {
  return (
    <header className="w-full bg-transparent fixed top-0 z-50" role="banner">
      <div className="hidden md:block">
        <DesktopHeader />
      </div>
      <div className="md:hidden">
        <MobileHeader />
      </div>
    </header>
  );
};
