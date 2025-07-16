"use client";

import { signOutAction } from "@/actions/user-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Routes } from "@/routes/Routes";
import { useUserStore } from "@/stores/useUserStore";
import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfileHeader() {
  const router = useRouter();

  const onSignOut = async () => {
    await signOutAction();
    router.push(Routes.Login);
  };

  const { email, displayName = "", profileUrl, userRole } = useUserStore();

  return (
    <div className="flex items-center rounded-full bg-gray-50 shadow-md p-1.5 border border-gray-100">
      {/* User Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 flex items-center gap-2 rounded-full pl-1 pr-2 ml-1"
          >
            <Avatar className="h-7 w-7 border-2 border-white shadow-sm">
              <AvatarImage src={profileUrl} alt={email} />
              <AvatarFallback className="bg-[#DB5461] text-white text-xs">
                {email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-sm">
              <span className="font-medium leading-none text-xs">{email}</span>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{email}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {userRole}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/*<DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>*/}
          <DropdownMenuItem className="cursor-pointer " onClick={onSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
