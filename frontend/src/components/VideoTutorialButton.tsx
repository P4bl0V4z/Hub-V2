
import { useState } from "react";
import BeLoopIcon from "@/components/BeLoopIcons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VideoTutorialButtonProps {
  title: string;
  videoSrc?: string;
  description?: string;
}

const VideoTutorialButton = ({ title, videoSrc = "https://www.youtube.com/embed/dQw4w9WgXcQ", description }: VideoTutorialButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm shadow-sm border-primary/20 hover:bg-primary/10"
        onClick={() => setOpen(true)}
      >
        <BeLoopIcon name="play" className="mr-1" size={16} />
        <span>Tutorial</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            {description && <p className="text-muted-foreground mb-4">{description}</p>}
            <div className="aspect-video w-full">
              <iframe
                src={videoSrc}
                className="w-full h-full rounded-md"
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoTutorialButton;
