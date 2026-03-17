"use client";

import React from "react";
import { FaXmark, FaBars } from "react-icons/fa6";
import List from "@/app/components/List";
import { INavigationItems } from "@/lib/types";
import { useVisibility, VisibilityProvider } from "@/lib/VisibilityContext";
import { useHandleDomClick } from "@/lib/clientFunctions";

/* =========================
   Drawer
========================= */

const Drawer: React.FC<{
  id: string;
  children: React.ReactNode;
}> = ({ id, children }) => {
  const { visible, setVisible } = useVisibility();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // Close if clicking any link inside
    if (target.closest("a")) {
      setVisible(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setVisible(false)}
      />

      {/* Drawer panel */}
      <div
        data-id={id}
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
        }}
        className={`fixed top-0 left-0 h-full w-3/4 max-w-xs pt-12 px-3 bg-neutral-100 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </div>
    </>
  );
};

/* =========================
   Container (outside click hook)
========================= */

const Container: React.FC<{
  id: string;
  children: React.ReactNode;
}> = ({ id, children }) => {
  const ref = useHandleDomClick(id);

  return (
    <div ref={ref} className="drawer-wrapper z-50 md:fixed">
      {children}
    </div>
  );
};

/* =========================
   Open Button (Bars)
========================= */

const BarsButton: React.FC = () => {
  const { setVisible } = useVisibility();
  const IconBars = FaBars as unknown as React.FC;
  return (
    <button
      aria-label="Open menu"
      onClick={() => setVisible(true)}
      className="absolute md:!hidden text-black text-[1.9rem] top-[20px] end-5"
    >
      <IconBars />
    </button>
  );
};

/* =========================
   Close Button (X)
========================= */

const CloseButton: React.FC = () => {
  const { setVisible } = useVisibility();
  const IconXmark = FaXmark as unknown as React.FC;

  return (
    <button
      aria-label="Close menu"
      onClick={() => setVisible(false)}
      className="absolute top-4 right-4 text-black text-2xl"
    >
      <IconXmark />
    </button>
  );
};

/* =========================
   NavDrawer (Main Export)
========================= */

const NavDrawer: React.FC<{
  id: string;
  nav: INavigationItems;
  user: INavigationItems;
}> = ({ id, nav, user }) => {
  return (
    <VisibilityProvider>
      <Container id={id}>
        <BarsButton />

        <Drawer id={id}>
          <CloseButton />
          <List nav={nav} user={user} type="mobile" />
        </Drawer>
      </Container>
    </VisibilityProvider>
  );
};

export default NavDrawer;
