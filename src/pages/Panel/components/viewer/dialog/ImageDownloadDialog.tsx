import React, { useEffect, useMemo, useRef } from 'react';
import jsZip from 'jszip';
import useCollectionStore from '@/common/hooks/useCollectionStore';
import {
  useDialogEventStore,
  DialogEventType,
} from '@/common/store/useDialogEventStore';
import {
  BanIcon,
  CircleCheckIcon,
  CircleXIcon,
  DownloadIcon,
  FileArchiveIcon,
  ImageIcon,
  LogsIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import log from 'loglevel';
import { format } from 'date-fns';
import Common from '@/common/common';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DownloadState {
  isDownloading: boolean;
  successCount: number;
  errorCount: number;
  fileName?: string;
  errorContent: string[];
}

function ImageDownloadDialog() {
  const collection = useCollectionStore((state) => state.collection);

  const event = useDialogEventStore((state) => state.event);

  const resetDialogEvent = useDialogEventStore(
    (state) => state.resetDialogEvent
  );

  const [isOpen, setIsOpen] = React.useState(false);

  const [downloadState, setDownloadState] = React.useState<DownloadState>({
    isDownloading: false,
    successCount: 0,
    errorCount: 0,
    errorContent: [],
  });

  const imageItems = useMemo(() => {
    if (event == null || event.type !== DialogEventType.ImagesDownload) {
      return [];
    }

    return collection.items.filter((item) => item.type === 'image');
  }, [collection.items, event]);

  const isDownloadingRef = useRef(false);

  const handleonOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      resetDialogEvent();
    }
  };

  const downloadAllImages = async () => {
    // use ref to get current state
    if (isDownloadingRef.current) {
      return;
    }

    setDownloadState({
      isDownloading: true,
      successCount: 0,
      errorCount: 0,
      fileName: undefined,
      errorContent: [],
    });

    // Set the ref to true to indicate downloading has started
    isDownloadingRef.current = true;

    let zip = new jsZip();

    for (const item of imageItems) {
      if (!isDownloadingRef.current) {
        log.debug('[ImageDownloadDialog] Download cancelled by user');
        break;
      }

      log.debug(`[ImageDownloadDialog] Downloading image: ${item.content}`);

      try {
        let pathFileName = new URL(item.content).pathname
          .split('/')
          .pop()
          ?.split('.');

        let createTime = `${format(item.createTime, 'yyyy-MM-dd-HH-mm-ss')}`;

        let name = `${createTime}`;

        if (pathFileName != null && pathFileName.length > 1) {
          name = `${pathFileName[0]}-${createTime}`;
        }

        let res = await fetch(item.content, {});

        let blob = await res.blob();
        let extension = Common.getExtensionByContentType(blob.type);

        if (!extension) {
          extension = '.jpg'; // fallback extension
        }

        zip.file(`${name}${extension}`, blob, { base64: true });

        setDownloadState((prev) => ({
          ...prev,
          successCount: prev.successCount + 1,
        }));
      } catch (error) {
        log.error(error);

        setDownloadState((prev) => ({
          ...prev,
          errorCount: prev.errorCount + 1,
          errorContent: [
            ...prev.errorContent,
            `Failed to download image: ${item.content}`,
          ],
        }));
      }
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const fileName = `${collection.name}-${format(
      Date.now(),
      'yyyy-MM-dd-HH-mm-ss'
    )}`;

    const href = await URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + '.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadState((prev) => ({
      ...prev,
      isDownloading: false,
      fileName: fileName + '.zip',
    }));
  };

  const handleCanncelDownload = () => {
    setDownloadState((prev) => ({
      ...prev,
      isDownloading: false,
    }));
  };

  useEffect(() => {
    if (event == null || event.type !== DialogEventType.ImagesDownload) {
      return;
    }

    if (event.collectionId !== collection.id) {
      return;
    }

    setIsOpen(true);
    setDownloadState({
      isDownloading: false,
      successCount: 0,
      errorCount: 0,
      fileName: undefined,
      errorContent: [],
    });
  }, [collection.id, event]);

  const errorList = () => {
    if (downloadState.errorContent.length === 0) {
      return null;
    }

    return (
      <Accordion type="single" collapsible>
        <AccordionItem value="error">
          <AccordionTrigger>Error Logs</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-72 rounded-md border text-start">
              <div className="p-4">
                {downloadState.errorContent.map((error, index) => (
                  <p
                    key={index}
                    className="py-1 text-sm text-muted-foreground wrap-anywhere"
                  >
                    {error}
                  </p>
                ))}
              </div>
            </ScrollArea>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={() => {
                navigator.clipboard.writeText(
                  downloadState.errorContent.join('\n')
                );
              }}
            >
              <LogsIcon />
              Copy Error Logs
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  useEffect(() => {
    isDownloadingRef.current = downloadState.isDownloading;
  }, [downloadState]);

  if (event == null || event.type !== DialogEventType.ImagesDownload) {
    return null;
  }

  const content = () => {
    const itemCount = downloadState.errorCount + downloadState.successCount;

    // If downloading is in progress
    if (downloadState.isDownloading) {
      return (
        <div className="py-10 grid items-center gap-4 text-center">
          <p className="text-lg font-semibold">Downloading Images...</p>

          <div className="flex gap-4 justify-center items-center text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CircleCheckIcon />
              {downloadState.successCount} Successful
            </span>
            <span className="flex items-center gap-2">
              <CircleXIcon />
              {downloadState.errorCount} Failed
            </span>
            <span className="flex items-center gap-2">
              <ImageIcon />
              {imageItems.length} Total
            </span>
          </div>

          <Progress value={(itemCount / imageItems.length) * 100} />

          {errorList()}

          <div className="flex justify-around">
            <Button
              className="w-1/2"
              variant="outline"
              onClick={handleCanncelDownload}
            >
              <BanIcon />
              <span>Cancel</span>
            </Button>
          </div>
        </div>
      );
    }

    // Finished
    if (!downloadState.isDownloading && itemCount > 0) {
      return (
        <div className="py-10 grid items-center gap-4 text-center">
          <p className="text-lg font-semibold">Download completed</p>

          <div className="flex gap-4 justify-center items-center text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CircleCheckIcon />
              {downloadState.successCount} Successful
            </span>
            <span className="flex items-center gap-2">
              <CircleXIcon />
              {downloadState.errorCount} Failed
            </span>
          </div>
          {downloadState.fileName && (
            <div className="flex gap-4 justify-center items-center text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <FileArchiveIcon />
                {downloadState.fileName}
              </span>
            </div>
          )}

          {errorList()}
        </div>
      );
    }

    // Not started
    if (!downloadState.isDownloading) {
      return (
        <div className="py-10 grid items-center gap-4 text-center">
          <p className="text-lg font-semibold">
            Found {imageItems.length} images in this collection
          </p>
          <p className="text-sm text-muted-foreground">
            Some images may not be downloaded in Firefox due to Firefox's CORS
            security policy. For more information, see{' '}
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-600"
            >
              Mozilla's CORS documentation
            </a>
            . For best results, try downloading images in Chrome.
          </p>

          {imageItems.length > 0 && (
            <div className="flex justify-around mt-4">
              <Button className="w-1/2" onClick={downloadAllImages}>
                <DownloadIcon />
                Download All
              </Button>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleonOpenChange}>
      <DialogContent
        className="w-full max-w-2xl"
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Download Images</DialogTitle>
          <DialogDescription>
            Download all images in this collection as a zip file.
          </DialogDescription>
        </DialogHeader>
        {content()}
        {!downloadState.isDownloading && (
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ImageDownloadDialog;
