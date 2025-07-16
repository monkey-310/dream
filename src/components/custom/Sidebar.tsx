"use client";

import { Routes } from "@/routes/Routes";
import { HomeIcon, PieChart, UserIcon } from "lucide-react";
import Link from "next/link";

const navLinks: any = [
  {
    icon: <UserIcon color="black" className="h-5 w-5" />,
    text: "User List",
    ref: Routes.UserList,
  },
];
export const Sidebar = () => {
  return (
    <div className="sticky top-0 h-screen">
      <ul className="flex flex-col items-center justify-start h-full">
        {navLinks.map((navElement: any, index: any) => {
          return (
            <Link
              key={index}
              href={navElement.ref}
              className={`flex items-center w-full p-4 hover:bg-primary-light cursor-pointer`}
            >
              <span className="flex-shrink-0">{navElement.icon}</span>
              <p className=" text-black ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 whitespace-nowrap ease-linear text-sm">
                {navElement.text}
              </p>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};
