import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getUserApps } from "@/actions/user-apps";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import { Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { deleteApp } from "@/actions/delete-app";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface UserApp {
  id: string;
  name: string;
  description: string;
  gitRepo: string;
  createdAt: Date;
  permissions: string | null;
}

interface UserAppsProps {
  initialData?: UserApp[];
}

export function UserApps({ initialData = [] }: UserAppsProps) {
  const queryClient = useQueryClient();
  const [appToDelete, setAppToDelete] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["userApps"],
    queryFn: getUserApps,
    initialData,
  });

  const deleteAppMutation = useMutation({
    mutationFn: async (appId: string) => {
      return toast.promise(deleteApp(appId), {
        loading: "Deleting project...",
        success: "Project deleted successfully",
        error: "Failed to delete project",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userApps"] });
    },
    onError: (error) => {
      console.error("Failed to delete project:", error);
    },
  });

  const handleDeleteClick = (e: React.MouseEvent, appId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setAppToDelete(appId);
    // Close the dropdown when opening the dialog
    setOpenDropdownId(null);
  };

  const confirmDelete = () => {
    if (appToDelete) {
      deleteAppMutation.mutate(appToDelete);
    }
    setAppToDelete(null);
  };

  const handleDropdownOpenChange = (open: boolean, appId: string) => {
    if (open) {
      setOpenDropdownId(appId);
    } else {
      setOpenDropdownId(null);
    }
  };

  return (
    <>
      <Dialog
        open={appToDelete !== null}
        onOpenChange={(open) => !open && setAppToDelete(null)}
      >
        <DialogContent onPointerDownOutside={() => setAppToDelete(null)}>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all of its associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAppToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center px-8">
        {data.map((app) => (
          <Card
            key={app.id}
            className="p-4 border-b border rounded-md relative group"
          >
            <div className="absolute right-2 top-2 z-10">
              <DropdownMenu
                open={openDropdownId === app.id}
                onOpenChange={(open) => handleDropdownOpenChange(open, app.id)}
              >
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer flex items-center gap-2"
                    onClick={(e) => handleDeleteClick(e, app.id)}
                    disabled={
                      deleteAppMutation.isPending &&
                      deleteAppMutation.variables === app.id
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Link
              href={`/app/${app.id}`}
              className="cursor-pointer block h-full"
            >
              <CardHeader className="pl-0">
                <CardTitle>{app.name}</CardTitle>
                <CardDescription>
                  Created {new Date(app.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>
    </>
  );
}
