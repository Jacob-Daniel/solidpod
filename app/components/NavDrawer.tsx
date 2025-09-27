"use client";
import React, { useEffect, useRef } from "react";
import { useVisibility, VisibilityProvider } from "@/lib/VisibilityContext";
import List from "@/app/components/List";
import { FaXmark, FaBars } from "react-icons/fa6";
import { INavigationItems } from "@/lib/types";
import { useHandleDomClick } from "@/lib/clientFunctions";

// Drawer component
const Drawer: React.FC<{ id: string; children: React.ReactNode }> = ({
  id,
  children,
}) => {
  const { visible, setVisible } = useVisibility();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A") {
      setVisible(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setVisible(false)}
      />

      {/* Drawer */}
      <div
        data-id={id}
        onClick={handleClick}
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-neutral-200 shadow-lg z-50 p-5 transform transition-transform duration-300 ease-in-out
          ${visible ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {children}
      </div>
    </>
  );
};

// Container
const Container: React.FC<{
  id: string;
  display: string;
  children: React.ReactNode;
}> = ({ id, display, children }) => {
  const ref = useHandleDomClick(id);
  return (
    <div className={`drawer-wrapper z-50 md:fixed`} ref={ref}>
      {children}
    </div>
  );
};

// BarsIcon
const BarsIcon: React.FC<{ id: string }> = ({ id }) => {
  const { setVisible } = useVisibility();
  return (
    <FaBars
      className={`absolute md:!hidden text-black text-[1.9rem] top-[20px] end-5`}
      onClick={() => setVisible(true)}
    />
  );
};

// DrawerCloseButton

// NavDrawer
const NavDrawer: React.FC<{
  id: string;
  nav: INavigationItems;
  user: INavigationItems;
  display: string;
}> = ({ nav, id, display, user }) => {
  return (
    <VisibilityProvider>
      <Container id={id} display={display}>
        <BarsIcon id={id} />
        <Drawer id={id}>
          {/*<DrawerCloseButton />*/}
          <List nav={nav} user={user} type="mobile" />
        </Drawer>
      </Container>
    </VisibilityProvider>
  );
};

export default NavDrawer;
