import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const { toast } = useToast();

  const handleNewPost = () => {
    toast({
      title: "Coming soon!",
      description: "Creating new posts will be available once we integrate with Supabase.",
    });
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-vent-primary to-vent-secondary bg-clip-text text-transparent">
              Ventify
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Button
            onClick={handleNewPost}
            className="bg-vent-primary hover:bg-vent-primary/90"
          >
            New Post
          </Button>
        </div>
      </div>
    </nav>
  );
};